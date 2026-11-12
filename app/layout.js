import "./globals.css";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import { MotionConfig } from "motion/react";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nf-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--nf-body", display: "swap" });

export const metadata = {
  title: "Campus Code — India's Premier Competitive Programming Network",
  description: "One unified platform for campus competitive programmers. Aggregate LeetCode, Codeforces, CodeChef, and NeetCode rankings, track real-time solves, and showcase your campus talent.",
};

export default function Layout({ children }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-[#0e1013] text-[#ece9e1] antialiased selection:bg-[#e9c46a] selection:text-black">
        <MotionConfig reducedMotion="user">
          <SmoothScroll>{children}</SmoothScroll>
        </MotionConfig>
      </body>
    </html>
  );
}
