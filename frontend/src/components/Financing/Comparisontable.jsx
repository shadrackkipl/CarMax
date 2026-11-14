import React from "react";
import { COLS, TABLE } from "./Data";
import { display } from "./utils";

export default function ComparisonTable() {
  return (
    <div className="mt-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-xl font-bold text-slate-900" style={display}>
          At a glance
        </h3>
        <p className="text-xs text-slate-600">
          Scroll horizontally to compare on smaller screens
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(23,32,51,0.06)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">
            CarMax East Africa financing options compared. Lender terms vary.
          </caption>
          <thead>
            <tr className="bg-[#003b70] text-white">
              <th scope="col" className="p-4 font-semibold">
                <span className="sr-only">Feature</span>
              </th>
              {COLS.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="p-4 font-semibold"
                  style={display}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr
                key={row.label}
                className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${
                  i % 2 ? "bg-red-50/70" : "bg-white"
                }`}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap p-4 font-semibold text-slate-900"
                >
                  {row.label}
                </th>
                {row.values.map((v, j) => (
                  <td key={j} className="p-4 align-top leading-6 text-slate-900">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}