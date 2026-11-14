import React, { useState } from "react";
import {
  FaArrowRight,
  FaBriefcase,
  FaCarSide,
  FaCheck,
  FaChevronRight,
  FaHardHat,
  FaHeart,
  FaHome,
  FaPhoneAlt,
  FaPlane,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

const PHONES = [
  { label: "0701 862021", tel: "+254701862021" },
  { label: "0723 018834", tel: "+254723018834" },
  { label: "0722 510155", tel: "+254722510155" },
];

const CATEGORIES = [
  "All",
  "Motor & travel",
  "Business property",
  "Liability",
  "Employees",
  "Transit & marine",
  "Contractors",
  "Personal & home",
];

const PRODUCTS = [
  {
    title: "Motor Insurance",
    cat: "Motor & travel",
    desc: "Covers accidental loss, damage and theft to the motor vehicle and its accessories.",
  },
  {
    title: "Travel Insurance",
    cat: "Motor & travel",
    desc: "Covers accidental injuries, medical expenses, loss of or damage to personal luggage, hijack, personal liability, legal expenses and repatriation of mortal remains. Options include frequent traveler, single trip, travel within the country, Schengen, worldwide, inbound and seniors travel.",
  },
  {
    title: "Fire & Perils Insurance",
    cat: "Business property",
    desc: "Responds to loss of or damage to property caused by fire, lightning, explosion, flooding and earthquake.",
  },
  {
    title: "Burglary / Theft Insurance",
    cat: "Business property",
    desc: "Covers loss of or damage to property following forcible or violent entry.",
  },
  {
    title: "All Risk Insurance",
    cat: "Business property",
    desc: "Compensates for loss of or damage to specified items from accidental loss, accidental breakage and water damage.",
  },
  {
    title: "Plate Glass Insurance",
    cat: "Business property",
    desc: "Covers accidental damage to glass up to the insured value.",
  },
  {
    title: "Business Interruption Insurance",
    cat: "Business property",
    desc: "Covers consequential loss from fire and allied perils, such as loss of gross profit, rental income, wages and increased cost of working.",
  },
  {
    title: "Money Insurance",
    cat: "Business property",
    desc: "Covers loss of company money by theft, on the premises or in transit to the bank.",
  },
  {
    title: "Fidelity Insurance",
    cat: "Business property",
    desc: "Covers employers against loss of money and stock through dishonest acts of employees.",
  },
  {
    title: "Public Liability Insurance",
    cat: "Liability",
    desc: "Covers accidental bodily injury to a third party, including death, and accidental loss of or damage to third-party property in connection with the insured’s business.",
  },
  {
    title: "Employers’ Liability Insurance",
    cat: "Liability",
    desc: "Indemnifies employers for damages awarded by a court to an employee’s legal representative because of death or bodily injury in the course of duty.",
  },
  {
    title: "Professional Indemnity Insurance",
    cat: "Liability",
    desc: "Provides financial protection to professionals for loss caused by their negligent act or omission.",
  },
  {
    title: "Work Injury Benefits Act Insurance (WIBA & WIBA Plus)",
    cat: "Employees",
    desc: "Lifts the employer’s financial obligation under the WIBA Act to compensate workers injured in the course of duty.",
  },
  {
    title: "Group, Individual & Student Personal Accident",
    cat: "Employees",
    desc: "Compensates for accidents resulting in bodily injury, death, permanent disability, and temporary loss of income due to disability or being housebound.",
  },
  {
    title: "Corporate, SME & Individual Medical Insurance",
    cat: "Employees",
    desc: "Provides health cover for inpatient, outpatient, dental, optical and maternity needs.",
  },
  {
    title: "Marine Cargo Insurance",
    cat: "Transit & marine",
    desc: "Compensates for loss of or damage to goods transported by sea or air.",
  },
  {
    title: "Goods in Transit Insurance",
    cat: "Transit & marine",
    desc: "Covers loss of or damage to goods in transit by road, rail or inland waterway within a geographical area.",
  },
  {
    title: "Contractors All Risks",
    cat: "Contractors",
    desc: "Covers a contractor against unforeseen accidental physical loss of or damage to property, and third-party injury claims.",
  },
  {
    title: "Performance Bond Insurance",
    cat: "Contractors",
    desc: "Covers the risk of a contractor failing to fulfil contractual obligations to the client.",
  },
  {
    title: "Home Package Insurance",
    cat: "Personal & home",
    desc: "Covers loss of or damage to residential buildings, household goods and personal belongings from fire, theft, riots, strikes, floods and malicious damage, as well as work-related injuries to domestic staff.",
  },
];

const CATEGORY_ICONS = {
  "Motor & travel": FaCarSide,
  "Business property": FaBriefcase,
  Liability: FaUserShield,
  Employees: FaHeart,
  "Transit & marine": FaPlane,
  Contractors: FaHardHat,
  "Personal & home": FaHome,
};

const STEPS = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Share the vehicle, property or people you want to protect with the Carsure team.",
  },
  {
    number: "02",
    title: "Explore your options",
    description:
      "Discuss the relevant cover options, benefits, limits and exclusions before deciding.",
  },
  {
    number: "03",
    title: "Review the policy",
    description:
      "Read the policy terms and confirm the details with the insurance team before purchase.",
  },
];

