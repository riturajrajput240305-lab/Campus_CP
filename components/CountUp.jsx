"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1];

function formatNumber(value, decimals) {
  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toLocaleString("en-US");
}

/**
 * Counts a number from 0 to `value` when it scrolls into view.
 *
 * Server renders the final value (so crawlers and no-JS users see the real
 * number), then the client animates from 0 once it enters the viewport.
 * Reduced-motion users keep the final value with no animation.
 */
export default function CountUp({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  style,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const final = `${prefix}${formatNumber(value, decimals)}${suffix}`;
  const [display, setDisplay] = useState(final);

  useEffect(() => {
    if (!inView || reduce) return;

    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (latest) =>
        setDisplay(`${prefix}${formatNumber(latest, decimals)}${suffix}`),
    });

    return () => controls.stop();
  }, [inView, reduce, value, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
