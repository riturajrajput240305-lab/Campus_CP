"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Code2,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Mountain,
  MoreHorizontal,
  Play,
  Settings,
  Swords,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "../../components/CountUp";

const NAV_SECTIONS = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Leaderboard", label: "Leaderboards", icon: Trophy },
  { id: "Students", label: "Students", icon: Users },
  { id: "Contests", label: "Contests", icon: Swords },
  { id: "Problems", label: "Problems", icon: BookOpen },
  { id: "Analytics", label: "College Statistics", icon: BarChart3 },
  { id: "Settings", label: "Profile & Settings", icon: UserRound },
];

const PLATFORM_DATA = [
  {
    name: "LeetCode",
    solved: "487",
    color: "#F59E0B",
    rating: "1,842 (Knight)",
    easy: "216",
    med: "189",
    hard: "82",
    profile: "https://leetcode.com/",
    logo: "/platforms/leetcode.png",
    logoStyle: "w-7 logo-screen",
  },
  {
    name: "Codeforces",
    solved: "312",
    color: "#3B82F6",
    rating: "1,756 (Expert)",
    easy: "138",
    med: "126",
    hard: "48",
    profile: "https://codeforces.com/",
    logo: "/platforms/codeforces.png",
    logoStyle: "w-20 logo-multiply",
  },
  {
    name: "CodeChef",
    solved: "205",
    color: "#EA580C",
    rating: "1,691 (3★)",
    easy: "104",
    med: "76",
    hard: "25",
    profile: "https://www.codechef.com/",
    logo: "/platforms/codechef.png",
    logoStyle: "w-20 logo-multiply",
  },
  {
    name: "NeetCode",
    solved: "80",
    color: "#A855F7",
    rating: "80 / 150 Solved",
    easy: "42",
    med: "29",
    hard: "9",
    profile: "https://neetcode.io/",
    logo: "/platforms/neetcode.png",
    logoStyle: "w-7 logo-multiply",
  },
];

// Activity matrix for daily consistency (past 52 weeks = 52 * 7 = 364 days)
const ACTIVITY_CELLS = Array.from({ length: 168 }, (_, i) => {
  const seed = (i * 13 + Math.floor(i / 5) * 7) % 5;
  return seed;
});

