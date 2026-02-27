import { type MouseEvent, useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box-threejs";
import { Camera, Object3D, Raycaster, TextureLoader, Vector2 } from "three";

type InteractiveDiceBox = DiceBox & {
  camera?: Camera;
  diceList?: Object3D[];
  getDiceResults?: (index: number) => unknown;
  roll?: (notation: string) => Promise<{
    notation?: string;
    sets?: Array<{
      total?: number;
      type?: string;
      rolls?: Array<{ id?: number }>;
    }>;
    total?: number;
  }>;
  reroll?: (indexes: number[]) => Promise<unknown>;
  rolling?: boolean;
};

type EnhancedTerm = {
  count: number;
  sides: number;
  color?: string;
  texture?: string;
  deterministic?: number[];
};

const LandingPage = () => {
  const diceContainerRef = useRef<HTMLDivElement | null>(null);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const raycasterRef = useRef(new Raycaster());
  const textureLoaderRef = useRef(new TextureLoader());
  const textureCacheRef = useRef<Record<string, unknown>>({});
  const [notationInput, setNotationInput] = useState(
    "2d10#2aa3ff!3,7 + 1d20@marble!15",
  );

  const parseEnhancedNotation = (input: string) => {
    const terms = input
      .split("+")
      .map((term) => term.trim())
      .filter(Boolean);

    if (!terms.length) {
      throw new Error("Podaj notację, np. 2d10#2aa3ff + 1d20@marble");
    }

    const parsed: EnhancedTerm[] = terms.map((term) => {
      const match = term.match(
        /^(\d*)d(\d+)(?:(#([0-9a-fA-F]{6}))|@([a-zA-Z0-9._-]+))?(?:!([\d,\s]+))?$/,
      );
      if (!match) {
        throw new Error(
          `Niepoprawny fragment notacji: "${term}". Użyj np. 3d6#ff0000!1,2,3 albo 3d6@marble!1,2,3`,
        );
      }

      const count = match[1] ? Number(match[1]) : 1;
      const sides = Number(match[2]);
      const color = match[4] ? `#${match[4]}` : undefined;
      const texture = match[5] || undefined;
      const deterministic = match[6]
        ? match[6]
            .split(",")
            .map((value) => Number(value.trim()))
            .filter((value) => Number.isFinite(value))
        : undefined;
      if (color && texture) {
        throw new Error(
          `Nie można podać jednocześnie koloru i tekstury w "${term}"`,
        );
      }
      if (deterministic && deterministic.length !== count) {
        throw new Error(
          `Deterministyczne wartości w "${term}" muszą mieć dokładnie ${count} element(y).`,
        );
      }
      if (deterministic?.some((value) => value < 1 || value > sides)) {
        throw new Error(
          `W "${term}" wartość deterministyczna musi być w zakresie 1..${sides}.`,
        );
      }

      return { count, sides, color, texture, deterministic };
    });

    const baseNotation = parsed
      .map((term) => `${term.count}d${term.sides}`)
      .join("+");
    const hasDeterministic = parsed.some((term) => term.deterministic?.length);

    let standardNotation = baseNotation;
    if (hasDeterministic) {
      const allTermsDeterministic = parsed.every(
        (term) => (term.deterministic?.length ?? 0) === term.count,
      );
      if (!allTermsDeterministic) {
        throw new Error(
          "Jeśli używasz deterministycznych wyników (!), podaj je dla każdego członu notacji.",
        );
      }

      const deterministicValues = parsed.flatMap(
        (term) => term.deterministic ?? [],
      );
      standardNotation = `${baseNotation}@${deterministicValues.join(",")}`;
    }

    return { parsed, standardNotation };
  };

  const loadTexture = async (textureName: string) => {
    if (textureCacheRef.current[textureName]) {
      return textureCacheRef.current[textureName];
    }

    const texture = await new Promise<unknown>((resolve, reject) => {
      textureLoaderRef.current.load(
        `/assets/textures/${textureName}.webp`,
        (loaded) => resolve(loaded),
        undefined,
        () =>
          reject(new Error(`Nie udało się załadować tekstury: ${textureName}`)),
      );
    });

    textureCacheRef.current[textureName] = texture;
    return texture;
  };

  const applyColorByDieIds = (
    box: InteractiveDiceBox,
    dieIds: number[],
    color: string,
  ) => {
    const tintObject = (node: Object3D & { material?: unknown }) => {
      const material = node.material;
      if (!material) {
        return;
      }

      if (Array.isArray(material)) {
        const cloned = material.map((m) =>
          typeof m === "object" && m && "clone" in m
            ? (m as { clone: () => unknown }).clone()
            : m,
        );
        node.material = cloned;
        for (const m of cloned as Array<{
          color?: { setStyle: (value: string) => void };
          emissive?: { setStyle: (value: string) => void };
          emissiveIntensity?: number;
          needsUpdate?: boolean;
        }>) {
          m.color?.setStyle(color);
          m.emissive?.setStyle(color);
          m.emissiveIntensity = 0.35;
          m.needsUpdate = true;
        }
      } else if (typeof material === "object") {
        const cloned =
          "clone" in material
            ? (material as { clone: () => unknown }).clone()
            : material;
        node.material = cloned;
        const typed = cloned as {
          color?: { setStyle: (value: string) => void };
          emissive?: { setStyle: (value: string) => void };
          emissiveIntensity?: number;
          needsUpdate?: boolean;
        };
        typed.color?.setStyle(color);
        typed.emissive?.setStyle(color);
        typed.emissiveIntensity = 0.35;
        typed.needsUpdate = true;
      }
    };

    const tintRecursively = (node: Object3D & { material?: unknown }) => {
      tintObject(node);
      for (const child of node.children as Array<
        Object3D & { material?: unknown }
      >) {
        tintRecursively(child);
      }
    };

    for (const id of dieIds) {
      const die = box.diceList?.[id] as
        | (Object3D & { material?: unknown })
        | undefined;
      if (!die) {
        continue;
      }
      tintRecursively(die);
    }
  };

  const applyTextureByDieIds = (
    box: InteractiveDiceBox,
    dieIds: number[],
    texture: unknown,
  ) => {
    const textureObject = (node: Object3D & { material?: unknown }) => {
      const material = node.material;
      if (!material) {
        return;
      }

      if (Array.isArray(material)) {
        const cloned = material.map((m) =>
          typeof m === "object" && m && "clone" in m
            ? (m as { clone: () => unknown }).clone()
            : m,
        );
        node.material = cloned;
        for (const m of cloned as Array<{
          map?: unknown;
          bumpMap?: unknown;
          normalMap?: unknown;
          roughnessMap?: unknown;
          color?: { setStyle: (value: string) => void };
          emissiveIntensity?: number;
          needsUpdate?: boolean;
        }>) {
          // Nie nadpisujemy istniejącej mapy, bo zawiera cyfry na ściankach.
          if (!m.map) {
            m.map = texture;
          } else {
            m.bumpMap = texture;
            m.roughnessMap = texture;
          }
          m.normalMap = null;
          m.emissiveIntensity = 0;
          m.needsUpdate = true;
        }
      } else if (typeof material === "object") {
        const cloned =
          "clone" in material
            ? (material as { clone: () => unknown }).clone()
            : material;
        node.material = cloned;
        const typed = cloned as {
          map?: unknown;
          bumpMap?: unknown;
          normalMap?: unknown;
          roughnessMap?: unknown;
          color?: { setStyle: (value: string) => void };
          emissiveIntensity?: number;
          needsUpdate?: boolean;
        };
        if (!typed.map) {
          typed.map = texture;
        } else {
          typed.bumpMap = texture;
          typed.roughnessMap = texture;
        }
        typed.normalMap = null;
        typed.emissiveIntensity = 0;
        typed.needsUpdate = true;
      }
    };

    const textureRecursively = (node: Object3D & { material?: unknown }) => {
      textureObject(node);
      for (const child of node.children as Array<
        Object3D & { material?: unknown }
      >) {
        textureRecursively(child);
      }
    };

    for (const id of dieIds) {
      const die = box.diceList?.[id] as
        | (Object3D & { material?: unknown })
        | undefined;
      if (!die) {
        continue;
      }
      textureRecursively(die);
    }
  };

  useEffect(() => {
    const initializeDiceBox = async () => {
      if (!diceBoxRef.current) {
        diceBoxRef.current = new DiceBox("#dice-box", {
          assetPath: "/assets/",
          sounds: true,
          volume: 100,
          theme_texture: "astral",
          theme_material: "glass",
          onRollComplete(results) {
            console.log("Rzut zakończony! Wyniki:", results);
          },
        });
        await diceBoxRef.current.initialize();
      }
    };
    initializeDiceBox().catch((error) => {
      console.error("Nie udało się zainicjalizować DiceBox:", error);
    });
  }, []);

  const handleRoll = async () => {
    const box = diceBoxRef.current as InteractiveDiceBox | null;
    if (!box || box.rolling || typeof box.roll !== "function") {
      return;
    }

    try {
      const { parsed, standardNotation } = parseEnhancedNotation(notationInput);
      const stylePlan: Array<
        | { dieIds: number[]; kind: "color"; color: string }
        | { dieIds: number[]; kind: "texture"; textureName: string }
      > = [];
      let startIndex = 0;
      for (const term of parsed) {
        const dieIds = Array.from(
          { length: term.count },
          (_, i) => startIndex + i,
        );
        if (term.color) {
          stylePlan.push({ dieIds, kind: "color", color: term.color });
        } else if (term.texture) {
          stylePlan.push({
            dieIds,
            kind: "texture",
            textureName: term.texture,
          });
        }
        startIndex += term.count;
      }

      const texturePlan = await Promise.all(
        stylePlan.map(async (entry) => {
          if (entry.kind !== "texture") {
            return entry;
          }
          return {
            ...entry,
            texture: await loadTexture(entry.textureName),
          };
        }),
      );

      const applyStylePlan = () => {
        for (const entry of texturePlan) {
          if (entry.kind === "color") {
            applyColorByDieIds(box, entry.dieIds, entry.color);
          } else {
            applyTextureByDieIds(box, entry.dieIds, entry.texture);
          }
        }
      };

      const repaintInterval = window.setInterval(applyStylePlan, 120);
      const combinedRollPromise = box.roll(standardNotation);
      const combinedResult = (await combinedRollPromise) as {
        sets?: Array<{
          total?: number;
          type?: string;
          rolls?: Array<{ id?: number }>;
        }>;
      };

      window.clearInterval(repaintInterval);
      applyStylePlan();
      requestAnimationFrame(applyStylePlan);
      setTimeout(applyStylePlan, 120);

      console.log("Wynik rzutu:", combinedResult);
    } catch (error) {
      console.error("Nie udało się wykonać rzutu:", error);
    }
  };

  const handleDiceClick = (event: MouseEvent<HTMLDivElement>) => {
    const box = diceBoxRef.current as InteractiveDiceBox | null;
    if (!box?.camera || !box.diceList?.length || box.rolling) {
      return;
    }

    const container = diceContainerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const pointer = new Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );

    raycasterRef.current.setFromCamera(pointer, box.camera);
    const intersections = raycasterRef.current.intersectObjects(
      box.diceList,
      true,
    );
    const hit = intersections[0]?.object;
    if (!hit) {
      return;
    }

    const dieIndex = box.diceList.findIndex(
      (die) => die === hit || die.children.includes(hit) || hit.parent === die,
    );
    if (dieIndex < 0) {
      return;
    }

    if (typeof box.getDiceResults === "function") {
      console.log("Kliknięta kość:", box.getDiceResults(dieIndex));
    }

    if (typeof box.reroll === "function") {
      box.reroll([dieIndex]).catch((error) => {
        console.error("Nie udało się przerzucić klikniętej kości:", error);
      });
    }
  };

  return (
    <div>
      <div
        ref={diceContainerRef}
        onClick={handleDiceClick}
        style={{ width: "100%", height: "500px", background: "#2222220" }}
        id="dice-box"
      />
      <input
        onChange={(event) => setNotationInput(event.target.value)}
        style={{ marginTop: "10px", width: "100%", maxWidth: "480px" }}
        value={notationInput}
        placeholder="np. 2d10#2aa3ff!3,7 + 1d20@marble!15"
      />
      <button onClick={handleRoll} style={{ marginTop: "10px" }}>
        Rzuć kostkami!
      </button>
    </div>
  );
};

export default LandingPage;
