  //-----------------------------------------------//
 /*   CREATING HISTORY DATA FROM ARCHIVED LINKS   */
//-----------------------------------------------//

var webAppHistory = [
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.6#/view?l=2023,1&u=GUEST-1,Mary,Pam,Helene,Lorraine,J_Clay-1&d=Blaine,Taryn-1,Claire,Brokk,Jeff_M&f=no_theme-group&x=v2&t=u01,&au=x8,-9',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.6#/view?l=2022,12,2&u=Claire,Jeff_M,Brokk,Blaine&d=J_Clay-1,Taryn-1,Lorraine,Helene,Pam,Mary&f=no_theme-group&x=v2&t=,d01&au=x3,12,x1,3&ad=33,39,x3,-3',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.5#/view?l=2022,12&u=Claire,Jeff_M,Brokk,Blaine&d=J_Clay-1,Taryn-1,Lorraine,Pam,Mary&f=no_theme-group&x=v2&au=x3,12,x1,3&ad=9,12,x1,9,x1,6',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.5#/view?l=2022,11&u=GUEST-1,Taryn-1,Lorraine,J._Clay-1,Mary&d=Brokk,Jeff_M.,Claire,Blaine&f=Pam-2D-2&x=v2&au=x1,27,x1,12,18&ad=x1,-6,x1,-12,x1,-3',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.5#/view?l=2022,10,3&u=GUEST-1,Blaine,Jeff_M.&d=Pam,Taryn-1,Mary,J._Clay-1&f=Lorraine-2D-2&x=v2&t=u01,&au=54,x1,45,18',
	// 'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.4#/view?l=2022,10&u=GUEST-1,Blaine,Jeff_M.-1&d=Pam,Mary,J._Clay-1&f=Lorraine-2D-2&x=v2',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.3#/view?l=2022,9&u=GUEST-1,Jeff_M.-1,J._Clay-1,Mary,Pam&d=Lorraine,Blaine,Brianna&f=no_theme-group,Lawrence-3D&x=v2',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.2#/view?l=2022,8&u=GUEST-1,Brianna,Lorraine&d=Mary,J._Clay-1,Jeff_M.-1,Pam&f=Blaine-2D-2&x=v2',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2.1#/view?l=2022,7&u=GUEST-1,Mary,Pam,Jeff_M.-1,J._Clay-1&d=Blaine,Brianna,Lorraine&f=no_theme-group&x=v2&au=x5,3',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,6,3&u=Lorraine,Blaine,Brianna&d=Jeff_M.-1,Mary,Pam,J._Clay-1&f=Bill-2D-2&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,5&u=GUEST-1,J._Clay-1,Bill,Mary&d=Brianna,Pam,Lorraine,Blaine&f=Jeff_M.-2D-2&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,4&u=GUEST-1,Pam,Jan,Blaine,Lorraine&d=Mary,Jeff_M.,J._Clay-1,Bill&f=Brianna-3D&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,3&u=Blaine,Bill,J._Clay-1,Jeff_M.,Teri&d=Pam,Kyla,Lorraine,Jan&f=Mary-2D-2,Neena_(guest)-3D&x=v2&ad=x1,3,x1,6,x1,12',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2,3&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,Pam&d=Blaine,Lorraine,Bill,J._Clay-1,Jeff_M.,Teri',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2,2&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,Pam&d=Blaine,Bill,J._Clay-1,Jeff_M.,Teri',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,J._Clay-1,Pam&d=Emily,Blaine,Bill,Jeff_M.,Teri'
];

