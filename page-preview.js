var previewPage = Vue.component('preview', {
	computed: {
		importWarningFromURL: function () {
			return this.$store.getters.importWarningFromURL;
		},
		importWarningsGeneric: function () {
			return this.$store.getters.importWarningsGeneric;
		},
		rotation: function () {
			console.log(this.$store.getters.rotation)
			return this.$store.getters.rotation;
		},
	},
	template: /*html*/`
<div
	id="month-preview"
>
	<div
		class="view_only_preview"
	>
		<p
			class="red"
		>
			<span>{{importWarningFromURL}}</span><br/>
			<span
				v-for="warning in importWarningsGeneric"
			>> {{warning}}<br/></span>
		</p>
		<map-preview
			:rotation="rotation"
		></map-preview>
	</div>
</div>
`
});
