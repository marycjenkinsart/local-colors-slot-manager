var currentAppVersion = "2.6"; // INFIX

var defaultSnapInches = 18;

var snapPriority = {
	up: 'last', // in a slot size tie, give preference to last slot(s)
	down: 'first',
};

  //-------------------//
 /*   GENERIC STUFF   */
//-------------------//

var getUnique = function (value, index, self) {
	return self.indexOf(value) === index; // thanks, stackOverflow
}; // e.g. Array.filter(getUnique);

var templateNumberToInches = function (number) {
	return number * 100 / 72;
};
var inchesToTemplateNumber = function (number) {
	return number * 72 / 100;
};

var limitedFloorNames = ['up','down'];

var scrollToTop = function () {
	window.scrollTo(0,0)
};

var clone = function (object) {
	return JSON.parse(JSON.stringify(object));
}

var capitalizeFirstChar = function (string) {
	var splits = string.split('');
	splits[0] = splits[0].toLocaleUpperCase();
	return splits.join('');
}

  //-------------------------------//
 /*   MONTHS, DATES, and LABELS   */
//-------------------------------//

var unmergeMergedMonth = function (mergedMonth) {
	var year = Math.floor(mergedMonth / 12);
	var month = mergedMonth % 12;
	if (month === 0) {
		year -= 1;
		month = 12;
	}
	return {
		year: year,
		month: month
	};
}

