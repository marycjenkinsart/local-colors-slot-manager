var historyStore = {
	// concerns the table of artist history in their slots
	// and how it looks: what's highlighted, etc
	state: { // get this at (e.g.) this.$store.history.fullHistory
		fullHistory: makeFullHistory(),
		selectedFloor: 'up',
		highlightedName: '',
		insertName: '',
		fromEditMode: false,
	},
	getters: {
		fullHistory: function (state) {
			return state.fullHistory;
		},
		practicalHistory: function (state, getters) {
			var fullHistory = clone(getters.fullHistory);
			return fullHistory.filter(function (rotation) {
				return isLatestRotationInHistory(fullHistory, rotation);
			})
		},
	},
	mutations: {
		HISTORY_SET_FULL_HISTORY: function (state, obj) {
			state.fullHistory = obj;
		},
		HISTORY_SET_HIGHLIGHTED_NAME: function (state, string) {
			state.highlightedName = string;
		},
		HISTORY_SET_INSERT_NAME: function (state, string) {
			state.insertName = string;
		},
		HISTORY_SET_SELECTED_FLOOR: function (state, string) {
			state.selectedFloor = string;
		},
	},
	actions: {
		historySortRecords: function (context) {
			var fullHistoryArray = clone(context.state.fullHistory);
			fullHistoryArray = sortHistoryRecords(fullHistoryArray);
			context.commit('HISTORY_SET_FULL_HISTORY', fullHistoryArray);
		},
		historyAddSingleHistoryItem: function (context, newHistoryItem) {
			var fullHistoryArray = clone(context.state.fullHistory);
			var duplicate = detectDuplicateRotationInHistory(fullHistoryArray, newHistoryItem);
			if (!duplicate) {
				fullHistoryArray.push(newHistoryItem);
				fullHistoryArray = sortHistoryRecords(fullHistoryArray);
				context.commit('HISTORY_SET_FULL_HISTORY', fullHistoryArray);
			}
		},
		historySetHighlightedName: function (context, string) {
			context.commit('HISTORY_SET_HIGHLIGHTED_NAME', string);
		},
		historySetInsertName: function (context, string) {
			context.commit('HISTORY_SET_INSERT_NAME', string);
		},
		historySetSelectedFloor: function (context, string) {
			context.commit('HISTORY_SET_SELECTED_FLOOR', string);
		},
	},
};

var wizardStore = {
	// concerns the wizard quiz:
	// should start with something from elsewhere and end with
	// a complete rotation object it can hand off;
	// the intermediate states should be handled here and nowhere else
	state: {
		currentQuestionIndex: 0,
		quizResults: {},
		// INSERTION STUFF BELOW
		placedNames: {
			up: [],
			down: [],
		},
	},
	getters: {
		originalRotation: function (state, getters) {
			return getters.rotation;
		},
		// INSERTION STUFF BELOW
		rawUnplacedNames: function (state, getters, rootState) {
			var floor = rootState.history.selectedFloor;
			return prepareRawUnfilteredNames(state.quizResults[floor]);
		},
	},
	mutations: {
		WIZARD_SET_CURRENT_QUESTION_INDEX: function (state, value) {
			state.currentQuestionIndex = value;
		},
		WIZARD_SUBMIT_QUIZ_RESULTS: function (state, object) {
			state.placedNames = { up: [], down: [] };
			state.quizResults = object;
		},
		// INSERTION STUFF BELOW
		WIZARD_SET_PLACED_NAMES: function (state, obj) {
			state.placedNames = obj;
		},
	},
	actions: {
		wizardSetCurrentQuestionIndex: function (context, value) {
			context.commit('WIZARD_SET_CURRENT_QUESTION_INDEX', value);
		},
		wizardSubmitQuizResults: function (context, object) {
			context.commit('WIZARD_SUBMIT_QUIZ_RESULTS', object);
		},
		// INSERTION STUFF BELOW
		wizardSetPlacedNames: function (context, array) {
			var floor = context.rootState.history.selectedFloor;
			var placedNamesAllFloors = clone(context.state.placedNames);
			placedNamesAllFloors[floor] = array;
			console.log(placedNamesAllFloors)
			context.commit('WIZARD_SET_PLACED_NAMES', placedNamesAllFloors);
		},
	},
};

