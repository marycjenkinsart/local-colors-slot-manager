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
var makeCompact = function (artistsObject, label) {
	var compactLabel = makeLabelCompact(label);
	var getCompactFloor = function (array) {
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
	var interpretFeatured = function (featuredObject) {
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
	var up = getCompactFloor(artistsObject.up);
	var down = getCompactFloor(artistsObject.down);
	var feat = interpretFeatured(artistsObject.feat);
	var result = 'l=' + compactLabel + '&' +
		'f=' + feat + '&' +
		'u=' + up + '&' +
		'd=' + down;
	return makeSpacesUnderscores(result);
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

  //---------------------------//
 /*   LINE COORDINATE STUFF   */
//---------------------------//

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

var makeFusedLine = function (line1, line2) {
	var result = {
		origLine1: line1,
		origLine2: line2,
		x1: line1.x1,
		y1: line1.y1,
		x2: line2.x2,
		y2: line2.y2,
		ccw: !!line1.ccw,
	};
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

  //------------------------//
 /*   THE ACTUAL APP LOL   */
//------------------------//

var app = new Vue({
	el:' #app',
	store: store, // available to all children as this.$store(.state.etc)
	router: router,
	template: /*html*/`
<div id="app">
<router-view></router-view>
</div>
`});