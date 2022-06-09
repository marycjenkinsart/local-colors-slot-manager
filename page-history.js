var test = ['test', 'test', null, null, 'test'];
var literalTest = ['test', 'test', 'empty#3', 'empty#4', 'test'];
var miniTest = ['test']

var clearNameAtIndex = function (array, index) {
	var newArray = array.slice();
	newArray[index] = null;
	// console.log(`Cleared name at index ${index}`)
	return newArray;
};
var clearWholeNameAtIndex = function (array, sourceIndex) {
	var newArray = array.slice();
	// console.log('clearWholeNameAtIndex ' + sourceIndex)
	var indices = findPlacedIndicesFromIndexInArray(newArray, sourceIndex);
	indices.forEach(function (index) {
		newArray = clearNameAtIndex(newArray, index);
		// console.log('clearing index ' + index)
	})
	return newArray;
};
var insertNameAtIndex = function (array, index, name) {
	var newArray = array.slice();
	newArray[index] = name;
	// console.log(`Inserted ${name} at index ${index}`)
	return newArray;
};
var insertWholeNameAtIndex = function (array, index, name, length) {
	var newArray = array.slice();
	newArray = clearNameFromArray(newArray,name);
	var currIndex = index;
	for (let i = 0; i < length; i++) {
		// console.log("clearing name at index " + currIndex)
		if (currIndex !== null) {
			newArray = clearWholeNameAtIndex(newArray, currIndex);
			currIndex = incrementIndexInArray(newArray, currIndex);
		}
	}
	var currIndex = index;
	for (let i = 0; i < length; i++) {
		// console.log("inserting name at index " + currIndex)
		if (currIndex !== null) {
			newArray = insertNameAtIndex(newArray, currIndex, name);
			currIndex = incrementIndexInArray(newArray, currIndex);
		}
	}
	// It didn't work unless these were separate steps ¯\_(ツ)_/¯
	return newArray;
};
var incrementIndexInArray = function (array, index) {
	var newIndex = index + 1;
	if (newIndex === array.length) {
		newIndex = 0;
	}
	if (index === newIndex) {
		newIndex = null;
	}
	return newIndex;
};
var decrementIndexInArray = function (array, index) {
	var newIndex = index - 1;
	if (newIndex === - 1) {
		newIndex = array.length - 1;
	}
	if (index === newIndex) {
		newIndex = null;
	}
	return newIndex;
};
var findPlacedIndicesFromIndexInArray = function (array, index) {
	// NOTE: You must use the padded, dummy data array for this or it will wrap early
	if (array.length <= index) {
		// console.error('findPlacedIndicesFromIndexInArray received an out of bound index!');
		// console.error({array: array, index: index});
		return
	} else {
		var pc = incrementIndexInArray(array, index);
		if (pc === null) {
			// console.error('incrementIndexInArray returned null; array is 1 item long!')
			// console.error({array: array, index: index});
		} else {
			var result = [index];
			var targetName = array[index];
			if (!!targetName) {
				var nextName = array[pc];
				while (nextName === targetName) {
					result.push(pc);
					pc = incrementIndexInArray(array, pc);
					nextName = array[pc];
					// console.log('incremented')
				}
				// TODO: Split up checking forwards and checking backwards into different functions
				// Then concat those two new arrays with the original "result" containing the
				// original index
				// Maybe also check whether the original index is even in range and have some
				// kind of error handling for when it's not
				var pc = decrementIndexInArray(array, index);
				var nextName = array[pc];
					while (nextName === targetName) {
					result.push(pc);
					pc = decrementIndexInArray(array, pc);
					nextName = array[pc];
					// console.log('decremented')
				}
			}
		}
		return result;
	}
};
var clearNameFromArray = function (newArray, name) {
	var newArray = newArray.slice();
	if (newArray.includes(name)) {
		var snipe = newArray.findIndex(function (item) { return item === name });
		while (snipe !== -1) {
			newArray = clearWholeNameAtIndex(newArray, snipe);
			snipe = newArray.findIndex(function (item) { return item === name });
		}
	}
	return newArray;
};



