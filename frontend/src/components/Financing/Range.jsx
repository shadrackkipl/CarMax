import React from "react";

export default function Range({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display: shown,
  hint,
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-[#24364b]">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-[#003b70]">
          {shown}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#cbd8e6] accent-[#f58220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#003b70]"
      />
      {hint && <p className="mt-1 text-xs text-[#64748b]">{hint}</p>}
    </div>
  );
}