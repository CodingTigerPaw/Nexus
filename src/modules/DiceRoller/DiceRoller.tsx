import { useState } from "react";
import {
  applyStylePlan,
  buildStylePlan,
  DICEBOX_HEIGHT_PX,
  DEFAULT_NOTATION,
  parseEnhancedNotation,
  prepareStylePlanWithTextures,
  REPAINT_INTERVAL_MS,
  useDiceBoxInitialization,
  useDiceClickHandler,
  useDiceRollerRefs,
} from "./DiceRollerUtils";

const DiceRoller = () => {
  const { diceContainerRef, diceBoxRef, textureLoaderRef, textureCacheRef } =
    useDiceRollerRefs();
  const [notationInput, setNotationInput] = useState(DEFAULT_NOTATION);

  useDiceBoxInitialization(diceBoxRef);
  const handleDiceClick = useDiceClickHandler({
    diceBoxRef,
    diceContainerRef,
  });

  const getActiveBox = () => {
    const box = diceBoxRef.current;
    if (!box || box.rolling || typeof box.roll !== "function") {
      return null;
    }
    return box;
  };

  const handleRoll = async () => {
    const box = getActiveBox();
    if (!box) return;

    let repaintInterval: number | undefined;
    try {
      const { parsed, standardNotation } = parseEnhancedNotation(notationInput);
      const stylePlan = buildStylePlan(parsed);
      const preparedStylePlan = await prepareStylePlanWithTextures(
        stylePlan,
        textureLoaderRef,
        textureCacheRef,
      );

      const applyStyles = () => applyStylePlan(box, preparedStylePlan);
      repaintInterval = window.setInterval(applyStyles, REPAINT_INTERVAL_MS);

      const combinedResult = await box.roll(standardNotation);

      applyStyles();
      requestAnimationFrame(applyStyles);
      setTimeout(applyStyles, REPAINT_INTERVAL_MS);

      console.log("Wynik rzutu:", combinedResult);
    } catch (error) {
      console.error("Nie udało się wykonać rzutu:", error);
    } finally {
      if (repaintInterval !== undefined) {
        window.clearInterval(repaintInterval);
      }
    }
  };

  return (
    <div>
      <div
        ref={diceContainerRef}
        onClick={handleDiceClick}
        style={{
          width: "100%",
          height: `${DICEBOX_HEIGHT_PX}px`,
          background: "#222222",
        }}
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

export default DiceRoller;
