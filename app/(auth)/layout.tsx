export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const apiOrigin = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4">
      {/* Preconnect to API to optimize login speed */}
      <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={apiOrigin} />
      {/* Ambient violet radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
