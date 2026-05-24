"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { IconBrandGithub } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const ACCENT = "#ccff00";

export function GithubConnectModal() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const isOpen = !!user && !user.githubConnected && pathname !== '/dashboard/github/callback';
  
  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard/github/callback`
      : "http://localhost:3000/dashboard/github/callback";
    const scope = "repo,user";
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-[#050505] border-[#ccff00]/20 text-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase tracking-[0.25em] flex items-center gap-2 text-white">
            <IconBrandGithub className="w-5 h-5 text-[#ccff00]" />
            Connect GitHub
          </DialogTitle>
          <DialogDescription className="text-zinc-400 mt-2 text-xs leading-relaxed font-sans">
            To start scanning your repositories, you need to connect your GitHub account. 
            This allows us to securely access your code and find vulnerabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div
            className="p-4 text-xs leading-relaxed font-sans"
            style={{
              background: "rgba(204,255,0,0.03)",
              border: "1px solid rgba(204,255,0,0.15)",
            }}
          >
            We only request read access to your repositories. Your code is never permanently stored on our servers.
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConnect}
            className="w-full text-xs font-black uppercase tracking-widest text-black transition-all hover:opacity-90 py-6"
            style={{
              background: ACCENT,
              clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
            }}
          >
            Connect GitHub Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
