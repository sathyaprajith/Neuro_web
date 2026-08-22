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

  const idle = useRef(0);
  const appear = useRef(reduced ? 1 : 0.82);
  const rotY = useRef(0);
  const rotX = useRef(0);
  const posY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  const ivoryHex = dark ? "#f0805f" : "#e8674a";
  const charHex = dark ? "#7ba894" : "#5c8374";

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
      cylinder: new THREE.CylinderGeometry(0.021, 0.021, 1, 8, 1),
    };
  }, []);

  const mats = useMemo(
    () => ({
      ivory: new THREE.MeshPhysicalMaterial({
        color: "#e8674a",
        roughness: 0.16,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffd9c9"),
        emissive: "#e8674a",
        emissiveIntensity: 0.07,
      }),
      charcoal: new THREE.MeshPhysicalMaterial({
        color: "#5c8374",
        roughness: 0.19,
        metalness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        sheen: 0.4,
        sheenColor: new THREE.Color("#d8efe4"),
        emissive: "#5c8374",
        emissiveIntensity: 0.06,
      }),
      pairLight: new THREE.MeshStandardMaterial({
        color: "#c05a3e",
        roughness: 0.36,
        metalness: 0.06,
        emissive: "#c05a3e",
        emissiveIntensity: 0.08,
      }),
      pairDark: new THREE.MeshStandardMaterial({
        color: "#48685c",
        roughness: 0.38,
        metalness: 0.07,
        emissive: "#48685c",
        emissiveIntensity: 0.07,
      }),
    }),
    [],
  );

  useEffect(() => {
    mats.ivory.color.set(ivoryHex);
    mats.ivory.emissive.set(ivoryHex);
    mats.charcoal.color.set(charHex);
    mats.charcoal.emissive.set(charHex);
    mats.pairLight.color.set(dark ? "#c2603f" : "#bb5238");
    mats.pairLight.emissive.set(dark ? "#c2603f" : "#bb5238");
    mats.pairDark.color.set(dark ? "#5f8272" : "#456157");
    mats.pairDark.emissive.set(dark ? "#5f8272" : "#456157");
  }, [ivoryHex, charHex, dark, mats]);

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
    });

    pairsOne.current.instanceMatrix.needsUpdate = true;
    pairsTwo.current.instanceMatrix.needsUpdate = true;

    if (!reduced) {
      outer.current.rotation.z = -0.16;
    }
  }, [geo, reduced]);

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
        <mesh geometry={geo.tubeA} material={mats.ivory} />
        <mesh geometry={geo.tubeB} material={mats.charcoal} />
        <instancedMesh ref={pairsOne} args={[geo.cylinder, mats.pairLight, rungCount]} />
        <instancedMesh ref={pairsTwo} args={[geo.cylinder, mats.pairDark, rungCount]} />
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
          color={dark ? "#7ba894" : "#5c8374"}
        />
        {branches.map((branch) => (
          <HelixBranch key={branch.signal.id} branch={branch} />
        ))}
      </group>
    </group>
  );
}

export type { BranchAnchor };
