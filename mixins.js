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
	}
}