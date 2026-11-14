import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiDollarSign,
  FiEyeOff,
  FiFileText,
  FiInbox,
  FiPackage,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import { adminApi } from "../staff/Staffapi";
import { Banner, StatusPill } from "./Adminui";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-KE");
const formatCurrency = (value) => `KES ${formatNumber(value)}`;

const MetricCard = ({ icon: Icon, label, value, detail, iconClass }) => (
  <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          {value}
        </p>
      </div>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-black/[0.03] ${iconClass}`}>
        <Icon aria-hidden="true" className="size-5" />
      </span>
    </div>
    <p className="mt-3 text-xs text-slate-500">{detail}</p>
  </article>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    adminApi
      .get("/stats/", { signal: controller.signal })
      .then(({ data }) => setStats(data))
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        console.error("Error loading dashboard:", requestError);
        setError("Unable to load the dashboard. Please try again.");
      });

    return () => controller.abort();
  }, []);

  const vehicleTotal = stats?.cars.total || 0;

  return (
    <div className="space-y-8">
      <section className="relative isolate flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#07365f] via-[#075084] to-[#0875a5] px-6 py-7 text-white shadow-[0_16px_40px_rgba(7,54,95,0.18)] sm:flex-row sm:items-center sm:px-8 sm:py-8">
        <div aria-hidden="true" className="absolute -right-10 -top-20 -z-10 size-72 rounded-full border-[36px] border-white/[0.06]" />
        <div aria-hidden="true" className="absolute -bottom-28 right-36 -z-10 size-56 rounded-full border-[28px] border-white/[0.05]" />
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-300" />
            CarMax East Africa Ltd · Admin
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Operations overview
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-sky-50/75">
            Your showroom, sales, and team activity at a glance.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#07365f] shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-white/30"
          to="/staff/cars/new"
        >
          <FiPlus aria-hidden="true" className="size-4" />
          Add vehicle
        </Link>
      </section>

      {error && <Banner>{error}</Banner>}

      {!stats && !error && (
        <div
          aria-label="Loading dashboard"
          className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500"
          role="status"
        >
          <span className="mr-3 size-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
          Loading dashboard...
        </div>
      )}

      {stats && (
        <>
          <section aria-labelledby="metrics-title">
            <div className="mb-4">
              <h2 className="text-base font-semibold tracking-tight text-slate-900" id="metrics-title">
                Performance snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick view of your inventory and business activity
              </p>
            </div>
            <div aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                detail={`${formatNumber(stats.cars.available)} available · ${formatNumber(stats.cars.hidden)} hidden`}
                icon={FiPackage}
                iconClass="bg-slate-100 text-slate-700"
                label="Total vehicles"
                value={formatNumber(stats.cars.total)}
              />
              <MetricCard
                detail="Requests waiting for follow-up"
                icon={FiInbox}
                iconClass="bg-amber-50 text-amber-700"
                label="New inquiries"
                value={formatNumber(stats.inquiries.new)}
              />
              <MetricCard
                detail={`${formatNumber(stats.sales.total)} sales recorded`}
                icon={FiDollarSign}
                iconClass="bg-emerald-50 text-emerald-700"
                label="Sales revenue"
                value={formatCurrency(stats.sales.revenue)}
              />
              <MetricCard
                detail="Remaining invoice balances"
                icon={FiFileText}
                iconClass="bg-sky-50 text-sky-700"
                label="Outstanding"
                value={formatCurrency(stats.sales.outstanding)}
              />
            </div>
          </section>

          <section aria-label="Team and inventory summary" className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.035)]">
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <FiEyeOff aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Hidden listings</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">{formatNumber(stats.cars.hidden)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.035)]">
              <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                <FiUsers aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Staff members</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {formatNumber(stats.staff.active)}
                  <span className="ml-1 text-sm font-normal text-slate-400">/ {formatNumber(stats.staff.total)} active</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.035)]">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-700">
                <FiBriefcase aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Sales team</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {formatNumber(stats.sales_reps.active)}
                  <span className="ml-1 text-sm font-normal text-slate-400">/ {formatNumber(stats.sales_reps.total)} active</span>
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Inventory mix</h2>
                <p className="mt-1 text-sm text-slate-500">Vehicles grouped by body type</p>
              </div>
              {stats.by_body_type.length === 0 ? (
                <p className="mt-6 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No vehicles to report yet.
                </p>
              ) : (
                <ul className="mt-6 space-y-5">
                  {stats.by_body_type.map((row, index) => {
                    const share = vehicleTotal ? (row.count / vehicleTotal) * 100 : 0;
                    return (
                      <li key={row.body_type}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-slate-700">{row.label}</span>
                          <span className="text-slate-500">
                            {formatNumber(row.count)}
                            <span className="ml-2 text-xs text-slate-400">{Math.round(share)}%</span>
                          </span>
                        </div>
                        <div
                          aria-label={`${row.label}: ${Math.round(share)}% of inventory`}
                          className="h-2 overflow-hidden rounded-full bg-slate-100"
                          role="img"
                        >
                          <div
                            className={`h-full rounded-full ${["bg-slate-800", "bg-sky-600", "bg-emerald-600", "bg-violet-600"][index % 4]}`}
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500">Total listed value</span>
                <span className="font-semibold text-slate-900">{formatCurrency(stats.cars.listed_value)}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Recently added</h2>
                  <p className="mt-1 text-sm text-slate-500">The latest vehicles in your inventory</p>
                </div>
                <Link
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                  to="/staff/cars"
                >
                  View inventory
                  <FiArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              {stats.recent_cars.length === 0 ? (
                <div className="mt-5 rounded-xl bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm text-slate-500">Your inventory is waiting for its first vehicle.</p>
                  <Link className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline" to="/staff/cars/new">
                    Add a vehicle <FiArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {stats.recent_cars.map((car) => (
                    <li className="flex items-center justify-between gap-3 py-3.5" key={car.id}>
                      <div className="min-w-0">
                        <Link
                          className="block truncate text-sm font-semibold text-slate-900 hover:text-slate-600"
                          to={`/staff/cars/${car.id}/edit`}
                        >
                          {car.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          Stock {car.stock_number} <span aria-hidden="true">·</span>{" "}
                          {new Date(car.created_at).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <StatusPill active={car.is_available} activeLabel="Available" inactiveLabel="Hidden" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section aria-labelledby="quick-actions-title">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900" id="quick-actions-title">Quick actions</h2>
                <p className="mt-1 text-sm text-slate-500">Common tasks for your team</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md" to="/admin-panel/inquiries">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><FiInbox aria-hidden="true" className="size-4" /></span>
                  <span><span className="block text-sm font-semibold text-slate-900">Review inquiries</span><span className="mt-0.5 block text-xs text-slate-500">Follow up with customers</span></span>
                </span>
                <FiArrowRight aria-hidden="true" className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </Link>
              <Link className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md" to="/admin-panel/sales">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><FiCheckCircle aria-hidden="true" className="size-4" /></span>
                  <span><span className="block text-sm font-semibold text-slate-900">Record a sale</span><span className="mt-0.5 block text-xs text-slate-500">Create a sale and invoice</span></span>
                </span>
                <FiArrowRight aria-hidden="true" className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </Link>
              <Link className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md" to="/admin-panel/staff">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><FiUsers aria-hidden="true" className="size-4" /></span>
                  <span><span className="block text-sm font-semibold text-slate-900">Manage staff</span><span className="mt-0.5 block text-xs text-slate-500">Review administrator access</span></span>
                </span>
                <FiArrowRight aria-hidden="true" className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;