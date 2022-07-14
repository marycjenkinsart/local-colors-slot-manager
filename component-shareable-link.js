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
			var el = this.$refs.linkToCopy;
			if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
				var editable = el.contentEditable;
				var readOnly = el.readOnly;
				el.contentEditable = 'true';
				el.readOnly = 'false';
				var range = document.createRange();
				range.selectNodeContents(el);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
				el.setSelectionRange(0, 999999);
				el.contentEditable = editable;
				el.readOnly = readOnly;
			} else {
				el.select();
			}
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
