var mixins = {
	methods: {
		getUnique: function (value, index, self) {
			return self.indexOf(value) === index; // thanks, stackOverflow
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