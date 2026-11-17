"use client";

import { useId, useState } from "react";
import { Plus, Phone, MessageCircle } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED | Beige #E8DED0 | Charcoal #292622 | White #FFFFFF

  Layout: heading and a "still unsure?" help card stay pinned on the left while one calm list of
  questions scrolls on the right. Hairline dividers instead of a box around every question.
  Accessible accordion (button + region, aria-expanded), smooth open and close, one open at a time.
  Also outputs FAQ structured data, which helps these answers show up in Google results.
*/

const PHONE_DISPLAY = "+919911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";

const faqs = [
  {
    question: "How long does an interior design project take?",
    answer:
      "Most residential projects are completed within 30 to 60 days depending on the size, scope, and customization requirements.",
  },
  {
    question: "Do you provide turnkey interior solutions?",
    answer:
      "Yes. We offer complete turnkey solutions including design, material sourcing, execution, furniture, lighting, and final styling.",
  },
  {
    question: "Do you offer modular kitchen designs?",
    answer:
      "Absolutely. We specialize in premium modular kitchens with smart storage, high-quality hardware, and luxury finishes.",
  },
  {
    question: "Can I get a free consultation?",
    answer:
      "Yes. We provide an initial consultation to understand your requirements and discuss design possibilities at no cost.",
  },
  {
    question: "Do you work outside Noida and Delhi NCR?",
    answer:
      "Yes. We undertake selected projects across India depending on project size and requirements.",
  },
  {
    question: "What styles do you specialize in?",
    answer:
      "We work across contemporary, modern minimalist, classic, and eclectic styles, always tailored to your taste and lifestyle.",
  },
];

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]";

function FAQItem({ faq, isOpen, onToggle, baseId }) {
  const buttonId = `${baseId}-button`;
  const panelId = `${baseId}-panel`;

  return (
    <div className="border-b border-[#292622]/15">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={`group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7 ${ring} rounded-sm`}
        >
          <span
            className={`font-heading text-[20px] font-normal leading-snug tracking-wide transition-colors duration-300 sm:text-2xl ${
              isOpen ? "text-[#593719]" : "text-[#292622] group-hover:text-[#593719]"
            }`}
          >
            {faq.question}
          </span>
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              isOpen
                ? "border-[#593719] bg-[#593719] text-[#F7F3ED]"
                : "border-[#593719]/40 text-[#593719] group-hover:border-[#C18A35] group-hover:bg-[#C18A35] group-hover:text-[#292622]"
            }`}
          >
            <Plus
              size={18}
              className={`transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
            />
          </span>
        </button>
      </h3>

      {/* grid-rows trick: animates to the answer's real height, no fixed max-height */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[60ch] pb-7 pr-14 text-base leading-[1.8] text-[#292622]/75">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState();
  const uid = useId();

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="bg-[#F7F3ED] py-16 md:py-24" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 xl:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: heading + help card, pinned on large screens */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2
                id="faq-heading"
                className="font-heading text-4xl font-normal leading-[1.12] tracking-wide text-[#292622] md:text-5xl xl:text-6xl"
              >
                Questions, answered
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#292622]/70">
                The things homeowners ask us most about timelines, turnkey projects, kitchens and consultations.
              </p>

              <div className="relative mt-9 max-w-md rounded-sm bg-[#E8DED0] p-6 sm:p-7">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#C18A35]" />
                <p className="font-heading text-2xl font-normal tracking-wide text-[#292622]">Still have a question?</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#292622]/70">
                  Talk to our design team. We reply during studio hours, 10 AM to 7 PM.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={PHONE_TEL}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#593719] px-5 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] ${ring} focus-visible:ring-offset-[#E8DED0]`}
                  >
                    <Phone size={16} aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#593719]/50 bg-white px-5 text-[15px] font-semibold text-[#593719] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] ${ring} focus-visible:ring-offset-[#E8DED0]`}
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-7">
            <div className="border-t border-[#292622]/15">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  faq={faq}
                  baseId={`${uid}-faq-${i}`}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}