"use client";

import { useEffect, useRef } from "react";

const DEFAULT_MX = "50%";
const DEFAULT_MY = "40%";

export default function CursorGlow() {
  const frame = useRef<number | null>(null);
  const latest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      return;
    }

    root.style.setProperty("--mx", DEFAULT_MX);
    root.style.setProperty("--my", DEFAULT_MY);

    const update = () => {
      frame.current = null;
      root.style.setProperty("--mx", `${latest.current.x}px`);
      root.style.setProperty("--my", `${latest.current.y}px`);
    };

    const schedule = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(update);
    };

    const handleMouseMove = (event: MouseEvent) => {
      latest.current.x = event.clientX;
      latest.current.y = event.clientY;
      schedule();
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      root.style.setProperty("--mx", `${touch.clientX}px`);
      root.style.setProperty("--my", `${touch.clientY}px`);
      root.setAttribute("data-glow-pulse", "1");
      window.setTimeout(() => {
        root.removeAttribute("data-glow-pulse");
      }, 300);
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (finePointer) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    } else {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
    }

    return () => {
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return null;
}

