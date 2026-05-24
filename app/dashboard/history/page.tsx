"use client";

import { useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight, IconFileCode, IconBrandGithub, IconLoader2 } from "@tabler/icons-react";
import { LANGUAGE_COLORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;
        if (!token) throw new Error("Not authenticated");

        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/reviews?sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Failed to fetch history");
        
        setReviews(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <IconLoader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col">
        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Repository</th>
                <th className="px-6 py-4 font-semibold">Language</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No review history found. Go scan a repository!
                  </td>
                </tr>
              ) : null}
              {reviews.map((item, i) => (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors hover:bg-white/5",
                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                  )}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-zinc-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <IconBrandGithub className="h-4 w-4 text-zinc-500" />
                      {item.repositoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", LANGUAGE_COLORS.default)}>
                      Auto-detected
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                        item.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : item.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      )}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/review/scan?reviewId=${item.id}&owner=${item.repositoryOwner}&repo=${item.repositoryName}`} className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                      View Chat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
