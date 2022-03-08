var rawTemplates = {
	up: `
	<g id="u00">
		<line id="ccw_6_" class="st12" x1="68" y1="73.5" x2="50" y2="113.2"/>
		<line class="st12" x1="122.6" y1="26.6" x2="182.7" y2="26.6"/>
		<line class="st12" x1="182.7" y1="27" x2="182.7" y2="98.3"/>
		<line class="st12" x1="142" y1="131.4" x2="181.2" y2="147.9"/>
		<line class="st12" x1="183.8" y1="149" x2="183.8" y2="174.9"/>
		<line class="st12" x1="183.8" y1="178.1" x2="183.8" y2="329.4"/>
		<line class="st12" x1="141.4" y1="329.4" x2="141.4" y2="345.2"/>
		<line class="st12" x1="141.4" y1="381.8" x2="141.4" y2="483.4"/>
		<line id="ccw" class="st12" x1="35.1" y1="481.2" x2="35.1" y2="525.9"/>
		<line id="ccw_2_" class="st12" x1="165.9" y1="570.3" x2="181.9" y2="549.9"/>
		<line id="ccw_1_" class="st12" x1="179.5" y1="532" x2="179.5" y2="489.5"/>
		<line class="st12" x1="146.4" y1="351.2" x2="178.6" y2="351.2"/>
	</g>
	<g id="u01">
		<line class="st12" x1="122.5" y1="26.6" x2="182.6" y2="26.6"/>
		<line class="st12" x1="182.6" y1="27" x2="182.6" y2="98.3"/>
		<line id="ccw_7_" class="st12" x1="68.1" y1="73.5" x2="50.1" y2="113.2"/>
		<line class="st12" x1="141.9" y1="131.4" x2="181.1" y2="147.9"/>
		<line class="st12" x1="183.7" y1="149" x2="183.7" y2="174.9"/>
		<line class="st12" x1="183.7" y1="178.1" x2="183.7" y2="329.4"/>
		<line class="st12" x1="141.3" y1="329.4" x2="141.3" y2="345.2"/>
		<line class="st12" x1="141.3" y1="381.8" x2="141.3" y2="483.4"/>
		<line id="ccw_5_" class="st12" x1="35.2" y1="481.2" x2="35.2" y2="525.9"/>
		<line id="ccw_4_" class="st12" x1="166" y1="570.3" x2="182" y2="549.9"/>
		<line id="ccw_3_" class="st12" x1="179.6" y1="532" x2="179.6" y2="489.5"/>
		<line class="st12" x1="146.3" y1="351.2" x2="178.5" y2="351.2"/>
	</g>
	`,
	down: `
	<g id="d00">
		<line class="st3" x1="135.8" y1="351.9" x2="135.8" y2="392.6"/>
		<line class="st3" x1="121.2" y1="392.6" x2="80.8" y2="392.6"/>
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
