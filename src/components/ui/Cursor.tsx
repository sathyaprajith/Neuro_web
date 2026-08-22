import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-cursor]");
      if (ringRef.current) {
        ringRef.current.dataset.active = interactive ? "true" : "false";
      }
    };

    document.documentElement.classList.add("has-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, true);

    let raf = 0;
    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver, true);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden>
        <span />
      </div>
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span />
      </div>
    </>
  );
}
