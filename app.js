  //-------------------//
 /*   GENERIC STUFF   */
//-------------------//

var makeUnderscoresSpaces = function (string) { // (replaceAll not compatible with iOS <13)
	while (string.includes('_')) {
		string = string.replace('_',' ');
	}
	return string;
};
var makeSpacesUnderscores = function (string) { // (replaceAll not compatible with iOS <13)
	while (string.includes(' ')) {
		string = string.replace(' ','_');
	}
	return string;
}

var getUnique = function (value, index, self) {
	return self.indexOf(value) === index; // thanks, stackOverflow
}; // e.g. Array.filter(getUnique);

var templateNumberToInches = function (number) {
	return number * 100 / 72;
};
var inchesToTemplateNumber = function (number) {
	return number * 72 / 100;
};

  //--------------------------//
 /*   ARTIST DATA HANDLING   */
//--------------------------//

var makeFancy = function (array) {
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
	// actually need index for actual slot being selected
	return result;
};
var makeUnfancy = function (array) { // TODO: not used anywhere?
	var result = [];
	array.forEach(function (object) {
		var halfSlots = object.slotSize * 2;
		for (let index = 0; index < halfSlots; index++) {
			result.push(object.name);
		}
	})
	return result;
};

  //---------------------------//
 /*   ROUTER QUERY HANDLING   */
//---------------------------//

