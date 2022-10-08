Vue.component('history-table', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {
			abridged: true,
		}
	},
	props: {
		floorName: {
			type: String,
			require: false,
		},
		omitCurrent: {
			type: Boolean,
			require: false,
		},
	},
	computed: {
		workingHistory: function () {
			var history = this.practicalHistory;
			if (this.omitCurrent) {
				var currentRotation = this.$store.getters.rotation;
				history = history.filter(function (item) {
					var currLabel = currentRotation.rotationLabel;
					var testLabel = item.rotationLabel;
					return compareLabelAges(currLabel, testLabel)
				})
			}
			var floor = this.selectedFloor;
			return history.map(function (item) {
				return {
					label: makeVeryShortLabel(item.rotationLabel),
					names: item.artists[floor],
					featured: item.artists.feat,
				};
			})
		},
		abridgedHistory: function () {
			return this.abridged
				? this.workingHistory.slice(0,10)
				: this.workingHistory;
		},
	},
	methods: {
		highlightNameAttempt: function (name) {
			this.setInsertName('');
			if (this.highlightedName === name) {
				this.setHighlightedName('');
			} else {
				this.setHighlightedName(name);
			}
		},
		setAbridged: function (bool) {
			this.abridged = bool;
		},
	},
	template: /*html*/`
<div>
	<history-row
		@clicked-on-name="highlightNameAttempt($event.name)"
		v-for="(item, key) in abridgedHistory"
		:key="key"
		:names="item.names"
		:label="item.label"
		:featured="item.featured"
	>
	</history-row>
	<div style="text-align: center;">
		<button
			v-if="abridged"
			@click="setAbridged(false)"
		>show more</button>
		<button
			v-if="!abridged"
			@click="setAbridged(true)"
		>show less</button>
	</div>
</div>
`
});