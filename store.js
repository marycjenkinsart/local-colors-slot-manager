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
				adjustments: {},
			},
			down: {
				selectedTemplateBase: Object.keys(templates.down)[0],
				snapOn: true,
				snapInches: 18,
				priority: 'first',
				adjustments: {},
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
		naiveHalfSlotLengths: function (state, getters) {
			return {
				up: getBaselineHalfSlots(getters.upTemplate, state.artists.up),
				down: getBaselineHalfSlots(getters.downTemplate, state.artists.down),
			};
		},
		naiveHalfSlots: function (state, getters) {
			return {
				up: makeComplexLines(getters.upTemplate, getters.naiveHalfSlotLengths.up),
				down: makeComplexLines(getters.downTemplate, getters.naiveHalfSlotLengths.down),
			};
		},
		adjustedHalfSlotLengths: function (state, getters) {
			var result = {};
			Object.keys(state.templateInfo).forEach(function (floorName) {
				var adjustments = state.templateInfo[floorName].adjustments;
				var halfSlotCount = state.artists[floorName].length;
				// guaranteeing there's something there:
				adjustments[halfSlotCount] = adjustments[halfSlotCount] || [];
				var emptyFrom = adjustments[halfSlotCount].length;
				adjustments[halfSlotCount].length = halfSlotCount;
				adjustments[halfSlotCount].fill(0,emptyFrom);
				// the real work:
				var adjustmentsArray = adjustments[halfSlotCount];
				var templateName = floorName + 'Template';
				result[floorName] = getBaselineHalfSlots(
					getters[templateName],
					state.artists[floorName],
					adjustmentsArray,
				)
			})
			return result;
		},
		adjustedHalfSlots: function (state, getters) {
			return {
				up: makeComplexLines(getters.upTemplate, getters.adjustedHalfSlotLengths.up),
				down: makeComplexLines(getters.downTemplate, getters.adjustedHalfSlotLengths.down),
			};
		},
		fusedHalfSlots: function (state, getters) {
			return {
				up: fuseComplexLinesByArtist(getters.adjustedHalfSlots.up),
				down: fuseComplexLinesByArtist(getters.adjustedHalfSlots.down),
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
				up: getters.naiveHalfSlotLengths.up[0].size,
				down: getters.naiveHalfSlotLengths.down[0].size,
			}
			Object.keys(getters.snappedFusedSlotsFlat).forEach(function (floorName) {
				var floor = getters.snappedFusedSlotsFlat[floorName];
				floor.forEach(function (lineSegment) {
					result[floorName][lineSegment.name].slotTotal = result[floorName][lineSegment.name].slotTotal || 0;
					result[floorName][lineSegment.name].slotTotal += getLengthFromLineCoords(lineSegment);
				})
				Object.values(fancy[floorName]).forEach(function (artist) {
					var artistData = result[floorName][artist.name];
					artistData.par = artistData.slotSize * halfSlotSize[floorName] * 2;
					artistData.overPar = artistData.slotTotal - artistData.par;
				})
			})
			return result;
		},
		naiveHalfSlotEdges: function (state, getters) { // draw the ghost slot border circles from this
			return {
				up: getEdgesFromComplexLines(getters.naiveHalfSlots.up),
				down: getEdgesFromComplexLines(getters.naiveHalfSlots.down),
			};
		},
		adjustedHalfSlotEdges: function (state, getters) { // draw the solid slot border circles from this
			return {
				up: getEdgesFromComplexLines(getters.adjustedHalfSlots.up),
				down: getEdgesFromComplexLines(getters.adjustedHalfSlots.down),
			};
		},
		snappedSlotEdges: function (state, getters) { // draw the slot borders and marin measurements from this
			var up = getEdgesFromComplexLines(getters.snappedFusedSlots.up);
			var down = getEdgesFromComplexLines(getters.snappedFusedSlots.down);
			return {
				up: up,
				down: down,
			};
		},
		compactEverything: function (state) {
			var compactLabel = makeLabelCompact(state.rotationLabel);
			var up = makeFloorCompact(state.artists.up);
			var down = makeFloorCompact(state.artists.down);
			var feat = makeFeaturedCompact(state.artists.feat);
			var result = 'l=' + compactLabel +
				'&f=' + feat +
				'&u=' + up +
				'&d=' + down;
			Object.keys(state.templateInfo).forEach(function (floorName) {
				var halfSlotCount = state.artists[floorName].length;
				var shortName = 'a' + floorName[0];
				var adjustments = state.templateInfo[floorName].adjustments[halfSlotCount];
				var shortValue = makeAdjustmentsCompact(adjustments);
				if (shortValue.length > 0) {
					result += '&' + shortName + '=' + shortValue;
				}
			})
			var t = {};
			Object.keys(state.templateInfo).forEach(function (floorName) {
				var shortName = 't' + floorName[0];
				var selected = state.templateInfo[floorName].selectedTemplateBase
				var first = Object.keys(templates[floorName])[0];
				if (
					selected !== first
				) {
					t[shortName] = selected;
				}
			})
			if (t.tu || t.td) {
				tu = t.tu || '',
				td = t.td || '',
				result += '&t=' + tu + ',' + td;
			}
			return makeSpacesUnderscores(result);
		},
		compactURL: function (state, getters) {
			var viewURL = "https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?";
			return viewURL + getters.compactEverything;
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
		IMPORT_ADJUSTMENTS: function (state, data) {
			Object.keys(data).forEach(function (floorName) {
				var halfSlotCount = state.artists[floorName].length;
				state.templateInfo[floorName].adjustments[halfSlotCount] = data[floorName];
			})
		},
		UPDATE_ADJUSTMENTS: function (state, data) {
			var floorName = data.floorName;
			var newAdjustments = data.adjustments;
			var halfSlotCount = data.halfSlotCount;
			// couldn't figure out how else to trigger observability:
			var adjustments = JSON.parse(JSON.stringify(state.templateInfo[floorName].adjustments));
			adjustments[halfSlotCount] = newAdjustments;
			state.templateInfo[floorName].adjustments = adjustments;
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
		importAdjustments: function (context, data) {
			context.commit('IMPORT_ADJUSTMENTS', data);
		},
		updateAdjustments: function (context, data) {
			context.commit('UPDATE_ADJUSTMENTS', data);
		},
	},
});