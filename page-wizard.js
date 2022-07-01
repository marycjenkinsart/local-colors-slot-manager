var wizardPage = Vue.component('wizard', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {
			wizardQuizChapters: makeWizardQuizChapters(),
			newArtistName: '',
		}
	},
	computed: {
		swapFloors: {
			get() { return this.$store.state.wizard.quizAnswers.swapFloors; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswerBool', {
					name: 'swapFloors',
					value: value
				});
			},
		},
		guestPresent: {
			get() { return this.$store.state.wizard.quizAnswers.guestPresent; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswerBool', {
					name: 'guestPresent',
					value: value
				});
			},
		},
		guestSharesFeatured: {
			get() { return this.$store.state.wizard.quizAnswers.guestSharesFeatured; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswerBool', {
					name: 'guestSharesFeatured',
					value: value
				});
			},
		},
		featuredType: {
			get() { return this.$store.state.wizard.quizAnswers.featuredType; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswer', {
					name: 'featuredType',
					value: value
				});
			},
		},
		featured2DName: {
			get() { return this.$store.state.wizard.quizAnswers.featured2DName; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswer', {
					name: 'featured2DName',
					value: value
				});
			},
		},
		featured3DName: {
			get() { return this.$store.state.wizard.quizAnswers.featured3DName; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswer', {
					name: 'featured3DName',
					value: value
				});
			},
		},
		featuredGroupTheme: {
			get() { return this.$store.state.wizard.quizAnswers.featuredGroupTheme; },
			set(value) {
				this.$store.dispatch('wizardSetQuizAnswer', {
					name: 'featuredGroupTheme',
					value: value
				});
			},
		},
		currentForm: function () {
			return this.$store.getters.currentForm;
		},
		originalFancyArtists: function () {
			return this.$store.getters.originalFancyArtists;
		},
		displayFancyArtists: function () {
			var fancyObject = JSON.parse(JSON.stringify(this.originalFancyArtists));
			var result = {};
			limitedFloorNames.forEach(function (floorName) {
				var floorObject = JSON.parse(JSON.stringify(fancyObject[floorName]));
				var currArtist = floorObject.shift();
				var floorString = makePrintName(currArtist.name, currArtist.slotSize);
				floorObject.forEach(function (artistObject) {
					floorString += ', ' + makePrintName(artistObject.name, artistObject.slotSize);
				})
				result[floorName] = floorString;
			})
			var featString = '';
			fancyObject.feat.forEach(function (featuredArtist) {
				if (featString.length > 0) {
					featString += ', ';
				}
				featString += makeFeaturedPrintName(featuredArtist.name, featuredArtist.type);
			})
			result.feat = featString;
			return result;
		},
		currentQuestionIndex: function () {
			return this.$store.state.wizard.currentQuestionIndex;
		},
		currentQuestion: function () {
			return this.$store.getters.currentQuizQuestion;
		},
		dummyTrue: function () {
			return true;
		},
		dummyFalse: function () {
			return false;
		},
		guestArtistBranch: function () {
			var defaultGoTo = 40;
			var extraQGoTo = 31;
			var doExtraQ = this.$store.state.wizard.quizAnswers.guestPresent;
			return doExtraQ ? extraQGoTo : defaultGoTo;
		},
		featuredArtistBranch: function () {
			var result = 50;
			var type = this.$store.state.wizard.quizAnswers.featuredType;
			if (type === '2D') {
				result = 41;
			} else if (type === '3D') {
				result = 43;
			} else if (type === 'group') {
				result = 44;
			}
			return result;
		},
		limboArtistsBranch: function () {
			var defaultGoTo = 90;
			var extraQGoTo = 80;
			return this.limboLists.limbo.length === 0 ? defaultGoTo : extraQGoTo;
		},
		featArtistIsSet2D: function () {
			return !!this.$store.state.wizard.quizAnswers.featured2DName;
		},
		featArtist3DForbiddenReport: function () {
			return forbiddenAnalysis(this.featured3DName);
		},
		featArtist3DValidated: function () {
			var noForbiddenChars = this.featArtist3DForbiddenReport.valid;
			return this.featured3DName && noForbiddenChars;
		},
		featArtist3DValidationMessage: function () {
			var result = '';
			if (!this.featArtist3DValidated) {
				result = this.featArtist3DForbiddenReport.message || 'Name cannot be empty!';
			}
			return result;
		},
		newArtistsFloorIsSet: function () {
			return this.limboLists.limbo.length === 0;
		},
		allFreeUpstairsNamesPlaced: function () {
			var filteredUnplacedNames = this.$store.getters.filteredUnplacedNames;
			return !filteredUnplacedNames.up.length;
		},
		allFreeDownstairsNamesPlaced: function () {
			var filteredUnplacedNames = this.$store.getters.filteredUnplacedNames;
			return !filteredUnplacedNames.down.length;
		},
		groupThemeForbiddenReport: function () {
			return forbiddenAnalysis(this.featuredGroupTheme);
		},
		groupThemeValidated: function () {
			return this.groupThemeForbiddenReport.valid;
		},
		groupThemeValidationMessage: function () {
			return !this.groupThemeValidated ? this.groupThemeForbiddenReport.message : '';
		},
		newArtistNameForbiddenReport: function () {
			var result = forbiddenAnalysis(this.newArtistName);
			return result;
		},
		newArtistNameValidated: function () {
			return this.newArtistName && this.newArtistNameForbiddenReport.valid;
		},
		newArtistValidationMessage: function () {
			return !this.newArtistNameValidated ? this.newArtistNameForbiddenReport.message : '' ;
		},
		originalRotation: function () {
			return this.$store.getters.originalRotation;
		},
		originalLongLabel: function () {
			return this.$store.getters.originalLongLabel;
		},
		workingRotation: function () {
			var orig = this.originalRotation;
			var working = JSON.parse(JSON.stringify(orig));
			working.quizResults = {};
			working.quizOptions = {};
			var rawMergedMonth = this.$store.state.wizard.quizAnswers.rotationMergedMonth;
			// set working label
			working.rotationLabel.mergedMonth =
				rawMergedMonth ? rawMergedMonth : orig.rotationLabel.mergedMonth;
			working.rotationLabel.year = Math.floor(working.rotationLabel.mergedMonth / 12);
			working.rotationLabel.month = working.rotationLabel.mergedMonth % 12;
			if (working.rotationLabel.month === 0) {
				working.rotationLabel.year -= 1;
				working.rotationLabel.month = 12;
			}
			// swap floors
			var swapFloors = this.$store.state.wizard.quizAnswers.swapFloors;
			if (swapFloors) {
				var swap = working.artists.up;
				working.artists.up = working.artists.down;
				working.artists.down = swap;
			}
			// excise GUEST if present
			working.artists.up = working.artists.up.filter(function (item) {
				return item !== 'GUEST';
			})
			working.artists.down = working.artists.down.filter(function (item) {
				return item !== 'GUEST';
			})
			// 2D featured options
			var featured2DOptions = {
				up: working.artists.up.filter(getUnique),
				down: working.artists.down.filter(getUnique),
			};
			// making fancy featured info
			var featuredType = this.$store.state.wizard.quizAnswers.featuredType;
			var featured2DName = this.$store.state.wizard.quizAnswers.featured2DName;
			var featured3DName = this.$store.state.wizard.quizAnswers.featured3DName;
			var featuredGroupTheme = this.$store.state.wizard.quizAnswers.featuredGroupTheme;
			var newFeatured = orig.artists.feat;
			if (featuredType === '2D' && featured2DName) {
				var preFeaturedCount = working.artists.up.length + working.artists.down.length;
				working.artists.up = working.artists.up.filter(function (item) {
					return item !== featured2DName;
				})
				working.artists.down = working.artists.down.filter(function (item) {
					return item !== featured2DName;
				})
				var postFeaturedCount = working.artists.up.length + working.artists.down.length;
				var featuredCountDif = (preFeaturedCount - postFeaturedCount);
				newFeatured = [{
					name: featured2DName,
					type: '2D',
					origSlotSize: featuredCountDif / 2,
				}];
			} else if (featuredType === '3D' && featured3DName) {
				newFeatured = [{
					name: featured3DName,
					type: '3D',
				}];
			} else if (featuredType === 'group') {
				newFeatured = [{
					name: featuredGroupTheme || 'no theme',
					type: 'group',
				}];
			}
			// making advanced artist info for various other steps
			var fusedArtistTable = [];
			if (featuredType !== 'same') {
				working.artists.feat.forEach(function (artist) {
					if (artist.type === '2D') {
						fusedArtistTable[artist.name] = {
							name: artist.name,
							slotSize: artist.origSlotSize,
							displaySlotSize: makeSlotCountPretty(artist.origSlotSize),
							location: 'limbo',
						}
					}
				})
			}
			limitedFloorNames.forEach(function (floorName) {
				working.artists[floorName].forEach(function (artistName) {
					if (fusedArtistTable[artistName]) {
						fusedArtistTable[artistName].slotSize += 0.5;
						fusedArtistTable[artistName].displaySlotSize =
							makeSlotCountPretty(fusedArtistTable[artistName].slotSize);
					} else {
						fusedArtistTable[artistName] = {
							name: artistName,
							slotSize: 0.5,
							displaySlotSize: makeSlotCountPretty(0.5),
							location: floorName,
						}
					}
				})
			})
			// quiz options: departing artists
			// var departingArtists = this.$store.state.wizard.quizAnswers.departingArtists;
			var departingOptions = Object.keys(fusedArtistTable)
				.filter(getUnique)
				// .filter(function (item) {
				// 	return !departingArtists.includes(item);
				// });
			// inserting artists that are in limbo
			var arrivingArtists = this.$store.state.wizard.quizAnswers.arrivingArtists;
			arrivingArtists.forEach(function (artistName) {
				fusedArtistTable[artistName] = {
					name: artistName,
					slotSize: 1,
					displaySlotSize: '1',
					location: 'limbo',
				}
			})
			// slot size changes
			var origSlotSizeOptions = {};
			Object.keys(fusedArtistTable).forEach(function (artistName) {
				origSlotSizeOptions[artistName] = fusedArtistTable[artistName].slotSize;
			})
			var artistSlotSizeChanges = this.$store.state.wizard.quizAnswers.artistSlotSizeChanges;
			Object.keys(fusedArtistTable).forEach(function (artistName) {
				if (artistSlotSizeChanges.includes(artistName)) {
					var currSlotSize = fusedArtistTable[artistName].slotSize;
					fusedArtistTable[artistName].slotSize = currSlotSize === 1 ? 0.5 : 1;
					fusedArtistTable[artistName].displaySlotSize =
						makeSlotCountPretty(fusedArtistTable[artistName].slotSize);
				}
			})
			var slotSizeOptions = {};
			Object.keys(fusedArtistTable).forEach(function (artistName) {
				slotSizeOptions[artistName] = fusedArtistTable[artistName].slotSize;
			})
			// settling limbo stuff
			var origLimboLists = {
				limbo: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'limbo';
				}),
				up: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'up';
				}),
				down: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'down';
				}),
			};
			var limboAssignments = this.$store.state.wizard.quizAnswers.newArtistsNewFloor
			Object.keys(limboAssignments).forEach(function (artistName) {
				fusedArtistTable[artistName].location = limboAssignments[artistName];
			})
			var limboLists = {
				limbo: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'limbo';
				}),
				up: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'up';
				}),
				down: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'down';
				}),
			};
			// finall, floor assignment overrides
			var overrides = this.$store.state.wizard.quizAnswers.artistFloorAssignmentOverrides;
			overrides.forEach(function (artistName) {
				var origLocation = fusedArtistTable[artistName].location;
				fusedArtistTable[artistName].location =
					origLocation === 'up' ? 'down' : 'up';
			})
			var afterOverridesList = {
				up: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'up';
				}),
				down: Object.keys(fusedArtistTable)
				.filter(function (item) {
					return fusedArtistTable[item].location === 'down';
				})
			};
			// putting everything together for the return statement
			working.fusedArtistTable = fusedArtistTable;
			working.quizOptions = {
				featured2DOptions: featured2DOptions,
				departingOptions: departingOptions,
				slotSizeOptions: slotSizeOptions,
				origSlotSizeOptions: origSlotSizeOptions,
				origLimboLists: origLimboLists,
				limboLists: limboLists,
				afterOverridesList: afterOverridesList,
			};
			// ...setting up remaining quiz results...
			var guestPresent = this.$store.state.wizard.quizAnswers.guestPresent;
			var guestSharesFeatured = this.$store.state.wizard.quizAnswers.guestSharesFeatured;
			working.quizResults.insertGuest = guestPresent && !guestSharesFeatured;
			working.quizResults.feat = newFeatured;
			working.quizResults.up = [];
			working.quizResults.down = [];
			Object.values(fusedArtistTable).forEach(function (object) {
				if (object.location === 'up' || object.location === 'down') {
					working.quizResults[object.location].push(object);
				}
			})
			return working;
			// yet TODO:
			// auto version increment (must check with history)
		},
		insertGuest: function () {
			return this.workingRotation.quizResults.insertGuest;
		},
		departingArtistsString: function () {
			var departing = this.$store.state.wizard.quizAnswers.departingArtists;
			return departing.length > 0 ? departing.join(', ') : 'no one';
		},
		departingCheckboxes: function () {
			var result = {};
			var departing = this.$store.state.wizard.quizAnswers.departingArtists;
			var options = this.workingRotation.quizOptions.departingOptions || [];
			options.forEach(function (artistName) {
				result[artistName] = false;
				if (departing.includes(artistName)) {
					result[artistName] = true;
				}
			})
			return result;
		},
		arrivingArtists: function () {
			return this.$store.state.wizard.quizAnswers.arrivingArtists || [];
		},
		artistSlotSizeChanges: function () {
			return this.$store.state.wizard.quizAnswers.artistSlotSizeChanges || [];
		},
		slotSizeOptions: function () {
			return this.workingRotation.quizOptions.slotSizeOptions;
		},
		origSlotSizeOptions: function () {
			return this.workingRotation.quizOptions.origSlotSizeOptions;
		},
		limboLists: function () {
			return this.workingRotation.quizOptions.limboLists;
		},
		limboSlotTotals: function () {
			var result = { up: 0, down: 0 };
			var selfself = this;
			limitedFloorNames.forEach(function (floorName) {
				selfself.limboLists[floorName].forEach(function (artistName) {
					result[floorName] += selfself.slotSizeOptions[artistName] || 1;
				})
			})
			if (this.insertGuest) {
				result.up += 0.5;
			}
			return result;
		},
		origLimboLists: function () {
			return this.workingRotation.quizOptions.origLimboLists;
		},
		origLimboStrings: function () {
			var selfself = this;
			var upString = this.origLimboLists.up
				.map(function (artistName) {
					var slotSize = selfself.slotSizeOptions[artistName] || 1;
					return (makePrintName(artistName, slotSize));
				})
				.join(', ');
			var downString = this.origLimboLists.down
				.map(function (artistName) {
					var slotSize = selfself.slotSizeOptions[artistName] || 1;
					return (makePrintName(artistName, slotSize));
				})
				.join(', ');
			var result = {
				up: upString,
				down: downString,
			};
			if (this.insertGuest) {
				result.up = makePrintName('GUEST', 0.5) + ', ' + result.up;
			}
			return result;
		},
		addedLimboLists: function () {
			var orig = this.workingRotation.quizOptions.origLimboLists;
			var working = this.workingRotation.quizOptions.limboLists;
			var findAdded = function (arrayOrig, arrayIncreased) {
				return arrayIncreased.filter(function (testName) {
					return !arrayOrig.includes(testName);
				})
			}
			return {
				up: findAdded(orig.up, working.up) || [],
				down: findAdded(orig.down, working.down) || [],
			};
		},
		afterOverridesFeaturedString: function () {
			var result = [];
			this.workingRotation.quizResults.feat.forEach(function (artist) {
				result.push(makeFeaturedPrintName(artist.name, artist.type));
			})
			return result.join(', ');
		},
		afterOverridesList: function () {
			return this.workingRotation.quizOptions.afterOverridesList;
		},
		afterOverridesSlotTotals: function () {
			var result = { up: 0, down: 0 };
			var selfself = this;
			limitedFloorNames.forEach(function (floorName) {
				selfself.afterOverridesList[floorName].forEach(function (artistName) {
					result[floorName] += selfself.slotSizeOptions[artistName] || 1;
				})
			})
			if (this.insertGuest) {
				result.up += 0.5;
			}
			return result;
		},
	},
	methods: {
		self: function () {
			return this;
		}, // Stack overflow magic
		resetQuizAnswerByName: function (name) {
			this.$store.dispatch('wizardResetQuizAnswer', name);
		},
		initializeQ: function () {
			var selfself = this;
			this.currentQuestion.dataNames.forEach(function (item) {
				selfself.resetQuizAnswerByName(item);
			})
			this.currentQuestion.alsoReset.forEach(function (item) {
				selfself.resetQuizAnswerByName(item);
			})
		},
		attemptNavButton: function (action, goTo, goToComputed) {
			if (goToComputed) {
				goTo = this[goToComputed];
			}
			var qIndex = getQuizIndexFromID(goTo);
			this.$store.dispatch('wizardSetCurrentQuestionIndex', qIndex);
			this[action]();
		},
		lockAnswers: function () {
			// Guess I dont need this?
		},
		incrementMergedMonth: function () {
			var newValue = this.workingRotation.rotationLabel.mergedMonth + 1;
			this.$store.dispatch('wizardSetQuizAnswer',  {
				name: 'rotationMergedMonth',
				value: newValue,
			})
		},
		decrementMergedMonth: function () {
			var newValue = this.workingRotation.rotationLabel.mergedMonth - 1;
			this.$store.dispatch('wizardSetQuizAnswer',  {
				name: 'rotationMergedMonth',
				value: newValue,
			})
		},
		toggleDeparture: function (name) {
			this.$store.dispatch('wizardToggleDepartureByName', name)
		},
		toggleArrival: function (name) {
			this.$store.dispatch('wizardToggleArrivalByName', name)
		},
		toggleSlotSizeChange: function (name) {
			this.$store.dispatch('wizardToggleSlotSizeChangeByName', name)
		},
		toggleFloorOverride: function (name) {
			this.$store.dispatch('wizardToggleFloorOverrideByName', name)
		},
		submitNewArtistName: function () {
			var artistName = this.newArtistName;
			if (!this.arrivingArtists.includes(artistName)) {
				this.toggleArrival(artistName);
			}
			this.newArtistName = '';
		},
		assignLimboToFloor: function (name, floor) {
			this.$store.dispatch('wizardAssignLimboToFloor', {
				name: name,
				floor: floor,
			})
		},
		makeSlotCountPretty: makeSlotCountPretty,
		makePrintName: makePrintName,
		submitQuizResults: function () {
			this.$store.dispatch(
				'wizardSubmitQuizResults',
				JSON.parse(JSON.stringify(this.workingRotation.quizResults))
			);
			this.$store.dispatch('historySetSelectedFloor','up');
		},
		setSelectedFloorToUpstairs: function () {
			this.$store.dispatch('historySetSelectedFloor','up');
		},
		setSelectedFloorToDownstairs: function () {
			this.$store.dispatch('historySetSelectedFloor','down');
		},
		dummyNada: function () {},
	},
	template: /*html*/`
<div
	id="wizard"
>
	<my-header
		label="Rotation Wizard"
	></my-header>
	<progress-bar
		:chapters="wizardQuizChapters"
		:current-chapter="currentQuestion.category"
	>
	</progress-bar>
	<div
		id="quiz_questions"
	>
		<h3>{{currentQuestion.title}}</h3>
		<p
			v-for="subtitle in currentQuestion.subtitles"
		>{{subtitle}}</p>
		<div
			v-if="currentForm === 'wizardStart'"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>{{originalLongLabel}}</h3>
				<p>
					Upstairs: <strong>{{displayFancyArtists.up}}</strong><br/>
					Downstairs: <strong>{{displayFancyArtists.down}}</strong><br/>
					Featured: <strong>{{displayFancyArtists.feat}}</strong>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectMonth'"
		>
			<div
				class="manager-box-modest"
			>
				<h3 class="flat">Original data:</h3>
				<p>
					Year: <strong>{{originalRotation.rotationLabel.year}}</strong><br/>
					Month: <strong>{{originalRotation.rotationLabel.month}}</strong>
				</p>
				<h3>New rotation:</h3>
				<p>
					Year: <strong>{{workingRotation.rotationLabel.year}}</strong><br/>
					Month: <strong>{{workingRotation.rotationLabel.month}}</strong>
				</p>
				<p>
					<button
						@click.prevent="decrementMergedMonth"
						class="big_button"
					>–</button>
					<button
						@click.prevent="incrementMergedMonth"
						class="big_button"
					>+</button>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectSwapFloors'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							value="false"
							v-model="swapFloors"
						> <span>Don't swap</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="true"
							v-model="swapFloors"
						> <span>Swap</span>
					</label>
				</p>
				<p
					v-if="swapFloors"
				>
					Upstairs → <strong>downstairs</strong><br/>
					Downstairs → <strong>upstairs</strong>
				</p>
				<p
					v-if="!swapFloors"
				>
					Upstairs → upstairs<br/>
					Downstairs → downstairs
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectGuestPresent'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							value="false"
							v-model="guestPresent"
						> <span>No guest</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="true"
							v-model="guestPresent"
						> <span>Guest</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectGuestSharesFeatured'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							value="true"
							v-model="guestSharesFeatured"
						> <span>Guest DOES share featured space</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="false"
							v-model="guestSharesFeatured"
						> <span>Guest DOES NOT share featured space</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeaturedType'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							value="2D"
							v-model="featuredType"
						> <span>Someone from the 2D rotation</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="same"
							v-model="featuredType"
						> <span>The same artist(s) as before</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="3D"
							v-model="featuredType"
						> <span>Someone else (e.g. a 3D artist)</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="group"
							v-model="featuredType"
						> <span>Group show</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeatured2DName'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<select
						v-model="featured2DName"
					>
						<optgroup label="Upstairs">
							<option
								v-for="name in workingRotation.quizOptions.featured2DOptions.up"
								:value="name"
							>{{name}}</option>
						</optgroup>
						<optgroup label="Downstairs">
							<option
								v-for="name in workingRotation.quizOptions.featured2DOptions.down"
								:value="name"
							>{{name}}</option>
						</optgroup>
					</select>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeatured3DName'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<span>Name:</span>
						<input
							v-model="featured3DName"
							type="text"
						/>
					</label>
				</p>
				<div
					class="flat red"
					v-if="featArtist3DValidationMessage"
				>{{featArtist3DValidationMessage}}</div>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeaturedGroupTheme'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<span>Name:</span>
						<input
							v-model="featuredGroupTheme"
							type="text"
						/>
					</label>
				</p>
				<div
					class="flat red"
					v-if="groupThemeValidationMessage"
				>{{groupThemeValidationMessage}}</div>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectDepartingArtists'"
		>
			<div
				class="manager-box-modest"
			>
				<p>A strikethrough means the name will not be included in the new rotation. Click name to toggle.</p>
				<p
					v-for="artistName in workingRotation.quizOptions.departingOptions"
				>
					<button
						@click.prevent="toggleDeparture(artistName)"
						class="big_button"
						:class="{
							'strikethrough': departingCheckboxes[artistName],
							'red': !departingCheckboxes[artistName]
						}"
					>{{artistName}}</button><br/>
				</p>
				<p>Removing: <strong>{{departingArtistsString}}</strong></p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectArrivingArtists'"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input 
							v-model="newArtistName"
							type="text"
						/>
						<button
							:disabled="!newArtistNameValidated"
							@click.prevent="submitNewArtistName"
						>Add</button>
					</label>
				</p>
				<p>Click "Add" to submit the new name.</p>
				<div
					class="flat red"
					v-if="newArtistValidationMessage"
				>{{newArtistValidationMessage}}</div>
				<h3
					v-if="arrivingArtists.length > 0"
				>New artists:</h3>
				<p
					v-for="artistName in arrivingArtists"
				>
					<span>{{artistName}}</span>
					<button
						class="red"
						@click.prevent="toggleArrival(artistName)"
					> X </button>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectArtistSlotSizeChanges'"
		>
			<div
				class="manager-box-modest"
			>
				<p
					v-for="artistName in Object.keys(slotSizeOptions)"
				>
					<button
						class="big_button"
						:class="slotSizeOptions[artistName] !== origSlotSizeOptions[artistName] ? 'red' : ''"
						@click.prevent="toggleSlotSizeChange(artistName)"
					>
						<span>{{artistName}}</span>
						<span v-if="slotSizeOptions[artistName] !== 1">
							({{makeSlotCountPretty(slotSizeOptions[artistName])}})
						</span>
					</button>
				</p>
				<p
					v-if="artistSlotSizeChanges.length > 0"
				>Artists with changed slot sizes: <strong>{{artistSlotSizeChanges.join(', ')}}</strong></p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectNewArtistsNewFloor'"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Limbo:</h3>
				<p
					v-if="limboLists.limbo.length === 0"
				>All done!</p>
				<p
					v-if="limboLists.limbo.length > 0"
				>
					<p
						v-for="artistName in limboLists.limbo"
					>
						<span><strong>{{makePrintName(artistName, slotSizeOptions[artistName])}}:</strong></span>
						<button
							style="font-size: 1rem;"
							@click="assignLimboToFloor(artistName, 'up')"
						>Send UPSTAIRS</button>
						<button
							style="font-size: 1rem;"
							@click="assignLimboToFloor(artistName, 'down')"
						>Send DOWNSTAIRS</button>
					</p>
				</p>
				<h3>Assigned:</h3>
				<p>
					<span>Upstairs ({{limboSlotTotals.up}}):</span>
					<strong>{{origLimboStrings.up}}</strong>
					<span
						v-for="artistName in addedLimboLists.up"
					>
						<span> +</span>
						<button
							class="red"
							style="font-size: 1rem;"
							@click="assignLimboToFloor(artistName, 'limbo')"
						><strong>{{makePrintName(artistName, slotSizeOptions[artistName])}}</strong></button>
					</span>
				</p>
				<p>
					<span>Downstairs ({{limboSlotTotals.down}}):</span>
					<strong>{{origLimboStrings.down}}</strong>
					<span
						v-for="artistName in addedLimboLists.down"
					>
						<span> +</span>
						<button
							class="red"
							style="font-size: 1rem;"
							@click="assignLimboToFloor(artistName, 'limbo')"
						><strong>{{makePrintName(artistName, slotSizeOptions[artistName])}}</strong></button>
					</span>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectArtistFloorAssignmentOverrides'"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Upstairs ({{afterOverridesSlotTotals.up}}):</h3>
				<p>
					<button
						class="big_button"
						v-if="insertGuest"
						disabled
					><strong>{{makePrintName('GUEST', 0.5)}}</strong></button>
					<span
						v-for="artistName in afterOverridesList.up"
					>
					
						<button
							class="big_button"
							@click="toggleFloorOverride(artistName)"
						><strong>{{makePrintName(artistName, slotSizeOptions[artistName])}}</strong></button>
					</span>
				</p>
				<h3>Downstairs ({{afterOverridesSlotTotals.down}}):</h3>
				<p>
					<span
						v-for="artistName in afterOverridesList.down"
					>
						<button
							class="big_button"
							@click="toggleFloorOverride(artistName)"
						><strong>{{makePrintName(artistName, slotSizeOptions[artistName])}}</strong></button>
					</span>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'showArtistFloorAssignments'"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Wizard results:</h3>
				<p>
					<span>Featured:</span>
					<span>{{afterOverridesFeaturedString}}</span>
				<br/>
				Guest in 2D rotation: {{insertGuest ? 'YES' : 'NO'}}<br/>
				Upstairs: {{afterOverridesList.up.join(', ')}}<br/>
				Downstairs: {{afterOverridesList.down.join(', ')}}</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'insertUpstairsSlots'"
		>
			<history-placement></history-placement>
			<history-header></history-header>
			<history-table></history-table>
		</div>
		<div
			v-if="currentForm === 'insertDownstairsSlots'"
		>
			<history-placement></history-placement>
			<history-header></history-header>
			<history-table></history-table>
		</div>
		<div
			v-if="currentForm === 'showFinalPreview'"
		>
		<p>
			TODO
		</p>
			
		</div>
		<div
			v-if="currentForm === 'copyResult'"
		>
			<div
				class="manager-box-modest"
			>
			<p>
				TODO
			</p>
				
			</div>
		</div>
		<p class="unflat">
			<button
				v-for="button in currentQuestion.navButtons"
				@click.prevent="attemptNavButton(
					button.action,
					button.goTo,
					button.goToComputed
				)"
				class="big_button"
				:disabled="!self()[button.enabled]"
			>{{button.label}}</button>
		</p>
	</div>
</div>
`
});
