"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IconLoader2, IconBrandGithub, IconAlertTriangle, IconSend, IconCheck, IconExternalLink } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ScanContent() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const queryReviewId = searchParams.get("reviewId");
  
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [reviewId, setReviewId] = useState<number | null>(queryReviewId ? parseInt(queryReviewId) : null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [prUrl, setPrUrl] = useState<string | null>(null);
  
  const hasRun = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading, fixing]);

  useEffect(() => {
    if (hasRun.current) return;
    
    // If we only have owner/repo but no reviewId, we analyze
    if ((!owner || !repo) && !queryReviewId) return;
    
    hasRun.current = true;

    async function fetchData() {
      try {
        const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;
        if (!token) throw new Error("Not authenticated");

        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

        if (queryReviewId) {
          // Fetch existing review
          const res = await fetch(`${API_URL}/api/reviews/${queryReviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || "Failed to fetch review");
          
          setReviewId(data.data.id);
          setMessages(data.data.messages || []);
          if (data.data.prUrl) setPrUrl(data.data.prUrl);
        } else {
          // Start new analysis
          const res = await fetch(`${API_URL}/api/review/analyze`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ owner, repo })
          });
          
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || data.message || "Failed to analyze repository");
          
          setReviewId(data.id);
          setMessages(data.messages || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo, queryReviewId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !reviewId || chatLoading || fixing) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[2] : null;
      if (!token) throw new Error("Not authenticated");

      const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      const res = await fetch(`${API_URL}/api/review/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reviewId, message: userMsg })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to send message");
      
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApplyFixes = async () => {
    if (!reviewId || chatLoading || fixing) return;
    setFixing(true);
    
    try {
      const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[2] : null;
      if (!token) throw new Error("Not authenticated");

      const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      const res = await fetch(`${API_URL}/api/review/apply-fixes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reviewId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.message || "Failed to apply fixes");
      
      setPrUrl(data.prUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFixing(false);
    }
  };

  if (!owner && !repo && !queryReviewId) {
    return <div className="text-white p-8">Missing repository or review information.</div>;
  }

  // Filter out system messages for display
  const displayMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col pt-4 pb-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
            <IconBrandGithub className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{repo}</h1>
            <p className="text-zinc-400">Owner: {owner}</p>
          </div>
        </div>
        
        {reviewId && !loading && !prUrl && (
          <button 
            onClick={handleApplyFixes}
            disabled={fixing || chatLoading}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fixing ? (
              <><IconLoader2 className="w-5 h-5 animate-spin" /> Applying Fixes...</>
            ) : (
              <><IconCheck className="w-5 h-5" /> Apply Fixes to Repo</>
            )}
          </button>
        )}
      </div>

      {prUrl && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-green-400 font-semibold flex items-center gap-2">
              <IconCheck className="w-5 h-5" /> Pull Request Created Successfully!
            </h3>
            <p className="text-sm text-green-500/80 mt-1">
              The AI has applied the changes and opened a PR on your GitHub repository.
            </p>
          </div>
          <a 
            href={prUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            View Pull Request <IconExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg shrink-0 flex items-center gap-3">
          <IconAlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-6 space-y-6 pr-4 custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <IconLoader2 className="w-10 h-10 animate-spin text-violet-500 mb-4" />
            <p className="text-zinc-400 animate-pulse font-medium">Cloning repository, extracting files, and running AI analysis...</p>
          </div>
        )}

        {displayMessages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${msg.role === 'user' ? 'bg-violet-600' : 'bg-zinc-800'}`}>
              <span className="text-sm font-bold text-white">{msg.role === 'user' ? 'U' : 'AI'}</span>
            </div>
            <div className={`flex-1 max-w-[85%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-violet-500/10 border-violet-500/20 rounded-tr-none text-violet-100' : 'bg-white/5 border-white/10 rounded-tl-none text-zinc-300 prose prose-invert prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10'}`}>
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {(chatLoading || fixing) && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
              <span className="text-sm font-bold text-white">AI</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 px-6 flex items-center gap-3">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="text-sm text-zinc-400 font-medium">{fixing ? "Generating patch and contacting GitHub API..." : "Thinking..."}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading || chatLoading || fixing || !reviewId}
            placeholder="Discuss the code review, ask for modifications, or request specific fixes..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading || chatLoading || fixing || !reviewId}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <IconLoader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
