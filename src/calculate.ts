import {
  parse,
  toPlainObject,
  PseudoClassSelectorPlain,
  CssNodePlain,
} from "css-tree";
import { compareDesc } from "./sort.js";
import { Result, Specificity, Level } from "./types";

const universalSelectorName = "*";

const increment = (
  node: CssNodePlain,
  { total, contributingParts }: Result,
  level: Level
): Result => ({
  total: {
    ...total,
    [level]: total[level] + 1,
  },
  contributingParts: [
    ...contributingParts,
    {
      level: level,
      start: {
        line: node?.loc?.start.line ?? 1,
        column: node?.loc?.start.column ?? 1,
      },
      end: {
        line: node?.loc?.end.line ?? 1,
        column: node?.loc?.end.column ?? 1,
      },
    },
  ],
});

const psuedoElementsWithDeprecatedOneColonNotation = [
  "before",
  "after",
  "first-line",
  "first-letter",
];

const getChildrenFromPseudoClassNode = (
  node: PseudoClassSelectorPlain
): CssNodePlain[] => {
  if (node.children) {
    const firstChild = node.children[0];
    if (firstChild.type === "SelectorList") {
      return firstChild.children;
    } else if (firstChild.type === "Nth" && firstChild.selector) {
      return firstChild.selector.children;
    } else {
      return node.children;
    }
  }
  return [];
};

const handlePseudoClassSelector = (
  node: PseudoClassSelectorPlain,
  accumulatingResult: Result
): Result => {
  const name = node.name.toLowerCase();
  const children = getChildrenFromPseudoClassNode(node);
  if (name === "not" || name === "is" || name === "has") {
    // The specificity of an :is(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument
    if (children.length > 0) {
      return children
        .map((childNode) => traverse(childNode, accumulatingResult))
        .sort((a, b) => compareDesc(a.total, b.total))[0];
    }
  } else if (name === "nth-child" || name === "nth-last-child") {
    // The specificity of an :nth-child() or :nth-last-child() selector is the specificity of the pseudo class itself (counting as one pseudo-class selector) plus the specificity of the most specific complex selector in its selector list argument (if any).
    if (children.length > 0) {
      const highestChildSpecificity = children
        .map((childNode) => traverse(childNode, increment(node, accumulatingResult, "B")))
        .sort((a, b) => compareDesc(a.total, b.total))[0];
      return highestChildSpecificity;
    } else {
      return increment(node, accumulatingResult, "B");
    }
  } else if (name === "where") {
    // The specificity of a :where() pseudo-class is replaced by zero.
    return accumulatingResult;
  } else if (name === "global" || name === "local") {
    // The specificity for :global() and :local() is replaced by the specificity of the child selector because although they look like psuedo classes they are actually an identifier for CSS Modules
    if (children.length > 0) {
      return children.reduce(
        (acc, childNode) => traverse(childNode, acc),
        accumulatingResult
      );
    }
  } else if (psuedoElementsWithDeprecatedOneColonNotation.includes(name)) {
    // These pseudo-elements can look like pseudo-classes
    // https://www.w3.org/TR/selectors-4/#pseudo-elements
    return increment(node, accumulatingResult, "C");
  } else {
    return increment(node, accumulatingResult, "B");
  }
  return accumulatingResult;
};

const traverse = (
  node: CssNodePlain,
  accumulatingResult: Result = {
    total: { A: 0, B: 0, C: 0 },
    contributingParts: [],
  }
): Result => {
  if (node.type === "IdSelector") {
    return increment(node, accumulatingResult, "A");
  } else if (node.type === "PseudoClassSelector") {
    return handlePseudoClassSelector(node, accumulatingResult);
  } else if (
    node.type === "ClassSelector" ||
    node.type === "AttributeSelector"
  ) {
    return increment(node, accumulatingResult, "B");
  } else if (node.type === "TypeSelector") {
    if (node.name !== universalSelectorName) {
      return increment(node, accumulatingResult, "C");
    }
  } else if (node.type === "PseudoElementSelector") {
    return increment(node, accumulatingResult, "C");
  } else if (node.type === "Selector" || node.type === "SelectorList") {
    return node.children.reduce(
      (acc, childNode) => traverse(childNode, acc),
      accumulatingResult
    );
  } else if (node.type === "Raw") {
    return traverse(
      toPlainObject(
        parse(node.value, {
          context: "selector",
          positions: true,
          line: node?.loc?.end.line ?? 1,
          column: node?.loc?.end.column ?? 1,
        })
      ),
      accumulatingResult
    );
  }
  return accumulatingResult;
};

export const calculate = (selector: string): Specificity => {
  const ast = toPlainObject(
    parse(selector, {
      context: "selector",
    })
  );
  return traverse(ast).total;
};

export const calculateWithDetails = (selector: string): Result => {
  const ast = toPlainObject(
    parse(selector, {
      context: "selector",
      positions: true,
    })
  );
  return traverse(ast);
};
