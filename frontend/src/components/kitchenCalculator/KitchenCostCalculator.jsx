"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, MessageCircle, Phone } from "lucide-react";

import DimensionStep from "./DimensionStep";
import ShapeStep from "./ShapeStep";
import PackageStep from "./PackageStep";
import LeadFormStep from "./LeadFormStep";
import { kitchenShapes, packages } from "@/data/kitchenCalculatorData";

/*
  Palette: Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White

  What's better
  - The step bar is honest: if someone picks "Custom" size we skip Shape and Package, so the bar shows
    2 steps ("Step 2 of 2"), not a jump to "4 of 4". Finished steps can be tapped to go back.
  - Fixed the old step-circle colour logic (the "done" tick never showed).
  - One Back button, placed where the eye already is (top of the card). The old one at the bottom is gone.
  - Your choices so far show as small chips under the step bar.
  - On each new step the title gets keyboard / screen-reader focus, and the card scrolls into view on phones.
  - "Chat with us" was plain text; now it's real Call and WhatsApp links.
  - Light, calm look: no gradient page, one white card with a gold top edge, soft motion (off when reduced motion is on).

  The four step files now share this palette and no longer draw their own title, step count or Back button.
  After a successful send, LeadFormStep calls onSubmitted() (this card switches to "Thank you") and
  onRestart() ("Calculate another kitchen") resets everything without reloading the page.
*/

const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";

const STEPS = [
  { id: 1, label: "Size", title: "How big is your kitchen?" },
  { id: 2, label: "Layout", title: "Choose your kitchen shape" },
  { id: 3, label: "Package", title: "Pick a package" },
  { id: 4, label: "Details", title: "Where should we send your estimate?" },
];

