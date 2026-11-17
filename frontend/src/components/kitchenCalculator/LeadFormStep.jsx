"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Loader2, MessageCircle, Phone } from "lucide-react";

/*
  Palette: Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White

  Same request as before: POST { formType, dimension, shape, package, name, email, phone, pincode }.

  What's better
  - Title, step count, Back and the "Your configuration" summary live in KitchenCostCalculator now
    (it shows your choices as chips), so they are not repeated here.
  - Errors appear next to the field (not in browser alert() pop-ups), and the first wrong field gets focus.
  - Phone and pincode accept digits only. Fields have proper labels, autocomplete and numeric keyboards.
  - The old WhatsApp tick-box was never sent to the server, so it is removed. Tell me if your API can take
    an opt-in flag and I'll add it back properly.
  - After sending, "Calculate another kitchen" resets the calculator (no full page reload).

  New props from the wrapper: onSubmitted() and onRestart().
*/

const ENDPOINT = "https://livingspacedecor.in/api/send-quote";
const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const validators = {
  name: (v) => (!v.trim() ? "Enter your name." : v.trim().length < 2 ? "Name must be at least 2 characters." : ""),
  phone: (v) => (!v ? "Enter your mobile number." : /^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number."),
  email: (v) => (!v.trim() ? "Enter your email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com."),
  pincode: (v) => (!v ? "Enter your pincode." : /^\d{6}$/.test(v) ? "" : "Enter a valid 6-digit pincode."),
};
const FIELDS = ["name", "phone", "email", "pincode"];

const inputClass = (err) =>
  `h-14 w-full rounded-sm border bg-[#F7F3ED] px-4 text-base text-[#292622] placeholder-[#292622]/45 outline-none transition-colors focus:border-[#593719] focus:bg-white focus:ring-2 focus:ring-[#C18A35]/50 ${
    err ? "border-red-600" : "border-[#292622]/25"
  }`;

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-body mb-2 block text-sm font-medium text-[#292622]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-body mt-2 flex items-start gap-1.5 text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="font-body mt-2 text-sm text-[#292622]/60">{hint}</p>
      )}
    </div>
  );
}

export default function LeadFormStep({ formData, setFormData, onSubmitted, onRestart }) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: validators[name](value) })); // re-check once an error is showing
    if (serverError) setServerError("");
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") return set(name, value.replace(/\D/g, "").slice(0, 10));
    if (name === "pincode") return set(name, value.replace(/\D/g, "").slice(0, 6));
    set(name, value);
  };
  const onBlur = (e) => {
    const { name, value } = e.target;
    if (value) setErrors((er) => ({ ...er, [name]: validators[name](value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = {};
    FIELDS.forEach((f) => (found[f] = validators[f](formData[f] || "")));
    setErrors(found);
    const bad = FIELDS.find((f) => found[f]);
    if (bad) return document.getElementById(`lead-${bad}`)?.focus();

    setSubmitting(true);
    setServerError("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          formType: "Kitchen Calculator",
          dimension: formData.dimension,
          shape: formData.shape,
          package: formData.package,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone,
          pincode: formData.pincode,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setDone(true);
        onSubmitted?.();
      } else {
        setServerError(result.error || "We couldn't send your enquiry. Please try again, or call us.");
      }
    } catch (err) {
      console.error(err);
      setServerError(err.name === "AbortError" ? "This is taking too long. Please try again, or message us on WhatsApp." : "We couldn't reach the server. Check your connection and try again, or message us on WhatsApp.");
    } finally {
      clearTimeout(timer);
      setSubmitting(false);
    }
  };

  /* ───────── Success ───────── */
  if (done) {
    return (
      <div role="status" className="py-4 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#593719] text-[#F7F3ED]">
          <Check size={30} aria-hidden="true" />
        </span>
        <p className="font-body mx-auto mt-6 max-w-lg text-base font-light leading-8 text-[#292622]/80">
          Thank you! Our kitchen design experts will review your details and contact you within 24 hours with a personalized cost estimate.
        </p>
        <p className="font-body mx-auto mt-4 max-w-lg rounded-sm bg-[#F7F3ED] px-5 py-4 text-sm leading-6 text-[#292622]/75">
          Check your email ({formData.email}) for a confirmation. You can also track your request on WhatsApp.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-body inline-flex min-h-14 items-center justify-center gap-2.5 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] ${ring}`}
          >
            <MessageCircle size={17} aria-hidden="true" />
            Track on WhatsApp
          </a>
          <button
            type="button"
            onClick={onRestart}
            className={`font-body inline-flex min-h-14 items-center justify-center rounded-sm border border-[#593719]/50 px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#593719] transition-colors duration-300 hover:border-[#593719] hover:bg-[#F7F3ED] ${ring}`}
          >
            Calculate another kitchen
          </button>
        </div>
      </div>
    );
  }

  /* ───────── Form ───────── */
  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="font-body max-w-xl text-[15px] font-light leading-7 text-[#292622]/75">
        Share your details and our expert team will send a personalized cost estimate within 24 hours.
      </p>

      {serverError && (
        <div role="alert" className="font-body mt-6 flex items-start gap-3 rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p>{serverError}</p>
            <p className="mt-1.5">
              <a href={PHONE_TEL} className="font-semibold underline underline-offset-2">Call {PHONE_DISPLAY}</a>
              {" or "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">WhatsApp us</a>.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="lead-name" label="Full name" error={errors.name}>
          <input id="lead-name" name="name" type="text" autoComplete="name" placeholder="Your full name" value={formData.name} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors.name} aria-describedby={errors.name ? "lead-name-error" : undefined} className={inputClass(errors.name)} />
        </Field>

        <Field id="lead-phone" label="Mobile number" error={errors.phone} hint="We'll only use it to share your estimate.">
          <div className="relative">
            <span className="font-body pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border-r border-[#292622]/20 pr-3 text-base text-[#292622]/70" aria-hidden="true">+91</span>
            <input id="lead-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" value={formData.phone} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "lead-phone-error" : "lead-phone-hint"} className={`${inputClass(errors.phone)} pl-[4.25rem]`} />
          </div>
        </Field>

        <Field id="lead-email" label="Email address" error={errors.email}>
          <input id="lead-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" value={formData.email} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors.email} aria-describedby={errors.email ? "lead-email-error" : undefined} className={inputClass(errors.email)} />
        </Field>

        <Field id="lead-pincode" label="Pincode" error={errors.pincode}>
          <input id="lead-pincode" name="pincode" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="6-digit pincode" value={formData.pincode} onChange={onChange} onBlur={onBlur} aria-invalid={!!errors.pincode} aria-describedby={errors.pincode ? "lead-pincode-error" : undefined} className={inputClass(errors.pincode)} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className={`font-body group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${ring}`}
      >
        {submitting ? (
          <>
            <Loader2 size={17} className="motion-safe:animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          <>
            Get my estimate
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
          </>
        )}
      </button>
    </form>
  );
}