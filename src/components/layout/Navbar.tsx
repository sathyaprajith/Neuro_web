import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../ui/cn";
import { MenuIcon, MoonIcon, SunIcon, CloseIcon } from "../ui/icons";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import {
  usePrefersReducedMotion,
  scrollToSection,
} from "../../hooks/usePrefersReducedMotion";
import { useTheme } from "../../theme/useTheme";
import { NAV_ITEMS } from "./navItems";

export function Navbar() {
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const reduced = usePrefersReducedMotion();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id, reduced);
  };

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (reduced) window.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-hairline bg-glass backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
      style={{ backgroundColor: scrolled ? undefined : "transparent" }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <a
          href="#home"
          onClick={goHome}
          className="font-display text-lg font-semibold tracking-tight"
          aria-label="NeuroParadigm — back to top"
        >
          NeuroParadigm<span className="text-coral">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={go(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "group relative text-[13px] font-medium transition-colors duration-300",
                active === item.id ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1.5 left-0 h-px bg-coral transition-all duration-300",
                  active === item.id ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-elevated/60 text-ink-soft transition-colors duration-300 hover:border-coral hover:text-coral"
          >
            {theme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
          <a
            href="#contact"
            onClick={go("contact")}
            className="hidden rounded-full bg-coral px-4.5 py-2 text-[13px] font-semibold text-white shadow-card transition-transform duration-300 hover:-translate-y-0.5 md:inline-block"
          >
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-elevated/60 md:hidden"
          >
            {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-hairline bg-elevated/95 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium",
                      active === item.id
                        ? "bg-coral-soft text-coral"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
