var routes = [
	{
		path: '/',
		component: overallViewPage
	},
	{
		path: '/month',
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
