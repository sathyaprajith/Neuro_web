import { useEffect } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero/Hero";
import { HomeAbout } from "./components/sections/HomeAbout/HomeAbout";
import { Achievements } from "./components/sections/Achievements/Achievements";
import { Partners } from "./components/sections/Partners/Partners";
import { Gallery } from "./components/sections/Gallery/Gallery";
import { Team } from "./components/sections/Team/Team";
import { Contact } from "./components/sections/Contact/Contact";
import { Cursor } from "./components/ui/Cursor";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Preloader } from "./components/ui/Preloader";
import { StatementBand } from "./components/ui/StatementBand";

export default function App() {
  useSmoothScroll(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("scrollto");
    if (!id) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <ThemeProvider>
      <Preloader />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-coral focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <HomeAbout />
        <Achievements />
        <StatementBand
          eyebrow="Philosophy"
          statement="Structured evidence. Human judgment. Augment — never replace."
        />
        <Partners />
        <Gallery />
        <Team />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