const SOLVE_TRENDS = {
  "7 days": [
    { day: "Mon", solved: 18 }, { day: "Tue", solved: 24 }, { day: "Wed", solved: 16 },
    { day: "Thu", solved: 31 }, { day: "Fri", solved: 22 }, { day: "Sat", solved: 38 }, { day: "Sun", solved: 27 },
  ],
  "14 days": [
    { day: "1", solved: 14 }, { day: "2", solved: 21 }, { day: "3", solved: 18 }, { day: "4", solved: 26 },
    { day: "5", solved: 17 }, { day: "6", solved: 31 }, { day: "7", solved: 24 }, { day: "8", solved: 20 },
    { day: "9", solved: 28 }, { day: "10", solved: 22 }, { day: "11", solved: 34 }, { day: "12", solved: 25 },
    { day: "13", solved: 38 }, { day: "14", solved: 27 },
  ],
  "30 days": Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1}`, solved: 12 + ((i * 11) % 29) })),
};

const DONUT_DATA = [
  { name: "LeetCode", value: 487, color: "#ff632e" },
  { name: "Codeforces", value: 312, color: "#9165f5" },
  { name: "CodeChef", value: 205, color: "#20b486" },
  { name: "NeetCode", value: 80, color: "#5b9cff" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f5f5f5] selection:bg-[#ff632e] selection:text-white md:grid md:grid-cols-[256px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[256px] flex-col border-r border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl px-5 py-6 transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e9c46a] text-[#0e1013]"><Code2 size={20} strokeWidth={2.5} /></span>
            <span className="text-sm font-bold tracking-tight">Campus <span className="text-[#e9c46a]">Code</span></span>
          </a>
          <button onClick={() => setSidebarOpen(false)} className="ios-btn p-2 text-[#92949d] md:hidden" aria-label="Close navigation"><X size={18} /></button>
        </div>
        <p className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5f6068]">Workspace</p>
        <nav className="mt-3 flex flex-1 flex-col gap-1.5">
          {NAV_SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm transition ${isActive ? "border border-[#e9c46a]/25 bg-[#e9c46a]/[0.14] font-semibold text-[#e9c46a] backdrop-blur-md" : "border border-transparent text-[#92949d] hover:bg-[#60a5fa]/[0.12] hover:text-[#dbeafe]"}`}>
                {isActive && <motion.span layoutId="dashboard-active-nav" className="absolute left-0 h-6 w-0.5 rounded-full bg-[#e9c46a]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                <Icon size={17} strokeWidth={1.8} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="ios-card border-[#e9c46a]/20 bg-[#e9c46a]/[0.08] p-4">
          <Zap size={17} className="text-[#e9c46a]" />
          <p className="mt-3 text-sm font-semibold">Sync &amp; Track Your Progress</p>
          <p className="mt-1 text-xs leading-relaxed text-[#92949d]">Keep every platform score fresh.</p>
          <button className="ios-btn ios-btn-accent mt-4 w-full px-3 py-2.5 text-xs font-bold"><Play size={13} fill="currentColor" /> Connect Now</button>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-sm font-bold text-[#e9c46a]">S</div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">Siddharth V.</p><p className="truncate text-xs text-[#73747c]">NIT Patna · CSE &apos;26</p></div>
          <Settings size={15} className="ml-auto text-[#73747c]" />
        </div>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}

      <main className="min-w-0 px-5 py-5 sm:px-8 lg:px-10 lg:py-8">
        <header className="flex items-start justify-between gap-5">
          <div className="flex items-start gap-3">
            <button onClick={() => setSidebarOpen(true)} className="ios-btn mt-1 p-2.5 text-[#92949d] md:hidden" aria-label="Open navigation"><Menu size={18} /></button>
            <div>
              <p className="text-sm text-[#92949d]">Tuesday, November 10, 2026</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Good Evening, Siddharth <span className="text-[#ff632e]">.</span></h1>
              <p className="mt-1 text-sm text-[#73747c]">Here&apos;s your competitive programming overview at NIT Patna.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="ios-btn hidden px-3.5 py-2.5 text-xs text-[#92949d] sm:inline-flex"><span>Last 30 days</span><ChevronDown size={14} /></button>
            <button className="ios-btn relative p-2.5 text-[#92949d] hover:text-white" aria-label="Notifications"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff632e]" /></button>
            <div className="hidden h-9 w-9 place-items-center rounded-full bg-white/[0.08] text-sm font-bold text-[#ff8c65] sm:grid">S</div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="mt-8 max-w-[1500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "Dashboard" && <DashboardView />}
              {activeTab === "Leaderboard" && <LeaderboardView />}
              {activeTab === "Students" && <StudentsView />}
              {activeTab === "Contests" && <ContestsView />}
              {activeTab === "Problems" && <ProblemsView />}
              {activeTab === "Analytics" && <AnalyticsView />}
              {activeTab === "Settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// 1. Dashboard Main View
function DashboardView() {
  const [range, setRange] = useState("7 days");
  const trendData = SOLVE_TRENDS[range];
  const card = "ios-card";
  const stats = [
    { label: "Total Solved", value: "1,084", count: { value: 1084 }, note: "+14 this week", icon: Code2, tone: "text-[#20b486]", spark: true },
    { label: "College Rank", value: "#42", count: { value: 42, prefix: "#" }, note: "Top 3.5%", icon: Trophy, tone: "text-[#ff632e]" },
    { label: "Contests Played", value: "48", count: { value: 48 }, note: "Rating: 1,842", icon: Swords, tone: "text-[#9165f5]" },
    { label: "Current Streak", value: "12 Days", count: { value: 12, suffix: " Days" }, note: "Best: 45 days", icon: Zap, tone: "text-[#f5b942]" },
    { label: "Hard Solves", value: "164", count: { value: 164 }, note: "15.1% hard", icon: Mountain, tone: "text-[#f05252]" },
    { label: "Campus Score", value: "8.7 / 10", count: { value: 8.7, decimals: 1, suffix: " / 10" }, note: "Tier 1 signal", icon: Activity, tone: "text-[#5b9cff]" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-7">
      <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={`${card} group p-4 sm:p-5 ${index === 0 ? "border-[#ff632e]/35 bg-[#ff632e]/[0.07]" : ""}`}>
              <div className="flex items-start justify-between"><span className="text-xs text-[#92949d]">{stat.label}</span><Icon size={16} className={stat.tone} /></div>
              <p className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{stat.count ? <CountUp {...stat.count} /> : stat.value}</p>
              <div className="mt-2 flex items-center justify-between gap-2"><span className={`text-xs ${stat.tone}`}>{stat.note}</span>{stat.spark && <Sparkline />}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-7 2xl:grid-cols-[1.55fr_1fr]">
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-[#92949d]">ACTIVITY OVERVIEW</p><h2 className="mt-2 text-xl font-semibold">Problem Solving Trend</h2></div><select value={range} onChange={(event) => setRange(event.target.value)} className="ios-input px-3 py-2 text-xs text-[#92949d] outline-none"><option>7 days</option><option>14 days</option><option>30 days</option></select></div>
          <div className="mt-6 h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={trendData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}><defs><linearGradient id="orangeBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff8c65" /><stop offset="100%" stopColor="#ff3d8d" /></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(255,255,255,.07)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#73747c", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#73747c", fontSize: 11 }} /><Tooltip cursor={{ fill: "rgba(255,255,255,.03)" }} contentStyle={{ background: "#1e1f24", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, color: "#f5f5f5" }} /><Bar dataKey="solved" radius={[6, 6, 2, 2]}>{trendData.map((item, index) => <Cell key={item.day} fill={index === trendData.length - 2 ? "url(#orangeBar)" : "#45464d"} />)}</Bar></BarChart></ResponsiveContainer>
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex items-start justify-between"><div><p className="text-xs font-medium text-[#92949d]">BREAKDOWN</p><h2 className="mt-2 text-xl font-semibold">Platform Contribution</h2></div><button className="rounded-lg p-1.5 text-[#73747c] hover:bg-white/5" aria-label="More platform options"><MoreHorizontal size={18} /></button></div>
          <div className="mt-3 grid items-center gap-2 sm:grid-cols-[1fr_1fr]"><div className="relative h-[225px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={DONUT_DATA} dataKey="value" innerRadius={66} outerRadius={88} paddingAngle={3} stroke="none" animationDuration={700}>{DONUT_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-semibold"><CountUp value={1084} /></p><p className="mt-1 text-[11px] text-[#92949d]">Total solved</p></div></div></div><div className="space-y-4">{DONUT_DATA.map((item) => <div key={item.name} className="flex items-center gap-2.5 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} /><span className="flex-1 text-[#92949d]">{item.name}</span><span className="font-semibold">{item.value}</span><span className="w-10 text-right text-[#73747c]">{Math.round((item.value / 1084) * 100)}%</span></div>)}</div></div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-medium text-[#92949d]">YOUR ACCOUNTS</p><h2 className="mt-2 text-xl font-semibold">Connected Platform Status</h2></div><button className="ios-btn px-3.5 py-2.5 text-xs font-semibold"><Activity size={14} /> Sync Now</button></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLATFORM_DATA.map((platform) => <PlatformCard key={platform.name} platform={platform} card={card} />)}
        </div>
      </section>
    </motion.div>
  );
}

function Sparkline() {
  return <svg viewBox="0 0 64 22" className="h-6 w-16 overflow-visible" aria-hidden="true"><path d="M1 18 C9 16, 11 19, 17 13 S26 14, 31 11 S39 15, 44 8 S54 11, 63 2" fill="none" stroke="#20b486" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function PlatformCard({ platform, card }) {
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={`${card} flex min-h-[300px] flex-col justify-between overflow-hidden p-5`}>
      <div><div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}><Code2 size={16} /></span><div><h3 className="text-sm font-semibold">{platform.name}</h3><span className="mt-0.5 flex items-center gap-1 text-[10px] text-[#20b486]"><span className="h-1.5 w-1.5 rounded-full bg-[#20b486]" />Connected</span></div></div><a href={platform.profile} target="_blank" rel="noreferrer" className="text-[#73747c] transition hover:text-white" aria-label={`Open ${platform.name} profile`}><ExternalLink size={15} /></a></div><div className="mt-7"><span className="text-4xl font-semibold tracking-tight">{platform.solved}</span><span className="ml-2 text-xs text-[#92949d]">problems</span><p className="mt-2 text-xs font-medium" style={{ color: platform.color }}>{platform.rating}</p></div></div>
      <div className="mt-6 border-t border-white/[0.07] pt-4"><div className="grid grid-cols-3 gap-2">{[["Easy", platform.easy, "#20b486"], ["Medium", platform.med, "#f5b942"], ["Hard", platform.hard, "#f05252"]].map(([label, value, color]) => <div key={label} className="rounded-xl bg-white/[0.05] px-2 py-2.5 text-center"><span className="text-[10px]" style={{ color }}>{label}</span><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div><div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.08]"><motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="h-full origin-left rounded-full" style={{ width: `${Math.min(100, (Number(platform.solved) / 500) * 100)}%`, background: platform.color }} /></div></div>
    </motion.article>
  );
}

// 2. Leaderboard View
function LeaderboardView() {
  return (
    <div className="ios-card overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white">Campus Solves Leaderboard</h2>
          <p className="font-mono text-xs text-[#8b9099] mt-1">Week 44 • Resets in 2d 14h</p>
        </div>
        <button className="ios-btn px-3.5 py-1.5 font-mono text-xs">
          Download CSV ↗
        </button>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {[
          { rank: "01", name: "Aarav Mehta", dept: "CSE '26", rating: 2846, solves: 1248, platform: "Codeforces Specialist" },
          { rank: "02", name: "Ishita Singh", dept: "IT '25", rating: 2713, solves: 1180, platform: "LeetCode Guardian" },
          { rank: "03", name: "Rohan Das", dept: "ECE '26", rating: 2684, solves: 1042, platform: "CodeChef 4★" },
          { rank: "42", name: "You (Siddharth)", dept: "CSE '26", rating: 1286, solves: 486, platform: "LeetCode Knight", isUser: true },
        ].map((item) => (
          <div
            key={item.rank}
            className={`flex items-center justify-between p-4 px-6 font-mono text-xs ${
              item.isUser ? "bg-[#e9c46a]/10 ring-1 ring-[#e9c46a]/30" : "hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-[#e9c46a] w-6">{item.rank}</span>
              <div>
                <p className="font-bold text-white text-sm">{item.name}</p>
                <p className="text-[#8b9099] text-[11px]">{item.dept} • {item.platform}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#e9c46a] block">{item.rating} pts</span>
              <span className="text-[#8b9099] text-[11px]">{item.solves} Solves</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Students Directory View
function StudentsView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        { name: "Aarav Mehta", handle: "@aarav_cf", dept: "Computer Science", solves: 1248, rating: 2846 },
        { name: "Ishita Singh", handle: "@ishita_lc", dept: "Information Tech", solves: 1180, rating: 2713 },
        { name: "Rohan Das", handle: "@rohan_cp", dept: "Electronics", solves: 1042, rating: 2684 },
        { name: "Meera Nair", handle: "@nair_algo", dept: "Computer Science", solves: 986, rating: 2502 },
        { name: "Kabir Jain", handle: "@kabir_cf", dept: "Information Tech", solves: 924, rating: 2324 },
        { name: "Zoya Khan", handle: "@zoyak", dept: "Computer Science", solves: 890, rating: 2208 },
      ].map((student) => (
        <div key={student.name} className="ios-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] font-mono font-bold text-[#e9c46a]">
              {student.name[0]}
            </div>
            <div>
              <p className="font-bold text-white">{student.name}</p>
              <p className="font-mono text-xs text-[#8b9099]">{student.handle}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-white/[0.06] pt-3 flex justify-between font-mono text-xs">
            <span className="text-[#8b9099]">{student.dept}</span>
            <span className="font-bold text-[#e9c46a]">{student.rating} pts</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Contests View
function ContestsView() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[
        { title: "Codeforces Round #1028 (Div. 2)", time: "Friday, 8:05 PM IST", duration: "2 Hours", type: "Rated", tag: "Codeforces" },
        { title: "Campus Weekly Sprint #14", time: "Saturday, 7:00 PM IST", duration: "90 Mins", type: "Campus Only", tag: "Campus Code" },
        { title: "CodeChef Starters 198", time: "Sunday, 8:00 PM IST", duration: "2 Hours", type: "Rated", tag: "CodeChef" },
        { title: "LeetCode Weekly Contest 441", time: "Sunday, 8:00 AM IST", duration: "90 Mins", type: "Global Rated", tag: "LeetCode" },
      ].map((contest) => (
        <div key={contest.title} className="ios-card p-6">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-[#e9c46a]">{contest.tag}</span>
            <span className="text-[#8b9099]">{contest.duration}</span>
          </div>
          <h3 className="mt-3 text-xl font-bold text-white">{contest.title}</h3>
          <p className="mt-1 font-mono text-xs text-[#a4a9b2]">{contest.time}</p>
          <button className="ios-btn ios-btn-accent mt-5 px-4 py-2 font-mono text-xs font-semibold">
            Set Reminder ↗
          </button>
        </div>
      ))}
    </div>
  );
}

// 5. Problems View
function ProblemsView() {
  return (
    <div className="ios-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.08] font-mono text-xs text-[#a4a9b2]">
        RECOMMENDED BY CAMPUS SENIORS
      </div>
      <div className="divide-y divide-white/[0.06]">
        {[
          { title: "Two Sum", platform: "LeetCode", diff: "Easy", tag: "Arrays & Hash Table" },
          { title: "Trapping Rain Water", platform: "LeetCode", diff: "Hard", tag: "Two Pointers / Stack" },
          { title: "D. Flower Field", platform: "Codeforces", diff: "Medium", tag: "DFS / Greedy (1600)" },
          { title: "Course Schedule II", platform: "LeetCode", diff: "Medium", tag: "Topological Sort" },
        ].map((prob, i) => (
          <div key={prob.title} className="flex items-center justify-between p-4 px-6 font-mono text-xs hover:bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <span className="text-[#737882]">0{i + 1}</span>
              <div>
                <p className="font-bold text-white">{prob.title}</p>
                <p className="text-[#8b9099] text-[11px]">{prob.platform} • {prob.tag}</p>
              </div>
            </div>
            <span className={prob.diff === "Easy" ? "text-[#4ade80]" : prob.diff === "Medium" ? "text-[#facc15]" : "text-[#f87171]"}>
              {prob.diff}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Analytics View
function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="ios-card p-6">
        <h3 className="font-mono text-xs text-[#a4a9b2]">RATING TRAJECTORY ACROSS ALL PLATFORMS</h3>
        <svg viewBox="0 0 600 200" className="mt-6 w-full h-48">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9c46a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e9c46a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 160 Q100 130 200 110 T400 65 T600 30 L600 200 L0 200 Z"
            fill="url(#chartGrad)"
          />
          <path
            d="M0 160 Q100 130 200 110 T400 65 T600 30"
            fill="none"
            stroke="#e9c46a"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
}

// 7. Settings View
function SettingsView() {
  return (
    <div className="max-w-2xl space-y-4 font-mono text-xs">
      {[
        { title: "Profile Handles", desc: "Manage LeetCode, Codeforces, and CodeChef handles" },
        { title: "Campus Verification", desc: "Current institution: IIT Bombay (Verified via student email)" },
        { title: "Contest Reminders", desc: "Push alerts to browser 15 minutes before round starts" },
        { title: "Privacy & Visibility", desc: "Show profile on public college ranking boards" },
      ].map((item) => (
        <div key={item.title} className="flex items-center justify-between ios-card p-5">
          <div>
            <p className="font-bold text-white text-sm">{item.title}</p>
            <p className="text-[#8b9099] text-xs mt-1">{item.desc}</p>
          </div>
          <button className="ios-btn px-3 py-1.5 text-white">
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}
