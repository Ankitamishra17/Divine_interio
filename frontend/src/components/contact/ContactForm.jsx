"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sofa,
  ChefHat,
  KeyRound,
  Ruler,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import WorldMapPin from "./WorldMapPin";

/*
  Palette (unchanged)
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED | Beige #E8DED0 | Charcoal #292622 | White #FFFFFF

  Layout: a light section (Soft Beige) with a faint photo under an ivory veil. Heading and direct contact sit on the
  left, one ivory form card floats on the right. On phones: heading, card, then contact details.

  Form: three short steps, one question each.
    1  Project type   2  City (+ optional notes)   3  Name and phone

  What's better in this version
  - Stepper shows your earlier answers under each step; tap a finished step to go back and change it.
  - Project choices are a 2 x 2 grid of cards: less scrolling, easier to compare.
  - Typing steps put the cursor in the field for you (city, then name).
  - Phone field has a fixed +91, so people only type the 10 digits.
  - Steps fade in softly; reduced motion is respected.
  - The thank-you card repeats what was sent and says when to expect the call (open or closed).

  PHOTO: put an interior photo at /public/image/contact-bg.webp (wide, about 1920x1100).
  If the file is missing, the section simply shows Soft Beige.
*/

const BG_IMAGE = "/image/contact-bg.webp";

const ENDPOINT = "https://livingspacedecor.in/api/send-quote";
const PHONE_DISPLAY = "+91 9876543210";
const PHONE_TEL = "tel:+919876543210";
const WHATSAPP_URL = "https://wa.me/919876543210";
const ADDRESS =
  "Shop-LGB 28, Galaxy Diamond Plaza, Sector 4, Greater Noida West, Greater Noida, Uttar Pradesh 201009";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const PROJECTS = [
  { value: "Interior Design", icon: Sofa, note: "Living spaces, bedrooms, offices" },
  { value: "Modular Kitchen", icon: ChefHat, note: "Layouts, storage, finishes" },
  { value: "Turnkey Project", icon: KeyRound, note: "Design through to handover" },
  { value: "Architecture", icon: Ruler, note: "Plans and structure" },
];
const CITIES = ["Noida", "Greater Noida", "Ghaziabad", "Delhi"];

const STEPS = [
  { label: "Project", title: "What are you planning?", fields: ["project"] },
  { label: "Location", title: "Where is the property?", fields: ["city"] },
  { label: "Contact", title: "How can we reach you?", fields: ["name", "phone"] },
];

const EMPTY = { project: "", city: "", message: "", name: "", phone: "" };
const EASE = [0.22, 1, 0.36, 1];

/* Studio hours in Indian time, so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return hour >= 10 && hour < 19;
}

/* Accepts 98765 43210, +91 98765 43210, 091...; returns the 10 digits or null */
function parsePhone(raw) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}
const spaced = (ten) => `${ten.slice(0, 5)} ${ten.slice(5)}`;
const formatPhone = (ten) => `+91 ${spaced(ten)}`; // what we send to the backend

