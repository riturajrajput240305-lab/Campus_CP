"use client";

import { useEffect, useRef } from "react";

/**
 * HeroField — dense interactive typography background.
 *
 * A fine grid of tiny ASCII glyphs (dots, plus signs, i / 1 / l / |, and letters
 * of "CAMPUS CODE") whose density comes from value noise. The base field is
 * pre-rendered once to an offscreen canvas; each frame we blit it with a slow
 * drift, then ease each glyph's brightness toward the cursor's light so
 * characters slowly brighten as the pointer approaches and slowly fade as it
 * leaves. Dimmed where the hero copy sits so text stays clean.
 */

const WORD = "CAMPUS CODE ";
const SYMBOLS = ["+", "+", "+", ".", ":", "i", "1", "l", "|", "-", "="];

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise2(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi + yi * 57);
  const b = hash(xi + 1 + yi * 57);
  const c = hash(xi + (yi + 1) * 57);
  const d = hash(xi + 1 + (yi + 1) * 57);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

export default function HeroField({ className = "", contentRef }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const STEP = coarse ? 18 : 14;
    const PAD = 24;
    const RADIUS = coarse ? 210 : 185;
    const FONT = `${coarse ? 10 : 8}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const GLOW_FONT = `${coarse ? 13 : 11}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const fps = coarse ? 30 : 60;
    const DECAY = 0.94; // how slowly unlit glyphs fade out
    const EASE = 0.12; // how slowly glyphs brighten toward the light

    let width = 0;
    let height = 0;
    let baseCanvas = null;
    let cols = 0;
    let rows = 0;
    let glow = null;
    let chars = null;
    let sx = 0;
    let sy = 0;
    let intensity = 0;

    const buildBase = () => {
      cols = Math.ceil((width + PAD * 2) / STEP) + 1;
      rows = Math.ceil((height + PAD * 2) / STEP) + 1;
      glow = new Float32Array(cols * rows);
      chars = new Array(cols * rows);

      baseCanvas = document.createElement("canvas");
      baseCanvas.width = Math.max(1, Math.round((width + PAD * 2) * dpr));
      baseCanvas.height = Math.max(1, Math.round((height + PAD * 2) * dpr));
      const b = baseCanvas.getContext("2d");
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, width + PAD * 2, height + PAD * 2);
      b.font = FONT;
      b.textAlign = "center";
      b.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = noise2(c * 0.06 + 5.3, r * 0.35 + 2.7);
          const i = r * cols + c;
          if (v < 0.5) {
            chars[i] = null;
            continue;
          }
          const ch =
            v < 0.62
              ? "."
              : v < 0.8
              ? SYMBOLS[Math.floor(hash(c * 3.1 + r * 7.7) * SYMBOLS.length)]
              : WORD[((c % WORD.length) + WORD.length) % WORD.length];
          chars[i] = ch;
          b.globalAlpha = 0.09 + v * 0.24;
          b.fillStyle = v > 0.8 ? "rgb(178,184,198)" : "rgb(148,156,170)";
          b.fillText(ch, c * STEP + STEP / 2, r * STEP + STEP / 2);
        }
      }
      b.globalAlpha = 1;
    };

    const paint = (now) => {
      const t = now * 0.001;
      const target = pointerRef.current;

      if (coarse) {
        const tx = width * (0.5 + Math.sin(t * 0.3) * 0.3);
        const ty = height * (0.44 + Math.cos(t * 0.24) * 0.2);
        sx += (tx - sx) * 0.05;
        sy += (ty - sy) * 0.05;
        intensity += (0.75 - intensity) * 0.05;
      } else {
        sx += (target.x - sx) * 0.2;
        sy += (target.y - sy) * 0.2;
        intensity += ((target.active ? 1 : 0) - intensity) * 0.1;
      }

      // Dim the illumination where the hero copy already sits so the text stays clean.
      let textFactor = 1;
      const contentEl = contentRef && contentRef.current;
      if (contentEl) {
        const cr = contentEl.getBoundingClientRect();
        const vr = canvas.getBoundingClientRect();
        const left = cr.left - vr.left;
        const top = cr.top - vr.top;
        const right = cr.right - vr.left;
        const bottom = cr.bottom - vr.top;
        const dx = Math.max(left - sx, 0, sx - right);
        const dy = Math.max(top - sy, 0, sy - bottom);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const tt = Math.min(1, dist / 80);
        const eased = tt * tt * (3 - 2 * tt);
        const insideFactor = coarse ? 0.55 : 0.3;
        textFactor = insideFactor + (1 - insideFactor) * eased;
      }
      const eff = intensity * textFactor;

      const driftX = Math.sin(t * 0.16) * 5 + (sx - width / 2) * 0.006;
      const driftY = Math.cos(t * 0.12) * 4;

      ctx.clearRect(0, 0, width, height);

      if (baseCanvas) {
        ctx.globalAlpha = 0.9 + 0.1 * Math.sin(t * 0.6);
        ctx.drawImage(
          baseCanvas,
          -PAD + driftX,
          -PAD + driftY,
          baseCanvas.width / dpr,
          baseCanvas.height / dpr
        );
        ctx.globalAlpha = 1;
      }

      // Fade every glyph's stored brightness down slowly.
      const gArr = glow;
      for (let i = 0; i < gArr.length; i++) {
        const g = gArr[i] * DECAY;
        gArr[i] = g < 0.002 ? 0 : g;
      }

      // Glyphs near the cursor ease up toward the light.
      if (eff > 0.004) {
        const baseCX = sx + PAD - driftX;
        const baseCY = sy + PAD - driftY;
        const colC = Math.floor(baseCX / STEP);
        const rowC = Math.floor(baseCY / STEP);
        const rc = Math.ceil(RADIUS / STEP) + 1;
        const radiusSq = RADIUS * RADIUS;
        const r0 = Math.max(0, rowC - rc);
        const r1 = Math.min(rows - 1, rowC + rc);
        const c0 = Math.max(0, colC - rc);
        const c1 = Math.min(cols - 1, colC + rc);

        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const x = c * STEP + STEP / 2 - PAD + driftX;
            const y = r * STEP + STEP / 2 - PAD + driftY;
            const dx = x - sx;
            const dy = y - sy;
            const d2 = dx * dx + dy * dy;
            if (d2 > radiusSq) continue;
            const tgt = (1 - Math.sqrt(d2) / RADIUS) * eff;
            const i = r * cols + c;
            gArr[i] += (tgt - gArr[i]) * EASE;
          }
        }
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Silver pass — all lit glyphs at base size.
      ctx.font = FONT;
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols;
        const y = r * STEP + STEP / 2 - PAD + driftY;
        for (let c = 0; c < cols; c++) {
          const g = gArr[rowBase + c];
          if (g <= 0.03) continue;
          const ch = chars[rowBase + c];
          if (!ch) continue;
          const mix = Math.min(1, g / 0.6);
          ctx.globalAlpha = Math.min(0.92, 0.1 + g * 1.5);
          ctx.fillStyle = `rgb(${148 + Math.round(107 * mix)},${156 + Math.round(99 * mix)},${170 + Math.round(85 * mix)})`;
          ctx.fillText(ch, c * STEP + STEP / 2 - PAD + driftX, y);
        }
      }

      // White core — bright ones grow slightly; alpha fades in/out smoothly.
      ctx.font = GLOW_FONT;
      ctx.fillStyle = "#ffffff";
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols;
        const y = r * STEP + STEP / 2 - PAD + driftY;
        for (let c = 0; c < cols; c++) {
          const g = gArr[rowBase + c];
          if (g <= 0.4) continue;
          const ch = chars[rowBase + c];
          if (!ch) continue;
          ctx.globalAlpha = Math.min(0.98, ((g - 0.4) / 0.55) * 0.98);
          ctx.fillText(ch, c * STEP + STEP / 2 - PAD + driftX, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBase();
      sx = width / 2;
      sy = height / 2;
      if (reduce) paint(0);
    };

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    const onPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      pointerRef.current.x = px;
      pointerRef.current.y = py;
      pointerRef.current.active = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };

    if (!coarse) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let last = 0;
    const loop = (frameNow) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visible) return;
      if (frameNow - last < 1000 / fps) return;
      last = frameNow;
      paint(frameNow);
    };
    if (!reduce) rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [contentRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
