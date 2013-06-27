var specificity = require('../'),
	assert = require('assert'),
	tests,
	testSelector;

tests = [
	// http://css-tricks.com/specifics-on-css-specificity/
	{ selector: 'ul#nav li.active a', expected: '0,1,1,3' },
	{ selector: 'body.ie7 .col_3 h2 ~ h2', expected: '0,0,2,3' },
	{ selector: '#footer *:not(nav) li', expected: '0,1,0,2' },
	{ selector: 'ul > li ul li ol li:first-letter', expected: '0,0,0,7' },

	// http://reference.sitepoint.com/css/specificity
	{ selector: 'body#home div#warning p.message', expected: '0,2,1,3' },
	{ selector: '* body#home>div#warning p.message', expected: '0,2,1,3' },
	{ selector: '#home #warning p.message', expected: '0,2,1,1' },
	{ selector: '#warning p.message', expected: '0,1,1,1' },
	{ selector: '#warning p', expected: '0,1,0,1' },
	{ selector: 'p.message', expected: '0,0,1,1' },
	{ selector: 'p', expected: '0,0,0,1' },

	// Test pseudo-element with uppercase letters
	{ selector: 'li:bEfoRE', expected: '0,0,0,2' },

	// Pseudo-class tests
	{ selector: 'li:first-child+p', expected: '0,0,1,2'},
	{ selector: 'li:nth-child(even)+p', expected: '0,0,1,2'},
	{ selector: 'li:nth-child(2n+1)+p', expected: '0,0,1,2'},
	{ selector: 'li:nth-child( 2n + 1 )+p', expected: '0,0,1,2'},
	{ selector: 'li:nth-child(2n-1)+p', expected: '0,0,1,2'},
	{ selector: 'li:nth-child(2n-1) p', expected: '0,0,1,2'},
	{ selector: ':lang(nl-be)', expected: '0,0,1,0'}
];

testSelector = function(test) {
	describe('#calculate("' + test.selector + '")', function() {
		it ('should return a specificity of "' + test.expected + '"', function() {
			var result = specificity.calculate(test.selector);
			assert.equal(result[0].specificity, test.expected);
		});
	});
};

describe('specificity', function() {
	var i, len, test;
	for (i = 0, len = tests.length; i < len; i += 1) {
		test = tests[i];
		testSelector(test);
	}
});
