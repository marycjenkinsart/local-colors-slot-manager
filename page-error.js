var errorPage = Vue.component('error-page', {
	mixins: [
		mixinsHistory,
	],
	computed: {
		importWarningFromURL: function () {
			return this.$store.getters.importWarningFromURL;
		},
		importWarningsGeneric: function () {
			return this.$store.getters.importWarningsGeneric;
		},
		returnTo: function () {
			return this.$store.getters.returnTo;
		},
		viewOrLoad: function () {
			return this.$store.getters.returnTo === '/view' ? 'view' : 'load'
		},
		viewOrLoadCap: function () {
			return this.$store.getters.returnTo === '/view' ? 'View' : 'Load'
		},
		rotation: function () {
			return this.$store.getters.rotation;
		},
		rotationMatches: function () { // NOTE: original "match results" version!
			return this.$store.getters.rotationMatches;
		},
		partialMatchRotations: function () { // NOTE: an array of rotations!!
			var tempHistory = this.$store.getters.rotationMatches || []
			var filtered = tempHistory.filter(function (item) {
				return item.comparedRotation.meta.querySource !== 'from URL';
			});
			var result = filtered.map(function (item) {
				return item.comparedRotation;
			})
			console.log({result})
			return result;
		},
		singlePartialMatch: function () {
			return this.partialMatchRotations.length === 1;
		},
		fullHistory: function () {
			var result = this.$store.getters.fullHistory || [];
			var selfself = this;
			return result.filter(function (item) {
				return !detectRotationPerfectMatch(item, selfself.rotation);
			});
		},
		latestHistoryItem: function () {
			return this.fullHistory[0]; // TODO maybe streamline this a bit
		},
		displayLabel: function () {
			return this.returnTo === '/view' ? 'LC Layout Viewer' : 'LC Layout Manager'
		},
	},
	methods: {
		// loadRotationMatchByIndex: function () {
			
		// },
		// loadHistoryItemByIndex: function (index) {
		// 	var destination = this.returnTo || '/hub';
		// 	this.$store.dispatch('setReturnTo', '');
		// 	this.$router.push({
		// 		path: destination,
		// 		query: this.$route.query,
		// 	});
		// },
		clickedOnChooseFromHistory: function () {
			this.$router.push({
				path: '/choose',
				query: this.$route.query,
			});
		},
		clickedOnMatchedRotation: function (index) {
			var destination = this.returnTo || '/hub';
			var target = this.partialMatchRotations[index];
			this.$store.dispatch('loadRotation', target);
			this.$store.dispatch('setReturnTo', '');
			this.$store.dispatch('setImportWarningFromURL', '');
			this.$router.push({
				path: destination,
				query: target.originalQuery,
			});
		},
		clickedOnLatestRotation: function () {
			var destination = this.returnTo || '/hub';
			var target = this.latestHistoryItem;
			this.$store.dispatch('loadRotation', target);
			this.$store.dispatch('setReturnTo', '');
			this.$store.dispatch('setImportWarningFromURL', '');
			this.$router.push({
				path: destination,
				query: target.originalQuery,
			});
		},
	},
	template: /*html*/`
<div
	id="error"
>
	<my-header
		:label="displayLabel"
	></my-header>
	<p>
		<span class="red">ERROR: </span>
		<span>{{importWarningFromURL}}</span>
	</p>
	<p>
		<ul>
			<li
				class="red"
				v-for="warning in importWarningsGeneric"
			>{{warning}}</li>
		</ul>
	</p>
	<p>Choose an option below to continue.</p>
	<div
		v-if="partialMatchRotations.length > 0"
	>
		<h2
			style="color: #000;"
		>
			<span
				v-if="singlePartialMatch"
			>Partial data match found!</span>
			<span
				v-if="!singlePartialMatch"
			>Partial data matches found!</span>
		</h2>
		<p
			v-if="singlePartialMatch"
		>The following rotation has data in common with the incomplete URL query. Did you mean to {{viewOrLoad}} this?</p>
		<p
			v-if="!singlePartialMatch"
		>The following rotations have data in common with the incomplete URL query. Did you mean to {{viewOrLoad}} one of these?</p>
		<div class="flex-cards">
			<rotation-button-row
				v-for="(matchedItem, index) in partialMatchRotations"
				:key="index"
				:rotation="matchedItem"
				header-label="Partial match"
				:button-label="viewOrLoadCap"
				@clicked-on-rotation="clickedOnMatchedRotation(index)"
			>
				<h3 class="flat">{{makeShortLabel(matchedItem.rotationLabel)}}</h3>
			</rotation-button-row>
		</div>
	</div>
	<div>
		<h2
			style="color: #000;"
		>Historical rotations</h2>
		<p>{{viewOrLoadCap}} a rotation from the archives:</p>
		<div class="flex-cards">
			<rotation-button-row
				:rotation="latestHistoryItem"
				header-label="Most recent data"
				:button-label="viewOrLoadCap"
				@clicked-on-rotation="clickedOnLatestRotation"
			>
				<h3 class="flat">{{makeShortLabel(latestHistoryItem.rotationLabel)}}</h3>
			</rotation-button-row>
			<div class="flex-card-wide">
				<div class="card-head">
					<span>Other historical data</span>
				</div>
				<div class="card-body">
					<p>
						From <strong>{{historyItemsRange[0]}}</strong><br/>
						to <strong>{{historyItemsRange[1]}}</strong>
					</p>
					<p
						v-if="displayHistoryGaps === 1"
					>({{displayHistoryGaps}} gap)</p>
					<p
						v-if="displayHistoryGaps !== 1"
					>({{displayHistoryGaps}} gaps)</p>
					<p>
						<button
							class="big_button"
							@click="clickedOnChooseFromHistory"
						>Choose a rotation
						</button>
					</p>
				</div>
			</div>
		</div>
	</div>
	<my-footer></my-footer>
</div>
`
});
