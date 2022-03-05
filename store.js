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
				priority: 'last', // in a slot size tie, give preference to last slot(s)
			},
			down: {
				selectedTemplateBase: Object.keys(templates.down)[0],
				snapOn: true,
				snapInches: 18,
				priority: 'first',
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
		fusedHalfSlots: function (state, getters) {
			return {
				up: fuseComplexLinesByArtist(getters.naiveHalfSlots.up),
				down: fuseComplexLinesByArtist(getters.naiveHalfSlots.down),
			};
		},
		snappedFusedSlots: function (state, getters) {
			var snappedSlots = JSON.parse(JSON.stringify(getters.fusedHalfSlots));
			Object.keys(snappedSlots).forEach(function (floorName) {
				var templateInfo = state.templateInfo[floorName];
				if (templateInfo.snapOn) {
					snappedSlots[floorName] = snapAllShortSegments(
						snappedSlots[floorName],
						inchesToTemplateNumber(templateInfo.snapInches),
						templateInfo.priority
					);
				}
			})
			return snappedSlots;
		},
		snappedFusedSlotsFlat: function (state, getters) { // draw the svgs from this
			var snappedSlots = {}
			Object.keys(getters.snappedFusedSlots).forEach(function (floorName) {
				var lineSegmentFragments = getters.snappedFusedSlots[floorName];
				lineSegmentFragments.forEach(function (lineSegment) {
					lineSegment.forEach(function (line) {
						snappedSlots[floorName] = snappedSlots[floorName] || [];
						snappedSlots[floorName].push(line);
					})
				})
			})
			return snappedSlots;
		},
		artistPar: function (state, getters) {
			var fancy = getters.fancyArtists;
			console.log(fancy);
			var result = {
				up: {},
				down: {},
			};
			Object.keys(fancy).forEach(function (floorName) {
				Object.values(fancy[floorName]).forEach(function (artist) {
					result[floorName][artist.name] = result[floorName][artist.name] || {};
					var artistResult = result[floorName][artist.name];
					var slotSize = artistResult.slotSize || 0;
					slotSize += artist.slotSize;
					artistResult.slotSize = slotSize;
				})
			})
			var halfSlotSize = {
				up: getters.uniformHalfSlotLengths.up[0].size,
				down: getters.uniformHalfSlotLengths.down[0].size,
			}
			Object.keys(getters.snappedFusedSlotsFlat).forEach(function (floorName) {
				var floor = getters.snappedFusedSlotsFlat[floorName];
				floor.forEach(function (lineSegment) {
					console.log(result[floorName][lineSegment.name]);
					result[floorName][lineSegment.name].slotTotal = result[floorName][lineSegment.name].slotTotal || 0;
					result[floorName][lineSegment.name].slotTotal += getLengthFromLineCoords(lineSegment);
				})
				Object.values(fancy[floorName]).forEach(function (artist) {
					var artistData = result[floorName][artist.name];
					artistData.par = artistData.slotSize * halfSlotSize[floorName] * 2;
					artistData.overPar = artistData.slotTotal - artistData.par;
				})
			})
			console.log({result});
			return result;
		},
		naiveHalfSlotEdges: function (state, getters) { // draw the ghost slot border circles from this
			return {
				up: getEdgesFromComplexLines(getters.naiveHalfSlots.up),
				down: getEdgesFromComplexLines(getters.naiveHalfSlots.down),
			};
		},
		// adjustedSlotEdges: function (state, getters) { // draw the slot borders and marin measurements from this
		// 	var up = getEdgesFromComplexLines(getters.fusedHalfSlots.up);
		// 	var down = getEdgesFromComplexLines(getters.fusedHalfSlots.down);
		// 	return {
		// 		up: up,
		// 		down: down,
		// 	};
		// },
		snappedSlotEdges: function (state, getters) { // draw the slot borders and marin measurements from this
			var up = getEdgesFromComplexLines(getters.snappedFusedSlots.up);
			var down = getEdgesFromComplexLines(getters.snappedFusedSlots.down);
			return {
				up: up,
				down: down,
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