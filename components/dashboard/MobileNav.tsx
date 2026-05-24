"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconCirclePlus,
  IconBrandGithub,
  IconHistory,
  IconSettings,
} from "@tabler/icons-react";

const NAV = [
  { label: "Home",     href: "/dashboard",              icon: IconLayoutDashboard },
  { label: "Review",   href: "/dashboard/review/new",   icon: IconCirclePlus      },
  { label: "Repos",    href: "/dashboard/repositories", icon: IconBrandGithub     },
  { label: "History",  href: "/dashboard/history",      icon: IconHistory         },
  { label: "Settings", href: "/dashboard/settings",     icon: IconSettings        },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#ccff00]/10 bg-[#050505]/90 backdrop-blur-md pb-safe sm:hidden">
      {NAV.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full px-2 ${
              active ? "text-brand-primary font-black" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="h-5 w-5" stroke={active ? 2.25 : 1.75} />
            <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
