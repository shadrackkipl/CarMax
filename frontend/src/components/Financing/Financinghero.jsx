import React from "react";
import { display } from "./utils";
import SlideImage1 from "../../assets/slide/slide4.png";

const HERO_STATS = [
  ["Trusted dealer since", "2003"],
  ["Financing partners", "Absa, Stanbic, NCBA"],
  ["Car yards", "Ngong Road & Karen"],
  ["Service center", "Langata Road"],
];

export default function FinancingHero() {
  return (
    <header
      className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-[#071b32] bg-cover bg-center text-white sm:min-h-[680px] lg:min-h-[calc(100svh-72px)]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(1, 34, 71, 0.97) 0%, rgba(8, 8, 8, 0.78) 48%, rgba(7, 13, 50, 0.42) 100%), linear-gradient(0deg, rgba(7, 27, 50, 0.48), transparent 48%), url(${SlideImage1})`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-16 left-0 -z-10 h-48 w-48 rounded-full bg-white/25 blur-3xl"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
            Finance your next drive
          </div>
          <h1
            className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={display}
          >
            Find the right car.
            <br />
            <span className="text-white">Choose your way to pay.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
            Explore vehicle financing through Absa, Stanbic Bank and NCBA.
            Compare the options, prepare your documents and speak with our team
            about the lender’s written terms.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#financing-partners"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Compare financing partners
            </a>
            <a
              href="tel:+254796111999"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/[0.06] px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:border-red-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Talk to our team
            </a>
          </div>
          <p className="mt-5 text-xs leading-5 text-white/60">
            Terms, rates and approval are determined by each lender.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem]blur-2xl"
          />
          <dl className="relative grid grid-cols-2 gap-3">
            {HERO_STATS.map(([k, v], index) => (
              <div
                key={k}
                className={`min-h-32 rounded-2xl border border-white/15 5 p-5 shadow-xl backdrop-blur-md sm:p-6 ${
                  index === 0 ? "border-t-2 border-t-blue-500" : ""
                }`}
              >
                <dt className="text-[11px] font-semibold uppercase leading-5 tracking-[0.12em] text-white/75">
                  {k}
                </dt>
                <dd
                  className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl"
                  style={display}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="#documents"
            className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-semibold text-white transition hover:border-red-400/50 hover:bg-white/10 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See what to prepare before applying
            <span aria-hidden="true" className="text-lg text-red-400">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}