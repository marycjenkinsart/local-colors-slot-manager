var store = new Vuex.Store({
	state: {
		advanced: {
			advancedModeOn: false,
			rigidView: true, // whether to show the rigid, hand-tuned svg templates or the dynamic svg lines
			showCircles: false,
		},
		templateInfo: {
			up: {
				selectedTemplateBase: Object.keys(templates.up)[0],
				snapOn: true,
				snapInches: 18,
			},
			down: {
				selectedTemplateBase: Object.keys(templates.down)[0],
				snapOn: true,
				snapInches: 18,
			},
		},
		manage: {
			label: false,
			which: '',
		},
		rotationLabel: {
			year: 1970,
			month: 1,
			version: 255,
			custom: 'Default Label Value',
			editing: false,
		},
		guestNameString: 'GUEST',
		artists: {
			'feat': [ // can be more than one! or zero!
				{
					name:'Teri',
					type: '2D',
					origSlotSize: 1,
				},
			],
			'up': [
				'GUEST',
				'Bill',
				'Bill',
				'J. Clay',
				'Jeff M.',
				'Jeff M.',
				'Emily',
				'Emily',
				'Blaine',
				'Blaine',
			],
			'down': [
				'Adam',
				'Nuha',
				'Nuha',
				'Pam',
				'Pam',
				'Mary',
				'Mary',
				'Jan',
				'Jan',
				'Adam',
			],
		},
	},
	getters: {
		longLabel: function (state) {
			var labelObject = state.rotationLabel;
			var year = labelObject.year || 1970;
			var month = labelObject.month || 13;
			var version = labelObject.version || 1;
			var custom = labelObject.custom || '';
			var result = '';
			if (custom.length) {
				result = custom;
			} else {
				var monthMap = [
					'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
					'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
				]
				var monthName = monthMap[parseInt(month) - 1] || 'ERROR';
				result = monthName + ' ' + year
				if (version > 1) {
					result += ' v' + version;
				}
			}
			return result;
		},
		fancyArtists: function (state) {
			return {
				up: makeFancy(state.artists.up),
				down: makeFancy(state.artists.down),
			};
		},
		uniqueArtists: function (state) {
			return {
				up: state.artists.up.filter(getUnique),
				down: state.artists.down.filter(getUnique),
			};
		},
		upTemplate: function (state) {
			return templates.up[state.templateInfo.up.selectedTemplateBase];
		},
		downTemplate: function (state) {
			return templates.down[state.templateInfo.down.selectedTemplateBase];
		},
		uniformHalfSlotLengths: function (state, getters) {
			return {
				up: getBaselineHalfSlots(getters.upTemplate, state.artists.up),
				down: getBaselineHalfSlots(getters.downTemplate, state.artists.down),
			};
		},
		naiveHalfSlots: function (state, getters) {
			return {
				up: makeComplexLines(getters.upTemplate, getters.uniformHalfSlotLengths.up),
				down: makeComplexLines(getters.downTemplate, getters.uniformHalfSlotLengths.down),
			};
		},
		naiveHalfSlotsFused: function (state, getters) {
			return {
				up: fuseComplexLinesByArtist(getters.naiveHalfSlots.up),
				down: fuseComplexLinesByArtist(getters.naiveHalfSlots.down),
			};
		},
		snappedHalfSlotsFused: function (state, getters) {
			// return {
			// 	up: fuseComplexLinesByArtist(getters.naiveHalfSlots.up),
			// 	down: fuseComplexLinesByArtist(getters.naiveHalfSlots.down),
			// };
		},
		naiveHalfSlotEdges: function (state, getters) {
			return {
				up: getEdgesFromComplexLines(getters.naiveHalfSlots.up),
				down: getEdgesFromComplexLines(getters.naiveHalfSlots.down),
			};
		},
		naiveHalfSlotsFused: function (state, getters) {
			return {
				up: getEdgesFromComplexLines(getters.naiveHalfSlotsFused.up),
				down: getEdgesFromComplexLines(getters.naiveHalfSlotsFused.down),
			};
		},
	},
	mutations: {
		// this is what actually changes the state
		TOGGLE_RIGID_VIEW: function (state) {
			state.advanced.rigidView = !state.advanced.rigidView;
		},
		TOGGLE_ADVANCED_MODE: function (state) {
			state.advanced.advancedModeOn = !state.advanced.advancedModeOn;
		},
		SET_ADVANCED_MODE: function (state, bool) {
			state.advanced.advancedModeOn = bool;
		},
		SET_MANAGE_LABEL: function (state, bool) {
			state.manage.label = bool;
		},
		MANAGE_THIS: function (state, value) {
			state.manage.which = value;
		},
		TOGGLE_SNAP_CIRCLES: function (state) {
			state.advanced.showCircles = !state.advanced.showCircles;
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
		SET_SELECTED_TEMPLATE_BASE: function (state, args) {
			var floorName = args.floorName;
			var value = args.value;
			state.templateInfo[floorName].selectedTemplateBase = value;
		},
		UPDATE_LABEL_OBJECT: function (state, data) {
			state.rotationLabel = data;
		},
		UPDATE_ARTISTS_OBJECT: function (state, data) {
			state.artists = data;
		},
	},
	actions: {
		// only one additional thing can be passed besides 'context'
		// you'll have to pack multiples in an object :(
		setAdvancedMode: function (context, bool) {
			context.commit('SET_ADVANCED_MODE', bool);
		},
		toggleAdvancedMode: function (context) {
			context.commit('TOGGLE_ADVANCED_MODE');
		},
		toggleRigidView: function (context) {
			context.commit('TOGGLE_RIGID_VIEW');
		},
		setManageLabel: function (context, bool) {
			context.commit('SET_MANAGE_LABEL', bool);
		},
		manageThis: function (context, value) {
			context.commit('MANAGE_THIS', value);
		},
		toggleSnapCircles: function (context) {
			context.commit('TOGGLE_SNAP_CIRCLES');
		},
		toggleCornerSnap: function (context, floorName) {
			context.commit('TOGGLE_CORNER_SNAP', floorName);
		},
		changeCornerSnapThreshold: function (context, args) {
			context.commit('CHANGE_CORNER_SNAP_THRESHOLD', args);
		},
		setSelectedTemplateBase: function (context, args) {
			context.commit('SET_SELECTED_TEMPLATE_BASE', args);
		},
		updateLabelObject: function (context, data) {
			context.commit('UPDATE_LABEL_OBJECT', data);
		},
		updateArtistsObject: function (context, data) {
			context.commit('UPDATE_ARTISTS_OBJECT', data);
		},
	},
});