const Carinsurance = () => {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

  return (
    <div className="bg-[#f6f7f9] font-['Poppins',sans-serif] text-slate-900 antialiased">
      <header className="relative isolate overflow-hidden bg-[#071b32] text-white">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full border-[70px] border-white/[0.035]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 -z-10 h-48 w-48 rounded-full bg-red-700/20 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-white/90">
              <FaShieldAlt className="text-red-400" aria-hidden="true" />
              Carsure Insurance Agency Ltd
            </div>
            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Confidence for every{" "}
              <span className="text-red-400">road ahead.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Explore insurance options for your motor vehicle, business,
              employees, travel and home. Talk to Carsure about what matters to
              you and review the policy terms before you choose.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${PHONES[0].tel}`}
                className={
                  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600 " +
                  focusRing
                }
              >
                <FaPhoneAlt aria-hidden="true" />
                Call Carsure
                <FaArrowRight className="ml-1 text-sm" aria-hidden="true" />
              </a>
              <a
                href="#cover-options"
                className={
                  "inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10 " +
                  focusRing
                }
              >
                Browse cover options
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/60">
              General information only. Cover is subject to policy terms,
              limits and exclusions.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-red-700/30 to-blue-400/10 blur-2xl"
            />
            <div className="relative rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                    Cover options
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Protection that fits your life
                  </h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-700 text-xl">
                  <FaShieldAlt aria-hidden="true" />
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Motor & travel", FaCarSide],
                  ["Business", FaBriefcase],
                  ["Employees", FaHeart],
                  ["Personal & home", FaHome],
                ].map(([label, Icon]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#071b32]/55 px-4 py-3.5"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-red-300">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="#cover-options"
                className={
                  "mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-white transition hover:text-red-300 " +
                  focusRing
                }
              >
                Explore all cover categories
                <FaChevronRight aria-hidden="true" />
              </a>
            </div>
            <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                <FaCheck aria-hidden="true" />
              </span>
              <p className="text-sm leading-6 text-white/80">
                Always review the benefits, limits and exclusions in your
                policy documents.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section
          id="cover-options"
          className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Find your cover
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Explore our insurance options
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-900">
                Select a category to browse available products. The exact
                benefits and eligibility depend on the policy terms.
              </p>
            </div>
            <p className="text-sm font-medium text-slate-600" aria-live="polite">
              Showing {visible.length} {visible.length === 1 ? "cover" : "covers"}
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter covers by category"
            className="mt-8 flex gap-2 overflow-x-auto pb-2"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={active === category}
                onClick={() => setActive(category)}
                className={
                  "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition " +
                  focusRing +
                  " " +
                  (active === category
                    ? "border-blue bg-blue-700 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-blue-400 hover:text-[#172033]")
                }
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => {
              const Icon = CATEGORY_ICONS[product.cat] || FaShieldAlt;

              return (
                <article
                  key={product.title}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f3f5f8] text-xl text-[#071b32] transition group-hover:bg-red-50 group-hover:text-red-700">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-900">
                      {product.cat}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-snug text-slate-900">
                    {product.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-900">
                    {product.desc}
                  </p>
                  <a
                    href={`tel:${PHONES[0].tel}`}
                    aria-label={`Call Carsure about ${product.title}`}
                    className={
                      "mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-700 transition hover:gap-3 hover:text-red-800 " +
                      focusRing
                    }
                  >
                    Ask about this cover
                    <FaArrowRight aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-blue-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                A straightforward conversation
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Get started in three steps
              </h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {STEPS.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl bg-[#f6f7f9] p-6 sm:p-7"
                >
                  <span className="text-sm font-bold tracking-widest text-red-700">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-900">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#071b32] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                Speak with Carsure
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Have questions about a cover?
              </h2>
              <p className="mt-3 leading-7 text-white/80">
                Call the team to discuss your needs. This page is general
                information and does not constitute a quotation or confirm
                coverage.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {PHONES.map(({ label, tel }, index) => (
                <a
                  key={tel}
                  href={`tel:${tel}`}
                  className={
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition " +
                    focusRing +
                    (index === 0
                      ? " bg-red-700 text-white hover:bg-red-600"
                      : " border border-white/20 bg-white/[0.06] text-white hover:bg-white/10")
                  }
                >
                  <FaPhoneAlt className="text-sm" aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Carinsurance;