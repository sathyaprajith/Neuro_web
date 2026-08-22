import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useTheme } from "../../../theme/useTheme";
import { signals, type Signal } from "../../../data/signals";
import { HelixBranch } from "./HelixBranch";

const HEIGHT = 5.6;
const RADIUS = 1.08;
const TURNS = 2.3;
const NODES = 126;
const RUNG_STRIDE = 3;
const PHASE_B = Math.PI * 0.74;

interface BranchAnchor {
  signal: Signal;
  node: THREE.Vector3;
  label: THREE.Vector3;
}

function strandPoint(
  t: number,
  phase: number,
): THREE.Vector3 {
  const angle = t * TURNS * Math.PI * 2 + phase;
  const breathe =
    1 +
    0.05 * Math.sin(t * Math.PI * 7.3 + phase * 0.6) +
    0.02 * Math.sin(t * Math.PI * 13.1 - phase);
  const r = RADIUS * breathe;
  const swayX = 0.17 * Math.sin(t * Math.PI * 1.65 + 1.25);
  const swayZ = 0.13 * Math.sin(t * Math.PI * 1.2 - 0.75);
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
  const nodesA = useRef<THREE.InstancedMesh>(null!);
  const nodesB = useRef<THREE.InstancedMesh>(null!);
  const pairsOne = useRef<THREE.InstancedMesh>(null!);
  const pairsTwo = useRef<THREE.InstancedMesh>(null!);

  const idle = useRef(0);
  const appear = useRef(reduced ? 1 : 0.8);
  const rotY = useRef(0);
  const rotX = useRef(0);
  const posY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  const coralHex = dark ? "#f0805f" : "#e8674a";
  const sageHex = dark ? "#7ba894" : "#5c8374";

  const geo = useMemo(() => {
    const a: THREE.Vector3[] = [];
    const b: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      const t = i / (NODES - 1);
      a.push(strandPoint(t, 0));
      b.push(strandPoint(t, PHASE_B));
    }
    const rungIdx: number[] = [];
    for (let i = 3; i < NODES - 3; i += RUNG_STRIDE) rungIdx.push(i);

    return {
      a,
      b,
      rungIdx,
      tubeA: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(a), 240, 0.042, 10, false),
      tubeB: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b), 240, 0.042, 10, false),
      sphere: new THREE.SphereGeometry(0.062, 10, 8),
      cylinder: new THREE.CylinderGeometry(0.02, 0.02, 1, 7, 1),
    };
  }, []);

  const mats = useMemo(
    () => ({
      strandA: new THREE.MeshStandardMaterial({
        color: "#e8674a",
        emissive: "#e8674a",
        emissiveIntensity: 0.42,
        roughness: 0.42,
        metalness: 0.1,
      }),
      strandB: new THREE.MeshStandardMaterial({
        color: "#5c8374",
        emissive: "#5c8374",
        emissiveIntensity: 0.42,
        roughness: 0.42,
        metalness: 0.1,
      }),
      pairA: new THREE.MeshStandardMaterial({
        color: "#e8a23d",
        emissive: "#e8a23d",
        emissiveIntensity: 0.22,
        roughness: 0.5,
        metalness: 0.05,
      }),
      pairB: new THREE.MeshStandardMaterial({
        color: "#3d2b3f",
        emissive: "#3d2b3f",
        emissiveIntensity: 0.16,
        roughness: 0.55,
        metalness: 0.05,
      }),
    }),
    [],
  );

  useEffect(() => {
    mats.strandA.color.set(coralHex);
    mats.strandA.emissive.set(coralHex);
    mats.strandB.color.set(sageHex);
    mats.strandB.emissive.set(sageHex);
    mats.pairA.color.set(dark ? "#f0b860" : "#e8a23d");
    mats.pairA.emissive.set(dark ? "#f0b860" : "#e8a23d");
    mats.pairB.color.set(dark ? "#b9a7bd" : "#6b5570");
    mats.pairB.emissive.set(dark ? "#6b4e6e" : "#3d2b3f");
  }, [coralHex, sageHex, dark, mats]);

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

    geo.a.forEach((p, i) => {
      const t = i / (NODES - 1);
      const taper = 0.62 + 0.38 * Math.sin(t * Math.PI);
      const accent = i % 11 === 0 ? 1.35 : 1;
      dummy.position.copy(p);
      dummy.quaternion.identity();
      dummy.scale.setScalar(taper * accent);
      dummy.updateMatrix();
      nodesA.current.setMatrixAt(i, dummy.matrix);
    });
    geo.b.forEach((p, i) => {
      const t = i / (NODES - 1);
      const taper = 0.62 + 0.38 * Math.sin(t * Math.PI);
      const accent = i % 11 === 5 ? 1.35 : 1;
      dummy.position.copy(p);
      dummy.quaternion.identity();
      dummy.scale.setScalar(taper * accent);
      dummy.updateMatrix();
      nodesB.current.setMatrixAt(i, dummy.matrix);
    });

    geo.rungIdx.forEach((idx, k) => {
      const pa = geo.a[idx]!;
      const pb = geo.b[idx]!;
      const mid = pa.clone().lerp(pb, 0.5);
      const flip = k % 2 === 1;
      placeSegment(flip ? pairsTwo.current : pairsOne.current, k, pa, mid);
      placeSegment(flip ? pairsOne.current : pairsTwo.current, k, mid, pb);
    });

    nodesA.current.instanceMatrix.needsUpdate = true;
    nodesB.current.instanceMatrix.needsUpdate = true;
    pairsOne.current.instanceMatrix.needsUpdate = true;
    pairsTwo.current.instanceMatrix.needsUpdate = true;
  }, [geo]);

  useFrame((_, delta) => {
    const p = reduced ? 0 : progress.get();
    idle.current += delta * (reduced ? 0.02 : 0.09);

    const targetY =
      idle.current + p * Math.PI * 1.75 + (reduced ? 0 : mouse.current.x * 0.09);
    rotY.current += (targetY - rotY.current) * Math.min(1, delta * 6);
    spin.current.rotation.y = rotY.current;

    const targetX = reduced ? 0.04 : -mouse.current.y * 0.045 + 0.04;
    rotX.current += (targetX - rotX.current) * Math.min(1, delta * 5);
    spin.current.rotation.x = rotX.current;

    const targetPos = -p * 0.55;
    posY.current += (targetPos - posY.current) * Math.min(1, delta * 4);
    outer.current.position.y = posY.current;

    appear.current += (1 - appear.current) * Math.min(1, delta * 2.4);
    outer.current.scale.setScalar(appear.current);
  });

  const branches = useMemo(buildBranchAnchors, []);
  const rungCount = geo.rungIdx.length;

  return (
    <group ref={outer}>
      <group ref={spin}>
        <mesh geometry={geo.tubeA} material={mats.strandA} />
        <mesh geometry={geo.tubeB} material={mats.strandB} />
        <instancedMesh ref={nodesA} args={[geo.sphere, mats.strandA, NODES]} />
        <instancedMesh ref={nodesB} args={[geo.sphere, mats.strandB, NODES]} />
        <instancedMesh ref={pairsOne} args={[geo.cylinder, mats.pairA, rungCount]} />
        <instancedMesh ref={pairsTwo} args={[geo.cylinder, mats.pairB, rungCount]} />
        <Sparkles
          count={56}
          scale={[4.6, 6.8, 4.6]}
          size={1.9}
          speed={0.22}
          opacity={0.4}
          color={coralHex}
        />
        <Sparkles
          count={36}
          scale={[5.2, 7.4, 5.2]}
          size={1.5}
          speed={0.16}
          opacity={0.32}
          color={sageHex}
        />
        {branches.map((branch) => (
          <HelixBranch key={branch.signal.id} branch={branch} />
        ))}
      </group>
    </group>
  );
}

export type { BranchAnchor };