var reconstructedHistory = [
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,1&u=GUEST-1,Bill,J._Clay-1,Jeff_M.,Emily,Blaine&d=(mix)-3,Pam,Mary,Jan,(mix)-1&f=Teri-2D-2&x=v2&t=u01,&au=x3,-6,x3,-9&ad=33,x1,52,x1,46,x1,31,x1,26',
	// 'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,12,2&u=GUEST-1,Bill,J._Clay-1,Jeff_M.,Emily,Blaine&d=(mix)-3,Pam,Mary,Jan,(mix)-1&f=Teri-2D-2&x=v2&t=u01,&au=x3,-6,x3,-9&ad=33,x1,52,x1,46,x1,31,x1,26',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,12&u=GUEST-1,Bill,J._Clay-1,Jeff_M.,Emily,Blaine&d=Adam-1,Nuha,Pam,Mary,Jan,Adam-1&f=Teri-2D-2&x=v2&t=u01,&au=x3,-6,x3,-9&ad=33,x1,52,x1,46,x1,31,x1,26',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,11&u=GUEST-1,Alicia,Mary,Teri,Adam,Nuha&d=J._Clay-1,Jeff_M.,Emily,Blaine,Bill,Jan&f=Pam-2D-2&x=v2&t=u01,&au=x4,-13,x1,-27,x1,-39&ad=10,x1,18,x1,11,x3,6',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,10,2&u=GUEST-1,J._Clay-1,Jeff_M.,Jan,Blaine,Bill&d=Teri,Adam,Nuha,Pam,Mary&f=Alicia-2D-2&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,-15,x1,-23,x1,-15,x1,-9',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,10&u=GUEST-1,J._Clay-1,Jeff_M.,Jan,Blaine,Bill&d=Teri,Adam,Pam,Mary&f=Alicia-2D-2&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,-17,x1,-17,x1,-12',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,9&u=Mary,Teri,Karen,Pam,Alicia&d=Blaine,Bill,Jeff_M.,Adam,Jan,J._Clay-1&f=Perda-3D,Jamie_(guest)-3D&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,33,x1,36,x1,27,x3,3',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,8,3&u=Jeff_M.,Adam,Blaine,Bill,J._Clay-1&d=Karen,Teri,Mary,Alicia,Pam&f=Jan-2D-2&x=v2&au=x1,-6,x1,-10,x1,-12&ad=x1,35,x1,39,x1,32,x1,21',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,8,2&u=Teri,Adam,Blaine,Bill,J._Clay-1&d=Karen,Jeff_M.,Mary,Alicia,Pam&f=Jan-2D-2&x=v2&au=x1,-6,x1,-10,x1,-12&ad=x1,35,x1,39,x1,32,x1,21',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,7&u=GUEST,Karen,Pam,Jeff_M.,Alicia,Mary&d=Bill,J._Clay-1,Blaine,Adam,Teri,Jan&f=Lawrence-3D&x=v2&t=u01,&au=x1,15,x1,27,x1,18,x1,9&ad=x1,18,18,x1,12'
];

var makeFullHistory = function () {
	var fullHistory = [];
	reconstructedHistory.forEach(function (link) {
		var rawQuery = makeShareableLinkIntoRawQuery(link);
		var historyRecord = makeRotationObjectFromQuery(rawQuery,'history, from reconstructed rotations');
		fullHistory.push(historyRecord);
	})
	webAppHistory.forEach(function (link) {
		var rawQuery = makeShareableLinkIntoRawQuery(link);
		var historyRecord = makeRotationObjectFromQuery(rawQuery,'history, from web app rotations');
		fullHistory.push(historyRecord);
	})
	fullHistory = sortHistoryRecords(fullHistory);
	return fullHistory;
};

var makeShareableLinkIntoRawQuery = function (string) {
	var relevant = string.split('view?')
	var query = relevant[1].split('&'); // now array of strings for each query
	// u=GUEST,Karen,Pam,Jeff_M.,Alicia,Mary
	var result = {};
	query.forEach(function (query) {
		var splits = query.split('=');
		result[splits[0]] = splits[1];
	});
	return result;
};

var addRotationToHistory = function (historyArray, newRotation) {
	var newArray = clone(historyArray);
	// TODO lol
	return newArray;
};

  //----------------------//
 /*   MANAGING HISTORY   */
//----------------------//

var sortHistoryRecords = function (historyArray) {
	var newArray = clone(historyArray);
	newArray.sort(function (a, b) {
		return b.rotationLabel.version - a.rotationLabel.version;
	})
	newArray.sort(function (a, b) {
		return b.rotationLabel.month - a.rotationLabel.month;
	})
	newArray.sort(function (a, b) {
		return b.rotationLabel.year - a.rotationLabel.year;
	})
	return newArray;
};

var countHistoryGaps = function (historyArray) {
	var tally = 0;
	var mergedMonth = historyArray[0].rotationLabel.mergedMonth;
	historyArray.forEach(function (item) {
		// console.log({
		// 	month: item.rotationLabel.month,
		// 	year: item.rotationLabel.year,
		// 	mergedMonth: item.rotationLabel.mergedMonth,
		// })
		var newMergedMonth = item.rotationLabel.mergedMonth;
		var dif = Math.abs(mergedMonth - newMergedMonth);
		if (dif > 1) {
			tally += 1;
		}
		mergedMonth = newMergedMonth;
	})
	return tally;
};

var getHistoryRange = function (historyArray) {
	var oldest = getLongLabel(historyArray[historyArray.length-1].rotationLabel, true);
	var newest = getLongLabel(historyArray[0].rotationLabel, true);
	return [
		oldest,
		newest
	];
};

  //-----------------------------//
 /*   COMPARING TWO ROTATIONS   */
