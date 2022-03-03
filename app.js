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