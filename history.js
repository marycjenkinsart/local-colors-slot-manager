/* *-*-*-*   CREATING HISTORY DATA FROM ARCHIVED LINKS   *-*-*-*  */

var webAppHistory = [
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,6,3&u=Lorraine,Blaine,Brianna&d=Jeff_M.-1,Mary,Pam,J._Clay-1&f=Bill-2D-2&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,5&u=GUEST-1,J._Clay-1,Bill,Mary&d=Brianna,Pam,Lorraine,Blaine&f=Jeff_M.-2D-2&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,4&u=GUEST-1,Pam,Jan,Blaine,Lorraine&d=Mary,Jeff_M.,J._Clay-1,Bill&f=Brianna-3D&x=v2&t=u01,',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?l=2022,3&u=Blaine,Bill,J._Clay-1,Jeff_M.,Teri&d=Pam,Kyla,Lorraine,Jan&f=Mary-2D-2,Neena_(guest)-3D&x=v2&ad=x1,3,x1,6,x1,12',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2,3&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,Pam&d=Blaine,Lorraine,Bill,J._Clay-1,Jeff_M.,Teri',
//	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2,2&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,Pam&d=Blaine,Bill,J._Clay-1,Jeff_M.,Teri',
//	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2022,2&f=Group_show-group&u=GUEST-1,Kyla,Jan,Mary,J._Clay-1,Pam&d=Emily,Blaine,Bill,Jeff_M.,Teri'
];

var reconstructedHistory = [
	// 'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,12,2&u=GUEST-1,Bill,J._Clay-1,Jeff_M.,Emily,Blaine&d=(mix)-3,Pam,Mary,Jan,(mix)-1&f=Teri-2D-2&x=v2&t=u01,&au=x3,-6,x3,-9&ad=33,x1,52,x1,46,x1,31,x1,26',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,12&u=GUEST-1,Bill,J._Clay-1,Jeff_M.,Emily,Blaine&d=Adam-1,Nuha,Pam,Mary,Jan,Adam-1&f=Teri-2D-2&x=v2&t=u01,&au=x3,-6,x3,-9&ad=33,x1,52,x1,46,x1,31,x1,26',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,11&u=GUEST-1,Alicia,Mary,Teri,Adam,Nuha&d=J._Clay-1,Jeff_M.,Emily,Blaine,Bill,Jan&f=Pam-2D-2&x=v2&t=u01,&au=x4,-13,x1,-27,x1,-39&ad=10,x1,18,x1,11,x3,6',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,10,2&u=GUEST-1,J._Clay-1,Jeff_M.,Jan,Blaine,Bill&d=Teri,Adam,Nuha,Pam,Mary&f=Alicia-2D-2&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,-15,x1,-23,x1,-15,x1,-9',
//	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,10&u=GUEST-1,J._Clay-1,Jeff_M.,Jan,Blaine,Bill&d=Teri,Adam,Pam,Mary&f=Alicia-2D-2&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,-17,x1,-17,x1,-12',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,9&u=Mary,Teri,Karen,Pam,Alicia&d=Blaine,Bill,Jeff_M.,Adam,Jan,J._Clay-1&f=Perda-3D,Jamie_(guest)-3D&x=v2&t=u01,&au=x3,-6,x3,-21&ad=x1,33,x1,36,x1,27,x3,3',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,8,3&u=Jeff_M.,Adam,Blaine,Bill,J._Clay-1&d=Karen,Teri,Mary,Alicia,Pam&f=Jan-2D-2&x=v2&au=x1,-6,x1,-10,x1,-12&ad=x1,35,x1,39,x1,32,x1,21',
//	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,8,2&u=Teri,Adam,Blaine,Bill,J._Clay-1&d=Karen,Jeff_M.,Mary,Alicia,Pam&f=Jan-2D-2&x=v2&au=x1,-6,x1,-10,x1,-12&ad=x1,35,x1,39,x1,32,x1,21',
	'https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?l=2021,7&u=GUEST,Karen,Pam,Jeff_M.,Alicia,Mary&d=Bill,J._Clay-1,Blaine,Adam,Teri,Jan&f=Lawrence-3D&x=v2&t=u01,&au=x1,15,x1,27,x1,18,x1,9&ad=x1,18,18,x1,12'
];

var makeShareableLinkIntoRawQueries = function (string) {
	var relevant = string.split('view?')
	var queries = relevant[1].split('&'); // now array of strings for each query
	// u=GUEST,Karen,Pam,Jeff_M.,Alicia,Mary
	var result = {};
	queries.forEach(function (query) {
		var splits = query.split('=');
		result[splits[0]] = splits[1];
	});
	return result;
};

var makeHistoryRecordFromRawQuery = function (queriesObject, type) {
	return {
		rotationLabel: makeLabelUncompact(queriesObject.l),
		feat: makeCompactFeaturedUnfancy(queriesObject.f),
		up: makeCompactFloorUnfancy(queriesObject.u),
		down: makeCompactFloorUnfancy(queriesObject.d),
		type: type || 'default',
	};
};

var makeFullHistory = function () {
	var fullHistory = [];
	reconstructedHistory.forEach(function (rotation) {
		var rawQueries = makeShareableLinkIntoRawQueries(rotation);
		var historyRecord = makeHistoryRecordFromRawQuery(rawQueries,'reconstructed');
		fullHistory.push(historyRecord);
	})
	webAppHistory.forEach(function (rotation) {
		var rawQueries = makeShareableLinkIntoRawQueries(rotation);
		var historyRecord = makeHistoryRecordFromRawQuery(rawQueries,'web app');
		fullHistory.push(historyRecord);
	})
	fullHistory.sort(function (a, b) {
		return b.rotationLabel.version - a.rotationLabel.version;
	})
	fullHistory.sort(function (a, b) {
		return b.rotationLabel.month - a.rotationLabel.month;
	})
	fullHistory.sort(function (a, b) {
		return b.rotationLabel.year - a.rotationLabel.year;
	})
	return fullHistory;
};

/* *-*-*-*   INTERACTING WITH A NEW HISTORY ROW   *-*-*-*  */

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
	for (let i = 0; i < length; i++) {
		// console.log("clearing name at index " + currIndex)
		if (currIndex !== null) {
			newArray = clearWholeNameAtIndex(newArray, currIndex);
			currIndex = incrementIndexInArray(newArray, currIndex);
		}
	}
	var currIndex = index;
	for (let i = 0; i < length; i++) {
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
