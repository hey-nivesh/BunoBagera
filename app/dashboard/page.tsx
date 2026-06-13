"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import CircularProgress from "@/components/dashboard/CircularProgress";
import GithubAnalyzer from "@/components/dashboard/GithubAnalyzer";
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconCircleCheck,
  IconBrandGithub,
  IconCodePlus,
  IconUpload,
  IconLoader2,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardHome() {
  const [stats, setStats] = useState({ total: 0, issues: 'N/A', fixes: 0, connected: 'No' });
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;
        if (!token) return;

        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        
        // Fetch User
        const userRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        // Fetch Reviews
        const reviewsRes = await fetch(`${API_URL}/api/reviews?sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const reviewsData = await reviewsRes.json();
        
        const reviews = reviewsData.data || [];
        const fixesApplied = reviews.filter((r: any) => r.prUrl).length;

        setStats({
          total: reviews.length,
          issues: 'N/A',
          fixes: fixesApplied,
          connected: userData.githubConnected ? 'Yes' : 'No'
        });
        
        setRecentReviews(reviews.slice(0, 5));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 h-24"></div>
          ))}
        </div>
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 h-80"></div>
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 h-36"></div>
            <div className="rounded-xl border border-white/10 bg-white/5 h-56"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reviews"
          value={stats.total.toString()}
          icon={IconTrendingUp}
        />
        <StatCard
          label="Issues Found"
          value={stats.issues}
          icon={IconAlertTriangle}
        />
        <StatCard
          label="Fixes Applied"
          value={stats.fixes.toString()}
          icon={IconCircleCheck}
        />
        <StatCard
          label="GitHub Connected"
          value={stats.connected}
          icon={IconBrandGithub}
        />
      </div>

      {/* ── GitHub Profile AI Analyzer Section ── */}
      <GithubAnalyzer />

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Reviews */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-base font-semibold text-white">Recent Reviews</h2>
            </div>
            <div className="divide-y divide-white/10">
              {recentReviews.length === 0 ? (
                <div className="px-5 py-8 text-center text-zinc-500">No recent reviews.</div>
              ) : null}
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{review.repositoryName}</span>
                      <span className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6">
                    {/* Status Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                        review.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : review.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      )}
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>

                    {/* View Button */}
                    <Link
                      href={`/dashboard/review/scan?reviewId=${review.id}&owner=${review.repositoryOwner}&repo=${review.repositoryName}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Score */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <h2 className="mb-4 text-base font-semibold text-white">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/repositories"
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-violet-500/50"
              >
                <IconBrandGithub className="h-4.5 w-4.5 text-violet-400" />
                Connect a GitHub Repo
              </Link>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm relative overflow-hidden">
            <h2 className="absolute top-5 left-5 text-base font-semibold text-white">
              Health Score
            </h2>
            <div className="mt-8 mb-2">
              <CircularProgress value={84} size={140} strokeWidth={12} />
            </div>
            <p className="text-center text-sm text-zinc-400 mt-2">
              Your overall codebase health is <strong className="text-white font-medium">Good</strong>. Keep resolving critical issues to reach 90%+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
