import React from "react";
import { display } from "./utils";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const btnFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const locations = [
  {
    name: "Ngong Road Branch",
    address: "Ngong Rd / Muchai Drive Junction, Opposite Coptic Hospital",
    email: "ngong@carmaxea.com",
  },
  {
    name: "Karen Branch",
    address: "Dagoretti Road, Opp. The Hub Mall",
    email: "karenbranch@carmaxea.com",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-[#003b70] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">
            Personal guidance
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
            style={display}
          >
            Let’s talk through your options
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-blue-100">
            Tell us about the vehicle you are considering and your financing
            questions. Our team can help you understand the application steps
            and where to request the lender’s written terms.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="tel:+254796111999"
              className={`inline-flex min-h-12 items-center rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-600 ${btnFocus}`}
            >
              Call Ngong Road: 0796 111 999
            </a>
            <a
              href="tel:+254798111999"
              className={`inline-flex min-h-12 items-center rounded-lg border border-white/35 px-5 py-3 font-semibold text-white transition hover:border-red-300 hover:bg-white/10 ${btnFocus}`}
            >
              Call Karen: 0798 111 999
            </a>
          </div>
        </div>

        <address className="space-y-5 rounded-2xl border border-white/15 bg-[#071b32]/40 p-6 not-italic shadow-xl backdrop-blur sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">
            CarMax East Africa
          </p>
          {locations.map(({ name, address, email }) => (
            <div
              key={name}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-4"
            >
              <p className="font-semibold text-white" style={display}>
                {name}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-blue-100">
                <FaMapMarkerAlt
                  className="mt-1 shrink-0 text-red-300"
                  aria-hidden="true"
                />
                {address}
              </p>
              <p className="mt-2">
                <a
                  href={`mailto:${email}`}
                  className={`inline-flex items-center gap-2 break-all text-sm text-blue-100 underline decoration-red-300 underline-offset-4 transition hover:text-white ${btnFocus}`}
                >
                  <FaEnvelope className="shrink-0 text-red-300" aria-hidden="true" />
                  {email}
                </a>
              </p>
            </div>
          ))}
        </address>
      </div>
    </section>
  );
}