var shortMonthMap = [
	'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];
var longMonthMap = [
	"January" , "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
];

var getShortMonth = function (int) {
	return shortMonthMap[int - 1] || `?? (${int})`;
};
var getLongMonth = function (int) {
	return longMonthMap[int - 1] || `?? (${int})`;
};

var makeShortLabel = function (label) {
	if (label.custom) {
		return label.custom; // we're already done
	}
	var month = label.month;
	var year = label.year;
	if (!month || !year) {
		if (label.mergedMonth) {
			var unmerged = unmergeMergedMonth(label.mergedMonth);
			month = unmerged.month;
			year = unmerged.year;
		} else {
			throw new Error("Cannot makeShortLabel without complete date information!")
		}
	}
	result = `${getShortMonth(month)} ${year}`;
	if (label.version !== 1) {
		result = result + ` v${label.version}`;
	}
	return result;
}

var makeVeryShortLabel = function (label) {
	var month = label.month;
	var year = label.year;
	if (!month || !year) {
		if (label.mergedMonth) {
			var unmerged = unmergeMergedMonth(label.mergedMonth);
			month = unmerged.month;
			year = unmerged.year;
		} else {
			throw new Error("Cannot makeVeryShortLabel without complete date information!")
		}
	}
	year = year + '';
	var shortYear = year.substring(year.length-2);
	return `${getShortMonth(month)} '${shortYear}`;
}

  //--------------------------//
 /*   ARTIST DATA HANDLING   */
//--------------------------//

// unfancy = ['GUEST','test1','test1','test2','test3','test3']

// compact = 'GUEST-1,test1,test2-1,test3'

// fancy = [{
// 		"name": "test1",
// 		"slotSize": 1,
// 		"slotIndex": 1,
// 		"indices": [
// 			1,
// 			2
// 		]
// 	}]

var makeFloorFancy = function (array) {
	var result = [];
	var latest = '';
	array.forEach(function (halfSlot, index) {
		if (latest === halfSlot) {
			result[result.length-1].slotSize += 0.5;
		} else {
			result.push(
				{
					name: halfSlot,
					slotSize: 0.5,
					slotIndex: index
				}
			);
			latest = halfSlot;
		}
	})
	result.forEach(function (artistObject) {
		var indices = [];
		array.forEach(function (halfSlot, index) {
			if (artistObject.name === halfSlot) {
				indices.push(index);
			}
		})
		artistObject.indices = indices;
	})
	return result;
};
var makeFloorUnfancy = function (array) { // TODO: unused?
	var result = [];
	array.forEach(function (object) {
		var halfSlots = object.slotSize * 2;
		for (var index = 0; index < halfSlots; index++) {
			result.push(object.name);
		}
	})
	return result;
};
var makeFloorCompact = function (array) {
	var compactFloorArray = [];
	var fancy = makeFloorFancy(array);
	fancy.forEach(function (item) {
		var entry = item.name
		var halfSlots = item.slotSize * 2;
		if (halfSlots !== 2) {
			entry += '-' + halfSlots;
		}
		compactFloorArray.push(entry);
	})
	var compactFloor = compactFloorArray.join(',');
	return compactFloor;
};
var makeCompactFloorUnfancy = function (string) {
	var stringSplits = string.split(',');
	var result = [];
	stringSplits.forEach(function (fancyItem) {
		var innermostSplits = fancyItem.split('-');
		var name = innermostSplits[0].replace(/_/g, ' ');
		var count = parseInt(innermostSplits[1],10) || 2;
		while (count > 0) {
			result.push(name);
			count -= 1;
		}
	})
	return result;
};

var getAdjacentIndex = function (index, array, direction) {
	var count = array.length;
	return ((index + direction) + count) % count;
}
var findUpIndex = function (index, array) {
	return getAdjacentIndex(index, array, -1);
};
var findDownIndex = function (index, array) {
	return getAdjacentIndex(index, array, 1);
};

var contiguousIndicesReport = function (index, array) {
	var result = {
		indices: [ index ],
		up: {},
		down: {},
	};
	var testIndex = index;
	if (index >= array.length) {
		console.error("Attempting to detect contiguous indices for an out of bound index! (Index: " + index + ")");
		return null
	} else {
		// check clockwise
		for (var i = 0; i < array.length; i++) {
			testIndex = findDownIndex(testIndex, array);
			if (array[testIndex] === array[index]) {
				result.indices.push(testIndex);
			} else {
				result.down.neighbor = array[testIndex];
				result.down.index = testIndex;
				break
			}
		}
		// check counter-clockwise
		testIndex = index;
		for (var i = 0; i < array.length; i++) {
			testIndex = findUpIndex(testIndex, array);
			if (array[testIndex] === array[index]) {
				result.indices.unshift(testIndex);
			} else {
				result.up.neighbor = array[testIndex];
				result.up.index = testIndex;
				break
			}
		}
		return result;
	}
};

var moveSingleSlotOnce = function (index, array, direction) {
	direction = Math.sign(direction);
	var newArray = array.slice();
	var newIndex = getAdjacentIndex(index, array, direction);
	var insert = newArray[index];
	var swap = newArray[newIndex];
	newArray[index] = swap;
	newArray[newIndex] = insert;
	return newArray;
};

var moveSingleSlotMultiple = function (index, array, quantity) {
	var moveCount = Math.abs(quantity);
	var direction = Math.sign(quantity);
	var newArray = array.slice();
	for (var i = 0; i < moveCount; i++) {
		newArray = moveSingleSlotOnce(index, newArray, direction);
		index = getAdjacentIndex(index, array, direction);
	}
	return newArray;
}

var moveNameChunky = function (index, array, direction, skipName) {
	var sign = Math.sign(direction);
	var newArray = array.slice();
	var report = contiguousIndicesReport(index, array);
	var down = sign > 0;
	var neighborIndex = down ? report.down.index : report.up.index;
	var neighborReport = contiguousIndicesReport(neighborIndex, array);
	var extraSkip = array[neighborIndex] === skipName;
	var count = neighborReport.indices.length;
	var indices = report.indices;
	if (down) {
		indices.reverse();
	}
	indices.forEach(function (movingIndex) {
		newArray = moveSingleSlotMultiple(movingIndex, newArray, count * sign)
	})
	if (extraSkip) {
		var secondMoveIndex = neighborIndex;
		var secondMoveReport = contiguousIndicesReport(secondMoveIndex, newArray);
		var newNeighborIndex = down ? secondMoveReport.up.index : secondMoveReport.down.index;
		newArray = moveNameChunky(secondMoveIndex, newArray, direction);
		newArray = moveNameChunky(newNeighborIndex, newArray, direction);
	}
	return newArray;
};

  //---------------------------------//
 /*   OTHER ROUTER QUERY HANDLING   */
//---------------------------------//

// LABEL

//	compact = '2022,1,2,asdfasdf'

//	uncompact = {
//		month: 1,
//		year: 2022,
//		version: 2,
//		custom: "asdfasdf",
//	}

var makeLabelCompact = function (obj) {
	var result = obj.year + ',' + obj.month;
	if (
		obj.version !== 1
		|| obj.custom
	) {
		var version = obj.version || 1;
		result += ',' + version;
	}
	if (obj.custom) {
		result += ',' + obj.custom.replace(/ /g, '_');
	}
	return result;
};
var makeLabelUncompact = function (compactLabelString) {
	var result = {
		year: 1969,
		month: 12,
		version: 1337,
		custom: 'LABEL ERROR'
	};
	if (compactLabelString) {
		compactLabelString = compactLabelString.replace(/_/g, ' ');
		var targetSplits = compactLabelString.split(',')
		result = {
			year: parseInt(targetSplits[0],10) || 1970,
			month: parseInt(targetSplits[1],10) || 1,
			version: parseInt(targetSplits[2],10) || 1,
			custom: targetSplits[3] || '',
		}
		result.mergedMonth = result.year * 12 + result.month;
		result.shortLabelString = '';
		return result;
	} else {
		console.error('Label appears completely broken (or missing)!');
		return result;
	}
};

// FEATURED

// compact = 'Teri-2D-2'

// unfancy = [{
// 	name:'Teri',
// 	type: '2D',
// 	origSlotSize: 1,
// }]

var makeFeaturedCompact = function (featuredObject) {
	var compactFeaturedArray = [];
	featuredObject.forEach(function (item) {
		var parsedItemArray = [];
		if (item.type === '2D') {
			parsedItemArray.push(item.name);
			parsedItemArray.push(item.type);
			parsedItemArray.push(item.origSlotSize * 2);
		} else {
			parsedItemArray.push(item.name);
			parsedItemArray.push(item.type);
		}
		var parsedItem = parsedItemArray.join('-');
		compactFeaturedArray.push(parsedItem);
	})
	var result = compactFeaturedArray.join(',');
	return result;
};
var makeCompactFeaturedUnfancy = function (string) {
	var result = [];
	if (string.length > 0) {
		var stringSplits = string.split(',');
		stringSplits.forEach(function (fancyItem) {
			var innermostSplits = fancyItem.split('-');
			var name = innermostSplits[0].replace(/_/g, ' ');
			var type = innermostSplits[1];
			var artist = {
				name: name,
				type: type
			}
			if (innermostSplits[2]) {
				artist.origSlotSize = innermostSplits[2] / 2;
			}
			result.push(artist);
		})
	}
	return result;
};

// TEMPLATE

// adjustments: compact = 'x2,12,x1,18'
// adjustments: uncompact = [0, 0, 12, 0, 18]

var makeAdjustmentsCompact = function (_array) {
	var result = [];
	var zeroCount = 0;
	var array = _array || [];
	array.forEach(function (number) {
		if (number === 0) {
			zeroCount += 1;
		} else {
			if (zeroCount > 0) {
				result.push('x' + zeroCount);
				zeroCount = 0;
			}
			result.push(number);
		}
	})
	result = result.join(',');
	return result;
};
var makeAdjustmentsUncompact = function (string, length) {
	var result = [];
	string = string || '';
	if (string.length > 0) {
		var array = string.split(',');
		array.forEach(function (item) {
			var insert;
			if (item.includes('x')) {
				var count = parseInt(item.replace('x',''),10);
				for (var index = 0; index < count; index++) {
					result.push(0);
				}
			} else if (item.includes('-')) {
				insert = parseInt(item,10);
				result.push(insert);
			} else {
				insert = parseInt(item,10);
				result.push(insert);
			}
		})
	}
	result.fill(0, result.length, length);
	return result;
};

// ALL THE REST

var compactEverything = function (rotation) {
	rotation = clone(rotation);
	var compactLabel = makeLabelCompact(rotation.rotationLabel);
	var up = makeFloorCompact(rotation.artists.up);
	var down = makeFloorCompact(rotation.artists.down);
	var feat = makeFeaturedCompact(rotation.artists.feat);
	// flags stuff -- DETECT LEGACY MODE HERE
	var flags = [];
	if (rotation.templateInfo.legacyMode === false) {
		flags.push('v2');
	}
	var snapUp = parseInt(rotation.templateInfo.up.snapInches,10);
	var snapDown = parseInt(rotation.templateInfo.down.snapInches,10);
	if (
		snapUp !== defaultSnapInches
		|| snapDown !== defaultSnapInches
	) {
		var snaps = 'snap' + snapUp + '-' + snapDown;
		flags.push(snaps);
	}
	// if legacy mode is used, ignore custom template selection and adjustments:
	var result = 'l=' + compactLabel +
		'&u=' + up +
		'&d=' + down;
	if (rotation.artists.feat.length > 0) {
		result += '&f=' + feat;
	}
	if (flags.length > 0) {
		var joinedFlags = flags.join(',');
		result += '&x=' + joinedFlags;
	}
	if (flags.includes('v2')) {
		// custom template selection:
		var t = {};
		limitedFloorNames.forEach(function (floorName) {
			var shortName = 't' + floorName[0];
			var selected = rotation.templateInfo[floorName].selectedTemplateBase
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
			var halfSlotCount = rotation.artists[floorName].length;
			var shortName = 'a' + floorName[0];
			var adjustments = rotation.templateInfo[floorName].adjustments[halfSlotCount];
			var shortValue = makeAdjustmentsCompact(adjustments);
			if (shortValue.length > 0) {
				result += '&' + shortName + '=' + shortValue;
			}
		})
	}
	result = result.replace(/ /g, '_');
	return result;
};

var generateURLFromCompactEverything = function (compactString) {
	var prefix = "https://marycjenkinsart.github.io/local-colors-slot-manager/"
	var infix = "?v" + currentAppVersion;
	// the "infix" does nothing apart from ensuring the client treats the URL as a fresh destination
	// otherwise caches can interfere with the preview's apperance (without anything appearing to be broken)
	var suffix = "#/view?"
	return prefix + infix + suffix + compactString;
}

// a quick bodge

var generateQueryFromRotation = function (rotation) {
	var link = generateURLFromCompactEverything(compactEverything(rotation));
	result = makeShareableLinkIntoRawQuery(link);
	return result;
};

  //---------------------------------//
 /*   ROUTER QUERY INTERPRETATION   */
//---------------------------------//

// https://marycjenkinsart.github.io/local-colors-slot-manager/?v2#/view?
// l=2022,3&u=Blaine,Bill,J._Clay-1,Jeff_M.,Teri&d=Pam,Kyla,Lorraine,Jan&f=Mary-2D-2,Neena_(guest)-3D&x=v2&ad=x1,3,x1,6,x1,12

var makeQueryObjectFromLink = function (string) {
	var result = {};
	var fullSplits = string.split('#');
	string = string.replace(fullSplits[0],'').replace('#/view?','');
	var querySplits = string.split('&');
	querySplits.forEach(function (segment) {
		var splits = segment.split('=');
		result[splits[0]] = splits[1];
	})
	return result;
};

var emptyRotationObject = {
	originalQuery: {},
	rotationLabel:  {
		year: 1969,
		month: 1,
		version: 255,
		custom: 'Rotation label not found',
	},
	artists: {
		up: ['upArtist'],
		down: ['downArtist'],
		feat: [],
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
		appVersion: null,
		querySource: 'not specified',
		queryIncomplete: null,
		parseSuccessful: null,
		warnings: [],
	},
};

var makeRotationObjectFromQuery = function (queryObject, querySource) {
	// setting things up
	var result = clone(emptyRotationObject);
	result.originalQuery = clone(queryObject);
	// parse label
	if (queryObject.l) {
		result.rotationLabel = makeLabelUncompact(queryObject.l);
	} else {
		result.meta.queryIncomplete = true;
		result.meta.warnings.push('No label found in query!');
	}
	// parse featured
	if (queryObject.f) {
		result.artists.feat = makeCompactFeaturedUnfancy(queryObject.f);
	} else {
		result.meta.queryIncomplete = true;
		result.meta.warnings.push('No featured artists found in query!');
	}
	// parse upstairs
	if (queryObject.u) {
		result.artists.up = makeCompactFloorUnfancy(queryObject.u);
	} else {
		result.meta.queryIncomplete = true;
		result.meta.warnings.push('No upstairs artists found in query!');
	}
	// parse downstairs
	if (queryObject.d) {
		result.artists.down = makeCompactFloorUnfancy(queryObject.d);
	} else {
		result.meta.queryIncomplete = true;
		result.meta.warnings.push('No downstairs artists found in query!');
	}
	// populate adjustments
	// IMPORTANT: the uncompacted adjustments array gets inserted in an array
	// at the index for the half slot count (so adjustments get blanked out if
	// the slot quantity changes, but returns if the slot quantity changes back!)
	var upHalfSlots = result.artists.up.length;
	result.templateInfo.up.adjustments[upHalfSlots] =
		makeAdjustmentsUncompact(queryObject.au, upHalfSlots);
	var downHalfSlots = result.artists.down.length;
	result.templateInfo.down.adjustments[downHalfSlots] =
		makeAdjustmentsUncompact(queryObject.ad, downHalfSlots);
	// populate templates (if encoded in query)
	if (queryObject.t) {
		var splits = queryObject.t.split(',');
		if (splits.length >= 1 && splits[0].length > 0) {
			result.templateInfo.up.selectedTemplateBase = splits[0];
		}
		if (splits.length >= 2 && splits[1].length > 0) {
			result.templateInfo.down.selectedTemplateBase = splits[1];
		}
	}
	// determine app version
	var upExists = !!queryObject.u;
	var downExists = !!queryObject.d;
	if (!upExists || !downExists) { // failed to find bare minimum query data = use v2
		result.meta.appVersion = 'v2';
	} else { // otherwise assume v1
		result.meta.appVersion = 'v1';
	}
	// determine flags
	if (queryObject.x) {
		var flags = queryObject.x.split(',');
		if (flags.includes('v2')) { // explicitly v2 (overrides above)
			result.meta.appVersion = 'v2';
		}
		flags.forEach(function (flag) {
			if (flag.includes('snap')) {
				var fSplits = flag.replace('snap','').split('-');
				result.templateInfo.up.snapInches = fSplits[0];
				result.templateInfo.down.snapInches = fSplits[1];
			}
		})
	}
	// wrapup stuff
	if (result.meta.appVersion === 'v1') {
		result.templateInfo.legacyMode = true;
	}
	result.meta.parseSuccessful = true; // probably lol
	result.meta.querySource = querySource || 'not specified';
	return result;
};

  //-----------------------------//
 /*   LINE & COORDINATE STUFF   */
//-----------------------------//

var getLengthFromLineCoords = function (l) { // l = lineObj
	var result = Math.pow((l.x2 - l.x1), 2) + Math.pow((l.y2 - l.y1), 2);
	result = Math.sqrt(Math.abs(result));
	return result;
};

var getNormalizedTangent = function (lineObj) {
	var difX = lineObj.x2 - lineObj.x1;
	var difY = lineObj.y2 - lineObj.y1;
	var reversal = lineObj.ccw ? -1 : 1;
	var xForTangent = reversal * difY;
	var yForTangent = reversal * -difX;
	var tangentRadians = Math.atan2(yForTangent, xForTangent);
	return {
		x: Math.cos(tangentRadians),
		y: Math.sin(tangentRadians)
	};
};

var cutLineAtDistance = function (lineObj, distance) {
	var difX = lineObj.x2 - lineObj.x1;
	var difY = lineObj.y2 - lineObj.y1;
	var angleInRadians = Math.atan2(difY, difX);
	var splitPoint = {
		x: Math.cos(angleInRadians) * distance + lineObj.x1,
		y: Math.sin(angleInRadians) * distance + lineObj.y1,
	}
	var lineA = clone(lineObj);
	var lineB = clone(lineObj);
	lineA.x2 = splitPoint.x;
	lineA.y2 = splitPoint.y;
	lineB.x1 = splitPoint.x;
	lineB.y1 = splitPoint.y;
	var result = [
		lineA,
		lineB,
	]
	return result;
}

var makeFusedLine = function (line1, line2, addendum) {
	var adjustments = {
		x1: line1.x1,
		y1: line1.y1,
		x2: line2.x2,
		y2: line2.y2,
		origLine1: line1,
		origLine2: line2,
	};
	var result = Object.assign(
		{},
		line1,
		line2,
		adjustments,
		addendum || {}
	);
	return result;
}

  //-----------------------//
 /*   SVG DRAWING STUFF   */
//-----------------------//

var colorMap = { // unique artists, not slot count
	count1: [
		'color-01', // red
	],
	count2: [
		'color-01', // red
		'color-15', // blue
	],
	count3: [
		'color-01', // red
		'color-15', // blue
		'color-19', // purple
	],
	count4: [
		'color-01', // red
		'color-04', // golden orange
		'color-15', // blue
		'color-19', // purple
	],
	count5: [
		'color-01', // red
		'color-04', // golden orange
		'color-10', // green
		'color-15', // blue
		'color-19', // purple
	],
	count6: [
		'color-01', // red
		'color-04', // golden orange
		'color-10', // green
		'color-15', // blue
		'color-19', // purple
		'color-22', // dark magenta 
	],
	count7: [
		'color-01', // red
		'color-04', // golden orange
		'color-10', // green
		'color-13', // cyan
		'color-17', // indigo blue
		'color-19', // purple
		'color-22', // dark magenta 
	],
	count8: [
		'color-01', // red
		'color-04', // golden orange
		'color-08', // lime green
		'color-11', // deep green
		'color-14', // medium blue
		'color-17', // indigo blue
		'color-19', // purple
		'color-22', // dark magenta 
	],
	count9: [
		'color-02', // orange red
		'color-05', // golden yellow
		'color-08', // lime green
		'color-11', // deep green
		'color-14', // medium blue
		'color-17', // indigo blue
		'color-19', // purple
		'color-21', // red-purple
		'color-23', // magenta 
	],
};

var lineToLeftRectangle = function (coords, width) {
	var normalizedTangent = getNormalizedTangent(coords);
	var xExtension = normalizedTangent.x * width;
	var yExtension = normalizedTangent.y * width;
	var result = clone(coords);
	result.x3 = result.x2 + xExtension;
	result.y3 = result.y2 + yExtension;
	result.x4 = result.x1 + xExtension;
	result.y4 = result.y1 + yExtension;
	return result;
};
var lineToRightLineAtOrigin = function (coords, length, originX, originY) {
	var normalizedTangent = getNormalizedTangent(coords);
	var xExtension = normalizedTangent.x * length;
	var yExtension = normalizedTangent.y * length;
	var result = {
		x: originX - xExtension,
		y: originY - yExtension,
	};
	return result;
};

var textLabelOrigin = function (coords, spacing) {
	var midpointLength = getLengthFromLineCoords(coords) / 2;
	var lineHalves = cutLineAtDistance(coords, midpointLength);
	var x = lineHalves[1].x1;
	var y = lineHalves[1].y1;
	var result = lineToRightLineAtOrigin(lineHalves[1], spacing, x, y);
	if (
		Math.abs(coords.y1 - coords.y2) < 0.01
		&& coords.x1 > coords.x2
	) {
		result.y = result.y + spacing * 0.75;
	}
	return result;
};

var textLabelRotation = function (coords, x, y) {
	var tanCoords = getNormalizedTangent(coords);
	var radians = Math.atan2(tanCoords.y, tanCoords.x);
	var degrees = (radians * 180 / Math.PI + 90).toFixed(0);
	var result = 'rotate(' + degrees + ',' + x + ',' + y + ')';
	if (
		Math.abs(coords.y1 - coords.y2) < 0.01
		&& coords.x1 > coords.x2
	) {
		result = '';
	}
	return result;
}
var measurementLabelRotation = function (coords, x, y) {
	var tanCoords = getNormalizedTangent(coords);
	var radians = Math.atan2(tanCoords.y, tanCoords.x);
	var degrees = (radians * 180 / Math.PI + 90).toFixed(0) - 180; // quick fix for ccw
	var result = 'rotate(' + degrees + ',' + x + ',' + y + ')';
	if (
		Math.abs(coords.y1 - coords.y2) < 0.01
		&& coords.x1 > coords.x2
	) {
		result = 'translate(0,6)';
	}
	return result;
}

  //--------------------------//
 /*   ARTIST SLOT METADATA   */
//--------------------------//

var featLinesTotal = function (featRawLines) {
	var rawSum = featRawLines.map(function (rawLine) {
		return getLengthFromLineCoords(rawLine);
	});
	var result = rawSum.reduce(function (prev, cur) {
		return prev + cur;
	});
	return result;
};

var getArtistsPar = function (artists, halfSlotSize, snappedFusedSlotsFlat) {
	var fancy = makeFloorFancy(artists); // source info
	var floorResult = {};
	// tallying artist slot size *on that floor*, including wrapped slots
	Object.values(fancy).forEach(function (artist) {
		floorResult[artist.name] = floorResult[artist.name] || {};
		var artistResult = floorResult[artist.name];
		var slotSize = artistResult.slotSize || 0;
		slotSize += artist.slotSize;
		artistResult.slotSize = slotSize;
	})
	// same as above, but tallying the actual size of the half slots
	snappedFusedSlotsFlat.forEach(function (lineSegment) {
		floorResult[lineSegment.name].slotTotal = floorResult[lineSegment.name].slotTotal || 0;
		floorResult[lineSegment.name].slotTotal += getLengthFromLineCoords(lineSegment);
	})
	Object.values(fancy).forEach(function (artist) {
		var artistData = floorResult[artist.name];
		artistData.par = artistData.slotSize * halfSlotSize * 2;
		artistData.overPar = artistData.slotTotal - artistData.par;
	})
	return floorResult;
};


  //-------------------------------------------//
 /*   WIZARD QUIZ + ROTATION = NEW ROTATION   */
//-------------------------------------------//

var applyWizardQuizAnswersToRotation = function (quizAnswers, origRot) {
	var working = clone(origRot);
	working.quizResults = {};
	working.quizOptions = {};
	var rawMergedMonth = quizAnswers.rotationMergedMonthDif +
		origRot.rotationLabel.mergedMonth;
	// set working label
	working.rotationLabel.mergedMonth = rawMergedMonth;
	var unMerged = unmergeMergedMonth(working.rotationLabel.mergedMonth);
	working.rotationLabel.month = unMerged.month;
	working.rotationLabel.year = unMerged.year;
	// swap floors
	if (quizAnswers.swapFloors === true) {
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
	var featuredType = quizAnswers.featuredType;
	var featured2DName = quizAnswers.featured2DName;
	var featured3DName = quizAnswers.featured3DName;
	var featuredGroupTheme = quizAnswers.featuredGroupTheme;
	var newFeatured = origRot.artists.feat;
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
	var departingArtists = quizAnswers.departingArtists;
	var departingOptions = Object.keys(fusedArtistTable)
		.filter(getUnique)
	// inserting artists that are in limbo
	var arrivingArtists = quizAnswers.arrivingArtists;
	arrivingArtists.forEach(function (artistName) {
		fusedArtistTable[artistName] = {
			name: artistName,
			slotSize: 1,
			displaySlotSize: '1',
			location: 'limbo',
		}
	})
	//Remove artists from the fusedArtistTable that are explicitly departing
	departingArtists.forEach(function (departingName) {
		delete fusedArtistTable[departingName];
	})
	// slot size changes
	var origSlotSizeOptions = {};
	Object.keys(fusedArtistTable).forEach(function (artistName) {
		origSlotSizeOptions[artistName] = fusedArtistTable[artistName].slotSize;
	})
	var artistSlotSizeChanges = quizAnswers.artistSlotSizeChanges;
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
	var limboAssignments = quizAnswers.newArtistsNewFloor
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
	var overrides = quizAnswers.artistFloorAssignmentOverrides;
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
	var guestPresent = quizAnswers.guestPresent;
	var guestSharesFeatured = quizAnswers.guestSharesFeatured;
	working.quizResults.insertGuest = guestPresent && !guestSharesFeatured;
	working.quizResults.feat = newFeatured;
	working.quizResults.up = [];
	working.quizResults.down = [];
	Object.values(fusedArtistTable).forEach(function (object) {
		if (object.location === 'up' || object.location === 'down') {
			working.quizResults[object.location].push(object);
		}
	})
	working.orig = origRot;
	return working;
};

var prepareRawUnfilteredNames = function (quizResultsFloor) {
	var result = quizResultsFloor.map(function (item) {
		return {
			name: item.name,
			displayName: makePrintName(item.name, item.slotSize),
			slotSize: item.slotSize,
		};
	})
	return result;
}

  //----------------------//
 /*   LINE INTERATIONS   */
//----------------------//

var getBaselineHalfSlots = function (templateArray, unfancyArtists, adjustmentsArray) {
	if (
		adjustmentsArray
		&& adjustmentsArray.length !== unfancyArtists.length
	) {
		console.error('Adjustment and artist length mismatch!');
		console.error({
			template: templateArray,
			artists: unfancyArtists,
			adjustments: adjustmentsArray
		});
	}
	var totalHangingLength = templateArray
		.map(function (item) {
			return getLengthFromLineCoords(item);
		})
		.reduce(function (prev, cur) {
			return prev + cur;
		});
	var halfSlotCount = unfancyArtists.length;
	var halfSlotLength = totalHangingLength / halfSlotCount;
	var practicalHalfSlotLengths = [];
	var beginning = 0;
	var end = 0;
	var adjustmentPrev = 0;
	for (var index = 0; index < halfSlotCount; index++) {
		var adjustmentCurr = adjustmentsArray && adjustmentsArray[index] || 0;
		adjustmentCurr = inchesToTemplateNumber(adjustmentCurr);
		end += halfSlotLength + adjustmentCurr - adjustmentPrev;
		var practicalHalfSlot = {
			beginning: beginning,
			end: end,
			size: end - beginning,
			name: unfancyArtists[index],
		}
		practicalHalfSlotLengths.push(practicalHalfSlot);
		beginning = end;
		adjustmentPrev = adjustmentCurr;
	}
	return practicalHalfSlotLengths;
	// [
	// 	{
	// 		"beginning": 0,
	// 		"end": 63.900000000000006,
	// 		"size": 63.900000000000006,
	// 		"name": "Blaine"
	// 	},
	// ]
}

var getAdjustedHalfSlotLengths = function (templatesToDraw, artists, adjustments) {
	var halfSlotCount = artists.length;
	// guaranteeing there's something there:
	adjustments[halfSlotCount] = adjustments[halfSlotCount] || [];
	var emptyFrom = adjustments[halfSlotCount].length;
	adjustments[halfSlotCount].length = halfSlotCount;
	adjustments[halfSlotCount].fill(0,emptyFrom);
	// the real work:
	var adjustmentsArray = adjustments[halfSlotCount];
	var result = getBaselineHalfSlots(
		templatesToDraw,
		artists,
		adjustmentsArray
	);
	return result;
};

// A reminder: the templates look like this:
// [
// 	{
// 	   "x1": 135.8,
// 	   "y1": 351.9,
// 	   "x2": 135.8,
// 	   "y2": 392.6
// 	},
// 	{
// 	   "x1": 121.2,
// 	   "y1": 392.6,
// 	   "x2": 80.8,
// 	   "y2": 392.6
// 	}
//  ]

var makeComplexLines = function (templateArray, baselineHalfSlots) {
	var lines = clone(templateArray);
	var artists = clone(baselineHalfSlots);
	var combinedLines = [];
	var pc = -1;
	var shiftLine = function () {
		pc += 1;
		return lines.shift();
	};
	var insert;
	var unshiftLine = function (insert) {
		pc -= 1;
		return lines.unshift(insert);
	};
	while (artists.length > 0 && lines.length > 0) {
		if (artists[0].size > getLengthFromLineCoords(lines[0])) {
			artists[0].size -= getLengthFromLineCoords(lines[0]);
			insert = shiftLine();
			insert.name = artists[0].name;
			combinedLines[pc] = combinedLines[pc] || [];
			combinedLines[pc].push(insert);
		} else {
			var workingLine = shiftLine();
			var splits = cutLineAtDistance(workingLine, artists[0].size);
			insert = splits[0];
			insert.name = artists[0].name;
			combinedLines[pc] = combinedLines[pc] || [];
			combinedLines[pc].push(insert);
			unshiftLine(splits[1]);
			artists.shift();
		}
	}
	while (lines.length > 0) {
		insert = shiftLine();
		var lastArtistName = baselineHalfSlots[baselineHalfSlots.length-1].name;
		insert.name = lastArtistName;
		combinedLines[pc] = combinedLines[pc] || [];
		combinedLines[pc].push(insert);
	}
	// Cleaning up floating edge math
	var lastEntry = combinedLines[combinedLines.length-1];
	var lastEntryEnd = lastEntry[lastEntry.length-1];
	if (getLengthFromLineCoords(lastEntry) < 0.0001) {
		var lastEntryPenultimate = lastEntry[lastEntry.length-2];
		lastEntryPenultimate.x2 = lastEntryEnd.x2;
		lastEntryPenultimate.y2 = lastEntryEnd.y2;
		lastEntry.pop();
	}
	return combinedLines;
	// Result is an array of arrays:
	//[
	// [
	// 	{
	// 		"x1": 167.6,
	// 		"y1": 41.8,
	// 		"x2": 167.6,
	// 		"y2": 46.39999999999982,
	// 		"name": "J. Clay"
	// 	},
	// 	{
	// 		"x1": 167.6,
	// 		"y1": 46.39999999999982,
	// 		"x2": 167.6,
	// 		"y2": 107.3,
	// 		"name": "Jeff M."
	// 	}
	// ],
	//]
};

var fuseComplexLinesByArtist = function (complexSlotsArray) {
	var fusedSlots = clone(complexSlotsArray);
	var extractNames = function (sharedLine) {
		return sharedLine.map(function (line) {
			return line.name;
		});
	}
	fusedSlots.forEach(function (sharedLine) {
		var totalLength = extractNames(sharedLine).length;
		var uniqueLength = extractNames(sharedLine).filter(getUnique).length;
		while (totalLength > uniqueLength) {
			for (var index = 1; index < sharedLine.length; index++) {
				if (sharedLine[index].name === sharedLine[index-1].name) {
					var fusion = makeFusedLine(
						sharedLine[index-1],
						sharedLine[index],
						{
							name: sharedLine[index].name
						}
					);
					sharedLine[index-1] = fusion;
					sharedLine.splice(index,1);
					totalLength = extractNames(sharedLine).length;
					uniqueLength = extractNames(sharedLine).filter(getUnique).length;
					break
				}
			}
		}
	})
	return fusedSlots;
	// [
	// 	[
	// 		{
	// 			"x1": 121.2,
	// 			"y1": 392.6,
	// 			"x2": 80.8,
	// 			"y2": 392.6,
	// 			"name": "Bill"
	// 		}
	// 	],
	// 	[
	// 		{
	// 			"x1": 51.2,
	// 			"y1": 392.6,
	// 			"x2": 51.2,
	// 			"y2": 369.6,
	// 			"name": "Bill",
	// 			"origLine1": {
	// 				"x1": 51.2,
	// 				"y1": 392.6,
	// 				"x2": 51.2,
	// 				"y2": 373.28571428571433,
	// 				"name": "Bill"
	// 			},
	// 			"origLine2": {
	// 				"x1": 51.2,
	// 				"y1": 373.28571428571433,
	// 				"x2": 51.2,
	// 				"y2": 369.6,
	// 				"name": "Bill"
	// 			}
	// 		}
	// 	]
	// ]
};

var snapLast = function (_lineSegmentPieces) {
	var lineSegmentPieces = clone(_lineSegmentPieces);
	var penultimate = lineSegmentPieces[lineSegmentPieces.length - 2];
	var last = lineSegmentPieces[lineSegmentPieces.length - 1];
	var fusion = makeFusedLine( // last segment is snapped (removed)
		penultimate,
		last,
		{ name: penultimate.name }
	);
	lineSegmentPieces.splice(
		(lineSegmentPieces.length - 2),
		2,
		fusion
	);
	return lineSegmentPieces;
};
var snapFirst = function (_lineSegmentPieces) {
	var lineSegmentPieces = clone(_lineSegmentPieces);
	var first = lineSegmentPieces[0];
	var second = lineSegmentPieces[1];
	var fusion = makeFusedLine( // first segment is snapped (removed)
		first,
		second,
		{ name: second.name }
	);
	lineSegmentPieces.splice(
		0,
		2,
		fusion
	);
	return lineSegmentPieces;
};
var snapShortSegments = function (_lineSegmentPieces, threshold, priority) {
	var lineSegmentPieces = clone(_lineSegmentPieces);
	var arrayLength = lineSegmentPieces.length;
	if (arrayLength > 1) {
		var firstLengthShort = getLengthFromLineCoords(lineSegmentPieces[0]) < threshold;
		var lastLengthShort = getLengthFromLineCoords(lineSegmentPieces[arrayLength - 1]) < threshold;
		// if exactly two segments
		if (arrayLength === 2) {
			if (
				(firstLengthShort && !lastLengthShort)
				|| (firstLengthShort && lastLengthShort && priority === 'last')
			) {
				lineSegmentPieces = snapFirst(lineSegmentPieces);
			} else if (
				(lastLengthShort && !firstLengthShort)
				|| (lastLengthShort && firstLengthShort && priority === 'first')
			) {
				lineSegmentPieces = snapLast(lineSegmentPieces);
			}
		} else {
			if (firstLengthShort) {
				lineSegmentPieces = snapFirst(lineSegmentPieces);
			}
			if (lastLengthShort) {
				lineSegmentPieces = snapLast(lineSegmentPieces);
			}
		}
	}
	return lineSegmentPieces;
};

var snapAllShortSegments = function (_complexSlots, threshold, priority) {
	var complexSlots = clone(_complexSlots);
	for (var index = 0; index < complexSlots.length; index++) {
		complexSlots[index] = snapShortSegments(complexSlots[index], threshold, priority);
	}
	return complexSlots;
};

var getSnappedFusedSlots = function () {
	// TODO move this
};

var getSnappedFusedSlotsFlat = function () {
	// TODO move this also
};

var getSnappedFusedSlotsNeedingLabels = function (lineArrayArray) {
	floorResults = [];
	lineArrayArray.forEach(function (lines) {
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
	return floorResults;
};

var getEdgesFromComplexLines = function (complexLines) {
	var points = [];
	complexLines.forEach(function (lineSegment) {
		for (var index = 1; index < lineSegment.length; index++) {
			var point = {
				x: lineSegment[index].x1,
				y: lineSegment[index].y1,
				line1: lineSegment[index-1],
				line2: lineSegment[index],
			}
			points.push(point);
		}
	})
	return points;
};

// for determining which mini line segments need labels:
var reconstructOrigLine = function (lineSegments) {
	return {
		x1: lineSegments[0].x1,
		y1: lineSegments[0].y1,
		x2: lineSegments[lineSegments.length - 1].x2,
		y2: lineSegments[lineSegments.length - 1].y2,
	};
};
var measureLineAgainstLongLine = function (line, longLine) {
	var topTestLine = {
		x1: longLine.x1,
		y1: longLine.y1,
		x2: line.x2,
		y2: line.y2,
	};
	var botTestLine = {
		x1: line.x1,
		y1: line.y1,
		x2: longLine.x2,
		y2: longLine.y2,
	};
	var topDistance = getLengthFromLineCoords(topTestLine);
	var botDistance = getLengthFromLineCoords(botTestLine);
	var newLineData = Object.assign(
		{},
		line,
		{
			longLine: longLine,
			topDistance: topDistance,
			botDistance: botDistance,
			topTestLine: topTestLine,
			botTestLine: botTestLine,
		}
	);
	return newLineData;
};

  //-------------------//
 /*   MISCELLANEOUS   */
//-------------------//

var testYear1 = {
	year: 2021,
	month: 1,
	version: 3,
};
var testYear2 = {
	year: 2022,
	month: 11,
	version: 1,
};
var testYear3 = {
	year: 2022,
	month: 12,
	version: 1,
};
var testYear4 = {
	year: 2022,
	month: 12,
	version: 2,
};

var compareLabelAges = function (first, second) {
	if (first.year > second.year) {
		return 1;
	} else if (first.year < second.year) {
		return -1;
	} else {
		if (first.month > second.month) {
			return 1;
		} else if (first.month < second.month) {
			return -1;
		} else {
			if (first.version > second.version) {
				return 1;
			} else if (first.version < second.version) {
				return -1;
			} else {
				return 0;
			}
		}
	}
};

var getLongLabel = function (labelObject, omitVersion) {
	// TODO: bring this in line with the other monthmap stuff
	var year = labelObject.year || 1970;
	var month = labelObject.month || 13;
	var version = labelObject.version || 1;
	var custom = labelObject.custom || '';
	var result = '';
	if (custom.length) {
		result = custom;
	} else {
		var monthName = shortMonthMap[parseInt(month,10) - 1] || 'ERROR';
		result = monthName + ' ' + year
		if (version > 1 && !omitVersion) {
			result += ' v' + version;
		}
	}
	return result;
};

var makeSlotCountPretty = function (number) {
	var result = number + '';
	result = result.replace('.5', '½')
	if (number === 0.5) {
		result = result.replace('0','');
	}
	return result;
};

var makePrintName = function (name, slotSize) {
	var printName = name;
	if (slotSize !== 1) {
		var printSlot = makeSlotCountPretty(slotSize);
		printName += ' (' + printSlot + ')';
	}
	return printName;
};

var makeFeaturedPrintName = function (name, type) {
	return name += ' (' + type + ')';
};

var getSlotSizeParReport = function (actual, par) {
	var inches = actual;
	var isOverPar = actual >= par;
	var prefix = isOverPar ? '+' : '';
	var result = {
		isOverPar: isOverPar,
		color: isOverPar ? 'green' : 'red',
		inches: inches,
		feet: (inches / 12).toFixed(1),
		inchesOverPar: inches - par,
		feetOverPar: ((inches - par) / 12).toFixed(1),
		percent: (100 * inches / par).toFixed(0),
	};
	result.inchesOverParPrint = prefix + result.inchesOverPar + '"';
	result.feetOverParPrint = prefix + result.feetOverPar + "'";
	return result;
};
