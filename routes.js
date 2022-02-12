var routes = [
	{
		path: '/',
		component: monthViewPage
	},
	{
		path: '/view',
		component: previewPage
	},
];

var router = new VueRouter({
	routes: routes
});
