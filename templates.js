var rawTemplates = {
	up: `
	<g id="u00">
	<line class="st9" x1="50" y1="113.2" x2="68" y2="73.5"/>
	<line class="st9" x1="122.7" y1="27" x2="182.7" y2="27"/>
	<line class="st9" x1="182.7" y1="27" x2="182.7" y2="99.7"/>
	<line class="st9" x1="139.4" y1="130.2" x2="183.8" y2="149"/>
	<line class="st9" x1="183.8" y1="149" x2="183.8" y2="174.9"/>
	<line class="st9" x1="183.8" y1="178.1" x2="183.8" y2="329.4"/>
	<line class="st9" x1="141.3" y1="329.4" x2="141.3" y2="345.2"/>
	<line class="st9" x1="141.4" y1="379.4" x2="141.4" y2="485.4"/>
	<line id="ccw" class="st9" x1="35.2" y1="481.2" x2="35.2" y2="525.9"/>
	<line id="ccw_2_" class="st9" x1="165.7" y1="570.6" x2="182.2" y2="549.7"/>
	<line id="ccw_1_" class="st9" x1="179.5" y1="536.1" x2="179.5" y2="484.8"/>
	<line class="st9" x1="146.4" y1="351.2" x2="178.6" y2="351.2"/>
</g>
<g id="u01">
	<line class="st9" x1="122.7" y1="27" x2="182.7" y2="27"/>
	<line class="st9" x1="182.7" y1="27" x2="182.7" y2="99.7"/>
	<line id="ccw_7_" class="st9" x1="68" y1="73.5" x2="50" y2="113.2"/>
	<line class="st9" x1="139.4" y1="130.2" x2="183.8" y2="149"/>
	<line class="st9" x1="183.8" y1="149" x2="183.8" y2="174.9"/>
	<line class="st9" x1="183.8" y1="178.1" x2="183.8" y2="329.4"/>
	<line class="st9" x1="141.3" y1="329.4" x2="141.3" y2="345.2"/>
	<line class="st9" x1="141.4" y1="379.4" x2="141.4" y2="485.4"/>
	<line id="ccw_5_" class="st9" x1="35.2" y1="481.2" x2="35.2" y2="525.9"/>
	<line id="ccw_4_" class="st9" x1="165.7" y1="570.6" x2="182.2" y2="549.7"/>
	<line id="ccw_3_" class="st9" x1="179.5" y1="536.1" x2="179.5" y2="484.8"/>
	<line class="st9" x1="146.4" y1="351.2" x2="178.6" y2="351.2"/>
</g>
<g id="test0">
	<line class="st9" x1="122.7" y1="27" x2="182.7" y2="27"/>
	<line class="st9" x1="182.7" y1="27" x2="182.7" y2="99.7"/>
	<line class="st9" x1="139.4" y1="130.2" x2="183.8" y2="149"/>
	<line class="st9" x1="183.8" y1="149" x2="183.8" y2="174.9"/>
	<line class="st9" x1="183.8" y1="178.1" x2="183.8" y2="329.4"/>
	<line class="st9" x1="141.3" y1="329.4" x2="141.3" y2="345.2"/>
	<line class="st9" x1="141.4" y1="379.4" x2="141.4" y2="485.4"/>
	<line id="ccw_12_" class="st9" x1="35.2" y1="481.2" x2="35.2" y2="525.9"/>
	<line id="ccw_11_" class="st9" x1="165.7" y1="570.6" x2="182.2" y2="549.7"/>
	<line id="ccw_6_" class="st9" x1="179.5" y1="536.1" x2="179.5" y2="484.8"/>
	<line class="st9" x1="146.4" y1="351.2" x2="178.6" y2="351.2"/>
</g>
<g id="test1">
	<line class="st9" x1="41.9" y1="383.7" x2="34.7" y2="365.3"/>
	<line class="st9" x1="34.7" y1="365.3" x2="34.7" y2="265.2"/>
	<line class="st9" x1="34.9" y1="233.5" x2="34.9" y2="132.4"/>
	<line class="st9" x1="34.9" y1="132.4" x2="43.2" y2="114"/>
	<line class="st9" x1="50" y1="113.2" x2="68" y2="73.5"/>
	<line class="st9" x1="122.7" y1="27" x2="182.7" y2="27"/>
	<line class="st9" x1="182.7" y1="27" x2="182.7" y2="99.7"/>
	<line class="st9" x1="141.3" y1="329.4" x2="141.3" y2="345.2"/>
	<line class="st9" x1="141.4" y1="379.4" x2="141.4" y2="485.4"/>
	<line id="ccw_10_" class="st9" x1="35.2" y1="481.2" x2="35.2" y2="525.9"/>
	<line id="ccw_9_" class="st9" x1="165.7" y1="570.6" x2="182.2" y2="549.7"/>
	<line id="ccw_8_" class="st9" x1="179.5" y1="536.1" x2="179.5" y2="484.8"/>
	<line class="st9" x1="146.4" y1="351.2" x2="178.6" y2="351.2"/>
</g>
	`,
	down: `
	<g id="d00">
	<line class="st3" x1="135.8" y1="343.7" x2="135.8" y2="392.6"/>
	<line class="st3" x1="135.8" y1="392.6" x2="80.8" y2="392.6"/>
	<line class="st3" x1="51.2" y1="392.6" x2="51.2" y2="369.6"/>
	<line class="st3" x1="28.5" y1="369.6" x2="28.5" y2="204.9"/>
	<line class="st3" x1="28.5" y1="172.5" x2="28.5" y2="41.8"/>
	<line class="st3" x1="75.9" y1="27.6" x2="120.2" y2="27.6"/>
	<line class="st3" x1="167.6" y1="41.8" x2="167.6" y2="107.3"/>
	<line class="st3" x1="167.6" y1="110.8" x2="167.6" y2="305.5"/>
</g>
	`
}

var templates = {
	up: {},
	down: {},
}

Object.keys(rawTemplates).forEach(function (floorName) {
	var floorStringArray = rawTemplates[floorName].split('\n');
	var templateName = '';
	floorStringArray.forEach(function (line) {
		if (line.includes('g id="')) {
			templateName = line.trim().replace('<g id="','').replace('">','');
			templates[floorName][templateName] = templates[floorName][templateName] || [];
		}
		if (line.includes('<line')) {
			var parsedLine = {};
			var lineBody = line.trim().replace('<line ','').replace('/>','');
			//id="ccw_5_" class="st12" x1="35.1" y1="525.9" x2="35.1" y2="481.2"
			var attributes = lineBody.split(' ')
			//id="ccw_5_"
			attributes.forEach(function (attribute) {
				var attributeSplits = attribute.split('=');
				if (attributeSplits[1].includes('ccw')) {
					parsedLine.ccw = true;
				}
				if (
					attributeSplits[0].includes('x')
					|| attributeSplits[0].includes('y')
				) {
					var attributeBody = attributeSplits[1].replace('"','').replace('"','');
					parsedLine[attributeSplits[0]] = parseFloat(attributeBody);
					// TODO: multiply this number by 100 and use parseInt instead of parseFloat
					// All the svg drawing stuff will have to change
					// But then there's no more weird rounding garbage!
				}
			})
			var targetArray = templates[floorName][templateName]
			targetArray.push(parsedLine);
		}
	})
})
