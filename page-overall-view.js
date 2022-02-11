var overallViewPage = Vue.component('overall-view', {
	template: /*html*/`
<div id="overall-view">
	<nav>
		<h1 class="flat">LC Rotation Manager</h1>
		<router-link to="/edit">EDIT</router-link>
		<router-link to="/view">PREVIEW</router-link>
	</nav>
</div>
`
});
