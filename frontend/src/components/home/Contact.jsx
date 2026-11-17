"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, MapPin, MessageCircle, Phone, Send } from "lucide-react";

/*
  Palette (unchanged)
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Balanced version: the richness of the first design, the calm of the second.
  Flow: rooms -> home type -> start time -> name -> phone -> optional note
  Backend unchanged: POST JSON { name, phone, projectType, message, source }.
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CONTACT_ENDPOINT = `${API_URL}/contact`;

const PHONE_DISPLAY = "+91 88266 06869";
const PHONE_TEL = "+918826606869";
const WHATSAPP = "918826606869";
const WHATSAPP_TEXT = "Hi, I’d like to talk about a home interior project.";

const ROOMS = ["Living room", "Modular kitchen", "Bedroom", "Bathroom", "Dining room", "Full home", "Architecture"];
const HOMES = ["2 BHK", "3 BHK", "4 BHK", "Villa", "Office"];
const TIMELINES = ["Within a month", "In 1 to 3 months", "Just exploring"];

const first = (n = "") => n.trim().split(" ")[0];

const STEPS = [
  { key: "rooms", type: "multi", options: ROOMS, ask: () => "Hi! Tell us about your home and a designer will call you back. What are you planning?" },
  { key: "home", type: "single", options: HOMES, ask: () => "Lovely. What kind of space is it?" },
  { key: "timeline", type: "single", options: TIMELINES, ask: () => "And when would you like to start?" },
  { key: "name", type: "text", label: "Your name", placeholder: "Your name", ask: () => "May we have your name?" },
  { key: "phone", type: "tel", label: "Your mobile number", placeholder: "98765 43210", ask: (a) => `Nice to meet you, ${first(a.name)}. What number can we call you on?` },
  { key: "note", type: "text", optional: true, label: "Your note", placeholder: "Location, budget, style you like", ask: () => "Last one: anything else the designer should know?" },
];

const NEXT_STEPS = [
  { title: "Chat here", text: "About a minute" },
  { title: "Get a call", text: "From a designer" },
  { title: "Free consultation", text: "Ideas, rooms, cost" },
];

const EASE = [0.22, 1, 0.36, 1];
const ERROR = "#A23B2A";

const validatePhone = (v) => /^(\+91|91|0)?[6-9]\d{9}$/.test(v.replace(/[\s\-()]/g, ""));

/* Open / closed, read in Indian time so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return { open: hour >= 10 && hour < 19, early: hour < 10 };
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2";
const ringDark = `${ring} focus-visible:ring-offset-[#292622]`;
const chip = `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] transition-colors duration-300 ${ring}`;
const quiet = `min-h-11 rounded-sm px-1 text-sm font-medium text-[#593719] underline decoration-[#C18A35] underline-offset-4 transition-colors hover:text-[#C18A35] ${ring}`;

export default function Contact() {
  const reduce = useReducedMotion();
  const uid = useId();
  const alive = useRef(true);
  const nextId = useRef(1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const [history, setHistory] = useState(() => [{ id: 0, from: "bot", text: STEPS[0].ask({}) }]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multi, setMulti] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [website, setWebsite] = useState(""); // honeypot
  const [hours, setHours] = useState(null);

  useEffect(() => {
    setHours(isOpenNow());
    const t = setInterval(() => setHours(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const cur = STEPS[step];
  const isPhone = cur.type === "tel";
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
  const progress = status === "success" ? 100 : (step / STEPS.length) * 100;

  // Scrolls the chat box only, never the page
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [history, typing, status, reduce]);

  useEffect(() => {
    if (!typing && status === "idle" && (cur.type === "text" || cur.type === "tel")) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [step, typing, status, cur.type]);

  const botSay = (text, extra = {}) =>
    new Promise((resolve) => {
      setTyping(true);
      setTimeout(
        () => {
          if (alive.current) {
            setHistory((h) => [...h, { id: nextId.current++, from: "bot", text, ...extra }]);
            setTyping(false);
          }
          resolve();
        },
        reduce ? 0 : 800
      );
    });

  const send = async (a) => {
    if (website) {
      await botSay("Thank you. A designer will be in touch soon.");
      return setStatus("success");
    }
    setHistory((h) => h.filter((m) => m.kind !== "error"));
    setStatus("sending");
    setTyping(true);
    const message = [a.note, a.home && `Home: ${a.home}`, a.timeline && `Start: ${a.timeline}`].filter(Boolean).join("\n");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: a.name,
          phone: a.phone,
          projectType: (a.rooms || []).join(", "),
          message,
          source: "home-contact",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      await botSay(`Thank you, ${first(a.name)}. A designer will call you on ${a.phone}.`);
      setStatus("success");
    } catch {
      setTyping(false);
      setHistory((h) => [
        ...h,
        { id: nextId.current++, from: "bot", kind: "error", text: "That didn’t go through. You can try again, or reach us directly:" },
      ]);
      setStatus("error");
    }
  };

  const answer = async (value, display) => {
    if (typing || status !== "idle") return;
    const next = { ...answers, [cur.key]: value };
    setAnswers(next);
    setInput("");
    setError("");
    setMulti([]);
    setHistory((h) => [...h, { id: nextId.current++, from: "user", text: display }]);
    if (step === STEPS.length - 1) return send(next);
    await botSay(STEPS[step + 1].ask(next));
    setStep(step + 1);
  };

  const submitText = (e) => {
    e.preventDefault();
    const v = input.trim();
    if (cur.key === "name") {
      if (v.length < 2) return setError("Please enter your name.");
      return answer(v, v);
    }
    if (cur.key === "phone") {
      if (!validatePhone(v)) return setError("Enter a valid 10-digit mobile number.");
      return answer(v.replace(/[\s\-()]/g, ""), v);
    }
    return answer(v, v || "No note, thanks");
  };

  const reset = () => {
    nextId.current = 1;
    setHistory([{ id: 0, from: "bot", text: STEPS[0].ask({}) }]);
    setStep(0);
    setAnswers({});
    setMulti([]);
    setInput("");
    setError("");
    setTyping(false);
    setStatus("idle");
  };

  const composerReady = !typing && status === "idle";
  const summary = [
    ["Rooms", (answers.rooms || []).join(", ")],
    ["Space", answers.home],
    ["Start", answers.timeline],
    ["Call on", answers.phone],
  ].filter(([, v]) => v);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-[#F7F3ED] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto grid max-w-[1180px] overflow-hidden rounded-sm shadow-[0_32px_70px_-36px_rgba(41,38,34,0.55)] lg:grid-cols-[5fr_7fr]"
      >
        {/* ───────── Charcoal side ───────── */}
        <div className="relative isolate flex flex-col overflow-hidden bg-[#292622] px-6 py-10 sm:px-10 sm:py-14 lg:min-h-[640px] lg:px-12">


          <h2
            id="contact-heading"
            className="max-w-[420px] font-[Cormorant_Garamond,serif] text-[42px] font-medium leading-[1.04] text-[#F7F3ED] sm:text-5xl lg:text-[56px]"
          >
            Let’s plan your dream home
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-[#F7F3ED]/75">
            Share a few details in the chat and a designer will call you back.
          </p>

          {/* What happens next */}
          <ol className="mt-9 grid grid-cols-3 gap-4 border-y border-[#F7F3ED]/10 py-5">
            {NEXT_STEPS.map((item, i) => (
              <li key={item.title} className="min-w-0">
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="font-[Cormorant_Garamond,serif] text-[32px] font-medium leading-none text-[#C18A35]">{i + 1}</span>
                  {i < NEXT_STEPS.length - 1 && <span className="h-px flex-1 bg-[#F7F3ED]/15" />}
                </div>
                <p className="mt-2 text-[15px] font-semibold leading-snug text-[#F7F3ED]">{item.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-[#F7F3ED]/60">{item.text}</p>
              </li>
            ))}
          </ol>

          {/* Reach us now */}
          <div className="mt-10 lg:mt-auto">
            <p className="flex items-center gap-3 text-sm text-[#F7F3ED]/75" role="status">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                {hours?.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C18A35] opacity-50 motion-reduce:animate-none" />}
                <span className={`relative h-2 w-2 rounded-full ${hours?.open ? "bg-[#C18A35]" : "bg-[#F7F3ED]/35"}`} />
              </span>
              {hours === null
                ? "Open every day, 10 AM to 7 PM"
                : hours.open
                ? "We’re open now, until 7 PM."
                : `We’re closed now. We’ll call you ${hours.early ? "after 10 AM today" : "after 10 AM tomorrow"}.`}
            </p>

            <a
              href={`tel:${PHONE_TEL}`}
              className="group mt-4 flex items-center gap-4 rounded-sm bg-[#C18A35] p-3 pr-5 text-left transition-colors duration-300 hover:bg-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F3ED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#292622] text-[#C18A35]">
                <Phone size={19} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-[#292622]/75">Call us now</span>
                <span className="block text-lg font-semibold text-[#292622]">{PHONE_DISPLAY}</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="ml-auto shrink-0 text-[#292622] transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm text-[#F7F3ED]/80 underline decoration-[#F7F3ED]/25 underline-offset-4 transition-colors hover:text-[#C18A35] hover:decoration-[#C18A35] ${ringDark}`}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Message us on WhatsApp
              </a>
              <p className="flex items-center gap-2 text-sm text-[#F7F3ED]/55">
                <MapPin size={15} className="shrink-0 text-[#C18A35]" aria-hidden="true" />
                Noida, Greater Noida, Ghaziabad
              </p>
            </div>
          </div>
        </div>

        {/* ───────── Chat side ───────── */}
        <div className="relative h-[min(640px,100dvh-2rem)] min-h-[520px] bg-[#F7F3ED] lg:h-auto">
          <div className="absolute inset-0 flex flex-col">
            {/* Header */}
            <div className="relative border-b border-[#E8DED0] bg-white">
              <div className="flex items-center gap-3 px-5 py-4 sm:px-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#593719] font-[Cormorant_Garamond,serif] text-lg font-semibold text-[#C18A35]" aria-hidden="true">
                  DT
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-tight text-[#292622]">Design team</p>
                  <p className="text-sm text-[#292622]/60">
                    {status === "success" ? "Request sent" : `Question ${Math.min(step + 1, STEPS.length)} of ${STEPS.length}`}
                  </p>
                </div>
                {history.length > 1 && status !== "sending" && (
                  <button type="button" onClick={reset} className={`ml-auto ${quiet}`}>
                    Start over
                  </button>
                )}
              </div>
              <div
                className="h-[2px] w-full bg-[#E8DED0]"
                role="progressbar"
                aria-label="Progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div className="h-full bg-[#C18A35] transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} role="log" aria-live="polite" aria-label="Conversation with the design team" className="flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-8">
              {history.map((m) => (
                <motion.div
                  key={m.id}
                  initial={reduce || m.id === 0 ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  {m.from === "user" ? (
                    <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#593719] px-4 py-3 text-[15px] leading-relaxed text-[#F7F3ED]">{m.text}</p>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#E8DED0] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#292622]">
                      {m.kind === "error" ? (
                        <div role="alert">
                          <p className="flex items-start gap-2">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: ERROR }} aria-hidden="true" />
                            {m.text}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" onClick={() => send(answers)} className={`${chip} border-[#593719] bg-[#593719] text-[#F7F3ED]`}>
                              Try again
                            </button>
                            <a href={`tel:${PHONE_TEL}`} className={`${chip} border-[#593719]/30 text-[#593719]`}>
                              <Phone size={14} aria-hidden="true" /> Call
                            </a>
                            <a href={waHref} target="_blank" rel="noopener noreferrer" className={`${chip} border-[#593719]/30 text-[#593719]`}>
                              <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                            </a>
                          </div>
                        </div>
                      ) : (
                        m.text
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#E8DED0] bg-white px-4 py-3.5" role="status" aria-label="The design team is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-[#C18A35] motion-reduce:animate-none" style={{ animationDelay: `${i * 180}ms` }} />
                  ))}
                </div>
              )}

              {status === "success" && !typing && (
                <motion.dl
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="max-w-[85%] space-y-1.5 rounded-sm border border-[#C18A35]/40 bg-white p-4 text-sm"
                >
                  {summary.map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="w-16 shrink-0 text-[#292622]/55">{k}</dt>
                      <dd className="min-w-0 text-[#292622]">{v}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}
            </div>

            {/* Composer */}
            <div className="relative border-t border-[#E8DED0] bg-white px-5 py-4 sm:px-8">
              {status === "success" ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm text-[#292622]/70">
                    <Check size={16} className="text-[#C18A35]" aria-hidden="true" />
                    We’ll call you soon
                  </p>
                  <button type="button" onClick={reset} className={`${chip} border-[#593719]/40 text-[#593719] hover:bg-[#593719] hover:text-[#F7F3ED]`}>
                    Start a new chat
                  </button>
                </div>
              ) : composerReady && (cur.type === "multi" || cur.type === "single") ? (
                <div role={cur.type === "single" ? "radiogroup" : "group"} aria-label="Quick replies">
                  <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto p-0.5">
                    {cur.options.map((o) => {
                      const on = multi.includes(o);
                      return cur.type === "multi" ? (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setMulti((c) => (c.includes(o) ? c.filter((x) => x !== o) : [...c, o]))}
                          className={`${chip} ${on ? "border-[#593719] bg-[#593719] text-[#F7F3ED]" : "border-[#593719]/20 bg-[#F7F3ED] text-[#292622] hover:border-[#C18A35]"}`}
                        >
                          {on && <Check size={14} className="text-[#C18A35]" aria-hidden="true" />}
                          {o}
                        </button>
                      ) : (
                        <button
                          key={o}
                          type="button"
                          role="radio"
                          aria-checked="false"
                          onClick={() => answer(o, o)}
                          className={`${chip} border-[#593719]/20 bg-[#F7F3ED] text-[#292622] hover:border-[#C18A35]`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    {cur.type === "multi" && multi.length > 0 && (
                      <button type="button" onClick={() => answer(multi, multi.join(", "))} className={`${chip} border-[#C18A35] bg-[#C18A35] font-semibold text-[#292622] hover:bg-[#593719] hover:text-[#F7F3ED]`}>
                        Send <Send size={14} aria-hidden="true" />
                      </button>
                    )}
                    <button type="button" onClick={() => answer(cur.type === "multi" ? [] : "", "Not sure yet")} className={quiet}>
                      Not sure yet
                    </button>
                  </div>
                </div>
              ) : composerReady ? (
                <form onSubmit={submitText} noValidate>
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                      {isPhone && (
                        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 border-r border-[#593719]/20 pr-3 text-base text-[#292622]/65" aria-hidden="true">
                          +91
                        </span>
                      )}
                      <input
                        ref={inputRef}
                        id={`${uid}-input`}
                        type={isPhone ? "tel" : "text"}
                        inputMode={isPhone ? "tel" : undefined}
                        autoComplete={cur.key === "name" ? "name" : isPhone ? "tel" : "off"}
                        aria-label={cur.label}
                        aria-invalid={error ? "true" : undefined}
                        aria-describedby={error ? `${uid}-err` : isPhone ? `${uid}-hint` : undefined}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          setError("");
                        }}
                        placeholder={cur.placeholder}
                        className={`h-12 w-full rounded-full border bg-[#F7F3ED] ${isPhone ? "pl-[4.5rem]" : "pl-5"} pr-5 text-base text-[#292622] placeholder:text-[#292622]/45 focus:outline-none focus:ring-2 focus:ring-[#C18A35] ${error ? "border-[#A23B2A]" : "border-[#593719]/20"}`}
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Send"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C18A35] text-[#292622] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#593719] focus-visible:ring-offset-2"
                    >
                      <Send size={18} aria-hidden="true" />
                    </button>
                  </div>
                  {error ? (
                    <p id={`${uid}-err`} className="mt-2 px-2 text-sm" style={{ color: ERROR }}>
                      {error}
                    </p>
                  ) : (
                    isPhone && (
                      <p id={`${uid}-hint`} className="mt-2 px-2 text-sm text-[#292622]/55">
                        Only used to call you back about this project.
                      </p>
                    )
                  )}
                  {cur.optional && (
                    <button type="button" onClick={() => answer("", "No note, thanks")} className={`mt-2 ${quiet}`}>
                      Skip and send my request
                    </button>
                  )}
                </form>
              ) : (
                <p className="min-h-12 py-3 text-sm text-[#292622]/55">{status === "error" ? "Use the buttons in the chat to try again." : " "}</p>
              )}

              {/* Honeypot */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}