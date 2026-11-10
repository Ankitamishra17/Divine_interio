"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sofa,
  ChefHat,
  KeyRound,
  Ruler,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import WorldMapPin from "./WorldMapPin";

const ENDPOINT = "https://livingspacedecor.in/api/send-quote";
const PHONE_DISPLAY = "+91 88266 06869";
const PHONE_TEL = "tel:+918826606869";
const WHATSAPP_URL = "https://wa.me/918826606869";
const ADDRESS =
  "Shop-LGB 28, Galaxy Diamond Plaza, Sector 4, Greater Noida West, Greater Noida, Uttar Pradesh 201009";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS,
)}`;

const PROJECTS = [
  { value: "Interior Design", icon: Sofa, note: "Living spaces, bedrooms, offices" },
  { value: "Modular Kitchen", icon: ChefHat, note: "Layouts, storage, finishes" },
  { value: "Turnkey Project", icon: KeyRound, note: "Design through to handover" },
  { value: "Architecture", icon: Ruler, note: "Plans and structure" },
];

const STEPS = [
  { label: "Project", title: "What are you planning?" },
  { label: "Space", title: "Tell us about the space" },
  { label: "Contact", title: "How can we reach you?" },
];

const EMPTY = { project: "", city: "", message: "", name: "", phone: "" };

function validateStep(step, v) {
  const e = {};
  if (step === 0 && !v.project) e.project = "Choose a project type to continue.";
  if (step === 1 && !v.city.trim()) e.city = "Enter the city where the project is.";
  if (step === 2) {
    if (!v.name.trim()) e.name = "Enter your name.";
    const digits = v.phone.replace(/\D/g, "");
    if (!v.phone.trim()) e.phone = "Enter your phone number.";
    else if (digits.length < 10 || digits.length > 12)
      e.phone = "Enter a valid phone number, for example 98765 43210.";
  }
  return e;
}

const inputClass = (err) =>
  `w-full rounded-lg border bg-white px-4 py-3.5 text-base text-[#2A1506] placeholder-[#8C7E70] outline-none transition-colors focus:border-[#2A1506] focus:ring-2 focus:ring-[#C8972B]/50 ${
    err ? "border-red-600 bg-red-50/40" : "border-[#B9AB95]"
  }`;

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function ContactLink({ href, icon: Icon, title, text, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-start gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8972B] focus-visible:ring-offset-2 rounded-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2A1506] text-[#E2B654]">
        <Icon size={19} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-[#6E6258]">{title}</span>
        <span className="block text-base leading-snug text-[#2A1506] underline decoration-[#C8972B]/0 underline-offset-4 transition group-hover:decoration-[#C8972B]">
          {text}
        </span>
      </span>
    </a>
  );
}

export default function ContactSection() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [serverError, setServerError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const headingRef = useRef(null);
  const mounted = useRef(false);

  // Move focus to the new step's heading so keyboard / screen-reader users follow along
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step, status]);

  const set = (field, value) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
    if (serverError) setServerError("");
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    const el =
      first === "project"
        ? document.querySelector('input[name="project"]')
        : document.getElementById(`contact-${first}`);
    el?.focus();
  };

  const submit = async () => {
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "Contact Form",
          name: data.name.trim(),
          phone: data.phone.trim(),
          city: data.city.trim(),
          project: data.project,
          message: data.message.trim() || "Not provided",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmittedName(data.name.trim().split(" ")[0]);
        setData(EMPTY);
        setStatus("success");
      } else {
        setServerError(
          json.error || "We couldn't send your enquiry. Please try again, or call us.",
        );
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      setServerError(
        "We couldn't reach the server. Check your connection and try again, or message us on WhatsApp.",
      );
      setStatus("idle");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };

  const restart = () => {
    setStep(0);
    setErrors({});
    setStatus("idle");
  };

  const isLast = step === STEPS.length - 1;
  const submitting = status === "submitting";

  return (
    <section id="contact" className="bg-[#F7F2EB] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-8">
          {/* Intro */}
          <div className="lg:col-span-5 lg:row-start-1">
            <h2 className="font-[Cormorant_Garamond,serif] text-4xl font-light leading-[1.1] text-[#2A1506] sm:text-5xl lg:text-6xl">
              Let&rsquo;s plan your space
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#5B5046]">
              Answer three quick questions and our design team will call you to
              book a consultation.
            </p>
          </div>

          {/* Guided form */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <div className="rounded-2xl border border-[#E3D6BF] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(42,21,6,0.35)] sm:p-9">
              {status === "success" ? (
                <div role="status" className="py-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C8972B] text-[#2A1506]">
                    <Check size={28} aria-hidden />
                  </span>
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-6 font-[Cormorant_Garamond,serif] text-4xl font-light leading-tight text-[#2A1506] outline-none"
                  >
                    Thank you{submittedName ? `, ${submittedName}` : ""}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-7 text-[#5B5046]">
                    We&rsquo;ve received your enquiry and will call you to arrange
                    your consultation. If it&rsquo;s urgent, you can reach us
                    right now.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C8972B] px-6 py-3.5 text-base font-semibold text-[#2A1506] transition-colors hover:bg-[#B8871F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A1506] focus-visible:ring-offset-2"
                    >
                      <MessageCircle size={18} aria-hidden /> Message on WhatsApp
                    </a>
                    <a
                      href={PHONE_TEL}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2A1506] px-6 py-3.5 text-base font-semibold text-[#2A1506] transition-colors hover:bg-[#2A1506] hover:text-[#F7F2EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8972B] focus-visible:ring-offset-2"
                    >
                      <Phone size={18} aria-hidden /> Call us
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-6 text-sm text-[#5B5046] underline underline-offset-4 hover:text-[#2A1506]"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Progress */}
                  <div aria-hidden className="flex gap-2">
                    {STEPS.map((s, i) => (
                      <div
                        key={s.label}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                          i <= step ? "bg-[#C8972B]" : "bg-[#E8DECB]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-[#6E6258]">
                    Step {step + 1} of {STEPS.length} &middot; {STEPS[step].label}
                  </p>

                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    id="contact-step-title"
                    className="mt-2 font-[Cormorant_Garamond,serif] text-3xl font-light leading-tight text-[#2A1506] outline-none sm:text-4xl"
                  >
                    {STEPS[step].title}
                  </h3>

                  {/* Earlier answers, so people know what they've told us */}
                  {step > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-[#F7F2EB] px-3 py-1 text-[#2A1506]">
                        {data.project}
                      </span>
                      {step > 1 && data.city.trim() && (
                        <span className="rounded-full bg-[#F7F2EB] px-3 py-1 text-[#2A1506]">
                          {data.city.trim()}
                        </span>
                      )}
                    </div>
                  )}

                  {serverError && (
                    <div
                      role="alert"
                      className="mt-5 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                      <p>{serverError}</p>
                    </div>
                  )}

                  <div className="mt-6 min-h-[250px]">
                    {/* STEP 1 */}
                    {step === 0 && (
                      <div>
                        <div
                          role="radiogroup"
                          aria-labelledby="contact-step-title"
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          {PROJECTS.map(({ value, icon: Icon, note }) => (
                            <label key={value} className="relative block">
                              <input
                                type="radio"
                                name="project"
                                value={value}
                                checked={data.project === value}
                                onChange={() => set("project", value)}
                                className="peer sr-only"
                              />
                              <span className="flex h-full cursor-pointer items-start gap-3.5 rounded-xl border border-[#B9AB95] bg-white p-4 transition-colors hover:border-[#2A1506] peer-checked:border-[#2A1506] peer-checked:bg-[#FBF5E8] peer-checked:ring-1 peer-checked:ring-[#2A1506] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C8972B] peer-focus-visible:ring-offset-2">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#8A5F17]">
                                  <Icon size={21} aria-hidden />
                                </span>
                                <span>
                                  <span className="block text-base font-medium text-[#2A1506]">
                                    {value}
                                  </span>
                                  <span className="mt-0.5 block text-sm leading-5 text-[#6E6258]">
                                    {note}
                                  </span>
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                        <FieldError id="contact-project-error">{errors.project}</FieldError>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="contact-city" className="mb-1.5 block text-sm font-medium text-[#2A1506]">
                            City
                          </label>
                          <input
                            id="contact-city"
                            type="text"
                            autoComplete="address-level2"
                            placeholder="Where is the project located?"
                            value={data.city}
                            onChange={(e) => set("city", e.target.value)}
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? "contact-city-error" : undefined}
                            className={inputClass(errors.city)}
                          />
                          <FieldError id="contact-city-error">{errors.city}</FieldError>
                        </div>
                        <div>
                          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[#2A1506]">
                            Anything we should know?{" "}
                            <span className="font-normal text-[#6E6258]">(optional)</span>
                          </label>
                          <textarea
                            id="contact-message"
                            rows={4}
                            placeholder="Property type, size, timeline, budget range…"
                            value={data.message}
                            onChange={(e) => set("message", e.target.value)}
                            className={`${inputClass(false)} resize-y`}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[#2A1506]">
                            Your name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Full name"
                            value={data.name}
                            onChange={(e) => set("name", e.target.value)}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "contact-name-error" : undefined}
                            className={inputClass(errors.name)}
                          />
                          <FieldError id="contact-name-error">{errors.name}</FieldError>
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-[#2A1506]">
                            Phone number
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="98765 43210"
                            value={data.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? "contact-phone-error" : "contact-phone-hint"}
                            className={inputClass(errors.phone)}
                          />
                          <p id="contact-phone-hint" className="mt-2 text-sm text-[#6E6258]">
                            We&rsquo;ll use this only to contact you about your enquiry.
                          </p>
                          <FieldError id="contact-phone-error">{errors.phone}</FieldError>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex items-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setStep(step - 1);
                        }}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-3.5 text-base font-medium text-[#2A1506] transition-colors hover:bg-[#F7F2EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8972B] disabled:opacity-50"
                      >
                        <ArrowLeft size={18} aria-hidden /> Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-busy={submitting}
                      className="ml-auto inline-flex flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#C8972B] px-6 py-3.5 text-base font-semibold text-[#2A1506] transition-colors hover:bg-[#B8871F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A1506] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none sm:min-w-[220px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : isLast ? (
                        "Book consultation"
                      ) : (
                        <>
                          Continue <ArrowRight size={18} aria-hidden />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Direct contact */}
          <div className="lg:col-span-5 lg:row-start-2">
            <p className="text-sm text-[#6E6258]">Prefer to talk now?</p>
            <div className="mt-2 divide-y divide-[#E3D6BF]">
              <ContactLink href={PHONE_TEL} icon={Phone} title="Call us" text={PHONE_DISPLAY} />
              <ContactLink
                href={WHATSAPP_URL}
                icon={MessageCircle}
                title="WhatsApp"
                text="Chat with our team"
                external
              />
              <ContactLink
                href={MAPS_URL}
                icon={MapPin}
                title="Visit our studio"
                text={ADDRESS}
                external
              />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <WorldMapPin />
        </div>
      </div>
    </section>
  );
}