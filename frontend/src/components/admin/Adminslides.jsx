import { useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiImage,
  FiPlus,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { adminApi, asList, getImageUrl } from "../staff/Staffapi";
import {
  Banner,
  ConfirmDialog,
  Field,
  Modal,
  PageHeader,
  StatusPill,
  inputClass,
  inputErrorClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./Adminui";

const MAX_IMAGE_MB = 8;

const EMPTY_FORM = {
  tag: "",
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  is_active: true,
};

const LINK_SUGGESTIONS = [
  "/car-listing",
  "/financing-plans",
  "/direct-importation",
  "/driving-school",
  "/about",
];

// Same rule as the server: a page on this site, or a normal web address
const linkIsValid = (value) => {
  const link = value.trim();
  if (!link) return true;
  if (link.startsWith("/") && !link.startsWith("//")) return true;
  return /^https?:\/\//i.test(link);
};

/** Mimics how the slide looks on the home page. */
const SlidePreview = ({ imageSrc, form }) => (
  <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-900">
    {imageSrc ? (
      <img alt="" className="h-full w-full object-cover" src={imageSrc} />
    ) : (
      <div className="grid h-full place-items-center text-zinc-600">
        <FiImage aria-hidden="true" className="size-8" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
    <div className="absolute inset-0 flex items-center p-4">
      <div className="max-w-[75%] rounded-lg border border-white/10 bg-zinc-950/45 p-3 backdrop-blur-md">
        {form.tag && (
          <p className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-zinc-300">
            <span className="size-1 rounded-full bg-white" />
            {form.tag}
          </p>
        )}
        <p className="mt-1 text-sm font-bold leading-tight text-white">
          {form.title || "Your title appears here"}
        </p>
        {form.subtitle && (
          <p className="mt-1 text-[9px] leading-snug text-zinc-300">{form.subtitle}</p>
        )}
        {form.button_text && (
          <span className="mt-2 inline-block rounded bg-white px-2 py-1 text-[9px] font-semibold text-slate-900">
            {form.button_text} →
          </span>
        )}
      </div>
    </div>
  </div>
);

const AdminSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [editing, setEditing] = useState(null); // null | "new" | slide
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    adminApi
      .get("/slides/", { signal: controller.signal })
      .then(({ data }) => setSlides(asList(data)))
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load the slides. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );
  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview]
  );

  const openForm = (slide) => {
    setErrors({});
    setImageFile(null);
    setForm(
      slide === "new"
        ? EMPTY_FORM
        : {
            tag: slide.tag || "",
            title: slide.title,
            subtitle: slide.subtitle || "",
            button_text: slide.button_text || "",
            button_link: slide.button_link || "",
            is_active: slide.is_active,
          }
    );
    setEditing(slide);
  };

  const closeForm = () => {
    if (!saving) setEditing(null);
  };

  const update = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const fieldError = (name) => [].concat(errors[name] ?? []).join(" ");

  const chooseImage = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: `Choose an image under ${MAX_IMAGE_MB} MB.` }));
      return;
    }
    setErrors((current) => {
      const next = { ...current };
      delete next.image;
      return next;
    });
    setImageFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const isNew = editing === "new";
    const clientErrors = {};
    if (isNew && !imageFile) clientErrors.image = "Choose an image for this slide.";
    if (!form.title.trim()) clientErrors.title = "Enter a title.";
    if (!linkIsValid(form.button_link)) {
      clientErrors.button_link = "Use a page like /car-listing, or a full address starting with https://";
    } else if (form.button_text.trim() && !form.button_link.trim()) {
      clientErrors.button_link = "Add a link for the button, or clear the button text.";
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const data = new FormData();
    data.append("tag", form.tag.trim());
    data.append("title", form.title.trim());
    data.append("subtitle", form.subtitle.trim());
    data.append("button_text", form.button_text.trim());
    data.append("button_link", form.button_link.trim());
    data.append("is_active", String(form.is_active));
    if (imageFile) data.append("image", imageFile);

    setSaving(true);
    setErrors({});

    try {
      const { data: saved } = isNew
        ? await adminApi.post("/slides/", data)
        : await adminApi.patch(`/slides/${editing.id}/`, data);

      setSlides((current) =>
        isNew ? [...current, saved] : current.map((item) => (item.id === saved.id ? saved : item))
      );
      setNotice(isNew ? "The slide was added to the home page." : "The slide was updated.");
      setEditing(null);
    } catch (requestError) {
      if (requestError.response?.status === 400 && requestError.response.data) {
        setErrors(requestError.response.data);
      } else {
        setErrors({ form: "Could not save this slide. Please try again." });
      }
    } finally {
      setSaving(false);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const previous = slides;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next); // show the new order straight away
    setError("");

    try {
      const { data } = await adminApi.post("/slides/reorder/", { ids: next.map((slide) => slide.id) });
      setSlides(asList(data));
    } catch {
      setSlides(previous);
      setError("Could not change the order. Please try again.");
    }
  };

  const toggleActive = async (slide) => {
    setBusyId(slide.id);
    setError("");

    try {
      const body = new FormData();
      body.append("is_active", String(!slide.is_active));
      const { data } = await adminApi.patch(`/slides/${slide.id}/`, body);
      setSlides((current) => current.map((item) => (item.id === data.id ? data : item)));
    } catch {
      setError("Could not change this slide.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/slides/${deleteTarget.id}/`);
      setSlides((current) => current.filter((item) => item.id !== deleteTarget.id));
      setNotice("The slide was deleted.");
    } catch {
      setError("Could not delete this slide.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const isNew = editing === "new";
  const currentImage =
    imagePreview || (editing && editing !== "new" && editing.image ? getImageUrl(editing.image) : null);
  const activeCount = slides.filter((slide) => slide.is_active).length;

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <button className={primaryButtonClass} onClick={() => openForm("new")} type="button">
            <FiPlus aria-hidden="true" className="size-4" />
            Add slide
          </button>
        }
        description="The pictures and text in the banner at the top of the home page. Slides appear in the order shown here."
        title="Home page slides"
      />

      {error && <Banner onDismiss={() => setError("")}>{error}</Banner>}
      {notice && (
        <Banner onDismiss={() => setNotice("")} tone="success">
          {notice}
        </Banner>
      )}

      {!loading && activeCount === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          No active slides yet, so the home page is showing its built-in default slides. As soon as
          you add and activate a slide here, the defaults are replaced by yours.
        </p>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
          <span className="mr-3 size-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
          Loading slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <FiImage aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-4 font-semibold text-slate-900">No slides yet</h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your first slide with a picture, a title and an optional button.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {slides.map((slide, index) => (
            <li
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                slide.is_active ? "border-slate-200" : "border-dashed border-slate-300 opacity-75"
              }`}
              key={slide.id}
            >
              <div className="relative aspect-[16/9] bg-zinc-900">
                <img alt="" className="h-full w-full object-cover" src={getImageUrl(slide.image)} />
                <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-black/70 text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  {slide.tag && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{slide.tag}</p>
                  )}
                  <h2 className="font-semibold leading-snug text-slate-900">{slide.title}</h2>
                  {slide.subtitle && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{slide.subtitle}</p>
                  )}
                  {slide.button_text && (
                    <p className="mt-2 text-xs text-slate-500">
                      Button: <span className="font-semibold text-slate-700">{slide.button_text}</span>
                      {" → "}
                      <span className="break-all">{slide.button_link}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <button
                    className="disabled:opacity-60"
                    disabled={busyId === slide.id}
                    onClick={() => toggleActive(slide)}
                    title={slide.is_active ? "Click to hide from the home page" : "Click to show on the home page"}
                    type="button"
                  >
                    <StatusPill activeLabel="Showing" active={slide.is_active} inactiveLabel="Hidden" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      aria-label={`Move "${slide.title}" earlier`}
                      className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      title="Move earlier"
                      type="button"
                    >
                      <FiArrowUp aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      aria-label={`Move "${slide.title}" later`}
                      className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      disabled={index === slides.length - 1}
                      onClick={() => move(index, 1)}
                      title="Move later"
                      type="button"
                    >
                      <FiArrowDown aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      aria-label={`Edit "${slide.title}"`}
                      className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => openForm(slide)}
                      title="Edit"
                      type="button"
                    >
                      <FiEdit2 aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      aria-label={`Delete "${slide.title}"`}
                      className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setDeleteTarget(slide)}
                      title="Delete"
                      type="button"
                    >
                      <FiTrash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal
          description="The preview shows roughly how the slide will look on the home page."
          footer={
            <>
              <button className={secondaryButtonClass} disabled={saving} onClick={closeForm} type="button">
                Cancel
              </button>
              <button className={primaryButtonClass} disabled={saving} form="slide-form" type="submit">
                {saving ? "Saving..." : isNew ? "Add slide" : "Save changes"}
              </button>
            </>
          }
          onClose={closeForm}
          title={isNew ? "Add slide" : "Edit slide"}
        >
          <form className="grid gap-4" id="slide-form" noValidate onSubmit={handleSubmit}>
            {errors.form && <Banner>{errors.form}</Banner>}

            <SlidePreview form={form} imageSrc={currentImage} />

            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-within:ring-4 focus-within:ring-slate-100">
                <FiUpload aria-hidden="true" className="size-4" />
                {currentImage ? "Change picture" : "Choose picture"}
                <input accept="image/*" className="sr-only" onChange={chooseImage} type="file" />
              </label>
              {fieldError("image") ? (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldError("image")}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Use a wide picture, at least 1920 px across, under {MAX_IMAGE_MB} MB. Keep the main
                  subject near the centre: the edges are cropped on phones.
                </p>
              )}
            </div>

            <Field error={fieldError("tag")} hint="Small label above the title, e.g. FEATURED MODEL" label="Label">
              <input className={inputClass} maxLength={60} onChange={update("tag")} value={form.tag} />
            </Field>

            <Field error={fieldError("title")} label="Title" required>
              <input
                aria-invalid={Boolean(fieldError("title"))}
                className={`${inputClass} ${fieldError("title") ? inputErrorClass : ""}`}
                maxLength={140}
                onChange={update("title")}
                value={form.title}
              />
            </Field>

            <Field error={fieldError("subtitle")} hint={`${form.subtitle.length}/300 characters`} label="Description">
              <textarea
                className={`${inputClass} resize-y`}
                maxLength={300}
                onChange={update("subtitle")}
                rows={3}
                value={form.subtitle}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field error={fieldError("button_text")} hint="Leave empty for no button" label="Button text">
                <input className={inputClass} maxLength={40} onChange={update("button_text")} value={form.button_text} />
              </Field>
              <Field error={fieldError("button_link")} hint="A page on the site, or a full https:// address" label="Button link">
                <input
                  aria-invalid={Boolean(fieldError("button_link"))}
                  className={`${inputClass} ${fieldError("button_link") ? inputErrorClass : ""}`}
                  list="slide-links"
                  onChange={update("button_link")}
                  placeholder="/car-listing"
                  value={form.button_link}
                />
                <datalist id="slide-links">
                  {LINK_SUGGESTIONS.map((link) => (
                    <option key={link} value={link} />
                  ))}
                </datalist>
              </Field>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
              <input
                checked={form.is_active}
                className="size-4 accent-slate-900"
                onChange={update("is_active")}
                type="checkbox"
              />
              Show this slide on the home page
            </label>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          busy={deleting}
          message={`"${deleteTarget.title}" and its picture will be removed. To keep it for later, hide it instead.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Delete this slide?"
        />
      )}
    </div>
  );
};

export default AdminSlides;