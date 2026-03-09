import { useRef } from "react";
import { Texture, TextureLoader } from "three";
import type { InteractiveDiceBox } from "../DiceRollerTypes";

// Keeps mutable objects stable across renders without triggering re-renders.
export const useDiceRollerRefs = () => {
  const diceContainerRef = useRef<HTMLDivElement | null>(null);
  const diceBoxRef = useRef<InteractiveDiceBox | null>(null);
  const textureLoaderRef = useRef(new TextureLoader());
  const textureCacheRef = useRef<Record<string, Texture>>({});

  return {
    diceContainerRef,
    diceBoxRef,
    textureLoaderRef,
    textureCacheRef,
  };
};
