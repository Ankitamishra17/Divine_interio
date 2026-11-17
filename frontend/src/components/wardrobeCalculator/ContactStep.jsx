"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Phone, Mail } from "lucide-react";

const TOTAL_STEPS = 6;
const CURRENT_STEP = 5;

export default function ContactStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValid =
    formData.name?.trim() && formData.phone?.trim() && formData.email?.trim();

  const handleSubmit = async () => {
    if (!isValid) return;

    // Phone Validation
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      alert("Please enter a valid 10 digit mobile number");
      return;
    }

    // Email Validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://livingspacedecor.in/api/send-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "Wardrobe Cost Calculator",
          type: formData.type,
          dimension: formData.dimension,
          finish: formData.finish,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        nextStep();
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Wardrobe Quote Error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-14 pl-12 pr-4 rounded-xl border border-[#E8DED0] bg-[#F7F3ED] text-[#292622] placeholder:text-[#292622]/40 transition-all focus:outline-none focus:bg-[#FFFFFF] focus:border-[#dba343] focus:ring-4 focus:ring-[#dba343]/15";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-[#dba343]";

  return (
    <section className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[#dba343]/40 bg-[#dba343]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#593719]">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </span>

        {/* Progress */}
        <div className="mx-auto mt-5 flex max-w-xs gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < CURRENT_STEP ? "bg-[#dba343]" : "bg-[#E8DED0]"
              }`}
            />
          ))}
        </div>

        <h2 className="mt-6 mb-4 font-serif text-4xl font-semibold tracking-tight text-[#593719] md:text-5xl">
          Get Your Cost Estimate
        </h2>

        <p className="text-[#292622]/70 max-w-2xl mx-auto">
          Enter your details and receive a personalized wardrobe cost estimate
          along with a free design consultation.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="bg-[#FFFFFF] rounded-3xl border border-[#E8DED0] shadow-xl shadow-[#593719]/5 p-8 md:p-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid gap-6">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#593719]">
              Full Name
            </label>

            <div className="relative">
              <User size={20} className={iconClass} />

              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#593719]">
              Phone Number
            </label>

            <div className="relative">
              <Phone size={20} className={iconClass} />

              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#593719]">
              Email Address
            </label>

            <div className="relative">
              <Mail size={20} className={iconClass} />

              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={inputClass}
              />
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mt-4 rounded-2xl border border-[#E8DED0] border-l-[3px] border-l-[#dba343] bg-[#F7F3ED] p-6">
            <h3 className="mb-4 font-serif text-xl font-semibold text-[#593719]">
              Your Selection
            </h3>

            <div className="space-y-3 text-[#292622]/70">
              <p>
                <span className="font-semibold text-[#593719]">
                  Wardrobe Type:
                </span>{" "}
                {formData.type}
              </p>

              <p>
                <span className="font-semibold text-[#593719]">Size:</span>{" "}
                {formData.dimension}
              </p>

              <p>
                <span className="font-semibold text-[#593719]">Finish:</span>{" "}
                {formData.finish}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl border border-[#593719] px-6 py-3 text-[#593719] transition-all hover:bg-[#593719] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className={`flex items-center gap-2 rounded-xl px-8 py-3 transition-all duration-300 ${
            isValid && !isSubmitting
              ? "bg-[#593719] text-[#FFFFFF] hover:bg-[#dba343]"
              : "bg-[#E8DED0] text-[#292622]/40 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Get Estimate"}

          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </section>
  );
}