var historyPage = Vue.component('history', {
	data: function () {
		return {
			fullHistory: makeFullHistory(),
			selectedFloor: 'up',
			highlightedName: '',
			insertName: '',
			placedNames: {
				up: ['test'],
				down: [],
			}
		};
	},
	computed: {
		workingHistory: function () {
			var self = this;
			var monthMap = [
				'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
				'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
			]
			return this.fullHistory.map(function (item) {
				var floor = self.selectedFloor;
				var label = item.rotationLabel;
				var shortYear = label.year + '';
				// var shortLabel = label.year + '-' + label.month;
				var shortLabel = monthMap[label.month-1] +
					" '" +
					shortYear[2] +
					shortYear[3];
				// if (label.version !== 1) {
				// 	shortLabel += 'v' + label.version;
				// }
				return {
					label: shortLabel,
					names: item[floor],
					featured: item.feat,
				};
			})
		},
		potentialState: function () {
			return this.$store.state.potentialState;
		},
		guestInRotation: function () {
			var guest = this.potentialState.guest;
			return guest.present && !guest.withFeatured;
		},
		slotCounts: function () {
			var self = this;
			var tally = {
				up: 0,
				down: 0,
			};
			Object.keys(tally).forEach(function (floor) {
				self.potentialState[floor].forEach(function (artist) {
					tally[floor] += artist.slotSize;
				})
			})
			return tally;
		},
		halfSlotCounts: function () {
			var tally = this.slotCounts;
			return {
				up: tally.up * 2,
				down: tally.down * 2,
			};
		},
		displaySlotSizes: function () {
			var tally = this.slotCounts;
			var makeSlotCountPretty = function (number) {
				var result = number + '';
				return result.replace('.5', '½');
			}
			return {
				up: makeSlotCountPretty(tally.up),
				down: makeSlotCountPretty(tally.down),
			}
		},
		rawUnplacedNames: function () {
			var floors = ['up','down'];
			var unplaced = {
				'up': [],
				'down': [],
			}
			var potentialState = this.potentialState;
			floors.forEach(function (floor) {
				potentialState[floor].forEach(function (item) {
					var displayName = item.name;
					var displaySlotSize = item.slotSize + '';
					if (displaySlotSize !== '1') {
						displaySlotSize = displaySlotSize
							.replace('.5', '½')
							.replace('0', '');
						displayName = displayName +
							' (' + displaySlotSize + ')';
					}			
					var insert = {
						name: item.name,
						displayName: displayName,
						slotSize: item.slotSize,
					};
					unplaced[floor].push(insert);
				})
			})
			return unplaced;
		},
		filteredUnplacedNames: function () {
			var orig = JSON.parse(JSON.stringify(this.rawUnplacedNames));
			var floors = ['up','down'];
			var placedNames = this.placedNames;
			var filtered = {
				'up': [],
				'down': [],
			}
			floors.forEach(function (floor) {
				orig[floor].forEach(function (item) {
					if (
							!placedNames[floor].includes(item.name)
						){
						filtered[floor].push(item);
					}
				})
			})
			return filtered;
		},
		visibleButtons: function () {
			return this.filteredUnplacedNames[this.selectedFloor];
		},
		namesToSlotSizes: function () {
			// console.log('hi')
			var result = {};
			var floors = ['up','down'];
			var potential = this.potentialState;
			floors.forEach(function (floor) {
				potential[floor].forEach(function (artist) {
					result[artist.name] = artist.slotSize;
				})
			})
			// console.log(result);
			return result;
		},
		paddedNames: function () { // padded with null to the target length
			var result = JSON.parse(JSON.stringify(this.placedNames));
			var halfSlotCounts = this.halfSlotCounts;
			Object.keys(result).forEach(function (floor) {
				var halfSlotCount = halfSlotCounts[floor];
				var origLength = result[floor].length;
				result[floor].length = halfSlotCount;
				result[floor].fill(null, origLength);
			})
			return result;
		},
		inProgressNames: function () { // with unique names for null slots
			var result = JSON.parse(JSON.stringify(this.paddedNames));
			Object.keys(result).forEach(function (floor){
				var editingArray = result[floor].slice()
				var newArray = editingArray.map(function (item, index) {
					return !!item ? item : 'empty #' + index;
				})
				result[floor] = newArray;
			})
			return result;
		},
		displayNames: function () { // to send to display component
			var result = JSON.parse(JSON.stringify(this.inProgressNames));
			if (this.guestInRotation) {
				result.up.unshift('GUEST');
			};
			return result;
		}
	},
	methods: {
		setFloor: function (string) {
			this.highlightedName = '';
			this.insertName = '';
			this.selectedFloor = string;
		},
		highlightName: function (name) {
			this.insertName = '';
			if (this.highlightedName === name) {
				this.highlightedName = '';
			} else {
				this.highlightedName = name;
			}
		},
		highlightNameToInsert: function (name) {
			if (this.insertName === name) {
				this.insertName = '';
				this.highlightedName = '';
			} else {
				this.insertName = name;
				this.highlightedName = name;
			}
		},
		clickNameTopRow: function (args) {
			var arrayWithUniques = this.placedNames[this.selectedFloor].slice();
			var arrayWithNulls = this.paddedNames[this.selectedFloor].slice();
			var index = args.index;
			if (this.displayNames.up.includes('GUEST') && this.selectedFloor === 'up') {
				index -= 1;
			}
			var clickedName = arrayWithNulls[index];
			var clickedLiteralWord = arrayWithUniques[index];
			if (!!clickedName) { // If there's a name there already
				// console.log("There's a name there already ('" + clickedName + "')")
				if (!!this.insertName) { // And there's one wanting to be inserted
					// console.log("And there's one wanting to be inserted: " + this.insertName);
					if (this.insertName === clickedLiteralWord) { // And they're both the same, then CLEAR THE NAME
						// console.log("And the name to be inserted is the same as the literal word that was clicked");
						// console.log('CLEAR THE NAME')
						arrayWithNulls = clearWholeNameAtIndex(arrayWithNulls, index);
						this.highlightedName = '';
						this.insertName = '';
					} else { // And they're not the same (replace)
						// console.log("And the name to be inserted is NOT the same as the literal word that was clicked");
						// console.log('REPLACE THE NAME')
						arrayWithNulls = clearWholeNameAtIndex(arrayWithNulls, index);
						var halfSlotCount = this.namesToSlotSizes[this.insertName] * 2;
						arrayWithNulls = insertWholeNameAtIndex(arrayWithNulls, index, this.insertName, halfSlotCount);
						this.insertName = ''; // leave it highlighted though
						// console.log('Leaving it highlighted though')
					}
				} else { // If there isn't a name wanting to be inserted
					if (clickedName !== this.highlightedName) { // and it's not the currently highlighted name
						this.highlightedName = clickedName;
					} else { // if it IS the currently highlighted name name
						if (clickedLiteralWord === clickedName) { // real names only
							// console.log("There is no name name to insert, though; setting this name to the insertion name and highlighting it")
							this.insertName = clickedName; // make it the nameToInsert
							this.highlightedName = clickedName;
						}
					}
				}
			} else { // There isn't a name there already
				// console.log("There is no name there already")
				if (!!this.insertName) { // But there's one wanting to be inserted
					// console.log("There is a name to be inserted")
					// console.log('INSERT THE NAME')					
					var halfSlotCount = this.namesToSlotSizes[this.insertName] * 2;
					arrayWithNulls = insertWholeNameAtIndex(arrayWithNulls, index, this.insertName, halfSlotCount);
					this.insertName = ''; // leave it highlighted though
					// console.log('Leaving it highlighted though')
				} else {
					// console.log('No name to insert, however')
				}
			}
			var finishedStuff = JSON.parse(JSON.stringify(this.placedNames));
			finishedStuff[this.selectedFloor] = arrayWithNulls
			this.placedNames = finishedStuff;
		},
	},
	template: /*html*/`
<div>
	<p>
		<button
			@click="setFloor('up')"
		>See upstairs ({{displaySlotSizes.up}})</button>
		<button
			@click="setFloor('down')"
		>See downstairs ({{displaySlotSizes.down}})</button>
	</p>
	<p>
		<span>Artists left to place: </span>
		<span
			v-if="visibleButtons.length === 0 && !insertName"
		><strong>All done!</strong></span>
		<button
			v-for="artist in visibleButtons"
			@click="highlightNameToInsert(artist.name)"
			class="insertion-button"
			:class="artist.name === insertName ? 'insertable-highlighted' : 'insertable'"
		>{{artist.displayName}}</button>
		<span
			v-if="!!insertName"
		>Placing the name <strong>{{insertName}}</strong></span>
	</p>
	<history-row
		:names="displayNames[selectedFloor]"
		@clicked-on-name="clickNameTopRow($event)"
		label="NEW"
		:featured="potentialState.featured"
		:insert-name="insertName"
		:highlight-name="highlightedName"
	>
	</history-row>
	<div
		class="unflat"
	>
		<history-row
			@clicked-on-name="highlightName($event.name)"
			v-for="(item, key) in workingHistory"
			:key="key"
			:names="item.names"
			:label="item.label"
			:featured="item.featured"
			:highlight-name="highlightedName"
		>
		</history-row>
	</div>
</div>
	`
});
