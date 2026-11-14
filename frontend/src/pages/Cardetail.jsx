import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InquiryModal from "../components/car/InquiryModal";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  ""
);

// WhatsApp Business link used by the "Ask Price" button
const WHATSAPP_ASK_PRICE_LINK = "https://wa.me/message/REOQ2KB3FWBYF1";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-KE");

const getImageUrl = (path) => {
  try {
    return new URL(path, `${API_URL}/`).toString();
  } catch {
    return null;
  }
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "features", label: "Features" },
];

// Edit these to match your showroom. Times are minutes after midnight (Nairobi time).
const OPENING_HOURS = [
  { label: "Monday to Friday", days: [1, 2, 3, 4, 5], open: 7 * 60 + 30, close: 18 * 60 },
  { label: "Saturday", days: [6], open: 7 * 60 + 30, close: 18 * 60 },
  { label: "Sunday", days: [0], open: 10 * 60, close: 16 * 60 },
];

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const formatTime = (minutes) => {
  const hours24 = Math.floor(minutes / 60);
  const mins = String(minutes % 60).padStart(2, "0");
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${mins} ${suffix}`;
};

// Is the showroom open right now? Public holidays are not checked.
const isOpenNow = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Nairobi",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;
  const day = WEEKDAYS[get("weekday")];
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  return OPENING_HOURS.some(
    (slot) => slot.days.includes(day) && minutes >= slot.open && minutes < slot.close
  );
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getSavedCarIds = () => {
  if (typeof window === "undefined") return [];

  try {
    const saved = JSON.parse(
      window.localStorage.getItem("CarMax-saved-cars") || "[]"
    );
    return Array.isArray(saved) ? saved.map(String) : [];
  } catch (storageError) {
    console.error("Unable to load saved vehicles:", storageError);
    return [];
  }
};

const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const HeartIcon = ({ filled = false }) => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
  </svg>
);

const ICONS = {
  calendar: (
    <>
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  body: (
    <>
      <rect height="13" width="15" x="1" y="3" />
      <path d="M16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  engine: (
    <>
      <rect height="16" rx="2" width="16" x="4" y="4" />
      <rect height="6" width="6" x="9" y="9" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </>
  ),
  fuel: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  transmission: (
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  ),
  drivetrain: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
    </>
  ),
  door: (
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
  ),
  seat: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  color: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
  ),
  check: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </>
  ),
};

const Icon = ({ name, className = "h-4 w-4" }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {ICONS[name]}
  </svg>
);

// Turns **bold** markers from the admin into <strong> text
const renderRichText = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong className="font-bold text-gray-900" key={index}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [showroomOpen, setShowroomOpen] = useState(isOpenNow);
  const [savedCars, setSavedCars] = useState(getSavedCarIds);
  const [saveFeedback, setSaveFeedback] = useState("");

  // Keep the Open/Closed badge current
  useEffect(() => {
    const timer = setInterval(() => setShowroomOpen(isOpenNow()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setActiveImage(0);

    axios
      .get(`${API_URL}/api/cars/${id}/`, { signal: controller.signal })
      .then((response) => setCar(response.data))
      .catch((requestError) => {
        if (axios.isCancel(requestError)) return;
        console.error("Error fetching car:", requestError);
        setError(
          requestError.response?.status === 404
            ? "This vehicle is no longer available."
            : "Unable to load this vehicle. Please try again later."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [id]);

  // Cover image first, then gallery images, without duplicates
  const images = useMemo(() => {
    if (!car) return [];
    const urls = [car.image, ...(car.images || []).map((item) => item.image)]
      .filter(Boolean)
      .map(getImageUrl)
      .filter(Boolean);
    return [...new Set(urls)];
  }, [car]);

  const showPrevious = useCallback(
    () => {
      setActiveImage((i) => (i - 1 + images.length) % images.length);
      setImageZoomed(false);
    },
    [images.length]
  );
  const showNext = useCallback(
    () => {
      setActiveImage((i) => (i + 1) % images.length);
      setImageZoomed(false);
    },
    [images.length]
  );

  // Lightbox: Escape closes, arrows navigate, body scroll locked
  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, showPrevious, showNext]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#e2e2e2] px-4 py-8">
        <div className="mx-auto grid max-w-[1240px] animate-pulse gap-5 lg:grid-cols-[1.38fr_0.98fr]">
          <div className="aspect-[4/3] rounded-lg bg-slate-300" />
          <div className="grid content-start gap-4 rounded-lg bg-white p-6">
            <div className="h-5 w-28 rounded bg-slate-200" />
            <div className="h-9 w-3/4 rounded bg-slate-200" />
            <div className="h-8 w-1/2 rounded bg-slate-200" />
            <div className="mt-4 h-12 rounded-xl bg-slate-200" />
          </div>
        </div>
        <p className="sr-only" role="status">Loading vehicle details...</p>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="min-h-screen bg-[#e2e2e2] px-4 py-6 sm:py-9">
        <div className="mx-auto w-full min-w-0 max-w-[1240px]">
          <button
            className="mb-4 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            onClick={() => navigate(-1)}
            type="button"
          >
            <span aria-hidden="true">←</span> Back to listings
          </button>
          <p
            className="rounded-lg bg-white px-4 py-12 text-center text-slate-600 shadow-sm"
            role="alert"
          >
            {error || "Vehicle not found."}
          </p>
        </div>
      </main>
    );
  }

  const title = `${car.year} ${car.make} ${car.model_name}`;

  // Chosen per vehicle in the Django admin
  const salesReps = car.sales_representatives || [];

  const whatsappLink = (text) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled sharing */
    }
  };

  const handleToggleSaved = () => {
    const carId = String(id);
    const nextSavedCars = savedCars.includes(carId)
      ? savedCars.filter((savedId) => savedId !== carId)
      : [...savedCars, carId];

    try {
      window.localStorage.setItem(
        "CarMax-saved-cars",
        JSON.stringify(nextSavedCars)
      );
      setSavedCars(nextSavedCars);
      setSaveFeedback(
        nextSavedCars.includes(carId)
          ? "Vehicle saved to your favorites."
          : "Vehicle removed from your favorites."
      );
    } catch (storageError) {
      console.error("Unable to save vehicle:", storageError);
      setSaveFeedback("Could not save this vehicle on your browser.");
    }
  };

  const isSaved = savedCars.includes(String(id));

  const specifications = [
    ["Year", car.year],
    ["Make", car.make],
    ["Model", car.model_name],
    ["Variant", car.variant],
    ["Trim", car.trim],
    ["Model Code", car.model_code],
    ["Condition", car.condition],
    ["Body Type", car.body_type_display],
    ["Mileage", car.mileage != null ? `${formatNumber(car.mileage)} km` : ""],
    [
      "Engine Size",
      car.engine_capacity ? `${formatNumber(car.engine_capacity)} cc` : "",
    ],
    ["Fuel Type", car.fuel_type],
    ["Transmission", car.transmission],
    ["Drivetrain", car.drivetrain],
    ["Doors", car.doors],
    ["Seats", car.seats],
    ["Exterior Color", car.exterior_color],
    ["Interior Color", car.interior_color],
  ];

  // Cards on the Overview tab; empty values are hidden
  const keySpecs = [
    { icon: "calendar", label: "Year", value: car.year },
    { icon: "info", label: "Condition", value: car.condition },
    { icon: "body", label: "Body Type", value: car.body_type_display },
    {
      icon: "engine",
      label: "Engine",
      value: car.engine_capacity ? `${formatNumber(car.engine_capacity)} cc` : "",
    },
    { icon: "fuel", label: "Fuel Type", value: car.fuel_type },
    { icon: "transmission", label: "Transmission", value: car.transmission },
    { icon: "drivetrain", label: "Drivetrain", value: car.drivetrain },
    { icon: "door", label: "Doors", value: car.doors },
    { icon: "seat", label: "Seats", value: car.seats },
    { icon: "color", label: "Exterior Color", value: car.exterior_color },
    { icon: "color", label: "Interior Color", value: car.interior_color },
  ].filter((spec) => spec.value !== "" && spec.value != null);

  // Features tab list; falls back to the top features if no equipment is entered
  const equipmentList = car.equipment_list?.length
    ? car.equipment_list
    : car.feature_list || [];

  const arrowClass =
    "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-gray-900 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500";

  return (
    <main className="min-h-screen bg-[#e2e2e2] px-4 py-5 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-[1240px]">
        <button
          className="mb-4 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={() => navigate(-1)}
          type="button"
        >
          <span aria-hidden="true">←</span> Back to listings
        </button>

      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1.38fr)_minmax(400px,0.98fr)]">
        <div className="grid min-w-0 content-start gap-4">
        {/* Gallery */}
        <section
          aria-label="Vehicle photos"
          className="min-w-0"
        >
          <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-sm">
            {images.length > 0 ? (
              <img
                alt={title}
                className={`h-full w-full object-cover transition duration-300 ${
                  imageZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setImageZoomed((zoomed) => !zoomed)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setImageZoomed((zoomed) => !zoomed);
                  }
                }}
                aria-label={imageZoomed ? "Zoom out of vehicle photo" : "Magnify vehicle photo"}
                role="button"
                src={images[activeImage]}
                tabIndex={0}
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-medium text-slate-400">
                Photo coming soon
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  aria-label="Previous photo"
                  className={`${arrowClass} left-3`}
                  onClick={showPrevious}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Next photo"
                  className={`${arrowClass} right-3`}
                  onClick={showNext}
                  type="button"
                >
                  ›
                </button>
              </>
            )}

            {images.length > 0 && (
              <>
                <span className="absolute bottom-4 left-4 rounded-full bg-black/85 px-3 py-1.5 text-xs font-medium text-white">
                  {activeImage + 1} / {images.length}
                </span>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    aria-pressed={imageZoomed}
                    className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-lg transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    onClick={() => setImageZoomed((zoomed) => !zoomed)}
                    type="button"
                  >
                    {imageZoomed ? "− Zoom" : "⊕ Magnifier"}
                  </button>
                  <button
                    className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-lg transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    onClick={() => setLightboxOpen(true)}
                    type="button"
                  >
                    ↗ Fullscreen
                  </button>
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-white p-3 shadow-sm sm:grid-cols-6">
              {images.map((src, index) => (
                <button
                  aria-label={`Show photo ${index + 1}`}
                  className={`aspect-[4/3] overflow-hidden rounded-lg border-2 p-0 transition ${
                    index === activeImage
                      ? "border-slate-500 ring-2 ring-slate-200"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                  key={src}
                  onClick={() => {
                    setActiveImage(index);
                    setImageZoomed(false);
                  }}
                  type="button"
                >
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    src={src}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <section className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Opening times</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                <span aria-hidden="true">🇰🇪</span> Commercial
              </span>
            </div>
            <span
              className={`mt-5 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                showroomOpen ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {showroomOpen ? "Open now" : "Closed"}
            </span>
            <dl className="mt-2">
              {OPENING_HOURS.map((slot) => (
                <div
                  className="flex justify-between gap-3 border-b border-slate-100 py-3 text-xs last:border-0"
                  key={slot.label}
                >
                  <dt className="text-slate-600">{slot.label}:</dt>
                  <dd className="text-right font-bold text-slate-900">
                    {formatTime(slot.open)} - {formatTime(slot.close)}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 pt-3 text-xs">
                <dt className="text-slate-600">Public Holidays:</dt>
                <dd className="font-bold text-slate-900">Closed</dd>
              </div>
            </dl>
          </section>

          <section className="min-w-0 rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Sales representatives
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                <span aria-hidden="true">🇰🇪</span> Commercial
              </span>
            </div>
            {salesReps.length === 0 && (
              <p className="mt-5 text-[13px] text-slate-500">
                No sales representative assigned to this vehicle yet.
              </p>
            )}
            <ul className="mt-5 grid gap-4">
              {salesReps.map((rep) => (
                <li
                  className="flex min-w-0 items-center justify-between gap-3"
                  key={rep.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {rep.photo ? (
                      <img
                        alt={rep.name}
                        className="h-12 w-12 rounded-full object-cover"
                        src={getImageUrl(rep.photo)}
                      />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                        {getInitials(rep.name)}
                      </span>
                    )}
                    <span className="min-w-0 break-words text-sm font-semibold text-slate-900">
                      {rep.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {rep.phone && (
                      <a
                        aria-label={`Call ${rep.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        href={`tel:+${rep.phone}`}
                      >
                        <PhoneIcon />
                      </a>
                    )}
                    {rep.whatsapp && (
                      <a
                        aria-label={`WhatsApp ${rep.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        href={`https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
                          `Hi ${rep.name}, I'm interested in the ${title} (Stock no. ${car.stock_number}).`
                        )}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ChatIcon />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        </div>

        {/* Sidebar */}
        <aside className="grid min-w-0 content-start gap-4">
          <div className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {car.condition && (
                  <span className="rounded-md bg-orange-500 px-3 py-1 text-[11px] font-bold text-white">
                    {car.condition}
                  </span>
                )}
                {car.location && (
                  <span className="rounded-md bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-800">
                    {car.location}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
                  aria-pressed={isSaved}
                  className={`grid h-10 w-10 place-items-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    isSaved
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={handleToggleSaved}
                  title={isSaved ? "Remove from favorites" : "Save to favorites"}
                  type="button"
                >
                  <HeartIcon filled={isSaved} />
                </button>
                <button
                  aria-label={copied ? "Link copied" : "Share vehicle"}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  onClick={handleShare}
                  type="button"
                >
                  {copied ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <h1 className="mb-2 mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1.5 font-semibold shadow-sm">
                <span aria-hidden="true">🇰🇪</span> Commercial
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                <span aria-hidden="true">▧</span> #{car.stock_number || "—"}
              </span>
            </div>

            <div className="my-4 border-t border-slate-200 pt-4">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                href={WHATSAPP_ASK_PRICE_LINK}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ChatIcon /> Ask Price
              </a>
              <p className="mt-2 text-sm font-bold text-slate-900">
                KES {formatNumber(car.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 py-4">
              <div className="grid justify-items-center gap-1 rounded-lg bg-slate-50 p-4 text-center">
                <Icon className="h-4 w-4 text-slate-700" name="engine" />
                <span className="text-xs text-slate-500">Engine</span>
                <strong className="text-[13px]">
                  {car.engine_capacity
                    ? `${formatNumber(car.engine_capacity)} cc`
                    : "—"}
                </strong>
              </div>
              <div className="grid justify-items-center gap-1 rounded-lg bg-slate-50 p-4 text-center">
                <Icon className="h-4 w-4 text-slate-700" name="transmission" />
                <span className="text-xs text-slate-500">Transmission</span>
                <strong className="text-[13px]">
                  {car.transmission || "—"}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 px-2 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                onClick={() => {
                  setInquiryMessage(
                    `Hello, I'd like to book a test drive for the ${title} (Stock no. ${car.stock_number}).`
                  );
                  setInquiryOpen(true);
                }}
                type="button"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Icon name="calendar" /> Book Test Drive
                </span>
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 px-2 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                onClick={() => {
                  setInquiryMessage("");
                  setInquiryOpen(true);
                }}
                type="button"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect height="16" rx="2" width="20" x="2" y="4" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  Send Inquiry
                </span>
              </button>
            </div>
            <a
              className="mt-3 block text-center text-xs font-semibold text-green-700 hover:text-green-800"
              href={whatsappLink(
                `Hi CarMax Motors, I'm interested in the ${title} (Stock no. ${car.stock_number}). Is it still available?`
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              Or chat with us on WhatsApp
            </a>
            {saveFeedback && (
              <p className="mt-3 text-center text-xs text-slate-500" role="status">
                {saveFeedback}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div
              aria-label="Vehicle information"
              className="grid grid-cols-3 border-b border-slate-100"
              role="tablist"
            >
              {TABS.map((tab) => (
                <button
                  id={`car-tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  className={`px-2 py-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-slate-700 to-slate-600 font-semibold text-white"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-controls="car-tabpanel"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              aria-labelledby={`car-tab-${activeTab}`}
              className="p-4 sm:p-5"
              id="car-tabpanel"
              role="tabpanel"
            >
              {activeTab === "overview" && (
                <div className="grid gap-5">
                  <section>
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Icon name="wrench" /> Key Specifications
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {keySpecs.map((spec) => (
                        <div
                          className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 transition hover:bg-slate-100"
                          key={spec.label}
                        >
                          <span className="mt-0.5 text-gray-600">
                            <Icon name={spec.icon} />
                          </span>
                          <div className="min-w-0">
                            <span className="block text-[11px] text-gray-500">
                              {spec.label}
                            </span>
                            <strong className="block truncate text-[13px] text-gray-900">
                              {spec.value}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Icon name="info" /> Description
                    </h2>
                    <p className="whitespace-pre-line text-[13px] leading-relaxed text-gray-700">
                      {car.description
                        ? renderRichText(car.description)
                        : "No description provided."}
                    </p>
                  </section>

                  {car.feature_list?.length > 0 && (
                    <section>
                      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Icon name="check" /> Top Features
                      </h2>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {car.feature_list.map((feature) => (
                          <li
                            className="flex items-center gap-2 text-[13px] text-gray-700"
                            key={feature}
                          >
                            <span className="text-green-600">
                              <Icon className="h-4 w-4 shrink-0" name="check" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <>
                  <h2 className="mb-3 text-sm font-bold text-slate-900">
                    Vehicle Specifications
                  </h2>
                  <dl>
                    {specifications.map(([label, value]) => (
                      <div
                        className="flex justify-between gap-4 border-b border-slate-100 py-3 text-xs last:border-0"
                        key={label}
                      >
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="text-right font-semibold text-slate-900">
                          {value === "" || value == null ? "N/A" : value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              {activeTab === "features" && (
                <>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Icon name="check" /> Features &amp; Equipment
                  </h2>
                  {equipmentList.length > 0 ? (
                    <ul>
                      {equipmentList.map((item) => (
                        <li
                          className="flex items-center gap-3 border-b border-slate-100 py-3 text-[13px] text-slate-700 last:border-b-0"
                          key={item}
                        >
                          <span className="text-gray-600">
                            <Icon className="h-4 w-4 shrink-0" name="check" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] text-gray-700">
                      No features listed.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <div
          aria-label="Photo viewer"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
        >
          <button
            aria-label="Close photo viewer"
            className="absolute right-5 top-4 text-4xl leading-none text-white"
            onClick={() => setLightboxOpen(false)}
            type="button"
          >
            ×
          </button>
          {images.length > 1 && (
            <button
              aria-label="Previous photo"
              className={`${arrowClass} left-4`}
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              type="button"
            >
              ‹
            </button>
          )}
          <img
            alt={title}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(event) => event.stopPropagation()}
            src={images[activeImage]}
          />
          {images.length > 1 && (
            <button
              aria-label="Next photo"
              className={`${arrowClass} right-4`}
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              type="button"
            >
              ›
            </button>
          )}
        </div>
      )}
      {inquiryOpen && (
        <InquiryModal
          car={car}
          initialMessage={inquiryMessage}
          onClose={() => setInquiryOpen(false)}
        />
      )}
      </div>
    </main>
  );
};

export default CarDetail;