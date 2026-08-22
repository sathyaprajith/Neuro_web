import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import Helix from "./Helix";

interface HelixCanvasProps {
  progress: MotionValue<number>;
  reduced: boolean;
}

export default function HelixCanvas({ progress, reduced }: HelixCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 3]} intensity={1.25} />
        <pointLight position={[-3.4, -0.8, 2.4]} intensity={22} distance={13} decay={2} color="#e8674a" />
        <pointLight position={[3.4, 1.6, -2.4]} intensity={18} distance={13} decay={2} color="#5c8374" />
        <Helix progress={progress} reduced={reduced} />
      </Canvas>
    </div>
  );
}
