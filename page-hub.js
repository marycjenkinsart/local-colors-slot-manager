var hubPage = Vue.component('hub-page', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {}
	},
	computed: {
		currentDataLabel: function () {
			return this.$store.getters.rotationLabel;
		},
		importDataIsPresent: function () {
			return this.currentDataLabel.year !== 1969;
		},
		latestHistoryItemLabel: function () {
			return this.historyItems[0].rotationLabel;
		},
		latestDataTest: function () {
			var importData = this.currentDataLabel;
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
		latestHistoryItem: function () {
			return this.historyItems[0];
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
			<span>Currently loaded:</span>
			<span class="red">{{makeShortLabel(currentDataLabel)}}</span>
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
				<h3>Most recent data</h3>
				<div>
					<button
						class="impressive-button"
						v-if="importDataIsPresent && latestDataTest >= 0"
						@click="goToViewImport"
					>{{makeShortLabel(currentDataLabel)}}</button>
					<button
						class="impressive-button"
						v-if="!importDataIsPresent || latestDataTest < 0"
						@click="goToViewLatestHistory"
					>{{makeShortLabel(latestHistoryItemLabel)}}*</button>
					<p
						v-if="!importDataIsPresent || latestDataTest < 0"
					>*From history</p>
				</div>
				<div
					v-if="!importDataIsPresent || latestDataTest < 0"
				>
					<h3>Loaded data</h3>
					<div>
						<button
							class="impressive-button"
							@click="goToViewImport"
						>{{makeShortLabel(currentDataLabel)}}</button>
					</div>
				</div>
				<h3>All historical data</h3>
				<p>Load (and preview) a different rotation.</p>
				<div>
					<button
						class="impressive-button"
						disabled
					>Choose a rotation</button>
				</div>
				<hr style="margin-top: 10px;">
				<p class="hint">To return to the hub from the preview screen, click the rotation's title five times.</p>
			</div>
		</div>
		<div class="flex-card">
			<div class="card-head">
				<span>Edit</span>
			</div>
			<div class="card-body">
				<p>Edit the currently-loaded rotation.</p>
				<h3>Rotation wizard</h3>
				<p>A guided questionnaire for producing simple rotations.</p>
				<div>
					<button
						class="impressive-button"
						@click="goToWizard"
					>Go to wizard</button>
				</div>
				<h3>Advanced editor</h3>
				<p>The original rotation editor for very granular control.</p>
				<div>
					<button
						class="impressive-button"
						@click="goToAdvancedEditMode"
					>Go to editor</button>
				</div>
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
				<hr style="margin-top: 10px;">
				<p class="hint">Change which records are included in this view with "Manage Records."</p>
			</div>
		</div>
		<div class="flex-card">
			<div class="card-head">
				<span>Manage Records</span>
			</div>
			<div class="card-body">
				<p>Manage history data for this session. (Import tab or return-delimited links from Google Sheets or elsewhere.)</p>
				<button
					class="impressive-button"
					disabled
				>Manage history</button>
				<h3>History items found:</h3>
				<ul>
					<li
						v-for="month in displayHistoryItems"
					>- {{month}}
					</li>
				</ul>
				<hr style="margin-top: 10px;">
				<p class="hint">Currently, rotation history is updated manually.
					Inform Mary if there is any missing layout history.</p>
			</div>
		</div>
	</div>
	<my-footer></my-footer>
</div>
`
});
