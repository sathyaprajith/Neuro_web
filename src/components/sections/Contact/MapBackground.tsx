import { useMemo, useState } from "react";

export function MapBackground() {
  const [failed, setFailed] = useState(false);

  const gridLines = useMemo(() => {
    const lines: React.ReactNode[] = [];
    for (let i = 1; i < 8; i++) {
      lines.push(
        <div
          key={`h${i}`}
          className="absolute left-0 right-0 h-px bg-white/[0.04]"
          style={{ top: `${(100 / 8) * i}%` }}
        />,
      );
    }
    for (let i = 1; i < 11; i++) {
      lines.push(
        <div
          key={`v${i}`}
          className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
          style={{ left: `${(100 / 11) * i}%` }}
        />,
      );
    }
    return lines;
  }, []);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl">
      {/* Real satellite image — auto-shown when file exists */}
      {!failed && (
        <img
          src="/images/satellite-hyderabad.jpg"
          alt="Satellite view of Hyderabad location"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: "perspective(800px) rotateX(10deg) scale(1.12)",
            transformOrigin: "center 60%",
          }}
          onError={() => setFailed(true)}
        />
      )}

      {/* Grid overlay (always visible, subtle under image) */}
      <div
        className="absolute inset-0"
        style={{
          background: failed
            ? "radial-gradient(ellipse at center 50%, rgba(15,30,55,0.6) 0%, #0a0f1e 100%)"
            : "radial-gradient(ellipse at center 60%, transparent 20%, rgba(6,10,20,0.55) 100%)",
        }}
      >
        {gridLines}
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background: failed
            ? "radial-gradient(ellipse at center 45%, transparent 25%, rgba(6,10,20,0.85) 100%)"
            : "radial-gradient(ellipse at center 45%, transparent 20%, rgba(6,10,20,0.5) 100%)",
        }}
      />
    </div>
  );
}
