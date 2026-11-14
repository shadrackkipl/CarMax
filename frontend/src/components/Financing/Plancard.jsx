import React from "react";
import { display } from "./utils";

export default function PlanCard({ title, badge, badgeClass, cta, children }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-900" style={display}>
          {title}
        </h3>
        <span
          className={
            "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] " +
            badgeClass
          }
        >
          {badge}
        </span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-900">{children}</p>
      <a
        href="#contact"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#003b70] transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700"
      >
        {cta}
        <span aria-hidden="true" className="text-lg leading-none text-red-700">
          →
        </span>
      </a>
    </article>
  );
}