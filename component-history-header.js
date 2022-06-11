Vue.component('history-header', {
	data: function () {
		return {
			historyRowHeader: {
				'feat': [
					{
						name:'Featured',
						type: '2D',
						origSlotSize: 1,
					},
				],
				'up': [
					'U1', 'U1', 'U2', 'U2', 'U3', 'U3',
					'U4', 'U4', 'U5', 'U5',
				],
				'down': [
					'B1', 'B1', 'B2', 'B2', 'B3', 'B3',
					'B4', 'B4', 'B5', 'B5', 'B6', 'B6',
				],
				'type': 'header'
			},
		};
	},
	computed: {
		selectedFloor: function () {
			return this.$store.state.history.selectedFloor;
		},
	},
	template: /*html*/`
	<history-row
		:names="historyRowHeader[selectedFloor]"
		label="Months"
		:featured="historyRowHeader.feat"
		:pale="true"
	></history-row>
`
});
