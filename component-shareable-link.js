Vue.component('shareable-link', {
	computed: {
		compactURL: function () {
			return this.$store.getters.compactURL;
		},
		rotationLabel: function () {
			return this.$store.getters.rotationLabel;
		},
		monthName: function () {
			return getLongMonth(this.rotationLabel.month);
		},
		mailToCompactURL: function () {
			var subject = `Hanging preview for ${this.monthName}`;
			if (this.rotationLabel.version !== 1) {
				subject += ' (v' + this.rotationLabel.version + ')';
			}
			subject = encodeURIComponent(subject);
			var url = this.compactURL;
			var body = `Visit this URL to preview the hanging layout:\n\n${url}`;
			body = encodeURIComponent(body);
			var result = `mailto:?subject=${subject}&body=${body}`;
			return result;
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
			title="Copy this link to your clipboard"
		>Copy Link</button>
		<a
			:href="mailToCompactURL"
			class="button"
			:class="isWizard ? 'big_button' : ''"
			@click="copyLink"
			title="Send this link as an email"
			target="_blank"
		>Email Link</a>
	</p>
</div>
`
});
