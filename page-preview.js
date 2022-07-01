var previewPage = Vue.component('preview', {
	computed: {
		importWarningFromURL: function () {
			return this.$store.getters.importWarningFromURL;
		},
		importWarningsGeneric: function () {
			return this.$store.getters.importWarningsGeneric;
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
		></map-preview>
	</div>
</div>
`
});
