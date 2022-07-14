var myFooter = Vue.component('my-footer', {
	computed: {
		appVersion: function () {
			return currentAppVersion;
		}
	},
	template: /*html*/`
<div>
	<hr>
	<p
		class="medium-mini gray"
	>Local Colors Layout Manager (v{{appVersion}}), created and maintained by Mary Jenkins 2022</p>
</div>
`
});