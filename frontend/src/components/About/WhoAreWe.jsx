import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import showroom from '../../assets/About/showroom.jpg';

const highlights = [
  'Carefully sourced new and pre-owned vehicles',
  'Support for individual and corporate buyers',
  'A team committed to professional, transparent service',
];

const WhoAreWe = ({ image = showroom }) => {
  return (
    <section
      id="our-story"
      aria-labelledby="who-we-are-title"
      className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="relative">
          <div className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-[#003b70] sm:-left-5 sm:-top-5 sm:h-32 sm:w-32" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-slate-900/10">
            <img
              src={image}
              alt="Maridady Motors Nairobi showroom and vehicles"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-5 right-4 max-w-[230px] rounded-2xl bg-red-700 px-5 py-4 text-white shadow-xl sm:right-8 sm:px-6 sm:py-5">
            <p className="text-2xl text-white font-semibold tracking-tight">Since 2003</p>
            <p className="mt-1 text-sm text-white/80">Helping drivers move forward</p>
          </div>
        </div>

        <div className="pt-4 lg:pt-0">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#003b70]">
            <span className="h-px w-8 bg-[#003b70]" aria-hidden="true" />
            A little about us
          </p>
          <h2
            id="who-we-are-title"
            className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            More than a car dealer. A partner for the road ahead.
          </h2>
          <p className="mt-6 leading-7 text-slate-600">
            Since 2003, CarMax East Africa has helped first-time, family and
            corporate buyers navigate Kenya’s motoring industry with confidence.
            We bring vehicle sourcing, ownership support and after-sales care
            together under one roof.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            Our team sources quality new and pre-owned vehicles from Japan, the
            United Kingdom, Thailand, Australia, Singapore and Dubai, while
            maintaining professional standards and complying with statutory
            requirements.
          </p>

          <ul className="mt-7 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#003b70]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          <a
            href="#what-we-do"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition-colors hover:text-[#003b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003b70] focus-visible:ring-offset-4"
          >
            Discover how we can help
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
