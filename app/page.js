"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealPlatforms from "../components/RevealPlatforms";
import HeroField from "../components/HeroField";
import CountUp from "../components/CountUp";
import Magnetic from "../components/Magnetic";
import ScrollProgress from "../components/ScrollProgress";

// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Word-by-word hero headline reveal
const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const headlineWord = {
  hidden: { opacity: 0, y: "0.6em", rotate: 3 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Real-time campus solves feed data
const LIVE_SOLVES = [
  { student: "Aarav M.", handle: "aarav_cf", problem: "D. Flower Field (1600)", platform: "Codeforces", verdict: "Accepted", time: "12s ago", color: "#3B82F6" },
  { student: "Ishita S.", handle: "ishita_lc", problem: "Trapping Rain Water (Hard)", platform: "LeetCode", verdict: "Accepted", time: "34s ago", color: "#F59E0B" },
  { student: "Rohan D.", handle: "rohan_chef", problem: "Maximum Subarray Sum", platform: "CodeChef", verdict: "Accepted", time: "1m ago", color: "#EA580C" },
  { student: "Meera N.", handle: "meera_neet", problem: "Alien Dictionary (Graph)", platform: "NeetCode", verdict: "Accepted", time: "2m ago", color: "#A855F7" },
  { student: "Kabir J.", handle: "kabir_cf", problem: "C. Minimum Path Sum (1400)", platform: "Codeforces", verdict: "Accepted", time: "3m ago", color: "#3B82F6" },
];

const LEADERBOARD_DATA = [
  { rank: "01", name: "Aarav Mehta", handle: "aarav_cp", dept: "CSE", batch: "2026", solves: 1248, rating: 2846, change: "+3" },
  { rank: "02", name: "Ishita Singh", handle: "ishita_codes", dept: "IT", batch: "2025", solves: 1180, rating: 2713, change: "+1" },
  { rank: "03", name: "Rohan Das", handle: "rohand_99", dept: "ECE", batch: "2026", solves: 1042, rating: 2684, change: "-1" },
  { rank: "04", name: "Meera Nair", handle: "nair_algo", dept: "CSE", batch: "2027", solves: 986, rating: 2502, change: "+5" },
  { rank: "05", name: "Kabir Jain", handle: "kabir_j", dept: "IT", batch: "2026", solves: 924, rating: 2324, change: "0" },
  { rank: "06", name: "Zoya Khan", handle: "zoyak", dept: "CSE", batch: "2025", solves: 890, rating: 2208, change: "+2" },
  { rank: "42", name: "You (Siddharth)", handle: "sid_dev", dept: "CSE", batch: "2026", solves: 486, rating: 1286, change: "+6", isUser: true },
];

const PLATFORMS = [
  {
    name: "LeetCode",
    totalSolved: "14,820",
    color: "#F59E0B",
    tagline: "Interview Algorithms & Weekly Contests",
    easy: "7,410",
    med: "5,620",
    hard: "1,790",
    activeCoders: "842 students",
  },
  {
    name: "Codeforces",
    totalSolved: "8,594",
    color: "#3B82F6",
    tagline: "Speed Math & Div. 2 / Div. 1 Rounds",
    easy: "3,840",
    med: "3,610",
    hard: "1,144",
    activeCoders: "518 students",
  },
  {
    name: "CodeChef",
    totalSolved: "6,201",
    color: "#EA580C",
    tagline: "Starters & Long Challenge Contests",
    easy: "2,980",
    med: "2,410",
    hard: "811",
    activeCoders: "410 students",
  },
  {
    name: "NeetCode",
    totalSolved: "3,477",
    color: "#A855F7",
    tagline: "Curated Roadmaps & Pattern Mastery",
    easy: "1,850",
    med: "1,290",
    hard: "337",
    activeCoders: "625 students",
  },
];


const CONTESTS = [
  { title: "Codeforces Round #1028 (Div. 2)", time: "Friday, 8:05 PM IST", countdown: "Starts in 1d 04h", type: "Rated", platform: "Codeforces", color: "#3B82F6" },
  { title: "Campus Weekly Sprint #14", time: "Saturday, 7:00 PM IST", countdown: "Starts in 2d 03h", type: "Campus", platform: "Campus Code", color: "#e9c46a" },
  { title: "LeetCode Weekly Contest 441", time: "Sunday, 8:00 AM IST", countdown: "Starts in 2d 16h", type: "Rated", platform: "LeetCode", color: "#F59E0B" },
];

const BTN = "ios-btn px-5 py-3 text-sm font-semibold";
const PRIMARY = `${BTN} ios-btn-accent`;
const GHOST = BTN;

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [searchCoder, setSearchCoder] = useState("");
  const [activeSolveIndex, setActiveSolveIndex] = useState(0);
  const rootRef = useRef(null);
  const heroTextRef = useRef(null);
  const storyRef = useRef(null);
  const storyViewportRef = useRef(null);
  const storyTrackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const boardY = useTransform(scrollYProgress, [0, 0.45], [0, -56]);
  const boardRotate = useTransform(scrollYProgress, [0, 0.45], [0, -1.5]);
  const pointerX = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });
  const fieldX = useTransform(pointerX, [-1, 1], [-10, 10]);
  const fieldY = useTransform(pointerY, [-1, 1], [-8, 8]);
  const fieldRotateX = useTransform(pointerY, [-1, 1], [3, -3]);
  const fieldRotateY = useTransform(pointerX, [-1, 1], [-4, 4]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveSolveIndex((p) => (p + 1) % LIVE_SOLVES.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray("[data-story-panel]");
        gsap.to(storyTrackRef.current, {
          x: () => -(storyTrackRef.current.scrollWidth - storyViewportRef.current.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top top",
            end: "+=1800",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        panels.forEach((panel, index) => {
          gsap.fromTo(panel, { opacity: index === 0 ? 1 : 0.35, scale: index === 0 ? 1 : 0.94 }, {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: storyRef.current,
              start: `${index * 28}% top`,
              end: `${index * 28 + 22}% top`,
              scrub: true,
            },
          });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleHeroMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const filtered = LEADERBOARD_DATA.filter((c) => {
    const q = searchCoder.toLowerCase();
    return (selectedDept === "ALL" || c.dept === selectedDept || c.isUser) && (c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q));
  });
  const solve = LIVE_SOLVES[activeSolveIndex];
  const wrapCls = "mx-auto w-full max-w-6xl px-6";
  const label = "text-sm text-[#8b9099]";

  return (
    <main ref={rootRef} className="relative min-h-screen overflow-x-clip bg-[#080808] text-[#ece9e1]">
      <div className="relative z-10">
      <ScrollProgress />
      <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${isScrolled ? "border-white/[0.08] bg-[#0e1013]/85 py-3 backdrop-blur-md" : "border-transparent py-5"}`}>
        <div className={`${wrapCls} flex items-center justify-between`}>
          <a href="#" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#e9c46a] text-[11px] font-extrabold text-[#0e1013]">&lt;/&gt;</span>
            Campus Code
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-[#a4a9b2] md:flex">
            {[["#live-signal", "Live"], ["#leaderboard", "Leaderboard"], ["#platforms", "Platforms"], ["#contests", "Contests"]].map(([h, t]) => (
              <a key={h} href={h} className="transition-colors hover:text-white">{t}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="hidden text-sm text-[#a4a9b2] transition-colors hover:text-white sm:inline">Live demo</a>
            <a href="/login" className={`${PRIMARY} !px-4 !py-2`}>Log in</a>
          </div>
        </div>
      </header>

      {/* Hero: the scoreboard is the product, so it leads */}
      <section id="live-signal" onMouseMove={handleHeroMove} onMouseLeave={() => { pointerX.set(0); pointerY.set(0); }} className="relative overflow-hidden pb-24 pt-14 md:pt-20">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
          }}
        >
          <HeroField className="h-full w-full" contentRef={heroTextRef} />
        </div>
        <div className={`${wrapCls} relative z-10 grid gap-14 lg:grid-cols-12 lg:items-center`}>
        <motion.div ref={heroTextRef} className="relative z-10 lg:col-span-6" variants={staggerContainer} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="mb-6 flex items-center gap-2 text-sm text-[#a4a9b2]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e9c46a] opacity-60" /><span className="relative h-2 w-2 rounded-full bg-[#e9c46a]" /></span>
            Round 14 is live, 342 students active
          </motion.p>
          <motion.h1 variants={headlineContainer} initial="hidden" animate="show" className="text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            <span className="block">
              {["Your", "campus", "grind,"].map((word) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span variants={headlineWord} className="inline-block">{word}&nbsp;</motion.span>
                </span>
              ))}
            </span>
            <span className="block text-[#a4a9b2]">
              {["finally", "on", "one", "board."].map((word) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span variants={headlineWord} className="inline-block">{word}&nbsp;</motion.span>
                </span>
              ))}
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-md text-lg leading-relaxed text-[#a4a9b2]">
            Connect your LeetCode, Codeforces, CodeChef and NeetCode handles. See where you stand against your campus, and what moved this week.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Magnetic><a href="/login" className={PRIMARY}>Claim your handle</a></Magnetic>
            <Magnetic strength={0.22}><a href="#leaderboard" className={GHOST}>See the leaderboard</a></Magnetic>
          </motion.div>
          <motion.dl variants={fadeUp} className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[[1248, "coders"], [33092, "verified solves"], [4, "platforms"]].map(([n, l]) => (
              <div key={l}><dt className="font-display text-3xl font-semibold tnum"><CountUp value={n} /></dt><dd className={`mt-1 ${label}`}>{l}</dd></div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div className="relative z-10 lg:col-span-6" style={{ y: boardY, rotate: boardRotate, x: fieldX, rotateX: fieldRotateX, rotateY: fieldRotateY, transformPerspective: 900 }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center" aria-hidden="true">
            <div
              className="h-[120%] w-[120%] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(233,196,106,0.16), transparent 60%)" }}
            />
            <div className="absolute h-[100%] w-[100%] rounded-full border border-[#e9c46a]/10" />
          </div>
          <div className="overflow-hidden ios-card">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-sm">
              <span className="font-semibold">Campus standings</span>
              <span className={label}>Updated live</span>
            </div>
            <ul>
              {LEADERBOARD_DATA.slice(0, 5).map((c, index) => (
                <motion.li key={c.rank} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.08, duration: 0.5 }} className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-3.5 last:border-0">
                  <span className="w-6 text-sm tnum text-[#8b9099]">{Number(c.rank)}</span>
                  <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                  <span className="flex gap-1" aria-label="platforms solved">
                    {PLATFORMS.map((p, i) => <span key={p.name} className="h-2.5 w-2.5 rounded-full" style={{ background: p.color, opacity: i < 4 - (Number(c.rank) > 3 ? 1 : 0) ? 1 : 0.2 }} />)}
                  </span>
                  <span className="w-12 text-right text-sm font-semibold tnum">{c.rating}</span>
                </motion.li>
              ))}
            </ul>
            <div className="border-t border-white/10 bg-black/20 px-5 py-4" aria-live="polite">
              <p className={`mb-2 ${label}`}>Just solved</p>
              <AnimatePresence mode="wait">
                <motion.div key={activeSolveIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 text-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: solve.color }} />
                  <span className="font-medium">{solve.student}</span>
                  <span className="min-w-0 flex-1 truncate text-[#a4a9b2]">{solve.problem}</span>
                  <span className="shrink-0 text-xs text-[#737882]">{solve.time}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        </div>
      </section>

      <section aria-hidden="true" className="overflow-hidden border-y border-white/[0.08] py-4">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }} className="flex w-max items-center gap-10 whitespace-nowrap text-sm text-[#8b9099]">
          {[...Array(2)].flatMap((_, k) => ["LeetCode contests", "Codeforces Div. 2", "CodeChef Starters", "NeetCode 150", "Campus sprints", "Daily profile sync"].map((t) => <span key={`${k}${t}`}>{t}</span>))}
        </motion.div>
      </section>

      <section ref={storyRef} className="relative min-h-screen overflow-hidden bg-[#12151a] py-20 md:py-0">
        <div className={`${wrapCls} relative min-h-screen`}>
          <div className="relative z-10 max-w-xl pt-2 md:absolute md:left-6 md:top-1/2 md:w-[34%] md:-translate-y-1/2 md:pt-0">
            <p className="text-sm uppercase tracking-[0.2em] text-[#e9c46a]">The signal layer</p>
            <h2 className="mt-6 max-w-lg text-5xl font-bold leading-[0.94] sm:text-6xl">See the work. Feel the momentum.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#a4a9b2]">Campus Code turns scattered practice into a living signal: every solve, streak, and contest becomes visible at the moment it matters.</p>
          </div>
          <div ref={storyViewportRef} className="mt-12 overflow-hidden md:absolute md:inset-y-0 md:left-[39%] md:mt-0 md:w-[61%]">
            <div ref={storyTrackRef} className="flex w-full flex-col gap-6 pb-2 md:h-full md:w-max md:flex-row md:items-center md:gap-6">
              {[
                ["01", "Every platform connected", "A single rhythm across LeetCode, Codeforces, CodeChef, and NeetCode."],
                ["02", "Every move in context", "Live solves become momentum, not just another number in a profile."],
                ["03", "Every coder in view", "A campus-wide signal that makes the next contest feel closer."],
              ].map(([number, title, copy], index) => (
                <article key={number} data-story-panel className={`flex min-h-[360px] w-full shrink-0 flex-col justify-between rounded-3xl border p-7 md:h-[62vh] md:w-[min(58vw,620px)] md:min-h-0 md:p-10 ${index === 0 ? "border-[#e9c46a] bg-[#e9c46a] text-[#0e1013]" : "border-white/10 bg-white/[0.045]"}`}>
                  <span className={`font-mono text-sm ${index === 0 ? "text-[#0e1013]/60" : "text-[#e9c46a]"}`}>{number}</span>
                  <div>
                    <h3 className="max-w-md text-4xl font-semibold leading-none md:text-5xl">{title}</h3>
                    <p className={`mt-5 max-w-sm text-base leading-relaxed ${index === 0 ? "text-[#0e1013]/70" : "text-[#a4a9b2]"}`}>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="leaderboard" className={`${wrapCls} py-28`}>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-bold sm:text-5xl">The campus leaderboard</h2>
            <p className="mt-3 max-w-md text-[#a4a9b2]">Ratings are recalculated daily from every connected platform.</p>
          </div>
          <div role="group" aria-label="Filter by department" className="flex gap-2">
            {["ALL", "CSE", "IT", "ECE"].map((d) => (
              <button key={d} onClick={() => setSelectedDept(d)} aria-pressed={selectedDept === d}
                className={`ios-btn px-3.5 py-1.5 text-sm ${selectedDept === d ? "border-[#93c5fd]/40 bg-[#60a5fa]/[0.18] font-semibold text-[#dbeafe]" : "text-[#a4a9b2]"}`}>
                {d === "ALL" ? "All departments" : d}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-10 overflow-hidden ios-card">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center">
            <label className="relative block max-w-sm flex-1">
              <span className="sr-only">Search coder or handle</span>
              <input type="text" placeholder="Search coder or handle" value={searchCoder} onChange={(e) => setSearchCoder(e.target.value)}
                className="ios-input w-full px-3.5 py-2 text-sm placeholder:text-[#62666f] outline-none" />
            </label>
            <p className={label}>Showing <span className="font-semibold text-white tnum">{filtered.length}</span> students</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="divide-y divide-white/[0.06]">
            {filtered.length === 0 && <p className="p-8 text-center text-sm text-[#8b9099]">No coders match “{searchCoder}”. Try a different name or handle.</p>}
            {filtered.map((c) => (
              <motion.div key={c.rank} layout variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }} className={`flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center ${c.isUser ? "bg-[#e9c46a]/[0.07]" : "transition-colors hover:bg-white/[0.02]"}`}>
                <div className="flex items-center gap-4">
                  <span className={`w-7 text-sm font-semibold tnum ${c.rank === "01" ? "text-[#e9c46a]" : "text-[#8b9099]"}`}>{c.rank}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1d2128] text-sm font-semibold">{c.name[0]}</span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">{c.name}{c.isUser && <span className="rounded bg-[#e9c46a] px-1.5 py-0.5 text-[10px] font-bold text-black">You</span>}</p>
                    <p className="text-xs text-[#8b9099]">@{c.handle} · {c.dept} &apos;{c.batch.slice(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-10 sm:justify-end">
                  <div className="sm:text-right"><p className="text-sm font-semibold tnum">{c.solves.toLocaleString()}</p><p className="text-xs text-[#737882]">solved</p></div>
                  <div className="min-w-[84px] text-right">
                    <p className="text-sm font-semibold tnum">{c.rating} pts</p>
                    <p className={`text-xs ${c.change.startsWith("+") ? "text-[#4ade80]" : c.change.startsWith("-") ? "text-[#f87171]" : "text-[#737882]"}`}>{c.change !== "0" ? `${c.change} this week` : "No change"}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <RevealPlatforms />

      <section id="contests" className={`${wrapCls} py-28`}>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-bold sm:text-5xl">Coming up this week</h2>
            <p className="mt-3 max-w-md text-[#a4a9b2]">Send reminders to Google Calendar or your campus WhatsApp and Discord groups.</p>
          </div>
          <a href="/dashboard" className={GHOST}>View full schedule</a>
        </motion.div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {CONTESTS.map((c) => (
            <motion.article key={c.title} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="group flex flex-col justify-between ios-card p-6">
              <div>
                <p className="flex items-center gap-2 text-sm text-[#8b9099]"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.platform} · {c.type}</p>
                <h3 className="mt-5 text-xl font-semibold leading-snug">{c.title}</h3>
                <p className="mt-2 text-sm text-[#a4a9b2]">{c.time}</p>
              </div>
              <div className="mt-10 flex items-center justify-between text-sm">
                <span className="text-[#8b9099] tnum">{c.countdown}</span>
                <a href="/login" className="font-medium text-[#ece9e1] underline-offset-4 hover:underline">Set reminder</a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={`${wrapCls} pb-28 pt-12`}>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">Put your campus on the coding map.</h2>
            <p className="mt-4 text-[#a4a9b2]">Join over 1,200 student developers tracking streaks and building recruiter-verified profiles.</p>
          </div>
          <Magnetic><a href="/login" className={`${PRIMARY} !px-7 !py-4 text-base`}>Join Campus Code</a></Magnetic>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.08] py-10 text-sm text-[#737882]">
        <div className={`${wrapCls} flex flex-col items-center justify-between gap-5 sm:flex-row`}>
          <p><span className="font-semibold text-[#ece9e1]">Campus Code</span> · India&apos;s CP network</p>
          <nav aria-label="Footer" className="flex gap-6">
            {[["#leaderboard", "Leaderboard"], ["#platforms", "Platforms"], ["/login", "Sign in"], ["/dashboard", "Dashboard"]].map(([h, t]) => <a key={h} href={h} className="transition-colors hover:text-white">{t}</a>)}
          </nav>
          <p>© {new Date().getFullYear()} Campus Code</p>
        </div>
      </footer>
      </div>
    </main>
  );
}
