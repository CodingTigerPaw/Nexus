import { Object3D, Texture } from "three";
import type {
  CloneableMaterial,
  InteractiveDiceBox,
  MaterialWithExtensions,
  PreparedStylePlanEntry,
} from "../DiceRollerTypes";
import { DEFAULT_EMISSIVE_INTENSITY } from "./constants";

const isCloneable = (obj: unknown): obj is CloneableMaterial =>
  typeof obj === "object" && obj !== null && "clone" in obj;

const configureColorMaterial = (material: MaterialWithExtensions, color: string) => {
  if (material.color) material.color.setStyle(color);
  if (material.emissive) material.emissive.setStyle(color);
  material.emissiveIntensity = DEFAULT_EMISSIVE_INTENSITY;
  material.needsUpdate = true;
};

const configureTextureMaterial = (material: MaterialWithExtensions, texture: Texture) => {
  if (!material.map) {
    material.map = texture;
  } else {
    material.bumpMap = texture;
    material.roughnessMap = texture;
  }
  material.normalMap = null;
  material.emissiveIntensity = 0;
  material.needsUpdate = true;
};

const processNode = (
  rootNode: Object3D & { material?: unknown },
  applyMaterial: (material: MaterialWithExtensions) => void,
) => {
  const stack: Array<Object3D & { material?: unknown }> = [rootNode];

  while (stack.length > 0) {
    const node = stack.pop()!;
    const material = node.material;

    if (material) {
      if (Array.isArray(material)) {
        const cloned = material.map((m) => (isCloneable(m) ? m.clone() : m));
        node.material = cloned;
        for (const mat of cloned) applyMaterial(mat as MaterialWithExtensions);
      } else {
        const cloned = isCloneable(material) ? material.clone() : material;
        node.material = cloned;
        applyMaterial(cloned as MaterialWithExtensions);
      }
    }

    for (let i = node.children.length - 1; i >= 0; i -= 1) {
      stack.push(node.children[i] as Object3D & { material?: unknown });
    }
  }
};

export const applyColorByDieIds = (
  box: InteractiveDiceBox,
  dieIds: number[],
  color: string,
) => {
  if (!box.diceList) return;
  for (const id of dieIds) {
    const die = box.diceList[id] as (Object3D & { material?: unknown }) | undefined;
    if (!die) continue;
    processNode(die, (mat) => configureColorMaterial(mat, color));
  }
};

export const applyTextureByDieIds = (
  box: InteractiveDiceBox,
  dieIds: number[],
  texture: Texture,
) => {
  if (!box.diceList) return;
  for (const id of dieIds) {
    const die = box.diceList[id] as (Object3D & { material?: unknown }) | undefined;
    if (!die) continue;
    processNode(die, (mat) => configureTextureMaterial(mat, texture));
  }
};

export const applyStylePlan = (
  box: InteractiveDiceBox,
  preparedPlan: PreparedStylePlanEntry[],
) => {
  for (const entry of preparedPlan) {
    if (entry.kind === "color") {
      applyColorByDieIds(box, entry.dieIds, entry.color);
    } else {
      applyTextureByDieIds(box, entry.dieIds, entry.texture as Texture);
    }
  }
};
