if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
}

/**
 * Calculates the specificity of CSS selectors
 * http://www.w3.org/TR/css3-selectors/#specificity
 *
 * Returns an array of objects with the following properties:
 *  - selector: the input
 *  - specificity: e.g. 0,1,0,0
 *  - a: array with details about each part of the selector contributing to the "a" count (IDs)
 *  - b: array with details about each part of the selector contributing to the "b" count (classes, attributes and pseudo-classes)
 *  - c: array with details about each part of the selector contributing to the "c" count (types and pseudo-elements)
 */
var SPECIFICITY = (function() {
	var calculate,
		calculateSingle;

	calculate = function(input) {
		var selectors,
			i,
			len,
			results = [];

		input.replace(/(\r\n|\n|\r)/gm, '');
		selectors = input.split(',');

		for (i = 0, len = selectors.length; i < len; i += 1) {
			results.push(calculateSingle(selectors[i]));
		}

		return results;
	};

	// Calculate the specificity for a selector by dividing it into simple selectors and counting them
	calculateSingle = function(input) {
		var selector = input,
			findMatch,
			a = [], b = [], c = [],
			// The following regular expressions assume that selectors matching the preceding regular expressions have been removed
			attributeRegex = /(\[[^\]]+\])/g,
			idRegex = /(#[^\s\+>~\.\[:]+)/g,
			classRegex = /(\.[^\s\+>~\.\[:]+)/g,
			pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/g,
			pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g,
			typeRegex = /([^\s\+>~\.\[:]+)/g;

		// Find matches for a regular expression in a string and push their details to output
		findMatch = function(regex, output) {
			var matches, i, match, index, length;
			if (regex.test(selector)) {
				matches = selector.match(regex);
				for (i in matches) {
					if (matches.hasOwnProperty(i)) {
						match = matches[i];
						index = selector.indexOf(match);
						length = match.length;
						output.push({
							index: index,
							length: length,
							selector: match
						});
						// Replace this simple selector with whitespace so it won't be counted in further simple selectors
						selector = selector.replace(match, Array(length).join(' '));
					}
				}
			}
		};

		// Remove the negation psuedo-class (:not) but leave its argument because specificity is calculated on its argument
		(function() {
			var regex = /:not\(([^\)]+)\)/g;
			if (regex.test(selector)) {
				selector = selector.replace(regex, '     $1 ');
			}
		}());

		// Add attribute selectors to b collection
		findMatch(attributeRegex, b);

		// Add ID selectors to a collection
		findMatch(idRegex, a);

		// Add class selectors to b collection
		findMatch(classRegex, b);

		// Add pseudo-element selectors to c collection
		findMatch(pseudoElementRegex, c);

		// Add pseudo-class selectors to b collection
		findMatch(pseudoClassRegex, b);

		// Remove universal selector and separator characters
		selector = selector.replace(/[\*\s\+>~]/g, ' ');

		// The only things left should be type selectors
		findMatch(typeRegex, c);

		return {
			selector: input,
			specificity: '0,' + a.length.toString() + ',' + b.length.toString() + ',' + c.length.toString(),
			a: a,
			b: b,
			c: c,
		};
	};

	return {
		calculate: calculate
	};
}());

// Export for Node JS
if (typeof exports !== 'undefined') {
	exports.calculate = SPECIFICITY.calculate;
}
