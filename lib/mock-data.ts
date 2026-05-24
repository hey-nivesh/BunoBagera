// ─── Types ───────────────────────────────────────────────────────────────────

export type Plan = "free" | "pro" | "enterprise";

export type User = {
  id: string;
  name: string;
  email: string;
  githubConnected: boolean;
  githubUsername?: string;
  plan: Plan;
  avatar?: string;
  reviewsUsed: number;
  reviewsLimit: number;
};

export type ReviewStatus = "reviewed" | "pending" | "fixed";

export type ReviewItem = {
  id: string;
  name: string;
  language: string;
  status: ReviewStatus;
  issues: number;
  date: string;
  type: "file" | "repo";
};

export type Repository = {
  id: string;
  name: string;
  visibility: "public" | "private";
  language: string;
  lastScan: string;
  issues: number;
  stars: number;
};

export type HistoryItem = ReviewItem & { fullDate: string };

export type IssueResult = {
  id: string;
  line: number;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  snippet: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "usr_01",
  name: "Alex Johnson",
  email: "alex@bubobagera.ai",
  githubConnected: true,
  githubUsername: "alexjohnson",
  plan: "pro",
  reviewsUsed: 78,
  reviewsLimit: 999,
};

export const MOCK_STATS = {
  totalReviews: 142,
  issuesFound: 893,
  fixesApplied: 671,
  reposConnected: 8,
};

export const MOCK_REVIEWS: ReviewItem[] = [
  { id: "r1", name: "app/api/auth.ts",       language: "TypeScript", status: "reviewed", issues: 3,  date: "2 min ago",  type: "file" },
  { id: "r2", name: "my-saas-app",            language: "TypeScript", status: "fixed",    issues: 12, date: "1 hr ago",   type: "repo" },
  { id: "r3", name: "utils/parser.py",        language: "Python",     status: "pending",  issues: 5,  date: "3 hr ago",   type: "file" },
  { id: "r4", name: "backend-api",            language: "Go",         status: "reviewed", issues: 7,  date: "1 day ago",  type: "repo" },
  { id: "r5", name: "components/Button.tsx",  language: "TypeScript", status: "fixed",    issues: 1,  date: "2 days ago", type: "file" },
];

export const MOCK_REPOS: Repository[] = [
  { id: "repo1", name: "my-saas-app",      visibility: "private", language: "TypeScript", lastScan: "1 hour ago",  issues: 12, stars: 0   },
  { id: "repo2", name: "backend-api",      visibility: "private", language: "Go",         lastScan: "1 day ago",   issues: 7,  stars: 0   },
  { id: "repo3", name: "portfolio",        visibility: "public",  language: "TypeScript", lastScan: "3 days ago",  issues: 2,  stars: 24  },
  { id: "repo4", name: "data-processor",   visibility: "private", language: "Python",     lastScan: "5 days ago",  issues: 15, stars: 0   },
  { id: "repo5", name: "cli-tool",         visibility: "public",  language: "Rust",       lastScan: "1 week ago",  issues: 4,  stars: 156 },
  { id: "repo6", name: "mobile-app",       visibility: "private", language: "TypeScript", lastScan: "Never",       issues: 0,  stars: 0   },
];

export const MOCK_HISTORY: HistoryItem[] = [
  { id: "h1", fullDate: "May 24, 2026", date: "May 24, 2026", name: "app/api/auth.ts",       language: "TypeScript", issues: 3,  status: "reviewed", type: "file" },
  { id: "h2", fullDate: "May 24, 2026", date: "May 24, 2026", name: "my-saas-app",            language: "TypeScript", issues: 12, status: "fixed",    type: "repo" },
  { id: "h3", fullDate: "May 23, 2026", date: "May 23, 2026", name: "utils/parser.py",        language: "Python",     issues: 5,  status: "pending",  type: "file" },
  { id: "h4", fullDate: "May 23, 2026", date: "May 23, 2026", name: "backend-api",            language: "Go",         issues: 7,  status: "reviewed",  type: "repo" },
  { id: "h5", fullDate: "May 22, 2026", date: "May 22, 2026", name: "components/Button.tsx",  language: "TypeScript", issues: 1,  status: "fixed",    type: "file" },
  { id: "h6", fullDate: "May 22, 2026", date: "May 22, 2026", name: "data-processor",         language: "Python",     issues: 15, status: "reviewed",  type: "repo" },
  { id: "h7", fullDate: "May 21, 2026", date: "May 21, 2026", name: "portfolio",              language: "TypeScript", issues: 2,  status: "fixed",    type: "repo" },
  { id: "h8", fullDate: "May 20, 2026", date: "May 20, 2026", name: "main.rs",                language: "Rust",       issues: 4,  status: "reviewed",  type: "file" },
];

export const MOCK_ISSUES: IssueResult[] = [
  {
    id: "i1",
    line: 23,
    severity: "high",
    type: "Security",
    description: "User input is passed directly to SQL query without sanitisation — SQL injection risk.",
    snippet: `const result = await db.query(\`SELECT * FROM users WHERE id = \${userId}\`);`,
  },
  {
    id: "i2",
    line: 47,
    severity: "medium",
    type: "Logic Error",
    description: "Missing null check before accessing property. Will throw TypeError at runtime if `user` is undefined.",
    snippet: `const name = user.profile.displayName;`,
  },
  {
    id: "i3",
    line: 61,
    severity: "low",
    type: "Style",
    description: "Variable declared with `var` — use `const` or `let` to avoid hoisting issues.",
    snippet: `var token = generateToken(user.id);`,
  },
  {
    id: "i4",
    line: 88,
    severity: "critical",
    type: "Security",
    description: "JWT secret is hard-coded in source. Move to environment variable immediately.",
    snippet: `const secret = "my-super-secret-jwt-key-do-not-share";`,
  },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Python:     "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Go:         "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Rust:       "bg-orange-500/20 text-orange-300 border-orange-500/30",
  JavaScript: "bg-yellow-400/20 text-yellow-200 border-yellow-400/30",
  Ruby:       "bg-red-500/20 text-red-300 border-red-500/30",
  Java:       "bg-red-600/20 text-red-400 border-red-600/30",
  default:    "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
};

export const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
};
