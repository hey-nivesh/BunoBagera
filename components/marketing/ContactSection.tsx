"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const ACCENT = "#ccff00";

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up real submission
    setSubmitted(true);
  };

  const inputCls =
    "w-full rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 backdrop-blur-sm transition-all duration-200 focus:border-[#ccff00]/60 focus:outline-none focus:ring-1 focus:ring-[#ccff00]/40 font-sans";

  return (
    <section id="contact" className="bg-[#050505] py-14 md:py-18">
      {/* Top divider */}
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-8">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Contact
          </p>
          <h2 className="mb-4 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">
            Get in Touch With Us
          </h2>
          <p className="text-base text-zinc-500 font-sans max-w-lg mx-auto">
            Have questions about features, pricing, or enterprise deployment? Our engineering team is here to help.
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 backdrop-blur-sm relative"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
          }}
        >
          {/* Neon outline indicator */}
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              border: `1.5px solid ${ACCENT}`,
              clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          />

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center"
                style={{
                  border: `1px solid rgba(204,255,0,0.4)`,
                  background: "rgba(204,255,0,0.1)",
                  clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                }}
              >
                <svg
                  className="h-6 w-6 text-[#ccff00]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-black uppercase tracking-wide text-white mt-2">
                Message sent!
              </h3>
              <p className="text-sm text-zinc-500 font-sans">
                We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-4 text-xs font-black uppercase tracking-widest text-[#ccff00] hover:text-[#d6ff33] transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Tell us about your use case or project..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: ACCENT,
                  clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Brand badge — bottom right */}
        <div className="mt-6 flex justify-end">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
            }}
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ccff00]" />
            BuboBagera &middot; Powered by Claude
          </div>
        </div>
      </div>
    </section>
  );
}
