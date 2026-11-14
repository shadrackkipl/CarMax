import React from 'react';
import { ArrowDown, ArrowRight, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import showroom from '../../assets/About/about.jpg';

const ImgCard = () => {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-blue-700 text-white sm:min-h-[620px]">
      <img
        src={showroom}
        alt="CarMax Motors showroom in Nairobi"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
       <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-blue-950/70 to-slate-950/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-blue-950/70 to-slate-950/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 sm:min-h-[620px] sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <BadgeCheck className="h-4 w-4 text-blue-200" aria-hidden="true" />
            A better way to buy, own and care for your car
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
            Your next journey
            <span className="block text-white">starts with trust.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            For more than two decades, we’ve helped Kenyan drivers find the
            right vehicle and feel confident at every step of ownership.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/car-listing"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore our vehicles
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#our-story"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Get to know us
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg--700/20 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            ['Since 2003', 'Built on experience'],
            ['One trusted team', 'From purchase to after-care'],
            ['Made for Kenya', 'Here for local drivers'],
          ].map(([title, detail]) => (
            <div key={title} className="flex items-center gap-3 py-4 sm:px-6 sm:py-5 first:sm:pl-0 last:sm:pr-0">
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white sm:text-base">{title}</p>
                <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImgCard;
