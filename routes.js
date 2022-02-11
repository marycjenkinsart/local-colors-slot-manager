var routes = [
	{
		path: '/',
		component: overallViewPage
	},
	{
		path: '/edit',
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
