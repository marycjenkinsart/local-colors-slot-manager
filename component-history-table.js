Vue.component('history-table', {
	mixins: [
		mixinsHistory,
	],
	computed: {
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
		highlightNameAttempt: function (name) {
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
		@clicked-on-name="highlightNameAttempt($event.name)"
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