const EASE = [0.22, 1, 0.36, 1];
const EMPTY = { dimension: "", shape: "", package: "", name: "", email: "", phone: "", pincode: "" };
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function KitchenCostCalculator() {
  const reduce = useReducedMotion();
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const mounted = useRef(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const isCustom = formData.dimension === "Custom";
  const visible = isCustom ? [STEPS[0], STEPS[3]] : STEPS; // "Custom" skips Shape and Package
  const position = Math.max(0, visible.findIndex((s) => s.id === step));
  const total = visible.length;
  const current = STEPS[step - 1];
  const progress = submitted ? 100 : ((position + 1) / total) * 100;

  const handleDimensionSelect = (dimension) => {
    setFormData((prev) => ({ ...prev, dimension }));
    if (dimension === "Custom") setStep(4);
  };

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));
  const handleBack = () => {
    if (isCustom && step === 4) setStep(1);
    else prevStep();
  };
  const goTo = (id) => !submitted && id < step && setStep(id); // finished steps only
  const restart = () => {
    setFormData(EMPTY);
    setSubmitted(false);
    setStep(1);
  };

  // New step: give the title focus, and bring the card into view if it scrolled away
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    titleRef.current?.focus({ preventScroll: true });
    const r = cardRef.current?.getBoundingClientRect();
    if (r && r.top < 0) cardRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [step, submitted, reduce]);

  const shapeName = kitchenShapes.find((x) => x.id === formData.shape)?.title || formData.shape;
  const packageName = packages.find((x) => x.id === formData.package)?.name || formData.package;
  const chips = [
    formData.dimension && step > 1 && formData.dimension,
    formData.shape && step > 2 && shapeName,
    formData.package && step > 3 && packageName,
  ].filter(Boolean);

  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 } };

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-[#dba343]">Free estimate</p>
          <h1 className="font-heading mt-4 text-4xl leading-[1.08] text-[#292622] md:text-5xl">
            Kitchen Cost <span className="text-[#593719]">Calculator</span>
          </h1>
          <div className="mx-auto mt-5 h-px w-14 bg-[#dba343]" aria-hidden="true" />
          <p className="font-body mx-auto mt-5 max-w-xl text-base font-light leading-8 text-[#292622]/75">
            Get an instant estimate for your dream kitchen in just a few steps.
          </p>
        </motion.header>

        {/* Step bar */}
        <nav aria-label="Calculator progress" className="mt-10">
          <ol className="flex items-start">
            {visible.map((s, i) => {
              const done = submitted || i < position;
              const now = !submitted && i === position;
              const dot = (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 motion-reduce:transition-none sm:h-11 sm:w-11 ${
                    done
                      ? "border-[#dba343] bg-[#dba343] text-[#292622]"
                      : now
                      ? "border-[#593719] bg-[#593719] text-[#F7F3ED]"
                      : "border-[#E8DED0] bg-white text-[#292622]/50"
                  }`}
                >
                  {done ? <Check size={18} aria-hidden="true" /> : i + 1}
                </span>
              );
              return (
                <li key={s.id} aria-current={now ? "step" : undefined} className={`flex items-start ${i < visible.length - 1 ? "flex-1" : ""}`}>
                  <div className="flex w-16 flex-col items-center gap-2 text-center sm:w-20">
                    {done ? (
                      <button type="button" onClick={() => goTo(s.id)} aria-label={`Go back to ${s.label}`} className={`rounded-full ${ring} focus-visible:ring-offset-[#F7F3ED]`}>
                        {dot}
                      </button>
                    ) : (
                      dot
                    )}
                    <span className={`font-body text-xs sm:text-sm ${now ? "font-semibold text-[#292622]" : "text-[#292622]/60"}`}>{s.label}</span>
                  </div>
                  {i < visible.length - 1 && (
                    <span aria-hidden="true" className="mx-1 mt-5 h-px flex-1 sm:mt-[22px]">
                      <span className={`block h-px w-full transition-colors duration-500 motion-reduce:transition-none ${done ? "bg-[#dba343]" : "bg-[#E8DED0]"}`} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Card */}
        <div
          ref={cardRef}
          className="relative mt-8 scroll-mt-4 overflow-hidden rounded-sm border border-[#E8DED0] bg-white shadow-[0_30px_70px_-40px_rgba(89,55,25,0.45)]"
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#E8DED0]">
            <span className="block h-full bg-[#dba343] transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </span>

          <div className="px-5 pb-8 pt-8 sm:px-10 sm:pb-12 sm:pt-10 md:px-14">
            {/* Card header: back, step count, title, choices */}
            <div className="flex min-h-11 items-center justify-between gap-4">
              {step > 1 && !submitted ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className={`font-body -ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-medium text-[#593719] transition-colors hover:text-[#dba343] ${ring}`}
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back
                </button>
              ) : (
                <span />
              )}
              <p className="font-body text-sm tabular-nums text-[#292622]/60" aria-live="polite">
                {submitted ? "Done" : `Step ${position + 1} of ${total}`}
              </p>
            </div>

            <h2
              ref={titleRef}
              tabIndex={-1}
              className="font-heading mt-3 text-2xl leading-tight text-[#292622] outline-none sm:text-3xl"
            >
              {submitted ? "Request submitted" : current.title}
            </h2>

            {chips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Your choices so far">
                {chips.map((c) => (
                  <li key={c} className="font-body rounded-full bg-[#F7F3ED] px-3.5 py-1.5 text-sm text-[#593719]">
                    {c}
                  </li>
                ))}
              </ul>
            )}

            {/* Step content */}
            <div className="mt-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`step-${step}`} {...slide} transition={{ duration: 0.35, ease: EASE }}>
                  {step === 1 && <DimensionStep selected={formData.dimension} onSelect={handleDimensionSelect} onNext={nextStep} />}

                  {step === 2 && (
                    <ShapeStep
                      selected={formData.shape}
                      onSelect={(shape) => setFormData((prev) => ({ ...prev, shape }))}
                      onNext={nextStep}
                    />
                  )}

                  {step === 3 && (
                    <PackageStep
                      selected={formData.package}
                      onSelect={(pkg) => setFormData((prev) => ({ ...prev, package: pkg }))}
                      onNext={nextStep}
                    />
                  )}

                  {step === 4 && <LeadFormStep formData={formData} setFormData={setFormData} onSubmitted={() => setSubmitted(true)} onRestart={restart} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="font-body mt-8 text-center text-sm text-[#292622]/70">
          <p>Questions? Talk to our design team.</p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-6">
            <a
              href={PHONE_TEL}
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-[#593719] underline decoration-[#dba343] decoration-2 underline-offset-4 transition-colors hover:text-[#dba343] ${ring} focus-visible:ring-offset-[#F7F3ED]`}
            >
              <Phone size={16} aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-[#593719] underline decoration-[#dba343] decoration-2 underline-offset-4 transition-colors hover:text-[#dba343] ${ring} focus-visible:ring-offset-[#F7F3ED]`}
            >
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}