Vue.component('history-table', {
	mixins: [
		mixinsHistory,
	],
	computed: {
		workingHistory: function () {
			var floor = this.selectedFloor;
			return this.practicalHistory.map(function (item) {
				return {
					label: makeVeryShortLabel(item.rotationLabel),
					names: item.artists[floor],
					featured: item.artists.feat,
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