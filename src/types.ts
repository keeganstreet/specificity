export type Level = "A" | "B" | "C";

export type Specificity = Record<Level, number>;

export type SpecificityContributingPart = {
  level: Level;
  start: { line: number; column: number };
  end: { line: number; column: number };
};

export type Result = {
  total: Specificity;
  contributingParts: SpecificityContributingPart[];
};
