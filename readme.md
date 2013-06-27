# Specificity Calculator

A JavaScript module for calculating the [specificity of CSS selectors](http://www.w3.org/TR/css3-selectors/#specificity). The module is used on the [Specificity Calculator](http://specificity.keegan.st/) website.

Specificity Calculator is built for CSS Selectors Level 3. Specificity Calculator isn’t a CSS validator. If you enter invalid selectors it will return incorrect results. For example, the [negation pseudo-class](http://www.w3.org/TR/css3-selectors/#negation) may only take a simple selector as an argument. Using a psuedo-element or combinator as an argument for `:not()` is invalid CSS3 so Specificity Calculator will return incorrect results. Specificity Calculator doesn’t support [CSS character escape sequences](http://mathiasbynens.be/notes/css-escapes).


## Front-end usage

```js
SPECIFICITY.calculate('ul#nav li.active a');   // [{ specificity: '0,1,1,3' }]
```

## Node.js usage

```js
var specificity = require('specificity');
specificity.calculate('ul#nav li.active a');   // [{ specificity: '0,1,1,3' }]
```

## Passing in multiple selectors

You can use comma separation to pass in multiple selectors:

```js
SPECIFICITY.calculate('ul#nav li.active a, body.ie7 .col_3 h2 ~ h2');   // [{ specificity: '0,1,1,3' }, { specificity: '0,0,2,3' }]
```

## Return values

The `specificity.calculate` function returns an array containing a result object for each selector input. Each result object has the following properties:

  * `selector`: the input
  * `specificity`: the result e.g. `0,1,0,0`
  * `parts`: array with details about each part of the selector that counts towards the specificity

## Example

```js
var specificity = require('../'),
    result = specificity.calculate('ul#nav li.active a');

console.log(result);

/* result =
[ {
    selector: 'ul#nav li.active a',
    specificity: '0,1,1,3',
    parts: [
      { selector: 'ul', type: 'c', index: 0, length: 2 },
      { selector: '#nav', type: 'a', index: 2, length: 4 },
      { selector: 'li', type: 'c', index: 5, length: 2 },
      { selector: '.active', type: 'b', index: 8, length: 7 },
      { selector: 'a', type: 'c', index: 13, length: 1 }
    ]
} ]
*/
```

## Testing

To test this package, install dependencies: `npm install`
Run: `npm test`
