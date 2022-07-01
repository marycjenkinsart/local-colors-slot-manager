var app = new Vue({
	el:' #app',
	store: store, // available to all children as this.$store(.state.etc)
	router: router,
	created: function () {
		var query = JSON.parse(JSON.stringify(this.$route.query));
		var imported = makeRotationObjectFromQuery(query, 'from URL');
		var loadMessage = "Something broke fairly early; not sure what. Sorry!";
		if (!imported.meta.parseSuccessful) {
			loadMessage = "The URL query processing broke partway. You found a bug!"
			console.warn(loadMessage);
		} else if (imported.meta.queryIncomplete) {
			loadMessage = "I couldn't find a complete set of data. Are you sure the link is complete?"
			console.warn(loadMessage);
		} else {
			loadMessage = ""
		}
		this.$store.dispatch('setQueryObject', {
			label: 'originalFromURL',
			query: query,
		});
		this.$store.dispatch('setQueryObject', {
			label: 'currentQuery',
			query: query,
		});
		this.$store.dispatch('setImportWarningFromURL', loadMessage);
		this.$store.dispatch('loadRotation', imported);
		this.$store.dispatch('setAltRotation', {
			label: 'originalFromURL',
			rotation: imported,
		});
		this.$store.dispatch('historyAddSingleHistoryItem', imported);
		// var actualQueryData = this.$route.query;
		// var patchedQueryData = {};
		// var artistsFromQuery = {};
		// var defaultData = {
		// 	l: '1969,12,0',
		// 	f: '',
		// 	u: 'GUEST-1,artist1,artist2-1,artist3,artist4',
		// 	d: 'Artist1,Artist2,Artist3,Artist4,Artist5-1',
		// 	au: '',
		// 	ad: '',
		// 	x: '',
		// }
		// Object.keys(defaultData).forEach(function (key) {
		// 	patchedQueryData[key] = actualQueryData && actualQueryData[key] || defaultData[key];
		// })
		// var rotationLabel = makeLabelUncompact(patchedQueryData.l);
		// artistsFromQuery.feat = makeCompactFeaturedUnfancy(patchedQueryData.f);
		// artistsFromQuery.up = makeCompactFloorUnfancy(patchedQueryData.u);
		// artistsFromQuery.down = makeCompactFloorUnfancy(patchedQueryData.d);
		// this.$store.dispatch('updateLabelObject',rotationLabel);
		// this.$store.dispatch('updateArtistsObject',artistsFromQuery);
		// var upHalfSlots = artistsFromQuery.up.length;
		// var downHalfSlots = artistsFromQuery.down.length;
		// this.$store.dispatch('importAdjustments',{
		// 	up: makeAdjustmentsUncompact(patchedQueryData.au, upHalfSlots),
		// 	down: makeAdjustmentsUncompact(patchedQueryData.ad, downHalfSlots),
		// });
		// if (actualQueryData.t) {
		// 	var splits = actualQueryData.t.split(',');
		// 	if (splits[0].length > 0) {
		// 		this.$store.dispatch('setSelectedTemplateBase',
		// 			{
		// 				floorName: 'up',
		// 				value: splits[0],
		// 			}
		// 		)
		// 	}
		// 	if (splits[1].length > 0) {
		// 		this.$store.dispatch('setSelectedTemplateBase',
		// 			{
		// 				floorName: 'down',
		// 				value: splits[0],
		// 			}
		// 		)
		// 	}
		// }
		// var flags = patchedQueryData.x.split(',');
		// // v2 detection
		// var upCheck = JSON.stringify(defaultData.u)
		// === JSON.stringify(patchedQueryData.u);
		// var downCheck = JSON.stringify(defaultData.d)
		// === JSON.stringify(patchedQueryData.d);
		// if (flags.includes('v2')) { // explicitly v2
		// 	this.$store.dispatch('setLegacyMode', false);
		// } else if (upCheck && downCheck) { // default data is being used = use v2
		// 	this.$store.dispatch('setLegacyMode', false);
		// } else { // artist data (up/down) but no v2 flag = use legacy mode
		// 	this.$store.dispatch('setLegacyMode', true);
		// }
		// // other flags
		// var self = this;
		// flags.forEach(function (flag) {
		// 	// if not marked, assume legacy mode (aka v1: rigid svg templates)
		// 	if (flag.includes('snap')) {
		// 		var splits = flag.replace('snap','').split('-');
		// 		self.$store.dispatch('changeCornerSnapThreshold', {
		// 			floorName: 'up',
		// 			value: splits[0],
		// 		});
		// 		self.$store.dispatch('changeCornerSnapThreshold', {
		// 			floorName: 'down',
		// 			value: splits[1],
		// 		});
		// 	}
		// })
	},
	template: /*html*/`
<div id="app">
<router-view></router-view>
</div>
`});