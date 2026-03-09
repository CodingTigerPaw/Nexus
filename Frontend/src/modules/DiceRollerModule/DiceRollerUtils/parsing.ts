import type { EnhancedTerm, StylePlanEntry } from "../DiceRollerTypes";

// Extended notation supports:
// - plain term: 2d6
// - color term: 2d6#ff0000
// - texture term: 1d20@marble
// - deterministic outcomes: !1,2 or @1,2 for full roll.
const NOTATION_REGEX =
  /^(\d*)d(\d+)(?:(#([0-9a-fA-F]{6}))|@([a-zA-Z0-9._-]+))?(?:!([\d,\s]+))?$/;

const parseTerms = (input: string): string[] =>
  input
    .split("+")
    .map((term) => term.trim())
    .filter(Boolean);

const parseDeterministic = (value?: string): number[] | undefined => {
  if (!value) return undefined;
  return value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter(Number.isFinite);
};

const validateTerm = (
  term: string,
  count: number,
  sides: number,
  color?: string,
  texture?: string,
  deterministic?: number[],
) => {
  if (color && texture) {
    throw new Error(`Nie można podać koloru i tekstury w "${term}"`);
  }

  if (!deterministic) return;

  if (deterministic.length !== count) {
    throw new Error(
      `Deterministyczne wartości w "${term}" muszą mieć ${count} element(y)`,
    );
  }

  for (const value of deterministic) {
    if (value < 1 || value > sides) {
      throw new Error(`W "${term}" wartość musi być w zakresie 1..${sides}`);
    }
  }
};

const parseSingleTerm = (term: string): EnhancedTerm => {
  const match = term.match(NOTATION_REGEX);
  if (!match) {
    throw new Error(
      `Niepoprawny fragment notacji: "${term}". Użyj np. 3d6#ff0000!1,2,3`,
    );
  }

  const count = match[1] ? Number(match[1]) : 1;
  const sides = Number(match[2]);
  const color = match[4] ? `#${match[4]}` : undefined;
  const texture = match[5];
  const deterministic = parseDeterministic(match[6]);

  validateTerm(term, count, sides, color, texture, deterministic);
  return { count, sides, color, texture, deterministic };
};

const buildStandardNotation = (parsed: EnhancedTerm[]): string => {
  const baseNotation = parsed
    .map((term) => `${term.count}d${term.sides}`)
    .join("+");

  const hasDeterministic = parsed.some((term) => term.deterministic?.length);
  if (!hasDeterministic) return baseNotation;

  for (const term of parsed) {
    if ((term.deterministic?.length ?? 0) !== term.count) {
      throw new Error(
        "Jeśli używasz deterministycznych wyników, podaj je dla każdego członu",
      );
    }
  }

  const deterministicValues = parsed.flatMap(
    (term) => term.deterministic ?? [],
  );
  return `${baseNotation}@${deterministicValues.join(",")}`;
};

export const parseEnhancedNotation = (input: string) => {
  if (!input?.trim()) {
    throw new Error("Podaj notację, np. 2d10#2aa3ff + 1d20@marble");
  }

  const parsed = parseTerms(input).map((term) => parseSingleTerm(term));
  return {
    parsed,
    standardNotation: buildStandardNotation(parsed),
  };
};

export const buildStylePlan = (parsed: EnhancedTerm[]): StylePlanEntry[] => {
  const stylePlan: StylePlanEntry[] = [];
  let startIndex = 0;

  for (const term of parsed) {
    const dieIds = Array.from({ length: term.count }, (_, i) => startIndex + i);

    if (term.color) {
      stylePlan.push({ dieIds, kind: "color", color: term.color });
    } else if (term.texture) {
      stylePlan.push({ dieIds, kind: "texture", textureName: term.texture });
    }

    startIndex += term.count;
  }

  return stylePlan;
};
