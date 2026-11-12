"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Subtle magnetic pull toward the cursor, eased with a spring.
 * Transform animations are automatically disabled for reduced-motion users
 * via the app-level <MotionConfig reducedMotion="user">.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
  max = 12,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * max * strength);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * max * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
