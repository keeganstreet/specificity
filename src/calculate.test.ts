import { describe, expect, test } from "@jest/globals";
import { calculate } from "./calculate";

describe("calculate specificity", () => {
  [
    // http://css-tricks.com/specifics-on-css-specificity/
    { selector: "ul#nav li.active a", expected: { A: 1, B: 1, C: 3 } },
    { selector: "body.ie7 .col_3 h2 ~ h2", expected: { A: 0, B: 2, C: 3 } },
    { selector: "#footer *:not(nav) li", expected: { A: 1, B: 0, C: 2 } },
    {
      selector: "ul > li ul li ol li:first-letter",
      expected: { A: 0, B: 0, C: 7 },
    },

    // http://reference.sitepoint.com/css/specificity
    {
      selector: "body#home div#warning p.message",
      expected: { A: 2, B: 1, C: 3 },
    },
    {
      selector: "* body#home>div#warning p.message",
      expected: { A: 2, B: 1, C: 3 },
    },
    { selector: "#home #warning p.message", expected: { A: 2, B: 1, C: 1 } },
    { selector: "#warning p.message", expected: { A: 1, B: 1, C: 1 } },
    { selector: "#warning p", expected: { A: 1, B: 0, C: 1 } },
    { selector: "p.message", expected: { A: 0, B: 1, C: 1 } },
    { selector: "p", expected: { A: 0, B: 0, C: 1 } },

    // Test pseudo-element with uppertestCase letters
    { selector: "li:bEfoRE", expected: { A: 0, B: 0, C: 2 } },

    // Pseudo-class tests
    { selector: "li:first-child+p", expected: { A: 0, B: 1, C: 2 } },
    { selector: "li:nth-child(even)+p", expected: { A: 0, B: 1, C: 2 } },
    { selector: "li:nth-child(2n+1)+p", expected: { A: 0, B: 1, C: 2 } },
    { selector: "li:nth-child( 2n + 1 )+p", expected: { A: 0, B: 1, C: 2 } },
    { selector: "li:nth-child(2n-1)+p", expected: { A: 0, B: 1, C: 2 } },
    { selector: "li:nth-child(2n-1) p", expected: { A: 0, B: 1, C: 2 } },
    { selector: ":lang(nl-be)", expected: { A: 0, B: 1, C: 0 } },

    // Tests with CSS escape sequences
    // https://mathiasbynens.be/notes/css-escapes and https://mathiasbynens.be/demo/crazy-class
    // <p class=":-)"></p>
    {
      selector: ".\\3A -\\)",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class=":`("></p>
    {
      selector: ".\\3A \\`\\(",
      expected: { A: 0, B: 1, C: 0 },
    } /* */,
    // <p class=": `("></p>
    {
      selector: ".\\3A .\\`\\(",
      expected: { A: 0, B: 2, C: 0 },
    },
    // <p class="1a2b3c"></p>
    {
      selector: ".\\31 a2b3c",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class="1a2b3c"></p>
    {
      selector: ".\\000031a2b3c",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class="1a2b3c"></p>
    {
      selector: ".\\000031 a2b3c",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p id="#fake-id"></p>
    {
      selector: "#\\#fake-id",
      expected: { A: 1, B: 0, C: 0 },
    },
    // <p class="#fake-id"></p>
    {
      selector: ".\\#fake-id",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p id="<p>"></p>
    {
      selector: "#\\<p\\>",
      expected: { A: 1, B: 0, C: 0 },
    },
    // <p class="#.#.#"></p>
    {
      selector: ".\\#\\.\\#\\.\\#",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class="foo.bar"></p>
    {
      selector: ".foo\\.bar",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class=":hover:active"></p>
    {
      selector: ".\\:hover\\:active",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class=":hover:active"></p>
    {
      selector: ".\\3A hover\\3A active",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p class="1"><p></p></p>"
    {
      selector: ".\\000031  p",
      expected: { A: 0, B: 1, C: 1 },
    },
    // <p class=":`("><p class="another"></p></p>
    {
      selector: ".\\3A \\`\\( .another",
      expected: { A: 0, B: 2, C: 0 },
    },
    // <p class="--cool"></p>
    {
      selector: ".\\--cool",
      expected: { A: 0, B: 1, C: 0 },
    },
    // <p id="home"><p class="[page]"></p></p>
    {
      selector: "#home .\\[page\\]",
      expected: { A: 1, B: 1, C: 0 },
    },

    // Test repeated IDs
    // https://github.com/keeganstreet/specificity/issues/29
    { selector: "ul#nav#nav-main li.active a", expected: { A: 2, B: 1, C: 3 } },

    // Test CSS Modules https://github.com/css-modules/css-modules
    // Whilst they are not part of the CSS spec, this calculator can support them without breaking results for standard selectors
    { selector: ".root :global .text", expected: { A: 0, B: 2, C: 0 } },
    {
      selector: ".localA :global .global-b :local(.local-c) .global-d",
      expected: { A: 0, B: 4, C: 0 },
    },
    {
      selector:
        ".localA :global .global-b .global-c :local(.localD.localE) .global-d",
      expected: { A: 0, B: 6, C: 0 },
    },
    {
      selector: ".localA :global(.global-b) .local-b",
      expected: { A: 0, B: 3, C: 0 },
    },
    {
      selector: ":local(:nth-child(2n) .test)",
      expected: { A: 0, B: 2, C: 0 },
    },

    // pseudo-classes with evaluation contexts
    {
      selector: ":is(em, #foo)",
      expected: { A: 1, B: 0, C: 0 },
    },
    {
      selector: ".qux:where(em, #foo#bar#baz)",
      expected: { A: 0, B: 1, C: 0 },
    },
    {
      selector: ":nth-child(even of li, .item)",
      expected: { A: 0, B: 2, C: 0 },
    },
    {
      selector: ":not(em, strong#foo)",
      expected: { A: 1, B: 0, C: 1 },
    },
  ].forEach(({ selector, expected }) => {
    test(`calculate("${selector}")`, () => {
      expect(calculate(selector)).toStrictEqual(expected);
    });
  });
});
