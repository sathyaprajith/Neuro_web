import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { TARGET_LOCATION } from "../../../config/location";
import { MapBackground } from "./MapBackground";

const GlobeScene = lazy(() => import("./GlobeScene"));

type Phase = "globe" | "transitioning" | "pin";

export function GlobeMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("globe");
  const [webgl, setWebgl] = useState(true);

  const focused = phase === "transitioning";

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) {
        setWebgl(false);
      }
    } catch {
      setWebgl(false);
    }
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // After globe finishes zooming, transition to pin
  useEffect(() => {
    if (phase !== "transitioning") return;
    const t = setTimeout(() => setPhase("pin"), 3800);
    return () => clearTimeout(t);
  }, [phase]);

  const handleLocate = useCallback(() => {
    if (phase === "globe") {
      setPhase("transitioning");
    }
  }, [phase]);

  const handleReset = useCallback(() => {
    setPhase("globe");
  }, []);

  const showPin = phase === "pin";

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-hairline shadow-card"
      style={{
        background:
          "radial-gradient(130% 130% at 30% 15%, #18263f 0%, #0a0f1e 58%, #060a14 100%)",
      }}
      ref={wrapRef}
    >
      <div className="relative aspect-[4/3] w-full">
        {/* Globe canvas (fades out when pin appears) */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: showPin ? 0 : 1, pointerEvents: showPin ? "none" : "auto" }}
        >
          {webgl ? (
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-16 w-16 animate-pulse rounded-full border border-white/15 bg-white/5" />
                </div>
              }
            >
              <GlobeScene focused={focused} active={active} />
            </Suspense>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/60">
                Hyderabad · 17.39° N, 78.62° E
              </p>
            </div>
          )}
        </div>

        {/* Pin card (fades in when globe zooms) */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-1000 ease-out"
          style={{ opacity: showPin ? 1 : 0 }}
        >
          {showPin && <MapBackground />}
        </div>

        {/* Top controls — MUST be last for z-index stacking */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-5">
          <div className="pointer-events-auto flex gap-2">
            {phase === "globe" ? (
              <button
                type="button"
                onClick={handleLocate}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur transition-colors duration-300 hover:border-coral hover:text-coral"
              >
                Locate us
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full border border-coral bg-coral px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-colors duration-300 hover:bg-coral/80"
              >
                Reset view
              </button>
            )}
          </div>
          <a
            href={TARGET_LOCATION.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur transition-colors duration-300 hover:border-coral hover:text-coral"
          >
            Google Maps ↗
          </a>
        </div>

        {/* Bottom bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/85 uppercase backdrop-blur">
            {showPin
              ? `${TARGET_LOCATION.region} · ${TARGET_LOCATION.coordsLabel}`
              : focused
                ? "Zooming in..."
                : "Drag to spin"}
          </div>
        </div>
      </div>
    </div>
  );
}
