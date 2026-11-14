import React from "react";
import { display } from "./utils";

export default function Stat({ label, value, strong }) {
  return (
    <div>
      <dt className="text-sm text-[#64748b]">{label}</dt>
      <dd
        className={
          "tabular-nums " +
          (strong
            ? "mt-1 text-4xl font-bold text-[#003b70]"
            : "mt-1 text-lg font-semibold text-[#24364b]")
        }
        style={strong ? display : undefined}
      >
        {value}
      </dd>
    </div>
  );
}