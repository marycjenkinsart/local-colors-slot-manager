var routes = [
	{
		path: '/',
		component: monthViewPage
	},
	{
		path: '/view',
		component: previewPage
	},
	{
		path: '/history',
		component: historyPage
	},
];

var router = new VueRouter({
	routes: routes
});
