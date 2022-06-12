Vue.component('history-placement', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {
			placedNames: {
				up: ['test'],
				down: [],
			}
		};
	},
	computed: {
		visibleButtons: function () {
			return this.filteredUnplacedNames[this.selectedFloor];
		},
		guestInRotation: function () {
			var guest = this.autoGuest;
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
		},
	},
	methods: {
		highlightNameToInsert: function (name) {
			if (this.insertName === name) {
				this.setInsertName('');
				this.setHighlightedName('');
			} else {
				this.setInsertName(name);
				this.setHighlightedName(name);
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
						this.setHighlightedName('');;
						this.setInsertName('');
					} else { // And they're not the same (replace)
						// console.log("And the name to be inserted is NOT the same as the literal word that was clicked");
						// console.log('REPLACE THE NAME')
						arrayWithNulls = clearWholeNameAtIndex(arrayWithNulls, index);
						var halfSlotCount = this.namesToSlotSizes[this.insertName] * 2;
						arrayWithNulls = insertWholeNameAtIndex(arrayWithNulls, index, this.insertName, halfSlotCount);
						this.setInsertName(''); // leave it highlighted though
						// console.log('Leaving it highlighted though')
					}
				} else { // If there isn't a name wanting to be inserted
					if (clickedName !== this.highlightedName) { // and it's not the currently highlighted name
						this.setHighlightedName(clickedName);
					} else { // if it IS the currently highlighted name name
						if (clickedLiteralWord === clickedName) { // real names only
							// console.log("There is no name name to insert, though; setting this name to the insertion name and highlighting it")
							this.setInsertName(clickedName); // make it the nameToInsert
							this.setHighlightedName(clickedName);
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
					this.setInsertName(''); // leave it highlighted though
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
	<span>Artists left to place: </span>
	<span
		v-if="visibleButtons.length === 0 && !insertName"
	><strong>All done!</strong></span>
	<button
		v-for="artist in visibleButtons"
		@click="ToInsert(artist.name)"
		class="insertion-button"
		:class="artist.name === insertName ? 'insertable-highlighted' : 'insertable'"
	>{{artist.displayName}}</button>
	<span
		v-if="!!insertName"
	>Placing the name <strong>{{insertName}}</strong></span>
	</p>
	</history-row>
	<history-row
		:names="displayNames[selectedFloor]"
		@clicked-on-name="clickNameTopRow($event)"
		label="NEW"
		:featured="potentialState.featured"
		:insert-name="insertName"
		:highlight-name="highlightedName"
	>
	</history-row>
	<p>
		<button
			@click="setFloor('up')"
		>See upstairs ({{displaySlotSizes.up}})</button>
		<button
			@click="setFloor('down')"
		>See downstairs ({{displaySlotSizes.down}})</button>
	</p>
</div>
`
});