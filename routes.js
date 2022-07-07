var routes = [
	{
		path: '/',
		component: monthViewPage
	},
	{
		path: '/hub',
		component: hubPage
	},
	{
		path: '/view',
		component: previewPage
	},
	{
		path: '/history',
		component: historyPage
	},
	{
		path: '/wizard',
		component: wizardPage
	},
	{
		path: '/error',
		component: errorPage
	},
	{
		path: '/choose',
		component: choosePage
	},
];

var router = new VueRouter({
	routes: routes
});
