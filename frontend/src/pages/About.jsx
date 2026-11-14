import React from 'react'
import ImgCard from '../components/About/ImgCard';
import AboutMaridadyMotors from '../components/About/AboutMaridadyMotors';
import WhoAreWe from '../components/About/WhoAreWe';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <ImgCard />
        <WhoAreWe />
        <AboutMaridadyMotors />

        <section className="bg-[#003b70] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-10 lg:flex-row lg:items-center lg:p-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                Let’s get you moving
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                The right car. The right people behind it.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Browse our current selection or talk with our team about what
                you need for the road ahead.
              </p>
            </div>
            <Link
              to="/car-listing"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#003b70] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Find your next car
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default About