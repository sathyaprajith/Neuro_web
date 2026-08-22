import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useTheme } from "../../../theme/useTheme";
import { signals, type Signal } from "../../../data/signals";
import { HelixBranch } from "./HelixBranch";

const HEIGHT = 5.4;
const RADIUS = 1.12;
const TURNS = 2.35;
const NODES = 108;
const RUNG_STRIDE = 5;

interface BranchAnchor {
  signal: Signal;
  node: THREE.Vector3;
  label: THREE.Vector3;
}

function buildBranchAnchors(): BranchAnchor[] {
  return signals.map((signal, i) => {
    const t = 0.8 - i * 0.15;
    const angle = t * TURNS * Math.PI * 2;
    const y = (t - 0.5) * HEIGHT;
    const node = new THREE.Vector3(
      Math.cos(angle) * RADIUS,
      y,
      Math.sin(angle) * RADIUS,
    );
    const side = i % 2 === 0 ? 1 : -1;
    const outward = new THREE.Vector3(
      Math.cos(angle) * side,
      0,
      Math.sin(angle) * side,
    );
    const label = node
      .clone()
      .add(outward.multiplyScalar(RADIUS + 0.95))
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
  const rungs = useRef<THREE.InstancedMesh>(null!);

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
      const angle = t * TURNS * Math.PI * 2;
      const y = (t - 0.5) * HEIGHT;
      a.push(
        new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS),
      );
      b.push(
        new THREE.Vector3(
          Math.cos(angle + Math.PI) * RADIUS,
          y,
          Math.sin(angle + Math.PI) * RADIUS,
        ),
      );
    }
    const rungPairs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = 4; i < NODES - 3; i += RUNG_STRIDE) {
      rungPairs.push([a[i]!, b[i]!]);
    }
    return {
      a,
      b,
      rungPairs,
      curveA: new THREE.CatmullRomCurve3(a),
      curveB: new THREE.CatmullRomCurve3(b),
      tubeA: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(a), 200, 0.05, 10, false),
      tubeB: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b), 200, 0.05, 10, false),
      sphere: new THREE.SphereGeometry(0.078, 10, 8),
      cylinder: new THREE.CylinderGeometry(0.016, 0.016, 1, 6, 1),
    };
  }, []);

  const mats = useMemo(() => ({
    strandA: new THREE.MeshStandardMaterial({
      color: "#e8674a",
      emissive: "#e8674a",
      emissiveIntensity: 0.5,
      roughness: 0.34,
      metalness: 0.12,
    }),
    strandB: new THREE.MeshStandardMaterial({
      color: "#5c8374",
      emissive: "#5c8374",
      emissiveIntensity: 0.5,
      roughness: 0.34,
      metalness: 0.12,
    }),
    rung: new THREE.MeshStandardMaterial({
      color: "#3d2b3f",
      emissive: "#3d2b3f",
      emissiveIntensity: 0.18,
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85,
    }),
  }), []);

  useEffect(() => {
    mats.strandA.color.set(coralHex);
    mats.strandA.emissive.set(coralHex);
    mats.strandB.color.set(sageHex);
    mats.strandB.emissive.set(sageHex);
    mats.rung.color.set(dark ? "#b9a7bd" : "#6b5570");
    mats.rung.emissive.set(dark ? "#6b4e6e" : "#3d2b3f");
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

    geo.a.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.quaternion.identity();
      dummy.scale.setScalar(i % 9 === 0 ? 1.55 : 1);
      dummy.updateMatrix();
      nodesA.current.setMatrixAt(i, dummy.matrix);
    });
    geo.b.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.quaternion.identity();
      dummy.scale.setScalar(i % 9 === 4 ? 1.55 : 1);
      dummy.updateMatrix();
      nodesB.current.setMatrixAt(i, dummy.matrix);
    });
    geo.rungPairs.forEach(([pa, pb], i) => {
      const dir = pb.clone().sub(pa);
      const len = dir.length();
      dummy.position.copy(pa).add(pb).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(up, dir.normalize());
      dummy.scale.set(1, len, 1);
      dummy.updateMatrix();
      rungs.current.setMatrixAt(i, dummy.matrix);
    });

    nodesA.current.instanceMatrix.needsUpdate = true;
    nodesB.current.instanceMatrix.needsUpdate = true;
    rungs.current.instanceMatrix.needsUpdate = true;
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

  return (
    <group ref={outer}>
      <group ref={spin}>
        <mesh geometry={geo.tubeA} material={mats.strandA} />
        <mesh geometry={geo.tubeB} material={mats.strandB} />
        <instancedMesh
          ref={nodesA}
          args={[geo.sphere, mats.strandA, NODES]}
        />
        <instancedMesh
          ref={nodesB}
          args={[geo.sphere, mats.strandB, NODES]}
        />
        <instancedMesh
          ref={rungs}
          args={[geo.cylinder, mats.rung, geo.rungPairs.length]}
        />
        <Sparkles
          count={64}
          scale={[4.6, 6.6, 4.6]}
          size={2}
          speed={0.24}
          opacity={0.45}
          color={coralHex}
        />
        <Sparkles
          count={40}
          scale={[5.2, 7.2, 5.2]}
          size={1.6}
          speed={0.18}
          opacity={0.35}
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
