var historyStore = {
	// concerns the table of artist history in their slots
	// and how it looks: what's highlighted, etc
	state: { // get this at (e.g.) this.$store.history.fullHistory
		fullHistory: makeFullHistory(),
		selectedFloor: 'up',
		highlightedName: '',
		insertName: '',
	},
	getters: {
		fullHistory: function (state) {
			return state.fullHistory;
		},
		practicalHistory: function (state) {
			return state.fullHistory; // TODO figure this part out properly
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
			var fullHistoryArray = JSON.parse(JSON.stringify(context.state.fullHistory));
			fullHistoryArray = sortHistoryRecords(fullHistoryArray);
			context.commit('HISTORY_SET_FULL_HISTORY', fullHistoryArray);
		},
		historyAddSingleHistoryItem: function (context, newHistoryItem) {
			var fullHistoryArray = JSON.parse(JSON.stringify(context.state.fullHistory));
			var duplicate = detectDuplicateRecord(fullHistoryArray, newHistoryItem);
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
		quizAnswers: JSON.parse(JSON.stringify(defaultQuizAnswers)),
		// INSERTION STUFF BELOW
		placedNames: {
			up: [],
			down: [],
		},
		quizResults: {},
	},
	getters: {
		originalRotation: function (state, getters) {
			return getters.rotation;
		},
		currentQuizQuestion: function (state) {
			return wizardQuiz[state.currentQuestionIndex];
		},
		currentForm: function (state, getters) {
			return getters.currentQuizQuestion.formName;
		},
		// INSERTION STUFF BELOW
		autoInsertGuest: function (state, getters) {
			return state.guest.present && !state.guest.withFeatured;
		},
		quizResultsSlotCounts: function (state, getters) {
			var tally = {
				up: 0,
				down: 0,
			};
			var quizResults = state.quizResults;
			Object.keys(tally).forEach(function (floor) {
				quizResults[floor].forEach(function (artist) {
					tally[floor] += artist.slotSize;
				})
			})
			return tally;
		},
		namesToSlotSizes: function (state, getters) {
			var result = {};
			var potential = state.quizResults;
			limitedFloorNames.forEach(function (floor) {
				potential[floor].forEach(function (artist) {
					result[artist.name] = artist.slotSize;
				})
			})
			return result;
		},
		rawUnplacedNames: function (state, getters) {
			var unplaced = {
				'up': [],
				'down': [],
			}
			var potentialState = state.quizResults;
			limitedFloorNames.forEach(function (floor) {
				potentialState[floor].forEach(function (item) {
					var displayName = makePrintName(item.name, item.slotSize);
					var insert = {
						name: item.name,
						displayName: displayName,
						slotSize: item.slotSize,
					};
					unplaced[floor].push(insert);
				})
			})
			return unplaced;
		},
		filteredUnplacedNames: function (state, getters) {
			var orig = JSON.parse(JSON.stringify(getters.rawUnplacedNames));
			var placedNames = JSON.parse(JSON.stringify(state.placedNames));
			var filtered = {
				'up': [],
				'down': [],
			}
			limitedFloorNames.forEach(function (floor) {
				orig[floor].forEach(function (item) {
					if (!placedNames[floor].includes(item.name)){
						filtered[floor].push(item);
					}
				})
			})
			return filtered;
		},
	},
	mutations: {
		WIZARD_SET_CURRENT_QUESTION_INDEX: function (state, value) {
			state.currentQuestionIndex = value;
		},
		WIZARD_SET_QUIZ_ANSWER: function (state, args) {
			var result = JSON.parse(JSON.stringify(state.quizAnswers));
			result[args.name] = args.value;
			state.quizAnswers = result;
		},
		WIZARD_ASSIGN_LIMBO_TO_FLOOR: function (state, args) {
			var result = JSON.parse(JSON.stringify(state.quizAnswers));
			result.newArtistsNewFloor[args.name] = args.floor;
			state.quizAnswers = result;
		},
		WIZARD_TOGGLE_DEPARTURE_BY_NAME: function (state, name) {
			var result = state.quizAnswers.departingArtists.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			state.quizAnswers.departingArtists = result;
		},
		WIZARD_TOGGLE_ARRIVAL_BY_NAME: function (state, name) {
			var result = state.quizAnswers.arrivingArtists.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			state.quizAnswers.arrivingArtists = result;
		},
		WIZARD_TOGGLE_SLOT_SIZE_CHANGE_BY_NAME: function (state, name) {
			var result = state.quizAnswers.artistSlotSizeChanges.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			state.quizAnswers.artistSlotSizeChanges = result;
		},
		WIZARD_TOGGLE_FLOOR_OVERRIDE_BY_NAME: function (state, name) {
			var result = state.quizAnswers.artistFloorAssignmentOverrides.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			state.quizAnswers.artistFloorAssignmentOverrides = result;
		},
		WIZARD_SUBMIT_QUIZ_RESULTS: function (state, object) {
			state.placedNames = { up: [], down: [] };
			state.quizResults = object;
		},
		// INSERTION STUFF BELOW
		WIZARD_SET_PLACED_NAMES: function (state, obj) {
			state.placedNames = obj;
		},
		WIZARD_RESET_PLACED_NAMES: function (state, floor) {
			state.placedNames[floor] = [];
		},
	},
	actions: {
		wizardSetCurrentQuestionIndex: function (context, value) {
			context.commit('WIZARD_SET_CURRENT_QUESTION_INDEX', value);
		},
		wizardSetQuizAnswer: function (context, args) {
			context.commit('WIZARD_SET_QUIZ_ANSWER', args);
		},
		wizardSetQuizAnswerBool: function (context, args) {
			var newValue = args.value;
			if (newValue === 'true') { newValue = true };
			if (newValue === 'false') { newValue = false };
			context.commit('WIZARD_SET_QUIZ_ANSWER', {
				name: args.name,
				value: newValue,
			});
		},
		wizardResetQuizAnswer: function (context, name) {
			var newValue = defaultQuizAnswers[name];
			context.commit('WIZARD_SET_QUIZ_ANSWER', {
				name: name,
				value: newValue,
			});
		},
		wizardToggleDepartureByName: function (context, name) {
			context.commit('WIZARD_TOGGLE_DEPARTURE_BY_NAME', name);
		},
		wizardToggleArrivalByName: function (context, name) {
			context.commit('WIZARD_TOGGLE_ARRIVAL_BY_NAME', name);
		},
		wizardToggleSlotSizeChangeByName: function (context, name) {
			context.commit('WIZARD_TOGGLE_SLOT_SIZE_CHANGE_BY_NAME', name);
		},
		wizardToggleFloorOverrideByName: function (context, name) {
			context.commit('WIZARD_TOGGLE_FLOOR_OVERRIDE_BY_NAME', name);
		},
		wizardAssignLimboToFloor: function (context, args) {
			context.commit('WIZARD_ASSIGN_LIMBO_TO_FLOOR', args);
		},
		wizardSubmitQuizResults: function (context, object) {
			context.commit('WIZARD_SUBMIT_QUIZ_RESULTS', object);
		},
		// INSERTION STUFF BELOW
		wizardSetPlacedNames: function (context, obj) {
			context.commit('WIZARD_SET_PLACED_NAMES', obj);
		},
		wizardResetPlacedNames: function (context, floor) {
			context.commit('WIZARD_RESET_PLACED_NAMES',floor);
		},
	},
};

var loadedStore = {
	// contains a complete rotation object to treat as "loaded"
	// but should also contain "backup" info, like what the
	// original query was, or other queries / rotation objects
	// of interest
	state: {
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
		importWarningsGeneric: function (state, getters) {
			return state.current.meta.warnings;
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
			newObject = JSON.parse(JSON.stringify(context.state.altRotations));
			newObject[args.label] = JSON.parse(JSON.stringify(args.rotation));
			context.commit('UPDATE_ALT_ROTATIONS', newObject);
		},
		setImportWarningFromURL: function (context, message) {
			context.commit('SET_IMPORT_WARNING_FROM_URL', message);
		},
		setLegacyMode: function (context, bool) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			templateInfo.legacyMode = bool;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		changeCornerSnapThreshold: function (context, args) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			var floorName = args.floorName;
			var value = args.value;
			templateInfo[floorName].snapInches = value;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		togglelegacyMode: function (context) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			templateInfo.legacyMode = !templateInfo.legacyMode;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		setSelectedTemplateBase: function (context, args) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			var floorName = args.floorName;
			var value = args.value;
			templateInfo[floorName].selectedTemplateBase = value;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		importAdjustments: function (context, data) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			limitedFloorNames.forEach(function (floorName) {
				var halfSlotCount = context.getters.artists[floorName].length;
				context.getters.templateInfo[floorName].adjustments[halfSlotCount] = data[floorName];
			})
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		resetAdjustments: function (context, floorName) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
			var halfSlotCount = context.getters.artists[floorName].length;
			var array = JSON.parse(JSON.stringify(templateInfo[floorName].adjustments[halfSlotCount]));
			array.fill(0);
			templateInfo[floorName].adjustments[halfSlotCount] = array;
			context.commit('UDPATE_TEMPLATE_INFO', templateInfo);
		},
		updateAdjustments: function (context, data) {
			var templateInfo = JSON.parse(JSON.stringify(context.getters.templateInfo));
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
			var snappedSlots = JSON.parse(JSON.stringify(originalSlots));
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
				var lineSegmentFragments = snappedFusedSlots[floorName];
				lineSegmentFragments.forEach(function (lineSegment) {
					lineSegment.forEach(function (line) {
						snappedSlots[floorName] = snappedSlots[floorName] || [];
						snappedSlots[floorName].push(line);
					})
				})
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
			var fancy = {
				up: makeFloorFancy(artists.up),
				down: makeFloorFancy(artists.down),
			};
			var result = {
				up: {},
				down: {},
			};
			limitedFloorNames.forEach(function (floorName) {
				Object.values(fancy[floorName]).forEach(function (artist) {
					result[floorName][artist.name] = result[floorName][artist.name] || {};
					var artistResult = result[floorName][artist.name];
					var slotSize = artistResult.slotSize || 0;
					slotSize += artist.slotSize;
					artistResult.slotSize = slotSize;
				})
			})
			var halfSlotSize = {
				up: naiveHalfSlotLengths.up[0].size,
				down: naiveHalfSlotLengths.down[0].size,
			}
			limitedFloorNames.forEach(function (floorName) {
				var floor = snappedFusedSlotsFlat[floorName];
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
		compactEverything: function (state, getters) {
			var rotation = JSON.parse(JSON.stringify(getters.rotation));
			return compactEverything(rotation);
		},
		compactURL: function (state, getters) {
			return generateURLFromCompactEverything(getters.compactEverything);
		},
	},
	mutations: {},
	actions: {},
});
