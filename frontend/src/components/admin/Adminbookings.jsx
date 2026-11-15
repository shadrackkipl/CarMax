import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiSearch,
  FiTool,
  FiTrash2,
} from "react-icons/fi";
import { adminApi, asList } from "../staff/Staffapi";
import {
  Banner,
  ConfirmDialog,
  Modal,
  PageHeader,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./Adminui";

const STATUSES = [
  { id: "new", label: "New", tone: "bg-blue-50 text-blue-700 ring-blue-200" },
  { id: "confirmed", label: "Confirmed", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { id: "completed", label: "Completed", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
  { id: "cancelled", label: "Cancelled", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
];

const TABS = [{ id: "all", label: "All" }, ...STATUSES];

const statusOf = (id) => STATUSES.find((item) => item.id === id) || STATUSES[0];

const StatusBadge = ({ status }) => {
  const { label, tone } = statusOf(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>
      {label}
    </span>
  );
};

// Today in Nairobi, as YYYY-MM-DD
const todayInNairobi = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

// 0712345678 or +254712345678 -> 254712345678 (for wa.me links)
const toWhatsAppNumber = (value) => {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9 && /^[17]/.test(digits)) return `254${digits}`;
  return digits;
};

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        weekday: "short",
        year: "numeric",
      })
    : "Flexible";

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-KE", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });

// Small label that helps spot bookings for today or the next few days
const dateHint = (booking) => {
  if (!booking.preferred_date || ["completed", "cancelled"].includes(booking.status)) return null;
  const today = todayInNairobi();
  if (booking.preferred_date === today) return { text: "Today", tone: "text-blue-700" };
  const days = Math.round(
    (new Date(`${booking.preferred_date}T00:00:00`) - new Date(`${today}T00:00:00`)) / 86400000
  );
  if (days < 0) return { text: "Date has passed", tone: "text-amber-700" };
  if (days === 1) return { text: "Tomorrow", tone: "text-sky-700" };
  return null;
};

const AdminBookings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    adminApi
      .get("/service-bookings/", { signal: controller.signal })
      .then(({ data }) => setItems(asList(data)))
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load service bookings. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const counts = useMemo(() => {
    const result = { all: items.length, new: 0, confirmed: 0, completed: 0, cancelled: 0 };
    items.forEach((item) => {
      result[item.status] = (result[item.status] || 0) + 1;
    });
    return result;
  }, [items]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = items.filter((item) => {
      if (tab !== "all" && item.status !== tab) return false;
      if (!query) return true;
      return [item.reference, item.name, item.phone, item.vehicle, item.service_display]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    if (sort === "date") {
      // Soonest preferred date first; bookings without a date go last
      return [...list].sort((a, b) => {
        if (!a.preferred_date && !b.preferred_date) return 0;
        if (!a.preferred_date) return 1;
        if (!b.preferred_date) return -1;
        return a.preferred_date.localeCompare(b.preferred_date);
      });
    }
    return list;
  }, [items, tab, search, sort]);

  const replaceItem = (updated) =>
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));

  const patch = async (item, changes) => {
    const { data } = await adminApi.patch(`/service-bookings/${item.id}/`, changes);
    replaceItem(data);
    return data;
  };

  const openBooking = (item) => {
    setSelected(item);
    setNotes(item.admin_notes || "");
  };

  const changeStatus = async (status) => {
    setError("");
    try {
      setSelected(await patch(selected, { status }));
    } catch {
      setError("Could not change the status.");
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    setError("");
    try {
      setSelected(await patch(selected, { admin_notes: notes }));
      setNotice("Notes saved.");
    } catch {
      setError("Could not save the notes.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/service-bookings/${deleteTarget.id}/`);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setNotice("The booking was deleted.");
      setSelected(null);
    } catch {
      setError("Could not delete this booking.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // A ready-made message for the customer, depending on the booking's status
  const customerMessage = (item) => {
    const first = item.name.split(" ")[0];
    const when = item.preferred_date ? ` for ${formatDate(item.preferred_date)}` : "";
    if (item.status === "confirmed") {
      return `Hi ${first}, your ${item.service_display.toLowerCase()} booking${when} is confirmed (ref ${item.reference}). We look forward to seeing you at CarMax Motors.`;
    }
    return `Hi ${first}, thank you for booking a ${item.service_display.toLowerCase()} with CarMax Motors (ref ${item.reference}). We would like to confirm a time with you${when ? `, you asked for ${formatDate(item.preferred_date)}` : ""}.`;
  };

  const whatsappLink = (item) =>
    `https://wa.me/${toWhatsAppNumber(item.phone)}?text=${encodeURIComponent(customerMessage(item))}`;

  const emailLink = (item) =>
    `mailto:${item.email}?subject=${encodeURIComponent(`Your service booking ${item.reference}`)}&body=${encodeURIComponent(customerMessage(item))}`;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Service appointments customers request from the Service page. Contact them to agree a time, then mark the booking Confirmed."
        title="Service bookings"
      />

      {error && <Banner onDismiss={() => setError("")}>{error}</Banner>}
      {notice && (
        <Banner onDismiss={() => setNotice("")} tone="success">
          {notice}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full overflow-x-auto rounded-lg bg-slate-100 p-1 xl:w-auto" role="tablist">
              {TABS.map((item) => (
                <button
                  aria-selected={tab === item.id}
                  className={`flex-1 whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition xl:flex-none ${
                    tab === item.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  role="tab"
                  type="button"
                >
                  {item.label}
                  <span className="ml-1.5 text-xs text-slate-400">{counts[item.id] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block sm:w-64">
                <FiSearch aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  aria-label="Search bookings"
                  className={`${inputClass} pl-10`}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, vehicle, reference"
                  value={search}
                />
              </label>
              <select
                aria-label="Sort bookings"
                className={`${inputClass} sm:w-44`}
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option value="newest">Newest first</option>
                <option value="date">Preferred date</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            <span className="mr-3 size-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
            Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <FiTool aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-4 font-semibold text-slate-900">
              {items.length === 0 ? "No bookings yet" : "Nothing matches"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {items.length === 0
                ? "When a customer books a service on the website, it appears here."
                : "Try another tab or search."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const hint = dateHint(item);
              return (
                <li key={item.id}>
                  <button
                    className="flex w-full flex-col gap-2 px-4 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                    onClick={() => openBooking(item)}
                    type="button"
                  >
                    <span className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${item.status === "new" ? "bg-blue-500" : "bg-transparent"}`}
                      />
                      <span className="min-w-0">
                        <span className={`block truncate text-sm text-slate-900 ${item.status === "new" ? "font-bold" : "font-semibold"}`}>
                          {item.name}
                          <span className="ml-2 font-normal text-slate-400">{item.phone}</span>
                        </span>
                        <span className="block truncate text-sm text-slate-600">
                          {item.service_display} · {item.vehicle}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <FiCalendar aria-hidden="true" className="size-3.5" />
                            {formatDate(item.preferred_date)}
                          </span>
                          {hint && <span className={`font-semibold ${hint.tone}`}>{hint.text}</span>}
                          <span className="font-mono text-slate-400">{item.reference}</span>
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-slate-400">Received {formatDateTime(item.created_at)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {selected && (
        <Modal
          description={`${selected.reference} · received ${formatDateTime(selected.created_at)}`}
          footer={
            <>
              <button
                className="mr-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                onClick={() => setDeleteTarget(selected)}
                type="button"
              >
                <FiTrash2 aria-hidden="true" className="size-4" />
                Delete
              </button>
              <button className={secondaryButtonClass} onClick={() => setSelected(null)} type="button">
                Close
              </button>
            </>
          }
          onClose={() => setSelected(null)}
          title={selected.name}
        >
          <div className="grid gap-5">
            <div className="flex flex-wrap gap-2">
              <a className={secondaryButtonClass} href={`tel:${selected.phone}`}>
                <FiPhone aria-hidden="true" className="size-4" />
                Call
              </a>
              <a className={secondaryButtonClass} href={whatsappLink(selected)} rel="noopener noreferrer" target="_blank">
                <FiMessageCircle aria-hidden="true" className="size-4" />
                WhatsApp
              </a>
              {selected.email && (
                <a className={secondaryButtonClass} href={emailLink(selected)}>
                  <FiMail aria-hidden="true" className="size-4" />
                  Email
                </a>
              )}
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Service</dt>
                <dd className="font-medium text-slate-900">{selected.service_display}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Preferred date</dt>
                <dd className="font-medium text-slate-900">{formatDate(selected.preferred_date)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Vehicle</dt>
                <dd className="font-medium text-slate-900">{selected.vehicle}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Phone</dt>
                <dd className="font-medium text-slate-900">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{selected.email || "—"}</dd>
              </div>
            </dl>

            {selected.notes && (
              <div>
                <p className="text-xs text-slate-500">Customer&apos;s notes</p>
                <p className="mt-1 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selected.notes}
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs text-slate-500">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((item) => (
                  <button
                    aria-pressed={selected.status === item.id}
                    className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
                      selected.status === item.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    key={item.id}
                    onClick={() => changeStatus(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500" htmlFor="booking-notes">
                Private notes (only you see these)
              </label>
              <textarea
                className={`${inputClass} mt-1 resize-y`}
                id="booking-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="e.g. Agreed Tuesday 10am, bring the logbook"
                rows={3}
                value={notes}
              />
              <button
                className={`${primaryButtonClass} mt-2`}
                disabled={saving || notes === (selected.admin_notes || "")}
                onClick={saveNotes}
                type="button"
              >
                <FiCheckCircle aria-hidden="true" className="size-4" />
                {saving ? "Saving..." : "Save notes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          busy={deleting}
          message={`The booking from ${deleteTarget.name} (${deleteTarget.reference}) will be deleted for good. To keep a record, mark it Cancelled instead.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Delete this booking?"
        />
      )}
    </div>
  );
};

export default AdminBookings;