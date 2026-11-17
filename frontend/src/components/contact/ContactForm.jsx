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
  Palette
  Charcoal #292622 (primary: form card, headings) | Warm Gold #C18A35 (accent, actions)
  Ivory #F7F3ED | Beige #E8DED0 | Espresso #593719 (small accents) | White #FFFFFF

  Layout: light section (beige + ivory veil over an optional photo). Heading, benefits and direct contact on the left,
  one dark charcoal form card on the right so it is the clear focus. On phones: heading, card, then contact details.

  Form: three short steps, one question each.
    1  Project type   2  City (+ optional notes)   3  Name and phone

  Behaviour is unchanged: same validation, same endpoint, same spam trap, same focus handling.

  PHOTO: put an interior photo at /public/image/contact-bg.webp (wide, about 1920x1100).
  If the file is missing, the section simply shows Soft Beige.
*/

const BG_IMAGE = "/image/contact-bg.webp";

const ENDPOINT = "https://livingspacedecor.in/api/send-quote";
const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";
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

const BENEFITS = ["Free design consultation", "Takes under a minute", "No obligation to proceed"];

const EMPTY = { project: "", city: "", message: "", name: "", phone: "" };
const EASE = [0.22, 1, 0.36, 1];

/* Studio hours in Indian time, so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return hour >= 10 && hour < 19;
}

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
      return parsePhone(v.phone) ? "" : "Enter a 10 digit mobile number, for example 9911066420.";
    default:
      return "";
  }
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2";
const ringLight = `${ring} focus-visible:ring-offset-[#F7F3ED]`;
const ringCard = `${ring} focus-visible:ring-offset-[#292622]`;

/* inputs on the dark card */
const fieldClass = (err) =>
  `w-full rounded-xl border bg-white/[0.06] px-4 py-3.5 text-base text-[#F7F3ED] placeholder-[#F7F3ED]/40 outline-none transition-colors focus:border-[#C18A35] focus:bg-white/[0.1] focus:ring-2 focus:ring-[#C18A35]/40 ${
    err ? "border-red-400" : "border-[#F7F3ED]/20"
  }`;

