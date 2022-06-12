var hubPage = Vue.component('hub-page', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {}
	},
	computed: {
		storeState: function () {
			return this.$store.state;
		},
		importDataLabel: function () {
			return this.$store.state.rotationLabel;
		},
		importDataIsPresent: function () {
			return this.importDataLabel.year !== 1969;
		},
		latestHistoryItemLabel: function () {
			return this.historyItems[0].rotationLabel;
		},
		latestData: function () {
			var importData = this.importDataLabel;
			var historyData = this.latestHistoryItemLabel;
			// TODO: finish this
			return compareLabelAges(importData,historyData);
			// -1 means the history has the newer data
			// 0 means the latest historical data is just as old as the import
			// 1 means the import data is newer
		},
		historyItems: function () {
			return this.$store.state.history.fullHistory;
		},
		displayHistoryItems: function () {
			var self = this;
			return this.historyItems.map(function (month) {
				return self.makeShortLabel(month.rotationLabel);
			});
		}
	},
	methods: {
		goToHistoryViewer: function () {
			this.$router.push({
				path: '/history',
				query: this.$route.query,
			});
		},
	},
	template: /*html*/`
<div
	id="hub"
>
	<my-header></my-header>
	<p>
		<span>Import data is from:</span>
		<span
			v-if="importDataIsPresent"
			:class="latestData >= 0 ? 'bold' : ''"
		>{{makeShortLabel(importDataLabel)}}</span>
		<span
			v-if="!importDataIsPresent"
			class="red"
		><em>not found</em></span>
		<span
			v-if="importDataIsPresent && latestData > 0"
		> (latest)</span>
		<br />
		<span>Latest in history:</span>
		<span
			:class="latestData <= 0 ? 'bold' : ''"
		>{{makeShortLabel(latestHistoryItemLabel)}}</span>
		<span
			v-if="latestData < 0"
		> (latest)</span>
	</p>
	<div
		class="flex-cards"
	>
		<div class="flex-card">
			<div class="card-head">
				<span>View</span>
			</div>
			<div class="card-body">
				<p>Preview a specific rotation.</p>
				<button
					class="impressive-button"
					v-if="importDataIsPresent && latestData >= 0"
				>Most Recent: {{makeShortLabel(importDataLabel)}}</button>
				<button
					class="impressive-button"
					v-if="importDataIsPresent || latestData < 0"
				>Most Recent: {{makeShortLabel(latestHistoryItemLabel)}}</button>
			</div>
		</div>
		<div class="flex-card">
			<div class="card-head">
				<span>Edit</span>
			</div>
			<div class="card-body">
				<p>Create a new layout (or edit an old one).</p>
			</div>
		</div>
		<div class="flex-card">
			<div class="card-head">
				<span>History</span>
			</div>
			<div class="card-body">
				<p>See an artist's position history over time.</p>
				<button
					class="impressive-button"
					@click="goToHistoryViewer"
				>Explore history</button>
				<p>History items found:</p>
				<ul>
					<li
						v-for="month in displayHistoryItems"
					>- {{month}}
					</li>
				</ul>
				<p class="medium-mini">
					(Currently, rotation history is updated manually.
					Inform Mary if there is any missing layout history.)
				</p>
			</div>
		</div>
	</div>
	<my-footer></my-footer>
</div>
`
});
