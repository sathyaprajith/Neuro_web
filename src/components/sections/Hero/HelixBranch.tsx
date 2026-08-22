import type { BranchAnchor } from "./Helix";

interface HelixBranchProps {
  branch: BranchAnchor;
}

export function HelixBranch({ branch }: HelixBranchProps) {
  return (
    <mesh position={branch.node}>
      <sphereGeometry args={[0.06, 14, 12]} />
      <meshStandardMaterial
        color="#e8a23d"
        emissive="#e8a23d"
        emissiveIntensity={2}
        roughness={0.3}
      />
    </mesh>
  );
}