//-----------------------------//

var compareTestFull = {"originalQuery":{"l":"2022,6,3","u":"Lorraine,Blaine,Brianna","d":"Jeff_M.-1,Mary,Pam,J._Clay-1","f":"Bill-2D-2","x":"v2","t":"u01,"},"rotationLabel":{"year":2022,"month":6,"version":2,"custom":"","mergedMonth":24270,"shortLabelString":""},"artists":{"up":["Lorraine","Lorraine","Blaine","Blaine","Brianna","Brianna"],"down":["Jeff M.","Mary","Mary","Pam","Pam","J. Clay"],"feat":[{"name":"Bill","type":"2D","origSlotSize":1}]},"templateInfo":{"up":{"selectedTemplateBase":"u01","snapInches":18,"adjustments":[null,null,null,null,null,null,[]]},"down":{"selectedTemplateBase":"d00","snapInches":18,"adjustments":[null,null,null,null,null,null,[]]},"feat":{"selectedTemplateBase":"defaultA"},"legacyMode":false},"meta":{"appVersion":"v2","querySource":"from URL","queryIncomplete":null,"parseSuccessful":true,"warnings":[]}}

var compareTestPartial = {"originalQuery":{"l":"2022,6,3","u":"Lorraine,Blaine,Brianna","d":"Jeff_M"},"rotationLabel":{"year":2022,"month":6,"version":3,"custom":"","mergedMonth":24270,"shortLabelString":""},"artists":{"up":["Lorraine","Lorraine","Blaine","Blaine","Brianna","Brianna"],"down":["Jeff M","Jeff M"],"feat":[]},"templateInfo":{"up":{"selectedTemplateBase":"u00","snapInches":18,"adjustments":[null,null,null,null,null,null,[]]},"down":{"selectedTemplateBase":"d00","snapInches":18,"adjustments":[null,null,[]]},"feat":{"selectedTemplateBase":"defaultA"},"legacyMode":true},"meta":{"appVersion":"v1","querySource":"from URL","queryIncomplete":true,"parseSuccessful":true,"warnings":["No featured artists found in query!"]}}

var compareTestNoMatch = {"originalQuery":{"l":"2013,1","u":"asdf,sdf","d":"fsdafasd","f":"lkkl-3D","x":"v2,snap20-18","t":"u01,","au":"x2,1"},"rotationLabel": {"year":2013,"month":1,"version":1,"custom":"","mergedMonth":24157,"shortLabelString":""},"artists":{"up":["asdf","asdf","sdf","sdf"],"down":["fsdafasd","fsdafasd"],"feat":[{"name":"lkkl","type":"3D"}]},"templateInfo":{"up":{"selectedTemplateBase":"u01","snapInches":"20","adjustments":[null,null,null,null,[]]},"down":{"selectedTemplateBase":"d00","snapInches":"18","adjustments":[null,null,[]]},"feat":{"selectedTemplateBase":"defaultA"},"legacyMode":false},"meta":{"appVersion":"v2","querySource":"from URL","queryIncomplete":null,"parseSuccessful":true,"warnings":[]}}

var checkMatchRotationLabel = function (goodRotation, testRotation) {
	var goodQuery = goodRotation.originalQuery;
	var testQuery = testRotation.originalQuery;
	var goodL = goodRotation.rotationLabel;
	var testL = testRotation.rotationLabel;
	var result = null;
	if (goodQuery.l && testQuery.l) {
		var goodMonth = goodL.month || 0;
		var goodYear = goodL.year || 0;
		var testMonth = testL.month || -1;
		var testYear = testL.year || -1;
		if (goodQuery.l === testQuery.l) {
			result = 'perfect'
		} else if (
			goodMonth === testMonth
			&& goodYear === testYear
		) {
			result = 'partial'
		} else {
			result = 'no'
		}
	} else {
		result = 'no'
	}
	return result;
};

var checkMatchRotationFloor = function (goodRotation, testRotation, floor) {
	var short = floor[0];
	var goodQuery = goodRotation.originalQuery;
	var testQuery = testRotation.originalQuery;
	var result = null;
	if (goodQuery[short] && testQuery[short]) {
		if (goodQuery[short] === testQuery[short]) {
			result = 'perfect'
		} else if (
			goodQuery[short].includes(testQuery[short])
			|| testQuery[short].includes(goodQuery[short])
		) {
			if (
				goodQuery[short].includes(',')
				&& testQuery[short].includes(',')
			) {
				result = 'partial'
			} else {
				result = 'inconclusive'
			}
		} else {
			result = 'no'
		}
	} else {
		if (goodQuery[short] === testQuery[short]) {
			result = 'perfect'
		} else {
			result = 'no'
		}
	}
	return result;
};

