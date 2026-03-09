import type { MutableRefObject } from "react";
import { Texture, TextureLoader } from "three";
import type { PreparedStylePlanEntry, StylePlanEntry } from "../DiceRollerTypes";
import { TEXTURE_BASE_PATH } from "./constants";

// Loads a texture and fails fast when the source is unavailable for too long.
const loadTextureWithTimeout = (
  textureName: string,
  loader: TextureLoader,
  timeoutMs: number,
): Promise<Texture> =>
  new Promise<Texture>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout ładowania tekstury: ${textureName}`));
    }, timeoutMs);

    loader.load(
      `${TEXTURE_BASE_PATH}${textureName}.webp`,
      (texture) => {
        clearTimeout(timeoutId);
        resolve(texture);
      },
      undefined,
      () => {
        clearTimeout(timeoutId);
        reject(new Error(`Nie udało się załadować tekstury: ${textureName}`));
      },
    );
  });

export const loadTexture = async (
  textureName: string,
  textureLoaderRef: MutableRefObject<TextureLoader>,
  textureCacheRef: MutableRefObject<Record<string, Texture>>,
  timeoutMs: number = 5000,
): Promise<Texture> => {
  // In-memory cache avoids repeated network and GPU uploads.
  const cached = textureCacheRef.current[textureName];
  if (cached) return cached;

  const texture = await loadTextureWithTimeout(
    textureName,
    textureLoaderRef.current,
    timeoutMs,
  );

  textureCacheRef.current[textureName] = texture;
  return texture;
};

export const prepareStylePlanWithTextures = async (
  stylePlan: StylePlanEntry[],
  textureLoaderRef: MutableRefObject<TextureLoader>,
  textureCacheRef: MutableRefObject<Record<string, Texture>>,
): Promise<PreparedStylePlanEntry[]> => {
  // Resolve all texture entries before roll starts, so styling is deterministic.
  const textureEntries = stylePlan.filter((entry) => entry.kind === "texture");
  const nonTextureEntries = stylePlan.filter((entry) => entry.kind !== "texture");

  if (textureEntries.length === 0) {
    return stylePlan as PreparedStylePlanEntry[];
  }

  const loadedTextures = await Promise.all(
    textureEntries.map(async (entry) => ({
      ...entry,
      texture: await loadTexture(entry.textureName, textureLoaderRef, textureCacheRef),
    })),
  );

  return [...nonTextureEntries, ...loadedTextures] as PreparedStylePlanEntry[];
};
