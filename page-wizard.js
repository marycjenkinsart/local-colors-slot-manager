var wizardPage = Vue.component('wizard', {
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
			var makePrintName = function (fancyArtistObject) {
				var printName = fancyArtistObject.name;
				if (fancyArtistObject.slotSize !== 1) {
					var printSlot = makeSlotCountPretty(fancyArtistObject.slotSize);
					printName += ' (' + printSlot + ')';
				}
				return printName;
			};
			['up','down'].forEach(function (floorName) {
				var floorObject = JSON.parse(JSON.stringify(fancyObject[floorName]));
				var currArtist = floorObject.shift();
				var floorString = makePrintName(currArtist);
				floorObject.forEach(function (artistObject) {
					floorString += ', ' + makePrintName(artistObject);
				})
				result[floorName] = floorString;
			})
			var makeFeaturedPrintName = function (featuredArtistObject) {
				var printName = featuredArtistObject.name;
				printName += ' (' + featuredArtistObject.type + ')';
				return printName;
			}
			var featString = '';
			fancyObject.feat.forEach(function (featuredArtist) {
				if (featString.length > 0) {
					featString += ', ';
				}
				featString += makeFeaturedPrintName(featuredArtist);
			})
			result.feat = featString;
			return result;
		},
		currentQuestionIndex: function () {
			return this.$store.state.wizard.currentQuestionIndex;
		},
		currentQuestion: function () {
			return wizardQuiz[this.currentQuestionIndex];
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
			var result = doExtraQ ? extraQGoTo : defaultGoTo;
			return result;
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
		featArtistIsSet2D: function () {
			return this.$store.state.wizard.quizAnswers.featured2DName;
		},
		featArtistIsSet3D: function () {
			return this.$store.state.wizard.quizAnswers.featured3DName;
		},
		originalRotation: function () {
			return this.$store.state.loaded.rotation;
		},
		originalLongLabel: function () {
			return this.$store.getters.originalLongLabel;
		},
		workingRotation: function () {
			var orig = this.originalRotation;
			var working = JSON.parse(JSON.stringify(orig));
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
			// the rest of the owl
			return working;
		},
		workingUniqueFloors: function () {
			var result = {
				up: this.workingRotation.artists.up.filter(getUnique),
				down: this.workingRotation.artists.down.filter(getUnique),
			};
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
		generateAssignmentData: function () {},
		dummyNada: function () {},
		// firstNameHandler: function (value) {
		// 	this.value.first_name = value;
		// },
		// handleEvent: function (handlerName, value) {
		// 	this[handlerName](value);
		// },
	},
	template: /*html*/`
<div
	id="wizard"
>
	<my-header
		label="Rotation Wizard"
	></my-header>
	<div
		id="quiz_questions"
	>
		<h3>{{currentQuestion.title}}</h3>
		<p
			v-for="subtitle in currentQuestion.subtitle"
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
								v-for="name in workingUniqueFloors.up"
								value="featured2DName"
							>{{name}}</option>
						</optgroup>
						<optgroup label="Downstairs">
							<option
								v-for="name in workingUniqueFloors.down"
								value="featured2DName"
							>{{name}}</option>
						</optgroup>
					</select>
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
