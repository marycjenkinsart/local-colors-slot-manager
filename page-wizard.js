var defaultQuizAnswers = {
	rotationMonth: null,
	rotationYear: null,
	swapFloors: true,
	guestPresent: true,
	guestSharesFeatured: false,
	featuredType: null,
	featured2DName: null,
	featured3DName: null,
	featuredGroupTheme: null,
	departingArtists: [],
	arrivingArtists: [],
	artistSlotSizeChanges: [],
	newArtistsNewFloor: {},
	artistFloorAssignmentOverrides: [],
	placedUpNames: [],
	placedDownNames: [],
};

var wizardPage = Vue.component('wizard', {
	data: function () {
		return {
			currentForm: "confirmOrigData",
			currentQuestionIndex: 0,
			startingRotationObject: {},
			quizAnswers: JSON.parse(JSON.stringify(defaultQuizAnswers)),
			quiz: [
				{
					questionID: 0,
					title: "Welcome to the rotation wizard!",
					subtitle: [
						"Please confirm this is the data you want to start from."
					],
					dataNames: [],
					alsoReset: [],
					formName: "confirmOrigData",
					navButtons: [
						{
							label: "Back",
							enabled: "dummyFalse",
							action: "dummyNada",
							goTo: 0,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "dummyNada",
							goTo: 10,
						}
					],
				},
				{
					questionID: 10,
					title: "The new rotation is for what month?",
					subtitle: [],
					dataNames: [
						"rotationMonth",
						"rotationYear",
					],
					alsoReset: [],
					formName: "selectMonth",
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 0,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 20,
						}
					],
				},
				{
					questionID: 20,
					title: "Will the floors get swapped for this rotation?",
					subtitle: [],
					dataNames: [
						"swapFloors",
					],
					alsoReset: [],
					formName: "selectSwapFloors",
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 10,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 30,
						}
					],
				},
				{
					questionID: 30,
					title: "Is there a guest artist this month?",
					subtitle: [],
					dataNames: [
						"guestPresent",
					],
					alsoReset: [
						"guestSharesFeatured",
					],
					formName: "selectGuestPresent",
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 20,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 40,
							goToComputed: "guestArtistBranch",
						}
					],
				},
				{
					questionID: 31,
					title: "Is the guest artist sharing the featured space?",
					subtitle: [],
					formName: "selectGuestSharesFeatured",
					dataNames: [
						"guestSharesFeatured",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 30,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 40,
						}
					],
				},
				{
					questionID: 40,
					title: "Who is featured this month?",
					subtitle: [
						"(For advanced scenarios, use the advanced editor when the wizard is done.)"
					],
					formName: "selectFeaturedType",
					dataNames: [
						"featuredType",
					],
					alsoReset: [
						"featured2DName",
						"featured3DName",
						"featuredGroupTheme",
					],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 30,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "featuredCategoryIsSet",
							action: "lockAnswers",
							goTo: 50,
							goToComputed: "featuredArtistBranch",
						}
					],
				},
				{
					questionID: 41,
					title: "Who from the 2D rotation is featured?",
					subtitle: [],
					formName: "selectFeatured2DName",
					dataNames: [
						"featured2DName",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 40,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "2DFeatArtistIsSet",
							action: "lockAnswers",
							goTo: 50,
						}
					],
				},
				{
					questionID: 43,
					title: "What is the featured artist's name?",
					subtitle: [],
					formName: "selectFeatured3DName",
					dataNames: [
						"featured3DName",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 40,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "3DFeatArtistIsSet",
							action: "lockAnswers",
							goTo: 50,
						}
					],
				},
				{
					questionID: 44,
					title: "Does this group show have a theme?",
					subtitle: [
						"Type the theme name. (Leave blank if no theme.)"
					],
					formName: "selectFeaturedGroupTheme",
					dataNames: [
						"featuredGroupTheme",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 40,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 50,
						}
					],
				},
				{
					questionID: 50,
					title: "Are there any existing 2D artists who will not be in this 2D rotation?",
					subtitle: [
						"(E.g. artists who have left the gallery)"
					],
					formName: "selectDepartingArtists",
					dataNames: [
						"departingArtists",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 40,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 60,
						}
					],
				},
				{
					questionID: 60,
					title: "Are there any new 2D artists?",
					subtitle: [],
					formName: "selectArrivingArtists",
					dataNames: [
						"arrivingArtists",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 50,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 70,
						}
					],
				},
				{
					questionID: 70,
					title: "Are any 2D artists changing from a full space to a half space (or vice versa)?",
					subtitle: [],
					formName: "selectArtistSlotSizeChanges",
					dataNames: [
						"artistSlotSizeChanges",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 60,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 80,
						}
					],
				},
				{
					questionID: 80,
					title: "The following artist(s) must be newly added to a floor. Which floor?",
					subtitle: [
						"NOTE: the order of artists on each floor will be changed later."
					],
					formName: "selectNewArtistsNewFloor",
					dataNames: [
						"newArtistsNewFloor",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 70,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "newArtistsFloorIsSet",
							action: "lockAnswers",
							goTo: 90,
						}
					],
				},
				{
					questionID: 90,
					title: "Final artist-floor assignments:",
					subtitle: [
						"The wizard has done its work, but you may need to make manual overrides now. If so, click an artist's name to send them to the other floor.",
						"Reminder: avoid putting similar artists on the same floor, and try to keep the artist count per floor fairly even."
					],
					formName: "selectArtistFloorAssignmentOverrides",
					dataNames: [
						"artistFloorAssignmentOverrides",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 80,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "lockAnswers",
							goTo: 99,
						}
					],
				},
				{
					questionID: 99,
					title: "Artists have been assigned to their floors!",
					subtitle: [],
					formName: "showArtistFloorAssignments",
					dataNames: [],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 90,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							action: "generateAssignmentData",
							goTo: 100,
						}
					],
				},
				{
					questionID: 100,
					title: "Assign upstairs artists to slots.",
					subtitle: [
						"If you notice an artist has been upstairs twice in a row, make sure they rotate this time! Click \"BACK\" if necessary to make adjustments before trying again."
					],
					formName: "insertUpstairsSlots",
					dataNames: [
						"placedUpNames",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 90,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "upstairsSlotsAreSet",
							action: "lockAnswers",
							goTo: 101,
						}
					],
				},
				{
					questionID: 101,
					title: "Assign downstairs artists to slots.",
					subtitle: [
						"If you notice an artist has been downstairs twice in a row, make sure they rotate this time! Click \"BACK\" if necessary to make adjustments before trying again."
					],
					formName: "insertDownstairsSlots",
					dataNames: [
						"placedDownNames",
					],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 100,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "downstairsSlotsAreSet",
							action: "lockAnswers",
							goTo: 110,
						}
					],
				},
				{
					questionID: 110,
					title: "Final preview!",
					subtitle: [
						"If anything needs to be adjusted, click \"BACK\"."
					],
					formName: "showFinalPreview",
					dataNames: [],
					alsoReset: [],
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 101,
						},
						{
							label: "Next",
							enabled: "dummyTrue",
							// enabled: "downstairsSlotsAreSet",
							action: "dummyNada",
							goTo: 120,
						}
					],
				},
				{
					questionID: 120,
					title: "All done!",
					subtitle: [],
					formName: "copyResult",
					navButtons: [
						{
							label: "Back",
							enabled: "dummyTrue",
							action: "reinitializeQ",
							goTo: 110,
						},
						{
							label: "Next",
							enabled: "dummyFalse",
							action: "dummyNada",
							goTo: 0,
						}
					],
				}
			],
		};
	},
	computed: {
		originalRotation: function () {
			return this.$store.state.loaded.rotation;
		},
		currentQuestion: function () {
			return this.quiz[this.currentQuestionIndex];
		},
		dummyTrue: function () {
			return true;
		},
		dummyFalse: function () {
			return false;
		},
	},
	methods: {
		self: function () {
			return this;
		}, // Stack overflow magic
		getQuizIndexFromID: function (id) {
			var result = this.quiz.findIndex(function (question) {
				var oops = question.questionID === id;
				return oops;
			});
			return result || 0;
		},
		resetQuizAnswerByName: function (name) {
			var newObject = JSON.parse(JSON.stringify(this.quizAnswers));
			newObject[name] = defaultQuizAnswers[name];
			this.quizAnswers = newObject;
		},
		reinitializeQ: function () {
			var selfself = this;
			this.currentQuestion.dataNames.forEach(function (item) {
				selfself.resetQuizAnswerByName(item);
			})
			this.currentQuestion.alsoReset.forEach(function (item) {
				selfself.resetQuizAnswerByName(item);
			})
		},
		attemptNavButton: function (action, goTo, goToComputed) {
			this.currentQuestionIndex = this.getQuizIndexFromID(goTo);
			this.currentForm = this.currentQuestion.formName;
			this[action]();
		},
		lockAnswers: function () {
			
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
		<h2>{{currentQuestion.title}}</h2>
		<p
			v-for="subtitle in currentQuestion.subtitle"
		>{{subtitle}}</p>
		<pre
			v-if="currentForm === 'confirmOrigData'"
		>{{originalRotation}}</pre>
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