var checkMatchRotationOptional = function (goodRotation, testRotation, label) {
	var goodQuery = goodRotation.originalQuery;
	var testQuery = testRotation.originalQuery;
	var result = null;
	if (goodQuery[label] && testQuery[label]) {
		if (goodQuery[label] === testQuery[label]) {
			result = 'perfect'
		} else if (
			goodQuery[label].includes(testQuery[label])
			|| testQuery[label].includes(goodQuery[label])
		) {
			result = 'partial'
		} else {
			result = 'no'
		}
	} else if (!goodQuery[label] && !testQuery[label]) {
		result = 'inconclusive'
	} else {
		result = 'no'
	}
	return result;
};

var rotationMatchReport = function (good, test) {
	var matchChecks = {
		label: checkMatchRotationLabel(good, test),
		up: checkMatchRotationFloor(good, test, 'up'),
		down: checkMatchRotationFloor(good, test, 'down'),
		feat: checkMatchRotationFloor(good, test, 'feat'),
		bareMinimumMatch: null,
		au: checkMatchRotationOptional(good, test, 'au'),
		ad: checkMatchRotationOptional(good, test, 'ad'),
		x: checkMatchRotationOptional(good, test, 'x'),
		remainderMatch: null,
	};
	// BARE MINIMUM SUMMARY
	if (
		matchChecks.label === 'perfect'
		&& matchChecks.up === 'perfect'
		&& matchChecks.down === 'perfect'
		&& matchChecks.feat === 'perfect'
	) {
		matchChecks.bareMinimumMatch = 'perfect'
	} else if (
		matchChecks.label === 'no'
		&& (
			matchChecks.up === 'no'
			|| matchChecks.up === 'inconclusive'
		)
		&& (
			matchChecks.down === 'no'
			|| matchChecks.down === 'inconclusive'
		)
		&& matchChecks.feat === 'no'
	) {
		matchChecks.bareMinimumMatch = 'no'
	} else {
		matchChecks.bareMinimumMatch = 'partial'
	}
	// REMAINDER SUMMARY
	if (
		(
			matchChecks.au === 'perfect'
			|| matchChecks.au === 'inconclusive'
		)
		&& (
			matchChecks.ad === 'perfect'
			|| matchChecks.ad === 'inconclusive'
		)
		&& (
			matchChecks.x === 'perfect'
			|| matchChecks.x === 'inconclusive'
		)
	) {
		matchChecks.remainderMatch = 'perfect'
	} else if (
		(
			matchChecks.au === 'no'
			|| matchChecks.au === 'inconclusive'
		)
		&& (
			matchChecks.ad === 'no'
			|| matchChecks.ad === 'inconclusive'
		)
		&& (
			matchChecks.x === 'no'
			|| matchChecks.x === 'inconclusive'
		)
	) {
		matchChecks.remainderMatch = 'no'
	} else {
		matchChecks.remainderMatch = 'partial'
	}
	// ALL DONE
	return {
		testRotation: test,
		comparedRotation: good,
		matchChecks: matchChecks
	}
};

// checking whether a possibly-truncated URL is (likely) present in full in history:

var detectRotationPartialMatch = function (good, test) {
	var temp = rotationMatchReport(good, test);
	return temp.matchChecks.bareMinimumMatch !== 'no';
};

// checking duplicate rotations by their most important data alone:

var detectRotationPerfectMatch = function (good, test) {
	var temp = rotationMatchReport(good, test);
	return temp.matchChecks.bareMinimumMatch === 'perfect'
		&& temp.matchChecks.remainderMatch === 'perfect'
};

  //---------------------------------------------------//
 /*   COMPARING ONE ROTATION WITH ALL HISTORY ITEMS   */
//---------------------------------------------------//

var getRotationMatches = function (historyArray, testRotation) {
	var result = [];
	var historyArray = historyArray || makeFullHistory();
	historyArray.forEach(function (historyItem) {
		var partialMatch = detectRotationPartialMatch(historyItem, testRotation);
		if (partialMatch) {
			result.push(rotationMatchReport(historyItem, testRotation));
		}
	})
	return result;
};

var detectDuplicateRotationInHistory = function (historyArray, testRotation) {
	var result = false;
	historyArray.forEach(function (historyItem) {
		var match = detectRotationPerfectMatch(historyItem, testRotation);
		if (match) {
			result = true;
		}
	})
	return result;
};

