"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const formField = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // signin | connect
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    college: "IIT Bombay",
    cfHandle: "",
    lcHandle: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0e1013] px-4 py-12 text-[#ece9e1] selection:bg-[#e9c46a] selection:text-black">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9c46a]/[0.04] blur-[140px]" />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[18%] h-[320px] w-[320px] rounded-full bg-[#3b82f6]/[0.06] blur-[120px]"
        />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 30, 0], x: [0, -24, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[14%] right-[10%] h-[360px] w-[360px] rounded-full bg-[#e9c46a]/[0.05] blur-[130px]"
        />
      </div>

      {/* Top Header / Back Link */}
      <header className="absolute left-6 top-6 z-20 flex items-center gap-3">
        <a
          href="/"
          className="group flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded border border-[#e9c46a]/30 bg-[#e9c46a]/10 text-xs text-[#e9c46a] transition group-hover:bg-[#e9c46a] group-hover:text-black">
            &lt;/&gt;
          </span>
          <span>CAMPUS<span className="text-[#e9c46a]">CODE</span></span>
        </a>
      </header>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="ios-card relative z-10 w-full max-w-[480px] rounded-[1.75rem] p-8 sm:p-10"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[#a4a9b2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e9c46a]" />
            <span>CAMPUS ARENA GATEWAY</span>
          </div>
          <span className="font-mono text-[11px] text-[#737882]">TLS SECURED</span>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {authMode === "signin" ? "WELCOME BACK." : "LINK YOUR HANDLES."}
          </h1>
          <p className="mt-2 text-sm text-[#9fa4ad]">
            {authMode === "signin"
              ? "Access your campus rank, contest countdowns, and peer analytics."
              : "Register your handles once to join your campus coding leaderboard."}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mt-6 flex rounded-full border border-white/10 bg-white/[0.05] p-1 font-mono text-xs">
          {[["signin", "SIGN IN"], ["connect", "CLAIM PROFILE"]].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAuthMode(mode)}
              className={`relative flex-1 rounded-full py-2 transition-colors ${
                authMode === mode ? "font-bold text-black" : "text-[#8e939c] hover:text-white"
              }`}
            >
              {authMode === mode && (
                <motion.span
                  layoutId="auth-mode-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#e9c46a] shadow-sm"
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        <motion.form onSubmit={handleSubmit} initial="hidden" animate="show" variants={formContainer} className="mt-6 space-y-4">
          <motion.div variants={formField}>
            <label className="block font-mono text-xs text-[#9fa4ad]">
              CAMPUS EMAIL OR USERNAME
            </label>
            <input
              required
              type="text"
              placeholder="siddharth@campus.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="ios-input mt-1.5 w-full px-3.5 py-3 font-mono text-xs text-white placeholder:text-[#62666f] outline-none"
            />
          </motion.div>

          <motion.div variants={formField}>
            <div className="flex justify-between font-mono text-xs">
              <label className="text-[#9fa4ad]">PASSWORD</label>
              {authMode === "signin" && (
                <a href="#" className="text-[#7a7f88] hover:text-[#e9c46a] transition">
                  Forgot?
                </a>
              )}
            </div>
            <input
              required
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="ios-input mt-1.5 w-full px-3.5 py-3 font-mono text-xs text-white placeholder:text-[#62666f] outline-none"
            />
          </motion.div>

          {authMode === "connect" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-1"
            >
              <div>
                <label className="block font-mono text-xs text-[#9fa4ad]">
                  CODEFORCES HANDLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. tourist_campus"
                  value={formData.cfHandle}
                  onChange={(e) => setFormData({ ...formData, cfHandle: e.target.value })}
                  className="ios-input mt-1.5 w-full px-3.5 py-3 font-mono text-xs text-white placeholder:text-[#62666f] outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-[#9fa4ad]">
                  LEETCODE USERNAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. algo_master"
                  value={formData.lcHandle}
                  onChange={(e) => setFormData({ ...formData, lcHandle: e.target.value })}
                  className="ios-input mt-1.5 w-full px-3.5 py-3 font-mono text-xs text-white placeholder:text-[#62666f] outline-none"
                />
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            variants={formField}
            disabled={loading}
            className="ios-btn ios-btn-accent mt-2 w-full py-3.5 font-mono text-xs font-bold disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                VERIFYING WITH CAMPUS ARENA...
              </span>
            ) : authMode === "signin" ? (
              <span>SIGN IN TO DASHBOARD →</span>
            ) : (
              <span>LINK HANDLES & ENTER →</span>
            )}
          </motion.button>
        </motion.form>

        <div className="mt-8 border-t border-white/[0.08] pt-5 text-center font-mono text-xs text-[#737882]">
          <span>Protected by Campus Single Sign-On (SSO).</span>
          <div className="mt-2 flex justify-center gap-4 text-[#9fa4ad]">
            <a href="/" className="hover:text-white transition">← Return Home</a>
            <span>•</span>
            <a href="/dashboard" className="text-[#e9c46a] hover:underline">Preview Guest Demo</a>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
