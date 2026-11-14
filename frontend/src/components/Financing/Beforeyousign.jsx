import React from "react";
import { CHECKS } from "./Data";
import { display } from "./utils";
import { FaChevronDown } from "react-icons/fa";

export default function BeforeYouSign() {
  return (
    <section className="bg-[#f5f5f0]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div className="lg:pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            Read the fine print
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={display}
          >
            Before you sign
          </h2>
          <p className="mt-4 leading-7 text-slate-900">
            Whichever plan you choose, get answers in writing. Expand each
            topic to see what to check, and compare the total cost rather than
            the deposit alone.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#003b70] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Ask our team
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {CHECKS.map((check, index) => (
            <details key={check.t} className="group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-red-700 sm:px-6">
                <span
                  className="font-semibold text-slate-900 sm:text-lg"
                  style={display}
                >
                  {check.t}
                </span>
                <FaChevronDown
                  className="h-4 w-4 shrink-0 text-red-700 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 leading-7 text-slate-900 sm:px-6">
                {check.d}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}