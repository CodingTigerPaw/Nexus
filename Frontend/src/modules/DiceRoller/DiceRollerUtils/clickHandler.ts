import { type MutableRefObject, useCallback, useRef } from "react";
import type { InteractiveDiceBox } from "../DiceRollerTypes";

interface ClickHandlerDependencies {
  diceBoxRef: MutableRefObject<InteractiveDiceBox | null>;
  diceContainerRef: MutableRefObject<HTMLDivElement | null>;
}

const isClickable = (
  box: InteractiveDiceBox | null,
): box is InteractiveDiceBox => Boolean(box?.diceList?.length && !box.rolling);

const handleContainerClick = (box: InteractiveDiceBox) => {
  const reroll = box.reroll;
  if (typeof reroll !== "function") return;

  queueMicrotask(() => {
    const allDieIndices = Array.from(
      { length: box.diceList?.length || 0 },
      (_, i) => i,
    );
    reroll(allDieIndices).catch((error) => {
      console.error("Nie udało się przerzucić kostek:", error);
    });
  });
};

export const useDiceClickHandler = ({
  diceBoxRef,
  diceContainerRef,
}: ClickHandlerDependencies) => {
  const lastClickTime = useRef(0);
  const CLICK_DEBOUNCE_MS = 100;

  return useCallback(
    () => {
      const now = Date.now();
      if (now - lastClickTime.current < CLICK_DEBOUNCE_MS) return;
      lastClickTime.current = now;

      const box = diceBoxRef.current;
      if (!isClickable(box)) return;

      const container = diceContainerRef.current;
      if (!container) return;

      handleContainerClick(box);
    },
    [diceBoxRef, diceContainerRef],
  );
};
