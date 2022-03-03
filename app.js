var templates = {
	// the line segments that drive the maps
	// note these are in inches @ 1% scale, but also in points (@ 72 DPI)
	up: {
		'00': [
			{ x1: 50.1, y1: 113.2, x2: 68.1, y2: 73.5 },
			{ x1: 122.6, y1: 26.6, x2: 182.7, y2: 26.6 },
			{ x1: 182.7, y1: 27, x2: 182.7, y2: 98.3 },
			{ x1: 142, y1: 131.4, x2: 181.2, y2: 147.9 },
			{ x1: 183.8, y1: 149, x2: 183.8, y2: 174.9 },
			{ x1: 183.8, y1: 178.1, x2: 183.8, y2: 329.4 },
			{ x1: 141.4, y1: 329.4, x2: 141.4, y2: 345.2 },
			{ x1: 141.4, y1: 381.8, x2: 141.4, y2: 483.4 },
			{ x1: 35.2, y1: 525.9, x2: 35.2, y2: 481.2 },
			{ x1: 182, y1: 549.9, x2: 166, y2: 570.3 },
			{ x1: 179.6, y1: 489.5, x2: 179.6, y2: 532 },
			{ x1: 146.4, y1: 359.2, x2: 178.6, y2: 359.2 }
		],
		'01': [
			{ x1: 122.6, y1: 26.6, x2: 182.7, y2: 26.6 },
			{ x1: 50.1, y1: 113.2, x2: 68.1, y2: 73.5 },
			{ x1: 182.7, y1: 27, x2: 182.7, y2: 98.3 },
			{ x1: 142, y1: 131.4, x2: 181.2, y2: 147.9 },
			{ x1: 183.8, y1: 149, x2: 183.8, y2: 174.9 },
			{ x1: 183.8, y1: 178.1, x2: 183.8, y2: 329.4 },
			{ x1: 141.4, y1: 329.4, x2: 141.4, y2: 345.2 },
			{ x1: 141.4, y1: 381.8, x2: 141.4, y2: 483.4 },
			{ x1: 35.2, y1: 525.9, x2: 35.2, y2: 481.2 },
			{ x1: 182, y1: 549.9, x2: 166, y2: 570.3 },
			{ x1: 179.6, y1: 489.5, x2: 179.6, y2: 532 },
			{ x1: 146.4, y1: 359.2, x2: 178.6, y2: 359.2 }
		],
	},
	down: {
		'00': [
			{ x1: 135.8, y1: 351.9, x2: 135.8, y2: 392.6 },
			{ x1: 121.2, y1: 392.6, x2: 80.8, y2: 392.6 },
			{ x1: 51.2, y1: 392.6, x2: 51.2, y2: 369.6 },
			{ x1: 28.5, y1: 369.6, x2: 28.5, y2: 204.9 },
			{ x1: 28.5, y1: 172.5, x2: 28.5, y2: 41.8 },
			{ x1: 77.1, y1: 27.6, x2: 120.3, y2: 27.6 },
			{ x1: 167.6, y1: 41.8, x2: 167.6, y2: 107.3 },
			{ x1: 167.6, y1: 110.8, x2: 167.6, y2: 305.5 }
		],
	},
};

var getLengthFromLineCoords = function (coords) {
	var x1 = coords.x1;
	var x2 = coords.x2;
	var y1 = coords.y1;
	var y2 = coords.y2;
	var result = Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2);
	result = Math.sqrt(Math.abs(result));
	return result;
};
var templateNumberToInches = function (number) {
	return number * 100 / 72;
};
var inchesToTemplateNumber = function (number) {
	return number * 72 / 100;
};

var getNormalizedTangent = function (lineCoords) {
	var difX = lineCoords.x2 - lineCoords.x1;
	var difY = lineCoords.y2 - lineCoords.y1;
	var xForTangent = difY;
	var yForTangent = -difX;
	var tangentRadians = Math.atan2(yForTangent, xForTangent);
	return {
		x: Math.cos(tangentRadians),
		y: Math.sin(tangentRadians)
	};
};

var cutLineAtDistance = function (coords, distance) {
	var difX = coords.x2 - coords.x1;
	var difY = coords.y2 - coords.y1;
	var angleInRadians = Math.atan2(difY, difX);
	var splitPoint = {
		x: Math.cos(angleInRadians) * distance + coords.x1,
		y: Math.sin(angleInRadians) * distance + coords.y1,
	}
	var lineA = JSON.parse(JSON.stringify(coords));
	var lineB = JSON.parse(JSON.stringify(coords));
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
	};
	return result;
}

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

var app = new Vue({
	el:' #app',
	store: store, // available to all children as this.$store(.state.etc)
	router: router,
	template: /*html*/`
<div id="app">
<router-view></router-view>
</div>
`});