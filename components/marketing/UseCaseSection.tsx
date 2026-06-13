import {
  IconGitPullRequest,
  IconUsers,
  IconWorld,
  IconRefresh,
} from "@tabler/icons-react";

type UseCase = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const USE_CASES: UseCase[] = [
  {
    icon: IconGitPullRequest,
    title: "PR Reviews",
    description:
      "Automated, consistent feedback on every pull request — no manual reviewer bottlenecks.",
  },
  {
    icon: IconUsers,
    title: "Onboarding",
    description:
      "Help new engineers understand the codebase instantly with AI-generated explanations.",
  },
  {
    icon: IconWorld,
    title: "Multilingual Repos",
    description:
      "Supports JavaScript, Python, TypeScript, Go, Rust, and 20+ languages out of the box.",
  },
  {
    icon: IconRefresh,
    title: "Legacy Refactoring",
    description:
      "Identify outdated patterns and receive AI-generated modernisation suggestions.",
  },
];

const ACCENT = "#ccff00";

export default function UseCaseSection() {
  return (
    <section className="bg-[#050505] py-14 md:py-18">
      {/* Top divider */}
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-8">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Use Cases
          </p>
          <h2 className="mb-5 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl md:text-6xl">
            Designed for Fast-Moving<br />
            <span style={{ color: ACCENT }}>Dev Teams</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-zinc-500 font-sans">
            From solo developers to enterprise teams &mdash; BunoBagera adapts perfectly to every engineering workflow.
          </p>
        </div>

        {/* 2 × 2 grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="group relative p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                {/* Subtle border glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: `1.5px solid ${ACCENT}`,
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                  }}
                />

                {/* Icon box (cyber style: square border) */}
                <div
                  className="mb-6 inline-flex h-11 w-11 items-center justify-center transition-colors duration-300 group-hover:border-[#ccff00]/50 group-hover:text-[#ccff00]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#71717a",
                  }}
                >
                  <Icon className="h-5 w-5" stroke={1.75} />
                </div>

                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-white">
                  {uc.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 font-sans">
                  {uc.description}
                </p>

                {/* Cyber arrow link */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 transition-all duration-200 group-hover:text-[#ccff00] group-hover:gap-2.5">
                  <span>Learn more</span>
                  <svg
                    className="h-3.5 w-3.5"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
