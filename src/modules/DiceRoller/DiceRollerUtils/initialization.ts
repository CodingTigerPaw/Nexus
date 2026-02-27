import { type MutableRefObject, useEffect, useRef } from "react";
import DiceBox from "@3d-dice/dice-box-threejs";
import * as THREE from "three";
import type { InteractiveDiceBox } from "../DiceRollerTypes";

export const useDiceBoxInitialization = (
  diceBoxRef: MutableRefObject<InteractiveDiceBox | null>,
) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeDiceBox = async () => {
      if (diceBoxRef.current || isInitialized.current) return;

      try {
        const box = new DiceBox("#dice-box", {
          assetPath: "/assets/",
          sounds: true,
          volume: 100,
          theme_texture: "astral",
          theme_material: "glass",
          // Bardziej precyzyjna i spokojniejsza symulacja rzutu.
          strength: 1.0,
          framerate: 1 / 120,
          iterationLimit: 20000,
          gravity_multiplier: 100,
          onRollComplete: () => {},
          enableShadows: false,
          antialias: true,
        });

        diceBoxRef.current = box;
        await box.initialize();

        // Dodatkowe czekanie aby upewnić się że wszystkie właściwości są dostępne
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Zamieniamy perspektywną kamerę na ortogonalną aby uniknąć zniekształcenia
        if (box.scene && box.camera && box.renderer?.domElement) {
          const width = box.renderer.domElement.clientWidth;
          const height = box.renderer.domElement.clientHeight;

          const orthoCamera = new THREE.OrthographicCamera(
            -width,
            width,
            height,
            -height,
            0.1,
            10000,
          );

          orthoCamera.position.z = box.camera.position?.z ?? 1000;
          box.camera = orthoCamera;

          console.log("Kamera zmieniona na ortogonalną");
        }

        if (isMounted) {
          isInitialized.current = true;
          console.log("DiceBox zainicjalizowany pomyślnie");
        }
      } catch (error) {
        console.error("Nie udało się zainicjalizować DiceBox:", error);
        diceBoxRef.current = null;
        isInitialized.current = false;
      }
    };

    initializeDiceBox();

    return () => {
      isMounted = false;
    };
  }, [diceBoxRef]);
};
