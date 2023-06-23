import { describe, expect, test } from "@jest/globals";
import { calculateWithDetails } from "./calculate";

describe("calculate specificity and get details of contributing parts", () => {
  [
    {
      selector: "#id",
      expected: [
        {
          level: "A",
          substring: "#id",
        },
      ],
    },
    {
      selector: ".classname",
      expected: [
        {
          level: "B",
          substring: ".classname",
        },
      ],
    },
    {
      selector: "ul",
      expected: [
        {
          level: "C",
          substring: "ul",
        },
      ],
    },
    {
      selector: "#id ul > .classname",
      expected: [
        {
          level: "A",
          substring: "#id",
        },
        {
          level: "C",
          substring: "ul",
        },
        {
          level: "B",
          substring: ".classname",
        },
      ],
    },
    {
      selector: "p:not(.classname)",
      expected: [
        {
          level: "C",
          substring: "p",
        },
        {
          level: "B",
          substring: ".classname",
        },
      ],
    },
    {
      selector: "li:nth-child(2n+1)+p",
      expected: [
        {
          level: "C",
          substring: "li",
        },
        { 
          level: "B",
          substring: ":nth-child(2n+1)",
        },
        {
          level: "C",
          substring: "p",
        }
      ]
    }, {
      selector: ":is(em, #foo)",
      expected: [
        {
          level: "A",
          substring: "#foo",
        }
      ]
    },
    {
      selector: ".qux:where(em, #foo#bar#baz)",
      expected: [
        {
          level: "B",
          substring: ".qux",
        }
      ]
    },
    {
      selector: ":nth-child(even of li, .item)",
      expected: [
        {
          level: "B",
          substring: ":nth-child(even of li, .item)",
        }, {
          level: "B",
          substring: ".item",
        }
      ]
    },
    {
      selector: ":not(em, strong#foo)",
      expected: [
        {
          level: "C",
          substring: "strong",
        },
        {
          level: "A",
          substring: "#foo",
        }
      ]
    }
  ].forEach(({ selector, expected }) => {
    test(`calculateWithDetails("${selector}") returns contributingParts with indexes that map to the correct substrings`, () => {
      expect(
        calculateWithDetails(selector).contributingParts.map((part) => ({
          level: part.level,
          substring: selector.substring(
            part.start.column - 1,
            part.end.column - 1
          ),
        }))
      ).toStrictEqual(expected);
    });
  });
});
