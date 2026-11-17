"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const API_ENDPOINT = "https://livingspacedecor.in/api/send-quote";

const INITIAL_FORM = {
  formType: "Modal Form",
  name: "",
  phone: "",
  city: "",
  email: "",
  message: "",
  whatsapp: false,
};

export default function ConsultationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      }

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9998] bg-[#292622]/70 backdrop-blur-sm"
          />

          {/* Modal Wrapper */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md max-h-[calc(100dvh-24px)] overflow-hidden bg-[#F7F3ED] rounded-xl shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-[#292622] px-5 py-4 sm:px-6 sm:py-5">
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#C18A35] transition-colors"
                >
                  <X size={16} />
                </button>

                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C18A35] font-body">
                  Complimentary Consultation
                </span>

                <h2 className="font-heading text-2xl sm:text-[27px] text-white leading-tight mt-2 pr-5">
                  Book Your Free
                  <span className="block text-[#C18A35]">Consultation</span>
                </h2>

                <p className="font-body text-xs sm:text-sm text-[#D2C9BE] mt-2 leading-relaxed max-w-[320px]">
                  Share your ideas with us. Let's create a space that feels
                  uniquely yours.
                </p>
              </div>

              {/* Form Content */}
              <div className="px-5 py-4 sm:px-6 sm:py-5 flex-1 min-h-0">
                {status === "success" ? (
                  <div className="py-8 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C18A35]/15 flex items-center justify-center text-2xl text-[#C18A35]">
                      ✓
                    </div>

                    <h3 className="font-heading text-2xl text-[#292622]">
                      Consultation Booked!
                    </h3>

                    <p className="font-body text-sm text-[#593719]">
                      Thank you! Our design expert will contact you within 24
                      hours.
                    </p>

                    <button
                      onClick={handleClose}
                      className="mt-2 px-7 py-2 bg-[#292622] text-white text-sm rounded-lg hover:bg-[#C18A35] transition-all"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-body text-[#8A8076] mb-3">
                      Please fill in your details below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                        required
                        className="w-full h-10 px-3.5 text-sm font-body text-[#292622] border border-[#E8DED0] rounded-lg bg-white placeholder:text-[#A59D95] focus:outline-none focus:border-[#C18A35] focus:ring-1 focus:ring-[#C18A35]/30"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="w-full h-10 px-3.5 text-sm font-body text-[#292622] border border-[#E8DED0] rounded-lg bg-white placeholder:text-[#A59D95] focus:outline-none focus:border-[#C18A35] focus:ring-1 focus:ring-[#C18A35]/30"
                      />

                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Your City"
                        required
                        className="w-full h-10 px-3.5 text-sm font-body text-[#292622] border border-[#E8DED0] rounded-lg bg-white placeholder:text-[#A59D95] focus:outline-none focus:border-[#C18A35] focus:ring-1 focus:ring-[#C18A35]/30"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="w-full h-10 px-3.5 text-sm font-body text-[#292622] border border-[#E8DED0] rounded-lg bg-white placeholder:text-[#A59D95] focus:outline-none focus:border-[#C18A35] focus:ring-1 focus:ring-[#C18A35]/30"
                      />

                      <textarea
                        rows={2}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your dream space..."
                        className="w-full h-[58px] px-3.5 py-2.5 text-sm font-body text-[#292622] border border-[#E8DED0] rounded-lg bg-white placeholder:text-[#A59D95] resize-none focus:outline-none focus:border-[#C18A35] focus:ring-1 focus:ring-[#C18A35]/30"
                      />

                      <label className="flex items-center gap-2 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          name="whatsapp"
                          checked={form.whatsapp}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#C18A35] cursor-pointer"
                        />

                        <span className="text-xs font-body text-[#6F655B]">
                          I would like to receive updates on WhatsApp.
                        </span>
                      </label>

                      {status === "error" && (
                        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full h-10 bg-[#292622] text-white text-sm font-body font-medium rounded-lg hover:bg-[#C18A35] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {status === "loading" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Book Consultation"
                        )}
                      </button>
                    </form>

                    <p className="text-center text-[10px] font-body text-[#A59D95] mt-2">
                      Your information is safe and secure.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
