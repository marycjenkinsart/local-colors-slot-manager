var routes = [
	{
		path: '/',
		component: overallViewPage
	},
	{
		path: '/month',
		component: monthViewPage
	},
];

var router = new VueRouter({
	routes: routes
});
