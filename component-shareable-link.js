Vue.component('shareable-link', {
	computed: {
		compactURL: function () {
			return this.$store.getters.compactURL;
		},
		isWizard: function () {
			return this.$route.path === '/wizard'
		},
	},
	methods: {
		copyLink: function () {
			this.$refs.linkToCopy.select();
			document.execCommand("copy");
		},
	},
	template: /*html*/`
<div
	id="shareable-link-box"
>
	<p>
		<textarea
			cols="54"
			rows="6"
			class="position-absolute"
			ref="linkToCopy"
			readonly
		>{{compactURL}}</textarea>
	</p>
	<p>
		<button
			:class="isWizard ? 'big_button' : ''"
			@click="copyLink"
		>Copy Shareable Link</button>
	</p>
</div>
`
});
