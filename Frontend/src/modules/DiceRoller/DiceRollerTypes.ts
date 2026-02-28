import DiceBox from "@3d-dice/dice-box-threejs";

export type InteractiveDiceBox = DiceBox;

export type EnhancedTerm = {
  count: number;
  sides: number;
  color?: string;
  texture?: string;
  deterministic?: number[];
};

export type StylePlanEntry =
  | { dieIds: number[]; kind: "color"; color: string }
  | { dieIds: number[]; kind: "texture"; textureName: string };

export type PreparedStylePlanEntry =
  | { dieIds: number[]; kind: "color"; color: string }
  | { dieIds: number[]; kind: "texture"; textureName: string; texture: unknown };

export type MaterialWithExtensions = {
  color?: { setStyle: (value: string) => void };
  emissive?: { setStyle: (value: string) => void };
  emissiveIntensity?: number;
  map?: unknown;
  bumpMap?: unknown;
  normalMap?: unknown;
  roughnessMap?: unknown;
  needsUpdate?: boolean;
};

export type CloneableMaterial = {
  clone: () => unknown;
};
