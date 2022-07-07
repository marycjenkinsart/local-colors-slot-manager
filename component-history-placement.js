Vue.component('history-placement', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {};
	},
	computed: {
		placedNames: function () {
			return this.$store.state.wizard.placedNames;
		},
		potentialState: function () {
			return this.$store.state.wizard.quizResults;
		},
		autoInsertGuest: function () {
			return this.potentialState.insertGuest;
		},
		slotCounts: function () {
			var result = this.$store.getters.quizResultsSlotCounts
			return result;
		},
		halfSlotCounts: function () {
			return {
				up: this.slotCounts.up * 2,
				down: this.slotCounts.down * 2,
			};
		},
		namesToSlotSizes: function () {
			return this.$store.getters.namesToSlotSizes;
		},
		displaySlotSizes: function () {
			return {
				up: makeSlotCountPretty(this.slotCounts.up),
				down: makeSlotCountPretty(this.slotCounts.down),
			}
		},
		visibleButtons: function () {
			var filteredUnplacedNames = this.$store.getters.filteredUnplacedNames;
			return filteredUnplacedNames[this.selectedFloor];
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
			if (this.autoInsertGuest) {
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
				if (
					!!this.insertName // But there's one wanting to be inserted
					&& index !== -1 // and the slot you clicked isn't "GUEST"
				) {
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
			this.setPlacedNames(finishedStuff);
		},
		setPlacedNames: function (obj) {
			this.$store.dispatch('wizardSetPlacedNames', obj);
		}
	},
	template: /*html*/`
<div>
	<p>
		<span class="red">Artists left to place:</span>
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
	</history-row>
	<history-row
		:names="displayNames[selectedFloor]"
		@clicked-on-name="clickNameTopRow($event)"
		label="NEW"
		:featured="potentialState.feat"
		:insertable="true"
	>
	</history-row>
</div>
`
});