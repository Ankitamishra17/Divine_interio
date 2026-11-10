"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

/*
  Palette (same as the other home sections)
  Ivory #F7F3ED (section, light) | White #FFFFFF (form card) | Beige #E8DED0 (hairlines)
  Charcoal #292622 (text)        | Espresso #593719 (selected chips) | Warm Gold #C18A35 (accents, button)

  Set these two for your project:
  - CONTACT_ENDPOINT: where the form is POSTed (JSON: name, phone, projectType, message, source).
    It assumes your Express API has POST /contact, so change the path if yours is different.
  - PHONE / WHATSAPP: already filled in from your Testimonials section.

  UX notes:
  - Only two required fields (name, phone). Everything else is optional, so it is quick to send.
  - Project type is a row of tappable chips instead of a dropdown.
  - Inline errors next to each field, and focus jumps to the first field with a problem.
  - If sending fails, people see Call and WhatsApp buttons instead of a dead end.
  - Hidden "website" field catches simple spam bots.
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CONTACT_ENDPOINT = `${API_URL}/contact`;

const PHONE_DISPLAY = "+91 88266 06869";
const PHONE_TEL = "+918826606869";
const WHATSAPP = "918826606869";
const WHATSAPP_TEXT = "Hi, I’d like to talk about a home interior project.";

const PROJECT_TYPES = [
  "Living room",
  "Modular kitchen",
  "Bedroom",
  "Bathroom",
  "Dining room",
  "Office",
  "Architecture",
];

const EASE = [0.22, 1, 0.36, 1];
const ERROR = "#A23B2A"; // only used for validation messages

const validatePhone = (value) =>
  /^(\+91|91|0)?[6-9]\d{9}$/.test(value.replace(/[\s\-()]/g, ""));

function ContactMethod({ href, icon: Icon, title, detail, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-h-[72px] items-center gap-4 rounded-sm border border-[#E8DED0] bg-white px-5 py-4 transition-colors duration-300 hover:border-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#593719] text-[#C18A35] transition-colors duration-300 group-hover:bg-[#C18A35] group-hover:text-[#292622]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-[#292622]/65">{title}</span>
        <span className="block text-base font-semibold text-[#292622]">{detail}</span>
      </span>
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="ml-auto shrink-0 text-[#C18A35] transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  );
}

export default function Contact() {
  const reduce = useReducedMotion();
  const uid = useId();
  const id = (name) => `${uid}-${name}`;

  const [values, setValues] = useState({
    name: "",
    phone: "",
    projectType: "",
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const successRef = useRef(null);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!validatePhone(values.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // Bots fill the hidden field; humans never see it
    if (values.website) {
      setStatus("success");
      return;
    }

    const found = validate();
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.phone) return phoneRef.current?.focus();

    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.replace(/[\s\-()]/g, ""),
          projectType: values.projectType,
          message: values.message.trim(),
          source: "home-contact",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      // Move focus to the confirmation so screen-reader users hear it
      setTimeout(() => successRef.current?.focus(), 50);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", phone: "", projectType: "", message: "", website: "" });
    setErrors({});
    setStatus("idle");
  };

  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  const inputBase =
    "block w-full rounded-sm border bg-white px-4 text-base text-[#292622] placeholder:text-[#292622]/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C18A35] focus:ring-offset-1";
  const borderFor = (field) =>
    errors[field] ? "border-[#A23B2A]" : "border-[#593719]/25 hover:border-[#593719]/50";

  return (
    <section
      id="contact"
      className="bg-[#F7F3ED] px-5 py-20 sm:px-8 md:py-28 lg:px-14"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        {/* ───────── Left: message + quick ways to reach us ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2
            id="contact-heading"
            className="font-[Cormorant_Garamond,serif] text-[40px] font-medium leading-[1.05] text-[#292622] sm:text-5xl xl:text-6xl"
          >
            Let’s plan your dream home
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#292622]/70 sm:text-lg">
            Tell us a little about your space and our design team will get back to you. Prefer to
            talk right now? Call or message us.
          </p>

          <div className="mt-8 space-y-3">
            <ContactMethod
              href={`tel:${PHONE_TEL}`}
              icon={Phone}
              title="Call us"
              detail={PHONE_DISPLAY}
            />
            <ContactMethod
              href={waHref}
              icon={MessageCircle}
              title="Message us on WhatsApp"
              detail="Chat with a designer"
              external
            />
          </div>

          <ul className="mt-8 space-y-3 text-[15px] text-[#292622]/75">
            <li className="flex items-center gap-3">
              <Clock size={17} className="shrink-0 text-[#C18A35]" aria-hidden="true" />
              Open every day, 10 AM – 7 PM
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={17} className="shrink-0 text-[#C18A35]" aria-hidden="true" />
              Serving Noida, Greater Noida and Ghaziabad
            </li>
          </ul>
        </motion.div>

        {/* ───────── Right: form ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="relative overflow-hidden rounded-sm border border-[#E8DED0] bg-white shadow-[0_28px_60px_-34px_rgba(89,55,25,0.45)]"
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#C18A35]" />

          {status === "success" ? (
            <div className="px-6 py-14 text-center sm:px-12 sm:py-20" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#593719] text-[#C18A35]">
                <Check size={26} aria-hidden="true" />
              </span>
              <h3
                ref={successRef}
                tabIndex={-1}
                className="mt-6 font-[Cormorant_Garamond,serif] text-3xl font-medium text-[#292622] focus:outline-none sm:text-4xl"
              >
                Thank you{values.name.trim() ? `, ${values.name.trim().split(" ")[0]}` : ""}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-[#292622]/70">
                We’ve received your request. Our team will contact you on{" "}
                <span className="font-semibold text-[#292622]">{values.phone}</span>.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-[#593719]/40 px-6 text-sm font-semibold text-[#593719] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="px-6 py-9 sm:px-10 sm:py-12">
              <h3 className="font-[Cormorant_Garamond,serif] text-2xl font-medium text-[#292622] sm:text-3xl">
                Request a free consultation
              </h3>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor={id("name")} className="mb-2 block text-sm font-medium text-[#292622]">
                    Your name
                  </label>
                  <input
                    ref={nameRef}
                    id={id("name")}
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={set("name")}
                    placeholder="Full name"
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? id("name-error") : undefined}
                    className={`${inputBase} h-12 ${borderFor("name")}`}
                  />
                  {errors.name && (
                    <p id={id("name-error")} className="mt-1.5 text-sm" style={{ color: ERROR }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor={id("phone")} className="mb-2 block text-sm font-medium text-[#292622]">
                    Mobile number
                  </label>
                  <input
                    ref={phoneRef}
                    id={id("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={set("phone")}
                    placeholder="98765 43210"
                    aria-invalid={errors.phone ? "true" : undefined}
                    aria-describedby={errors.phone ? id("phone-error") : undefined}
                    className={`${inputBase} h-12 ${borderFor("phone")}`}
                  />
                  {errors.phone && (
                    <p id={id("phone-error")} className="mt-1.5 text-sm" style={{ color: ERROR }}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Project type */}
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-medium text-[#292622]">
                  What are you planning?{" "}
                  <span className="font-normal text-[#292622]/55">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <label key={type} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={values.projectType === type}
                        onChange={set("projectType")}
                        className="peer sr-only"
                      />
                      <span className="inline-flex min-h-11 items-center rounded-full border border-[#593719]/25 px-4 text-sm text-[#292622] transition-colors duration-200 hover:border-[#C18A35] peer-checked:border-[#593719] peer-checked:bg-[#593719] peer-checked:text-[#F7F3ED] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C18A35] peer-focus-visible:ring-offset-2">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Message */}
              <div className="mt-6">
                <label htmlFor={id("message")} className="mb-2 block text-sm font-medium text-[#292622]">
                  Anything we should know?{" "}
                  <span className="font-normal text-[#292622]/55">(optional)</span>
                </label>
                <textarea
                  id={id("message")}
                  rows={4}
                  value={values.message}
                  onChange={set("message")}
                  placeholder="Home size, location, budget, or when you’d like to start"
                  className={`${inputBase} resize-y py-3 ${borderFor("message")}`}
                />
              </div>

              {/* Honeypot: hidden from people and screen readers */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor={id("website")}>Website</label>
                <input
                  id={id("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={set("website")}
                />
              </div>

              {/* Send failed: never leave people stuck */}
              {status === "error" && (
                <div
                  role="alert"
                  className="mt-6 rounded-sm border border-[#A23B2A]/40 bg-[#A23B2A]/5 p-4"
                >
                  <p className="flex items-start gap-2.5 text-sm text-[#292622]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: ERROR }} aria-hidden="true" />
                    We couldn’t send your request. Please try again, or reach us directly:
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[#593719] px-5 text-sm font-semibold text-[#F7F3ED] transition-colors hover:bg-[#C18A35] hover:text-[#292622]"
                    >
                      <Phone size={15} aria-hidden="true" />
                      Call {PHONE_DISPLAY}
                    </a>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-[#593719]/40 px-5 text-sm font-semibold text-[#593719] transition-colors hover:border-[#C18A35] hover:text-[#C18A35]"
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-sm bg-[#C18A35] px-8 text-[15px] font-semibold tracking-wide text-[#292622] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#593719] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send my request
                    <ArrowRight
                      size={17}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}