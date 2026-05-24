"use client";

import { usePathname } from "next/navigation";
import { IconBell, IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#ccff00";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/review/new": "New Review",
  "/dashboard/repositories": "My Repositories",
  "/dashboard/history": "Review History",
  "/dashboard/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title =
    Object.entries(PAGE_TITLES).find(([key]) =>
      key === "/dashboard" ? pathname === key : pathname.startsWith(key)
    )?.[1] ?? "Dashboard";

  return (
    <header
      className="flex h-[72px] shrink-0 items-center justify-between px-6 backdrop-blur-md"
      style={{
        background: "rgba(5,5,5,0.85)",
        borderBottom: "1px solid rgba(204,255,0,0.12)",
      }}
    >
      {/* ── Title ── */}
      <h1 className="text-[13px] font-black uppercase tracking-[0.25em] text-white">{title}</h1>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/repositories"
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-[12px] font-black uppercase tracking-widest text-black transition-all hover:opacity-80"
          style={{
            background: ACCENT,
            clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          }}
        >
          <IconCirclePlus className="h-4 w-4" stroke={2} />
          New Review
        </Link>

        {/* Notification Bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center transition-all hover:border-[#ccff00]/30"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            color: "#71717a",
          }}
          aria-label="Notifications"
        >
          <IconBell className="h-4 w-4" stroke={1.75} />
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
        </button>

        {/* User Avatar */}
        {user && (
          <div
            className="flex h-9 w-9 items-center justify-center text-sm font-black text-black"
            style={{
              background: ACCENT,
              clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
