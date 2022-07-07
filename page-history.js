var historyPage = Vue.component('history', {
	mixins: [
		mixinsHistory,
	],
	computed: {},
	methods: {
		goToHub: function () {
			this.setHighlightedName('');
			this.setInsertName('');
			scrollToTop();
			this.$router.push({
				path: '/hub',
				query: this.$route.query,
			});
		},
	},
	template: /*html*/`
<div
	id="history"
>
	<my-header></my-header>
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
		>History for <strong>{{selectedFloor}}stairs</strong></span>
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
