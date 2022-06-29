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
];

var router = new VueRouter({
	routes: routes
});