var loadedStore = {
	// contains a complete rotation object to treat as "loaded"
	// but should also contain "backup" info, like what the
	// original query was, or other queries / rotation objects
	// of interest
	state: {
		returnTo: null,
		importWarningFromURL: '',
		altRotations: {
			// `originalFromURL` is added when app is loaded
		},
		current: {
			rotationLabel:  {
				mergedMonth: 23629,
				year: 1969,
				month: 1,
				version: 255,
				custom: '',
			},
			artists: {
				up: ['GUEST','Alice','Alice','Bob','Bob'],
				down: ['Charlie','Charlie','Dianne','Dianne','Edgar'],
				feat: [
					{
						name:'Frank',
						type: '2D',
						origSlotSize: 1,
					},
					{
						name:'Gracie',
						type: '2D',
						origSlotSize: 1,
					}
				],
			},
			templateInfo: {
				up: {
					selectedTemplateBase: Object.keys(templates.up)[0],
					snapInches: defaultSnapInches,
					adjustments: [],
				},
				down: {
					selectedTemplateBase: Object.keys(templates.down)[0],
					snapInches: defaultSnapInches,
					adjustments: [],
				},
				feat: {
					selectedTemplateBase: Object.keys(templates.feat)[0],
				},
				legacyMode: false, // whether to show the rigid, hand-tuned svg templates or the dynamic svg lines
			},
			meta: {
				appVersion: 'v2',
				querySource: 'loaded data test',
				queryIncomplete: false,
				parseSuccessful: true,
				warnings: [],
			},
		}
	},
	getters: {
		rotation: function (state, getters) {
			return state.current;
		},
		importWarningFromURL: function (state, getters) {
			return state.importWarningFromURL;
		},
		returnTo: function (state, getters) {
			return state.returnTo || null;
		},
		importWarningsGeneric: function (state, getters) {
			return state.current.meta.warnings;
		},
		rotationMatches: function (state, getters) {
			var fullHistory = getters.fullHistory;
			var testRotation = getters.rotation;
			return getRotationMatches(fullHistory, testRotation);
		},
		artists: function (state, getters) {
			return state.current.artists;
		},
		templateInfo: function (state, getters) {
			return state.current.templateInfo;
		},
		rotationLabel: function (state, getters) {
			return state.current.rotationLabel;
		},
		guestCurrentlyExists: function (state, getters) {
			var result = false;
			var artists = getters.artists;
			limitedFloorNames.forEach(function (floor) {
				if (artists[floor].includes('GUEST')) {
					result = true;
				}
			})
			return result;
		},
	},
	mutations: {
		LOAD_ROTATION: function (state, obj) {
			state.current = obj;
		},
		UPDATE_QUERY_OBJECTS: function (state, obj) {
			state.queryObjects = obj;
		},
		UPDATE_ALT_ROTATIONS: function (state, obj) {
			state.altRotations = obj;
		},
		SET_IMPORT_WARNING_FROM_URL: function (state, message) {
			state.importWarningFromURL = message;
		},
		SET_RETURN_TO: function (state, string) {
			state.returnTo = string;
		},
		UDPATE_TEMPLATE_INFO: function (state, obj) {
			state.current.templateInfo = obj;
		},
		UPDATE_LABEL_OBJECT: function (state, data) {
			state.current.rotationLabel = data;
		},
		UPDATE_ARTISTS_OBJECT: function (state, data) {
			state.current.artists = data;
		},
	},
	actions: {
		loadRotation: function (context, obj) {
			context.commit('LOAD_ROTATION', obj);
		},
		setAltRotation: function (context, args) {
			newObject = clone(context.state.altRotations);
			newObject[args.label] = clone(args.rotation);
			context.commit('UPDATE_ALT_ROTATIONS', newObject);
		},
		setImportWarningFromURL: function (context, message) {
			context.commit('SET_IMPORT_WARNING_FROM_URL', message);
		},
		setReturnTo: function (context, message) {
			context.commit('SET_RETURN_TO', message);
		},
		setLegacyMode: function (context, bool) {
			var templateInfo = clone(context.getters.templateInfo);
			templateInfo.legacyMode = bool;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		changeCornerSnapThreshold: function (context, args) {
			var templateInfo = clone(context.getters.templateInfo);
			var floorName = args.floorName;
			var value = args.value;
			templateInfo[floorName].snapInches = value;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		togglelegacyMode: function (context) {
			var templateInfo = clone(context.getters.templateInfo);
			templateInfo.legacyMode = !templateInfo.legacyMode;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		setSelectedTemplateBase: function (context, args) {
			var templateInfo = clone(context.getters.templateInfo);
			var floorName = args.floorName;
			var value = args.value;
			templateInfo[floorName].selectedTemplateBase = value;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		importAdjustments: function (context, data) {
			var templateInfo = clone(context.getters.templateInfo);
			limitedFloorNames.forEach(function (floorName) {
				var halfSlotCount = context.getters.artists[floorName].length;
				context.getters.templateInfo[floorName].adjustments[halfSlotCount] = data[floorName];
			})
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		resetAdjustments: function (context, floorName) {
			var templateInfo = clone(context.getters.templateInfo);
			var halfSlotCount = context.getters.artists[floorName].length;
			var array = clone(templateInfo[floorName].adjustments[halfSlotCount]);
			array.fill(0);
			templateInfo[floorName].adjustments[halfSlotCount] = array;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		updateAdjustments: function (context, data) {
			var templateInfo = clone(context.getters.templateInfo);
			var floorName = data.floorName;
			var newAdjustments = data.adjustments;
			var halfSlotCount = data.halfSlotCount;
			// couldn't figure out how else to trigger observability:
			var adjustments = templateInfo[floorName].adjustments;
			adjustments[halfSlotCount] = newAdjustments;
			templateInfo[floorName].adjustments = adjustments;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		updateLabelObject: function (context, data) {
			context.commit('UPDATE_LABEL_OBJECT', data);
		},
		updateArtistsObject: function (context, data) {
			context.commit('UPDATE_ARTISTS_OBJECT', data);
		},
	},
};

var advancedStore = {
	// concerns the state of the "advanced" (full featured) rotation editor
	state: {
		advancedModeOn: false,
		showCircles: false,
		featuredExtras: true, // featured display speculation stuff
		snapOn: {
			up: true,
			down: true,
		},
		manageLabel: false,
		manageWhich: '',
	},
	getters: {
		manageWhich: function (state, getters) {
			return state.manageWhich;
		},
		manageLabel: function (state, getters) {
			return state.manageLabel;
		},
		showCircles: function (state, getters) {
			return state.showCircles;
		},
		featuredExtras: function (state, getters) {
			return state.featuredExtras;
		}, // TODO: create a way of changing this?
		advancedModeOn: function (state, getters) {
			return state.advancedModeOn;
		},
		snapOn: function (state, getters) {
			return state.snapOn;
		},
	},
	mutations: {
		MANAGE_THIS: function (state, value) {
			state.manageWhich = value;
		},
		SET_MANAGE_LABEL: function (state, bool) {
			state.manageLabel = bool;
		},
		TOGGLE_SNAP_CIRCLES: function (state) {
			state.showCircles = !state.showCircles;
		},
		SET_ADVANCED_MODE: function (state, bool) {
			state.advancedModeOn = bool;
		},
		TOGGLE_ADVANCED_MODE: function (state) {
			state.advancedModeOn = !state.advancedModeOn;
		},
		TOGGLE_CORNER_SNAP: function (state, floorName) {
			var changes = state.snapOn;
			changes[floorName] = !changes[floorName];
			state.snapOn = changes;
		},

	},
	actions: {
		manageThis: function (context, value) {
			context.commit('MANAGE_THIS', value);
		},
		setManageLabel: function (context, bool) {
			context.commit('SET_MANAGE_LABEL', bool);
		},
		toggleSnapCircles: function (context) {
			context.commit('TOGGLE_SNAP_CIRCLES');
		},
		setAdvancedMode: function (context, bool) {
			context.commit('SET_ADVANCED_MODE', bool);
		},
		toggleAdvancedMode: function (context) {
			context.commit('TOGGLE_ADVANCED_MODE');
		},
		toggleCornerSnap: function (context, floorName) {
			context.commit('TOGGLE_CORNER_SNAP', floorName);
		},
	},
};

var store = new Vuex.Store({
	// OG, but should be detangled asap
	modules: {
		history: historyStore,
		wizard: wizardStore,
		loaded: loadedStore,
		advanced: advancedStore,
	},
	state: {
		guestNameString: 'GUEST',
	},
	getters: {
		guestNameString: function (state, getters) {
			return state.guestNameString || 'GUEST';
		},
		templatesToDraw: function (state, getters) {
			return {
				up: templates.up[getters.templateInfo.up.selectedTemplateBase],
				down: templates.down[getters.templateInfo.down.selectedTemplateBase],
				feat: templates.down[getters.templateInfo.down.selectedTemplateBase],
			}
		},
		featLinesTotal: function (state, getters) { // calculates featured space
			return featLinesTotal(getters.templatesToDraw.feat);
		},
		naiveHalfSlotLengths: function (state, getters) {
			return {
				up: getBaselineHalfSlots(getters.templatesToDraw.up, getters.artists.up),
				down: getBaselineHalfSlots(getters.templatesToDraw.down, getters.artists.down),
			};
		},
		naiveHalfSlots: function (state, getters) {
			return {
				up: makeComplexLines(getters.templatesToDraw.up, getters.naiveHalfSlotLengths.up),
				down: makeComplexLines(getters.templatesToDraw.down, getters.naiveHalfSlotLengths.down),
			};
		},
		adjustedHalfSlotLengths: function (state, getters) {
			result = {
				up: getAdjustedHalfSlotLengths(
					getters.templatesToDraw.up,
					getters.artists.up,
					getters.templateInfo.up.adjustments,
				),
				down: getAdjustedHalfSlotLengths(
					getters.templatesToDraw.down,
					getters.artists.down,
					getters.templateInfo.down.adjustments,
				),
			};
			return result;
		},
		adjustedHalfSlots: function (state, getters) {
			return {
				up: makeComplexLines(getters.templatesToDraw.up, getters.adjustedHalfSlotLengths.up),
				down: makeComplexLines(getters.templatesToDraw.down, getters.adjustedHalfSlotLengths.down),
			};
		},
		fusedHalfSlots: function (state, getters) {
			return {
				up: fuseComplexLinesByArtist(getters.adjustedHalfSlots.up),
				down: fuseComplexLinesByArtist(getters.adjustedHalfSlots.down),
			};
		},
		snappedFusedSlots: function (state, getters) {
			var originalSlots = getters.fusedHalfSlots; //!
			var snapOn = getters.snapOn; //!
			var templateInfo = getters.templateInfo; //!
			var snappedSlots = clone(originalSlots);
			limitedFloorNames.forEach(function (floorName) {
				if (snapOn[floorName]) {
					var snapInches = templateInfo[floorName].snapInches
					snappedSlots[floorName] = snapAllShortSegments(
						snappedSlots[floorName],
						inchesToTemplateNumber(snapInches),
						snapPriority[floorName]
					);
				}
			})
			return snappedSlots;
		},
		snappedFusedSlotsFlat: function (state, getters) { // draw the svgs from this
			var snappedFusedSlots = getters.snappedFusedSlots; //!
			var snappedSlots = {}
			limitedFloorNames.forEach(function (floorName) {
				var floorResult = [];
				var lineSegmentFragments = snappedFusedSlots[floorName];
				lineSegmentFragments.forEach(function (lineSegment) {
					lineSegment.forEach(function (line) {
						snappedSlots[floorName] = snappedSlots[floorName] || [];
						floorResult.push(line);
					})
				})
				snappedSlots[floorName] = floorResult;
			})
			return snappedSlots;
		},
		snappedFusedSlotsNeedingLabels: function (state, getters) {
			var lineArrayArray = getters.snappedFusedSlots; //!
			return {
				up: getSnappedFusedSlotsNeedingLabels(lineArrayArray.up),
				down: getSnappedFusedSlotsNeedingLabels(lineArrayArray.down),
			};
		},
		artistPar: function (state, getters) {
			var artists = getters.artists; //!
			var naiveHalfSlotLengths = getters.naiveHalfSlotLengths; //!
			var snappedFusedSlotsFlat = getters.snappedFusedSlotsFlat; //!
			var result = {
				up: {},
				down: {},
			};
			limitedFloorNames.forEach(function (floorName) {
				var floorResult = getArtistsPar(
					artists[floorName],
					naiveHalfSlotLengths[floorName][0].size,
					snappedFusedSlotsFlat[floorName]
				);
				result[floorName] = floorResult;
			})
			return result;
		},
		compactEverything: function (state, getters) {
			var rotation = clone(getters.rotation);
			return compactEverything(rotation);
		},
		compactURL: function (state, getters) {
			return generateURLFromCompactEverything(getters.compactEverything);
		},
	},
	mutations: {},
	actions: {},
});
