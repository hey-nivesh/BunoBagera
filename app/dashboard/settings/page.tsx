"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IconBrandGithub, IconUpload, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type TabId = "profile" | "github" | "notifications" | "billing";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "github", label: "GitHub Integration" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing & Plan" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [prAlerts, setPrAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[2] : null;
      if (!token) throw new Error("Not authenticated");

      const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: name,
          email: email
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to save profile");

      setSuccess(true);
      // Optional: re-fetch or re-login to update context, but refreshing is easiest for now
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* ── Tabs ── */}
      <div className="flex space-x-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-violet-600/20 text-violet-300 shadow-sm border border-violet-500/30"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
            
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/20 text-2xl font-medium text-violet-300 ring-1 ring-violet-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <IconUpload className="h-4 w-4" />
                Upload Avatar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">Profile saved successfully!</p>}

            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <IconLoader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}

        {/* GitHub Tab */}
        {activeTab === "github" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-lg font-semibold text-white">GitHub Integration</h2>
            <p className="text-sm text-zinc-400">
              Connect your GitHub account to automatically scan pull requests and repositories.
            </p>

            {user.githubConnected ? (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                    <IconBrandGithub className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.githubUsername || 'Connected'}</p>
                    <p className="text-xs text-zinc-500">Connected via OAuth</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                  Disconnect
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-2 rounded-xl bg-[#24292e] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363d]">
                <IconBrandGithub className="h-5 w-5" />
                Connect GitHub Account
              </button>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
            
            <div className="space-y-4">
              <ToggleRow 
                title="Email Alerts" 
                description="Receive emails when critical security issues are found."
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
              />
              <div className="h-px w-full bg-white/5" />
              <ToggleRow 
                title="PR Review Comments" 
                description="BuboBagera will automatically comment on your GitHub PRs."
                checked={prAlerts}
                onChange={() => setPrAlerts(!prAlerts)}
              />
              <div className="h-px w-full bg-white/5" />
              <ToggleRow 
                title="Weekly Digest" 
                description="A weekly summary of your codebase health and issues fixed."
                checked={weeklyDigest}
                onChange={() => setWeeklyDigest(!weeklyDigest)}
              />
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-lg font-semibold text-white">Billing & Plan</h2>
            
            <div className="rounded-xl border border-violet-500/30 bg-violet-600/10 p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white capitalize">{user.plan || 'Free'} Plan</h3>
                  <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">Active</span>
                </div>
                <p className="text-sm text-violet-200/70 mb-6">You are currently on the {user.plan || 'Free'} plan.</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">Monthly Usage</span>
                    <span className="font-medium text-white">{user.reviewsUsed || 0} / {user.reviewsLimit || 50} Reviews</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${((user.reviewsUsed || 0) / (user.reviewsLimit || 50)) * 100}%` }}
                    />
                  </div>
                </div>

                <button className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-[0.98]">
                  Upgrade Plan
                </button>
              </div>
              {/* Decorative glow */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Switch/Toggle for Notifications
function ToggleRow({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs text-zinc-400 mt-0.5">{description}</span>
      </div>
      <button 
        type="button"
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#09090b]",
          checked ? "bg-violet-600" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
