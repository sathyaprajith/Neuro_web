import { useEffect, useState } from "react";
import { getLenis } from "../lib/lenis";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function scrollToSection(id: string, reducedMotion = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis && !reducedMotion) {
    lenis.scrollTo(el, { offset: -84, duration: 1.5 });
    return;
  }
  el.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function scrollToTop(reducedMotion = false): void {
  const lenis = getLenis();
  if (lenis && !reducedMotion) {
    lenis.scrollTo(0, { duration: 1.5 });
    return;
  }
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
}
