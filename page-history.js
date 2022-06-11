var historyPage = Vue.component('history', {
	computed: {
		selectedFloor: function () {
			return this.$store.state.history.selectedFloor;
		},
	},
	methods: {
		setHighlightedName: function (name) {
			this.$store.dispatch('historySetHighlightedName', name);
		},
		setInsertName: function (name) {
			this.$store.dispatch('historySetInsertName', name);
		},
		setFloor: function (string) {
			this.setHighlightedName('');
			this.setInsertName('');
			this.$store.dispatch('historySetSelectedFloor', string);
		},
		goToHub: function () {
			this.setHighlightedName('');
			this.setInsertName('');
			this.$router.push({
				path: '/hub',
				query: this.$route.query,
			});
		},
	},
	template: /*html*/`
<div>
	<h1 class="flat">LC Rotation Manager</h1>
	<p>Click a name to see that artist's position over time.</p>
	<p>
		<button
			class="impressive-button"
			@click="setFloor('up')"
		>Upstairs</button>
		<button
			class="impressive-button"
			@click="setFloor('down')"
		>Downstairs</button>
		<span
			style="font-size:1.2rem; padding-left:12px;"
		>Now viewing <strong>{{selectedFloor}}stairs</strong></span>
	</p>
	<history-header></history-header>
	<history-table></history-table>
	<button
		class="impressive-button"
		@click="goToHub"
	>Back to hub</button>
	<my-footer></my-footer>
</div>
	`
});
