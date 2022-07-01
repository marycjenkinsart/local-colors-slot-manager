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
			return this.$store.getters.rotationLabel;
		},
		importDataIsPresent: function () {
			return this.importDataLabel.year !== 1969;
		},
		latestHistoryItemLabel: function () {
			return this.historyItems[0].rotationLabel;
		},
		latestDataTest: function () {
			var importData = this.importDataLabel;
			var historyData = this.latestHistoryItemLabel;
			// TODO: finish this
			return compareLabelAges(importData,historyData);
			// -1 means the history has the newer data
			// 0 means the latest historical data is just as old as the import
			// 1 means the import data is newer
		},
		historyItems: function () {
			return this.$store.getters.practicalHistory;
		},
		displayHistoryItems: function () {
			var self = this;
			return this.historyItems.map(function (month) {
				return self.makeShortLabel(month.rotationLabel);
			});
		},
	},
	methods: {
		loadAndGoToView: function (rotationObject) {
			this.$store.dispatch('loadRotation', rotationObject);
			this.$router.push({
				path: '/view',
				query: rotationObject.originalQuery,
			});
		},
		goToViewLatestHistory: function () {
			this.loadAndGoToView(this.historyItems[0]);
		},
		goToViewImport: function () {
			this.$router.push({
				path: '/view',
				query: this.$route.query,
			});
		},
		goToHistoryViewer: function () {
			this.$router.push({
				path: '/history',
				query: this.$route.query,
			});
		},
		goToAdvancedEditMode: function () {
			this.$router.push({
				path: '/',
				query: this.$route.query,
			});
		},
		goToWizard: function () {
			this.$router.push({
				path: '/wizard',
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
		<span
			v-if="importDataIsPresent"
			:class="latestDataTest >= 0 ? 'bold' : ''"
		>
			<span>Data imported:</span>
			<span class="red">{{makeShortLabel(importDataLabel)}}</span>
		</span>
		<span
			v-if="!importDataIsPresent"
			class="red"
		><em>No import data found</em></span>
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
					v-if="importDataIsPresent && latestDataTest >= 0"
					@click="goToViewImport"
				>Most Recent: {{makeShortLabel(importDataLabel)}}</button>
				<button
					class="impressive-button"
					v-if="!importDataIsPresent || latestDataTest < 0"
					@click="goToViewLatestHistory"
				>Most Recent*: {{makeShortLabel(latestHistoryItemLabel)}}</button>
				<p
				v-if="!importDataIsPresent || latestDataTest < 0"
				>*Latest data from history</p>
				<p>To return to the hub from the preview screen, click the rotation title five times.</p>
			</div>
		</div>
		<div class="flex-card">
			<div class="card-head">
				<span>Edit Mode</span>
			</div>
			<div class="card-body">
				<p>Edit the current rotation.</p>
				<p>
					<button
						class="impressive-button"
						@click="goToWizard"
					>Rotation wizard</button>
					<button
						class="impressive-button"
						@click="goToAdvancedEditMode"
					>Advanced editor</button>
				</p>
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
