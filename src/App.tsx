import { ThemeProvider } from "./theme/ThemeProvider";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero/Hero";
import { HomeAbout } from "./components/sections/HomeAbout/HomeAbout";
import { Achievements } from "./components/sections/Achievements/Achievements";
import { Partners } from "./components/sections/Partners/Partners";
import { Gallery } from "./components/sections/Gallery/Gallery";
import { Contact } from "./components/sections/Contact/Contact";
import { Cursor } from "./components/ui/Cursor";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Preloader } from "./components/ui/Preloader";

export default function App() {
  useSmoothScroll(true);

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
        <Partners />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
