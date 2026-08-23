import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HQ = { lat: 17.394396715145305, lng: 78.6214985957943 };
const PARTNERS = [
  { lat: 17.443, lng: 78.382 },
  { lat: 17.361, lng: 78.545 },
];

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Rig({ focused }: { focused: boolean }) {
  useFrame(({ camera }, dt) => {
    const d = Math.min(dt, 0.05);
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      focused ? 1.42 : 3.15,
      3.8,
      d,
    );
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 3.8, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0, 3.8, d);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float d = max(0.0, 0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
            float intensity = pow(d, 3.4);
            gl_FragColor = vec4(vec3(0.30, 0.65, 1.0), 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh material={mat} scale={1.14} renderOrder={2}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}

function Marker({
  lat,
  lng,
  color,
  size = 1,
}: {
  lat: number;
  lng: number;
  color: string;
  size?: number;
}) {
  const pos = useMemo(() => latLngToVec3(lat, lng, 1.002), [lat, lng]);
  const q = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        pos.clone().normalize(),
      ),
    [pos],
  );
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current || REDUCED) return;
    const t = clock.elapsedTime;
    const phase = 0.5 + 0.5 * Math.sin(t * 2.4);
    ring.current.scale.setScalar(1 + 0.55 * phase);
    (ring.current.material as THREE.MeshBasicMaterial).opacity =
      0.75 - 0.55 * phase;
  });

  return (
    <group position={pos} quaternion={q}>
      <mesh position={[0, 0, 0.006]} renderOrder={3}>
        <sphereGeometry args={[0.016 * size, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {size > 1 && (
        <mesh ref={ring} position={[0, 0, 0.004]} renderOrder={3}>
          <ringGeometry args={[0.03, 0.037, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function useEarthTextures() {
  const [tex, setTex] = useState<{
    night: THREE.Texture | null;
    bump: THREE.Texture | null;
  }>({ night: null, bump: null });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let night: THREE.Texture | null = null;
    let bump: THREE.Texture | null = null;
    let cancelled = false;

    const apply = () => {
      if (!cancelled) setTex({ night, bump });
    };

    loader.load(
      "/images/earth-day.jpg",
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        night = t;
        apply();
      },
      undefined,
      () => apply(),
    );
    loader.load(
      "/images/earth-topology.png",
      (t) => {
        bump = t;
        apply();
      },
      undefined,
      () => apply(),
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return tex;
}

function Globe({ focused }: { focused: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const dragging = useRef(false);
  const pitch = useRef(0);
  const spinDelay = useRef(10);
  const prevFocused = useRef(focused);
  const { night } = useEarthTextures();

  const qFocus = useMemo(() => {
    const dir = latLngToVec3(HQ.lat, HQ.lng, 1).normalize();

    const north = new THREE.Vector3(0, 1, 0);
    const effectiveUp = north
      .clone()
      .sub(north.clone().multiplyScalar(north.dot(dir)))
      .normalize();

    const srcRight = new THREE.Vector3()
      .crossVectors(effectiveUp, dir)
      .normalize();
    const srcMat = new THREE.Matrix4().makeBasis(srcRight, effectiveUp, dir);

    // Slight upward offset so the pin sits in upper third
    const tiltTarget = new THREE.Vector3(0, -0.14, 0.99).normalize();
    const tgtUp = new THREE.Vector3(0, 1, 0);
    const tgtRight = new THREE.Vector3()
      .crossVectors(tgtUp, tiltTarget)
      .normalize();
    const tgtMat = new THREE.Matrix4().makeBasis(
      tgtRight,
      tgtUp,
      tiltTarget,
    );

    const rotMat = tgtMat.clone().multiply(srcMat.transpose());
    return new THREE.Quaternion().setFromRotationMatrix(rotMat);
  }, []);

  // Initial quaternion: Hyderabad faces camera, north is screen-up
  const qInitial = useMemo(() => {
    const dir = latLngToVec3(HQ.lat, HQ.lng, 1).normalize();

    // Project north pole onto plane perpendicular to dir to get "effective up"
    const north = new THREE.Vector3(0, 1, 0);
    const effectiveUp = north
      .clone()
      .sub(north.clone().multiplyScalar(north.dot(dir)))
      .normalize();

    // Build orthonormal source frame
    const srcRight = new THREE.Vector3()
      .crossVectors(effectiveUp, dir)
      .normalize();
    const srcMat = new THREE.Matrix4().makeBasis(srcRight, effectiveUp, dir);

    // Target frame: Hyderabad faces +Z, north is +Y
    const tgtRight = new THREE.Vector3(1, 0, 0);
    const tgtUp = new THREE.Vector3(0, 1, 0);
    const tgtForward = new THREE.Vector3(0, 0, 1);
    const tgtMat = new THREE.Matrix4().makeBasis(
      tgtRight,
      tgtUp,
      tgtForward,
    );

    // R = target * source^T (both orthonormal)
    const rotMat = tgtMat.clone().multiply(srcMat.transpose());
    return new THREE.Quaternion().setFromRotationMatrix(rotMat);
  }, []);

  useEffect(() => {
    if (group.current && !focused) {
      group.current.quaternion.copy(qInitial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    let px = 0;
    let py = 0;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      px = e.clientX;
      py = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      const g = group.current;
      if (!g) return;
      g.quaternion.premultiply(
        new THREE.Quaternion().setFromAxisAngle(Y_AXIS, dx * 0.005),
      );
      const next = THREE.MathUtils.clamp(
        pitch.current + dy * 0.003,
        -0.65,
        0.65,
      );
      const step = next - pitch.current;
      pitch.current = next;
      g.quaternion.premultiply(
        new THREE.Quaternion().setFromAxisAngle(X_AXIS, step),
      );
    };
    const up = () => {
      dragging.current = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
    };
  }, [gl]);

  useFrame((_state, dt) => {
    const d = Math.min(dt, 0.05);
    const g = group.current;
    if (!g) return;

    // Reset spin delay when unfocusing
    if (prevFocused.current && !focused) {
      spinDelay.current = 10;
    }
    prevFocused.current = focused;

    if (REDUCED) {
      if (focused) g.quaternion.copy(qFocus);
      return;
    }
    if (focused) {
      g.quaternion.slerp(qFocus, 1 - Math.exp(-5.0 * d));
    } else if (!dragging.current) {
      if (spinDelay.current > 0) {
        spinDelay.current -= d;
      } else {
        g.quaternion.premultiply(
          new THREE.Quaternion().setFromAxisAngle(Y_AXIS, 0.03 * d),
        );
      }
    }
  });

  const hqPos = useMemo(() => latLngToVec3(HQ.lat, HQ.lng, 1.002), []);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        {night ? (
          <meshBasicMaterial map={night} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            color="#101a30"
            roughness={0.9}
            metalness={0.05}
          />
        )}
      </mesh>

      {!night && (
        <mesh scale={1.001}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshBasicMaterial
            color="#2c4a72"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      )}

      <Atmosphere />

      <Marker lat={HQ.lat} lng={HQ.lng} color="#f0b860" size={1} />
      {PARTNERS.map((p, i) => (
        <Marker key={i} lat={p.lat} lng={p.lng} color="#e8674a" />
      ))}

      {!focused && (
        <Html
          position={hqPos.clone().multiplyScalar(1.06)}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded-full border border-white/20 bg-black/75 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-white uppercase">
            Neuro Paradigm · Hyderabad
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GlobeScene({
  focused,
  active,
}: {
  focused: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active || focused ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.15], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      style={{ cursor: "grab" }}
    >
      <color attach="background" args={["#070b16"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 2.5, 4]} intensity={1.2} />
      <Rig focused={focused} />
      <Globe focused={focused} />
    </Canvas>
  );
}
