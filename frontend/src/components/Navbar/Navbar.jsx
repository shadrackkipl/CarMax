import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Carmax from "../../assets/CarmaxLogo.png";

// Items with `children` render as a dropdown. Add more children any time.
const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Stock List", to: "/car-listing" },
  
  { label: "Car Insurance", to: "/car-insurance" },
  { label: "Financing Plans", to: "/financing-plans" },
  { label: "Service Section", to: "/services" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const navRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close everything on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMenuOpen(false);
        setOpenMobileGroup(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu if viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const desktopLink = ({ isActive }) =>
    `rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-white/5 hover:text-blue-300 ${focusRing} ${
      isActive ? "text-blue-300" : "text-slate-200"
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-blue-400 ${focusRing} ${
      isActive ? "text-blue-400" : "text-slate-200"
    }`;

  const dropdownLink = ({ isActive }) =>
    `block px-4 py-2.5 text-sm transition-colors hover:bg-white/10 hover:text-blue-300 ${focusRing} ${
      isActive ? "text-blue-300" : "text-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17191f]/95 text-slate-100 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 lg:px-10">
        <Link
          to="/"
          className={`flex shrink-0 items-center gap-2.5 rounded-lg ${focusRing}`}
          aria-label="Carmax Motors home"
        >
          <img src={Carmax} alt="" className="h-10 w-auto sm:h-11" />
          
        </Link>

        {/* Desktop nav */}
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="hidden items-center gap-1 xl:flex 2xl:gap-2"
        >
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.label ? null : item.label)
                  }
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium text-slate-200 transition-colors duration-200 hover:bg-white/5 hover:text-blue-300 ${focusRing}`}
                >
                  {item.label}
                  <Chevron open={openDropdown === item.label} />
                </button>

                {openDropdown === item.label && (
                  // pt-2 keeps the hover area continuous between button and panel
                  <div className="absolute left-0 top-full pt-2">
                    <ul className="min-w-[13rem] overflow-hidden rounded-xl border border-white/10 bg-[#20232b] py-1 shadow-xl shadow-black/30">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            onClick={() => setOpenDropdown(null)}
                            className={dropdownLink}
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={desktopLink}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/sell"
            className={`hidden rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-blue-950/20 transition hover:bg-red-400 md:inline-flex ${focusRing}`}
          >
            Sell A Car
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 text-sm font-semibold text-white transition hover:border-blue-400/50 hover:bg-white/10 xl:hidden ${focusRing}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "block" : "hidden"} border-t border-white/10 bg-[#1d2027] px-4 py-4 shadow-inner shadow-black/10 xl:hidden`}
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMobileGroup(openMobileGroup === item.label ? null : item.label)
                  }
                  aria-expanded={openMobileGroup === item.label}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-blue-300 ${focusRing}`}
                >
                  {item.label}
                  <Chevron open={openMobileGroup === item.label} />
                </button>
                {openMobileGroup === item.label && (
                  <ul className="ml-3 mt-1 border-l border-blue-400/30 pl-2">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          onClick={() => setMenuOpen(false)}
                          className={mobileLink}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          )}
          <li className="mt-3 md:hidden">
            <Link
              to="/sell"
              onClick={() => setMenuOpen(false)}
              className={`block min-h-11 rounded-full bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-blue-400 ${focusRing}`}
            >
              Sell A Car
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;