function validateField(field, v) {
  switch (field) {
    case "project":
      return v.project ? "" : "Choose a project type to continue.";
    case "city":
      return v.city.trim() ? "" : "Enter the city of the project.";
    case "name":
      return v.name.trim() ? "" : "Enter your name.";
    case "phone":
      if (!v.phone.trim()) return "Enter your phone number.";
      return parsePhone(v.phone) ? "" : "Enter a 10 digit mobile number, for example 98765 43210.";
    default:
      return "";
  }
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2";
const ringWall = `${ring} focus-visible:ring-offset-[#F7F3ED]`;
const ringCard = `${ring} focus-visible:ring-offset-white`;

const fieldClass = (err) =>
  `w-full rounded-sm border bg-[#F7F3ED] px-4 py-3.5 text-base text-[#292622] placeholder-[#292622]/45 outline-none transition-colors focus:border-[#593719] focus:bg-white focus:ring-2 focus:ring-[#C18A35]/50 ${
    err ? "border-red-600" : "border-[#292622]/25"
  }`;

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function ContactRow({ href, icon: Icon, title, text, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group flex items-start gap-4 rounded-sm py-4 ${ringWall}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C18A35]/70 text-[#C18A35] transition-colors duration-300 group-hover:bg-[#C18A35] group-hover:text-[#292622]">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-[#292622]/60">{title}</span>
        <span className="block text-base leading-snug text-[#292622]">{text}</span>
      </span>
    </a>
  );
}

export default function ContactSection() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [showMsg, setShowMsg] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [serverError, setServerError] = useState("");
  const [summary, setSummary] = useState({ name: "", project: "", city: "", phone: "" });
  const [open, setOpen] = useState(null);
  const [trap, setTrap] = useState("");
  const [bgOk, setBgOk] = useState(true);
  const headingRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  // New step: typing steps put the cursor in the field, others focus the heading (for screen readers)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (status === "idle" && step === 1) return document.getElementById("contact-city")?.focus({ preventScroll: true });
    if (status === "idle" && step === 2) return document.getElementById("contact-name")?.focus({ preventScroll: true });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  const set = (field, value) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
    if (serverError) setServerError("");
  };

  // Show an error when someone leaves a field, not while they are typing
  const blur = (field) => {
    if (field === "phone") {
      const ten = parsePhone(data.phone);
      if (ten) setData((d) => ({ ...d, phone: spaced(ten) }));
    }
    if (!data[field]) return;
    setErrors((e) => ({ ...e, [field]: validateField(field, data) }));
  };

  const focusField = (field) => {
    const el = field === "project" ? document.querySelector('input[name="project"]') : document.getElementById(`contact-${field}`);
    el?.focus();
  };

  const goTo = (i) => {
    if (i >= step || status === "submitting") return;
    setErrors({});
    setServerError("");
    setStep(i);
  };

  const submit = async () => {
    setStatus("submitting");
    setServerError("");
    const ten = parsePhone(data.phone);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          formType: "Contact Form",
          name: data.name.trim(),
          phone: formatPhone(ten),
          city: data.city.trim(),
          project: data.project,
          message: data.message.trim() || "Not provided",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setSummary({ name: data.name.trim().split(" ")[0], project: data.project, city: data.city.trim(), phone: formatPhone(ten) });
        setData(EMPTY);
        setShowMsg(false);
        setStatus("success");
      } else {
        setServerError(json.error || "We couldn't send your enquiry. Please try again, or call us.");
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.name === "AbortError"
          ? "This is taking too long. Please try again, or message us on WhatsApp."
          : "We couldn't reach the server. Check your connection and try again, or message us on WhatsApp."
      );
      setStatus("idle");
    } finally {
      clearTimeout(timer);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    const errs = {};
    STEPS[step].fields.forEach((f) => (errs[f] = validateField(f, data)));
    setErrors(errs);
    const bad = STEPS[step].fields.find((f) => errs[f]);
    if (bad) return focusField(bad);
    if (step < STEPS.length - 1) return setStep(step + 1);
    if (trap) {
      // a bot filled the hidden field: pretend it worked, send nothing
      setSummary({ name: data.name.trim().split(" ")[0], project: data.project, city: data.city.trim(), phone: formatPhone(parsePhone(data.phone)) });
      return setStatus("success");
    }
    submit();
  };

  const restart = () => {
    setStep(0);
    setErrors({});
    setStatus("idle");
  };

  const isLast = step === STEPS.length - 1;
  const submitting = status === "submitting";
  const fade = reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: EASE } };
  const answers = [data.project, data.city.trim(), ""];

  return (
    <>
      <section id="contact" className="relative isolate overflow-hidden bg-[#E8DED0] py-16 md:py-24">
        {/* Photo + veil */}
        {bgOk && (
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setBgOk(false)}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7F3ED]/95 via-[#F7F3ED]/90 to-[#E8DED0]/95 lg:bg-gradient-to-r lg:from-[#F7F3ED]/97 lg:via-[#F7F3ED]/85 lg:to-[#E8DED0]/60"
        />

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 xl:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left: heading, then direct contact on large screens */}
            <div className="lg:col-span-5">
              <h2 className="max-w-xl font-heading text-4xl font-normal leading-[1.12] tracking-wide text-[#292622] sm:text-5xl xl:text-6xl">
                Let&rsquo;s plan your space
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#292622]/75">
                Answer three quick questions and our design team will call you to book a free consultation.
              </p>

              <div className="mt-10 hidden max-w-md divide-y divide-[#292622]/15 border-y border-[#292622]/15 lg:block">
                <ContactRow href={PHONE_TEL} icon={Phone} title="Call us" text={PHONE_DISPLAY} />
                <ContactRow href={WHATSAPP_URL} icon={MessageCircle} title="WhatsApp" text="Chat with our team" external />
                <ContactRow href={MAPS_URL} icon={MapPin} title="Visit our studio" text={ADDRESS} external />
              </div>
            </div>

            {/* Right: form card */}
            <div className="lg:col-span-7 xl:col-span-6 xl:col-start-7">
              <div className="relative rounded-sm border border-[#E8DED0] bg-white px-6 py-8 shadow-[0_24px_60px_-30px_rgba(89,55,25,0.35)] sm:px-9 sm:py-10">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#C18A35]" />

                {status === "success" ? (
                  <motion.div role="status" {...fade}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#593719] text-[#F7F3ED]">
                      <Check size={26} aria-hidden="true" />
                    </span>
                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      className="mt-6 font-heading text-3xl font-normal leading-tight tracking-wide text-[#292622] outline-none sm:text-4xl"
                    >
                      Thank you{summary.name ? `, ${summary.name}` : ""}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[#292622]/75">
                      {open === false
                        ? "We’re closed right now, so expect a call after 10 AM. "
                        : "Our team will call you during studio hours, 10 AM to 7 PM, to arrange your consultation. "}
                    </p>

                    <dl className="mt-6 divide-y divide-[#292622]/10 border-y border-[#292622]/10 text-[15px]">
                      {[
                        ["Project", summary.project],
                        ["City", summary.city],
                        ["Call on", summary.phone],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-4 py-3">
                          <dt className="w-20 shrink-0 text-[#292622]/60">{k}</dt>
                          <dd className="min-w-0 text-[#292622]">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#593719] px-6 text-[15px] font-semibold text-[#F7F3ED] transition-colors hover:bg-[#C18A35] hover:text-[#292622] ${ringCard}`}
                      >
                        <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
                      </a>
                      <a
                        href={PHONE_TEL}
                        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#593719] px-6 text-[15px] font-semibold text-[#593719] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] ${ringCard}`}
                      >
                        <Phone size={18} aria-hidden="true" /> Call us
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={restart}
                      className={`mt-6 rounded-sm text-sm text-[#292622]/65 underline underline-offset-4 hover:text-[#292622] ${ringCard}`}
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Stepper: finished steps show the answer and can be tapped to go back */}
                    <ol className="grid grid-cols-3 gap-3">
                      {STEPS.map((s, i) => {
                        const done = i < step;
                        const body = (
                          <>
                            <span
                              aria-hidden="true"
                              className={`block h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${i <= step ? "bg-[#C18A35]" : "bg-[#E8DED0]"}`}
                            />
                            <span className={`mt-2 block text-sm ${i === step ? "font-semibold text-[#292622]" : "text-[#292622]/60"}`}>{s.label}</span>
                            <span className="block h-5 truncate text-[13px] text-[#593719]">{done ? answers[i] : ""}</span>
                          </>
                        );
                        return (
                          <li key={s.label} aria-current={i === step ? "step" : undefined} className="min-w-0">
                            {done ? (
                              <button
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Change ${s.label.toLowerCase()}: ${answers[i]}`}
                                className={`block w-full rounded-sm text-left ${ringCard}`}
                              >
                                {body}
                              </button>
                            ) : (
                              <div>{body}</div>
                            )}
                          </li>
                        );
                      })}
                    </ol>

                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      id="contact-step-title"
                      className="mt-5 font-heading text-3xl font-normal leading-tight tracking-wide text-[#292622] outline-none sm:text-[34px]"
                    >
                      {STEPS[step].title}
                    </h3>

                    {serverError && (
                      <div role="alert" className="mt-5 flex items-start gap-3 rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-800">
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

                    <motion.div key={step} {...fade} className="mt-6 min-h-[250px]">
                      {/* STEP 1 */}
                      {step === 0 && (
                        <div>
                          <div role="radiogroup" aria-labelledby="contact-step-title" className="grid gap-3 sm:grid-cols-2">
                            {PROJECTS.map(({ value, icon: Icon, note }) => {
                              const on = data.project === value;
                              return (
                                <label key={value} className="relative block">
                                  <input
                                    type="radio"
                                    name="project"
                                    value={value}
                                    checked={on}
                                    onChange={() => set("project", value)}
                                    aria-describedby={errors.project ? "contact-project-error" : undefined}
                                    className="peer sr-only"
                                  />
                                  <span className="flex h-full cursor-pointer items-center gap-4 rounded-sm border border-[#292622]/20 bg-[#F7F3ED] px-4 py-4 transition-colors hover:border-[#593719] peer-checked:border-[#593719] peer-checked:bg-white peer-checked:ring-1 peer-checked:ring-[#593719] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C18A35] peer-focus-visible:ring-offset-2 sm:flex-col sm:items-start sm:gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#E8DED0] text-[#593719]">
                                      <Icon size={20} aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-base font-medium text-[#292622]">{value}</span>
                                      <span className="block text-sm leading-5 text-[#292622]/65">{note}</span>
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors sm:absolute sm:right-3.5 sm:top-3.5 ${
                                        on ? "border-[#593719] bg-[#593719] text-[#F7F3ED]" : "border-[#292622]/30"
                                      }`}
                                    >
                                      {on && <Check size={12} />}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <FieldError id="contact-project-error">{errors.project}</FieldError>
                        </div>
                      )}

                      {/* STEP 2 */}
                      {step === 1 && (
                        <div>
                          <label htmlFor="contact-city" className="mb-2 block text-sm font-medium text-[#292622]">City</label>
                          <input
                            id="contact-city"
                            type="text"
                            autoComplete="address-level2"
                            placeholder="Type your city"
                            value={data.city}
                            onChange={(e) => set("city", e.target.value)}
                            onBlur={() => blur("city")}
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? "contact-city-error" : undefined}
                            className={fieldClass(errors.city)}
                          />
                          <FieldError id="contact-city-error">{errors.city}</FieldError>

                          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Common cities">
                            {CITIES.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => set("city", c)}
                                aria-pressed={data.city === c}
                                className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${ringCard} ${
                                  data.city === c
                                    ? "border-[#593719] bg-[#593719] text-[#F7F3ED]"
                                    : "border-[#292622]/20 bg-[#F7F3ED] text-[#292622] hover:border-[#593719]"
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>

                          {showMsg ? (
                            <div className="mt-6">
                              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#292622]">
                                Anything we should know?
                              </label>
                              <textarea
                                id="contact-message"
                                rows={3}
                                placeholder="Property type, size, timeline, budget range"
                                value={data.message}
                                onChange={(e) => set("message", e.target.value)}
                                className={`${fieldClass(false)} resize-y`}
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowMsg(true)}
                              className={`mt-6 inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-semibold text-[#593719] underline decoration-[#C18A35] decoration-2 underline-offset-4 hover:text-[#C18A35] ${ringCard}`}
                            >
                              <Plus size={15} aria-hidden="true" /> Add details (optional)
                            </button>
                          )}
                        </div>
                      )}

                      {/* STEP 3 */}
                      {step === 2 && (
                        <div className="space-y-5">
                          <div>
                            <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#292622]">Your name</label>
                            <input
                              id="contact-name"
                              type="text"
                              autoComplete="name"
                              placeholder="Full name"
                              value={data.name}
                              onChange={(e) => set("name", e.target.value)}
                              onBlur={() => blur("name")}
                              aria-invalid={!!errors.name}
                              aria-describedby={errors.name ? "contact-name-error" : undefined}
                              className={fieldClass(errors.name)}
                            />
                            <FieldError id="contact-name-error">{errors.name}</FieldError>
                          </div>
                          <div>
                            <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-[#292622]">Mobile number</label>
                            <div className="relative">
                              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border-r border-[#292622]/20 pr-3 text-base text-[#292622]/70" aria-hidden="true">
                                +91
                              </span>
                              <input
                                id="contact-phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder="98765 43210"
                                value={data.phone}
                                onChange={(e) => set("phone", e.target.value)}
                                onBlur={() => blur("phone")}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? "contact-phone-error" : "contact-phone-hint"}
                                className={`${fieldClass(errors.phone)} pl-[4.25rem]`}
                              />
                            </div>
                            {!errors.phone && (
                              <p id="contact-phone-hint" className="mt-2 text-sm text-[#292622]/60">
                                Used only to call you about this enquiry.
                              </p>
                            )}
                            <FieldError id="contact-phone-error">{errors.phone}</FieldError>
                          </div>

                          {/* spam trap: hidden from people and screen readers */}
                          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                            <label>
                              Company
                              <input type="text" name="company" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                            </label>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-3">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => goTo(step - 1)}
                          disabled={submitting}
                          className={`inline-flex min-h-14 items-center gap-2 rounded-sm px-4 text-base font-medium text-[#292622] transition-colors hover:bg-[#E8DED0] disabled:opacity-50 ${ringCard}`}
                        >
                          <ArrowLeft size={18} aria-hidden="true" /> Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className={`inline-flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-sm bg-[#593719] px-6 text-base font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] disabled:cursor-not-allowed disabled:opacity-70 ${ringCard}`}
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
                            Sending
                          </>
                        ) : isLast ? (
                          "Book free consultation"
                        ) : (
                          <>
                            Continue <ArrowRight size={18} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Studio status under the card */}
              <p className="mt-5 flex items-center gap-2.5 text-sm text-[#292622]/75" role="status">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C18A35] opacity-60 motion-reduce:animate-none" />}
                  <span className={`relative h-2 w-2 rounded-full ${open ? "bg-[#C18A35]" : "bg-[#292622]/30"}`} />
                </span>
                <Clock size={15} className="text-[#C18A35]" aria-hidden="true" />
                {open === null
                  ? "Studio open every day, 10 AM to 7 PM"
                  : open
                  ? "Studio open now, until 7 PM"
                  : "Studio closed now. Open every day, 10 AM to 7 PM"}
              </p>
            </div>

            {/* Direct contact on phones and tablets, after the form */}
            <div className="lg:hidden">
              <div className="divide-y divide-[#292622]/15 border-y border-[#292622]/15">
                <ContactRow href={PHONE_TEL} icon={Phone} title="Call us" text={PHONE_DISPLAY} />
                <ContactRow href={WHATSAPP_URL} icon={MessageCircle} title="WhatsApp" text="Chat with our team" external />
                <ContactRow href={MAPS_URL} icon={MapPin} title="Visit our studio" text={ADDRESS} external />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F7F3ED] py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 xl:px-12">
          <WorldMapPin />
        </div>
      </div>
    </>
  );
}