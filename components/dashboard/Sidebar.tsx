"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconCirclePlus,
  IconBrandGithub,
  IconHistory,
  IconSettings,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#ccff00";

const NAV = [
  { label: "Dashboard",     href: "/dashboard",              icon: IconLayoutDashboard },
  { label: "New Review",    href: "/dashboard/review/new",   icon: IconCirclePlus      },
  { label: "Repositories",  href: "/dashboard/repositories", icon: IconBrandGithub     },
  { label: "Review History",href: "/dashboard/history",      icon: IconHistory         },
  { label: "Settings",      href: "/dashboard/settings",     icon: IconSettings        },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="flex h-full w-60 flex-col"
      style={{ background: "#050505", borderRight: "1px solid rgba(204,255,0,0.12)" }}
    >
      {/* ── Logo ── */}
      <div
        className="flex h-[72px] items-center gap-2.5 px-5"
        style={{ borderBottom: "1px solid rgba(204,255,0,0.12)" }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
          style={{ background: ACCENT, clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
        >
          <span className="text-[10px] font-black text-black">CS</span>
        </div>
        <span className="text-[15px] font-black tracking-tight text-white uppercase">
          BuboBagera
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-150"
              style={active ? {
                background: "rgba(204,255,0,0.08)",
                borderLeft: `2px solid ${ACCENT}`,
                paddingLeft: "10px",
                color: ACCENT,
              } : {
                borderLeft: "2px solid transparent",
                color: "#71717a",
              }}
            >
              <Icon
                className="h-4 w-4 flex-shrink-0 transition-colors"
                style={{ color: active ? ACCENT : undefined }}
                stroke={1.75}
              />
              <span className="flex-1 uppercase tracking-wide text-[12px]">{label}</span>
              {active && (
                <IconChevronRight className="h-3.5 w-3.5" style={{ color: "rgba(204,255,0,0.5)" }} stroke={2} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User + Sign Out ── */}
      <div className="p-3 space-y-2" style={{ borderTop: "1px solid rgba(204,255,0,0.12)" }}>
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-sm font-black text-black"
              style={{ background: ACCENT, clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white uppercase tracking-wide">{user.name}</p>
              <p className="truncate text-[10px] text-zinc-600">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 transition-colors hover:text-red-400 uppercase tracking-wide text-[12px] font-semibold"
        >
          <IconLogout className="h-4 w-4" stroke={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
