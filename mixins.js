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
        makeCompact: function (artistsObject) {
            var self = this;
            var getCompactFloor = function (array) {
                var compactFloorArray = [];
                var fancy = self.makeFancy(array);
                fancy.forEach(function (item) {
                    var entry = item.name
                    var halfSlots = item.slotSize*2;
                    if (halfSlots !== 2) {
                        entry += '=' + halfSlots;
                    }
                    compactFloorArray.push(entry);
                })
                var compactFloor = compactFloorArray.join(',');
                return compactFloor;
            };
            var interpretFeatured = function (featuredObject) {
                var compactFeaturedArray = [];
                featuredObject.forEach(function (item) {
                    var parsedItemArray = [];
                    if (item.type === '2D') {
                        parsedItemArray.push(item.name);
                        parsedItemArray.push(item.type);
                        parsedItemArray.push(item.origSlotSize);
                    } else {
                        parsedItemArray.push(item.name);
                        parsedItemArray.push(item.type);
                    }
                    var parsedItem = parsedItemArray.join('=');
                    compactFeaturedArray.push(parsedItem);
                })
                var result = compactFeaturedArray.join(',');
                return result;
            };
            var up = getCompactFloor(artistsObject.up);
            var down = getCompactFloor(artistsObject.down);
            var feat = interpretFeatured(artistsObject.feat);
            var result = 'f|' + feat + '&' +
                'u|' + up + '&' +
                'd|' + down;
            while (result.includes(' ')) { // replaceAll not compatible with iOS <13
                result = result.replace(' ','_');
            }
            return result;
        },
        makeUncompact: function (compactString) {
            var splits = compactString.split('&');
            var fString = '';
            var uString = '';
            var dString = '';
            while (splits.length > 0) {
                var chunk = splits.shift();
                var chunkCase = chunk[0];
                if (chunkCase === 'f') {
                    fString = chunk.replace('f|','');
                } else if (chunkCase === 'u') {
                    uString = chunk.replace('u|','');
                } else if (chunkCase === 'd') {
                    dString = chunk.replace('d|','');
                }
            }
            var makeCompactFloorUnfancy = function (string) {
                var stringSplits = string.split(',');
                var result = [];
                stringSplits.forEach(function (fancyItem) {
                    var innermostSplits = fancyItem.split('=');
                    var name = innermostSplits[0].replace('_',' ');
                    var count = parseInt(innermostSplits[1],10) || 2;
                    while (count > 0) {
                        result.push(name);
                        count -= 1;
                    }
                })
                return result;
            }
            var makeCompactFeaturedUnfancy = function (string) {
                var stringSplits = string.split(',');
                var result = [];
                stringSplits.forEach(function (fancyItem) {
                    var innermostSplits = fancyItem.split('=');
                    var name = innermostSplits[0].replace('_',' ');
                    var type = innermostSplits[1];
                    var artist = {
                        name: name,
                        type: type
                    }
                    if (innermostSplits[2]) {
                        artist.origSlotSize = innermostSplits[2];
                    }
                    result.push(artist);
                })
                return result;
            }
            uFinal = makeCompactFloorUnfancy(uString);
            dFinal = makeCompactFloorUnfancy(dString);
            fFinal = makeCompactFeaturedUnfancy(fString);
            return {
                'feat': fFinal,
                'up': uFinal,
                'down': dFinal,
            };
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