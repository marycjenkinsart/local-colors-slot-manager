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
			var selfself = this;
			var filtered = tempHistory.filter(function (item) {
				var result = true;
				if (item.comparedRotation) {
					var result = !detectRotationPerfectMatch(item.comparedRotation, selfself.rotation);
				}
				return result;
			});
			var result = filtered.map(function (item) {
				return item.comparedRotation;
			})
			return result;
		},
		fullHistory: function () {
			var result = this.$store.getters.fullHistory || [];
			var selfself = this;
			return result.filter(function (item) {
				return !detectRotationPerfectMatch(item, selfself.rotation);
			});
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
		clickedOnHistoryRotation: function (index) {
			// TODO
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
	<h1>Recovery options:</h1>
	<p> Try to manually copy and paste the URL rather than click a link that may have been converted into a link automatically. Alternatively, choose to {{viewOrLoad}} one of the below rotations instead:</p>
	<div
		v-if="partialMatchRotations.length > 0"
	>
		<h3>Partial data matches found!</h3>
		<p>The following rotation(s) have data in common with existing URL query data. Did you mean to {{viewOrLoad}} one of these, perhaps?</p>
		<div class="flex-cards">
			<rotation-button-row
				v-for="(matchedItem, key, index) in partialMatchRotations"
				:rotation="matchedItem"
				:button-label="viewOrLoadCap"
				@clicked-on-rotation="clickedOnMatchedRotation(index)"
			></rotation-button-row>
		</div>
	</div>
	<div>
		<h3>Historical rotations:</h3>
		<p>Click one of the buttons below to abandon the bad data and {{viewOrLoad}} a previous rotation instead:</p>
		<div class="flex-cards">
			<div class="flex-card-wide">
				<div class="card-head">
					<span>Latest map found</span>
				</div>
				<div class="card-body">
					<p>
						Choose to {{viewOrLoad}} the most recent map:
					</p>
					<p>
						<button
							class="big_button"
							disabled
						>{{viewOrLoadCap}} latest
						</button>
					</p>
				</div>
			</div>
			<div class="flex-card-wide">
				<div class="card-head">
					<span>Historical data</span>
				</div>
				<div class="card-body">
					<p>
						Choose to {{viewOrLoad}} a specific rotation from archives:
					</p>
					<p>
						<button
							class="big_button"
							disabled
						>Choose a previous rotation
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