var makeLabelCompact = function (obj) {
	var customLabel = makeSpacesUnderscores(obj.custom);
	var result = obj.year + ',' + obj.month;
	if (
		obj.version !== 1
		|| customLabel
	) {
		var version = obj.version || 1;
		result += ',' + version;
	}
	if (customLabel) {
		result += ',' + customLabel;
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
		compactLabelString = makeUnderscoresSpaces(compactLabelString);
		var targetSplits = compactLabelString.split(',')
		result = {
			year: parseInt(targetSplits[0],10) || 1970,
			month: parseInt(targetSplits[1],10) || 1,
			version: parseInt(targetSplits[2],10) || 1,
			custom: targetSplits[3] || '',
		}
		return result;
	} else {
		console.error('Label appears completely broken (or missing)!');
		return result;
	}
};
var makeFloorCompact = function (array) {
	var compactFloorArray = [];
	var fancy = makeFancy(array);
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
var makeCompactFloorUnfancy = function (string) {
	var stringSplits = string.split(',');
	var result = [];
	stringSplits.forEach(function (fancyItem) {
		var innermostSplits = fancyItem.split('-');
		var name = makeUnderscoresSpaces(innermostSplits[0]);
		var count = parseInt(innermostSplits[1],10) || 2;
		while (count > 0) {
			result.push(name);
			count -= 1;
		}
	})
	return result;
};
var makeCompactFeaturedUnfancy = function (string) {
	var stringSplits = string.split(',');
	var result = [];
	stringSplits.forEach(function (fancyItem) {
		var innermostSplits = fancyItem.split('-');
		var name = makeUnderscoresSpaces(innermostSplits[0]);
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
	return result;
};
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
	if (string.length > 0) {
		var array = string.split(',');
		array.forEach(function (item) {
			if (item.includes('x')) {
				var count = parseInt(item.replace('x',''));
				for (let index = 0; index < count; index++) {
					result.push(0);
				}
			} else if (item.includes('-')) {
				var insert = parseInt(item);
				result.push(insert);
			} else {
				var insert = parseInt(item);
				result.push(insert);
			}
		})
	}
	result.fill(0, result.length, length);
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
	var lineA = JSON.parse(JSON.stringify(lineObj));
	var lineB = JSON.parse(JSON.stringify(lineObj));
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
		addendum || {},
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
	var result = JSON.parse(JSON.stringify(coords));
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
	for (let index = 0; index < halfSlotCount; index++) {
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
	var lines = JSON.parse(JSON.stringify(templateArray));
	var artists = JSON.parse(JSON.stringify(baselineHalfSlots));
	var combinedLines = [];
	var pc = -1;
	var shiftLine = function () {
		pc += 1;
		return lines.shift();
	};
	var unshiftLine = function (insert) {
		pc -= 1;
		return lines.unshift(insert);
	};
	while (artists.length > 0 && lines.length > 0) {
		if (artists[0].size > getLengthFromLineCoords(lines[0])) {
			artists[0].size -= getLengthFromLineCoords(lines[0]);
			var insert = shiftLine();
			insert.name = artists[0].name;
			combinedLines[pc] = combinedLines[pc] || [];
			combinedLines[pc].push(insert);
		} else {
			var workingLine = shiftLine();
			var splits = cutLineAtDistance(workingLine, artists[0].size);
			var insert = splits[0];
			insert.name = artists[0].name;
			combinedLines[pc] = combinedLines[pc] || [];
			combinedLines[pc].push(insert);
			unshiftLine(splits[1]);
			artists.shift();
		}
	}
	while (lines.length > 0) {
		var insert = shiftLine();
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
	var fusedSlots = JSON.parse(JSON.stringify(complexSlotsArray));
	var extractNames = function (sharedLine) {
		return sharedLine.map(function (line) {
			return line.name;
		});
	}
	fusedSlots.forEach(function (sharedLine) {
		var totalLength = extractNames(sharedLine).length;
		var uniqueLength = extractNames(sharedLine).filter(getUnique).length;
		while (totalLength > uniqueLength) {
			for (let index = 1; index < sharedLine.length; index++) {
				if (sharedLine[index].name === sharedLine[index-1].name) {
					var fusion = makeFusedLine(
						sharedLine[index-1],
						sharedLine[index],
						{
							name: sharedLine[index].name
						},
					)
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
	var lineSegmentPieces = JSON.parse(JSON.stringify(_lineSegmentPieces));
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
	var lineSegmentPieces = JSON.parse(JSON.stringify(_lineSegmentPieces));
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
	var lineSegmentPieces = JSON.parse(JSON.stringify(_lineSegmentPieces));
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
	var complexSlots = JSON.parse(JSON.stringify(_complexSlots));
	for (let index = 0; index < complexSlots.length; index++) {
		complexSlots[index] = snapShortSegments(complexSlots[index], threshold, priority);
	}
	return complexSlots;
};

var getEdgesFromComplexLines = function (complexLines) {
	var points = [];
	complexLines.forEach(function (lineSegment) {
		for (let index = 1; index < lineSegment.length; index++) {
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

  //------------------------//
 /*   THE ACTUAL APP LOL   */
//------------------------//

var app = new Vue({
	el:' #app',
	store: store, // available to all children as this.$store(.state.etc)
	router: router,
	created: function () {
		var actualQueryData = this.$route.query;
		var patchedQueryData = {};
		var artistsFromQuery = {};
		var defaultData = {
			l: '1969,12,0',
			f: '',
			u: 'artist1-1,artist2,artist3-1,artist4,artist5',
			d: 'Artist1,Artist2,Artist3,Artist4,Artist5-1',
			au: '',
			ad: '',
			x: '',
		}
		Object.keys(defaultData).forEach(function (key) {
			patchedQueryData[key] = actualQueryData && actualQueryData[key] || defaultData[key];
		})
		var rotationLabel = makeLabelUncompact(patchedQueryData.l);
		artistsFromQuery.feat = makeCompactFeaturedUnfancy(patchedQueryData.f);
		artistsFromQuery.up = makeCompactFloorUnfancy(patchedQueryData.u);
		artistsFromQuery.down = makeCompactFloorUnfancy(patchedQueryData.d);
		this.$store.dispatch('updateLabelObject',rotationLabel);
		this.$store.dispatch('updateArtistsObject',artistsFromQuery);
		var upHalfSlots = artistsFromQuery.up.length;
		var downHalfSlots = artistsFromQuery.down.length;
		this.$store.dispatch('importAdjustments',{
			up: makeAdjustmentsUncompact(patchedQueryData.au, upHalfSlots),
			down: makeAdjustmentsUncompact(patchedQueryData.ad, downHalfSlots),
		});
		if (actualQueryData.t) {
			var splits = actualQueryData.t.split(',');
			if (splits[0].length > 0) {
				this.$store.dispatch('setSelectedTemplateBase',
					{
						floorName: 'up',
						value: splits[0],
					}
				)
			}
			if (splits[1].length > 0) {
				this.$store.dispatch('setSelectedTemplateBase',
					{
						floorName: 'down',
						value: splits[0],
					}
				)
			}
		}
		var flags = patchedQueryData.x.split(',');
		// v2 detection
		var upCheck = JSON.stringify(defaultData.u)
		=== JSON.stringify(patchedQueryData.u);
		var downCheck = JSON.stringify(defaultData.d)
		=== JSON.stringify(patchedQueryData.d);
		if (flags.includes('v2')) { // explicitly v2
			self.$store.dispatch('setLegacyMode', false);
		} else if (upCheck && downCheck) { // default data is being used = use v2
			self.$store.dispatch('setLegacyMode', false);
		} else { // artist data (up/down) but no v2 flag = use legacy mode
			self.$store.dispatch('setLegacyMode', true);
		}
		// other flags
		var self = this;
		flags.forEach(function (flag) {
			// if not marked, assume legacy mode (aka v1: rigid svg templates)
			if (flag.includes('snap')) {
				var splits = flag.replace('snap','').split('-');
				self.$store.dispatch('changeCornerSnapThreshold', {
					floorName: 'up',
					value: splits[0],
				});
				self.$store.dispatch('changeCornerSnapThreshold', {
					floorName: 'down',
					value: splits[1],
				});
			}
		})
	},
	computed: {
		demo: function () {
			this.$store.getters.artistsOverPar;
		},
	},
	template: /*html*/`
<div id="app">
<router-view></router-view>
<pre>{{JSON.stringify(demo,null,'   ')}}</pre>
</div>
`});