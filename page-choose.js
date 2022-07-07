var choosePage = Vue.component('choose-page', {
	mixins: [
		mixinsHistory,
	],
	computed: {
		returnTo: function () {
			return this.$store.getters.returnTo;
		},
		importWarningFromURL: function () {
			return this.$store.getters.importWarningFromURL;
		},
		importWarningExists: function () {
			return this.importWarningFromURL.length > 0;
		},
		viewOrLoad: function () {
			return this.$store.getters.returnTo === '/view' ? 'view' : 'load'
		},
		viewOrLoadCap: function () {
			return this.$store.getters.returnTo === '/view' ? 'View' : 'Load'
		},
		fullHistory: function () {
			return this.$store.getters.fullHistory || [];
		},
		fullHistoryFiltered: function () {
			var filtered = this.fullHistory.filter(function (item) {
				return item.meta.querySource !== 'from URL';
			});
			return filtered;
		},
		displayLabel: function () {
			return this.returnTo === '/view' ? 'LC Layout Viewer' : 'LC Layout Manager'
		},
	},
	methods: {
		clickedOnHistoryRotation: function (index) {
			var destination = this.returnTo || '/hub';
			var target = this.fullHistoryFiltered[index];
			this.$store.dispatch('loadRotation', target);
			this.$store.dispatch('setReturnTo', '');
			this.$store.dispatch('setImportWarningFromURL', '');
			scrollToTop();
			this.$router.push({
				path: destination,
				query: target.originalQuery,
			});
		},
		goBack: function () {
			var destination = this.returnTo || '/hub';
			console.log({destination});
			if (this.importWarningExists) {
				destination = '/error';
			}
			scrollToTop();
			this.$router.push({
				path: destination,
				query: this.$route.query,
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
	<h2>Historical rotations:</h2>
	<p>
		<span>Choose one to {{viewOrLoad}} or</span>
		<button
			@click="goBack"
			class="medium_button"
		>go back</button>
		</p>
	<div class="flex-cards">
		<rotation-button-row
			v-for="(item, index) in fullHistoryFiltered"
			:key="index"
			:rotation="item"
			:header-label="makeShortLabel(item.rotationLabel)"
			:button-label="viewOrLoadCap"
			@clicked-on-rotation="clickedOnHistoryRotation(index)"
		>
			<p class="hint">Source: {{item.meta.querySource}}</p>
		</rotation-button-row>
	</div>
	<my-footer></my-footer>
</div>
`
});
