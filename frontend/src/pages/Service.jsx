import React, { useState } from "react";
import axios from "axios";
import {
  FaTools,
  FaMicrochip,
  FaCarCrash,
  FaPaintRoller,
  FaCircleNotch,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700";

const CONTACT = {
  address: "Langata Road, Turn off to Carnivore Restaurant",
  mapHref: "https://goo.gl/maps/tuFFjHwx5jjybd7p6",
  phone: "0722 388 828",
  tel: "+254722388828",
  email: "service@carmaxea.com",
};

// The value is what the server stores; the label is what the customer sees
const SERVICE_OPTIONS = [
  { value: "minor_service", label: "Minor service" },
  { value: "major_service", label: "Major service" },
  { value: "repair", label: "Mechanical / electrical repair" },
  { value: "bodyshop", label: "Bodyshop / accident repair" },
  { value: "paintwork", label: "Paintwork" },
  { value: "tyres", label: "Tyre centre & accessories" },
  { value: "other", label: "Other" },
];

const MINOR = [
  "Oil and oil filter change",
  "Lubrication of moving parts",
  "Fluid top-ups",
  "Inspection for fluid leaks",
  "Check of lights, tyres and windscreen wipers",
];

const MAJOR = [
  "Everything in the minor service",
  "Synthetic engine oil, covering up to 10,000 km",
  "Air filter and fuel filter replacement",
  "Brake inspection",
  "Shock absorber and wheel bearing assessment",
  "Electrical component testing",
  "Air conditioning system check",
  "Radiator inspection",
];

const SERVICES = [
  {
    id: "repair",
    title: "Mechanical & Electrical Repair",
    icon: FaMicrochip,
    desc: "Computerized diagnostics with advanced tools help us accurately diagnose and troubleshoot mechanical and electrical issues. Our packages use genuine parts at reasonable prices, with prompt appointments, easy check-in and check-out, and a comfortable customer lounge.",
  },
  {
    id: "bodyshop",
    title: "Bodyshop",
    icon: FaCarCrash,
    desc: "For major accidents that need specialized collision repair, our skilled team and modern equipment handle full-body repair and conditioning.",
    items: [
      "Facelifts and accident repairs",
      "Dent removal",
      "Professional color matching",
      "Jigging and vehicle alignment",
      "Valet cleaning and polishing",
      "Windscreen replacement",
      "Light restoration",
      "Upholstery restoration",
    ],
  },
  {
    id: "paint",
    title: "Paintwork",
    icon: FaPaintRoller,
    desc: "Time, weather, poor maintenance and accidents can fade and damage a vehicle’s paint. Our technicians assess the damage and recommend the right paintwork, and our spray booth delivers a clean, manufacturer-quality finish that also protects the body from further damage.",
  },
  {
    id: "tyre",
    title: "Tyre Centre",
    icon: FaCircleNotch,
    desc: "Tyres are central to safety and performance. Our tyre centre offers wheel alignment, camber balancing and a range of tyre products, plus vehicle accessories.",
    items: [
      "Car alarms and security devices",
      "Audio systems",
      "Window tints",
    ],
  },
];

const Check = () => (
  <FaCheckCircle
    aria-hidden="true"
    className="mt-1 h-4 w-4 shrink-0 text-red-700"
  />
);

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#d9dad4] bg-[#f5f5f0] px-3 py-2.5 text-slate-900 outline-none focus:border-[#003b70] " +
  "placeholder:text-slate-500";

const errorFieldClass = "border-red-500 focus:border-red-600";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  date: "",
  notes: "",
  website: "", // hidden spam trap: real visitors leave it empty
};

// Today in Nairobi, as YYYY-MM-DD (the earliest date a customer may pick)
const todayInNairobi = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

const FieldError = ({ id, children }) =>
  children ? (
    <p id={id} className="mt-1 text-sm font-medium text-red-700" role="alert">
      {children}
    </p>
  ) : null;

