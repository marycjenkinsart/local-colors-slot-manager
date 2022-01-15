var mixins = {
    data: function () {
        return {
            colorMap: { // unique artists, not slot count
                count3: [
                    'color-01', // red
                    'color-15', // blue
                    'color-19', // purple
                ],
                count4: [
                    'color-01', // red
                    'color-04', // golden orange
                    'color-15', // blue
                    'color-19', // purple
                ],
                count5: [
                    'color-01', // red
                    'color-04', // golden orange
                    'color-10', // green
                    'color-15', // blue
                    'color-19', // purple
                ],
                count6: [
                    'color-01', // red
                    'color-04', // golden orange
                    'color-10', // green
                    'color-15', // blue
                    'color-19', // purple
                    'color-22', // dark magenta 
                ],
                count7: [
                    'color-01', // red
                    'color-04', // golden orange
                    'color-10', // green
                    'color-13', // cyan
                    'color-17', // indigo blue
                    'color-19', // purple
                    'color-22', // dark magenta 
                ],
                count8: [
                    'color-01', // red
                    'color-04', // golden orange
                    'color-08', // lime green
                    'color-11', // deep green
                    'color-14', // medium blue
                    'color-17', // indigo blue
                    'color-19', // purple
                    'color-22', // dark magenta 
                ],
                count9: [
                    'color-02', // orange red
                    'color-05', // golden yellow
                    'color-08', // lime green
                    'color-11', // deep green
                    'color-14', // medium blue
                    'color-17', // indigo blue
                    'color-19', // purple
                    'color-21', // red-purple
                    'color-23', // magenta 
                ],
            }
        };
    },
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