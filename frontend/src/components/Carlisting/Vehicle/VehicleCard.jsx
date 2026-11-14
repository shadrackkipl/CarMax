import { Link } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const formatNumber = (value) => Number(value || 0).toLocaleString("en-KE");

const getImageUrl = (path) => {
  try {
    return new URL(path, `${API_URL}/`).toString();
  } catch {
    return null;
  }
};

const VehicleCard = ({ car }) => {
  const imageUrl = car.image ? getImageUrl(car.image) : null;

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_5px_16px_rgba(16,24,40,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#d7c5a5] hover:shadow-[0_18px_38px_rgba(16,24,40,0.12)]">
      <div className="relative h-[220px] shrink-0 overflow-hidden bg-slate-100 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[35%] after:bg-gradient-to-t after:from-slate-900/20 after:to-transparent after:content-['']">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={` ${car.make} ${car.model_name} ${car.year}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#667085]">
            No Image
          </div>
        )}
        <span className="absolute left-[14px] top-[14px] rounded-full border border-white/65 bg-white/95 px-[11px] py-1.5 text-xs font-bold text-[#315b45] shadow-[0_3px_10px_rgba(16,24,40,0.12)]">
          In Stock
        </span>
      </div>

      <div className="flex h-full flex-1 flex-col p-[18px] sm:px-[21px] sm:pb-[21px] sm:pt-5">
        <h2 className="m-0 text-lg font-bold leading-[1.4] tracking-[-0.02em] text-[#101828]">
         {car.make} {car.model_name} {car.year}
        </h2>
        <p className="mt-0.5 text-xs font-medium text-[#667085]">
          Stock no. {car.stock_number || "Not assigned"}
        </p>

        <div className="mt-[18px] grid grid-cols-2 gap-x-[18px] gap-y-[15px] border-y border-[#edf0f4] py-4">
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-xs font-medium text-[#667085]">Mileage</span>
            <strong className="break-words text-[13px] font-semibold text-gray-900">{formatNumber(car.mileage)} km</strong>
          </div>
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-xs font-medium text-[#667085]">Engine</span>
            <strong className="break-words text-[13px] font-semibold text-gray-900">
              {car.engine_capacity
                ? `${formatNumber(car.engine_capacity)} cc`
                : "—"}
            </strong>
          </div>
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-xs font-medium text-[#667085]">Drivetrain</span>
            <strong className="break-words text-[13px] font-semibold text-gray-900">{car.drivetrain || "—"}</strong>
          </div>
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-xs font-medium text-[#667085]">Make</span>
            <strong className="break-words text-[13px] font-semibold text-gray-900">{car.make}</strong>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-start justify-between gap-2.5 pt-[18px] sm:flex-row sm:items-end">
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-xs font-medium text-[#667085]">Price</span>
            <strong className="whitespace-nowrap text-lg font-bold text-[#101828]">
              KES {formatNumber(car.price)}
            </strong>
          </div>
          {/* The ::after layer stretches the link over the whole card */}
          <Link
            className="relative z-10 w-full flex-none rounded-[10px] bg-[#003b70] px-[15px] py-[11px] text-center text-[13px] font-bold text-white no-underline transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8b878] sm:w-auto"
            to={`/cars/${car.id}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;