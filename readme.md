# Specificity Calculator

A JavaScript module for calculating and comparing the [specificity of CSS selectors](https://www.w3.org/TR/selectors-4/#specificity). The module is used on the [Specificity Calculator](https://specificity.keegan.st/) website.

Note that version 1 is a complete re-write with support for CSS Selectors Level 4, and has a different API than earlier versions.

## calculate(selector)

### Parameters

- `selector`: `string` - should be a valid CSS selector

### Returns

A `Specificity` object with a type of `Record<"A" | "B" | "C", number>`.

### Examples

```js
calculate("#id");
{
  A: 1,
  B: 0,
  C: 0
}

calculate(".classname");
{
  A: 0,
  B: 1,
  C: 0
}

calculate("element");
{
  A: 0,
  B: 0,
  C: 1
}

calculate('ul#nav li.active a');
{
  A: 1,
  B: 1,
  C: 3
}
```

## compare(a, b)

### Parameters

- `a`: `Specificity` object with a type of `Record<"A" | "B" | "C", number>`
- `b`: `Specificity` object with a type of `Record<"A" | "B" | "C", number>`

### Returns

Returns a positive number if `a` has a higher specificity than `b`
Returns a negative number if `a` has a lower specificity than `b`
Returns `0` if `a` has the same specificity than `b`

### Examples

```js
[
  "element",
  ".classname",
  "#id",
]
  .map(calculate)
  .sort(compare);

[ { A: 0, B: 0, C: 1 }, { A: 0, B: 1, C: 0 }, { A: 1, B: 0, C: 0 } ]
```

## compareDesc(a, b)

Same as `compare` but returns the opposite value, for use in sorting specificity objects with the highest specificity first.
