# Campus Code

**India's premier campus competitive-programming network — a landing page, a live leaderboard dashboard, and a login gateway, rebuilt as a premium, animation-rich Next.js app.**

Campus Code unifies the competitive-programming handles students already use — **LeetCode, Codeforces, CodeChef and NeetCode** — into one campus-wide ranking. This repository is the marketing site + product demo: a dark, glassy, motion-heavy front end with an interactive typography-particle hero, live-feeling solves feed, leaderboard, platform stats, contest cards, and a full dashboard.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Design system](#design-system)
- [Animation & interaction](#animation--interaction)
- [Accessibility & performance](#accessibility--performance)
- [Deployment](#deployment)
- [Notes](#notes)

---

## Overview

Campus Code is a fictional-but-polished product concept: a single place where a college's competitive programmers connect their platform handles, see where they stand against their campus, and track their momentum week over week.

The front end is built to feel like an award-winning creative-technology site rather than a generic SaaS template: near-black surfaces, frosted-glass cards, a warm amber accent, smooth Lenis scrolling, and a hero background where tiny ASCII glyphs **light up under the cursor**.

All data is static/mocked — there is no backend; the dashboard and leaderboard are front-end demos.

---

## Features

### Landing page (`/`)
- **Interactive hero background** — a dense grid of tiny ASCII glyphs (`+ · . : i 1 l | { } …` and the word *CAMPUS CODE*) whose density comes from value noise. The cursor acts as a literal light source: glyphs brighten, whiten and grow based on their distance to a smoothed pointer, with **eased per-glyph brightness** so characters slowly glow in and fade out. Illumination is dimmed over the headline so the copy stays clean. Bloom-free — only the characters light up.
- **Live "Campus standings" card** — a frosted-glass scoreboard with animated count-ups and a rotating "Just solved" feed, floating over a warm ambient glow, with subtle scroll/mouse tilt.
- **Word-by-word hero headline reveal**, magnetic CTA buttons, scroll-progress bar, and animated count-up stats.
- **Horizontal "signal layer" story section** pinned with GSAP ScrollTrigger.
- **Leaderboard** with department filter, live search, staggered row reveals, and layout animations.
- **Platform cards** for LeetCode / Codeforces / CodeChef / NeetCode with solved totals and active-coder counts.
- **Contest cards** with countdowns and reminder links.
- **Ticker**, smooth anchor navigation, and a final call-to-action.

### Dashboard (`/dashboard`)
- Sidebar navigation with a glassy active state and layout-animated indicator.
- Stat cards (total solved, rank, contests, streak, hard solves, campus score) with animated count-ups.
- Recharts **bar chart** (7/14/30-day solves) and a **donut** of platform contribution.
- Connected-platform cards with animated progress bars and Easy/Medium/Hard breakdowns.
- Additional views: leaderboards, students directory, contests, recommended problems, analytics, and settings.

### Login (`/login`)
- Frosted-glass auth card with a sliding **Sign in / Claim profile** segmented control (`layoutId` spring), staggered form fields, glass inputs, and floating ambient orbs.

### Cross-cutting
- Apple-iOS-style **glass design system** (`ios-card`, `ios-btn`, `ios-btn-accent`, `ios-input`) with light-blue button hover and a subtle hover-grow on cards.
- Reduced-motion support, off-screen animation pausing, and keyboard-focusable interactive cards.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, **Tailwind CSS v4** |
| Animation | **Motion** (`motion/react`), **GSAP** + ScrollTrigger, **Lenis** smooth scroll |
| Icons | **lucide-react** |
| Charts | **Recharts** |
| Type | `next/font` — Bricolage Grotesque (display) + Figtree (body) |

> `three`, `@react-three/fiber` and `@react-three/drei` are still listed in `package.json` from an earlier 3D hero experiment but are **not used by any current page**; they are not bundled.

---

## Getting started

**Requirements:** Node.js 18.18+ (Node 20+ recommended) and npm.

```bash
# install dependencies
npm install

# start the dev server (Turbopack) at http://localhost:3000
npm run dev

# production build
npm run build

# serve the production build
npm run start
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server (Turbopack). |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build. |

---

## Project structure

```
.
├─ app/
│  ├─ layout.js            # Root layout, fonts, MotionConfig, SmoothScroll
│  ├─ globals.css          # Tailwind v4 theme + glass design-system classes
│  ├─ page.js              # Landing page (hero, leaderboard, platforms, contests)
│  ├─ dashboard/page.js    # Dashboard app shell + all views
│  └─ login/page.js        # Auth / claim-profile page
├─ components/
│  ├─ HeroField.jsx        # Interactive ASCII-particle hero background
│  ├─ RevealPlatforms.jsx  # "Every platform, one profile" card grid
│  ├─ CountUp.jsx          # Scroll-triggered number animation
│  ├─ Magnetic.jsx         # Magnetic-hover wrapper for CTAs
│  ├─ ScrollProgress.jsx   # Top reading-progress bar
│  └─ SmoothScroll.jsx     # Lenis + GSAP ScrollTrigger integration
├─ public/platforms/       # LeetCode / Codeforces / CodeChef / NeetCode logos
├─ next.config.mjs
├─ postcss.config.mjs
├─ package.json
└─ index.html / style.css / script.js   # legacy static prototype (unused)
```

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Marketing landing page. |
| `/dashboard` | Product demo dashboard (stats, charts, platform cards, tabs). |
| `/login` | Sign-in / claim-profile gateway (redirects to `/dashboard` on submit). |

All three routes are statically prerendered.

---

## Design system

Defined in [`app/globals.css`](app/globals.css).

### Palette

| Token | Value | Use |
| --- | --- | --- |
| Base | `#080808` / `#0e1013` | Page background |
| Brand amber | `#e9c46a` | Primary accent, glows |
| Interaction blue | `#60a5fa` / `#93c5fd` / `#dbeafe` | Button hover / focus |
| Text | `#ece9e1` | Primary copy |
| Muted | `#a4a9b2`, `#8b9099`, `#737882` | Secondary copy |
| Dashboard accents | `#ff632e`, `#9165f5`, `#20b486`, `#5b9cff` | Charts & stats |

### Glass utilities

| Class | Purpose |
| --- | --- |
| `.ios-card` | Frosted, 1.5rem-radius panel with sheen, border, inset highlight, and hover-grow. |
| `.ios-btn` | Transparent glass pill; light-blue hover/focus. |
| `.ios-btn-accent` | Primary-CTA variant of the glass pill. |
| `.ios-input` | Rounded translucent input with light-blue focus ring. |

---

## Animation & interaction

- **HeroField** — offscreen-prefixed dense glyph field; per-frame it blits the base and eases only the glyphs inside the cursor radius toward the light (no per-frame noise), keeping a dense look at ~60 FPS. Pauses when off-screen, uses an autonomous ambient glow on touch, and a static frame for `prefers-reduced-motion`.
- **Motion** — entrance/scroll reveals, `AnimatePresence` swaps, `layout`/`layoutId`, springs, and hover states.
- **GSAP + ScrollTrigger** — the pinned horizontal "signal layer" story section.
- **Lenis** — smooth scrolling and smooth in-page anchor links.
- **Recharts** — animated bar/ donut charts.
- **CSS** — glass surfaces, gradient sheens, hover-grow (`scale`), and reduced-motion fallbacks.

---

## Accessibility & performance

- Honors `prefers-reduced-motion` (MotionConfig + static canvas frames).
- Off-screen animation loops pause via `IntersectionObserver`; animation frames and listeners are cleaned up on unmount.
- Keyboard-focusable interactive cards and visible focus states.
- Hero and dashboard use `requestAnimationFrame` with DPR capped at 2.

---

## Deployment

The app deploys anywhere that runs Next.js. The simplest option is **Vercel**:

```bash
# or connect the repo to Vercel and it will build automatically
npm run build
```

For self-hosting, run `npm run build && npm run start` behind a reverse proxy.

---

## Notes

- All data (leaderboard, solves feed, contests, platform stats) is **hard-coded** for demonstration; there is no API or database.
- `index.html`, `style.css` and `script.js` in the project root are an earlier **static prototype** and are not part of the Next.js app.
- The unused `three` / `@react-three/*` dependencies can be removed with `npm uninstall three @react-three/fiber @react-three/drei` to slim the install.
# Campus_CP
