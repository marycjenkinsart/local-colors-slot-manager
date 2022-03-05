var forbiddenChars = [
	'-',
	'_',
	',',
	'%',
	'&',
	'=',
	'?',
	'#',
	'"',
	'~',
	'\\',
];

var mixins = {
	methods: {
		// All of these need to be component methods so they can be used directly in the template
		identifyForbiddenChar: function (string) {
			var char = '';
			forbiddenChars.forEach(function (testChar) {
				if (string.includes(testChar)) {
					char = testChar;
				}
			})
			return char;
		},
		displayFloor: function (string) {
			var result = string + 'stairs'
			result = result.toLocaleLowerCase();
			var array = result.split('');
			array[0] = array[0].toLocaleUpperCase();
			result = array.join('');
			return result;
		},
		getDisplayInches: function (number) {
			var inches = templateNumberToInches(number);
			var intInches = inches.toFixed(0);
			var result = '';
			if (intInches > 0) {
				result = '+' + intInches + '\"';
			} else if (intInches < 0) {
				result = '-' + Math.abs(intInches) + '\"';
			}
			return result;
		},
		getDisplayPercentOverPar: function (top, bot) {
			var result = (100 * top / bot - 100).toFixed(1);
			result = result > 0 ? '+' + Math.abs(result) : '-' + Math.abs(result);
			return result + '%';
		},
	}
}