import { useEffect, useState } from "react";
import {
  Banner,
  Field,
  Modal,
  inputClass,
  inputErrorClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./Adminui";

const PAYMENT_METHODS = [
  ["cash", "Cash"],
  ["mpesa", "M-Pesa"],
  ["bank_transfer", "Bank transfer"],
  ["financing", "Financing / loan"],
  ["other", "Other"],
];

// Today's date in Nairobi, as YYYY-MM-DD
const todayInNairobi = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

const makeEmptyForm = () => ({
  car: "",
  buyer_name: "",
  buyer_phone: "",
  buyer_email: "",
  buyer_address: "",
  sale_price: "",
  amount_paid: "0",
  payment_method: "cash",
  sold_at: todayInNairobi(),
  notes: "",
});

/**
 * "Close a sale" form. Creating the sale also creates its invoice, hides the
 * vehicle from the website, and records who closed it.
 *
 * - api: axios client with /sales/ and /sales/sellable-cars/ endpoints
 * - initialCarId: vehicle to preselect (optional)
 * - onSaved(sale): called with the new sale
 * - onClose: called when the person cancels
 */
const SaleFormModal = ({ api, initialCarId, onSaved, onClose }) => {
  const [form, setForm] = useState(makeEmptyForm);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/sales/sellable-cars/", { signal: controller.signal })
      .then(({ data }) => {
        setCars(data);
        const car = data.find((item) => String(item.id) === String(initialCarId));
        if (car) {
          setForm((current) => ({
            ...current,
            car: String(car.id),
            sale_price: String(Number(car.price)),
          }));
        }
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setErrors({ form: "Could not load the list of vehicles. Please try again." });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCars(false);
      });

    return () => controller.abort();
  }, [api, initialCarId]);

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const chooseCar = (event) => {
    const carId = event.target.value;
    const car = cars.find((item) => String(item.id) === carId);
    setForm((current) => ({
      ...current,
      car: carId,
      sale_price: car ? String(Number(car.price)) : current.sale_price,
    }));
    setErrors((current) => ({ ...current, car: undefined }));
  };

  const fieldError = (name) => [].concat(errors[name] ?? []).join(" ");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const clientErrors = {};
    if (!form.car) clientErrors.car = "Choose the vehicle that was sold.";
    if (!form.buyer_name.trim()) clientErrors.buyer_name = "Enter the buyer's name.";
    if (form.sale_price === "" || Number(form.sale_price) <= 0) {
      clientErrors.sale_price = "Enter the sale price.";
    }
    if (Number(form.amount_paid || 0) > Number(form.sale_price || 0)) {
      clientErrors.amount_paid = "The amount paid cannot be more than the sale price.";
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const { data } = await api.post("/sales/", {
        car: Number(form.car),
        buyer_name: form.buyer_name.trim(),
        buyer_phone: form.buyer_phone.trim(),
        buyer_email: form.buyer_email.trim(),
        buyer_address: form.buyer_address.trim(),
        sale_price: form.sale_price,
        amount_paid: form.amount_paid === "" ? "0" : form.amount_paid,
        payment_method: form.payment_method,
        sold_at: form.sold_at,
        notes: form.notes.trim(),
      });
      onSaved(data);
    } catch (requestError) {
      if (requestError.response?.status === 400 && requestError.response.data) {
        setErrors(requestError.response.data);
      } else if (requestError.response?.status === 403) {
        setErrors({ form: "You do not have permission to close sales." });
      } else {
        setErrors({ form: "Could not save this sale. Please try again." });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      description="Fill in the buyer and payment details. The invoice is created when you save."
      footer={
        <>
          <button className={secondaryButtonClass} disabled={saving} onClick={onClose} type="button">
            Cancel
          </button>
          <button className={primaryButtonClass} disabled={saving || loadingCars} form="close-sale-form" type="submit">
            {saving ? "Saving..." : "Create invoice"}
          </button>
        </>
      }
      onClose={() => {
        if (!saving) onClose();
      }}
      title="Close a sale"
    >
      <form className="grid gap-4" id="close-sale-form" noValidate onSubmit={handleSubmit}>
        {errors.form && <Banner>{errors.form}</Banner>}
        {errors.non_field_errors && <Banner>{[].concat(errors.non_field_errors).join(" ")}</Banner>}

        <Field error={fieldError("car")} label="Vehicle sold" required>
          <select
            aria-invalid={Boolean(fieldError("car"))}
            className={`${inputClass} ${fieldError("car") ? inputErrorClass : ""}`}
            disabled={loadingCars}
            onChange={chooseCar}
            value={form.car}
          >
            <option value="">{loadingCars ? "Loading vehicles..." : "Choose a vehicle"}</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.label} · {car.stock_number}
                {car.is_available ? "" : " (hidden)"}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field error={fieldError("buyer_name")} label="Buyer's name" required>
            <input
              aria-invalid={Boolean(fieldError("buyer_name"))}
              className={`${inputClass} ${fieldError("buyer_name") ? inputErrorClass : ""}`}
              onChange={update("buyer_name")}
              value={form.buyer_name}
            />
          </Field>
          <Field error={fieldError("buyer_phone")} label="Phone">
            <input className={inputClass} inputMode="tel" onChange={update("buyer_phone")} value={form.buyer_phone} />
          </Field>
          <Field error={fieldError("buyer_email")} label="Email">
            <input className={inputClass} onChange={update("buyer_email")} type="email" value={form.buyer_email} />
          </Field>
          <Field error={fieldError("buyer_address")} label="Address">
            <input className={inputClass} onChange={update("buyer_address")} value={form.buyer_address} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field error={fieldError("sale_price")} hint="Starts at the listed price; change it if you agreed a different one." label="Sale price (KES)" required>
            <input
              aria-invalid={Boolean(fieldError("sale_price"))}
              className={`${inputClass} ${fieldError("sale_price") ? inputErrorClass : ""}`}
              min="0"
              onChange={update("sale_price")}
              step="0.01"
              type="number"
              value={form.sale_price}
            />
          </Field>
          <Field error={fieldError("amount_paid")} hint="Deposit or full payment received so far." label="Amount paid (KES)">
            <input
              aria-invalid={Boolean(fieldError("amount_paid"))}
              className={`${inputClass} ${fieldError("amount_paid") ? inputErrorClass : ""}`}
              min="0"
              onChange={update("amount_paid")}
              step="0.01"
              type="number"
              value={form.amount_paid}
            />
          </Field>
          <Field label="Payment method">
            <select className={inputClass} onChange={update("payment_method")} value={form.payment_method}>
              {PAYMENT_METHODS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field error={fieldError("sold_at")} label="Date of sale">
            <input className={inputClass} onChange={update("sold_at")} type="date" value={form.sold_at} />
          </Field>
        </div>

        <Field hint="Shown on the invoice." label="Notes">
          <textarea className={`${inputClass} resize-y`} onChange={update("notes")} rows={2} value={form.notes} />
        </Field>
      </form>
    </Modal>
  );
};

export default SaleFormModal;