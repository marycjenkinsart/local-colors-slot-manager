var wizardPage = Vue.component('wizard', {
	mixins: [
		mixinsHistory,
	],
	data: function () {
		return {
			wizardQuizChapters: makeWizardQuizChapters(),
			newArtistName: '',
			quizAnswers: clone(defaultQuizAnswers),
		}
	},
	computed: {
		rotation: function () {
			return this.$store.getters.rotation;
		},
		currentQuestionIndex: function () {
			return this.$store.state.wizard.currentQuestionIndex;
		},
		currentQuestion: function () {
			return wizardQuiz[this.currentQuestionIndex];
		},
		currentForm: function () {
			return this.currentQuestion.formName;
		},
		dummyTrue: function () {
			return true;
		},
		dummyFalse: function () {
			return false;
		},
		potentialState: function () {
			return this.workingRotation.quizResults;
		},
		namesToInsert: function () {
			return prepareRawUnfilteredNames(this.potentialState[this.selectedHistoryInsertFloor]);
		},
		selectedHistoryInsertFloor: function () {
			return this.$store.state.history.selectedFloor;
		},
		// computeds for goTo branches
		guestArtistBranch: function () {
			var quizAnswers = this.quizAnswers;
			var defaultGoTo = 40;
			var extraQGoTo = 31;
			var doExtraQ = quizAnswers.guestPresent;
			return doExtraQ ? extraQGoTo : defaultGoTo;
		},
		featuredArtistBranch: function () {
			var quizAnswers = this.quizAnswers;
			var result = 50;
			var type = quizAnswers.featuredType;
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
		// computeds for whether buttons are enabled
		featArtistIsSet2D: function () {
			var quizAnswers = this.quizAnswers;
			return quizAnswers.featured2DName;
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
			var placedNames = this.$store.state.wizard.placedNames;
			return !!placedNames.up.length;
		},
		allFreeDownstairsNamesPlaced: function () {
			var placedNames = this.$store.state.wizard.placedNames;
			return !!placedNames.down.length;
		},
		// forbidden char reports and related stuff
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
		// the magic
		originalRotation: function () {
			return this.$store.getters.originalRotation;
		},
		originalLongLabel: function () {
			return getLongLabel(this.originalRotation.rotationLabel);
		},
		displayOrigArtists: function () {
			var origArtists = {
				up: makeFloorFancy(this.originalRotation.artists.up),
				down: makeFloorFancy(this.originalRotation.artists.down),
				feat: clone(this.originalRotation.artists.feat),
			};
			var fancyObject = clone(origArtists);
			var result = {};
			limitedFloorNames.forEach(function (floorName) {
				var floorObject = clone(fancyObject[floorName]);
				result[floorName] = Object.values(floorObject)
					.map(function (artist) {
						return makePrintName(artist.name, artist.slotSize);
					})
					.join(', ')
			})
			result.feat = Object.values(fancyObject.feat)
				.map(function (artist) {
					return makeFeaturedPrintName(artist.name, artist.type);
				})
				.join (', ')
			return result;
		},
		workingRotation: function () {
			return applyWizardQuizAnswersToRotation(
				this.quizAnswers,
				this.originalRotation
			);
		},
		wizardResults: function () {
			var workingRotation = this.workingRotation;
			var empty = emptyRotationObject;
			var placedNames = this.$store.state.wizard.placedNames;
			var rotation = {
				templateInfo: empty.templateInfo,
				meta: empty.meta,
				artists: {
					up: placedNames.up,
					down: placedNames.down,
					feat: workingRotation.quizResults.feat,
				}
			}
			if (workingRotation.quizResults.insertGuest) {
				rotation.artists.up.unshift('GUEST');
			}
			rotation.meta.appVersion = 'v2';
			rotation.meta.querySource = 'wizard';
			rotation.rotationLabel = clone(workingRotation.rotationLabel);
			rotation.rotationLabel.version = incrementVersionNumberBasedOnHistory(
				this.$store.getters.fullHistory,
				workingRotation.rotationLabel.year,
				workingRotation.rotationLabel.month
			)
			rotation.rotationLabel.custom = '';
			rotation.originalQuery = generateQueryFromRotation(rotation);
			return rotation;
		},
		insertGuest: function () {
			return this.workingRotation.quizResults.insertGuest;
		},
		departingArtistsString: function () {
			var quizAnswers = this.quizAnswers;
			var departing = quizAnswers.departingArtists;
			return departing.length > 0 ? departing.join(', ') : 'no one';
		},
		departingCheckboxes: function () {
			var result = {};
			var quizAnswers = this.quizAnswers;
			var departing = quizAnswers.departingArtists;
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
			var quizAnswers = this.quizAnswers;
			return quizAnswers.arrivingArtists || [];
		},
		artistSlotSizeChanges: function () {
			var quizAnswers = this.quizAnswers;
			return quizAnswers.artistSlotSizeChanges || [];
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
			this.quizAnswers[name] = defaultQuizAnswers[name];
		},
		initializeQ: function () {
			scrollToTop();
			var selfself = this;
			this.currentQuestion.dataNames.forEach(function (name) {
				selfself.resetQuizAnswerByName(name);
			})
			this.currentQuestion.alsoReset.forEach(function (name) {
				selfself.resetQuizAnswerByName(name);
			})
		},
		attemptNavButton: function (action, _goTo, goToComputed) {
			var goTo = _goTo
			if (goToComputed) {
				goTo = this[goToComputed];
			}
			this.$store.dispatch(
				'wizardSetCurrentQuestionIndex',
				getQuizIndexFromID(goTo)
			);
			this[action]();
		},
		lockAnswers: function () {
			scrollToTop();
			// Guess I dont need this?
		},
		incrementMergedMonth: function () {
			this.quizAnswers.rotationMergedMonthDif += 1;
		},
		decrementMergedMonth: function () {
			this.quizAnswers.rotationMergedMonthDif -= 1;
		},
		toggleDeparture: function (name) {
			var result = this.quizAnswers.departingArtists.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			this.quizAnswers.departingArtists = result;
		},
		toggleArrival: function (name) {
			var result = this.quizAnswers.arrivingArtists.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			this.quizAnswers.arrivingArtists = result;
		},
		toggleSlotSizeChange: function (name) {
			var result = this.quizAnswers.artistSlotSizeChanges.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			this.quizAnswers.artistSlotSizeChanges = result;
		},
		toggleFloorOverride: function (name) {
			var result = this.quizAnswers.artistFloorAssignmentOverrides.slice();
			if (result.includes(name)) {
				result = result.filter(function (item) {
					return item !== name;
				});
			} else {
				result.push(name);
			}
			this.quizAnswers.artistFloorAssignmentOverrides = result;
		},
		updatePlacedNames: function (array) {
			this.$store.dispatch('wizardSetPlacedNames', array);
		},
		submitNewArtistName: function () {
			var artistName = this.newArtistName;
			if (!this.arrivingArtists.includes(artistName)) {
				this.toggleArrival(artistName);
			}
			this.newArtistName = '';
		},
		assignLimboToFloor: function (name, floor) {
			var result = clone(this.quizAnswers);
			result.newArtistsNewFloor[name] = floor;
			this.quizAnswers = result;
		},
		makeSlotCountPretty: makeSlotCountPretty,
		makePrintName: makePrintName,
		submitQuizResults: function () {
			scrollToTop();
			this.$store.dispatch(
				'wizardSubmitQuizResults',
				clone(this.workingRotation.quizResults)
			);
			this.$store.dispatch('historySetSelectedFloor','up');
		},
		setSelectedFloor: function (floor) {
			scrollToTop();
			this.setInsertName('');
			this.setHighlightedName('');
			this.$store.dispatch('historySetSelectedFloor',floor);
		},
		setSelectedFloorToUpstairs: function () {
			this.setSelectedFloor('up');
			this.updatePlacedNames([]);
		},
		setSelectedFloorToDownstairs: function () {
			this.setSelectedFloor('down');
			this.updatePlacedNames([]);
		},
		dummyNada: function () {
			scrollToTop();
		},
		loadFinalWizardResults: function () {
			var results = clone(this.wizardResults);
			this.$store.dispatch('loadRotation', results);
		},
		returnToHub: function () {
			scrollToTop();
			this.$router.push({
				path: '/hub',
				query: this.$route.query,
			});
		},
		returnToHubFreshQuery: function () {
			scrollToTop();
			this.$router.push({
				path: '/hub',
				query: this.$store.getters.rotation.originalQuery,
			});
		},
		goToAdvancedEditorFreshQuery: function () {
			scrollToTop();
			this.$router.push({
				path: '/',
				query: this.$store.getters.rotation.originalQuery,
			});
		},
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
			id="wizard-start-q"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Currently loaded data:</h3>
				<p>
					Label: <strong>{{originalLongLabel}}</strong><br/>
					Upstairs: <strong>{{displayOrigArtists.up}}</strong><br/>
					Downstairs: <strong>{{displayOrigArtists.down}}</strong><br/>
					Featured: <strong>{{displayOrigArtists.feat}}</strong>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectMonth'"
			id="wizard-set-label-q"
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
			id="wizard-set-swap-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							:value="false"
							v-model="quizAnswers.swapFloors"
						> <span>Don't swap</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							:value="true"
							v-model="quizAnswers.swapFloors"
						> <span>Swap</span>
					</label>
				</p>
				<p
					v-if="quizAnswers.swapFloors"
				>
					Upstairs → <strong>downstairs</strong><br/>
					Downstairs → <strong>upstairs</strong>
				</p>
				<p
					v-if="!quizAnswers.swapFloors"
				>
					Upstairs → upstairs<br/>
					Downstairs → downstairs
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectGuestPresent'"
			id="wizard-set-guest-present-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							:value="false"
							v-model="quizAnswers.guestPresent"
						> <span>No guest</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							:value="true"
							v-model="quizAnswers.guestPresent"
						> <span>Guest</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectGuestSharesFeatured'"
			id="wizard-set-guest-shares-featured-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							:value="true"
							v-model="quizAnswers.guestSharesFeatured"
						> <span>Guest DOES share featured space</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							:value="false"
							v-model="quizAnswers.guestSharesFeatured"
						> <span>Guest DOES NOT share featured space</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeaturedType'"
			id="wizard-set-who-is-featured-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<input
							type="radio"
							value="2D"
							v-model="quizAnswers.featuredType"
						> <span>Someone from the 2D rotation</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="same"
							v-model="quizAnswers.featuredType"
						> <span>The same artist(s) as before</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="3D"
							v-model="quizAnswers.featuredType"
						> <span>Someone else (e.g. a 3D artist)</span>
					</label>
					<br/>
					<label>
						<input
							type="radio"
							value="group"
							v-model="quizAnswers.featuredType"
						> <span>Group show</span>
					</label>
				</p>
			</div>
		</div>
		<div
			v-if="currentForm === 'selectFeatured2DName'"
			id="wizard-set-featured-2d-name-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<select
						v-model="quizAnswers.featured2DName"
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
			id="wizard-set-featured-3d-name-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<span>Name:</span>
						<input
							v-model="quizAnswers.featured3DName"
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
			id="wizard-set-featured-group-theme-q"
		>
			<div
				class="manager-box-modest"
			>
				<p>
					<label>
						<span>Name:</span>
						<input
							v-model="quizAnswers.featuredGroupTheme"
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
			id="wizard-set-departing-q"
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
			id="wizard-set-arriving-q"
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
			id="wizard-set-slot-size-changes-q"
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
			id="wizard-set-reduce-limbo-q"
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
							class="medium_button"
							@click="assignLimboToFloor(artistName, 'up')"
						>Send UPSTAIRS</button>
						<button
							class="medium_button"
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
			id="wizard-set-overrides-q"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Upstairs (total slots: {{afterOverridesSlotTotals.up}}):</h3>
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
				<h3>Downstairs (total slots: {{afterOverridesSlotTotals.down}}):</h3>
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
			id="wizard-subtotal-results-q"
		>
			<div
				class="manager-box-modest"
			>
				<h3
					class="flat"
				>Wizard results:</h3>
				<p>
					<span>Featured:</span>
					<span><strong>{{afterOverridesFeaturedString}}</strong></span>
				<br/>
				Guest in 2D rotation: <strong>{{insertGuest ? 'YES' : 'NO'}}</strong><br/>
				Upstairs: <strong>{{afterOverridesList.up.join(', ')}}</strong><br/>
				Downstairs: <strong>{{afterOverridesList.down.join(', ')}}</strong></p>
			</div>
		</div>
		<div
			v-if="currentForm === 'insertUpstairsSlots'"
			id="wizard-place-upstairs-slots"
		>
			<wizard-insertion-tips
				:show-tips="showTips"
				@set-tips="setTips($event)"
			></wizard-insertion-tips>
			<hr style="margin: 10px 0px;">
			<history-placement
				key="up"
				:insertGuest="insertGuest"
				:namesToInsert="namesToInsert"
				:featured="potentialState.feat"
				@update-placed-names="updatePlacedNames($event)"
			></history-placement>
			<history-header></history-header>
			<history-table></history-table>
		</div>
		<div
			v-if="currentForm === 'insertDownstairsSlots'"
			id="wizard-place-downstairs-slots"
		>
			<wizard-insertion-tips
				:show-tips="showTips"
				@set-tips="setTips($event)"
			></wizard-insertion-tips>
			<hr style="margin: 10px 0px;">
			<history-placement
				key="down"
				:insertGuest="insertGuest"
				:namesToInsert="namesToInsert"
				:featured="potentialState.feat"
				@update-placed-names="updatePlacedNames($event)"
			></history-placement>
			<history-header></history-header>
			<history-table></history-table>
		</div>
		<div
			v-if="currentForm === 'showFinalPreview'"
			id="wizard-confirm-final-preivew"
		>
		<p>
			<map-preview
				:rotation="rotation"
			></map-preview>
		</p>
			
		</div>
		<div
			v-if="currentForm === 'copyResult'"
			id="wizard-copy-result"
		>
			<div
				class="manager-box-modest"
			>
			<shareable-link></shareable-link>
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
