Vue.component('history-placement', {
	mixins: [
		mixinsHistory,
	],
	props: {
		insertGuest: {
			type: Boolean,
			require: true,
		},
		namesToInsert: {
			type: Array,
			require: true,
		},
		featured: {
			type: Array,
			require: true,
		},
	},
	data: function () {
		return {
			placedNames: [],
			finished: false,
		};
	},
	computed: {
		slotCount: function () {
			var tally = 0;
			this.namesToInsert.forEach(function (artist) {
				tally += artist.slotSize;
			})
			return tally;
		},
		namesToSlotSizes: function () {
			// returns an object map of artist name to slot size
			var totalNames = this.$store.getters.rawUnplacedNames;
			var result = {};
			totalNames.forEach(function (item) {
				result[item.name] = item.slotSize;
			})
			return result;
		},
		displaySlotSizes: function () {
			return makeSlotCountPretty(this.slotCount);
		},
		filteredUnplacedNames: function () {
			var rawUnplacedNames = this.$store.getters.rawUnplacedNames;
			var placedNames = this.placedNames; // don't lose the `this`!
			return rawUnplacedNames.filter(function (item) {
				return !placedNames.includes(item.name);
			})
		},
		paddedNames: function () { // padded with null to the target length
			var result = this.placedNames.slice();
			var origLength = result.length;
			result.length = this.slotCount * 2;
			result.fill(null, origLength);
			return result;
		},
		inProgressNames: function () { // with unique names for null slots
			var result = this.paddedNames.map(function (item, index) {
				return item ? item : 'empty #' + index;
			})
			return result;
		},
		displayNames: function () { // to send to display component
			var result = clone(this.inProgressNames);
			if (this.insertGuest) {
				result.unshift('GUEST');
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
			var arrayWithUniques = this.placedNames.slice();
			var arrayWithNulls = this.paddedNames.slice();
			var index = args.index;
			if (this.displayNames.includes('GUEST')) {
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
			this.placedNames = arrayWithNulls;
			if (!this.filteredUnplacedNames.length) { // no more names to insert
				if (!this.finished) {
					this.finished = true;
					this.$emit('update-placed-names', clone(this.placedNames));
				}
			} else if (this.finished) {
				this.finished = false;
				this.$emit('update-placed-names', []);
			}
		},
	},
	template: /*html*/`
<div>
	<p>
		<span class="red">Artists left to place:</span>
		<span
			v-if="filteredUnplacedNames.length === 0 && !insertName"
		><strong>All done!</strong></span>
		<button
			v-for="artist in filteredUnplacedNames"
			@click="highlightNameToInsert(artist.name)"
			class="insertion-button"
			:class="artist.name === insertName ? 'insertable-highlighted' : 'insertable'"
		>{{artist.displayName}}</button>
		<span
			v-if="!!insertName"
		>Placing the name <strong>{{insertName}}</strong></span>
	</p>
	<history-row
		:names="displayNames"
		@clicked-on-name="clickNameTopRow($event)"
		label="NEW"
		:featured="featured"
		:insertable="true"
	>
	</history-row>
</div>
`
});