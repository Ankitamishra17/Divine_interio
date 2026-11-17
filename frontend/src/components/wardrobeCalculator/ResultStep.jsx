"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, Mail } from "lucide-react";

export default function ResultStep({ formData }) {
  const details = [
    { label: "Wardrobe Type", value: formData.type },
    { label: "Size", value: formData.dimension },
    { label: "Finish", value: formData.finish },
    { label: "Name", value: formData.name },
    { label: "Phone", value: formData.phone },
    { label: "Email", value: formData.email },
  ];

  return (
    <section className="font-body max-w-4xl mx-auto">
      <motion.div
        className="bg-[#FFFFFF] rounded-3xl border border-[#E8DED0] shadow-xl shadow-[#593719]/5 p-8 md:p-14 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#593719]/5 ring-8 ring-[#C18A35]/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#593719]">
              <CheckCircle2 size={34} className="text-[#C18A35]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading mb-4 text-4xl font-bold text-[#593719] md:text-5xl">
          Thank You!
        </h1>

        <p className="font-body text-lg text-[#292622]/70 max-w-2xl mx-auto mb-10">
          Your wardrobe enquiry has been submitted successfully. Our design
          team will contact you shortly with a personalized estimate and free
          consultation.
        </p>

        {/* Customer Details */}
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-[#E8DED0] border-l-[3px] border-l-[#C18A35] bg-[#F7F3ED] p-6 text-left">
          <h3 className="font-heading mb-4 text-xl font-bold text-[#593719]">
            Submitted Details
          </h3>

          <div className="font-body space-y-3 text-[#292622]/70">
            {details.map((item) => (
              <p key={item.label}>
                <span className="font-semibold text-[#593719]">
                  {item.label}:
                </span>{" "}
                {item.value}
              </p>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="font-body flex flex-col md:flex-row justify-center gap-6 mb-10">
          <div className="flex items-center justify-center gap-2 text-[#292622]">
            <Phone size={18} className="text-[#C18A35]" />
            <span>+91 XXXXX XXXXX</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#292622]">
            <Mail size={18} className="text-[#C18A35]" />
            <span>info@livingspacedekor.com</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/"
          className="font-body inline-flex items-center justify-center rounded-xl bg-[#593719] px-8 py-4 font-semibold text-[#FFFFFF] transition-all duration-300 hover:bg-[#C18A35]"
        >
          Back to Home
        </a>
      </motion.div>
    </section>
  );
}