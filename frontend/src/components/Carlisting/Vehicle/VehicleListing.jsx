import { useEffect, useState } from "react";
import axios from "axios";
import VehicleCard from "./VehicleCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

/**
 * Lists available vehicles of one body type.
 * bodyType must match a value in the Car model: suv, sedan, hatchback,
 * station_wagon, pickup, van, minivan, commercial or other.
 */
const VehicleListing = ({ bodyType, title, emptyMessage }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    axios
      .get(`${API_URL}/api/cars/`, {
        params: { body_type: bodyType },
        signal: controller.signal,
      })
      .then((response) => {
        setCars(Array.isArray(response.data) ? response.data : []);
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) return;
        console.error("Error fetching cars:", requestError);
        setError("Unable to load vehicles. Please try again later.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [bodyType]);

  if (loading) {
    return (
      <p className="my-12 mx-5 text-center text-[#667085]" role="status">
        Loading CarMax Motors inventory...
      </p>
    );
  }

  if (error) {
    return (
      <p className="my-12 mx-5 text-center text-[#667085]" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section
      aria-label={title}
      className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 sm:pb-6 sm:pt-9 lg:px-[30px]"
    >
      <h2 className="mb-[22px] flex items-center gap-[14px] text-[clamp(1.6rem,2vw,2rem)] font-bold tracking-[-0.035em] text-gray-900 after:h-[3px] after:w-[42px] after:rounded after:bg-[#b58b4b] after:content-['']">
        {title}
      </h2>
      {cars.length === 0 ? (
        <p className="my-12 mx-5 text-center text-[#667085]">
          {emptyMessage || "No vehicles are currently available."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {cars.map((car) => (
            <VehicleCard car={car} key={car.id} />
          ))}
        </div>
      )}
    </section>
  );
};

export default VehicleListing;