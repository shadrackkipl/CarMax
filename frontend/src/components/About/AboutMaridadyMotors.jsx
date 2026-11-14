import React from 'react';
import { ArrowUpRight, CarFront, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'vehicles',
    title: 'Find the right vehicle',
    description:
      'Explore quality new and pre-owned vehicles sourced from trusted markets around the world.',
    icon: CarFront,
    link: '/car-listing',
    action: 'Explore our stock',
  },
  {
    id: 'ownership',
    title: 'Support for ownership',
    description:
      'Get guidance on financing and insurance options to make your next purchase feel more manageable.',
    icon: ShieldCheck,
    link: '/financing-plans',
    action: 'See your options',
  },
  {
    id: 'care',
    title: 'Care close to home',
    description:
      'Visit our Nairobi yards on Ngong Road and in Karen, or our service center on Langata Road.',
    icon: MapPin,
    link: '/services',
    action: 'Explore our services',
  },
];

const AboutMaridadyMotors = () => {
  return (
    <section
      id="what-we-do"
      aria-labelledby="what-we-do-title"
      className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#003b70]">
            Here for every part of the journey
          </p>
          <h2
            id="what-we-do-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Everything you need to move forward
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            From choosing a car to caring for it, our team makes each step
            simpler, clearer and more personal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {services.map(({ id, title, description, icon: Icon, link, action }) => (
            <article
              key={id}
              className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#003b70] transition-colors group-hover:bg-[#003b70] group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">
                {title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                {description}
              </p>
              <Link
                to={link}
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-950 transition-colors hover:text-[#003b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003b70] focus-visible:ring-offset-4"
              >
                {action}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMaridadyMotors;
