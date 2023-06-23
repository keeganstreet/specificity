import { Specificity } from "./types";

export const compare = (a: Specificity, b: Specificity): number => {
  if (a.A !== b.A) {
    return a.A - b.A;
  } else if (a.B !== b.B) {
    return a.B - b.B;
  } else {
    return a.C - b.C;
  }
};

export const compareDesc = (a: Specificity, b: Specificity): number =>
  compare(b, a);
