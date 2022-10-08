var monthViewInsertPage = Vue.component('month-view-insert', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {
			placedNames: [],
		};
	},
	computed: {
		header: function () {
			return this.floorName
				? `${capitalizeFirstChar(this.floorName)}stairs names`
				: "Insert names into floor"
		},
		currentRotation: function () {
			return this.$store.getters.rotation;
		},
		floorName: function () {
			return this.$store.state.history.selectedFloor;
		},
		insertGuest: function () {
			var guest = false;
			if (this.currentRotation.artists[this.floorName].includes('GUEST')) {
				guest = true;
			}
			return guest;
		},
		namesToInsert: function () {
			var names = this.currentRotation.artists[this.floorName];
			names = names.filter(function (item) {
				return item !== 'GUEST';
			})
			var fancyNames = makeFloorFancy(names);
			var rawUnplacedNames = fancyNames.map(function (artist) {
				artist.displaySlotSize = makeSlotCountPretty(artist.slotSize);
				return artist;
			}) // lol how did I do any of this??
			return prepareRawUnfilteredNames(rawUnplacedNames);
		},
		finished: function () {
			return !!this.placedNames.length;
		}
	},
	methods: {
		quit: function () {
			this.setHighlightedName('');
			this.setInsertName('');
			scrollToTop();
			this.$router.push({
				path: '/',
				query: this.$route.query,
			});
		},
		save: function () {
			if (this.placedNames.length) {
				var placedNames = this.placedNames;
				if (this.insertGuest) {
					placedNames.unshift('GUEST');
				}
				var rotation = clone(this.currentRotation);
				rotation.artists[this.floorName] = placedNames;
				this.$store.dispatch('loadRotation', rotation);
			}
		},
		saveAndQuit: function () {
			this.save();
			this.quit();
		},
		updatePlacedNames: function (array) {
			this.placedNames = array;
		},
	},
	template: /*html*/`
<div
	id="month-view-insert"
>
	<my-header
		:label="header"
	></my-header>
	<wizard-insertion-tips
		:show-tips="showTips"
		@set-tips="setTips($event)"
	></wizard-insertion-tips>
	<hr style="margin: 10px 0px;">
	<history-placement
		:insertGuest="insertGuest"
		:namesToInsert="namesToInsert"
		:featured="currentRotation.artists.feat"
		@update-placed-names="updatePlacedNames($event)"
	></history-placement>
	<history-header></history-header>
	<history-table
		:omit-current="true"
	></history-table>
	<p>
		<button
			class="impressive-button"
			@click="quit"
		>Cancel</button>
		<button
			class="impressive-button"
			@click="saveAndQuit"
			:disabled="!finished"
		>Save & Quit</button>
	</p>
</div>
	`
});
