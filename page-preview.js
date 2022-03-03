var previewPage = Vue.component('preview', {
	mixins: [
		mixins,
	],
	computed: {
		labelData: function () {
			return this.$store.state.rotationLabel;
		},
		artists: function () {
			return this.$store.state.artists;
		},
	},
	template: /*html*/`
<div
	id="month-preview"
>
	<div
		class="view_only_preview"
	>
		<map-preview
			:artists="artists"
			:label="getLongLabel(labelData)"
		></map-preview>
	</div>
</div>
`
});
