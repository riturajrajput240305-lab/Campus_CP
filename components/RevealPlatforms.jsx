"use client";

import { motion } from "motion/react";

const PLATFORMS = [
  {
    name: "LeetCode",
    tagline: "Interview algorithms & weekly contests",
    color: "#F59E0B",
    totalSolved: "14,820",
    activeCoders: "842 students",
  },
  {
    name: "Codeforces",
    tagline: "Speed math & Div. 2 / Div. 1 rounds",
    color: "#3B82F6",
    totalSolved: "8,594",
    activeCoders: "518 students",
  },
  {
    name: "CodeChef",
    tagline: "Starters & long challenge contests",
    color: "#EA580C",
    totalSolved: "6,201",
    activeCoders: "410 students",
  },
  {
    name: "NeetCode",
    tagline: "Curated roadmaps & pattern mastery",
    color: "#A855F7",
    totalSolved: "3,477",
    activeCoders: "625 students",
  },
];

function PlatformCard({ platform }) {
  return (
    <div className="ios-card flex h-[22rem] w-full flex-col items-center justify-center p-6 text-center">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: platform.color }} />
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#ece9e1]">{platform.name}</h3>
      <p className="mt-2 max-w-[15rem] text-sm text-[#8b9099]">{platform.tagline}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tnum text-[#ece9e1]">
          {platform.totalSolved}
        </span>
        <span className="text-xs text-[#737882]">solved</span>
      </div>
      <p className="mt-3 text-xs text-[#a4a9b2]">{platform.activeCoders} active</p>
    </div>
  );
}

export default function RevealPlatforms() {
  return (
    <section id="platforms" className="mx-auto w-full max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">Every platform, one profile</h2>
          <p className="mt-3 max-w-md text-[#a4a9b2]">
            Public problem stats sync daily, so students are ranked fairly wherever they practise.
          </p>
        </div>
      </motion.div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map((p) => (
          <PlatformCard key={p.name} platform={p} />
        ))}
      </div>
    </section>
  );
}