var findHighestVersionForMonth = function (historyArray, year, month) {
	var latestVersionFound = 0;
	historyArray.forEach(function (rotation) {
		if (
			rotation.rotationLabel.month === month
			&& rotation.rotationLabel.year === year
		) {
			latestVersionFound = Math.max(rotation.rotationLabel.version, latestVersionFound);
		}
	});
	return latestVersionFound;
}

var isLatestRotationInHistory = function (historyArray, rotation) {
	var targetMonth = rotation.rotationLabel.month;
	var targetYear = rotation.rotationLabel.year;
	var targetVersion = rotation.rotationLabel.version;
	var highestVersion = findHighestVersionForMonth(historyArray, targetYear, targetMonth);
	var result = highestVersion <= targetVersion ? true : false;
	return result;
};

var incrementVersionNumberBasedOnHistory = function (historyArray, year, month) {
	return findHighestVersionForMonth(historyArray, year, month) + 1;
};

  //----------------------------------------//
 /*   INTERACTING WITH A NEW HISTORY ROW   */
//----------------------------------------//

var test = ['test', 'test', null, null, 'test'];
var literalTest = ['test', 'test', 'empty#3', 'empty#4', 'test'];
var miniTest = ['test']

var clearNameAtIndex = function (array, index) {
	var newArray = array.slice();
	newArray[index] = null;
	// console.log(`Cleared name at index ${index}`)
	return newArray;
};
var clearWholeNameAtIndex = function (array, sourceIndex) {
	var newArray = array.slice();
	// console.log('clearWholeNameAtIndex ' + sourceIndex)
	var indices = findPlacedIndicesFromIndexInArray(newArray, sourceIndex);
	indices.forEach(function (index) {
		newArray = clearNameAtIndex(newArray, index);
		// console.log('clearing index ' + index)
	})
	return newArray;
};
var insertNameAtIndex = function (array, index, name) {
	var newArray = array.slice();
	newArray[index] = name;
	// console.log(`Inserted ${name} at index ${index}`)
	return newArray;
};
var insertWholeNameAtIndex = function (array, index, name, length) {
	var newArray = array.slice();
	newArray = clearNameFromArray(newArray,name);
	var currIndex = index;
	for (var i = 0; i < length; i++) {
		// console.log("clearing name at index " + currIndex)
		if (currIndex !== null) {
			newArray = clearWholeNameAtIndex(newArray, currIndex);
			currIndex = incrementIndexInArray(newArray, currIndex);
		}
	}
	var currIndex = index;
	for (var i = 0; i < length; i++) {
		// console.log("inserting name at index " + currIndex)
		if (currIndex !== null) {
			newArray = insertNameAtIndex(newArray, currIndex, name);
			currIndex = incrementIndexInArray(newArray, currIndex);
		}
	}
	// It didn't work unless these were separate steps ¯\_(ツ)_/¯
	return newArray;
};
var incrementIndexInArray = function (array, index) {
	var newIndex = index + 1;
	if (newIndex === array.length) {
		newIndex = 0;
	}
	if (index === newIndex) {
		newIndex = null;
	}
	return newIndex;
};
var decrementIndexInArray = function (array, index) {
	var newIndex = index - 1;
	if (newIndex === - 1) {
		newIndex = array.length - 1;
	}
	if (index === newIndex) {
		newIndex = null;
	}
	return newIndex;
};
var findPlacedIndicesFromIndexInArray = function (array, index) {
	// NOTE: You must use the padded, dummy data array for this or it will wrap early
	if (array.length <= index) {
		console.error('findPlacedIndicesFromIndexInArray received an out of bound index!');
		console.error({array: array, index: index});
		return
	} else {
		var pc = incrementIndexInArray(array, index);
		if (pc === null) {
			// console.error('incrementIndexInArray returned null; array is 1 item long!')
			// console.error({array: array, index: index});
		} else {
			var result = [index];
			var targetName = array[index];
			if (!!targetName) {
				var nextName = array[pc];
				while (nextName === targetName) {
					result.push(pc);
					pc = incrementIndexInArray(array, pc);
					nextName = array[pc];
				}
				var pc = decrementIndexInArray(array, index);
				var nextName = array[pc];
					while (nextName === targetName) {
					result.push(pc);
					pc = decrementIndexInArray(array, pc);
					nextName = array[pc];
				}
			}
		}
		return result;
	}
};
var clearNameFromArray = function (newArray, name) {
	var newArray = newArray.slice();
	if (newArray.includes(name)) {
		var snipe = newArray.findIndex(function (item) { return item === name });
		while (snipe !== -1) {
			newArray = clearWholeNameAtIndex(newArray, snipe);
			snipe = newArray.findIndex(function (item) { return item === name });
		}
	}
	return newArray;
};
