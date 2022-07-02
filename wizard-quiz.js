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
		subtitles: [
			"The wizard will walk you through the creation of a new rotation based on the currently loaded data.",
		],
		dataNames: [],
		alsoReset: [],
		formName: "wizardStart",
		navButtons: [
			{
				label: "Back",
				enabled: "dummyTrue",
				action: "returnToHub",
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
		title: "This new rotation will be for what month?",
		subtitles: ["The version number will be incremented automatically, if appropriate."],
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
		subtitles: ["Floors are swapped for most normal (sequential) rotations."],
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
		subtitles: [],
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
		subtitles: ["If sharing the featured space, the guest artist will not be given hanging space in the 2D rotation."],
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
		subtitles: [
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
		subtitles: ["2D artists will not be included in the 2D rotation while they are featured, but they will be able to return to the 2D rotation afterward."],
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
		subtitles: ["NOTE: Even if this is a 2D artist, this artist will not participate in the 2D rotations after they are featured."],
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
		subtitles: [
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
		subtitles: [
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
		subtitles: [
			"Leave box blank to skip.",
			"New artists should not have the exact name as an existing artist; use an initial if you must to make sure their labels are different, which will keep their slots from fusing on the map."
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
		subtitles: ["Click a name to toggle their slot size between full and ½."],
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
		subtitles: [
			"If you change your mind, click the red name in the assignment list return the name to \"limbo\".",
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
		subtitles: [
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
		subtitles: [],
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
		subtitles: [],
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
		subtitles: [],
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
				// action: "lockAnswers",
				action: "loadFinalWizardResults",
				goTo: 110,
			}
		],
	},
	{
		questionID: 110,
		category: "Finishing up",
		title: "Final preview!",
		subtitles: [
			// "If anything needs to be adjusted, click \"Back\" to redo the necessary portions of the wizard. If everything looks good, click \"Next\" to confirm this data and generate the shareable link."
			"Mary is still working on the wizard, so if you need to make changes to this map, you will need to reload the page now and start the wizard over. (Sorry!!) (The back button has been disabled to emphasize this)"
		],
		formName: "showFinalPreview",
		dataNames: [],
		alsoReset: [],
		navButtons: [
			{
				label: "Back",
				enabled: "dummyFalse",
				// enabled: "dummyTrue",
				action: "setSelectedFloorToDownstairs",
				goTo: 101,
			},
			{
				label: "Next",
				enabled: "dummyTrue",
				action: "lockAnswers",
				// action: "loadFinalWizardResults",
				goTo: 120,
			}
		],
	},
	{
		questionID: 120,
		category: "Complete!",
		title: "All done!",
		subtitles: [
			"Click the button below to copy this link into your clipboard, after which you can \"paste\" to share the map with others.",
			"Remember that the link must be whole in its entirety or the map will appear broken. (When sending this link via email, make it a clickable link by hand so that it is not truncated accidentally by your email client.)",
			"Clicking \"Next\" will put this data into the URL bar, as well as make it available to the rest of the hub. This means you will be able to use the advanced editor to make further changes to this map if you wish!",
		],
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
				enabled: "dummyTrue",
				action: "returnToHubFreshQuery",
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