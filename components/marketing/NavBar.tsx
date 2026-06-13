"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMenu2, IconX, IconChevronDown } from "@tabler/icons-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-stretch h-[72px]">
      {/* ── Logo ── */}
      <div className="flex items-center pl-8 pr-12 bg-[#050505] z-10">
        <Link href="/" className="flex items-center gap-1 select-none">
          <span className="text-[18px] font-black tracking-widest text-white uppercase">BunoBagera</span>
          <span className="text-[18px] font-black tracking-widest uppercase" style={{ color: "#ccff00" }}>&nbsp;AI</span>
        </Link>
      </div>

      {/* ── Center Nav Trapezoid ── */}
      <div className="hidden md:flex flex-1 items-end justify-center overflow-hidden">
        <div
          className="flex items-center gap-10 px-16 h-full"
          style={{
            background: "#ccff00",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 28px) 100%, 28px 100%)",
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] font-bold text-black uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Right: Login ── */}
      <div className="hidden md:flex items-center gap-6 pl-12 pr-8 bg-[#050505] z-10">
        <Link href="/login" className="text-[13px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
          Login
        </Link>
        <Link
          href="/signup"
          className="text-[13px] font-bold uppercase tracking-wider px-5 py-2.5 text-black transition-all hover:opacity-80"
          style={{ background: "#ccff00", clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
        >
          Get Started
        </Link>
      </div>

      {/* ── Mobile Hamburger ── */}
      <div className="md:hidden flex items-center ml-auto pr-4 bg-[#050505]">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#ccff00] transition-colors p-2">
          {isOpen ? <IconX className="h-6 w-6" /> : <IconMenu2 className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-[#050505] border-b border-[#ccff00]/20 md:hidden flex flex-col p-4 gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className="py-3 px-2 text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 hover:text-[#ccff00] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 flex gap-3">
            <Link href="/login" className="flex-1 text-center py-3 text-sm font-bold text-white uppercase border border-white/20 hover:border-[#ccff00]/50 transition-colors">Login</Link>
            <Link href="/signup" className="flex-1 text-center py-3 text-sm font-bold text-black uppercase" style={{ background: "#ccff00" }}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
