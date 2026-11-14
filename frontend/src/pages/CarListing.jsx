import React, { useState } from 'react'
import CarSearch from '../components/Carlisting/Carsearch'
import Suv from '../components/Carlisting/Suv'
import Hatchbacks from '../components/Carlisting/Hatchbacks'
import Salooncar from '../components/Carlisting/Salooncar'
import Stationwagon from '../components/Carlisting/Stationwagon'
import Pickuptruck from '../components/Carlisting/Pickuptruck'
import Minivan from '../components/Carlisting/Minivan'
import Commercialvehicle from '../components/Carlisting/Commercialvehicle'

const CarListing = () => {
  const [searching, setSearching] = useState(false)

  return (
    <main className="min-h-[60vh] bg-[#f5f5f0] pb-8">
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#24313a] to-[#37413f] px-5 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-[5.5rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(ellipse,rgba(196,157,93,0.24),transparent_68%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-60 -right-24 h-[32rem] w-[32rem] rounded-full border border-white/10"
        />
        <div className="relative z-10 mx-auto max-w-[1330px]">
          <p className="mb-4 text-[11px] font-bold tracking-[0.18em] text-white">
            CAR MAX EAST AFRICA · VEHICLE SHOWROOM
          </p>
          <h1 className="max-w-[720px] text-[clamp(2.35rem,5vw,4.4rem)] font-bold leading-[1.08] tracking-[-0.045em]">
            Find the car that moves you.
          </h1>
          <p className="mt-[18px] max-w-[560px] text-[clamp(0.95rem,1.4vw,1.08rem)] leading-[1.7] text-white/75">
            Explore our carefully selected range of quality vehicles and find
            the right fit for every journey.
          </p>
        </div>
      </header>

      <CarSearch onActiveChange={setSearching} />

      {!searching && (
        <div>
          <Salooncar />
          <Stationwagon />
          <Suv />
          <Hatchbacks />
          <Commercialvehicle />
          <Pickuptruck />
          <Minivan />
        </div>
      )}
    </main>
  )
}

export default CarListing