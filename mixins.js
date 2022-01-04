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
        makeFancy: function (array) {
            var result = [];
            var latest = '';
            array.forEach(function (halfSlot, index) {
                if (latest === halfSlot) {
                    result[result.length-1].slotSize += 0.5;
                } else {
                    result.push(
                        {
                            name: halfSlot,
                            slotSize: 0.5,
                            slotIndex: index
                        }
                    );
                    latest = halfSlot;
                }
            })
            result.forEach(function (artistObject) {
                var indices = [];
                array.forEach(function (halfSlot, index) {
                    if (artistObject.name === halfSlot) {
                        indices.push(index);
                    }
                })
                artistObject.indices = indices;
            })
            // actually need index for actual slot being selected
            return result;
        },
        makeUnfancy: function (array) {
            var result = [];
            array.forEach(function (object) {
                var halfSlots = object.slotSize * 2;
                for (let index = 0; index < halfSlots; index++) {
                    result.push(object.name);
                }
            })
            return result;
        },
        // getItemCountInArray: function (array, itemToCheck) {
        //     var tally = 0;
        //     array.forEach(function (item) {
        //         if (itemToCheck === item) {
        //             tally += 1;
        //         }
        //     })
        //     return tally;
        // },
    }
}