const BookingForm = ({ selectedService, onServiceChange }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");
  const [done, setDone] = useState(null); // { message, reference }

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((current) => {
      const field = key === "date" ? "preferred_date" : key;
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const chooseService = (value) => {
    onServiceChange(value);
    setErrors((current) => {
      if (!current.service) return current;
      const next = { ...current };
      delete next.service;
      return next;
    });
  };

  const fieldError = (name) => [].concat(errors[name] ?? []).join(" ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const clientErrors = {};
    if (!form.name.trim()) clientErrors.name = "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 9) {
      clientErrors.phone = "Please enter a valid phone number.";
    }
    if (!form.vehicle.trim()) {
      clientErrors.vehicle = "Please tell us which vehicle it is.";
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSending(true);
    setFailure("");

    try {
      const { data } = await axios.post(`${API_URL}/api/service-bookings/`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        vehicle: form.vehicle.trim(),
        service: selectedService,
        preferred_date: form.date || null,
        notes: form.notes.trim(),
        website: form.website,
      });
      setDone(data);
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 400 && requestError.response.data) {
        setErrors(requestError.response.data);
      } else if (status === 429) {
        setFailure(
          "You have sent several requests already. Please try again later or call us.",
        );
      } else {
        setFailure(
          "We could not send your booking. Please try again or call us.",
        );
      }
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="py-6 text-center" role="status">
        <FaCheckCircle
          className="mx-auto h-12 w-12 text-emerald-600"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-2xl font-bold">Booking request received</h3>
        <p className="mx-auto mt-2 max-w-md leading-relaxed">{done.message}</p>
        {done.reference && (
          <p className="mt-4 text-sm">
            Your reference:{" "}
            <span className="rounded-md bg-[#f5f5f0] px-2 py-1 font-mono font-bold">
              {done.reference}
            </span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setForm(EMPTY_FORM);
              onServiceChange(SERVICE_OPTIONS[0].value);
              setErrors({});
            }}
            className={`rounded-lg border border-black px-6 py-3 font-semibold transition hover:bg-black/5 ${focusRing}`}
          >
            Make another booking
          </button>
          <a
            href={`tel:${CONTACT.tel}`}
            className={`inline-flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600 ${focusRing}`}
          >
            <FaPhoneAlt className="h-4 w-4" aria-hidden="true" />
            Call {CONTACT.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <p className="text-sm font-semibold text-[#17191f]">Choose a service</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseService(option.value)}
              aria-pressed={selectedService === option.value}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
                selectedService === option.value
                  ? "border-red-700 bg-[#003b70] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-700 hover:bg-red-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {failure && (
        <p
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 sm:col-span-2"
          role="alert"
        >
          {failure}
        </p>
      )}

      <div>
        <label htmlFor="b-name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="b-name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={form.name}
          onChange={update("name")}
          aria-invalid={Boolean(fieldError("name"))}
          aria-describedby="b-name-error"
          className={`${fieldClass} ${fieldError("name") ? errorFieldClass : ""}`}
        />
        <FieldError id="b-name-error">{fieldError("name")}</FieldError>
      </div>

      <div>
        <label htmlFor="b-phone" className="text-sm font-medium">
          Phone number
        </label>
        <input
          id="b-phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update("phone")}
          aria-invalid={Boolean(fieldError("phone"))}
          aria-describedby="b-phone-error"
          className={`${fieldClass} ${fieldError("phone") ? errorFieldClass : ""}`}
        />
        <FieldError id="b-phone-error">{fieldError("phone")}</FieldError>
      </div>

      <div>
        <label htmlFor="b-vehicle" className="text-sm font-medium">
          Vehicle (make, model, registration)
        </label>
        <input
          id="b-vehicle"
          type="text"
          maxLength={120}
          placeholder="e.g. Toyota Prado, KDA 123A"
          value={form.vehicle}
          onChange={update("vehicle")}
          aria-invalid={Boolean(fieldError("vehicle"))}
          aria-describedby="b-vehicle-error"
          className={`${fieldClass} ${fieldError("vehicle") ? errorFieldClass : ""}`}
        />
        <FieldError id="b-vehicle-error">{fieldError("vehicle")}</FieldError>
      </div>

      <div>
        <label htmlFor="b-service" className="text-sm font-medium">
          Service needed
        </label>
        <select
          id="b-service"
          value={selectedService}
          onChange={(e) => chooseService(e.target.value)}
          className={fieldClass}
        >
          {SERVICE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <FieldError>{fieldError("service")}</FieldError>
      </div>

      <div>
        <label htmlFor="b-date" className="text-sm font-medium">
          Preferred date
        </label>
        <input
          id="b-date"
          type="date"
          min={todayInNairobi()}
          value={form.date}
          onChange={update("date")}
          aria-invalid={Boolean(fieldError("preferred_date"))}
          aria-describedby="b-date-error"
          className={`${fieldClass} ${fieldError("preferred_date") ? errorFieldClass : ""}`}
        />
        <FieldError id="b-date-error">{fieldError("preferred_date")}</FieldError>
      </div>

      <div>
        <label htmlFor="b-email" className="text-sm font-medium">
          Email <span className="font-normal">(optional)</span>
        </label>
        <input
          id="b-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          aria-invalid={Boolean(fieldError("email"))}
          aria-describedby="b-email-error"
          className={`${fieldClass} ${fieldError("email") ? errorFieldClass : ""}`}
        />
        <FieldError id="b-email-error">{fieldError("email")}</FieldError>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="b-notes" className="text-sm font-medium">
          Anything we should know? (optional)
        </label>
        <textarea
          id="b-notes"
          rows={3}
          maxLength={1000}
          value={form.notes}
          onChange={update("notes")}
          className={fieldClass}
        />
      </div>

      {/* Spam trap: hidden from people, bots tend to fill it in */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={update("website")}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className={`inline-flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
        >
          <FaCalendarCheck className="h-4 w-4" aria-hidden="true" />
          {sending ? "Sending..." : "Request booking"}
        </button>
        <a
          href={`tel:${CONTACT.tel}`}
          className={`inline-flex items-center gap-2 rounded-lg border border-black px-6 py-3.5 font-semibold transition hover:bg-black/5 ${focusRing}`}
        >
          <FaPhoneAlt className="h-4 w-4" aria-hidden="true" />
          Or call {CONTACT.phone}
        </a>
      </div>

      <p className="text-sm sm:col-span-2">
        Your request goes straight to our service team. Your booking is
        confirmed once we contact you.
      </p>
    </form>
  );
};

const Service = () => {
  const [selectedService, setSelectedService] = useState(
    SERVICE_OPTIONS[0].value,
  );

  const goToBooking = (service) => {
    setSelectedService(service);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#f5f5f0] font-['Poppins',sans-serif] text-slate-800 antialiased">
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
              <FaTools className="text-red-400" aria-hidden="true" />
              Carmax Service Centre
            </div>
            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Expert care for every{" "}
              <span className="text-red-400">road ahead.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              From routine maintenance to specialist repairs, get practical
              support for the safety, performance and appearance of your
              vehicle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600 ${focusRing}`}
              >
                <FaCalendarCheck aria-hidden="true" />
                Book a service
                <FaArrowRight className="ml-1 text-sm" aria-hidden="true" />
              </a>
              <a
                href={`tel:${CONTACT.tel}`}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10 ${focusRing}`}
              >
                <FaPhoneAlt aria-hidden="true" />
                Call {CONTACT.phone}
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              Send a booking request and our service team will contact you to
              confirm your appointment.
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
                    Service options
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    What does your vehicle need?
                  </h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-700 text-xl">
                  <FaTools aria-hidden="true" />
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Routine service", "minor_service", FaTools],
                  ["Diagnostics", "repair", FaMicrochip],
                  ["Bodyshop & paint", "bodyshop", FaCarCrash],
                  ["Tyres & accessories", "tyres", FaCircleNotch],
                ].map(([label, service, Icon]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => goToBooking(service)}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#071b32]/55 px-4 py-3.5 text-left transition hover:border-red-400/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-red-300">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {label}
                    </span>
                    <FaArrowRight
                      className="ml-auto h-3 w-3 text-white/50"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
              <a
                href="#services"
                className={`mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-white transition hover:text-red-300 ${focusRing}`}
              >
                Explore all service options
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>
            <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                <FaCheckCircle aria-hidden="true" />
              </span>
              <p className="text-sm leading-6 text-slate-300">
                Choose an option above to start a booking with that service
                already selected.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Service & maintenance */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
            Routine care
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Service &amp; maintenance
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
          Regular maintenance keeps a vehicle safe and reliable. We offer both
          minor and major service packages, with clear options to suit your
          vehicle’s needs.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            ["Minor service", MINOR, "minor_service"],
            ["Major service", MAJOR, "major_service"],
          ].map(([title, items, serviceValue]) => (
            <article
              key={title}
              className="rounded-2xl border border-[#d9dad4] bg-white p-6 shadow-[0_14px_30px_rgba(34,38,43,0.04)] transition hover:border-red-700 hover:shadow-[0_18px_40px_rgba(0,59,112,0.12)] sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#003b70]">
                Service package
              </p>
              <h3 className="mt-2 text-2xl font-bold">{title}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                {items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <Check />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goToBooking(serviceValue)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                Book this service
                <FaArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Other services */}
      <section id="services" className="scroll-mt-6 bg-[#f5f5f0]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
              More ways we can help
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Repairs, bodywork &amp; tyres
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Explore our specialist services and choose the option that best
              describes what your vehicle needs.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SERVICES.map(({ id, title, icon: Icon, desc, items }) => {
              const serviceValue = {
                repair: "repair",
                bodyshop: "bodyshop",
                paint: "paintwork",
                tyre: "tyres",
              }[id];
              return (
              <article
                key={id}
                className="group rounded-2xl border border-[#d9dad4] bg-white p-6 shadow-[0_14px_30px_rgba(34,38,43,0.04)] transition hover:-translate-y-1 hover:border-red-700 hover:shadow-[0_18px_35px_rgba(0,59,112,0.12)] sm:p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#003b70] text-[#fff7d6] transition group-hover:bg-red-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                {items && (
                  <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    {items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <Check />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => goToBooking(serviceValue)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#003b70]/15 px-4 py-2.5 text-sm font-bold text-[#003b70] transition hover:border-red-700 hover:bg-red-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700"
                >
                  Request this service
                  <FaArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Book a service */}
      <section id="book" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
            Start here
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Request a service booking
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
          Tell us about your vehicle and what it needs, and we’ll confirm a
          time with you. You can also call or visit the service centre
          directly.
          </p>
        </div>
        <div className="relative mt-8 rounded-2xl border-t-4 border-t-blue-700 border-x border-b border-x-[#d9dad4] border-b-[#d9dad4] bg-white p-6 shadow-[0_18px_45px_rgba(0,59,112,0.08)] sm:p-8 lg:p-10">
          <BookingForm
            selectedService={selectedService}
            onServiceChange={setSelectedService}
          />
        </div>
      </section>

      {/* Why us + visit */}
      <section className="bg-[#f5f5f0]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
              Confidence in every visit
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Built for the long run
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Carmax Service Centre is dedicated to the longevity, safety and
              appearance of your vehicle. With genuine parts, top-notch service
              quality, skilled technicians, modern technology and a
              customer-centric approach, we are a reliable choice for all your
              automotive needs.
            </p>
          </div>

          <address className="space-y-4 rounded-2xl border border-[#d9dad4] border-t-4 border-t-[#003b70] bg-white p-6 not-italic shadow-[0_14px_30px_rgba(0,59,112,0.08)] sm:p-8">
            <p className="text-lg font-bold">Visit the service centre</p>
            <p className="flex items-start gap-3">
              <FaMapMarkerAlt
                className="mt-1 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline decoration-[#003b70] underline-offset-4 hover:text-red-700 ${focusRing}`}
              >
                {CONTACT.address}
              </a>
            </p>
            <p className="flex items-start gap-3">
              <FaPhoneAlt
                className="mt-1 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <a
                href={`tel:${CONTACT.tel}`}
                className={`underline decoration-[#003b70] underline-offset-4 hover:text-red-700 ${focusRing}`}
              >
                {CONTACT.phone}
              </a>
            </p>
            <p className="flex items-start gap-3">
              <FaEnvelope
                className="mt-1 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <a
                href={`mailto:${CONTACT.email}`}
                className={`break-all underline decoration-[#003b70] underline-offset-4 hover:text-red-700 ${focusRing}`}
              >
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>
      </section>
    </div>
  );
};

export default Service;