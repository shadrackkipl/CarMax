import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SlideImage1 from "../../assets/slide/slide1.png";
import SlideImage2 from "../../assets/slide/slide2.png";
import SlideImage3 from "../../assets/slide/slide3.png";
import SlideImage4 from "../../assets/slide/slide4.png";
import { API_URL, getImageUrl } from "./Homevehicleutils";

// Shown until the administrator adds slides in the admin panel (or if the
// server cannot be reached), so the home page is never empty.
const DEFAULT_SLIDES = [
  {
    id: "default-1",
    image: SlideImage1,
    tag: "FEATURED MODEL",
    title: "Redefining Adventure: The All-New Hilux",
    subtitle: "Rugged capability meets sophisticated tech. Built to dominate every Kenyan road.",
    buttonText: "View Inventory",
    buttonLink: "/car-listing",
  },
  {
    id: "default-2",
    image: SlideImage2,
    tag: "PREMIUM SELECTION",
    title: "Precision Performance for Every Journey",
    subtitle: "Kenya's trusted partner for high-quality, fully inspected pre-owned and new vehicles.",
    buttonText: "Explore Models",
    buttonLink: "/car-listing",
  },
  {
    id: "default-3",
    image: SlideImage3,
    tag: "VERSATILE DRIVES",
    title: "Built for the City. Ready for the Wild.",
    subtitle: "From daily city commutes to weekend getaways, find the perfect ride for your lifestyle.",
    buttonText: "Browse Collection",
    buttonLink: "/car-listing",
  },
  {
    id: "default-4",
    image: SlideImage4,
    tag: "EXCLUSIVE OFFERS",
    title: "Drive the Future. Own the Road.",
    subtitle: "Unbeatable deals, flexible financing, and a seamless buying experience at CarMax Motors.",
    buttonText: "Browse Inventory",
    buttonLink: "/car-listing",
  },
];

// Only site pages ("/...") and normal web addresses become links
const resolveLink = (link) => {
  const value = (link || "").trim();
  if (value.startsWith("/") && !value.startsWith("//")) return { internal: true, href: value };
  if (/^https?:\/\//i.test(value)) return { internal: false, href: value };
  return null;
};

const fromApi = (slide) => ({
  id: slide.id,
  image: getImageUrl(slide.image),
  tag: slide.tag,
  title: slide.title,
  subtitle: slide.subtitle,
  buttonText: slide.button_text,
  buttonLink: slide.button_link,
});

const buttonClass =
  "group/btn relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 sm:px-6 sm:py-3 sm:text-sm";

const ArrowIcon = () => (
  <svg
    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SlideCard = () => {
  const [slides, setSlides] = useState(null); // null while loading
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${API_URL}/api/slides/`, { signal: controller.signal })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        setSlides(list.length > 0 ? list.map(fromApi) : DEFAULT_SLIDES);
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) return;
        console.error("Error loading slides:", requestError);
        setSlides(DEFAULT_SLIDES);
      });

    return () => controller.abort();
  }, []);

  const count = slides?.length ?? 0;
  const current = count > 0 ? activeIndex % count : 0;

  useEffect(() => {
    if (isPaused || count < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % count);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, count]);

  const showSlide = (index) => {
    if (count === 0) return;
    setActiveIndex((index + count) % count);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const swipeDistance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      showSlide(current + (swipeDistance < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  if (slides === null) {
    return (
      <div
        aria-hidden="true"
        className="aspect-[4/5] w-full animate-pulse bg-zinc-900 sm:aspect-[16/9] lg:aspect-[21/9]"
      />
    );
  }

  return (
    <div
      className="group relative w-full overflow-hidden border border-zinc-200/80 bg-zinc-950 shadow-2xl transition-all duration-300 dark:border-zinc-800"
      role="region"
      aria-label="Featured vehicles"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
        {slides.map((slide, index) => {
          const isActive = index === current;
          const link = slide.buttonText ? resolveLink(slide.buttonLink) : null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out motion-reduce:transition-none ${
                isActive
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent sm:bg-gradient-to-r sm:from-zinc-950/90 sm:via-zinc-950/50 sm:to-transparent" />

              <div className="absolute inset-0 flex items-end p-4 pb-12 sm:items-center sm:p-10 lg:p-16">
                <div
                  className={`max-w-xl rounded-xl border border-white/10 bg-zinc-950/45 p-4 backdrop-blur-md transition-all duration-700 sm:p-8 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.tag && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 sm:text-xs">
                        {slide.tag}
                      </span>
                    </div>
                  )}

                  <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h2>

                  {slide.subtitle && (
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:mt-3 sm:text-base">
                      {slide.subtitle}
                    </p>
                  )}

                  {link && (
                    <div className="mt-4 flex items-center gap-4 sm:mt-6">
                      {link.internal ? (
                        <Link className={buttonClass} tabIndex={isActive ? 0 : -1} to={link.href}>
                          <span>{slide.buttonText}</span>
                          <ArrowIcon />
                        </Link>
                      ) : (
                        <a
                          className={buttonClass}
                          href={link.href}
                          rel="noopener noreferrer"
                          tabIndex={isActive ? 0 : -1}
                          target="_blank"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowIcon />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => showSlide(current - 1)}
              aria-label="Show previous slide"
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/30 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-zinc-950/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:flex"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => showSlide(current + 1)}
              aria-label="Show next slide"
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/30 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-zinc-950/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:flex"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 px-4 sm:bottom-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => showSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === current ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SlideCard;