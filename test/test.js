var specificity = require('../'),
	assert = require('assert'),
	tests;

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
	{ selector: 'p', expected: '0,0,0,1' }
];

describe('specificity', function() {
	var i, len, test;
	for (i = 0, len = tests.length; i < len; i += 1) {
		test = tests[i];
		describe('#calculate("' + test.selector + '")', function() {
			it ('should return a specificity of "' + test.expected + '"', function() {
				var result = specificity.calculate(test.selector);
				assert.equal(test.expected, result[0].specificity);
			});
		});
	}
});
