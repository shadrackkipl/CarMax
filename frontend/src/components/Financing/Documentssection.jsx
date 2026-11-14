import React, { useState } from "react";
import { DOCS } from "./Data";
import { display } from "./utils";

export default function DocumentsSection() {
  const [activeApplicant, setActiveApplicant] = useState(DOCS[0].who);
  const selectedApplicant = DOCS.find((applicant) => applicant.who === activeApplicant);

  return (
    <section id="documents" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
            Get prepared
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={display}
          >
            Documents to bring
          </h2>
          <p className="mt-4 leading-7 text-slate-900">
            Select the applicant type to see a typical document checklist.
            Requirements can vary by lender, so confirm the current list before
            applying.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Select applicant type"
        >
          {DOCS.map(({ who }) => (
            <button
              key={who}
              type="button"
              onClick={() => setActiveApplicant(who)}
              aria-pressed={activeApplicant === who}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
                activeApplicant === who
                  ? "border-[#003b70] bg-[#003b70] text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-red-300 hover:bg-red-50 hover:text-[#003b70]"
              }`}
            >
              {who}
            </button>
          ))}
        </div>

        {selectedApplicant && (
          <article
            className="mt-5 rounded-2xl border border-slate-200 border-t-4 border-t-red-700 bg-[#f8fafc] p-6 shadow-sm sm:p-8"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                  Applicant checklist
                </p>
                <h3
                  className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl"
                  style={display}
                >
                  {selectedApplicant.who}
                </h3>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#003b70]">
                {selectedApplicant.items.length} documents to review
              </span>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {selectedApplicant.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm leading-6 text-slate-900"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-50 text-xs font-bold text-red-700"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-5 text-slate-600">
              This list is a guide only. The lender may request additional
              documents during assessment.
            </p>
          </article>
        )}
        </div>
    </section>
  );
}