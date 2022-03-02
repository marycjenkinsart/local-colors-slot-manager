Vue.component('floor-preview', {
	mixins: [
		mixins,
	],
	props: {
		artists: {
			type: Array,
			require: true,
		},
		floorName: {
			type: String,
			require: true,
		},
		origin: {
			type: Object,
			require: false,
		},
		canvasSize: {
			type: Object,
			require: true,
		},
	},
	data: function () {
		return {
			rectWidth: 4,
			dottedLineLength: 16,
		}
	},
	computed: {
		rigidView: function () {
			return this.$store.state.rigidView;
		},
		slot01: function () {
			return this.artists[0] || 'ERROR';
		},
		slot02: function () {
			return this.artists[1] || 'ERROR';
		},
		slot03: function () {
			return this.artists[2] || 'ERROR';
		},
		slot04: function () {
			return this.artists[3] || 'ERROR';
		},
		slot05: function () {
			return this.artists[4] || 'ERROR';
		},
		slot06: function () {
			return this.artists[5] || 'ERROR';
		},
		slot07: function () {
			return this.artists[6] || 'ERROR';
		},
		slot08: function () {
			return this.artists[7] || 'ERROR';
		},
		slot09: function () {
			return this.artists[8] || 'ERROR';
		},
		slot10: function () {
			return this.artists[9] || 'ERROR';
		},
		slot11: function () {
			return this.artists[10] || 'ERROR';
		},
		slot12: function () {
			return this.artists[11] || 'ERROR';
		},
		slot13: function () {
			return this.artists[12] || 'ERROR';
		},
		slotCount: function () {
			return this.artists.length;
		},
		uniqueArtists: function () {
			var result = this.artists.filter(this.getUnique);
			return result;
		},
		slotColors: function () {
			var lookup = 'count' + this.uniqueArtists.length;
			return this.colorMap[lookup];
		},
		stringX: function () {
			var result = this.origin.x || 0;
			return result + 'px';
		},
		stringY: function () {
			var result = this.origin.y || 0;
			return result + 'px';
		},
		canvasSizeString: function () {
			result = "0 0 "
			x = this.canvasSize.x;
			y = this.canvasSize.y;
			result += x + ' ' + y;
			return result;
		},
		fancyArtists: function () {
			return this.makeFancy(this.artists);
		},
		rawLineSegments: function () {
			var lineSegments = templates[this.floorName]['00'];
			return lineSegments;
		},
		rawLineSegmentLengths: function () {
			var lengths = this.rawLineSegments.map(function (line) {
				return getLengthFromLineCoords(line);
			});
			return lengths;
		},
		processedArtistSlots: function () {
			var totalLength = this.rawLineSegmentLengths.reduce(function (prev, cur) {
				return prev + cur;
			});
			var totalHalfSlots = this.artists.length;
			var halfSlotSize = totalLength / totalHalfSlots;
			var result = [];
			var beginning = 0;
			var end = 0;
			this.fancyArtists.forEach(function (artist) {
				var artistWidth = artist.slotSize * 2 * halfSlotSize;
				end += artistWidth;
				var practicalSlot = {
					name: artist.name,
					beginning: beginning,
					end: end,
					size: end - beginning,
					inches: templateNumberToInches(end - beginning),
				}
				result.push(practicalSlot);
				beginning = end;
			})
			return result;
		},
		processedLineSegments: function () {
			var lines = JSON.parse(JSON.stringify(this.rawLineSegments));
			lines.forEach(function (line, index) {
				line.index = index;
			})
			var artists;
			artists = JSON.parse(JSON.stringify(this.processedArtistSlots));
			var processedLines = [];
			var insertName = artists[0].name;
			while (artists.length > 1) {
				if (artists[0].size > getLengthFromLineCoords(lines[0])) {
					artists[0].size -= getLengthFromLineCoords(lines[0]);
					var insert = lines.shift();
					insert.name = insertName;
					processedLines.push(insert);
				} else {
					var workingLine = lines.shift();
					var splits = cutLineAtDistance(workingLine, artists[0].size);
					var insert = splits[0];
					insert.name = insertName;
					processedLines.push(insert);
					lines.unshift(splits[1]);
					artists.shift();
					insertName = artists[0] && artists[0].name || insertName;
				}
			}
			lines.forEach(function (line) {
				var insert = line;
				insert.name = insertName;
				processedLines.push(insert);
			})
			return processedLines;
		},
		slotBordersToDraw: function () {
			var result = [];
			var workingLines = this.processedLineSegments;
			for (var index = 1; index < workingLines.length; index++) {
				var first = workingLines[index - 1];
				var second = workingLines[index];
				if (
					first.name !== second.name
					&& first.x2 === second.x1
					&& first.y2 === second.y1
					&& getNormalizedTangent(first).x - getNormalizedTangent(second).x < 0.0001
					&& getNormalizedTangent(first).y - getNormalizedTangent(second).y < 0.0001
				) {
					var shorterLine;
					if (getLengthFromLineCoords(first) > getLengthFromLineCoords(second)) {
						shorterLine = second;
					} else {
						shorterLine = first;
					}
					var insert = {
						x: second.x1,
						y: second.y1,
						line: shorterLine,
					}
					result.push(insert);
				}
			}
			return result;
		},
		processedDottedLines: function () {
			var result = [];
			var lineLength = this.dottedLineLength;
			this.slotBordersToDraw.forEach(function (line) {
				var extension = lineToRightLineAtOrigin(line.line, lineLength, line.x, line.y);
				var insert = {
					x1: line.x,
					y1: line.y,
					x2: extension.x,
					y2: extension.y,
				}
				result.push(insert);
			})
			return result;
		},
		processedRectangles: function () {
			var result = [];
			var rectWidth = this.rectWidth
			this.processedLineSegments.forEach(function (line) {
				var rect = lineToLeftRectangle(line, rectWidth);
				var rectPoints = rect.x1 + ',' + rect.y1 + ' ' +
					rect.x2 + ',' + rect.y2 + ' ' +
					rect.x3 + ',' + rect.y3 + ' ' +
					rect.x4 + ',' + rect.y4;
				var insert = {
					points: rectPoints,
					artist: line.name
				};
				result.push(insert);
			})
			return result;
		}
	},
	methods: {
		getArtistColorByIndex: function (index) {
			var slotName = this.artists[index - 1];
			var colorIndex = this.uniqueArtists.findIndex(function (item) {
				return item === slotName;
			});
			return this.slotColors[colorIndex];
		},
		getArtistColorByName: function (name) {
			var colorIndex = this.uniqueArtists.findIndex(function (item) {
				return item === name;
			});
			return this.slotColors[colorIndex];
		},
	},
	template: /*html*/`
<g>
	<g
		v-if="floorName === 'up'"
		id="upstairs svg"
	>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	:x="stringX"
	:y="stringY"
	:viewBox="canvasSizeString">
<g id="Upstairs_Base">
<polyline class="ust0" points="141.3,368.8 138.9,367.2 141.3,364.7 138.9,362.5 141.3,360.4 138.9,358.1 141.3,355.6 138.9,353.4  141.3,351.6 138.9,349.6 141.3,347.4 "/>
<polyline class="ust0" points="150,105 151.9,107.5 148.4,108.8 150,112 146.7,112.9 148.3,116 144.8,117.3 146.5,120.4 143.2,121  145,123.9 141.6,124.9 "/>
<line class="ust0" x1="150" y1="105" x2="152.2" y2="99.7"/>
<polyline class="ust0" points="183.8,149 139.4,130.2 141.6,124.9 "/>
<g>
<polyline class="ust0" points="94.4,52.8 96.1,55.2 92.8,56.5 94.1,59.5 91,60.4 92.3,63.4 89,64.7 90.4,67.7 87.4,68.3 88.8,71.1  85.7,72.1 "/>
<line class="ust0" x1="83.5" y1="76.9" x2="85.7" y2="72.1"/>
</g>
<line class="ust0" x1="34.7" y1="265.2" x2="34.7" y2="365.3"/>
<polyline class="ust0" points="34.9,233.5 52.5,232.2 52.5,233.6 39.3,241.1 39.2,241.2 39.2,256.3 52.3,263.8 52.3,265.2  34.7,265.2 "/>
<polyline class="ust0" points="34.9,233.5 34.9,132.4 43.2,114 63.2,123 64.7,119.8 50.1,113.2 68,73.5 83,80.2 84.4,76.9 "/>
<polyline class="ust0" points="35.2,518 35.2,481.2 53.9,481.2 53.9,477.7 36.2,477.7 36.2,389.8 36.2,389.8 60,380.5 58.7,377.1  41.9,383.7 34.7,365.3 "/>
<rect x="35.2" y="518" class="ust0" width="1.4" height="25.9"/>
<polyline class="ust0" points="38,555.8 35.2,555.8 35.2,543.9 "/>
<line class="ust0" x1="141.3" y1="373.5" x2="141.3" y2="368.8"/>
<polyline class="ust0" points="141.4,377.2 138,378.5 136.7,375.2 141,373.5 "/>
<line class="ust0" x1="66.8" y1="555.9" x2="66.8" y2="558.4"/>
<rect x="145.7" y="413.9" class="ust0" width="38" height="62.9"/>
<rect x="145.7" y="466.3" class="ust0" width="33.8" height="10.5"/>
<rect x="145.7" y="455.8" class="ust0" width="33.8" height="10.5"/>
<rect x="145.7" y="445.3" class="ust0" width="33.8" height="10.5"/>
<rect x="145.7" y="434.8" class="ust0" width="33.8" height="10.5"/>
<rect x="145.7" y="424.4" class="ust0" width="33.8" height="10.5"/>
<rect x="145.7" y="413.9" class="ust0" width="33.8" height="10.5"/>
<rect x="109.6" y="27" class="ust1" width="10.8" height="6.1"/>
<g> 
<rect x="25.8" y="540.2" transform="matrix(0.255 -0.9669 0.9669 0.255 -493.6221 442.2885)" class="ust2" width="28.8" height="2.6"/>
<rect x="38" y="555.8" class="ust0" width="28.8" height="2.6"/>
<path class="ust0" d="M45,527.8c12.5,3.1,21.8,14.4,21.8,28"/>
</g>
<line class="ust0" x1="96.1" y1="49.1" x2="94.4" y2="52.8"/>
<polyline class="ust0" points="183.8,149 183.8,329.4 141.3,329.4 141.3,347.4 "/>
<line class="ust5" x1="182.1" y1="149" x2="182.7" y2="99.7"/>
<polyline class="ust5" points="141,373.5 162.4,364.9 183.8,373.5 183.8,329.4 "/>
<circle class="ust1" cx="181.2" cy="176.5" r="1.6"/>
<polyline class="ust0" points="141.4,377.2 141.4,485.4 145.7,485.4 145.7,476.7 179.5,476.7 "/>
<polyline class="ust0" points="179.5,536.1 174,543.2 182.2,549.7 165.7,570.6 157.5,564.2 149.6,574.2 153.4,577.2 159.4,569.7  186.1,590.6 180,598.4 183.6,601.2 160.5,630.7 69.6,559.4 "/>
<polyline class="ust0" points="152.4,570.7 107,535 84.8,535 67,555.7 "/>
<polyline class="ust0" points="152.2,99.7 182.7,99.7 182.7,27 120.4,27 109.6,27 99.1,27 99.1,49.1 96.1,49.1 "/>
<polyline class="ust0" points="179.5,476.7 183.7,476.7 183.7,484.8 179.5,484.8 179.5,536.1 "/> 
<rect x="114.9" y="525.1" transform="matrix(0.6181 -0.7861 0.7861 0.6181 -368.7723 305.6445)" class="ust7" width="30.6" height="14.5"/>
<g>
<path class="ust8" d="M124.6,517.4c4.4,3.5,1.2,6.8-2.3,11.2s-5.9,8.4-10.3,4.9s-5.2-9.9-1.7-14.3 C113.7,514.7,120.1,513.9,124.6,517.4z"/>
<path class="ust8" d="M123.7,521.9c2.7,2.1,0.7,4.1-1.4,6.8s-3.6,5.1-6.2,2.9c-2.7-2.1-3.1-6-1-8.7 C117.1,520.2,121,519.7,123.7,521.9z"/>
</g>
<g>
<path class="ust8" d="M146.1,537.9c3,2.4,3.6,6.8,1.2,9.8c-2.4,3-6.8,3.6-9.8,1.2c-3-2.4-3.6-6.8-1.2-9.8 C138.6,536.1,143,535.5,146.1,537.9z"/>
<path class="ust8" d="M153.3,542.7c0.7,0.6,1,1.4-3.5,7.1c-4.5,5.7-5.4,5.6-6.1,5.1c-0.7-0.6-1-1.4,3.5-7.1 C151.7,542,152.6,542.1,153.3,542.7z"/> 
<rect x="146.6" y="532.1" transform="matrix(0.6183 -0.786 0.786 0.6183 -365.9767 321.6956)" class="ust9" width="3.2" height="11"/> 
<rect x="136" y="545.6" transform="matrix(0.6182 -0.786 0.786 0.6182 -380.6283 318.5482)" class="ust10" width="3.2" height="11"/>
</g>
<g id="featured-show-jl">
<text transform="matrix(0 -1 1 0 46.4052 183)" class="ust11 ust12 ust13">FEATURED SHOW</text>
</g>
<g id="featured-show-jl_1_">
<text transform="matrix(0 -1 1 0 46.4052 321.2188)" class="ust11 ust12 ust13">FEATURED SHOW</text>
</g>
<g id="jewelry-jl">
<text transform="matrix(0 -1 1 0 47.4059 429.6504)" class="ust11 ust12 ust13">JEWELRY</text>
</g>
</g>
<g v-if="rigidView === true">
<g id="show_if_slots_16_1_" v-if="slotCount === 16">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="108.9"/>
<rect x="116.1" y="196.5" class="ust15" width="64.3" height="71.5"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">7+ full slots not </tspan><tspan x="0" y="12" class="ust16 ust17">supported!!</tspan><tspan x="0" y="36" class="ust16 ust17">(slots would be </tspan><tspan x="0" y="48" class="ust16 ust17">smaller than </tspan><tspan x="0" y="60" class="ust16 ust17">twelve feet)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
<g id="show_if_slots_15_1_" v-if="slotCount === 15">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="108.9"/>
<rect x="116.1" y="196.5" class="ust15" width="64.3" height="71.5"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">7+ full slots not </tspan><tspan x="0" y="12" class="ust16 ust17">supported!!</tspan><tspan x="0" y="36" class="ust16 ust17">(slots would be </tspan><tspan x="0" y="48" class="ust16 ust17">smaller than </tspan><tspan x="0" y="60" class="ust16 ust17">twelve feet)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
<g id="show_if_slots_14_1_" v-if="slotCount === 14">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="108.9"/>
<rect x="116.1" y="196.5" class="ust15" width="64.3" height="71.5"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">7+ full slots not </tspan><tspan x="0" y="12" class="ust16 ust17">supported!!</tspan><tspan x="0" y="36" class="ust16 ust17">(slots would be </tspan><tspan x="0" y="48" class="ust16 ust17">smaller than </tspan><tspan x="0" y="60" class="ust16 ust17">twelve feet)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
<g id="show_if_slots_13" v-if="slotCount === 13">
<g id="Slots_13">
<g id="_x31_3s-s-1">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust19" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="124.7" y="23.1" class="ust19" width="7.4" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<rect id="_x31_3s-s-2" x="132.1" y="23.1" class="ust20" width="50.6" height="3.9" :class="getArtistColorByIndex(2)"/>
<g id="_x31_3s-s-3_1_">
<rect x="182.7" y="27" class="ust21" width="3.9" height="50.6" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_3s-s-4">
<rect id="ustop_3_" x="182.7" y="77.6" class="ust22" width="3.9" height="22.1" :class="getArtistColorByIndex(4)"/>
<rect x="154.1" y="120.9" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.1949 226.4342)" class="ust22" width="3.8" height="28.6" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_3s-s-5">
<rect x="183.8" y="149" class="ust23" width="3.9" height="36.1" :class="getArtistColorByIndex(5)"/>
<polygon class="ust23" points="168.4,142.5 169.9,139 182.6,144.3 181.1,147.8 " :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_3s-s-6">
<rect id="at_3_" x="183.9" y="185.1" class="ust24" width="3.8" height="50.6" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_3s-s-7">
<rect id="illustrator_4_" x="183.9" y="235.7" class="ust25" width="3.8" height="50.6" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_3s-s-8">
<rect id="bad_1_" x="183.9" y="286.3" class="ust26" width="3.8" height="50.6" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_3s-s-9">
<polyline class="ust27" points="141.2,384.8 145.1,384.8 145.1,419.5 141.2,419.5 " :class="getArtistColorByIndex(9)"/>
<rect id="is_1_" x="141.3" y="332.3" class="ust27" width="3.8" height="12.8" :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_3s-s-10">
<rect x="141.2" y="419.5" class="ust28" width="3.9" height="50.6" :class="getArtistColorByIndex(10)"/>
</g>
<g id="_x31_3s-s-11">
<rect x="179.5" y="489.5" class="ust29" width="3.9" height="34.4" :class="getArtistColorByIndex(11)"/>
<rect x="141.2" y="470.2" class="ust29" width="3.9" height="16.2" :class="getArtistColorByIndex(11)"/>
</g>
<g id="_x31_3s-s-12_1_">
<rect x="179.5" y="523.9" class="ust30" width="3.9" height="8.1" :class="getArtistColorByIndex(12)"/>
<polyline class="ust30" points="31.3,481.2 35.2,481.2 35.2,523.8 31.3,523.8 " :class="getArtistColorByIndex(12)"/>
</g>
<g id="_x31_3s-s-13">
<rect x="150.1" y="350.2" class="ust31" width="24.7" height="3.9" :class="getArtistColorByIndex(13)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust31" width="25.9" height="3.8" :class="getArtistColorByIndex(13)"/>
</g>
</g>
<g id="Edges_13">
<g id="_x31_3s-e-11not12" v-if="slot11 !== slot12">
<g>
<line class="ust32" x1="179.5" y1="523.9" x2="178" y2="523.9"/>
<line class="ust33" x1="175.6" y1="523.9" x2="167.3" y2="523.9"/>
<line class="ust32" x1="166.1" y1="523.9" x2="164.6" y2="523.9"/>
</g>
</g>
<g id="_x31_3s-e-10not11" v-if="slot10 !== slot11">
<g>
<line class="ust32" x1="141.2" y1="470.2" x2="139.7" y2="470.2"/>
<line class="ust33" x1="137.3" y1="470.2" x2="129" y2="470.2"/>
<line class="ust32" x1="127.8" y1="470.2" x2="126.3" y2="470.2"/>
</g>
</g>
<g id="_x31_3s-e-9not10" v-if="slot09 !== slot10">
<g>
<line class="ust32" x1="141.4" y1="419.5" x2="139.9" y2="419.5"/>
<line class="ust33" x1="137.5" y1="419.5" x2="129.2" y2="419.5"/>
<line class="ust32" x1="128" y1="419.5" x2="126.5" y2="419.5"/>
</g>
</g>
<g id="_x31_3s-e-7not8" v-if="slot07 !== slot08">
<g>
<line class="ust32" x1="183.8" y1="286.3" x2="182.3" y2="286.3"/>
<line class="ust33" x1="179.9" y1="286.3" x2="171.6" y2="286.3"/>
<line class="ust32" x1="170.4" y1="286.3" x2="168.9" y2="286.3"/>
</g>
</g>
<g id="_x31_3s-e-6not7_1_" v-if="slot06 !== slot07">
<g>
<line class="ust32" x1="183.8" y1="235.7" x2="182.3" y2="235.7"/>
<line class="ust33" x1="179.9" y1="235.7" x2="171.6" y2="235.7"/>
<line class="ust32" x1="170.4" y1="235.7" x2="168.9" y2="235.7"/>
</g>
</g>
<g id="_x31_3s-e-5not6" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="183.8" y1="185.1" x2="182.3" y2="185.1"/>
<line class="ust33" x1="179.9" y1="185.1" x2="171.6" y2="185.1"/>
<line class="ust32" x1="170.4" y1="185.1" x2="168.9" y2="185.1"/>
</g>
</g>
<g id="_x31_3s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="168.4" y1="142.5" x2="167.8" y2="143.9"/>
<line class="ust33" x1="166.9" y1="146.1" x2="163.7" y2="153.8"/>
<line class="ust32" x1="163.2" y1="154.9" x2="162.6" y2="156.2"/>
</g>
</g>
<g id="_x31_3s-e-3not4" v-if="slot03 !== slot04">
<g>
<line class="ust32" x1="182.7" y1="77.6" x2="181.2" y2="77.6"/>
<line class="ust33" x1="178.8" y1="77.6" x2="170.5" y2="77.6"/>
<line class="ust32" x1="169.3" y1="77.6" x2="167.8" y2="77.6"/>
</g>
</g>
<g id="_x31_3s-e-1not2" v-if="slot01 !== slot02">
<g>
<line class="ust32" x1="132.1" y1="27" x2="132.1" y2="28.5"/>
<line class="ust33" x1="132.1" y1="30.9" x2="132.1" y2="39.2"/>
<line class="ust32" x1="132.1" y1="40.4" x2="132.1" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_13">
<g id="_x31_3s-m-12not11" v-if="slot12 !== slot11">
<text transform="matrix(0 1 -1 0 199.3301 530.0055)" class="ust31 ust34 ust17">17”</text>
<polyline class="ust0" points="186.1,536.1 195.4,530 186.1,523.9 "/>
</g>
<g id="_x31_3s-m-10not11" v-if="slot10 !== slot11">
<text transform="matrix(0 1 -1 0 160.4492 477.7779)" class="ust35 ust34 ust17">21”</text>
<text transform="matrix(0 1 -1 0 160.4492 477.7779)" class="ust31 ust34 ust17">21”</text>
<polyline class="ust0" points="148.1,485.4 157.4,477.9 148.1,470.2 "/>
</g>
<g id="_x31_3s-m-9not10" v-if="slot09 !== slot10">
<text transform="matrix(0 1 -1 0 161.3652 400.4073)" class="ust35 ust34 ust17">58”</text>
<text transform="matrix(0 1 -1 0 161.3652 400.4078)" class="ust31 ust34 ust17">58”</text>
<polyline class="ust0" points="148.1,420.8 157.4,399.8 148.1,378.5 "/>
</g>
<g id="_x31_3s-m-7not8" v-if="slot07 !== slot08">
<text transform="matrix(0 1 -1 0 203.9297 307.8534)" class="ust31 ust34 ust17">60”</text>
<polyline class="ust0" points="190.7,329.4 200,307.9 190.7,286.3 "/>
</g>
<g id="_x31_3s-m-6not7" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 190.6992 235.6894)" class="ust31 ust34 ust17">half-ish</text>
</g>
<g id="_x31_3s-m-5not6_1_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 167.0363)" class="ust31 ust34 ust17">50”</text>
<polyline class="ust0" points="190.7,185.1 200,167 190.7,149 "/>
</g>
<g id="_x31_3s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0.9216 0.3881 -0.3881 0.9216 183.1779 128.4541)" class="ust31 ust34 ust17">23”</text>
<polyline class="ust0" points="185.8,143.9 181.7,132.1 170.3,137.4 "/>
</g>
<g id="_x31_3s-m-3not4" v-if="slot03 !== slot04">
<text transform="matrix(0 1 -1 0 202.9395 88.6584)" class="ust31 ust34 ust17">30”</text>
<polyline class="ust0" points="189.7,99.7 199,88.7 189.7,77.6 "/>
</g>
<g id="_x31_3s-m-1not2" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 115.8418 7.8589)" class="ust31 ust34 ust17">45”</text>
<polyline class="ust0" points="132.1,21.1 115.9,11.8 99.6,21.1 "/>
</g>
</g>
<g id="Labels_13">
<g id="_x31_3s-l-13z">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(13)">{{slot13}}</text  >
</g>
<g id="_x31_3s-l-13_1_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(13)">{{slot13}}</text  >
</g>
<g id="_x31_3s-l-12not11-jr" v-if="slot12 !== slot11">
<text transform="matrix(1 0 0 1 176.8228 534.8345)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
</g>
<g id="_x31_3s-l-11and12" v-if="slot11 === slot12">
<text transform="matrix(0 1 -1 0 168.8164 509.8641)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_3s-l-11not12-jr" v-if="slot11 !== slot12">
<text transform="matrix(0 1 -1 0 168.8164 520.8726)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_3s-l-12-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
</g>
<g id="_x31_3s-l-11not10-jl" v-if="slot11 !== slot10">
<text transform="matrix(0 1 -1 0 128.6484 471.2517)" class="ust25 ust12 ust13 jl" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_3s-l-10">
<text transform="matrix(0 1 -1 0 128.6484 446.2317)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_3s-l-9">
<text transform="matrix(0 1 -1 0 128.6484 399.1941)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_3s-l-9z">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_3s-l-8">
<text transform="matrix(0 1 -1 0 172.4844 307.1243)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_3s-l-7">
<text transform="matrix(0 1 -1 0 172.4844 259.0858)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_3s-l-6_1_">
<text transform="matrix(0 1 -1 0 172.4844 209.3799)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_3s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 166.3455)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_3s-l-4not5-jr" v-if="slot04 !== slot05">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 160.9472 151.0015)" class="ust36 ust12 ust37 jr" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_3s-l-4not3-jr" v-if="slot04 !== slot03">
<text transform="matrix(1 0 0 1 180.4887 96.9622)" class="ust20 ust12 ust13 jr" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_3s-l-3">
<text transform="matrix(0 1 -1 0 172.4824 52.927)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_3s-l-2-jl">
<text transform="matrix(1 0 0 1 133.0047 37.7803)" class="ust19 ust12 ust13 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_3s-l-1not2-jr" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 130.0022 37.7803)" class="ust19 ust12 ust13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x31_3s-l-1">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_12_2_" v-if="slotCount === 12">
<g id="Slots_12_2_">
<g id="_x31_2s-s-1_2_">
<rect x="122.9" y="23.1" class="ust19" width="54.8" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x31_2s-s-2_2_">
<rect x="182.7" y="27" class="ust20" width="3.9" height="54.8" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x31_2s-s-3_2_">
<rect x="182.7" y="81.8" class="ust36" width="3.9" height="11.6" :class="getArtistColorByIndex(3)"/>
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust36" width="43.2" height="3.9" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_2s-s-4_2_">
<rect id="ustop_4_" x="183.8" y="149" class="ust22" width="3.9" height="12.4" :class="getArtistColorByIndex(4)"/>
<rect id="illustrator_x5F_no_4_" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2741 246.3885)" class="ust22" width="3.9" height="19.8" :class="getArtistColorByIndex(4)"/>
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.8046 223.1874)" class="ust22" width="3.8" height="22.6" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_2s-s-5_2_">
<rect x="183.8" y="161.4" class="ust23" width="3.9" height="54.8" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_2s-s-6_2_">
<rect id="at_4_" x="183.9" y="216.2" class="ust24" width="3.8" height="54.8" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_2s-s-7_2_">
<rect id="illustrator_5_" x="183.9" y="271" class="ust25" width="3.8" height="54.8" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_2s-s-8_2_">
<rect id="bad_5_" x="141.3" y="381.8" class="ust26" width="3.8" height="39.1" :class="getArtistColorByIndex(8)"/>
<rect id="is_5_" x="141.3" y="329.4" class="ust26" width="3.8" height="16.5" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_2s-s-9_2_">
<polyline class="ust27" points="141.2,420.8 145.1,420.8 145.1,475.7 141.2,475.7 " :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_2s-s-10_2_">
<rect x="141.2" y="475.7" class="ust28" width="3.9" height="10.2" :class="getArtistColorByIndex(10)"/>
<polyline class="ust28" points="31.3,481.2 35.2,481.2 35.2,525.9 31.3,525.9 " :class="getArtistColorByIndex(10)"/>
</g>
<g id="_x31_2s-s-11_2_">
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust39" width="25.9" height="3.8" :class="getArtistColorByIndex(11)"/>
<rect x="179.5" y="503.1" class="ust39" width="3.9" height="28.9" :class="getArtistColorByIndex(11)"/>
</g>
<g id="_x31_2s-s-12_2_">
<rect x="142.1" y="350.2" class="ust29" width="41.3" height="3.9" :class="getArtistColorByIndex(12)"/>
<rect x="179.5" y="489.6" class="ust29" width="3.9" height="13.6" :class="getArtistColorByIndex(12)"/>
</g>
</g>
<g id="Edges_12_2_">
<g id="_x31_2s-e-11not12" v-if="slot11 !== slot12">
<g>
<line class="ust32" x1="179.5" y1="503.1" x2="178" y2="503.1"/>
<line class="ust33" x1="175.6" y1="503.1" x2="167.3" y2="503.1"/>
<line class="ust32" x1="166.1" y1="503.1" x2="164.6" y2="503.1"/>
</g>
</g>
<g id="_x31_2s-e-9not10_2_" v-if="slot09 !== slot10">
<g>
<line class="ust32" x1="141.2" y1="475.7" x2="139.7" y2="475.7"/>
<line class="ust33" x1="137.3" y1="475.7" x2="129" y2="475.7"/>
<line class="ust32" x1="127.8" y1="475.7" x2="126.3" y2="475.7"/>
</g>
</g>
<g id="_x31_2s-e-8not9_2_" v-if="slot08 !== slot09">
<g>
<line class="ust32" x1="141.4" y1="420.8" x2="139.9" y2="420.8"/>
<line class="ust33" x1="137.5" y1="420.8" x2="129.2" y2="420.8"/>
<line class="ust32" x1="128" y1="420.8" x2="126.5" y2="420.8"/>
</g>
</g>
<g id="_x31_2s-e-6not7_2_" v-if="slot06 !== slot07">
<g>
<line class="ust32" x1="183.8" y1="271" x2="182.3" y2="271"/>
<line class="ust33" x1="179.9" y1="271" x2="171.6" y2="271"/>
<line class="ust32" x1="170.4" y1="271" x2="168.9" y2="271"/>
</g>
</g>
<g id="_x31_2s-e-5not6_2_" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="183.8" y1="216.2" x2="182.3" y2="216.2"/>
<line class="ust33" x1="179.9" y1="216.2" x2="171.6" y2="216.2"/>
<line class="ust32" x1="170.4" y1="216.2" x2="168.9" y2="216.2"/>
</g>
</g>
<g id="_x31_2s-e-4not5_2_" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="161.4" x2="182.3" y2="161.4"/>
<line class="ust33" x1="179.9" y1="161.4" x2="171.6" y2="161.4"/>
<line class="ust32" x1="170.4" y1="161.4" x2="168.9" y2="161.4"/>
</g>
</g>
<g id="_x31_2s-e-2not3_2_" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="182.7" y1="81.8" x2="181.2" y2="81.8"/>
<line class="ust33" x1="178.8" y1="81.8" x2="170.5" y2="81.8"/>
<line class="ust32" x1="169.3" y1="81.8" x2="167.8" y2="81.8"/>
</g>
</g>
</g>
<g id="Measurements_12_2_">
<g id="_x31_2s-m-11not12_2_" v-if="slot11 !== slot12">
<text transform="matrix(0 1 -1 0 203.9297 493.9643)" class="ust31 ust34 ust17">25”</text>
<polyline class="ust0" points="190.7,503.1 200,494 190.7,484.8 "/>
</g>
<g id="_x31_2s-m-9not10_2_" v-if="slot09 !== slot10">
<text transform="matrix(0 1 -1 0 161.3652 481.1994)" class="ust35 ust34 ust17">13”</text>
<text transform="matrix(0 1 -1 0 161.3652 481.1999)" class="ust31 ust34 ust17">13”</text>
<polyline class="ust0" points="148.1,485.4 157.4,480.6 148.1,475.7 "/>
</g>
<g id="_x31_2s-m-8not9_2_" v-if="slot08 !== slot09">
<text transform="matrix(0 1 -1 0 161.3652 400.4073)" class="ust35 ust34 ust17">58”</text>
<text transform="matrix(0 1 -1 0 161.3652 400.4078)" class="ust31 ust34 ust17">58”</text>
<polyline class="ust0" points="148.1,420.8 157.4,399.8 148.1,378.5 "/>
</g>
<g id="_x31_2s-m-6not7_2_" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 203.9297 300.195)" class="ust31 ust34 ust17">81”</text>
<polyline class="ust0" points="190.7,329.4 200,300.2 190.7,271 "/>
</g>
<g id="_x31_2s-m-5not6_2_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 182.5963)" class="ust31 ust34 ust17">93”</text>
<polyline class="ust0" points="190.7,216.2 200,182.6 190.7,149 "/>
</g>
<g id="_x31_2s-m-4not5_2_" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 155.1779)" class="ust31 ust34 ust17">17”</text>
<polyline class="ust0" points="190.7,161.4 200,155.2 190.7,149 "/>
</g>
<g id="_x31_2s-m-2not3_2_" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 90.7681)" class="ust31 ust34 ust17">25”</text>
<polyline class="ust0" points="189.7,99.7 199,90.8 189.7,81.8 "/>
</g>
</g>
<g id="Labels_12_2_">
<g id="_x31_2s-l-12_2_">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
</g>
<g id="_x31_2s-l-11not12-jr_2_" v-if="slot11 !== slot12">
<text transform="matrix(1 0 0 1 176.8228 515.8689)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_2s-l-11and12_2_" v-if="slot11 === slot12">
<text transform="matrix(0 1 -1 0 168.8164 505.8609)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_2s-l-12not11-jr_2_" v-if="slot12 !== slot11">
<text transform="matrix(1 0 0 1 176.823 497.8544)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
</g>
<g id="_x31_2s-l-11_2_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_2s-l-10-jr_2_">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_2s-l-10not9-jr_2_" v-if="slot10 !== slot09">
<text transform="matrix(1 0 0 1 137.1245 486.0128)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_2s-l-9_2_">
<text transform="matrix(0 1 -1 0 128.6484 446.2317)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_2s-l-8_2_">
<text transform="matrix(0 1 -1 0 128.6484 399.1941)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_2s-l-8z_2_">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_2s-l-7">
<text transform="matrix(0 1 -1 0 172.4844 300.1187)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_2s-l-6_2_">
<text transform="matrix(0 1 -1 0 172.4844 243.073)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_2s-l-5_2_">
<text transform="matrix(0 1 -1 0 172.4844 187.7514)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_2s-l-4_2_">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 157.9448 148.9999)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_2s-l-3not2-jr_2_" v-if="slot03 !== slot02">
<text transform="matrix(1 0 0 1 180.4887 96.9622)" class="ust20 ust12 ust13 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_2s-l-3_2_">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_2s-l-2_2_">
<text transform="matrix(0 1 -1 0 172.4824 51.9262)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_2s-l-1_2_">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_11" v-if="slotCount === 11">
<g id="Slots_11">
<g id="_x31_1s-s-1">
<rect x="122.9" y="23.1" class="ust19" width="59.8" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x31_1s-s-2">
<rect x="182.7" y="27" class="ust20" width="3.9" height="59.8" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x31_1s-s-3">
<rect x="182.7" y="86.8" class="ust36" width="3.9" height="16.7" :class="getArtistColorByIndex(3)"/>
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust36" width="43.2" height="3.9" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_1s-s-4">
<rect id="ustop_2_" x="183.8" y="149" class="ust22" width="3.9" height="26.4" :class="getArtistColorByIndex(4)"/>
<rect id="illustrator_x5F_no_3_" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2741 246.3885)" class="ust22" width="3.9" height="19.8" :class="getArtistColorByIndex(4)"/>
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.8046 223.1874)" class="ust22" width="3.8" height="22.6" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_1s-s-5">
<rect x="183.8" y="175.4" class="ust23" width="3.9" height="56.8" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_1s-s-6">
<rect id="at_2_" x="183.9" y="232.2" class="ust24" width="3.8" height="55.8" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_1s-s-7">
<rect id="is_4_" x="141.3" y="329.4" class="ust25" width="3.8" height="16.5" :class="getArtistColorByIndex(7)"/>
<rect id="illustrator_3_" x="183.9" y="288" class="ust25" width="3.8" height="41.4" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_1s-s-8">
<rect id="bad_4_" x="141.3" y="381.8" class="ust26" width="3.8" height="59.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_1s-s-9">
<polyline class="ust27" points="141.2,441.6 145.1,441.6 145.1,483.3 141.2,483.3 " :class="getArtistColorByIndex(9)"/>
<rect x="179.5" y="489.5" class="ust27" width="3.9" height="18.1" :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_1s-s-10">
<rect x="179.5" y="507.5" class="ust28" width="3.9" height="23.9" :class="getArtistColorByIndex(10)"/>
<polyline class="ust28" points="31.3,481.2 35.2,481.2 35.2,516.6 31.3,516.6 " :class="getArtistColorByIndex(10)"/>
</g>
<g id="_x31_1s-s-11">
<rect x="145.7" y="350.2" class="ust39" width="33.9" height="3.9" :class="getArtistColorByIndex(11)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust39" width="25.9" height="3.8" :class="getArtistColorByIndex(11)"/>
</g>
</g>
<g id="Edges_11">
<g id="_x31_1s-e-9not10" v-if="slot09 !== slot10">
<g>
<line class="ust32" x1="179.5" y1="507.5" x2="178" y2="507.5"/>
<line class="ust33" x1="175.6" y1="507.5" x2="167.3" y2="507.5"/>
<line class="ust32" x1="166.1" y1="507.5" x2="164.6" y2="507.5"/>
</g>
</g>
<g id="_x31_1s-e-8not9_2_" v-if="slot08 !== slot09">
<g>
<line class="ust32" x1="141.4" y1="441.6" x2="139.9" y2="441.6"/>
<line class="ust33" x1="137.5" y1="441.6" x2="129.2" y2="441.6"/>
<line class="ust32" x1="128" y1="441.6" x2="126.5" y2="441.6"/>
</g>
</g>
<g id="_x31_1s-e-6not7" v-if="slot06 !== slot07">
<g>
<line class="ust32" x1="183.8" y1="288" x2="182.3" y2="288"/>
<line class="ust33" x1="179.9" y1="288" x2="171.6" y2="288"/>
<line class="ust32" x1="170.4" y1="288" x2="168.9" y2="288"/>
</g>
</g>
<g id="_x31_1s-e-5not6_2_" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="183.8" y1="232.2" x2="182.3" y2="232.2"/>
<line class="ust33" x1="179.9" y1="232.2" x2="171.6" y2="232.2"/>
<line class="ust32" x1="170.4" y1="232.2" x2="168.9" y2="232.2"/>
</g>
</g>
<g id="_x31_1s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="175.4" x2="182.3" y2="175.4"/>
<line class="ust33" x1="179.9" y1="175.4" x2="171.6" y2="175.4"/>
<line class="ust32" x1="170.4" y1="175.4" x2="168.9" y2="175.4"/>
</g>
</g>
<g id="_x31_1s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="182.7" y1="86.8" x2="181.2" y2="86.8"/>
<line class="ust33" x1="178.8" y1="86.8" x2="170.5" y2="86.8"/>
<line class="ust32" x1="169.3" y1="86.8" x2="167.8" y2="86.8"/>
</g>
</g>
</g>
<g id="Measurements_11">
<g id="_x31_1s-m-9not10" v-if="slot09 !== slot10">
<text transform="matrix(0 1 -1 0 203.9297 496.1748)" class="ust31 ust34 ust17">32”</text>
<polyline class="ust0" points="190.7,507.5 200,496.2 190.7,484.8 "/>
</g>
<g id="_x31_1s-m-8not9" v-if="slot08 !== slot09">
<text transform="matrix(0 1 -1 0 161.3652 463.4916)" class="ust35 ust34 ust17">60”</text>
<text transform="matrix(0 1 -1 0 161.3652 463.492)" class="ust31 ust34 ust17">60”</text>
<polyline class="ust0" points="148.1,485.4 157.4,463.6 148.1,441.6 "/>
</g>
<g id="_x31_1s-m-6not7" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 203.9297 308.6794)" class="ust31 ust34 ust17">57”</text>
<polyline class="ust0" points="190.7,329.4 200,308.7 190.7,288 "/>
</g>
<g id="_x31_1s-m-5not6" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 190.6992 232.2001)" class="ust31 ust34 ust17">half-ish</text>
</g>
<g id="_x31_1s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 162.1761)" class="ust31 ust34 ust17">36”</text>
<polyline class="ust0" points="190.7,175.4 200,162.2 190.7,149 "/>
</g>
<g id="_x31_1s-m-2not3" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 93.2627)" class="ust31 ust34 ust17">18”</text>
<polyline class="ust0" points="189.7,99.7 199,93.3 189.7,86.8 "/>
</g>
</g>
<g id="Labels_11">
<g id="_x31_1s-l-11z">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_1s-l-10not9-jr" v-if="slot10 !== slot09">
<text transform="matrix(1 0 0 1 176.8228 519.8721)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_1s-l-9and10" v-if="slot09 === slot10">
<text transform="matrix(0 1 -1 0 168.8164 505.8609)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-9not10-jr_2_" v-if="slot09 !== slot10">
<text transform="matrix(1 0 0 1 176.823 501.8575)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-11">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_1s-l-10-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_1s-l-9_2_">
<text transform="matrix(0 1 -1 0 128.6484 464.2461)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-8">
<text transform="matrix(0 1 -1 0 128.6484 406.1997)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_1s-l-7z">
<text transform="matrix(0 1 -1 0 172.4844 307.1243)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_1s-l-7_1_">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_1s-l-6">
<text transform="matrix(0 1 -1 0 172.4844 259.0856)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_1s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 202.7634)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_1s-l-4">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 157.9448 148.9999)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_1s-l-3not2-jr" v-if="slot03 !== slot02">
<text transform="matrix(1 0 0 1 180.4887 96.9622)" class="ust20 ust12 ust13 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_1s-l-3">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_1s-l-2">
<text transform="matrix(0 1 -1 0 172.4824 57.931)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_1s-l-1">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_10" v-if="slotCount === 10">
<g id="Slots_10">
<g id="_x31_0s-s-1">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust19" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="ust19" width="22.6" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x31_0s-s-2">
<rect x="182.7" y="27" class="ust20" width="3.9" height="28.9" :class="getArtistColorByIndex(2)"/>
<rect x="145.5" y="23.1" class="ust20" width="37.2" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x31_0s-s-3">
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.8046 223.1874)" class="ust36" width="3.8" height="22.6" :class="getArtistColorByIndex(3)"/>
<rect x="182.7" y="55.9" class="ust36" width="3.9" height="43.8" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_0s-s-4">
<rect id="ustop_1_" x="183.8" y="149" class="ust22" width="3.9" height="45.9" :class="getArtistColorByIndex(4)"/>
<rect id="illustrator_x5F_no_2_" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2741 246.3885)" class="ust22" width="3.9" height="19.8" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_0s-s-5">
<rect x="183.8" y="194.9" class="ust23" width="3.9" height="65.8" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_0s-s-6">
<rect id="at_1_" x="183.9" y="260.7" class="ust24" width="3.8" height="65.8" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_0s-s-7">
<rect id="is_3_" x="141.3" y="329.4" class="ust25" width="3.8" height="15.8" :class="getArtistColorByIndex(7)"/>
<rect id="illustrator_2_" x="141.3" y="381.8" class="ust25" width="3.8" height="50" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_0s-s-8">
<rect id="bad_3_" x="141.3" y="431.8" class="ust26" width="3.8" height="65.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_0s-s-9">
<polyline class="ust27" points="31.3,481.2 35.2,481.2 35.2,525.8 31.3,525.8 " :class="getArtistColorByIndex(9)"/>
<rect x="166.6" y="557.3" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -372.0994 353.3756)" class="ust27" width="21.2" height="3.8" :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_0s-s-10">
<rect x="148.7" y="350.2" class="ust40" width="28.1" height="3.9" :class="getArtistColorByIndex(10)"/>
<rect x="179.5" y="489" class="ust40" width="3.9" height="42.5" :class="getArtistColorByIndex(10)"/>
</g>
</g>
<g id="Edges_10">
<g id="_x31_0s-e-7not8" v-if="slot07 !== slot08">
<g>
<line class="ust32" x1="141.4" y1="431.8" x2="139.9" y2="431.8"/>
<line class="ust33" x1="137.5" y1="431.8" x2="129.2" y2="431.8"/>
<line class="ust32" x1="128" y1="431.8" x2="126.5" y2="431.8"/>
</g>
</g>
<g id="_x31_0s-e-5not6" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="183.8" y1="260.7" x2="182.3" y2="260.7"/>
<line class="ust33" x1="179.9" y1="260.7" x2="171.6" y2="260.7"/>
<line class="ust32" x1="170.4" y1="260.7" x2="168.9" y2="260.7"/>
</g>
</g>
<g id="_x31_0s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="194.9" x2="182.3" y2="194.9"/>
<line class="ust33" x1="179.9" y1="194.9" x2="171.6" y2="194.9"/>
<line class="ust32" x1="170.4" y1="194.9" x2="168.9" y2="194.9"/>
</g>
</g>
<g id="_x31_0s-e-3not4" v-if="slot03 !== slot04">
<g>
<line class="ust32" x1="162.9" y1="140.2" x2="162.3" y2="141.6"/>
<line class="ust33" x1="161.4" y1="143.8" x2="158.1" y2="151.5"/>
<line class="ust32" x1="157.7" y1="152.6" x2="157.1" y2="154"/>
</g>
</g>
<g id="_x31_0s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="182.7" y1="55.9" x2="181.2" y2="55.9"/>
<line class="ust33" x1="178.8" y1="55.9" x2="170.5" y2="55.9"/>
<line class="ust32" x1="169.3" y1="55.9" x2="167.8" y2="55.9"/>
</g>
</g>
<g id="_x31_0s-e-1not2" v-if="slot01 !== slot02">
<g>
<line class="ust32" x1="145.5" y1="27" x2="145.5" y2="28.5"/>
<line class="ust33" x1="145.5" y1="30.9" x2="145.5" y2="39.2"/>
<line class="ust32" x1="145.5" y1="40.4" x2="145.5" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_10">
<g id="_x31_0s-m-7not8" v-if="slot07 !== slot08">
<text transform="matrix(0 1 -1 0 161.3652 405.1557)" class="ust35 ust34 ust17">74”</text>
<text transform="matrix(0 1 -1 0 161.3652 405.1562)" class="ust31 ust34 ust17">74”</text>
<polyline class="ust0" points="148.1,431.8 157.4,405.3 148.1,378.5 "/>
</g>
<g id="_x31_0s-m-5not6" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 295.0534)" class="ust31 ust34 ust17">95”</text>
<polyline class="ust0" points="190.7,329.4 200,295.1 190.7,260.7 "/>
</g>
<g id="_x31_0s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 171.9685)" class="ust31 ust34 ust17">64”</text>
<polyline class="ust0" points="190.7,194.9 200,172 190.7,149 "/>
</g>
<g id="_x31_0s-m-3not4" v-if="slot03 !== slot04">
<text transform="matrix(0.9212 0.389 -0.389 0.9212 163.4492 134.046)" class="ust31 ust34 ust41">half-ish</text>
</g>
<g id="_x31_0s-m-2not3_2_" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 79.1002)" class="ust31 ust34 ust17">60”</text>
<polyline class="ust0" points="189.7,99.7 199,77.9 189.7,55.9 "/>
</g>
<g id="_x31_0s-m-1not2" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 164.3784 7.8708)" class="ust31 ust34 ust17">51”</text>
<polyline class="ust0" points="182.7,21.1 164.2,11.8 145.5,21.1 "/>
</g>
<g id="_x31_0s-m-1and2" v-if="slot01 === slot02">
<line class="ust0" x1="163.7" y1="83.1" x2="84.6" y2="90.8"/>
<text transform="matrix(0.9956 -9.408779e-02 9.408779e-02 0.9956 122.0058 85.1026)" class="ust42 ust34 ust43">can trade</text>
<text transform="matrix(0.9956 -9.408779e-02 9.408779e-02 0.9956 122.0063 85.1025)" class="ust31 ust34 ust43">can trade</text>
<polygon class="ust31" points="159.5,80.5 160.5,86.9 167.4,82.2 "/>
<polygon class="ust31" points="87.4,93.4 86.4,86.9 79.6,91.7 "/>
</g>
</g>
<g id="Labels_10">
<g id="_x31_0s-l-10z">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_0s-l-10">
<text transform="matrix(0 1 -1 0 168.8164 508.8633)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_0s-l-9">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_0s-l-9-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_0s-l-8">
<text transform="matrix(0 1 -1 0 128.6484 462.3132)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_0s-l-7z">
<text transform="matrix(0 1 -1 0 128.1406 401.8834)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_0s-l-7">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_0s-l-6">
<text transform="matrix(0 1 -1 0 172.4844 294.6503)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_0s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 226.5959)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_0s-l-4">
<text transform="matrix(0 1 -1 0 172.4844 170.5041)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_0s-l-3not4-jr" v-if="slot03 !== slot04">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="ust36 ust12 ust37 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-3and4" v-if="slot03 === slot04">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 153.504 147.3321)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-3not2-jl" v-if="slot03 !== slot02">
<text transform="matrix(0 1 -1 0 172.4824 57.931)" class="ust20 ust12 ust13 jl" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-2and3" v-if="slot02 === slot03">
<text transform="matrix(0 1 -1 0 172.4824 62.935)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_0s-l-2not1-jr" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 180.0422 37.7803)" class="ust19 ust12 ust13 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_0s-l-1and2_2_" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x31_0s-l-1not2-jr" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 143.1988 37.7803)" class="ust19 ust12 ust13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x31_0s-l-1">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_9" v-if="slotCount === 9">
<g id="Slots_9">
<g id="_x30_9s-s-1">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust19" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="ust19" width="30.1" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_9s-s-2">
<rect x="182.7" y="27" class="ust20" width="3.9" height="43.2" :class="getArtistColorByIndex(2)"/>
<rect x="153" y="23.1" class="ust20" width="29.7" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_9s-s-3">
<rect x="168.7" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.9305 243.7263)" class="ust36" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2557 220.825)" class="ust36" width="3.8" height="18.2" :class="getArtistColorByIndex(3)"/>
<rect x="182.7" y="70.2" class="ust36" width="3.9" height="29.5" :class="getArtistColorByIndex(3)"/>
</g>
<rect id="_x30_9s-s-4" x="183.8" y="149" class="ust22" width="3.9" height="73.1" :class="getArtistColorByIndex(4)"/>
<g id="_x30_9s-s-5">
<rect x="183.8" y="222.1" class="ust23" width="3.9" height="73.1" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x30_9s-s-6">
<rect id="bad" x="183.9" y="295.2" class="ust24" width="3.8" height="34.2" :class="getArtistColorByIndex(6)"/>
<rect id="is_2_" x="141.3" y="329.4" class="ust24" width="3.8" height="15.8" :class="getArtistColorByIndex(6)"/>
<rect id="illustrator_1_" x="141.3" y="381.8" class="ust24" width="3.8" height="23.1" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x30_9s-s-7">
<rect x="141.3" y="404.9" class="ust25" width="3.8" height="73.1" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_9s-s-8">
<rect x="31.3" y="481.2" class="ust26" width="3.9" height="44.6" :class="getArtistColorByIndex(8)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust26" width="25.9" height="3.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x30_9s-s-9">
<rect x="142.9" y="350.2" class="ust27" width="39.4" height="3.9" :class="getArtistColorByIndex(9)"/>
<rect x="179.5" y="489" class="ust27" width="3.9" height="42.5" :class="getArtistColorByIndex(9)"/>
</g>
</g>
<g id="Edges_9">
<g id="_x30_9s-e-6not7" v-if="slot06 !== slot07">
<g>
<line class="ust32" x1="141.4" y1="404.9" x2="139.9" y2="404.9"/>
<line class="ust33" x1="137.5" y1="404.9" x2="129.2" y2="404.9"/>
<line class="ust32" x1="128" y1="404.9" x2="126.5" y2="404.9"/>
</g>
</g>
<g id="_x30_9s-e-5not6" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="183.8" y1="295.2" x2="182.3" y2="295.2"/>
<line class="ust33" x1="179.9" y1="295.2" x2="171.6" y2="295.2"/>
<line class="ust32" x1="170.4" y1="295.2" x2="168.9" y2="295.2"/>
</g>
</g>
<g id="_x30_9s-e-4not5_2_" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="222.1" x2="182.3" y2="222.1"/>
<line class="ust33" x1="179.9" y1="222.1" x2="171.6" y2="222.1"/>
<line class="ust32" x1="170.4" y1="222.1" x2="168.9" y2="222.1"/>
</g>
</g>
<g id="_x30_9s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="183.8" y1="70.2" x2="182.3" y2="70.2"/>
<line class="ust33" x1="179.9" y1="70.2" x2="171.6" y2="70.2"/>
<line class="ust32" x1="170.4" y1="70.2" x2="168.9" y2="70.2"/>
</g>
</g>
<g id="_x30_9s-e-1not2" v-if="slot01 !== slot02">
<g>
<line class="ust32" x1="153" y1="27" x2="153" y2="28.5"/>
<line class="ust33" x1="153" y1="30.9" x2="153" y2="39.2"/>
<line class="ust32" x1="153" y1="40.4" x2="153" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_9">
<g id="_x30_9s-m-6not7" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 161.3652 385.1529)" class="ust35 ust34 ust17">37”</text>
<text transform="matrix(0 1 -1 0 161.3652 385.1528)" class="ust31 ust34 ust17">37”</text>
<polyline class="ust0" points="148.1,404.9 157.4,391.8 148.1,378.5 "/>
</g>
<g id="_x30_9s-m-5not6" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 312.2614)" class="ust31 ust34 ust17">48”</text>
<polyline class="ust0" points="190.7,329.4 200,312.3 190.7,295.2 "/>
</g>
<g id="_x30_9s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 182.2207)" class="ust31 ust34 ust17">101”</text>
<polyline class="ust0" points="190.7,222.1 200,185.6 190.7,149 "/>
</g>
<g id="_x30_9s-m-2not3" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 84.8503)" class="ust31 ust34 ust17">41”</text>
<polyline class="ust0" points="189.7,99.7 199,84.9 189.7,70 "/>
</g>
<g id="_x30_9s-m-2not1_2_" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 167.8503 7.8708)" class="ust31 ust34 ust17">41”</text>
<polyline class="ust0" points="182.7,21.1 167.9,11.8 153,21.1 "/>
</g>
</g>
<g id="Labels_9">
<g id="_x30_9s-l-9z">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x30_9s-l-9">
<text transform="matrix(0 1 -1 0 168.8164 508.8633)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x30_9s-l-8z">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_9s-l-8-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_9s-l-7">
<text transform="matrix(0 1 -1 0 128.6484 440.2957)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_9s-l-6not7-jr" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 128.1406 399.8818)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_9s-l-6-jr">
<text transform="matrix(1 0 0 1 180.491 323.6733)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_9s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 259.6223)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_9s-l-4">
<text transform="matrix(0 1 -1 0 172.4844 182.5137)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_9s-l-3">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_9s-l-3not2-jr" v-if="slot03 !== slot02">
<text transform="matrix(1 0 0 1 180.4897 95.6967)" class="ust20 ust12 ust13 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_9s-l-2and3_2_" v-if="slot02 === slot03">
<text transform="matrix(0 1 -1 0 172.4824 60.6683)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_9s-l-2not3-jl" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 171.4824 28.8985)" class="ust20 ust12 ust13 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_9s-l-1and2" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 148.0167 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_9s-l-1not2-jr" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 150.2044 37.7803)" class="ust19 ust12 ust13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_9s-l-1">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_8" v-if="slotCount === 8">
<g id="Slots_8">
<g id="_x30_8s-s-1">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust19" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="ust19" width="38.9" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_8s-s-2">
<rect x="182.7" y="27" class="ust20" width="3.9" height="61.2" :class="getArtistColorByIndex(2)"/>
<rect x="161.8" y="23.1" class="ust20" width="20.9" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_8s-s-3">
<rect x="168.7" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.9305 243.7263)" class="ust36" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2557 220.825)" class="ust36" width="3.8" height="18.2" :class="getArtistColorByIndex(3)"/>
<rect x="183.8" y="149" class="ust36" width="3.9" height="31.9" :class="getArtistColorByIndex(3)"/>
</g>
<rect id="_x30_8s-s-4" x="183.8" y="180.9" class="ust22" width="3.9" height="82.1" :class="getArtistColorByIndex(4)"/>
<g id="_x30_8s-s-5">
<rect x="183.8" y="262.9" class="ust23" width="3.9" height="66.4" :class="getArtistColorByIndex(5)"/>
<rect x="141.3" y="329.4" class="ust23" width="3.8" height="15.8" :class="getArtistColorByIndex(5)"/>
</g>
<rect id="_x30_8s-s-6" x="141.3" y="381.8" class="ust24" width="3.8" height="82.1" :class="getArtistColorByIndex(6)"/>
<g id="_x30_8s-s-7">
<rect x="141.3" y="463.9" class="ust25" width="3.8" height="19.5" :class="getArtistColorByIndex(7)"/>
<rect x="31.3" y="481.2" class="ust25" width="3.9" height="44.6" :class="getArtistColorByIndex(7)"/>
<rect x="179.5" y="489.5" class="ust25" width="3.9" height="21.8" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_8s-s-8">
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust25" width="25.9" height="3.8" :class="getArtistColorByIndex(8)"/>
<rect x="179.5" y="511.3" class="ust25" width="3.9" height="20.7" :class="getArtistColorByIndex(8)"/>
<rect x="142.9" y="350.2" class="ust25" width="39.4" height="3.9" :class="getArtistColorByIndex(8)"/>
</g>
</g>
<g id="Edges_8">
<g id="_x30_8s-e-6not7" v-if="slot06 !== slot07">
<g>
<line class="ust32" x1="141.4" y1="463.9" x2="139.9" y2="463.9"/>
<line class="ust33" x1="137.5" y1="463.9" x2="129.2" y2="463.9"/>
<line class="ust32" x1="128" y1="463.9" x2="126.5" y2="463.9"/>
</g>
</g>
<g id="_x30_8s-e-7not8" v-if="slot07 !== slot08">
<g>
<line class="ust32" x1="179.5" y1="511.3" x2="178" y2="511.3"/>
<line class="ust33" x1="175.6" y1="511.3" x2="167.3" y2="511.3"/>
<line class="ust32" x1="166.1" y1="511.3" x2="164.6" y2="511.3"/>
</g>
</g>
<g id="_x30_8s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="262.9" x2="182.3" y2="262.9"/>
<line class="ust33" x1="179.9" y1="262.9" x2="171.6" y2="262.9"/>
<line class="ust32" x1="170.4" y1="262.9" x2="168.9" y2="262.9"/>
</g>
</g>
<g id="_x30_8s-e-3not4" v-if="slot03 !== slot04">
<g>
<line class="ust32" x1="183.8" y1="180.9" x2="182.3" y2="180.9"/>
<line class="ust33" x1="179.9" y1="180.9" x2="171.6" y2="180.9"/>
<line class="ust32" x1="170.4" y1="180.9" x2="168.9" y2="180.9"/>
</g>
</g>
<g id="_x30_8s-e-1not2" v-if="slot01 !== slot02">
<g>
<line class="ust32" x1="161.8" y1="27" x2="161.8" y2="28.5"/>
<line class="ust33" x1="161.8" y1="30.9" x2="161.8" y2="39.2"/>
<line class="ust32" x1="161.8" y1="40.4" x2="161.8" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_8">
<g id="_x30_8s-m-6not7" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 167.3652 473.675)" class="ust35 ust34 ust17">27”</text>
<text transform="matrix(0 1 -1 0 167.3652 473.6749)" class="ust31 ust34 ust17">27”</text>
<polyline class="ust0" points="154.1,483.4 163.4,473.7 154.1,463.9 "/>
</g>
<g id="_x30_8s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 296.1207)" class="ust31 ust34 ust17">92”</text>
<polyline class="ust0" points="190.7,329.4 200,296.2 190.7,262.9 "/>
</g>
<g id="_x30_8s-m-2not1" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 172.4848 7.8708)" class="ust31 ust34 ust17">29”</text>
<polyline class="ust0" points="182.7,21.1 172.3,11.8 161.8,21.1 "/>
</g>
<g id="_x30_8s-m-3not4" v-if="slot03 !== slot04">
<polyline class="ust0" points="190.7,180.9 200,164.9 190.7,149 "/>
<text transform="matrix(0 1 -1 0 203.9297 164.9342)" class="ust31 ust34 ust17">44”</text>
</g>
</g>
<g id="Labels_8">
<g id="_x30_8s-l-7-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-8zz">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_8s-l-8z">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_8s-l-7not8-jr" v-if="slot07 !== slot08">
<text transform="matrix(0 1 -1 0 168.8164 509.2813)" class="ust24 ust12 ust13 jr" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-7not6-jl" v-if="slot07 !== slot06">
<text transform="matrix(0 1 -1 0 128.6484 468.3014)" class="ust24 ust12 ust13 jl" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-7and8" v-if="slot07 === slot08">
<text transform="matrix(0 1 -1 0 168.8164 510.3063)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-6">
<text transform="matrix(0 1 -1 0 128.1406 422.698)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_8s-l-5z">
<text transform="matrix(0 1 -1 0 128.6484 336.6378)" class="ust23 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_8s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 296.1209)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_8s-l-4">
<text transform="matrix(0 1 -1 0 172.4844 221.5449)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_8s-l-3">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_8s-l-2">
<text transform="matrix(0 1 -1 0 171.4824 59.9999)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_8s-l-1and2" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 159.8192 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_8s-l-1not2-jr" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 152.9998 37.7803)" class="ust19 ust12 ust13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_8s-l-1">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_7" v-if="slotCount === 7">
<g id="Slots_7">
<g id="_x30_7s-s-7">
<rect x="150.4" y="350.1" class="ust25" width="22.4" height="4.1" :class="getArtistColorByIndex(7)"/>
<rect x="31.2" y="481.2" class="ust25" width="3.8" height="47.8" :class="getArtistColorByIndex(7)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust25" width="25.9" height="3.8" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_7s-s-6">
<rect x="141.3" y="434.2" class="ust24" width="3.8" height="49.2" :class="getArtistColorByIndex(6)"/>
<rect x="179.5" y="489.5" class="ust24" width="3.9" height="40.3" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x30_7s-s-5">
<rect x="141.3" y="329.4" class="ust23" width="3.8" height="15.8" :class="getArtistColorByIndex(5)"/>
<rect x="141.3" y="381.8" class="ust23" width="3.8" height="52.4" :class="getArtistColorByIndex(5)"/>
<rect x="183.8" y="303.6" class="ust23" width="3.9" height="25.7" :class="getArtistColorByIndex(5)"/>
</g>
<rect id="_x30_7s-s-4" x="183.8" y="209.7" class="ust22" width="3.9" height="94" :class="getArtistColorByIndex(4)"/>
<g id="_x30_7s-s-3">
<g>
<rect x="183.8" y="149" class="ust36" width="3.9" height="60.7" :class="getArtistColorByIndex(3)"/>
<rect x="168.7" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.9305 243.7263)" class="ust36" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
</g>
</g>
<g id="_x30_7s-s-2">
<g>
<rect x="182.7" y="27" class="ust20" width="3.9" height="71.3" :class="getArtistColorByIndex(2)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2557 220.825)" class="ust20" width="3.8" height="18.2" :class="getArtistColorByIndex(2)"/>
</g>
</g>
<g id="_x30_7s-s-1">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust38" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="125.7" y="23.2" class="ust38" width="50.8" height="3.8" :class="getArtistColorByIndex(1)"/>
</g>
</g>
<g id="Edges_7">
<g id="_x30_7s-e-5not6" v-if="slot05 !== slot06">
<g>
<line class="ust32" x1="141.4" y1="434.2" x2="139.9" y2="434.2"/>
<line class="ust33" x1="137.5" y1="434.2" x2="129.2" y2="434.2"/>
<line class="ust32" x1="128" y1="434.2" x2="126.5" y2="434.2"/>
</g>
</g>
<g id="_x30_7s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="183.8" y1="303.6" x2="182.3" y2="303.6"/>
<line class="ust33" x1="179.9" y1="303.6" x2="171.6" y2="303.6"/>
<line class="ust32" x1="170.4" y1="303.6" x2="168.9" y2="303.6"/>
</g>
</g>
<g id="_x30_7s-e-3not4" v-if="slot03 !== slot04">
<g>
<line class="ust32" x1="183.8" y1="209.7" x2="182.3" y2="209.7"/>
<line class="ust33" x1="179.9" y1="209.7" x2="171.6" y2="209.7"/>
<line class="ust32" x1="170.4" y1="209.7" x2="168.9" y2="209.7"/>
</g>
</g>
<g id="_x30_7s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="158.8" y1="138.4" x2="158.2" y2="139.8"/>
<line class="ust33" x1="157.3" y1="142" x2="154" y2="149.7"/>
<line class="ust32" x1="153.6" y1="150.8" x2="153" y2="152.2"/>
</g>
</g>
</g>
<g id="Measurements_7">
<g id="_x30_7s-m-5not6" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="ust31 ust34 ust17">68”</text>
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="ust35 ust34 ust17">68”</text>
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="ust31 ust34 ust17">68”</text>
<polyline class="ust0" points="154.1,483.4 163.4,458.8 154.1,434.2 "/>
</g>
<g id="_x30_7s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(-8.979319e-11 1 -1 -8.979319e-11 203.8027 316.6728)" class="ust31 ust34 ust17">36”</text>
<polyline class="ust0" points="190.5,329.7 199.9,316.7 190.5,303.6 "/>
</g>
<g id="_x30_7s-m-3not4" v-if="slot03 !== slot04">
<text transform="matrix(-8.979319e-11 1 -1 -8.979319e-11 203.8027 179.35)" class="ust31 ust34 ust17">84”</text>
<polyline class="ust0" points="190.5,209.7 199.9,179.3 190.5,149 "/>
</g>
<g id="_x30_7s-m-2not3_2_" v-if="slot02 !== slot03">
<text transform="matrix(0.9212 0.389 -0.389 0.9212 158.4487 119.2052)" class="ust31 ust34 ust41">25”</text>
<polyline class="ust0" points="160.8,133.3 156.1,121.2 144,126.2 "/>
</g>
</g>
<g id="Labels_7">
<g id="_x30_7s-l-7-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-7zz">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-7">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-6not5" v-if="slot06 !== slot05">
<text transform="matrix(0 1 -1 0 128.6484 458.1434)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_7s-l-6">
<text transform="matrix(0 1 -1 0 168.8164 508.8047)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_7s-l-5and6" v-if="slot05 === slot06">
<text transform="matrix(0 1 -1 0 128.6484 432.1982)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5not6_2_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 127.8496 404.3509)" class="ust23 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5">
<text transform="matrix(0 1 -1 0 128.6484 336.6378)" class="ust23 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5-jr">
<text transform="matrix(1 0 0 1 182.1089 323.5477)" class="ust23 ust12 ust13 jr" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-4and5" v-if="slot04 === slot05">
<text transform="matrix(0 1 -1 0 172.4844 272.2133)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_7s-l-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 172.4844 251.5733)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_7s-l-3">
<text transform="matrix(0 1 -1 0 172.4844 177.6521)" class="ust36 ust12 ust13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_7s-l-2and3" v-if="slot02 === slot03">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="ust20 ust12 ust37" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-2not3-jr" v-if="slot02 !== slot03">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 152.9828 147.5838)" class="ust20 ust12 ust37 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-2">
<text transform="matrix(0 1 -1 0 171.4824 65.4022)" class="ust20 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-1zz">
<text transform="matrix(1 0 0 1 147.3024 37.7803)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_7s-l-1">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_6" v-if="slotCount === 6">
<g id="Slots_6">
<g id="_x30_6s-s-1">
<rect x="122.9" y="23.1" class="ust19" width="54.8" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_6s-s-1z">
<rect x="182.7" y="27" class="ust20" width="3.9" height="54.8" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_6s-s-2">
<rect x="182.7" y="81.8" class="ust36" width="3.9" height="11.6" :class="getArtistColorByIndex(2)"/>
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.9803 106.683)" class="ust36" width="43.2" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_6s-s-2z">
<rect id="ustop" x="183.8" y="149" class="ust22" width="3.9" height="12.4" :class="getArtistColorByIndex(2)"/>
<rect id="illustrator_x5F_no" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2741 246.3885)" class="ust22" width="3.9" height="19.8" :class="getArtistColorByIndex(2)"/>
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.8046 223.1874)" class="ust22" width="3.8" height="22.6" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_6s-s-3">
<rect x="183.8" y="161.4" class="ust23" width="3.9" height="54.8" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x30_6s-s-3z">
<rect id="at" x="183.9" y="216.2" class="ust24" width="3.8" height="54.8" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x30_6s-s-4">
<rect id="illustrator" x="183.9" y="271" class="ust25" width="3.8" height="54.8" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x30_6s-s-4z">
<rect id="bad_2_" x="141.3" y="381.8" class="ust26" width="3.8" height="39.1" :class="getArtistColorByIndex(4)"/>
<rect id="is" x="141.3" y="329.4" class="ust26" width="3.8" height="16.5" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x30_6s-s-5">
<polyline class="ust27" points="141.2,420.8 145.1,420.8 145.1,475.7 141.2,475.7 " :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x30_6s-s-5z">
<rect x="141.2" y="475.7" class="ust28" width="3.9" height="10.2" :class="getArtistColorByIndex(5)"/>
<polyline class="ust28" points="31.3,481.2 35.2,481.2 35.2,525.9 31.3,525.9 " :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x30_6s-s-6">
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1574 352.973)" class="ust39" width="25.9" height="3.8" :class="getArtistColorByIndex(6)"/>
<rect x="179.5" y="503.1" class="ust39" width="3.9" height="28.9" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x30_6s-s-6z">
<rect x="142.1" y="350.2" class="ust29" width="41.3" height="3.9" :class="getArtistColorByIndex(6)"/>
<rect x="179.5" y="489.6" class="ust29" width="3.9" height="13.6" :class="getArtistColorByIndex(6)"/>
</g>
</g>
<g id="Edges_6">
<g id="_x30_6s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="ust32" x1="141.4" y1="420.8" x2="139.9" y2="420.8"/>
<line class="ust33" x1="137.5" y1="420.8" x2="129.2" y2="420.8"/>
<line class="ust32" x1="128" y1="420.8" x2="126.5" y2="420.8"/>
</g>
</g>
<g id="_x30_6s-e-3not4" v-if="slot03 !== slot04">
<g>
<line class="ust32" x1="183.8" y1="271" x2="182.3" y2="271"/>
<line class="ust33" x1="179.9" y1="271" x2="171.6" y2="271"/>
<line class="ust32" x1="170.4" y1="271" x2="168.9" y2="271"/>
</g>
</g>
<g id="_x30_6s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="ust32" x1="183.8" y1="161.4" x2="182.3" y2="161.4"/>
<line class="ust33" x1="179.9" y1="161.4" x2="171.6" y2="161.4"/>
<line class="ust32" x1="170.4" y1="161.4" x2="168.9" y2="161.4"/>
</g>
</g>
<g id="_x30_6s-e-1not2" v-if="slot01 !== slot02">
<g>
<line class="ust32" x1="182.7" y1="81.8" x2="181.2" y2="81.8"/>
<line class="ust33" x1="178.8" y1="81.8" x2="170.5" y2="81.8"/>
<line class="ust32" x1="169.3" y1="81.8" x2="167.8" y2="81.8"/>
</g>
</g>
</g>
<g id="Measurements_6">
<g id="_x30_6s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 161.3652 400.4073)" class="ust35 ust34 ust17">58”</text>
<text transform="matrix(0 1 -1 0 161.3652 400.4078)" class="ust31 ust34 ust17">58”</text>
<polyline class="ust0" points="148.1,420.8 157.4,399.8 148.1,378.5 "/>
</g>
<g id="_x30_6s-m-3not4" v-if="slot03 !== slot04">
<text transform="matrix(0 1 -1 0 203.9297 300.195)" class="ust31 ust34 ust17">81”</text>
<polyline class="ust0" points="190.7,329.4 200,300.2 190.7,271 "/>
</g>
<g id="_x30_6s-m-2not3" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 203.9297 155.1779)" class="ust31 ust34 ust17">17”</text>
<polyline class="ust0" points="190.7,161.4 200,155.2 190.7,149 "/>
</g>
<g id="_x30_6s-m-1not2" v-if="slot01 !== slot02">
<text transform="matrix(0 1 -1 0 202.9395 90.7681)" class="ust31 ust34 ust17">25”</text>
<polyline class="ust0" points="189.7,99.7 199,90.8 189.7,81.8 "/>
</g>
</g>
<g id="Labels_6">
<g id="_x30_6s-l-6zz">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_6s-l-6z">
<text transform="matrix(0 1 -1 0 168.8164 506.8617)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_6s-l-6">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="ust25 ust12 ust13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_6s-l-5-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="ust25 ust12 ust13 jr" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_6s-l-5">
<text transform="matrix(0 1 -1 0 128.6484 453.2373)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_6s-l-4zz">
<text transform="matrix(0 1 -1 0 128.6484 399.1941)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_6s-l-4z">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_6s-l-4">
<text transform="matrix(0 1 -1 0 172.4844 300.1187)" class="ust24 ust12 ust13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_6s-l-3">
<text transform="matrix(0 1 -1 0 172.4844 216.1999)" class="ust22 ust12 ust13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_6s-l-2zz">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 157.9448 148.9999)" class="ust36 ust12 ust37" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_6s-l-2not1-jr" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 180.4887 96.9622)" class="ust20 ust12 ust13 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_6s-l-2">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="ust38 ust12 ust13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_6s-l-1">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="ust19 ust12 ust13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_5_1_" v-if="slotCount === 5">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="145"/>
<rect x="116.1" y="196.5" class="ust15" width="66.3" height="106"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">No template </tspan><tspan x="0" y="12" class="ust16 ust17">available for 2.5 </tspan><tspan x="0" y="24" class="ust16 ust17">full slots!</tspan><tspan x="0" y="48" class="ust16 ust17">Instead, use the </tspan><tspan x="0" y="60" class="ust16 ust17">5 slot template. </tspan><tspan x="0" y="72" class="ust16 ust17">(Double up </tspan><tspan x="0" y="84" class="ust16 ust17">names.)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
<g id="show_if_slots_4_1_" v-if="slotCount === 4">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="145"/>
<rect x="116.1" y="196.5" class="ust15" width="66.3" height="106"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">No template </tspan><tspan x="0" y="12" class="ust16 ust17">available for 2 </tspan><tspan x="0" y="24" class="ust16 ust17">full slots!</tspan><tspan x="0" y="48" class="ust16 ust17">Instead, use the </tspan><tspan x="0" y="60" class="ust16 ust17">4 slot template. </tspan><tspan x="0" y="72" class="ust16 ust17">(Double up </tspan><tspan x="0" y="84" class="ust16 ust17">names.)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
<g id="show_if_slots_3" v-if="slotCount === 3">
<rect x="71.1" y="166.3" class="ust14" width="87.4" height="145"/>
<rect x="116.1" y="196.5" class="ust15" width="66.3" height="106"/>
<text transform="matrix(1 0 0 1 116.0932 203.5733)"><tspan x="0" y="0" class="ust16 ust17">No template </tspan><tspan x="0" y="12" class="ust16 ust17">available for 1.5 </tspan><tspan x="0" y="24" class="ust16 ust17">full slots!</tspan><tspan x="0" y="48" class="ust16 ust17">Instead, use the </tspan><tspan x="0" y="60" class="ust16 ust17">3 slot template. </tspan><tspan x="0" y="72" class="ust16 ust17">(Double up </tspan><tspan x="0" y="84" class="ust16 ust17">names.)</tspan></text>
<g>
<text transform="matrix(1 0 0 1 115.7494 183.9073)" class="ust18 ust12 ust13">NO PREVIEW!</text>
</g>
</g>
</g>
<g v-if="rigidView === false">
<line
	v-for="line in processedDottedLines"
	:x1="line.x1"
	:x2="line.x2"
	:y1="line.y1"
	:y2="line.y2"
	class="dotted-line"
/>
<polyline
	v-for="rect in processedRectangles"
	:class="getArtistColorByName(rect.artist)"
	:points="rect.points"
/>
</g>
</svg>
</g>
<g
	v-if="floorName === 'down'"
	id="downstairs svg"
>
	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	:x="stringX"
	:y="stringY"
	:viewBox="canvasSizeString"
	style="enable-background:new 0 0 197 547.5;" xml:space="preserve">
	<g id="Downstairs_Base">
	<polyline class="st0" points="145.7,39.1 144.3,41.1 142,39.1 140.1,41.1 138.2,39.1 136.2,41.1 133.9,39.1 132,41.1 130.4,39.1  128.6,41.1 126.6,39.1 "/>
	<polyline class="st0" points="69.9,39.1 68.5,41.1 66.3,39.1 64.3,41.1 62.4,39.1 60.4,41.1 58.1,39.1 56.2,41.1 54.6,39.1  52.8,41.1 50.8,39.1 "/>
	<rect x="139.4" y="343.7" class="st0" width="33.8" height="73.3"/>
	<rect x="139.4" y="406.5" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="417" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="427.5" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="396" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="385.6" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="375.1" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="364.6" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="354.1" class="st0" width="33.8" height="10.5"/>
	<rect x="139.4" y="343.7" class="st0" width="33.8" height="10.5"/>
	<g>
	<g>
	<path class="st0" d="M59.1,416.1c9.6-2.4,16.8-11.1,16.8-21.5"/>
	</g>
	<rect x="53.7" y="392.6" class="st0" width="22.1" height="2"/> 
	<rect x="44.3" y="404.6" transform="matrix(0.242 0.9703 -0.9703 0.242 435.5689 253.7072)" class="st0" width="22.1" height="2"/>
	</g>
	<polyline class="st0" points="69.9,40.5 69.9,41.8 72.4,41.8 72.4,49.5 75.9,49.5 75.9,27.6 120.2,27.6 120.2,49.5 123.7,49.5  123.7,41.8 126.6,41.8 126.6,40.5 "/>
	<polyline class="st0" points="53.7,392.6 51.2,392.6 51.2,369.6 28.5,369.6 28.5,204.9 46.1,204.9 46.1,203.6 32.8,196.4  32.8,180.9 46.1,173.7 46.1,172.5 28.5,172.5 28.5,41.8 50.8,41.8 50.8,40.5 "/>
	<polyline class="st0" points="145.7,40.5 145.7,41.8 167.6,41.8 167.6,107.3 145.6,107.3 145.6,110.8 167.6,110.8 167.6,305.5  145.1,305.5 145.1,309.3 "/>
	<path class="st0" d="M145.4,309c8.5,0.3,14.6-1.5,21.3,1.1c6.9,2.7,7.6,6.5,9.4,10.1"/>
	<polyline class="st0" points="175.7,320.1 175.7,366.8 175.7,441.7 "/>
	<polyline class="st0" points="76.7,392.6 135.8,392.6 135.8,343.7 139.4,343.7 139.4,436.9 "/>
	<path class="st0" d="M145.4,305.5c-9.6,0-19.4,10.9-19.4,21.6s5.6,16.5,13.3,16.5"/>
	<rect x="146.2" y="110.8" class="st2" width="21.3" height="194.7"/>
	</g>
	<g id="show_if_slots_16_1_" v-if="slotCount === 16">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="108.9"/>
	<rect x="96.7" y="161.8" class="st4" width="64.3" height="71.5"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">7+ full slots not </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">supported!!</text>
	<text transform="matrix(1 0 0 1 96.6717 204.9183)" class="st5 st6">(slots would be </text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">smaller than </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">twelve feet)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g id="show_if_slots_15" v-if="slotCount === 15">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="108.9"/>
	<rect x="96.7" y="161.8" class="st4" width="64.3" height="71.5"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">7+ full slots not</text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">supported!!</text>
	<text transform="matrix(1 0 0 1 96.6717 204.9183)" class="st5 st6">(slots would be </text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">smaller than </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">twelve feet)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g id="show_if_slots_14_1_" v-if="slotCount === 14">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="108.9"/>
	<rect x="96.7" y="161.8" class="st4" width="64.3" height="71.5"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">7+ full slots not </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">supported!!</text>
	<text transform="matrix(1 0 0 1 96.6717 204.9183)" class="st5 st6">(slots would be </text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">smaller than </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">twelve feet)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g v-if="rigidView === true">
	<g id="show_if_slots_13" v-if="slotCount === 13">
	<g id="Slots_13">
	<g id="_x31_3s-s-1">
	<rect x="135.8" y="356.9" class="st9" width="3.9" height="35.7" :class="getArtistColorByIndex(1)"/>
	<rect x="124.7" y="385.4" transform="matrix(-3.105090e-11 1 -1 -3.105090e-11 521.1827 267.9296)" class="st9" width="3.9" height="18.3" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x31_3s-s-2">
	<rect x="95" y="379.1" transform="matrix(-7.809682e-11 1 -1 -7.809682e-11 491.5364 297.576)" class="st10" width="3.9" height="31" :class="getArtistColorByIndex(2)"/>
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="23" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x31_3s-s-3">
	<rect x="24.6" y="312.9" class="st11" width="3.9" height="54" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x31_3s-s-4">
	<rect x="24.6" y="258.9" class="st12" width="3.9" height="54" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x31_3s-s-5">
	<rect x="24.6" y="204.9" class="st13" width="3.9" height="54" :class="getArtistColorByIndex(5)"/>
	</g>
	<g id="_x31_3s-s-6">
	<rect x="24.6" y="115.3" class="st14" width="3.9" height="54" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x31_3s-s-7">
	<rect x="24.6" y="61.3" class="st15" width="3.9" height="54" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x31_3s-s-8">
	<rect x="91.2" y="8.4" transform="matrix(-2.869812e-11 1 -1 -2.869812e-11 118.824 -67.5259)" class="st16" width="3.9" height="34.5" :class="getArtistColorByIndex(8)"/>
	<rect x="24.6" y="41.8" transform="matrix(-1 -1.599577e-11 1.599577e-11 -1 53.1508 103.1397)" class="st16" width="3.9" height="19.5" :class="getArtistColorByIndex(8)"/>
	</g>
	<g id="_x31_3s-s-9">
	<rect x="167.6" y="41.8" class="st17" width="3.9" height="44.2" :class="getArtistColorByIndex(9)"/>
	<rect x="113.4" y="20.7" transform="matrix(1.138521e-10 -1 1 1.138521e-10 89.6659 140.964)" class="st17" width="3.9" height="9.8" :class="getArtistColorByIndex(9)"/>
	</g>
	<g id="_x31_3s-s-10">
	<rect x="167.6" y="110.8" class="st3" width="3.9" height="32.7" :class="getArtistColorByIndex(10)"/>
	<rect x="167.6" y="86" class="st3" width="3.9" height="21.3" :class="getArtistColorByIndex(10)"/>
	</g>
	<g id="_x31_3s-s-11">
	<rect x="167.6" y="143.5" class="st18" width="3.9" height="54" :class="getArtistColorByIndex(11)"/>
	</g>
	<g id="_x31_3s-s-12">
	<rect x="167.6" y="197.5" class="st19" width="3.9" height="54" :class="getArtistColorByIndex(12)"/>
	</g>
	<g id="_x31_3s-s-13">
	<rect x="167.6" y="251.5" class="st7" width="3.9" height="54" :class="getArtistColorByIndex(13)"/>
	</g>
	</g>
	<g id="Edges_13">
	<g id="_x31_3s-e-12not13" v-if="slot12 !== slot13">
	<g>
	<line class="st20" x1="167.6" y1="251.5" x2="166.1" y2="251.5"/>
	<line class="st21" x1="163.7" y1="251.5" x2="155.4" y2="251.5"/>
	<line class="st20" x1="154.2" y1="251.5" x2="152.7" y2="251.5"/>
	</g>
	</g>
	<g id="_x31_3s-e-11not12" v-if="slot11 !== slot12">
	<g>
	<line class="st20" x1="167.6" y1="197.5" x2="166.1" y2="197.5"/>
	<line class="st21" x1="163.7" y1="197.5" x2="155.4" y2="197.5"/>
	<line class="st20" x1="154.2" y1="197.5" x2="152.7" y2="197.5"/>
	</g>
	</g>
	<g id="_x31_3s-e-10not11" v-if="slot10 !== slot11">
	<g>
	<line class="st20" x1="167.6" y1="143.5" x2="166.1" y2="143.5"/>
	<line class="st21" x1="163.7" y1="143.5" x2="155.4" y2="143.5"/>
	<line class="st20" x1="154.2" y1="143.5" x2="152.7" y2="143.5"/>
	</g>
	</g>
	<g id="_x31_3s-e-9not10" v-if="slot09 !== slot10">
	<g>
	<line class="st20" x1="167.6" y1="86" x2="166.1" y2="86"/>
	<line class="st21" x1="163.7" y1="86" x2="155.4" y2="86"/>
	<line class="st20" x1="154.2" y1="86" x2="152.7" y2="86"/>
	</g>
	</g>
	<g id="_x31_3s-e-8not9" v-if="slot08 !== slot09">
	<g>
	<line class="st20" x1="110.4" y1="27.6" x2="110.4" y2="29.1"/>
	<line class="st21" x1="110.4" y1="31.5" x2="110.4" y2="39.8"/>
	<line class="st20" x1="110.4" y1="41" x2="110.4" y2="42.5"/>
	</g>
	</g>
	<g id="_x31_3s-e-7not8" v-if="slot07 !== slot08">
	<g>
	<line class="st20" x1="28.5" y1="61.3" x2="30" y2="61.3"/>
	<line class="st21" x1="32.4" y1="61.3" x2="40.7" y2="61.3"/>
	<line class="st20" x1="41.9" y1="61.3" x2="43.4" y2="61.3"/>
	</g>
	</g>
	<g id="_x31_3s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="28.5" y1="115.3" x2="30" y2="115.3"/>
	<line class="st21" x1="32.4" y1="115.3" x2="40.7" y2="115.3"/>
	<line class="st20" x1="41.9" y1="115.3" x2="43.4" y2="115.3"/>
	</g>
	</g>
	<g id="_x31_3s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="258.9" x2="30" y2="258.9"/>
	<line class="st21" x1="32.4" y1="258.9" x2="40.7" y2="258.9"/>
	<line class="st20" x1="41.9" y1="258.9" x2="43.4" y2="258.9"/>
	</g>
	</g>
	<g id="_x31_3s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="28.5" y1="312.9" x2="30" y2="312.9"/>
	<line class="st21" x1="32.4" y1="312.9" x2="40.7" y2="312.9"/>
	<line class="st20" x1="41.9" y1="312.9" x2="43.4" y2="312.9"/>
	</g>
	</g>
	<g id="_x31_3s-e-1not2" v-if="slot01 !== slot02">
	<g>
	<line class="st20" x1="115.1" y1="392.6" x2="115.1" y2="391.1"/>
	<line class="st21" x1="115.1" y1="388.7" x2="115.1" y2="380.4"/>
	<line class="st20" x1="115.1" y1="379.2" x2="115.1" y2="377.7"/>
	</g>
	</g>
	</g>
	<g id="Measurements_13">
	<g id="_x31_3s-m-12not13" v-if="slot12 !== slot13">
	<text transform="matrix(0 1 -1 0 186.6699 278.5009)" class="st22 st23 st6">75”</text>
	<polyline class="st24" points="173.4,305.5 182.7,278.6 173.4,251.5 "/>
	</g>
	<g id="_x31_3s-m-11not12" v-if="slot11 !== slot12">
	<text transform="matrix(0 1 -1 0 186.6699 154.1663)" class="st22 st23 st6">120”</text>
	<polyline class="st24" points="173.4,197.5 182.7,154.3 173.4,110.8 "/>
	</g>
	<g id="_x31_3s-m-10not11" v-if="slot10 !== slot11">
	<text transform="matrix(0 1 -1 0 186.6699 127.0742)" class="st22 st23 st6">45”</text>
	<polyline class="st24" points="173.4,143.5 182.7,127.2 173.4,110.8 "/>
	</g>
	<g id="_x31_3s-m-9not10" v-if="slot09 !== slot10">
	<text transform="matrix(0 1 -1 0 186.668 96.6555)" class="st22 st23 st6">30”</text>
	<polyline class="st24" points="173.4,107.3 182.7,96.7 173.4,86 "/>
	</g>
	<g id="_x31_3s-m-8not9" v-if="slot08 !== slot09">
	<text transform="matrix(1 0 0 1 115.3146 8.4731)" class="st22 st23 st6">14”</text>
	<polyline class="st24" points="120.2,21.7 115.3,12.4 110.4,21.7 "/>
	</g>
	<g id="_x31_3s-m-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 51.5703)" class="st22 st23 st6">27”</text>
	<polyline class="st24" points="22.6,41.8 13.3,51.5 22.6,61.3 "/>
	</g>
	<g id="_x31_3s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 142.3389)" class="st22 st23 st6">79”</text>
	<polyline class="st24" points="22.6,115.3 13.3,143.8 22.6,172.5 "/>
	</g>
	<g id="_x31_3s-m-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 231.8828)" class="st22 st23 st6">75”</text>
	<polyline class="st24" points="22.6,204.9 13.3,231.8 22.6,258.9 "/>
	</g>
	<g id="_x31_3s-m-3not4" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 341.2334)" class="st22 st23 st6">79”</text>
	<polyline class="st24" points="22.6,312.9 13.3,341.1 22.6,369.6 "/>
	</g>
	<g id="_x31_3s-m-1not2" v-if="slot01 !== slot02">
	<text transform="matrix(1 0 0 1 125.4336 419.5984)" class="st22 st23 st6">29”</text>
	<polyline class="st24" points="115.1,399.5 125.4,408.8 135.8,399.5 "/>
	</g>
	</g>
	<g id="Label_13">
	<g id="_x31_3s-l-1not2-jr" v-if="slot01 !== slot02">
	<text transform="matrix(0 1 -1 0 124.8086 390.5688)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_3s-l-2not1-jr" v-if="slot02 !== slot01">
	<text transform="matrix(1 0 0 1 112.3488 387.7216)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_3s-l-2not1-jl" v-if="slot02 !== slot01">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 62.6816 391.1221)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_3s-l-1and2" v-if="slot01 === slot02">
	<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_3s-l-3">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 341.127)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x31_3s-l-4">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 285.8838)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_3s-l-5">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 230.6406)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_3s-l-6">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 143.9102)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_3s-l-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 86.8662)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_3s-l-7and8" v-if="slot07 === slot08">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 76.9502)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_3s-l-8not7-jl" v-if="slot08 !== slot07">
	<text transform="matrix(1 0 0 1 30.0088 53.3824)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_3s-l-8not9-jr" v-if="slot08 !== slot09">
	<text transform="matrix(1 0 0 1 108.2072 38.5626)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_3s-l-8and9" v-if="slot08 === slot09">
	<text transform="matrix(1 0 0 1 99.1997 38.5624)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_3s-l-9not10-jr" v-if="slot09 !== slot10">
	<text transform="matrix(0 1 -1 0 156.8926 82.195)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_3s-l-10not9-jr" v-if="slot10 !== slot09">
	<text transform="matrix(1 0 0 1 163.6621 102.6299)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	<g id="_x31_3s-l-10not11-jr" v-if="slot10 !== slot11">
	<text transform="matrix(1 0 0 1 163.6617 123.647)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	<g id="_x31_3s-l-10and11" v-if="slot10 === slot11">
	<text transform="matrix(0 1 -1 0 156.8926 157.2549)" class="st25 st5 st8" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	<g id="_x31_3s-l-9and10" v-if="slot09 === slot10">
	<text transform="matrix(0 1 -1 0 156.8926 75.1893)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_3s-l-11not10" v-if="slot11 !== slot10">
	<text transform="matrix(0 1 -1 0 156.8926 169.2645)" class="st25 st5 st8" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
	</g>
	<g id="_x31_3s-l-12">
	<text transform="matrix(0 1 -1 0 156.8926 224.3085)" class="st25 st5 st8" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
	</g>
	<g id="_x31_3s-l-13">
	<text transform="matrix(0 1 -1 0 156.8926 277.3508)" class="st25 st5 st8" :class="getArtistColorByIndex(13)">{{slot13}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_12" v-if="slotCount === 12">
	<g id="Slots_12">
	<g id="_x31_2s-s-1">
	<rect x="135.8" y="346.9" class="st9" width="3.6" height="45.7" :class="getArtistColorByIndex(1)"/>
	<rect x="118" y="378.7" transform="matrix(-5.386821e-11 1 -1 -5.386821e-11 514.4502 274.6621)" class="st9" width="3.9" height="31.8" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x31_2s-s-2">
	<rect x="89.8" y="383.7" transform="matrix(-5.504415e-11 1 -1 -5.504415e-11 486.2493 302.863)" class="st10" width="3.9" height="21.8" :class="getArtistColorByIndex(2)"/>
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="23" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="355.8" class="st10" width="3.9" height="13.8" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x31_2s-s-3">
	<rect x="24.6" y="297.2" class="st11" width="3.9" height="58.6" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x31_2s-s-4">
	<rect x="24.6" y="238.6" class="st12" width="3.9" height="58.6" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x31_2s-s-5">
	<rect x="24.6" y="204.9" class="st13" width="3.9" height="33.7" :class="getArtistColorByIndex(5)"/>
	<rect x="24.6" y="147.6" class="st13" width="3.9" height="24.9" :class="getArtistColorByIndex(5)"/>
	</g>
	<g id="_x31_2s-s-6">
	<rect x="24.6" y="89" class="st14" width="3.9" height="58.6" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x31_2s-s-7">
	<rect x="24.6" y="41.8" class="st15" width="3.9" height="47.2" :class="getArtistColorByIndex(7)"/>
	<rect x="79.7" y="19.9" transform="matrix(3.787021e-11 -1 1 3.787021e-11 56.0131 107.3113)" class="st15" width="3.9" height="11.4" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x31_2s-s-8">
	<rect x="101.9" y="9.2" transform="matrix(-2.728591e-11 1 -1 -2.728591e-11 129.4513 -78.1531)" class="st16" width="3.9" height="32.8" :class="getArtistColorByIndex(8)"/>
	<rect x="167.6" y="41.8" transform="matrix(-1 -2.117074e-11 2.117074e-11 -1 338.9908 109.3707)" class="st16" width="3.9" height="25.8" :class="getArtistColorByIndex(8)"/>
	</g>
	<g id="_x31_2s-s-9">
	<rect x="167.6" y="67.6" class="st17" width="3.9" height="39.8" :class="getArtistColorByIndex(9)"/>
	<rect x="167.6" y="110.8" transform="matrix(-1 -3.055646e-10 3.055646e-10 -1 338.9908 240.5165)" class="st17" width="3.9" height="18.9" :class="getArtistColorByIndex(9)"/>
	</g>
	<g id="_x31_2s-s-10">
	<rect x="167.6" y="129.7" class="st3" width="3.9" height="58.6" :class="getArtistColorByIndex(10)"/>
	</g>
	<g id="_x31_2s-s-11">
	<rect x="167.6" y="188.3" class="st18" width="3.9" height="58.6" :class="getArtistColorByIndex(11)"/>
	</g>
	<g id="_x31_2s-s-12">
	<rect x="167.6" y="246.9" class="st19" width="3.9" height="58.6" :class="getArtistColorByIndex(12)"/>
	</g>
	</g>
	<g id="Edges_12">
	<g id="_x31_2s-e-11not12" v-if="slot11 !== slot12">
	<g>
	<line class="st20" x1="167.6" y1="246.9" x2="166.1" y2="246.9"/>
	<line class="st21" x1="163.7" y1="246.9" x2="155.4" y2="246.9"/>
	<line class="st20" x1="154.2" y1="246.9" x2="152.7" y2="246.9"/>
	</g>
	</g>
	<g id="_x31_2s-e-10not11" v-if="slot10 !== slot11">
	<g>
	<line class="st20" x1="167.6" y1="188.3" x2="166.1" y2="188.3"/>
	<line class="st21" x1="163.7" y1="188.3" x2="155.4" y2="188.3"/>
	<line class="st20" x1="154.2" y1="188.3" x2="152.7" y2="188.3"/>
	</g>
	</g>
	<g id="_x31_2s-e-9not10" v-if="slot09 !== slot10">
	<g>
	<line class="st20" x1="167.6" y1="129.7" x2="166.1" y2="129.7"/>
	<line class="st21" x1="163.7" y1="129.7" x2="155.4" y2="129.7"/>
	<line class="st20" x1="154.2" y1="129.7" x2="152.7" y2="129.7"/>
	</g>
	</g>
	<g id="_x31_2s-e-8not9" v-if="slot08 !== slot09">
	<g>
	<line class="st20" x1="167.6" y1="67.6" x2="166.1" y2="67.6"/>
	<line class="st21" x1="163.7" y1="67.6" x2="155.4" y2="67.6"/>
	<line class="st20" x1="154.2" y1="67.6" x2="152.7" y2="67.6"/>
	</g>
	</g>
	<g id="_x31_2s-e-7not8" v-if="slot07 !== slot08">
	<g>
	<line class="st20" x1="87.4" y1="27.6" x2="87.4" y2="29.1"/>
	<line class="st21" x1="87.4" y1="31.5" x2="87.4" y2="39.8"/>
	<line class="st20" x1="87.4" y1="41" x2="87.4" y2="42.5"/>
	</g>
	</g>
	<g id="_x31_2s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="28.5" y1="89" x2="30" y2="89"/>
	<line class="st21" x1="32.4" y1="89" x2="40.7" y2="89"/>
	<line class="st20" x1="41.9" y1="89" x2="43.4" y2="89"/>
	</g>
	</g>
	<g id="_x31_2s-e-5not6" v-if="slot05 !== slot06">
	<g>
	<line class="st20" x1="28.5" y1="147.6" x2="30" y2="147.6"/>
	<line class="st21" x1="32.4" y1="147.6" x2="40.7" y2="147.6"/>
	<line class="st20" x1="41.9" y1="147.6" x2="43.4" y2="147.6"/>
	</g>
	</g>
	<g id="_x31_2s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="238.6" x2="30" y2="238.6"/>
	<line class="st21" x1="32.4" y1="238.6" x2="40.7" y2="238.6"/>
	<line class="st20" x1="41.9" y1="238.6" x2="43.4" y2="238.6"/>
	</g>
	</g>
	<g id="_x31_2s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="28.5" y1="297.2" x2="30" y2="297.2"/>
	<line class="st21" x1="32.4" y1="297.2" x2="40.7" y2="297.2"/>
	<line class="st20" x1="41.9" y1="297.2" x2="43.4" y2="297.2"/>
	</g>
	</g>
	<g id="_x31_2s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="28.5" y1="355.8" x2="30" y2="355.8"/>
	<line class="st21" x1="32.4" y1="355.8" x2="40.7" y2="355.8"/>
	<line class="st20" x1="41.9" y1="355.8" x2="43.4" y2="355.8"/>
	</g>
	</g>
	<g id="_x31_2s-e-1not2" v-if="slot01 !== slot02">
	<g>
	<line class="st20" x1="103.3" y1="392.6" x2="103.3" y2="391.1"/>
	<line class="st21" x1="103.3" y1="388.7" x2="103.3" y2="380.4"/>
	<line class="st20" x1="103.3" y1="379.2" x2="103.3" y2="377.7"/>
	</g>
	</g>
	</g>
	<g id="Measurements_12">
	<g id="_x31_2s-m-11not12" v-if="slot11 !== slot12">
	<text transform="matrix(0 1 -1 0 186.668 276.1984)" class="st22 st23 st6">81”</text>
	<polyline class="st24" points="173.4,305.5 182.7,276.3 173.4,246.9 "/>
	</g>
	<g id="_x31_2s-m-10not11" v-if="slot10 !== slot11">
	<text transform="matrix(0 1 -1 0 186.668 149.5607)" class="st22 st23 st6">108”</text>
	<polyline class="st24" points="173.4,188.3 182.7,149.7 173.4,110.8 "/>
	</g>
	<g id="_x31_2s-m-9not10" v-if="slot09 !== slot10">
	<text transform="matrix(0 1 -1 0 186.6699 120.2582)" class="st22 st23 st6">26”</text>
	<polyline class="st24" points="173.4,129.7 182.7,120.3 173.4,110.8 "/>
	</g>
	<g id="_x31_2s-m-8not9" v-if="slot08 !== slot09">
	<text transform="matrix(0 1 -1 0 186.6699 87.445)" class="st22 st23 st6">55”</text>
	<polyline class="st24" points="173.4,107.3 182.7,87.5 173.4,67.6 "/>
	</g>
	<g id="_x31_2s-m-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(1 0 0 1 81.6624 8.4731)" class="st22 st23 st6">16”</text>
	<polyline class="st24" points="87.4,21.7 81.7,12.4 75.9,21.7 "/>
	</g>
	<g id="_x31_2s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 65.3857)" class="st22 st23 st6">66”</text>
	<polyline class="st24" points="22.6,41.8 13.3,65.3 22.6,89 "/>
	</g>
	<g id="_x31_2s-m-5not6" v-if="slot05 !== slot06">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 160.0283)" class="st22 st23 st6">35”</text>
	<polyline class="st24" points="22.6,147.6 13.3,160 22.6,172.5 "/>
	</g>
	<g id="_x31_2s-m-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 221.7314)" class="st22 st23 st6">47”</text>
	<polyline class="st24" points="22.6,204.9 13.3,221.7 22.6,238.6 "/>
	</g>
	<g id="_x31_2s-m-3not4_1_" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 333.3838)" class="st22 st23 st6">100”</text>
	<polyline class="st24" points="22.6,297.2 13.3,333.3 22.6,369.6 "/>
	</g>
	<g id="_x31_2s-m-2not3" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 362.6865)" class="st22 st23 st6">19”</text>
	<polyline class="st24" points="22.6,355.8 13.3,362.7 22.6,369.6 "/>
	</g>
	<g id="_x31_2s-m-1not2" v-if="slot01 !== slot02">
	<text transform="matrix(1 0 0 1 119.894 419.5984)" class="st22 st23 st6">45”</text>
	<polyline class="st24" points="103.3,399.5 119.5,408.8 135.8,399.5 "/>
	</g>
	</g>
	<g id="Label_12">
	<g id="_x31_2s-l-1not2-jr" v-if="slot01 !== slot02">
	<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_2s-l-2not1-jr" v-if="slot02 !== slot01">
	<text transform="matrix(1 0 0 1 100.534 387.7216)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_2s-l-2not1-jl" v-if="slot02 !== slot01">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 62.6816 391.1221)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_2s-l-1and2" v-if="slot01 === slot02">
	<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_2s-l-3and2" v-if="slot03 === slot02">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 331.1211)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x31_2s-l-3not2" v-if="slot03 !== slot02">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 326.1162)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x31_2s-l-4">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 267.3027)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_2s-l-5">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 221.6338)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_2s-l-5not6-jl" v-if="slot05 !== slot06">
	<text transform="matrix(1 0 0 1 30.407 167.9762)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_2s-l-5and6" v-if="slot05 === slot06">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 125.8965)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_2s-l-6not5" v-if="slot06 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 117.8887)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_2s-l-7">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 64.9404)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_2s-l-7and8" v-if="slot07 === slot08">
	<text transform="matrix(1 0 0 1 97.5317 37.562)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_2s-l-8not7" v-if="slot08 !== slot07">
	<text transform="matrix(1 0 0 1 104.5372 37.5619)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_2s-l-8not9-jr" v-if="slot08 !== slot09">
	<text transform="matrix(1 0 0 1 165.0614 53.408)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_2s-l-8and9" v-if="slot08 === slot09">
	<text transform="matrix(0 1 -1 0 156.8926 74.1886)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_2s-l-9not8" v-if="slot09 !== slot08">
	<text transform="matrix(0 1 -1 0 156.8926 86.198)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_2s-l-9not10-jr" v-if="slot09 !== slot10">
	<text transform="matrix(1 0 0 1 163.6617 123.647)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_2s-l-9and10" v-if="slot09 === slot10">
	<text transform="matrix(0 1 -1 0 156.8926 149.2485)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_2s-l-10not9" v-if="slot10 !== slot09">
	<text transform="matrix(0 1 -1 0 156.8926 157.2549)" class="st25 st5 st8" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	<g id="_x31_2s-l-11">
	<text transform="matrix(0 1 -1 0 156.8926 215.3013)" class="st25 st5 st8" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
	</g>
	<g id="_x31_2s-l-12">
	<text transform="matrix(0 1 -1 0 156.8926 274.1969)" class="st25 st5 st8" :class="getArtistColorByIndex(12)">{{slot12}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_11" v-if="slotCount === 11">
	<g id="Slots_11">
	<g id="_x31_1s-s-1">
	<rect x="135.8" y="353.7" class="st9" width="3.6" height="39" :class="getArtistColorByIndex(1)"/>
	<rect x="121.4" y="382.1" transform="matrix(-4.234143e-11 1 -1 -4.234143e-11 517.8439 271.2684)" class="st9" width="3.9" height="25" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x31_1s-s-2">
	<rect x="89.2" y="384.2" transform="matrix(-5.198615e-11 1 -1 -5.198615e-11 485.6785 303.4338)" class="st10" width="3.9" height="20.7" :class="getArtistColorByIndex(2)"/>
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="23" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="349.6" class="st10" width="3.9" height="20" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x31_1s-s-3">
	<rect x="24.6" y="285.7" class="st11" width="3.9" height="63.9" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x31_1s-s-4">
	<rect x="24.6" y="221.5" class="st12" width="3.9" height="64.2" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x31_1s-s-5">
	<rect x="24.6" y="204.9" class="st13" width="3.9" height="16.6" :class="getArtistColorByIndex(5)"/>
	<rect x="24.6" y="125.4" class="st13" width="3.9" height="47.1" :class="getArtistColorByIndex(5)"/>
	</g>
	<g id="_x31_1s-s-6">
	<rect x="24.6" y="61.5" class="st14" width="3.9" height="63.9" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x31_1s-s-7">
	<rect x="24.6" y="41.8" class="st15" width="3.9" height="19.7" :class="getArtistColorByIndex(7)"/>
	<rect x="96.1" y="3.5" transform="matrix(1.463079e-10 -1 1 1.463079e-10 72.4331 123.7313)" class="st15" width="3.9" height="44.3" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x31_1s-s-8">
	<rect x="167.6" y="41.8" transform="matrix(-1 -5.269175e-11 5.269175e-11 -1 338.9908 147.5386)" class="st16" width="3.9" height="63.9" :class="getArtistColorByIndex(8)"/>
	</g>
	<g id="_x31_1s-s-9">
	<rect x="167.6" y="112.1" class="st17" width="3.9" height="63.9" :class="getArtistColorByIndex(9)"/>
	</g>
	<g id="_x31_1s-s-10">
	<rect x="167.6" y="176" class="st3" width="3.9" height="63.9" :class="getArtistColorByIndex(10)"/>
	</g>
	<g id="_x31_1s-s-11">
	<rect x="167.6" y="240" class="st18" width="3.9" height="63.9" :class="getArtistColorByIndex(11)"/>
	</g>
	</g>
	<g id="Edges_11">
	<g id="_x31_1s-e-10not11" v-if="slot10 !== slot11">
	<g>
	<line class="st20" x1="167.6" y1="240" x2="166.1" y2="240"/>
	<line class="st21" x1="163.7" y1="240" x2="155.4" y2="240"/>
	<line class="st20" x1="154.2" y1="240" x2="152.7" y2="240"/>
	</g>
	</g>
	<g id="_x31_1s-e-9not10" v-if="slot09 !== slot10">
	<g>
	<line class="st20" x1="167.6" y1="176" x2="166.1" y2="176"/>
	<line class="st21" x1="163.7" y1="176" x2="155.4" y2="176"/>
	<line class="st20" x1="154.2" y1="176" x2="152.7" y2="176"/>
	</g>
	</g>
	<g id="_x31_1s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="28.5" y1="61.5" x2="30" y2="61.5"/>
	<line class="st21" x1="32.4" y1="61.5" x2="40.7" y2="61.5"/>
	<line class="st20" x1="41.9" y1="61.5" x2="43.4" y2="61.5"/>
	</g>
	</g>
	<g id="_x31_1s-e-5not6" v-if="slot05 !== slot06">
	<g>
	<line class="st20" x1="28.5" y1="125.4" x2="30" y2="125.4"/>
	<line class="st21" x1="32.4" y1="125.4" x2="40.7" y2="125.4"/>
	<line class="st20" x1="41.9" y1="125.4" x2="43.4" y2="125.4"/>
	</g>
	</g>
	<g id="_x31_1s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="221.5" x2="30" y2="221.5"/>
	<line class="st21" x1="32.4" y1="221.5" x2="40.7" y2="221.5"/>
	<line class="st20" x1="41.9" y1="221.5" x2="43.4" y2="221.5"/>
	</g>
	</g>
	<g id="_x31_1s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="28.5" y1="285.7" x2="30" y2="285.7"/>
	<line class="st21" x1="32.4" y1="285.7" x2="40.7" y2="285.7"/>
	<line class="st20" x1="41.9" y1="285.7" x2="43.4" y2="285.7"/>
	</g>
	</g>
	<g id="_x31_1s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="28.5" y1="349.6" x2="30" y2="349.6"/>
	<line class="st21" x1="32.4" y1="349.6" x2="40.7" y2="349.6"/>
	<line class="st20" x1="41.9" y1="349.6" x2="43.4" y2="349.6"/>
	</g>
	</g>
	<g id="_x31_1s-e-1not2" v-if="slot01 !== slot02">
	<g>
	<line class="st20" x1="105.8" y1="392.6" x2="105.8" y2="391.1"/>
	<line class="st21" x1="105.8" y1="388.7" x2="105.8" y2="380.4"/>
	<line class="st20" x1="105.8" y1="379.2" x2="105.8" y2="377.7"/>
	</g>
	</g>
	</g>
	<g id="Measurements_11">
	<g id="_x31_1s-m-10not11" v-if="slot10 !== slot11">
	<text transform="matrix(0 1 -1 0 186.668 272.7418)" class="st22 st23 st6">91”</text>
	<polyline class="st24" points="173.4,305.5 182.7,272.8 173.4,240 "/>
	</g>
	<g id="_x31_1s-m-9not10" v-if="slot09 !== slot10">
	<text transform="matrix(0 1 -1 0 186.6699 143.5403)" class="st22 st23 st6">91”</text>
	<polyline class="st24" points="173.4,176 182.7,143.5 173.4,110.8 "/>
	</g>
	<g id="_x31_1s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 52.2998)" class="st22 st23 st6">27”</text>
	<polyline class="st24" points="22.6,41.8 13.3,51.6 22.6,61.5 "/>
	</g>
	<g id="_x31_1s-m-5not6" v-if="slot05 !== slot06">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 148.9365)" class="st22 st23 st6">65”</text>
	<polyline class="st24" points="22.6,125.4 13.3,148.9 22.6,172.5 "/>
	</g>
	<g id="_x31_1s-m-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 213.7998)" class="st22 st23 st6">23”</text>
	<polyline class="st24" points="22.6,204.9 13.3,213.2 22.6,221.5 "/>
	</g>
	<g id="_x31_1s-m-3not4" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 22.6404 285.6572)" class="st22 st23 st6">half-ish</text>
	</g>
	<g id="_x31_1s-m-2not3" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 362.6865)" class="st22 st23 st6">28”</text>
	<polyline class="st24" points="22.6,349.6 13.3,359.6 22.6,369.6 "/>
	</g>
	<g id="_x31_1s-m-1not2" v-if="slot01 !== slot02">
	<text transform="matrix(1 0 0 1 119.894 419.5984)" class="st22 st23 st6">42”</text>
	<polyline class="st24" points="105.8,399.5 120.8,408.8 135.8,399.5 "/>
	</g>
	</g>
	<g id="Label_11">
	<g id="_x31_1s-l-1not2-jr" v-if="slot01 !== slot02">
	<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_1s-l-1and2" v-if="slot01 === slot02">
	<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_1s-l-2not1-jr" v-if="slot02 !== slot01">
	<text transform="matrix(1 0 0 1 100.534 387.7216)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_1s-l-2not3-jl" v-if="slot02 !== slot03">
	<text transform="matrix(1 0 0 1 28.6544 364.1004)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_1s-l-2and3" v-if="slot02 === slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0504 324.1143)" class="st25 st5 st8" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_1s-l-3not2" v-if="slot03 !== slot02">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 317.1094)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x31_1s-l-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 252.29)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_1s-l-4and5" v-if="slot04 === slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 246.2842)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_1s-l-5not4-jl" v-if="slot05 !== slot04">
	<text transform="matrix(1 0 0 1 30.0436 215.6291)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_1s-l-5_1_">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 148.9131)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_1s-l-6and7" v-if="slot06 === slot07">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 91.8691)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_1s-l-6not7_1_" v-if="slot06 !== slot07">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 82.8604)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_1s-l-7not6-jl" v-if="slot07 !== slot06">
	<text transform="matrix(1 0 0 1 30.0436 54.9327)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_1s-l-7">
	<text transform="matrix(1 0 0 1 97.5317 37.562)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_1s-l-8">
	<text transform="matrix(0 1 -1 0 156.8926 72.187)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_1s-l-9">
	<text transform="matrix(0 1 -1 0 156.8926 143.2436)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_1s-l-10">
	<text transform="matrix(0 1 -1 0 156.8926 208.2957)" class="st25 st5 st8" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	<g id="_x31_1s-l-11">
	<text transform="matrix(0 1 -1 0 156.8926 271.7483)" class="st25 st5 st8" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_10" v-if="slotCount === 10">
	<g id="Slots_10">
	<g id="_x31_0s-s-1">
	<rect x="135.8" y="347.9" class="st9" width="3.6" height="44.7" :class="getArtistColorByIndex(1)"/>
	<rect x="121" y="381.7" transform="matrix(-5.033947e-11 1 -1 -5.033947e-11 517.5154 271.5969)" class="st9" width="3.9" height="25.7" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x31_0s-s-2">
	<rect x="82.5" y="389.7" transform="matrix(-2.446417e-11 1 -1 -2.446417e-11 478.9648 310.1475)" class="st10" width="3.9" height="9.7" :class="getArtistColorByIndex(2)"/>
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="23" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="332.5" class="st10" width="3.9" height="37.1" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x31_0s-s-3">
	<rect x="24.6" y="262.1" class="st11" width="3.9" height="70.3" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x31_0s-s-4">
	<rect x="24.6" y="204.9" class="st12" width="3.9" height="57.2" :class="getArtistColorByIndex(4)"/>
	<rect x="24.6" y="159.4" class="st12" width="3.9" height="13.1" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x31_0s-s-5">
	<rect x="24.6" y="89" class="st13" width="3.9" height="70.3" :class="getArtistColorByIndex(5)"/>
	</g>
	<g id="_x31_0s-s-6">
	<rect x="24.6" y="41.8" class="st14" width="3.9" height="47.2" :class="getArtistColorByIndex(6)"/>
	<rect x="85.6" y="14.1" transform="matrix(6.445339e-11 -1 1 6.445339e-11 61.8445 113.1426)" class="st14" width="3.9" height="23.1" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x31_0s-s-7">
	<rect x="167.6" y="41.8" class="st15" width="3.9" height="49.2" :class="getArtistColorByIndex(7)"/>
	<rect x="107.7" y="15.1" transform="matrix(7.009599e-11 -1 1 7.009599e-11 83.9845 135.2827)" class="st15" width="3.9" height="21.2" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x31_0s-s-8">
	<rect x="167.6" y="110.8" transform="matrix(-1 -4.445878e-11 4.445878e-11 -1 338.9907 275.6513)" class="st16" width="3.9" height="54" :class="getArtistColorByIndex(8)"/>
	<rect x="167.6" y="91" transform="matrix(-1 -4.445878e-11 4.445878e-11 -1 338.9908 198.2894)" class="st16" width="3.9" height="16.4" :class="getArtistColorByIndex(8)"/>
	</g>
	<g id="_x31_0s-s-9">
	<rect x="167.6" y="164.8" class="st17" width="3.9" height="70.3" :class="getArtistColorByIndex(9)"/>
	</g>
	<g id="_x31_0s-s-10">
	<rect x="167.6" y="235.2" class="st3" width="3.9" height="70.6" :class="getArtistColorByIndex(10)"/>
	</g>
	</g>
	<g id="Edges_10">
	<g id="_x31_0s-e-9not10" v-if="slot09 !== slot10">
	<g>
	<line class="st20" x1="167.6" y1="235.2" x2="166.1" y2="235.2"/>
	<line class="st21" x1="163.7" y1="235.2" x2="155.4" y2="235.2"/>
	<line class="st20" x1="154.2" y1="235.2" x2="152.7" y2="235.2"/>
	</g>
	</g>
	<g id="_x31_0s-e-8not9" v-if="slot08 !== slot09">
	<g>
	<line class="st20" x1="167.6" y1="164.8" x2="166.1" y2="164.8"/>
	<line class="st21" x1="163.7" y1="164.8" x2="155.4" y2="164.8"/>
	<line class="st20" x1="154.2" y1="164.8" x2="152.7" y2="164.8"/>
	</g>
	</g>
	<g id="_x31_0s-e-7not8" v-if="slot07 !== slot08">
	<g>
	<line class="st20" x1="167.6" y1="91" x2="166.1" y2="91"/>
	<line class="st21" x1="163.7" y1="91" x2="155.4" y2="91"/>
	<line class="st20" x1="154.2" y1="91" x2="152.7" y2="91"/>
	</g>
	</g>
	<g id="_x31_0s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="99" y1="27.6" x2="99" y2="29.1"/>
	<line class="st21" x1="99" y1="31.5" x2="99" y2="39.8"/>
	<line class="st20" x1="99" y1="41" x2="99" y2="42.5"/>
	</g>
	</g>
	<g id="_x31_0s-e-5not6" v-if="slot05 !== slot06">
	<g>
	<line class="st20" x1="28.5" y1="89" x2="30" y2="89"/>
	<line class="st21" x1="32.4" y1="89" x2="40.7" y2="89"/>
	<line class="st20" x1="41.9" y1="89" x2="43.4" y2="89"/>
	</g>
	</g>
	<g id="_x31_0s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="160" x2="30" y2="160"/>
	<line class="st21" x1="32.4" y1="160" x2="40.7" y2="160"/>
	<line class="st20" x1="41.9" y1="160" x2="43.4" y2="160"/>
	</g>
	</g>
	<g id="_x31_0s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="28.5" y1="262.1" x2="30" y2="262.1"/>
	<line class="st21" x1="32.4" y1="262.1" x2="40.7" y2="262.1"/>
	<line class="st20" x1="41.9" y1="262.1" x2="43.4" y2="262.1"/>
	</g>
	</g>
	<g id="_x31_0s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="28.5" y1="332.5" x2="30" y2="332.5"/>
	<line class="st21" x1="32.4" y1="332.5" x2="40.7" y2="332.5"/>
	<line class="st20" x1="41.9" y1="332.5" x2="43.4" y2="332.5"/>
	</g>
	</g>
	<g id="_x31_0s-e-1not2" v-if="slot01 !== slot02">
	<g>
	<line class="st20" x1="100.4" y1="392.6" x2="100.4" y2="391.1"/>
	<line class="st21" x1="100.4" y1="388.7" x2="100.4" y2="380.4"/>
	<line class="st20" x1="100.4" y1="379.2" x2="100.4" y2="377.7"/>
	</g>
	</g>
	</g>
	<g id="Measurements_10">
	<g id="_x31_0s-m-9not10_1_" v-if="slot09 !== slot10">
	<text transform="matrix(0 1 -1 0 186.6699 270.4388)" class="st22 st23 st6">98”</text>
	<polyline class="st24" points="173.4,305.7 182.7,270.5 173.4,235.2 "/>
	</g>
	<g id="_x31_0s-m-8not9" v-if="slot08 !== slot09">
	<text transform="matrix(0 1 -1 0 186.6699 137.8258)" class="st22 st23 st6">75”</text>
	<polyline class="st24" points="173.4,164.8 182.7,137.9 173.4,110.8 "/>
	</g>
	<g id="_x31_0s-m-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(0 1 -1 0 186.6699 99.1445)" class="st22 st23 st6">23”</text>
	<polyline class="st24" points="173.4,107.3 182.7,99.2 173.4,91 "/>
	</g>
	<g id="_x31_0s-m-6not7_1_" v-if="slot06 !== slot07">
	<text transform="matrix(1 0 0 1 99.0452 19.823)" class="st22 st23 st6">half-ish</text>
	</g>
	<g id="_x31_0s-m-5not6" v-if="slot05 !== slot06">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 65.4219)" class="st22 st23 st6">66”</text>
	<polyline class="st24" points="22.6,41.8 13.3,65.3 22.6,89 "/>
	</g>
	<g id="_x31_0s-m-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 165.9326)" class="st22 st23 st6">18”</text>
	<polyline class="st24" points="22.6,160 13.3,166.2 22.6,172.5 "/>
	</g>
	<g id="_x31_0s-m-3not4" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 233.5039)" class="st22 st23 st6">80”</text>
	<polyline class="st24" points="22.6,204.9 13.3,233.4 22.6,262.1 "/>
	</g>
	<g id="_x31_0s-m-2not3" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 351.0244)" class="st22 st23 st6">52”</text>
	<polyline class="st24" points="22.6,332.5 13.3,351 22.6,369.6 "/>
	</g>
	<g id="_x31_0s-m-1not2" v-if="slot01 !== slot02">
	<text transform="matrix(1 0 0 1 118.0804 419.5984)" class="st22 st23 st6">49”</text>
	<polyline class="st24" points="100.4,399.5 118,408.8 135.8,399.5 "/>
	</g>
	</g>
	<g id="Label_10">
	<g id="_x31_0s-l-1not2-jr" v-if="slot01 !== slot02">
	<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_0s-l-1and2" v-if="slot01 === slot02">
	<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x31_0s-l-2not1-jr" v-if="slot02 !== slot01">
	<text transform="matrix(1 0 0 1 97.5316 387.7216)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_0s-l-2not3-jl" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0504 368.1484)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_0s-l-2and3" v-if="slot02 === slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 314.1074)" class="st25 st5 st8" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x31_0s-l-3not2" v-if="slot03 !== slot02">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 296.0918)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x31_0s-l-4">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 234.2734)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_0s-l-4not5-jl" v-if="slot04 !== slot05">
	<text transform="matrix(1 0 0 1 30.0436 168.5914)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x31_0s-l-5">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 126.373)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x31_0s-l-6">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 63.8467)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_0s-l-6and7_1_" v-if="slot06 === slot07">
	<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x31_0s-l-7and8" v-if="slot07 === slot08">
	<text transform="matrix(0 1 -1 0 156.8926 72.7738)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_0s-l-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(0 1 -1 0 156.8926 65.7682)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x31_0s-l-8not7-jr" v-if="slot08 !== slot07">
	<text transform="matrix(1 0 0 1 164.6412 102.6953)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_0s-l-8">
	<text transform="matrix(0 1 -1 0 156.8926 136.825)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x31_0s-l-9">
	<text transform="matrix(0 1 -1 0 156.8926 200.0574)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	<g id="_x31_0s-l-10">
	<text transform="matrix(0 1 -1 0 156.8926 269.4062)" class="st25 st5 st8" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_9" v-if="slotCount === 9">
	<g id="Slots_9">
	<g id="_x30_9s-s-1">
	<rect x="135.8" y="353.7" class="st9" width="3.6" height="38.9" :class="getArtistColorByIndex(1)"/>
	<rect x="106.1" y="375.1" transform="matrix(-7.621477e-11 1 -1 -7.621477e-11 502.6248 286.4876)" class="st9" width="3.9" height="38.9" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x30_9s-s-2">
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="15.7" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="307.5" class="st10" width="3.9" height="62.1" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x30_9s-s-3">
	<rect x="24.6" y="229.7" class="st11" width="3.9" height="77.8" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x30_9s-s-4">
	<rect x="24.6" y="204.9" class="st12" width="3.9" height="24.8" :class="getArtistColorByIndex(4)"/>
	<rect x="24.6" y="119.6" class="st12" width="3.9" height="52.9" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x30_9s-s-5">
	<rect x="24.6" y="41.8" class="st13" width="3.9" height="77.8" :class="getArtistColorByIndex(5)"/>
	</g>
	<g id="_x30_9s-s-6">
	<rect x="167.6" y="42" class="st14" width="3.9" height="26.9" :class="getArtistColorByIndex(6)"/>
	<rect x="96.3" y="0.2" transform="matrix(1.425491e-10 -1 1 1.425491e-10 72.6131 123.9112)" class="st14" width="3.9" height="50.8" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x30_9s-s-7">
	<rect x="167.6" y="68.9" class="st15" width="3.9" height="38.6" :class="getArtistColorByIndex(7)"/>
	<rect x="167.6" y="110.8" transform="matrix(-1 -2.140511e-10 2.140511e-10 -1 338.9909 261.0337)" class="st15" width="3.9" height="39.4" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x30_9s-s-8">
	<rect x="167.6" y="150.2" transform="matrix(-1 -6.398272e-11 6.398272e-11 -1 338.9913 378.1602)" class="st16" width="3.9" height="77.8" :class="getArtistColorByIndex(8)"/>
	</g>
	<g id="_x30_9s-s-9">
	<rect x="167.6" y="228" class="st17" width="3.9" height="77.8" :class="getArtistColorByIndex(9)"/>
	</g>
	</g>
	<g id="Edges_9">
	<g id="_x30_9s-e-8not9" v-if="slot08 !== slot09">
	<g>
	<line class="st20" x1="167.6" y1="228" x2="166.1" y2="228"/>
	<line class="st21" x1="163.7" y1="228" x2="155.4" y2="228"/>
	<line class="st20" x1="154.2" y1="228" x2="152.7" y2="228"/>
	</g>
	</g>
	<g id="_x30_9s-e-7not8" v-if="slot07 !== slot08">
	<g>
	<line class="st20" x1="167.6" y1="150.2" x2="166.1" y2="150.2"/>
	<line class="st21" x1="163.7" y1="150.2" x2="155.4" y2="150.2"/>
	<line class="st20" x1="154.2" y1="150.2" x2="152.7" y2="150.2"/>
	</g>
	</g>
	<g id="_x30_9s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="167.6" y1="68.9" x2="166.1" y2="68.9"/>
	<line class="st21" x1="163.7" y1="68.9" x2="155.4" y2="68.9"/>
	<line class="st20" x1="154.2" y1="68.9" x2="152.7" y2="68.9"/>
	</g>
	</g>
	<g id="_x30_9s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="119.6" x2="30" y2="119.6"/>
	<line class="st21" x1="32.4" y1="119.6" x2="40.7" y2="119.6"/>
	<line class="st20" x1="41.9" y1="119.6" x2="43.4" y2="119.6"/>
	</g>
	</g>
	<g id="_x30_9s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="29.5" y1="229.7" x2="31" y2="229.7"/>
	<line class="st21" x1="33.4" y1="229.7" x2="41.7" y2="229.7"/>
	<line class="st20" x1="42.9" y1="229.7" x2="44.4" y2="229.7"/>
	</g>
	</g>
	<g id="_x30_9s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="29.5" y1="307.5" x2="31" y2="307.5"/>
	<line class="st21" x1="33.4" y1="307.5" x2="41.7" y2="307.5"/>
	<line class="st20" x1="42.9" y1="307.5" x2="44.4" y2="307.5"/>
	</g>
	</g>
	</g>
	<g id="Measurements_9">
	<g id="_x30_9s-m-9not8" v-if="slot09 !== slot08">
	<text transform="matrix(0 1 -1 0 186.6699 266.838)" class="st22 st23 st6">108”</text>
	<polyline class="st24" points="173.4,305.7 182.7,267 173.4,228 "/>
	</g>
	<g id="_x30_9s-m-7not8" v-if="slot07 !== slot08">
	<text transform="matrix(0 1 -1 0 186.6699 130.5169)" class="st22 st23 st6">55”</text>
	<polyline class="st24" points="173.4,150.2 182.7,130.6 173.4,110.8 "/>
	</g>
	<g id="_x30_9s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(0 1 -1 0 186.6699 55.475)" class="st22 st23 st6">38”</text>
	<polyline class="st24" points="173.4,68.9 182.7,55.5 173.4,42 "/>
	</g>
	<g id="_x30_9s-m-4not5" v-if="slot04 !== slot05">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 145.9395)" class="st22 st23 st6">74”</text>
	<polyline class="st24" points="22.6,119.6 13.3,145.9 22.6,172.5 "/>
	</g>
	<g id="_x30_9s-m-4not3" v-if="slot04 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3998 217.2998)" class="st22 st23 st6">34”</text>
	<polyline class="st24" points="22.6,204.9 13.3,217 22.6,229.2 "/>
	</g>
	<g id="_x30_9s-m-2not3" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 338.5293)" class="st22 st23 st6">86”</text>
	<polyline class="st24" points="22.6,307.5 13.3,338.4 22.6,369.6 "/>
	</g>
	</g>
	<g id="Label_9">
	<g id="_x30_9s-l-1">
	<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x30_9s-l-2">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 338.5293)" class="st25 st5 st8" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_9s-l-2-jl">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_9s-l-3not4" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 268.5967)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x30_9s-l-4and3" v-if="slot04 === slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 254.5869)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_9s-l-4not3-jl" v-if="slot04 !== slot03">
	<text transform="matrix(1 0 0 1 30.0436 218.8464)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_9s-l-4">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 145.9395)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_9s-l-5">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 80.6816)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x30_9s-l-6">
	<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_9s-l-7">
	<text transform="matrix(0 1 -1 0 156.8926 129.8194)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x30_9s-l-7not6" v-if="slot07 !== slot06">
	<text transform="matrix(0 1 -1 0 156.8926 87.7859)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x30_9s-l-6and7" v-if="slot06 === slot07">
	<text transform="matrix(0 1 -1 0 156.8926 72.7738)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_9s-l-6not7-jr" v-if="slot06 !== slot07">
	<text transform="matrix(1 0 0 1 164.8991 54.7593)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_9s-l-8">
	<text transform="matrix(0 1 -1 0 156.8926 189.0799)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	<g id="_x30_9s-l-9">
	<text transform="matrix(0 1 -1 0 156.8926 266.838)" class="st25 st5 st8" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_8" v-if="slotCount === 8">
	<g id="Slots_8">
	<g id="_x30_8s-s-1">
	<rect x="135.8" y="348.7" class="st9" width="3.6" height="44" :class="getArtistColorByIndex(1)"/>
	<rect x="106.6" y="372.6" transform="matrix(-7.621477e-11 1 -1 -7.621477e-11 503.1252 285.9872)" class="st9" width="3.9" height="43.9" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x30_8s-s-2">
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="11.2" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="292.7" class="st10" width="3.9" height="76.9" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x30_8s-s-3">
	<rect x="24.6" y="204.9" class="st11" width="3.9" height="87.8" :class="getArtistColorByIndex(3)"/>
	</g>
	<g id="_x30_8s-s-4">
	<rect x="24.6" y="86.4" class="st12" width="3.9" height="87.8" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x30_8s-s-5">
	<rect x="24.6" y="41.8" class="st13" width="3.9" height="44.6" :class="getArtistColorByIndex(5)"/>
	<g id="_x30_8s-s-5_1_">
	<rect x="96.3" y="4" transform="matrix(5.645535e-11 -1 1 5.645535e-11 72.613 123.9114)" class="st13" width="3.9" height="43.2" :class="getArtistColorByIndex(5)"/>
	</g>
	</g>
	<g id="_x30_8s-s-6">
	<rect x="167.6" y="110.8" class="st14" width="3.9" height="19.2" :class="getArtistColorByIndex(6)"/>
	<rect x="167.6" y="38.7" transform="matrix(-1 -1.872437e-10 1.872437e-10 -1 338.9908 146.0158)" class="st14" width="3.9" height="68.6" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x30_8s-s-7">
	<rect x="167.6" y="130" transform="matrix(-1 -2.140511e-10 2.140511e-10 -1 338.9909 347.9203)" class="st15" width="3.9" height="87.8" :class="getArtistColorByIndex(7)"/>
	</g>
	<g id="_x30_8s-s-8">
	<rect x="167.6" y="217.9" transform="matrix(-1 -1.279653e-10 1.279653e-10 -1 338.9919 523.5957)" class="st16" width="3.9" height="87.8" :class="getArtistColorByIndex(8)"/>
	</g>
	</g>
	<g id="Edges_8">
	<g id="_x30_8s-e-7not8" v-if="slot07 !== slot08">
	<g>
	<line class="st20" x1="167.6" y1="217.9" x2="166.1" y2="217.9"/>
	<line class="st21" x1="163.7" y1="217.9" x2="155.4" y2="217.9"/>
	<line class="st20" x1="154.2" y1="217.9" x2="152.7" y2="217.9"/>
	</g>
	</g>
	<g id="_x30_8s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="167.6" y1="130" x2="166.1" y2="130"/>
	<line class="st21" x1="163.7" y1="130" x2="155.4" y2="130"/>
	<line class="st20" x1="154.2" y1="130" x2="152.7" y2="130"/>
	</g>
	</g>
	<g id="_x30_8s-e-4not5" v-if="slot04 !== slot05">
	<g>
	<line class="st20" x1="28.5" y1="86.4" x2="30" y2="86.4"/>
	<line class="st21" x1="32.4" y1="86.4" x2="40.7" y2="86.4"/>
	<line class="st20" x1="41.9" y1="86.4" x2="43.4" y2="86.4"/>
	</g>
	</g>
	<g id="_x30_8s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="29.5" y1="292.7" x2="31" y2="292.7"/>
	<line class="st21" x1="33.4" y1="292.7" x2="41.7" y2="292.7"/>
	<line class="st20" x1="42.9" y1="292.7" x2="44.4" y2="292.7"/>
	</g>
	</g>
	</g>
	<g id="Measurements_8">
	<g id="_x30_8s-m-8not7" v-if="slot08 !== slot07">
	<text transform="matrix(0 1 -1 0 186.6699 261.7979)" class="st22 st23 st6">122”</text>
	<polyline class="st24" points="173.4,305.7 182.7,261.9 173.4,217.9 "/>
	</g>
	<g id="_x30_8s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(0 1 -1 0 186.6699 120.4366)" class="st22 st23 st6">27”</text>
	<polyline class="st24" points="173.4,130 182.7,120.5 173.4,110.8 "/>
	</g>
	<g id="_x30_8s-m-5not4" v-if="slot05 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 64.1211)" class="st22 st23 st6">62”</text>
	<polyline class="st24" points="22.6,41.8 13.3,64.1 22.6,86.4 "/>
	</g>
	<g id="_x30_8s-m-2not3" v-if="slot02 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 331.1514)" class="st22 st23 st6">107”</text>
	<polyline class="st24" points="22.6,292.7 13.3,331 22.6,369.6 "/>
	</g>
	</g>
	<g id="Label_8">
	<g id="_x30_8s-l-1">
	<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x30_8s-l-2">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 331.1514)" class="st25 st5 st8" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_8s-l-2-jl">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_8s-l-3">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 248.8018)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x30_8s-l-4">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 130.3594)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_8s-l-5">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 64.1211)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x30_8s-l-5z">
	<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x30_8s-l-6">
	<text transform="matrix(0 1 -1 0 156.8926 73.0081)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_8s-l-6not7-jr" v-if="slot06 !== slot07">
	<text transform="matrix(1 0 0 1 165.0612 124.843)" class="st25 st5 st8 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_8s-l-7and6" v-if="slot07 === slot06">
	<text transform="matrix(0 1 -1 0 156.3535 167.907)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x30_8s-l-7not6" v-if="slot07 !== slot06">
	<text transform="matrix(0 1 -1 0 156.8926 174.9122)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	<g id="_x30_8s-l-8">
	<text transform="matrix(0 1 -1 0 156.8926 261.7979)" class="st25 st5 st8" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_7" v-if="slotCount === 7">
	<g id="Slots_7">
	<g id="_x30_7s-s-1">
	<rect x="135.8" y="351.9" class="st9" width="3.6" height="40.7" :class="getArtistColorByIndex(1)"/>
	<rect x="103.1" y="376.2" transform="matrix(-6.398278e-11 1 -1 -6.398278e-11 499.5803 289.5321)" class="st9" width="3.9" height="36.8" :class="getArtistColorByIndex(1)"/>
	</g>
	<g id="_x30_7s-s-2">
	<rect x="47.3" y="369.6" class="st10" width="3.9" height="23" :class="getArtistColorByIndex(2)"/>
	<rect x="24.6" y="272.3" class="st10" width="3.9" height="97.3" :class="getArtistColorByIndex(2)"/>
	</g>
	<g id="_x30_7s-s-3">
	<rect x="24.6" y="204.9" class="st11" width="3.9" height="67.4" :class="getArtistColorByIndex(3)"/>
	<g id="_x30_8s-s-3_2_">
	<rect x="24.6" y="142.3" class="st11" width="3.9" height="30.2" :class="getArtistColorByIndex(3)"/>
	</g>
	</g>
	<g id="_x30_7s-s-4">
	<rect x="24.6" y="41.8" class="st12" width="3.9" height="100.5" :class="getArtistColorByIndex(4)"/>
	</g>
	<g id="_x30_7s-s-5">
	<rect x="167.6" y="45" class="st13" width="3.9" height="59.2" :class="getArtistColorByIndex(5)"/>
	<g id="_x30_8s-s-5_3_">
	<rect x="96.3" y="5" transform="matrix(5.410256e-11 -1 1 5.410256e-11 72.613 123.9114)" class="st13" width="3.9" height="41.4" :class="getArtistColorByIndex(5)"/>
	</g>
	</g>
	<g id="_x30_7s-s-6">
	<rect x="167.6" y="110.8" class="st14" width="3.9" height="97.3" :class="getArtistColorByIndex(6)"/>
	</g>
	<g id="_x30_7s-s-7">
	<rect x="167.6" y="208.2" transform="matrix(-1 -2.272237e-10 2.272237e-10 -1 338.9909 513.6686)" class="st15" width="3.9" height="97.3" :class="getArtistColorByIndex(7)"/>
	</g>
	</g>
	<g id="Edges_7">
	<g id="_x30_7s-e-6not7" v-if="slot06 !== slot07">
	<g>
	<line class="st20" x1="167.6" y1="208.2" x2="166.1" y2="208.2"/>
	<line class="st21" x1="163.7" y1="208.2" x2="155.4" y2="208.2"/>
	<line class="st20" x1="154.2" y1="208.2" x2="152.7" y2="208.2"/>
	</g>
	</g>
	<g id="_x30_7s-e-3not4" v-if="slot03 !== slot04">
	<g>
	<line class="st20" x1="28.5" y1="142.3" x2="30" y2="142.3"/>
	<line class="st21" x1="32.4" y1="142.3" x2="40.7" y2="142.3"/>
	<line class="st20" x1="41.9" y1="142.3" x2="43.4" y2="142.3"/>
	</g>
	</g>
	<g id="_x30_7s-e-2not3" v-if="slot02 !== slot03">
	<g>
	<line class="st20" x1="29.5" y1="272.3" x2="31" y2="272.3"/>
	<line class="st21" x1="33.4" y1="272.3" x2="41.7" y2="272.3"/>
	<line class="st20" x1="42.9" y1="272.3" x2="44.4" y2="272.3"/>
	</g>
	</g>
	</g>
	<g id="Measurements_7">
	<g id="_x30_7s-m-6not7" v-if="slot06 !== slot07">
	<text transform="matrix(0 1 -1 0 174.4297 208.1671)" class="st22 st23 st6">half-ish</text>
	</g>
	<g id="_x30_7s-m-3not4" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 157.3994)" class="st22 st23 st6">41”</text>
	<polyline class="st24" points="22.6,142.3 13.3,157.4 22.6,172.5 "/>
	</g>
	<g id="_x30_7s-m-3not2" v-if="slot03 !== slot02">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.4 238.583)" class="st22 st23 st6">94”</text>
	<polyline class="st24" points="22.6,272.3 13.3,238.7 22.6,204.9 "/>
	</g>
	</g>
	<g id="Label_7">
	<g id="_x30_7s-l-1">
	<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
	</g>
	<g id="_x30_7s-l-2">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 320.9326)" class="st25 st5 st8" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_7s-l-2-jl">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
	</g>
	<g id="_x30_7s-l-3">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 238.583)" class="st25 st5 st8" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x30_7s-l-3not4-jl" v-if="slot03 !== slot04">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 170.9102)" class="st25 st5 st8 jl" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
	</g>
	<g id="_x30_7s-l-4and3" v-if="slot04 === slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0512 101.0654)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_7s-l-4not3" v-if="slot04 !== slot03">
	<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 92.0586)" class="st25 st5 st8" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
	</g>
	<g id="_x30_7s-l-5z">
	<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x30_7s-l-5">
	<text transform="matrix(0 1 -1 0 156.8926 73.0081)" class="st25 st5 st8" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
	</g>
	<g id="_x30_7s-l-6">
	<text transform="matrix(0 1 -1 0 156.8926 159.4998)" class="st25 st5 st8" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
	</g>
	<g id="_x30_7s-l-7">
	<text transform="matrix(0 1 -1 0 156.8926 256.8341)" class="st25 st5 st8" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
	</g>
	</g>
	</g>
	<g id="show_if_slots_6" v-if="slotCount === 6">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="145"/>
	<rect x="96.7" y="161.8" class="st4" width="66.3" height="106"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">No template </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">available for 3</text>
	<text transform="matrix(1 0 0 1 96.6717 192.9183)" class="st5 st6">full slots!</text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">Instead, use the </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">6 slot template. </text>
	<text transform="matrix(1 0 0 1 96.6717 240.9183)" class="st5 st6">(Double up </text>
	<text transform="matrix(1 0 0 1 96.6717 252.9183)" class="st5 st6">names.)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g id="show_if_slots_5" v-if="slotCount === 5">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="145"/>
	<rect x="96.7" y="161.8" class="st4" width="66.3" height="106"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">No template </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">available for 2.5 </text>
	<text transform="matrix(1 0 0 1 96.6717 192.9183)" class="st5 st6">full slots!</text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">Instead, use the </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">5 slot template. </text>
	<text transform="matrix(1 0 0 1 96.6717 240.9183)" class="st5 st6">(Double up </text>
	<text transform="matrix(1 0 0 1 96.6717 252.9183)" class="st5 st6">names.)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g id="show_if_slots_4" v-if="slotCount === 4">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="145"/>
	<rect x="96.7" y="161.8" class="st4" width="66.3" height="106"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">No template </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">available for 2</text>
	<text transform="matrix(1 0 0 1 96.6717 192.9183)" class="st5 st6">full slots!</text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">Instead, use the </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">4 slot template. </text>
	<text transform="matrix(1 0 0 1 96.6717 240.9183)" class="st5 st6">(Double up </text>
	<text transform="matrix(1 0 0 1 96.6717 252.9183)" class="st5 st6">names.)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	<g id="show_if_slots_3" v-if="slotCount === 3">
	<rect x="51.7" y="131.6" class="st3" width="87.4" height="145"/>
	<rect x="96.7" y="161.8" class="st4" width="66.3" height="106"/>
	<text transform="matrix(1 0 0 1 96.6717 168.9183)" class="st5 st6">No template </text>
	<text transform="matrix(1 0 0 1 96.6717 180.9183)" class="st5 st6">available for 1.5 </text>
	<text transform="matrix(1 0 0 1 96.6717 192.9183)" class="st5 st6">full slots!</text>
	<text transform="matrix(1 0 0 1 96.6717 216.9183)" class="st5 st6">Instead, use the </text>
	<text transform="matrix(1 0 0 1 96.6717 228.9183)" class="st5 st6">3 slot template. </text>
	<text transform="matrix(1 0 0 1 96.6717 240.9183)" class="st5 st6">(Double up </text>
	<text transform="matrix(1 0 0 1 96.6717 252.9183)" class="st5 st6">names.)</text>
	<g>
	<text transform="matrix(1 0 0 1 96.3279 149.2523)" class="st7 st5 st8">NO PREVIEW!</text>
	</g>
	</g>
	</g>
<g v-if="rigidView === false">
<line
	v-for="line in processedDottedLines"
	:x1="line.x1"
	:x2="line.x2"
	:y1="line.y1"
	:y2="line.y2"
	class="dotted-line"
/>
<polyline
	v-for="rect in processedRectangles"
	:class="getArtistColorByName(rect.artist)"
	:points="rect.points"
/>
</g>
	</svg>  
	</g>

</g>
`
});
