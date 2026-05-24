"use client";

import { useState } from "react";
import { IconPlayerPlay, IconLoader2, IconWand, IconAlertCircle } from "@tabler/icons-react";
import { MOCK_ISSUES, SEVERITY_STYLES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NewReviewPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [reviewType, setReviewType] = useState("full");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleScan = () => {
    if (!code.trim()) return;
    setIsScanning(true);
    setShowResults(false);
    
    // Simulate AI scan delay
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Editor Controls ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg text-sm text-white px-3 py-2 outline-none focus:border-violet-500/50"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Review Type</label>
            <select 
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg text-sm text-white px-3 py-2 outline-none focus:border-violet-500/50"
            >
              <option value="full">Full Review</option>
              <option value="security">Security Scan</option>
              <option value="style">Style Check</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs text-zinc-500 font-mono">snippet.{language === 'python' ? 'py' : language === 'go' ? 'go' : language === 'rust' ? 'rs' : 'ts'}</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full min-h-[320px] bg-transparent text-green-400 font-mono text-sm p-4 outline-none resize-y placeholder:text-zinc-600 leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* ── Action ── */}
      <div className="flex justify-end">
        <button
          onClick={handleScan}
          disabled={!code.trim() || isScanning}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <><IconLoader2 className="h-5 w-5 animate-spin" /> Analyzing...</>
          ) : (
            <><IconPlayerPlay className="h-5 w-5" /> Run Review</>
          )}
        </button>
      </div>

      {/* ── Results ── */}
      {showResults && (
        <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <IconAlertCircle className="h-5 w-5 text-violet-400" />
            Review Results
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> 1 Critical
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> 1 High
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> 1 Medium
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 1 Low
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_ISSUES.map((issue) => (
              <div key={issue.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border", SEVERITY_STYLES[issue.severity])}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-white">{issue.type}</span>
                    <span className="text-xs text-zinc-500">Line {issue.line}</span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-600/40">
                    <IconWand className="h-3.5 w-3.5" />
                    Apply AI Fix
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-zinc-300 mb-4">{issue.description}</p>
                  <div className="rounded-lg bg-black/50 p-3 font-mono text-sm text-red-400 border border-red-500/20 overflow-x-auto">
                    <code>{issue.snippet}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