const goldText = {
  backgroundImage: "linear-gradient(90deg,#C18A35 0%,#EBC882 50%,#C18A35 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-red-300">
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
      className={`group flex items-start gap-4 rounded-2xl border border-[#292622]/10 bg-white/70 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#C18A35]/60 hover:bg-white hover:shadow-lg hover:shadow-[#292622]/10 ${ringLight}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#292622] text-[#EBC882] transition-colors duration-300 group-hover:bg-[#C18A35] group-hover:text-[#292622]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#292622]/55">{title}</span>
        <span className="mt-0.5 block text-[15px] leading-snug text-[#292622]">{text}</span>
      </span>
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="mt-3.5 shrink-0 text-[#292622]/30 transition duration-300 group-hover:translate-x-1 group-hover:text-[#C18A35]"
      />
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
  const enter = (x) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.8, ease: EASE },
        };
  const answers = [data.project, data.city.trim(), ""];

  return (
    <>
      <section id="contact" className="relative isolate overflow-hidden bg-[#E8DED0] py-16 md:py-24 lg:py-28">
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
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7F3ED]/95 via-[#F7F3ED]/90 to-[#E8DED0]/95 lg:bg-gradient-to-r lg:from-[#F7F3ED]/97 lg:via-[#F7F3ED]/88 lg:to-[#E8DED0]/70"
        />
        {/* soft gold glows */}
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-md bg-[#C18A35]/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-md bg-[#C18A35]/15 blur-[120px]" />

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 xl:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left: heading, benefits, then direct contact on large screens */}
            <motion.div className="lg:col-span-5" {...enter(-30)}>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C18A35]">
                <span className="h-px w-10 bg-[#C18A35]" />
                Free Consultation
              </p>
              <h2 className="mt-4 max-w-xl font-heading text-4xl font-normal leading-[1.12] tracking-wide text-[#292622] sm:text-5xl xl:text-6xl">
                Let&rsquo;s plan your{" "}
                <span style={goldText}>
                  space
                </span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#292622]/75">
                Answer three quick questions and our design team will call you to book a free consultation.
              </p>

              <ul className="mt-6 space-y-2.5">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-[15px] text-[#292622]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#292622] text-[#EBC882]">
                      <Check size={13} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9 hidden max-w-md space-y-3 lg:block">
                <ContactRow href={PHONE_TEL} icon={Phone} title="Call us" text={PHONE_DISPLAY} />
                <ContactRow href={WHATSAPP_URL} icon={MessageCircle} title="WhatsApp" text="Chat with our team" external />
                <ContactRow href={MAPS_URL} icon={MapPin} title="Visit our studio" text={ADDRESS} external />
              </div>
            </motion.div>

            {/* Right: form card */}
            <motion.div className="lg:col-span-7 xl:col-span-6 xl:col-start-7" {...enter(30)}>
              <div className="relative overflow-hidden rounded-3xl border border-[#F7F3ED]/10 bg-[#292622] px-6 py-8 text-[#F7F3ED] shadow-[0_40px_90px_-30px_rgba(41,38,34,0.7)] sm:px-9 sm:py-10">
                {/* gold top edge + inner glow */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundImage: "linear-gradient(90deg,#C18A35,#EBC882,#C18A35)" }}
                />
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-md bg-[#C18A35]/15 blur-3xl" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(#F7F3ED 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />

                <div className="relative">
                  {status === "success" ? (
                    <motion.div role="status" {...fade}>
                      <span className="flex h-16 w-16 items-center justify-center rounded-md bg-[#C18A35] text-[#292622] shadow-lg shadow-[#C18A35]/30">
                        <Check size={28} aria-hidden="true" />
                      </span>
                      <h3
                        ref={headingRef}
                        tabIndex={-1}
                        className="mt-6 font-heading text-3xl font-normal leading-tight tracking-wide text-[#F7F3ED] outline-none sm:text-4xl"
                      >
                        Thank you{summary.name ? `, ${summary.name}` : ""}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-[#F7F3ED]/75">
                        {open === false
                          ? "We’re closed right now, so expect a call after 10 AM. "
                          : "Our team will call you during studio hours, 10 AM to 7 PM, to arrange your consultation. "}
                      </p>

                      <dl className="mt-6 divide-y divide-[#F7F3ED]/10 overflow-hidden rounded-2xl border border-[#F7F3ED]/10 bg-white/[0.04] text-[15px]">
                        {[
                          ["Project", summary.project],
                          ["City", summary.city],
                          ["Call on", summary.phone],
                        ].map(([k, v]) => (
                          <div key={k} className="flex gap-4 px-5 py-3.5">
                            <dt className="w-20 shrink-0 text-[#F7F3ED]/55">{k}</dt>
                            <dd className="min-w-0 text-[#F7F3ED]">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C18A35] px-6 text-[15px] font-semibold text-[#292622] transition-colors hover:bg-[#F7F3ED] ${ringCard}`}
                        >
                          <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
                        </a>
                        <a
                          href={PHONE_TEL}
                          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#F7F3ED]/40 px-6 text-[15px] font-semibold text-[#F7F3ED] transition-colors hover:border-[#C18A35] hover:text-[#EBC882] ${ringCard}`}
                        >
                          <Phone size={18} aria-hidden="true" /> Call us
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={restart}
                        className={`mt-6 rounded-sm text-sm text-[#F7F3ED]/65 underline underline-offset-4 hover:text-[#EBC882] ${ringCard}`}
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
                                className={`block h-1 rounded-md transition-colors duration-500 motion-reduce:transition-none ${
                                  i <= step ? "bg-[#C18A35]" : "bg-[#F7F3ED]/15"
                                }`}
                              />
                              <span
                                className={`mt-2 flex items-center gap-1.5 text-sm ${
                                  i === step ? "font-semibold text-[#F7F3ED]" : "text-[#F7F3ED]/55"
                                }`}
                              >
                                {done ? (
                                  <Check size={13} className="text-[#C18A35]" aria-hidden="true" />
                                ) : (
                                  <span className="text-xs tabular-nums text-[#C18A35]" aria-hidden="true">
                                    0{i + 1}
                                  </span>
                                )}
                                {s.label}
                              </span>
                              <span className="block h-5 truncate text-[13px] text-[#EBC882]">{done ? answers[i] : ""}</span>
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
                        className="mt-5 font-heading text-3xl font-normal leading-tight tracking-wide text-[#F7F3ED] outline-none sm:text-[34px]"
                      >
                        {STEPS[step].title}
                      </h3>

                      {serverError && (
                        <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
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
                                    <span
                                      className={`group flex h-full cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#C18A35] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#292622] sm:flex-col sm:items-start sm:gap-3 ${
                                        on
                                          ? "border-[#C18A35] bg-[#C18A35]/10 shadow-[0_10px_30px_-14px_rgba(193,138,53,0.6)]"
                                          : "border-[#F7F3ED]/15 bg-white/[0.04] hover:-translate-y-0.5 hover:border-[#C18A35]/60 hover:bg-white/[0.07]"
                                      }`}
                                    >
                                      <span
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                                          on ? "bg-[#C18A35] text-[#292622]" : "bg-[#F7F3ED]/10 text-[#EBC882]"
                                        }`}
                                      >
                                        <Icon size={20} aria-hidden="true" />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-base font-medium text-[#F7F3ED]">{value}</span>
                                        <span className="block text-sm leading-5 text-[#F7F3ED]/60">{note}</span>
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors sm:absolute sm:right-3.5 sm:top-3.5 ${
                                          on ? "border-[#C18A35] bg-[#C18A35] text-[#292622]" : "border-[#F7F3ED]/30"
                                        }`}
                                      >
                                        {on && <Check size={12} strokeWidth={3} />}
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
                            <label htmlFor="contact-city" className="mb-2 block text-sm font-medium text-[#F7F3ED]">City</label>
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
                                  className={`min-h-10 rounded-md border px-4 text-sm transition-colors ${ringCard} ${
                                    data.city === c
                                      ? "border-[#C18A35] bg-[#C18A35] font-semibold text-[#292622]"
                                      : "border-[#F7F3ED]/20 bg-white/[0.04] text-[#F7F3ED]/85 hover:border-[#C18A35]/70 hover:text-[#EBC882]"
                                  }`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>

                            {showMsg ? (
                              <div className="mt-6">
                                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#F7F3ED]">
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
                                className={`mt-6 inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-semibold text-[#EBC882] underline decoration-[#C18A35] decoration-2 underline-offset-4 hover:text-[#C18A35] ${ringCard}`}
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
                              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#F7F3ED]">Your name</label>
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
                              <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-[#F7F3ED]">Mobile number</label>
                              <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border-r border-[#F7F3ED]/20 pr-3 text-base text-[#F7F3ED]/70" aria-hidden="true">
                                  +91
                                </span>
                                <input
                                  id="contact-phone"
                                  type="tel"
                                  inputMode="tel"
                                  autoComplete="tel"
                                  placeholder="XXXXXXXXXX"
                                  value={data.phone}
                                  onChange={(e) => set("phone", e.target.value)}
                                  onBlur={() => blur("phone")}
                                  aria-invalid={!!errors.phone}
                                  aria-describedby={errors.phone ? "contact-phone-error" : "contact-phone-hint"}
                                  className={`${fieldClass(errors.phone)} pl-[4.25rem]`}
                                />
                              </div>
                              {!errors.phone && (
                                <p id="contact-phone-hint" className="mt-2 text-sm text-[#F7F3ED]/55">
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
                            className={`inline-flex min-h-14 items-center gap-2 rounded-md px-5 text-base font-medium text-[#F7F3ED] transition-colors hover:bg-white/10 disabled:opacity-50 ${ringCard}`}
                          >
                            <ArrowLeft size={18} aria-hidden="true" /> Back
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={submitting}
                          aria-busy={submitting}
                          className={`group relative inline-flex min-h-14 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-md bg-[#C18A35] px-6 text-base font-semibold tracking-wide text-[#292622] shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${ringCard}`}
                        >
                          <span className="absolute inset-0 -translate-x-full bg-[#F7F3ED] transition-transform duration-500 group-hover:translate-x-0 motion-reduce:hidden" />
                          <span className="relative inline-flex items-center gap-2.5">
                            {submitting ? (
                              <>
                                <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
                                Sending
                              </>
                            ) : isLast ? (
                              "Book free consultation"
                            ) : (
                              <>
                                Continue{" "}
                                <ArrowRight
                                  size={18}
                                  aria-hidden="true"
                                  className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Studio status under the card */}
              <p
                className="mt-5 inline-flex items-center gap-2.5 rounded-md border border-[#292622]/10 bg-white/70 px-4 py-2 text-sm text-[#292622]/80 backdrop-blur-sm"
                role="status"
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  {open && <span className="absolute inline-flex h-full w-full animate-ping roundeed-md bg-[#C18A35] opacity-60 motion-reduce:animate-none" />}
                  <span className={`relative h-2 w-2 rounded-md ${open ? "bg-[#C18A35]" : "bg-[#292622]/30"}`} />
                </span>
                <Clock size={15} className="text-[#C18A35]" aria-hidden="true" />
                {open === null
                  ? "Studio open every day, 10 AM to 7 PM"
                  : open
                  ? "Studio open now, until 7 PM"
                  : "Studio closed now. Open every day, 10 AM to 7 PM"}
              </p>
            </motion.div>

            {/* Direct contact on phones and tablets, after the form */}
            <div className="space-y-3 lg:hidden">
              <ContactRow href={PHONE_TEL} icon={Phone} title="Call us" text={PHONE_DISPLAY} />
              <ContactRow href={WHATSAPP_URL} icon={MessageCircle} title="WhatsApp" text="Chat with our team" external />
              <ContactRow href={MAPS_URL} icon={MapPin} title="Visit our studio" text={ADDRESS} external />
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