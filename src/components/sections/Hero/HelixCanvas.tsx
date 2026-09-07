import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useTheme } from "../../../theme/useTheme";
import Helix from "./Helix";

interface HelixCanvasProps {
  progress: MotionValue<number>;
  reduced: boolean;
}

export default function HelixCanvas({ progress, reduced }: HelixCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";
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
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        {/* Aerial perspective: distant parts of the helix melt into the page */}
        <fog attach="fog" args={[dark ? "#1a1512" : "#fbf7f1", 6.2, 13.5]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 7, 4]} intensity={2.2} />
        <directionalLight position={[-6, -2, -3]} intensity={0.7} color="#dfe8ff" />
        {/* Colored rims carve the strands out of the background */}
        <directionalLight position={[-5, 2, -6]} intensity={1.5} color="#e8674a" />
        <directionalLight position={[6, -3, -5]} intensity={1.1} color="#e8a23d" />
        <pointLight position={[-4, 5, -5]} intensity={16} distance={16} decay={2} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={8} distance={12} decay={2} color="#e8674a" />
        <Helix progress={progress} reduced={reduced} />
      </Canvas>
    </div>
  );
}
