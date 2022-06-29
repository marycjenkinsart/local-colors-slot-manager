Vue.component('my-header', {
	props: {
		label: {
			type: String,
			require: false
		},
	},
	computed: {
		displayLabel: function () {
			return this.label || "LC Layout Manager"
		}
	},
	template: /*html*/`
<div>
<h1 class="flat">{{displayLabel}}</h1>
</div>
`
});