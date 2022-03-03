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
		getLongLabel: function (labelObject) {
			var year = labelObject.year || 1970;
			var month = labelObject.month || 13;
			var version = labelObject.version || 1;
			var custom = labelObject.custom || '';
			var result = '';
			if (custom.length) {
				result = custom;
			} else {
				var monthMap = [
					'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
					'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
				]
				var monthName = monthMap[parseInt(month) - 1] || 'ERROR';
				result = monthName + ' ' + year
				if (version > 1) {
					result += ' v' + version;
				}
			}
			return result;
		},
	}
}