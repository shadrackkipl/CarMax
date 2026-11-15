import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FiBriefcase,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiImage,
  FiInbox,
  FiLogOut,
  FiMenu,
  FiSend,
  FiTool,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import { adminApi } from "../staff/Staffapi";
import { useStaff } from "../staff/Staffroute";

const NAV = [
  { to: "/admin-panel", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/staff/cars", label: "Vehicles", icon: MdDirectionsCar },
  { to: "/admin-panel/inquiries", label: "Client requests", icon: FiInbox, badge: "inquiries" },
  { to: "/admin-panel/bookings", label: "Service bookings", icon: FiTool, badge: "bookings" },
  { to: "/admin-panel/sales", label: "Sales & invoices", icon: FiFileText },
  { to: "/admin-panel/staff", label: "Staff members", icon: FiUsers },
  { to: "/admin-panel/sales-reps", label: "Sales team", icon: FiBriefcase },
  { to: "/admin-panel/announcements", label: "Announcements", icon: FiSend },
  { to: "/admin-panel/slides", label: "Home slides", icon: FiImage },
];

const getInitials = (me) =>
  ([me.first_name, me.last_name].filter(Boolean).join(" ") || me.username || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AdminLayout = () => {
  const { me, logout } = useStaff();
  const [menuOpen, setMenuOpen] = useState(false);
  const [badges, setBadges] = useState({ inquiries: 0, bookings: 0 });
  const { pathname } = useLocation();

  // Counts of new client requests and service bookings, refreshed when you
  // move between pages
  useEffect(() => {
    Promise.all([
      adminApi.get("/inquiries/summary/"),
      adminApi.get("/service-bookings/summary/"),
    ])
      .then(([inquiries, bookings]) =>
        setBadges({ inquiries: inquiries.data.new, bookings: bookings.data.new })
      )
      .catch(() => {});
  }, [pathname]);

  const displayName =
    [me.first_name, me.last_name].filter(Boolean).join(" ") || me.username;
  const activePage = [...NAV]
    .sort((first, second) => second.to.length - first.to.length)
    .find(({ to, end }) => (end ? pathname === to : pathname.startsWith(to)));

  const sidebar = (
    <div className="flex h-full flex-col bg-[#1f1f1f] text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <span className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/10">
          <MdDirectionsCar aria-hidden="true" className="size-6" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight">CarMax Motors</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">
            Admin panel
          </p>
        </div>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1.5 px-3 py-6">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/15 text-white ring-1 ring-inset ring-white/10"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`
            }
            end={end}
            key={to}
            onClick={() => setMenuOpen(false)}
            to={to}
          >
            <Icon aria-hidden="true" className="size-[18px]" />
            <span className="flex-1">{label}</span>
            {badge && badges[badge] > 0 && (
              <span
                aria-label={`${badges[badge]} new`}
                className="min-w-5 rounded-full bg-blue-500 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white"
              >
                {badges[badge]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-semibold ring-1 ring-inset ring-white/10">
            {getInitials(me)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="text-[11px] text-white/55">Administrator</p>
          </div>
        </div>
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-medium text-white/90 transition hover:border-white/25 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          onClick={logout}
          type="button"
        >
          <FiLogOut aria-hidden="true" className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:ml-1">
            {activePage && (
              <div className="hidden min-w-0 lg:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Admin workspace
                </p>
                <p className="truncate text-sm font-semibold text-slate-800">{activePage.label}</p>
              </div>
            )}
            <p className="truncate text-sm text-slate-500 lg:ml-auto">
              <span className="hidden sm:inline">Signed in as </span>
              <span className="font-semibold text-slate-800">{displayName}</span>
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
            to="/"
          >
            <span className="hidden sm:inline">View website</span>
            <FiExternalLink aria-hidden="true" className="size-4" />
          </Link>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;