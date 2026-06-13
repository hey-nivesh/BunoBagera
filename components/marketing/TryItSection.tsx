import { IconBraces, IconTerminal2, IconUpload } from "@tabler/icons-react";

type TryItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  glowColor: string;
};

const TRY_ITEMS: TryItem[] = [
  {
    icon: IconBraces,
    title: "Paste & Review",
    description:
      "Drop any snippet and get instant AI feedback on bugs, style, and performance.",
    glowColor: "#ccff00",
  },
  {
    icon: IconTerminal2,
    title: "Connect a Repo",
    description:
      "Link your GitHub account and scan a repository end to end across every branch.",
    glowColor: "#d6ff33",
  },
  {
    icon: IconUpload,
    title: "Upload a File",
    description:
      "Upload any source file for a detailed production readiness report in seconds.",
    glowColor: "#a3cc00",
  },
];

const ACCENT = "#ccff00";

export default function TryItSection() {
  return (
    <section className="bg-[#050505] py-14 md:py-18">
      {/* Top divider */}
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-8">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Get Started
          </p>
          <h2 className="mb-5 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl md:text-6xl">
            Try BunoBagera<br />
            <span style={{ color: ACCENT }}>in Seconds</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-500 font-sans">
            Experience AI code review directly in your browser — no signup required.
          </p>
        </div>

        {/* 3-column cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative cursor-pointer overflow-hidden p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                }}
              >
                {/* Glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${item.glowColor}18, transparent 65%)`,
                  }}
                />

                {/* Subtle border glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: `1.5px solid ${ACCENT}`,
                    clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                  }}
                />

                <div className="relative z-10">
                  {/* Large icon container (cyber style) */}
                  <div
                    className="mb-7 flex h-16 w-16 items-center justify-center transition-all duration-300 group-hover:border-[#ccff00]/50 group-hover:bg-[#ccff00]/10 group-hover:text-[#ccff00]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#71717a",
                    }}
                  >
                    <Icon className="h-7 w-7" stroke={1.5} />
                  </div>

                  <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-zinc-500 font-sans">
                    {item.description}
                  </p>

                  {/* CTA row */}
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 transition-all duration-200 group-hover:text-[#ccff00] group-hover:gap-3">
                    <span>Try it now</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
