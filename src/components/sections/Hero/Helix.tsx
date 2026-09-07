import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useTheme } from "../../../theme/useTheme";
import { signals, type Signal } from "../../../data/signals";
import { HelixBranch } from "./HelixBranch";

const HEIGHT = 5.6;
const RADIUS = 1.05;
const TURNS = 2.3;
const NODES = 126;
const RUNG_STRIDE = 2;
const PHASE_B = Math.PI * 0.78;

// Brand-palette gradients painted along each strand (bottom → top).
const STRAND_PALETTES = {
  light: {
    aBottom: "#e8674a",
    aTop: "#3d2b3f",
    bBottom: "#e8a23d",
    bTop: "#5c8374",
  },
  dark: {
    aBottom: "#f0805f",
    aTop: "#6b4e6e",
    bBottom: "#f0b860",
    bTop: "#7ba894",
  },
} as const;

/** Paints a vertical color gradient into a geometry's vertex colors. */
function paintStrand(
  geometry: THREE.BufferGeometry,
  bottomHex: string,
  topHex: string,
) {
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const span = maxY - minY || 1;
  const c = new THREE.Color();
  const bottom = new THREE.Color(bottomHex);
  const top = new THREE.Color(topHex);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - minY) / span;
    c.copy(bottom).lerp(top, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

interface BranchAnchor {
  signal: Signal;
  node: THREE.Vector3;
  label: THREE.Vector3;
}

function strandPoint(t: number, phase: number): THREE.Vector3 {
  const angle = t * TURNS * Math.PI * 2 + phase;
  const breathe =
    1 +
    0.03 * Math.sin(t * Math.PI * 7.3 + phase * 0.6) +
    0.014 * Math.sin(t * Math.PI * 13.1 - phase);
  const r = RADIUS * breathe;
  const swayX = 0.12 * Math.sin(t * Math.PI * 1.65 + 1.25);
  const swayZ = 0.09 * Math.sin(t * Math.PI * 1.2 - 0.75);
  return new THREE.Vector3(
    Math.cos(angle) * r + swayX,
    (t - 0.5) * HEIGHT,
    Math.sin(angle) * r + swayZ,
  );
}

function buildBranchAnchors(): BranchAnchor[] {
  return signals.map((signal, i) => {
    const t = 0.8 - i * 0.15;
    const angle = t * TURNS * Math.PI * 2;
    const node = strandPoint(t, 0);
    const outward = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    const side = i % 2 === 0 ? 1 : -1;
    const label = node
      .clone()
      .add(outward.multiplyScalar((RADIUS + 0.95) * side))
      .add(new THREE.Vector3(0, i % 2 === 0 ? 0.1 : -0.1, 0));
    return { signal, node, label };
  });
}

interface HelixProps {
  progress: MotionValue<number>;
  reduced: boolean;
}

export default function Helix({ progress, reduced }: HelixProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const spin = useRef<THREE.Group>(null!);
  const outer = useRef<THREE.Group>(null!);
  const pairsOne = useRef<THREE.InstancedMesh>(null!);
  const pairsTwo = useRef<THREE.InstancedMesh>(null!);
  const beads = useRef<THREE.InstancedMesh>(null!);

  const idle = useRef(0);
  const appear = useRef(reduced ? 1 : 0.82);
  const rotY = useRef(0);
  const rotX = useRef(0);
  const posY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  const geo = useMemo(() => {
    const a: THREE.Vector3[] = [];
    const b: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      const t = i / (NODES - 1);
      a.push(strandPoint(t, 0));
      b.push(strandPoint(t, PHASE_B));
    }
    const rungIdx: number[] = [];
    for (let i = 2; i < NODES - 2; i += RUNG_STRIDE) rungIdx.push(i);

    return {
      a,
      b,
      rungIdx,
      tubeA: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(a), 300, 0.075, 20, false),
      tubeB: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b), 300, 0.075, 20, false),
      cylinder: new THREE.CylinderGeometry(0.034, 0.034, 1, 8, 1),
      bead: new THREE.SphereGeometry(0.052, 12, 10),
    };
  }, []);

  const mats = useMemo(
    () => ({
      ivory: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        vertexColors: true,
        roughness: 0.16,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffd9c9"),
        emissive: "#e8674a",
        emissiveIntensity: 0.1,
      }),
      charcoal: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        vertexColors: true,
        roughness: 0.19,
        metalness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        sheen: 0.4,
        sheenColor: new THREE.Color("#f4e3c2"),
        emissive: "#e8a23d",
        emissiveIntensity: 0.08,
      }),
      pairLight: new THREE.MeshStandardMaterial({
        color: "#a45248",
        roughness: 0.36,
        metalness: 0.06,
        emissive: "#a45248",
        emissiveIntensity: 0.08,
      }),
      pairDark: new THREE.MeshStandardMaterial({
        color: "#7d8563",
        roughness: 0.38,
        metalness: 0.07,
        emissive: "#7d8563",
        emissiveIntensity: 0.07,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: "#8a6f63",
        roughness: 0.3,
        metalness: 0.1,
        emissive: "#8a6f63",
        emissiveIntensity: 0.06,
      }),
    }),
    [],
  );

  useEffect(() => {
    const pal = dark ? STRAND_PALETTES.dark : STRAND_PALETTES.light;
    paintStrand(geo.tubeA, pal.aBottom, pal.aTop);
    paintStrand(geo.tubeB, pal.bBottom, pal.bTop);
    mats.pairLight.color.set(dark ? "#b06a58" : "#a45248");
    mats.pairLight.emissive.set(dark ? "#b06a58" : "#a45248");
    mats.pairDark.color.set(dark ? "#8ba184" : "#7d8563");
    mats.pairDark.emissive.set(dark ? "#8ba184" : "#7d8563");
    mats.joint.color.set(dark ? "#9c8676" : "#8a6f63");
    mats.joint.emissive.set(dark ? "#9c8676" : "#8a6f63");
  }, [dark, geo, mats]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3();

    const placeSegment = (
      mesh: THREE.InstancedMesh,
      index: number,
      from: THREE.Vector3,
      to: THREE.Vector3,
    ) => {
      dir.copy(to).sub(from);
      const len = dir.length();
      dummy.position.copy(from).add(to).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(up, dir.normalize());
      dummy.scale.set(1, len, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    };

    geo.rungIdx.forEach((idx, k) => {
      const pa = geo.a[idx]!;
      const pb = geo.b[idx]!;
      const mid = pa.clone().lerp(pb, 0.5);
      const flip = k % 2 === 1;
      placeSegment(flip ? pairsTwo.current : pairsOne.current, k, pa, mid);
      placeSegment(flip ? pairsOne.current : pairsTwo.current, k, mid, pb);

      dummy.quaternion.identity();
      dummy.scale.setScalar(1);
      dummy.position.copy(pa);
      dummy.updateMatrix();
      beads.current.setMatrixAt(k * 2, dummy.matrix);
      dummy.position.copy(pb);
      dummy.updateMatrix();
      beads.current.setMatrixAt(k * 2 + 1, dummy.matrix);
    });

    pairsOne.current.instanceMatrix.needsUpdate = true;
    pairsTwo.current.instanceMatrix.needsUpdate = true;
    beads.current.instanceMatrix.needsUpdate = true;
  }, [geo, reduced]);

  useFrame((state, delta) => {
    const p = reduced ? 0 : progress.get();
    idle.current += delta * (reduced ? 0.02 : 0.09);

    const targetY =
      idle.current + p * Math.PI * 2.4 + (reduced ? 0 : mouse.current.x * 0.09);
    rotY.current += (targetY - rotY.current) * Math.min(1, delta * 6);
    spin.current.rotation.y = rotY.current;

    const targetX = reduced ? 0.04 : -mouse.current.y * 0.045 + 0.04 - p * 0.06;
    rotX.current += (targetX - rotX.current) * Math.min(1, delta * 5);
    spin.current.rotation.x = rotX.current;

    // Breathing tilt keeps the hold poses from feeling frozen.
    outer.current.rotation.z = reduced
      ? -0.16
      : -0.16 + Math.sin(idle.current * 0.35) * 0.035 - p * 0.08;

    const targetPos = -p * 0.55;
    posY.current += (targetPos - posY.current) * Math.min(1, delta * 4);
    outer.current.position.y = posY.current;

    appear.current += (1 - appear.current) * Math.min(1, delta * 2.4);
    outer.current.scale.setScalar(appear.current);

    // Scroll-coupled camera: slow dolly-in + counter-pan for parallax depth.
    const cam = state.camera;
    const targetZ = 8 - p * 0.85;
    const targetCamY = p * 0.24;
    const ease = Math.min(1, delta * 2.5);
    cam.position.z += (targetZ - cam.position.z) * ease;
    cam.position.y += (targetCamY - cam.position.y) * ease;
  });

  const branches = useMemo(buildBranchAnchors, []);
  const rungCount = geo.rungIdx.length;

  return (
    <group ref={outer}>
      <group ref={spin}>
        <mesh geometry={geo.tubeA} material={mats.ivory} />
        <mesh geometry={geo.tubeB} material={mats.charcoal} />
        <instancedMesh ref={pairsOne} args={[geo.cylinder, mats.pairLight, rungCount]} />
        <instancedMesh ref={pairsTwo} args={[geo.cylinder, mats.pairDark, rungCount]} />
        <instancedMesh ref={beads} args={[geo.bead, mats.joint, rungCount * 2]} />
        <Sparkles
          count={40}
          scale={[4.4, 6.8, 4.4]}
          size={1.5}
          speed={0.18}
          opacity={0.32}
          color={dark ? "#f0805f" : "#e8674a"}
        />
        <Sparkles
          count={22}
          scale={[5, 7.4, 5]}
          size={1.2}
          speed={0.13}
          opacity={0.26}
          color={dark ? "#f0b860" : "#e8a23d"}
        />
        {branches.map((branch) => (
          <HelixBranch key={branch.signal.id} branch={branch} reduced={reduced} />
        ))}
      </group>
    </group>
  );
}

export type { BranchAnchor };
