var historyStore = {
	state: { // get this at (e.g.) this.$store.history.fullHistory
		fullHistory: makeFullHistory(),
		selectedFloor: 'up',
		highlightedName: '',
		insertName: '',
	},
	mutations: {
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
		originalRotation: function (state, getters, rootState) {
			return rootState.loaded.rotation;
		},
		originalLongLabel: function (state, getters, rootState) {
			return getLongLabel(rootState.loaded.rotation.rotationLabel);
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
					var displayName = item.name;
					var displaySlotSize = item.slotSize + '';
					if (displaySlotSize !== '1') {
						displaySlotSize = displaySlotSize
							.replace('.5', '½')
							.replace('0', '');
						displayName = displayName +
							' (' + displaySlotSize + ')';
					}			
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
	state: {
		rotation: {
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
		originalFancyArtists: function (state, getters, rootState) {
			var rotationObject = rootState.loaded.rotation;
			return {
				up: makeFloorFancy(rotationObject.artists.up),
				down: makeFloorFancy(rotationObject.artists.down),
				feat: JSON.parse(JSON.stringify(rotationObject.artists.feat)),
			};
		},
	},
	mutations: {},
	actions: {},
};

var store = new Vuex.Store({
	modules: {
		history: historyStore,
		wizard: wizardStore,
		loaded: loadedStore,
	},
	state: {
		advanced: {
			advancedModeOn: false,
			showCircles: false,
			featuredExtras: false, // featured display speculation stuff
			snapOn: {
				up: true,
				down: true,
			},
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
			return getLongLabel(state.rotationLabel);
		},
		fancyArtists: function (state) {
			return {
				up: makeFloorFancy(state.artists.up),
				down: makeFloorFancy(state.artists.down),
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
		featLineSegments: function (state) {
			return templates.feat[state.templateInfo.feat.selectedTemplateBase];
		},
		featLinesTotal: function (state, getters) {
			var rawLines = getters.featLineSegments;
			var rawSum = rawLines.map(function (rawLine) {
				return getLengthFromLineCoords(rawLine);
			});
			var result = rawSum.reduce(function (prev, cur) {
				return prev + cur;
			});
			return result;
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
			limitedFloorNames.forEach(function (floorName) {
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
			limitedFloorNames.forEach(function (floorName) {
				if (state.advanced.snapOn[floorName]) {
					snappedSlots[floorName] = snapAllShortSegments(
						snappedSlots[floorName],
						inchesToTemplateNumber(state.templateInfo[floorName].snapInches),
						snapPriority[floorName]
					);
				}
			})
			return snappedSlots;
		},
		snappedFusedSlotsFlat: function (state, getters) { // draw the svgs from this
			var snappedSlots = {}
			limitedFloorNames.forEach(function (floorName) {
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
		snappedFusedSlotsNeedingLabels: function (state, getters) {
			var lineArrayArray = getters.snappedFusedSlots;
			var result = {};
			limitedFloorNames.forEach(function (floorName) {
				floorResults = [];
				lineArrayArray[floorName].forEach(function (lines) {
					if (lines.length > 1) {
						var longLine = reconstructOrigLine(lines);
						var workingLines = lines.map(function (line) {
							return measureLineAgainstLongLine(line, longLine);
						});
						while (workingLines.length > 1) {
							var indexOfShortest = -1;
							var valueOfShortest = Infinity;
							var topOrBot = '';
							Object.values(workingLines).forEach(function (line, index) {
								if (
									line.topDistance < valueOfShortest
									|| line.botDistance < valueOfShortest
								) {
									topOrBot = line.topDistance > line.botDistance ? 'bot' : 'top';
									var label = topOrBot + 'Distance';
									valueOfShortest = line[label];
									indexOfShortest = index;
								}
							})
							var insert = workingLines.splice(indexOfShortest,1)[0];
							insert.labelLine = topOrBot === 'top' ? insert.topTestLine : insert.botTestLine;
							insert.labelDistance = valueOfShortest;
							floorResults.push(insert);
						}
					}
				})
				result[floorName] = floorResults;
			})
			return result;
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
			limitedFloorNames.forEach(function (floorName) {
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
				'&u=' + up +
				'&d=' + down;
			if (state.artists.feat.length > 0) {
				result += '&f=' + feat;
			}
			// flags stuff -- DETECT LEGACY MODE HERE
			var flags = [];
			if (state.templateInfo.legacyMode === false) {
				flags.push('v2');
			}
			var snapUp = parseInt(state.templateInfo.up.snapInches,10);
			var snapDown = parseInt(state.templateInfo.down.snapInches,10);
			if (
				snapUp !== defaultSnapInches
				|| snapDown !== defaultSnapInches
			) {
				var snaps = 'snap' + snapUp + '-' + snapDown;
				flags.push(snaps);
			}
			if (flags.length > 0) {
				var joinedFlags = flags.join(',');
				result += '&x=' + joinedFlags;
			}
			// if legacy mode is used, ignore custom template selection and adjustments:
			if (flags.includes('v2')) {
				// custom template selection:
				var t = {};
				limitedFloorNames.forEach(function (floorName) {
					var shortName = 't' + floorName[0];
					var selected = state.templateInfo[floorName].selectedTemplateBase
					var defaultTemplate = Object.keys(templates[floorName])[0];
					if (
						selected !== defaultTemplate
					) {
						t[shortName] = selected;
					}
				})
				if (t.tu || t.td) {
					tu = t.tu || '',
					td = t.td || '',
					result += '&t=' + tu + ',' + td;
				}
				// custom adjustments:
				limitedFloorNames.forEach(function (floorName) {
					var halfSlotCount = state.artists[floorName].length;
					var shortName = 'a' + floorName[0];
					var adjustments = state.templateInfo[floorName].adjustments[halfSlotCount];
					var shortValue = makeAdjustmentsCompact(adjustments);
					if (shortValue.length > 0) {
						result += '&' + shortName + '=' + shortValue;
					}
				})
			}
			result = makeSpacesUnderscores(result)
			return result;
		},
		compactURL: function (state, getters) {
			var prefix = "https://marycjenkinsart.github.io/local-colors-slot-manager/"
			var infix = "?v2";
			// the "infix" does nothing apart from ensuring the client treats the URL as a fresh destination
			// otherwise caches can interfere with the preview's apperance (without anything appearing to be broken)
			// VERY IMPORTANT:
			// if something changes in the app that has the potential to change the preview, iterate the infix!!
			var suffix = "#/view?"
			return prefix + infix + suffix + getters.compactEverything;
		},
	},
	mutations: {
		// this is what actually changes the state
		SET_LEGACY_MODE: function (state, bool) {
			state.templateInfo.legacyMode = bool;
			// TODO: rename things to be more consistent, e.g. this one and the below
		},
		TOGGLE_RIGID_VIEW: function (state) {
			state.templateInfo.legacyMode = !state.templateInfo.legacyMode;
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
			state.advanced.snapOn[floorName] = !state.advanced.snapOn[floorName];
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
		RESET_ADJUSTMENTS: function (state, floorName) {
			var halfSlotCount = state.artists[floorName].length;
			var array = JSON.parse(JSON.stringify(state.templateInfo[floorName].adjustments[halfSlotCount]));
			array.fill(0);
			state.templateInfo[floorName].adjustments[halfSlotCount] = array;
		},
		IMPORT_ADJUSTMENTS: function (state, data) {
			limitedFloorNames.forEach(function (floorName) {
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
		setLegacyMode: function (context, bool) {
			context.commit('SET_LEGACY_MODE', bool);
		},
		setAdvancedMode: function (context, bool) {
			context.commit('SET_ADVANCED_MODE', bool);
		},
		toggleAdvancedMode: function (context) {
			context.commit('TOGGLE_ADVANCED_MODE');
		},
		togglelegacyMode: function (context) {
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
		resetAdjustments: function (context, floorName) {
			context.commit('RESET_ADJUSTMENTS', floorName);
		},
		importAdjustments: function (context, data) {
			context.commit('IMPORT_ADJUSTMENTS', data);
		},
		updateAdjustments: function (context, data) {
			context.commit('UPDATE_ADJUSTMENTS', data);
		},
	},
});
