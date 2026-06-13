import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Docs", href: "#docs" },
  { label: "GitHub", href: "https://github.com" },
];

const ACCENT = "#ccff00";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505]">
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          {/* Logo + copyright */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center overflow-hidden"
              style={{ clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
            >
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm text-zinc-600">
              &copy; {year} BunoBagera. All rights reserved.
            </span>
          </div>

          {/* Footer links */}
          <nav className="flex items-center gap-8" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-600 transition-colors duration-200 hover:text-white font-medium uppercase tracking-wider"
                style={{ fontSize: "12px" }}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
