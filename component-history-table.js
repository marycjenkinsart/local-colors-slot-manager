Vue.component('history-table', {
	computed: {
		fullHistory: function () {
			return this.$store.state.history.fullHistory;
		},
		selectedFloor: function () {
			return this.$store.state.history.selectedFloor;
		},
		workingHistory: function () {
			var monthMap = [
				'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
				'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
			]
			var floor = this.selectedFloor;
			return this.fullHistory.map(function (item) {
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
	},
	methods: {
		setHighlightedName: function (name) {
			this.$store.dispatch('historySetHighlightedName', name);
		},
		setInsertName: function (name) {
			this.$store.dispatch('historySetInsertName', name);
		},
		highlightName: function (name) {
			this.setInsertName('');
			if (this.highlightedName === name) {
				this.setHighlightedName('');
			} else {
				this.setHighlightedName(name);
			}
		},
	},
	template: /*html*/`
<div>
	<history-row
		@clicked-on-name="highlightName($event.name)"
		v-for="(item, key) in workingHistory"
		:key="key"
		:names="item.names"
		:label="item.label"
		:featured="item.featured"
	>
	</history-row>
</div>
`
});