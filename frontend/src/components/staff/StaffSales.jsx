import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiDollarSign,
  FiFileText,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import { asList, staffApi } from "./Staffapi";
import { useStaff } from "./Staffroute";
import { Banner, inputClass, primaryButtonClass } from "../admin/Adminui";
import SaleFormModal from "../admin/SaleFormModal";

const STATUS_STYLES = {
  paid: ["Paid", "bg-emerald-50 text-emerald-700 ring-emerald-200"],
  partial: ["Part paid", "bg-amber-50 text-amber-700 ring-amber-200"],
  unpaid: ["Unpaid", "bg-red-50 text-red-700 ring-red-200"],
};

const money = (value) => `KES ${Number(value || 0).toLocaleString("en-KE")}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

const PaymentBadge = ({ status }) => {
  const [label, tone] = STATUS_STYLES[status] || STATUS_STYLES.unpaid;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>
      {label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <span className={`grid size-9 place-items-center rounded-lg ${tone}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </div>
    <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
  </article>
);

const StaffSales = () => {
  const { me, logout } = useStaff();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Opened from "Mark as sold" in the vehicle list: /staff/sales?sell=<vehicle id>
  const [formOpen, setFormOpen] = useState(Boolean(searchParams.get("sell")) && me.can.sell);
  const [sellCarId] = useState(searchParams.get("sell"));

  useEffect(() => {
    if (searchParams.get("sell")) setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    staffApi
      .get("/sales/", { signal: controller.signal })
      .then(({ data }) => setSales(asList(data)))
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setError(
          requestError.response?.status === 403
            ? "You do not have permission to view sales."
            : "Unable to load your sales. Please try again."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sales;
    return sales.filter((sale) =>
      [sale.invoice_number, sale.buyer_name, sale.vehicle_description, sale.stock_number]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [sales, search]);

  const revenue = sales.reduce((total, sale) => total + Number(sale.sale_price), 0);
  const outstanding = sales.reduce((total, sale) => total + Number(sale.balance), 0);
  const displayName = [me.first_name, me.last_name].filter(Boolean).join(" ") || me.username;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-[#1f1f1f] text-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-white/10">
              <MdDirectionsCar aria-hidden="true" className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Maridady Motors</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Staff portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/80 sm:inline">{displayName}</span>
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              to="/staff/cars"
            >
              <FiArrowLeft aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Vehicles</span>
            </Link>
            <button
              aria-label="Sign out"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
              onClick={logout}
              type="button"
            >
              <FiLogOut aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-7 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My sales</h1>
            <p className="mt-1 text-sm text-slate-500">
              Close a sale to create its invoice. You can see and print the invoices you closed. The
              administrator sees who closed each one.
            </p>
          </div>
          {me.can.sell && (
            <button className={primaryButtonClass} onClick={() => setFormOpen(true)} type="button">
              <FiPlus aria-hidden="true" className="size-4" />
              Close a sale
            </button>
          )}
        </div>

        {error && <Banner onDismiss={() => setError("")}>{error}</Banner>}

        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={FiFileText} label="Invoices I closed" tone="bg-slate-100 text-slate-700" value={sales.length} />
          <StatCard icon={FiTrendingUp} label="Total sales" tone="bg-emerald-50 text-emerald-700" value={money(revenue)} />
          <StatCard icon={FiDollarSign} label="Balance still owed" tone="bg-amber-50 text-amber-700" value={money(outstanding)} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-slate-500">
              {sales.length} {sales.length === 1 ? "invoice" : "invoices"}
            </p>
            <label className="relative block sm:w-72">
              <FiSearch aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search invoices"
                className={`${inputClass} pl-10`}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoice, buyer or vehicle"
                value={search}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
              <span className="mr-3 size-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
              Loading your sales...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                <FiFileText aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-4 font-semibold text-slate-900">
                {sales.length === 0 ? "You have not closed a sale yet" : "No matches"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {sales.length === 0
                  ? "When you close a sale, its invoice appears here."
                  : "Try a different search."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((sale) => (
                <li key={sale.id}>
                  <Link
                    className="flex flex-col gap-2 px-4 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                    to={`/staff/sales/${sale.id}/invoice`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">
                        {sale.invoice_number}
                        <span className="ml-2 font-normal text-slate-400">{formatDate(sale.sold_at)}</span>
                      </span>
                      <span className="block truncate text-sm text-slate-600">
                        {sale.vehicle_description}
                        {sale.stock_number ? ` · ${sale.stock_number}` : ""}
                      </span>
                      <span className="block truncate text-xs text-slate-500">Buyer: {sale.buyer_name}</span>
                    </span>
                    <span className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-sm font-bold text-slate-900">{money(sale.sale_price)}</span>
                      <span className="flex items-center gap-2">
                        {Number(sale.balance) > 0 && (
                          <span className="text-xs text-slate-500">Owes {money(sale.balance)}</span>
                        )}
                        <PaymentBadge status={sale.payment_status} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {formOpen && (
        <SaleFormModal
          api={staffApi}
          initialCarId={sellCarId}
          onClose={() => setFormOpen(false)}
          onSaved={(sale) => navigate(`/staff/sales/${sale.id}/invoice`)}
        />
      )}
    </div>
  );
};

export default StaffSales;