var store = new Vuex.Store({
	state: {
		rigidView: true, // whether to show the rigid, hand-tuned svg templates or the dynamic svg lines
		manageLabel: false,
		manage: '',
		templateInfo: {
			up: {
				snapOn: true,
				snapInches: 12,
				adjustments: {},
			},
			down: {
				snapOn: true,
				snapInches: 12,
				adjustments: {},
			},
		},
	},
	// getters: {}, // ≈'computed' for everyone
	mutations: {
		// this is what actually changes the state
		SET_MANAGE_LABEL: function (state, bool) {
			state.manageLabel = bool;
		},
		MANAGE_THIS: function (state, value) {
			state.manage = value;
		},
		TOGGLE_CORNER_SNAP: function (state, floorName) {
			var floor = state.templateInfo[floorName];
			floor.snapOn = !floor.snapOn;
		},
		CHANGE_CORNER_SNAP_THRESHOLD: function (state, args) {
			var floorName = args.floorName;
			var value = args.value;
			state.templateInfo[floorName].snapInches = value;
		},
	},
	actions: {
		// only one additional thing can be passed besides 'context'
		// you'll have to pack multiples in an object :(
		toggleCornerSnap: function (context, floorName) {
			context.commit('TOGGLE_CORNER_SNAP', floorName);
		},
		changeCornerSnapThreshold: function (context, args) {
			context.commit('CHANGE_CORNER_SNAP_THRESHOLD', args);
		},
		setManageLabel: function (context, bool) {
			context.commit('SET_MANAGE_LABEL', bool);
		},
		manageThis: function (context, value) {
			context.commit('MANAGE_THIS', value);
		},
	},
});