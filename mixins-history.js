// mixins for history views

var mixinsHistory = {
	computed: {
		selectedFloor: function () {
			return this.$store.state.history.selectedFloor;
		},
		highlightedName: function () {
			return this.$store.state.history.highlightedName;
		},
		insertName: function () {
			return this.$store.state.history.insertName;
		},
		fullHistory: function () {
			return this.$store.state.history.fullHistory;
		},
	},
	methods: {
		setFloor: function (string) {
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
		makeShortLabel: function (label) {
			var monthMap = [
				'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
				'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
			];
			var result = '';
			if (!!label.custom) {
				result = label.custom;
			} else {
				result = monthMap[label.month-1]
					+ ' '
					+ label.year;
				if (label.version !== 1) {
					result = result + ' v' + label.version
				}
			}
			return result;
		},
	},
};