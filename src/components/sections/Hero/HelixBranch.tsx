import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { BranchAnchor } from "./Helix";

interface HelixBranchProps {
  branch: BranchAnchor;
  reduced: boolean;
}

export function HelixBranch({ branch, reduced }: HelixBranchProps) {
  const ref = useRef<Mesh>(null!);
  const seed = branch.node.x * 3.1 + branch.node.y * 1.7;

  useFrame(({ clock }) => {
    if (reduced) return;
    const s = 1 + 0.16 * Math.sin(clock.elapsedTime * 1.8 + seed);
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={branch.node}>
      <sphereGeometry args={[0.075, 16, 14]} />
      <meshStandardMaterial
        color="#ff7a54"
        emissive="#ff6a42"
        emissiveIntensity={2.2}
        roughness={0.25}
      />
    </mesh>
  );
}
