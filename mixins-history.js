// mixins for history views

var mixinsHistory = {
	data: function () {
		return {
			showTips: false,
		}
	},
	computed: {
		fromEditMode: function () {
			// whether history was entered from edit mode
			return this.$store.state.history.fromEditMode;
		},
		selectedFloor: function () {
			// which floor's history will be viewed
			return this.$store.state.history.selectedFloor;
		},
		highlightedName: function () {
			// which name should turn red (through all history rows)
			return this.$store.state.history.highlightedName;
		},
		insertName: function () {
			// which name should turn black (to insert)
			return this.$store.state.history.insertName;
		},
		fullHistory: function () {
			return this.$store.getters.fullHistory;
		},
		practicalHistory: function () {
			// the history a normal table will display
			return this.$store.getters.practicalHistory;
		},
		historyItemsRange: function () {
			return getHistoryRange(this.fullHistory);
		},
		displayHistoryGaps: function () {
			var result = countHistoryGaps(this.fullHistory);
			return result === 0 ? 'no' : result;
		},
	},
	methods: {
		setFloor: function (string) {
			// change which floor is to be viewed
			this.setHighlightedName('');
			this.setInsertName('');
			this.$store.dispatch('historySetSelectedFloor', string);
		},
		setHighlightedName: function (name) {
			this.$store.dispatch('historySetHighlightedName', name);
		},
		setInsertName: function (name) {
			this.$store.dispatch('historySetInsertName', name);
		},
		setTips: function (bool) {
			this.showTips = bool;
		},
		makeShortLabel: makeShortLabel
	},
};