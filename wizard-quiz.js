var defaultQuizAnswers = {
	rotationMergedMonth: null,
	swapFloors: true,
	guestPresent: true,
	guestSharesFeatured: false,
	featuredType: "2D",
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

var getQuizIndexFromID = function (id) {
	var result = wizardQuiz.findIndex(function (question) {
		return question.questionID === id;
	});
	return result || 0;
};

var wizardQuiz = [
	{
		questionID: 0,
		category: "Start",
		title: "Welcome to the rotation wizard!",
		subtitle: [
			"The wizard will start with this rotation data."
		],
		dataNames: [],
		alsoReset: [],
		formName: "wizardStart",
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
		category: "Label",
		title: "The new rotation is for what month?",
		subtitle: [],
		dataNames: [
			"rotationMergedMonth",
		],
		alsoReset: [],
		formName: "selectMonth",
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "initializeQ",
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
		category: "Floor swap",
		title: "Should the floors get swapped for this rotation?",
		subtitle: ["Floors are swapped for most normal rotations. When means all upstairs artists will go downstairs and vice versa."],
		dataNames: [
			"swapFloors",
		],
		alsoReset: [],
		formName: "selectSwapFloors",
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "initializeQ",
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
		category: "Guest info",
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
				action: "initializeQ",
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
		category: "Guest info",
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
				action: "initializeQ",
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
		category: "Featured artist",
		title: "Who is featured this month?",
		subtitle: [
			"(For scenarios more complicated than these, you will need to use the advanced editor when the wizard is done.)"
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
				action: "initializeQ",
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
		category: "Featured artist",
		title: "Who from the 2D rotation is featured?",
		subtitle: ["This artist will not be included in the 2D rotation (because they are featured)."],
		formName: "selectFeatured2DName",
		dataNames: [
			"featured2DName",
		],
		alsoReset: [],
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "initializeQ",
				goTo: 40,
			},
			{
				label: "Next",
				// enabled: "dummyTrue",
				enabled: "featArtistIsSet2D",
				action: "lockAnswers",
				goTo: 50,
			}
		],
	},
	{
		questionID: 43,
		category: "Featured artist",
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
				action: "initializeQ",
				goTo: 40,
			},
			{
				label: "Next",
				// enabled: "dummyTrue",
				enabled: "featArtistIsSet3D",
				action: "lockAnswers",
				goTo: 50,
			}
		],
	},
	{
		questionID: 44,
		category: "Featured artist",
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
				action: "initializeQ",
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
		category: "Comings and goings",
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
				action: "initializeQ",
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
		category: "Comings and goings",
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
				action: "initializeQ",
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
		category: "Comings and goings",
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
				action: "initializeQ",
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
		category: "Floor assignments",
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
				action: "initializeQ",
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
		category: "Floor assignments",
		title: "Final artist-floor assignments:",
		subtitle: [
			"The wizard has done its work, but you may need to make manual overrides now. If so, click an artist's name to send them to the other floor.",
			"Reminder: avoid putting similar artists on the same floor, and try to keep the artist count per floor fairly even.",
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
				action: "initializeQ",
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
		category: "Floor assignments",
		title: "Artists have been assigned to their floors!",
		subtitle: [],
		formName: "showArtistFloorAssignments",
		dataNames: [],
		alsoReset: [],
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "initializeQ",
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
		category: "Slot assignments",
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
				action: "initializeQ",
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
		category: "Slot assignments",
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
				action: "initializeQ",
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
		category: "Finishing up",
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
				action: "initializeQ",
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
		category: "Complete!",
		title: "All done!",
		subtitle: [],
		formName: "copyResult",
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "initializeQ",
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
];

var wizardQuizChapters = function () {
	var result = [];
	wizardQuiz.forEach(function (question) {
		if (!result.includes(question.category)) {
			result.push(question.category);
		}
	})
	return result;
};
