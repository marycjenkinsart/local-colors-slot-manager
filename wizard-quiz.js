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
			"In the future you will be able to choose which rotation data to edit, but for now, to start from different rotation data, you will need to launch the wizard from a different URL link.",
			"NOTE: If you need to prepare a scenario more specific than what this questonnaire can accomodate, you can switch to the advanced editor after the wizard is done."
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
			},
			{
				label: "Debug",
				enabled: "dummyTrue",
				action: "dummyNada",
				goTo: 80,
			}
		],
	},
	{
		questionID: 10,
		category: "Label",
		title: "This new rotation will be for what month?",
		subtitle: ["The version number will be incremented automatically, if appropriate."],
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
		subtitle: ["Floors are swapped for most normal (sequential) rotations."],
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
		subtitle: ["If sharing the featured space, the guest artist will not be given hanging space in the 2D rotation."],
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
			"If none of the below options apply, you will need to use the advanced editor when the wizard is done. Pick the option most like your current scenario to make things easier in the meantime."
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
		subtitle: ["2D artists will not be included in the 2D rotation while they are featured, but they will be able to return to the 2D rotation afterward."],
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
		subtitle: ["NOTE: Even if this is a 2D artist, this artist will not participate in the 2D rotations after they are featured."],
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
				enabled: "featArtist3DValidated",
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
				enabled: "groupThemeValidated",
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
			"Select any 2D artist that is leaving the gallery."
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
		subtitle: [
			"Leave box blank to skip.",
			"New artists should not have the exact name as a current artist; use an initial if you must to make sure their labels are different, which will keep their slots from fusing on the map. (An automatic check will be implemented later.)"
		],
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
		subtitle: ["Click a name to toggle their slot size between full and ½."],
		formName: "selectArtistSlotSizeChanges",
		dataNames: [
			"artistSlotSizeChanges",
		],
		alsoReset: [
			"newArtistsNewFloor"
		],
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
				goTo: 90,
				goToComputed: "limboArtistsBranch"
			}
		],
	},
	{
		questionID: 80,
		category: "Floor assignments",
		title: "The following artist(s) must be newly added to a floor. Which floor?",
		subtitle: [
			"Try to put them with dissimilar artists.",
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
				enabled: "newArtistsFloorIsSet",
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
				action: "submitQuizResults",
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
				enabled: "allFreeUpstairsNamesPlaced",
				action: "setSelectedFloorToDownstairs",
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
		dataNames: [],
		alsoReset: [],
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "setSelectedFloorToUpstairs",
				goTo: 100,
			},
			{
				label: "Next",
				enabled: "allFreeDownstairsNamesPlaced",
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
				action: "resetDownstairsPlacedNames",
				goTo: 101,
			},
			{
				label: "Next",
				enabled: "dummyTrue",
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

var makeWizardQuizChapters = function () {
	var result = [];
	wizardQuiz.forEach(function (question) {
		if (!result.includes(question.category)) {
			result.push(question.category);
		}
	})
	return result;
};

var wizardQuizChapters = makeWizardQuizChapters();