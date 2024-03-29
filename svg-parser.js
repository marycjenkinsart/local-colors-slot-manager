/*

This is probably awful. Instructions:

1. Change the map template in Illustrator, then save the SVG right in place
2. Copy the body of the SVG into the `data` variable below
3. Open `svg-parser.html` in a browser, then copy the last thing the console spits out
4. Paste awkwardly into the SVG preview Vue component
5. Delete the `style` tag in there, too (copy the style tag into the svg styles if it changed at all)
6. It should work now... don't break the Illustrator side too much!

When you're all done:

1. Remove the pallet group if it's still there
2. Get the Vue stuff put back:
	:x="stringX"
	:y="stringY"
	:viewBox="canvasSizeString"
3. Make all of the `.st` styles on one of the floors into something else so the two floors don't clash.
	a. I changed upstairs to `.ust` (though some `string` strings got caught up in that, so look for those afterward!)
4. Make all font-size 10px into 9px, and 12px into 11px, and genericized the font families
*/

var data = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 24.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 197 547.5" style="enable-background:new 0 0 197 547.5;" xml:space="preserve">
<style type="text/css">
	.st0{fill:none;stroke:#2E3191;stroke-miterlimit:10;}
	.st1{fill:none;stroke:#2E3191;stroke-miterlimit:10;stroke-dasharray:1,1;}
	.st2{fill:none;stroke:#C6C3E1;stroke-miterlimit:10;}
	.st3{fill:#FBED21;}
	.st4{fill:none;}
	.st5{font-family:'MyriadPro-Bold';}
	.st6{font-size:10px;}
	.st7{fill:#EB2027;}
	.st8{font-size:12px;}
	.st9{fill:#EC038C;}
	.st10{fill:#A3238E;}
	.st11{fill:#5C2D91;}
	.st12{fill:#034EA2;}
	.st13{fill:#007DC5;}
	.st14{fill:#29AAE1;}
	.st15{fill:#00A54F;}
	.st16{fill:#74BF44;}
	.st17{fill:#D6DE27;}
	.st18{fill:#FFCB04;}
	.st19{fill:#F48120;}
	.st20{fill:none;stroke:#2E3192;stroke-linecap:square;stroke-miterlimit:10;}
	.st21{fill:none;stroke:#2E3192;stroke-linecap:square;stroke-miterlimit:10;stroke-dasharray:2.3759,2.3759;}
	.st22{fill:#2E3192;}
	.st23{font-family:'ArialMT';}
	.st24{fill:none;stroke:#2E3192;stroke-miterlimit:10;}
	.st25{fill:#ED1C24;}
	.st26{fill:#F05A25;}
	.st27{fill:#F9A61B;}
	.st28{fill:#A4CD39;}
	.st29{fill:#0DB04B;}
	.st30{fill:#00A9AC;}
	.st31{fill:#0095DA;}
	.st32{fill:#0066B3;}
	.st33{fill:#812990;}
	.st34{fill:#C6168D;}
	.st35{fill:#200000;}
	.st36{fill:none;stroke:#D3D1E9;stroke-miterlimit:10;}
</style>
<g id="Downstairs_Base">
	<polyline class="st0" points="145.7,39.1 144.3,41.1 142,39.1 140.1,41.1 138.2,39.1 136.2,41.1 133.9,39.1 132,41.1 130.4,39.1 
		128.6,41.1 126.6,39.1 	"/>
	<polyline class="st0" points="69.9,39.1 68.5,41.1 66.3,39.1 64.3,41.1 62.4,39.1 60.4,41.1 58.1,39.1 56.2,41.1 54.6,39.1 
		52.8,41.1 50.8,39.1 	"/>
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
	<polyline class="st0" points="69.9,40.5 69.9,41.8 72.4,41.8 72.4,49.5 75.9,49.5 75.9,27.6 120.2,27.6 120.2,49.5 123.7,49.5 
		123.7,41.8 126.6,41.8 126.6,40.5 	"/>
	<polyline class="st0" points="53.7,392.6 51.2,392.6 51.2,369.6 28.5,369.6 28.5,204.9 46.1,204.9 46.1,203.6 32.8,196.4 
		32.8,180.9 46.1,173.7 46.1,172.5 28.5,172.5 28.5,41.8 50.8,41.8 50.8,40.5 	"/>
	<polyline class="st0" points="145.7,40.5 145.7,41.8 167.6,41.8 167.6,107.3 145.6,107.3 145.6,110.8 167.6,110.8 167.6,305.5 
		145.1,305.5 145.1,309.3 	"/>
	<path class="st0" d="M145.4,309c8.5,0.3,14.6-1.5,21.3,1.1c6.9,2.7,7.6,6.5,9.4,10.1"/>
	<polyline class="st0" points="175.7,320.1 175.7,366.8 175.7,441.7 	"/>
	<polyline class="st0" points="76.7,392.6 135.8,392.6 135.8,343.7 139.4,343.7 139.4,436.9 	"/>
	<path class="st0" d="M145.4,305.5c-9.6,0-19.4,10.9-19.4,21.6s5.6,16.5,13.3,16.5"/>
	<rect x="51.2" y="392.6" class="st1" width="84.6" height="152.6"/>
	<rect x="146.2" y="110.8" class="st2" width="21.3" height="194.7"/>
</g>
<g id="show_if_slots_16_1_">
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
<g id="show_if_slots_15">
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
<g id="show_if_slots_14_1_">
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
<g id="show_if_slots_13">
	<g id="Slots_13">
		<g id="_x31_3s-s-1">
			<rect x="135.8" y="356.9" class="st9" width="3.9" height="35.7"/>
			
				<rect x="124.7" y="385.4" transform="matrix(-3.105090e-11 1 -1 -3.105090e-11 521.1827 267.9296)" class="st9" width="3.9" height="18.3"/>
		</g>
		<g id="_x31_3s-s-2">
			
				<rect x="95" y="379.1" transform="matrix(-7.809682e-11 1 -1 -7.809682e-11 491.5364 297.576)" class="st10" width="3.9" height="31"/>
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="23"/>
		</g>
		<g id="_x31_3s-s-3">
			<rect x="24.6" y="312.9" class="st11" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-4">
			<rect x="24.6" y="258.9" class="st12" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-5">
			<rect x="24.6" y="204.9" class="st13" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-6">
			<rect x="24.6" y="115.3" class="st14" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-7">
			<rect x="24.6" y="61.3" class="st15" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-8">
			
				<rect x="91.2" y="8.4" transform="matrix(-2.869812e-11 1 -1 -2.869812e-11 118.824 -67.5259)" class="st16" width="3.9" height="34.5"/>
			
				<rect x="24.6" y="41.8" transform="matrix(-1 -1.599577e-11 1.599577e-11 -1 53.1508 103.1397)" class="st16" width="3.9" height="19.5"/>
		</g>
		<g id="_x31_3s-s-9">
			<rect x="167.6" y="41.8" class="st17" width="3.9" height="44.2"/>
			
				<rect x="113.4" y="20.7" transform="matrix(1.138521e-10 -1 1 1.138521e-10 89.6659 140.964)" class="st17" width="3.9" height="9.8"/>
		</g>
		<g id="_x31_3s-s-10">
			<rect x="167.6" y="110.8" class="st3" width="3.9" height="32.7"/>
			<rect x="167.6" y="86" class="st3" width="3.9" height="21.3"/>
		</g>
		<g id="_x31_3s-s-11">
			<rect x="167.6" y="143.5" class="st18" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-12">
			<rect x="167.6" y="197.5" class="st19" width="3.9" height="54"/>
		</g>
		<g id="_x31_3s-s-13">
			<rect x="167.6" y="251.5" class="st7" width="3.9" height="54"/>
		</g>
	</g>
	<g id="Edges_13">
		<g id="_x31_3s-e-12not13">
			<g>
				<line class="st20" x1="167.6" y1="251.5" x2="166.1" y2="251.5"/>
				<line class="st21" x1="163.7" y1="251.5" x2="155.4" y2="251.5"/>
				<line class="st20" x1="154.2" y1="251.5" x2="152.7" y2="251.5"/>
			</g>
		</g>
		<g id="_x31_3s-e-11not12">
			<g>
				<line class="st20" x1="167.6" y1="197.5" x2="166.1" y2="197.5"/>
				<line class="st21" x1="163.7" y1="197.5" x2="155.4" y2="197.5"/>
				<line class="st20" x1="154.2" y1="197.5" x2="152.7" y2="197.5"/>
			</g>
		</g>
		<g id="_x31_3s-e-10not11">
			<g>
				<line class="st20" x1="167.6" y1="143.5" x2="166.1" y2="143.5"/>
				<line class="st21" x1="163.7" y1="143.5" x2="155.4" y2="143.5"/>
				<line class="st20" x1="154.2" y1="143.5" x2="152.7" y2="143.5"/>
			</g>
		</g>
		<g id="_x31_3s-e-9not10">
			<g>
				<line class="st20" x1="167.6" y1="86" x2="166.1" y2="86"/>
				<line class="st21" x1="163.7" y1="86" x2="155.4" y2="86"/>
				<line class="st20" x1="154.2" y1="86" x2="152.7" y2="86"/>
			</g>
		</g>
		<g id="_x31_3s-e-8not9">
			<g>
				<line class="st20" x1="110.4" y1="27.6" x2="110.4" y2="29.1"/>
				<line class="st21" x1="110.4" y1="31.5" x2="110.4" y2="39.8"/>
				<line class="st20" x1="110.4" y1="41" x2="110.4" y2="42.5"/>
			</g>
		</g>
		<g id="_x31_3s-e-7not8">
			<g>
				<line class="st20" x1="28.5" y1="61.3" x2="30" y2="61.3"/>
				<line class="st21" x1="32.4" y1="61.3" x2="40.7" y2="61.3"/>
				<line class="st20" x1="41.9" y1="61.3" x2="43.4" y2="61.3"/>
			</g>
		</g>
		<g id="_x31_3s-e-6not7">
			<g>
				<line class="st20" x1="28.5" y1="115.3" x2="30" y2="115.3"/>
				<line class="st21" x1="32.4" y1="115.3" x2="40.7" y2="115.3"/>
				<line class="st20" x1="41.9" y1="115.3" x2="43.4" y2="115.3"/>
			</g>
		</g>
		<g id="_x31_3s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="258.9" x2="30" y2="258.9"/>
				<line class="st21" x1="32.4" y1="258.9" x2="40.7" y2="258.9"/>
				<line class="st20" x1="41.9" y1="258.9" x2="43.4" y2="258.9"/>
			</g>
		</g>
		<g id="_x31_3s-e-3not4">
			<g>
				<line class="st20" x1="28.5" y1="312.9" x2="30" y2="312.9"/>
				<line class="st21" x1="32.4" y1="312.9" x2="40.7" y2="312.9"/>
				<line class="st20" x1="41.9" y1="312.9" x2="43.4" y2="312.9"/>
			</g>
		</g>
		<g id="_x31_3s-e-1not2">
			<g>
				<line class="st20" x1="115.1" y1="392.6" x2="115.1" y2="391.1"/>
				<line class="st21" x1="115.1" y1="388.7" x2="115.1" y2="380.4"/>
				<line class="st20" x1="115.1" y1="379.2" x2="115.1" y2="377.7"/>
			</g>
		</g>
	</g>
	<g id="Measurements_13">
		<g id="_x31_3s-m-12not13">
			<text transform="matrix(0 1 -1 0 186.6699 278.5009)" class="st22 st23 st6">75”</text>
			<polyline class="st24" points="173.4,305.5 182.7,278.6 173.4,251.5 			"/>
		</g>
		<g id="_x31_3s-m-11not12">
			<text transform="matrix(0 1 -1 0 186.6699 154.1663)" class="st22 st23 st6">120”</text>
			<polyline class="st24" points="173.4,197.5 182.7,154.3 173.4,110.8 			"/>
		</g>
		<g id="_x31_3s-m-10not11">
			<text transform="matrix(0 1 -1 0 186.6699 127.0742)" class="st22 st23 st6">45”</text>
			<polyline class="st24" points="173.4,143.5 182.7,127.2 173.4,110.8 			"/>
		</g>
		<g id="_x31_3s-m-9not10">
			<text transform="matrix(0 1 -1 0 186.668 96.6555)" class="st22 st23 st6">30”</text>
			<polyline class="st24" points="173.4,107.3 182.7,96.7 173.4,86 			"/>
		</g>
		<g id="_x31_3s-m-8not9">
			<text transform="matrix(1 0 0 1 115.3146 8.4731)" class="st22 st23 st6">14”</text>
			<polyline class="st24" points="120.2,21.7 115.3,12.4 110.4,21.7 			"/>
		</g>
		<g id="_x31_3s-m-7not8">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 51.5703)" class="st22 st23 st6">27”</text>
			<polyline class="st24" points="22.6,41.8 13.3,51.5 22.6,61.3 			"/>
		</g>
		<g id="_x31_3s-m-6not7">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 142.3389)" class="st22 st23 st6">79”</text>
			<polyline class="st24" points="22.6,115.3 13.3,143.8 22.6,172.5 			"/>
		</g>
		<g id="_x31_3s-m-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 231.8828)" class="st22 st23 st6">75”</text>
			<polyline class="st24" points="22.6,204.9 13.3,231.8 22.6,258.9 			"/>
		</g>
		<g id="_x31_3s-m-3not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 341.2334)" class="st22 st23 st6">79”</text>
			<polyline class="st24" points="22.6,312.9 13.3,341.1 22.6,369.6 			"/>
		</g>
		<g id="_x31_3s-m-1not2">
			<text transform="matrix(1 0 0 1 125.4336 419.5984)" class="st22 st23 st6">29”</text>
			<polyline class="st24" points="115.1,399.5 125.4,408.8 135.8,399.5 			"/>
		</g>
	</g>
	<g id="Label_13">
		<g id="_x31_3s-l-1not2-jr">
			<text transform="matrix(0 1 -1 0 124.8086 390.5688)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-2not1-jr">
			<text transform="matrix(1 0 0 1 112.3488 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-2not1-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 62.6816 391.1221)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-1and2">
			<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 341.127)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 285.8838)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 230.6406)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 143.9102)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-7not8">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 86.8662)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-7and8">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 76.9502)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-8not7-jl">
			<text transform="matrix(1 0 0 1 30.0088 53.3824)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-8not9-jr">
			<text transform="matrix(1 0 0 1 108.2072 38.5626)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-8and9">
			<text transform="matrix(1 0 0 1 99.1997 38.5624)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-9not10-jr">
			<text transform="matrix(0 1 -1 0 156.8926 82.195)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-10not9-jr">
			<text transform="matrix(1 0 0 1 163.6621 102.6299)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-10not11-jr">
			<text transform="matrix(1 0 0 1 163.6617 123.647)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-10and11">
			<text transform="matrix(0 1 -1 0 156.8926 157.2549)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-9and10">
			<text transform="matrix(0 1 -1 0 156.8926 75.1893)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-11not10">
			<text transform="matrix(0 1 -1 0 156.8926 169.2645)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-12">
			<text transform="matrix(0 1 -1 0 156.8926 224.3085)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_3s-l-13">
			<text transform="matrix(0 1 -1 0 156.8926 277.3508)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_12">
	<g id="Slots_12">
		<g id="_x31_2s-s-1">
			<rect x="135.8" y="346.9" class="st9" width="3.6" height="45.7"/>
			
				<rect x="118" y="378.7" transform="matrix(-5.386821e-11 1 -1 -5.386821e-11 514.4502 274.6621)" class="st9" width="3.9" height="31.8"/>
		</g>
		<g id="_x31_2s-s-2">
			
				<rect x="89.8" y="383.7" transform="matrix(-5.504415e-11 1 -1 -5.504415e-11 486.2493 302.863)" class="st10" width="3.9" height="21.8"/>
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="23"/>
			<rect x="24.6" y="355.8" class="st10" width="3.9" height="13.8"/>
		</g>
		<g id="_x31_2s-s-3">
			<rect x="24.6" y="297.2" class="st11" width="3.9" height="58.6"/>
		</g>
		<g id="_x31_2s-s-4">
			<rect x="24.6" y="238.6" class="st12" width="3.9" height="58.6"/>
		</g>
		<g id="_x31_2s-s-5">
			<rect x="24.6" y="204.9" class="st13" width="3.9" height="33.7"/>
			<rect x="24.6" y="147.6" class="st13" width="3.9" height="24.9"/>
		</g>
		<g id="_x31_2s-s-6">
			<rect x="24.6" y="89" class="st14" width="3.9" height="58.6"/>
		</g>
		<g id="_x31_2s-s-7">
			<rect x="24.6" y="41.8" class="st15" width="3.9" height="47.2"/>
			
				<rect x="79.7" y="19.9" transform="matrix(3.787021e-11 -1 1 3.787021e-11 56.0131 107.3113)" class="st15" width="3.9" height="11.4"/>
		</g>
		<g id="_x31_2s-s-8">
			
				<rect x="101.9" y="9.2" transform="matrix(-2.728591e-11 1 -1 -2.728591e-11 129.4513 -78.1531)" class="st16" width="3.9" height="32.8"/>
			
				<rect x="167.6" y="41.8" transform="matrix(-1 -2.117074e-11 2.117074e-11 -1 338.9908 109.3707)" class="st16" width="3.9" height="25.8"/>
		</g>
		<g id="_x31_2s-s-9">
			<rect x="167.6" y="67.6" class="st17" width="3.9" height="39.8"/>
			
				<rect x="167.6" y="110.8" transform="matrix(-1 -3.055646e-10 3.055646e-10 -1 338.9908 240.5165)" class="st17" width="3.9" height="18.9"/>
		</g>
		<g id="_x31_2s-s-10">
			<rect x="167.6" y="129.7" class="st3" width="3.9" height="58.6"/>
		</g>
		<g id="_x31_2s-s-11">
			<rect x="167.6" y="188.3" class="st18" width="3.9" height="58.6"/>
		</g>
		<g id="_x31_2s-s-12">
			<rect x="167.6" y="246.9" class="st19" width="3.9" height="58.6"/>
		</g>
	</g>
	<g id="Edges_12">
		<g id="_x31_2s-e-11not12">
			<g>
				<line class="st20" x1="167.6" y1="246.9" x2="166.1" y2="246.9"/>
				<line class="st21" x1="163.7" y1="246.9" x2="155.4" y2="246.9"/>
				<line class="st20" x1="154.2" y1="246.9" x2="152.7" y2="246.9"/>
			</g>
		</g>
		<g id="_x31_2s-e-10not11">
			<g>
				<line class="st20" x1="167.6" y1="188.3" x2="166.1" y2="188.3"/>
				<line class="st21" x1="163.7" y1="188.3" x2="155.4" y2="188.3"/>
				<line class="st20" x1="154.2" y1="188.3" x2="152.7" y2="188.3"/>
			</g>
		</g>
		<g id="_x31_2s-e-9not10">
			<g>
				<line class="st20" x1="167.6" y1="129.7" x2="166.1" y2="129.7"/>
				<line class="st21" x1="163.7" y1="129.7" x2="155.4" y2="129.7"/>
				<line class="st20" x1="154.2" y1="129.7" x2="152.7" y2="129.7"/>
			</g>
		</g>
		<g id="_x31_2s-e-8not9">
			<g>
				<line class="st20" x1="167.6" y1="67.6" x2="166.1" y2="67.6"/>
				<line class="st21" x1="163.7" y1="67.6" x2="155.4" y2="67.6"/>
				<line class="st20" x1="154.2" y1="67.6" x2="152.7" y2="67.6"/>
			</g>
		</g>
		<g id="_x31_2s-e-7not8">
			<g>
				<line class="st20" x1="87.4" y1="27.6" x2="87.4" y2="29.1"/>
				<line class="st21" x1="87.4" y1="31.5" x2="87.4" y2="39.8"/>
				<line class="st20" x1="87.4" y1="41" x2="87.4" y2="42.5"/>
			</g>
		</g>
		<g id="_x31_2s-e-6not7">
			<g>
				<line class="st20" x1="28.5" y1="89" x2="30" y2="89"/>
				<line class="st21" x1="32.4" y1="89" x2="40.7" y2="89"/>
				<line class="st20" x1="41.9" y1="89" x2="43.4" y2="89"/>
			</g>
		</g>
		<g id="_x31_2s-e-5not6">
			<g>
				<line class="st20" x1="28.5" y1="147.6" x2="30" y2="147.6"/>
				<line class="st21" x1="32.4" y1="147.6" x2="40.7" y2="147.6"/>
				<line class="st20" x1="41.9" y1="147.6" x2="43.4" y2="147.6"/>
			</g>
		</g>
		<g id="_x31_2s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="238.6" x2="30" y2="238.6"/>
				<line class="st21" x1="32.4" y1="238.6" x2="40.7" y2="238.6"/>
				<line class="st20" x1="41.9" y1="238.6" x2="43.4" y2="238.6"/>
			</g>
		</g>
		<g id="_x31_2s-e-3not4">
			<g>
				<line class="st20" x1="28.5" y1="297.2" x2="30" y2="297.2"/>
				<line class="st21" x1="32.4" y1="297.2" x2="40.7" y2="297.2"/>
				<line class="st20" x1="41.9" y1="297.2" x2="43.4" y2="297.2"/>
			</g>
		</g>
		<g id="_x31_2s-e-2not3">
			<g>
				<line class="st20" x1="28.5" y1="355.8" x2="30" y2="355.8"/>
				<line class="st21" x1="32.4" y1="355.8" x2="40.7" y2="355.8"/>
				<line class="st20" x1="41.9" y1="355.8" x2="43.4" y2="355.8"/>
			</g>
		</g>
		<g id="_x31_2s-e-1not2">
			<g>
				<line class="st20" x1="103.3" y1="392.6" x2="103.3" y2="391.1"/>
				<line class="st21" x1="103.3" y1="388.7" x2="103.3" y2="380.4"/>
				<line class="st20" x1="103.3" y1="379.2" x2="103.3" y2="377.7"/>
			</g>
		</g>
	</g>
	<g id="Measurements_12">
		<g id="_x31_2s-m-11not12">
			<text transform="matrix(0 1 -1 0 186.668 276.1984)" class="st22 st23 st6">81”</text>
			<polyline class="st24" points="173.4,305.5 182.7,276.3 173.4,246.9 			"/>
		</g>
		<g id="_x31_2s-m-10not11">
			<text transform="matrix(0 1 -1 0 186.668 149.5607)" class="st22 st23 st6">108”</text>
			<polyline class="st24" points="173.4,188.3 182.7,149.7 173.4,110.8 			"/>
		</g>
		<g id="_x31_2s-m-9not10">
			<text transform="matrix(0 1 -1 0 186.6699 120.2582)" class="st22 st23 st6">26”</text>
			<polyline class="st24" points="173.4,129.7 182.7,120.3 173.4,110.8 			"/>
		</g>
		<g id="_x31_2s-m-8not9">
			<text transform="matrix(0 1 -1 0 186.6699 87.445)" class="st22 st23 st6">55”</text>
			<polyline class="st24" points="173.4,107.3 182.7,87.5 173.4,67.6 			"/>
		</g>
		<g id="_x31_2s-m-7not8">
			<text transform="matrix(1 0 0 1 81.6624 8.4731)" class="st22 st23 st6">16”</text>
			<polyline class="st24" points="87.4,21.7 81.7,12.4 75.9,21.7 			"/>
		</g>
		<g id="_x31_2s-m-6not7">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 65.3857)" class="st22 st23 st6">66”</text>
			<polyline class="st24" points="22.6,41.8 13.3,65.3 22.6,89 			"/>
		</g>
		<g id="_x31_2s-m-5not6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 160.0283)" class="st22 st23 st6">35”</text>
			<polyline class="st24" points="22.6,147.6 13.3,160 22.6,172.5 			"/>
		</g>
		<g id="_x31_2s-m-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 221.7314)" class="st22 st23 st6">47”</text>
			<polyline class="st24" points="22.6,204.9 13.3,221.7 22.6,238.6 			"/>
		</g>
		<g id="_x31_2s-m-3not4_1_">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 333.3838)" class="st22 st23 st6">100”</text>
			<polyline class="st24" points="22.6,297.2 13.3,333.3 22.6,369.6 			"/>
		</g>
		<g id="_x31_2s-m-2not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 362.6865)" class="st22 st23 st6">19”</text>
			<polyline class="st24" points="22.6,355.8 13.3,362.7 22.6,369.6 			"/>
		</g>
		<g id="_x31_2s-m-1not2">
			<text transform="matrix(1 0 0 1 119.894 419.5984)" class="st22 st23 st6">45”</text>
			<polyline class="st24" points="103.3,399.5 119.5,408.8 135.8,399.5 			"/>
		</g>
	</g>
	<g id="Label_12">
		<g id="_x31_2s-l-1not2-jr">
			<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-2not1-jr">
			<text transform="matrix(1 0 0 1 100.534 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-2not1-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 62.6816 391.1221)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-1and2">
			<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-3and2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 331.1211)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-3not2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 326.1162)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 267.3027)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0509 221.6338)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-5not6-jl">
			<text transform="matrix(1 0 0 1 30.407 167.9762)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-5and6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 125.8965)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-6not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 117.8887)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-7">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 64.9404)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-7and8">
			<text transform="matrix(1 0 0 1 97.5317 37.562)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-8not7">
			<text transform="matrix(1 0 0 1 104.5372 37.5619)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-8not9-jr">
			<text transform="matrix(1 0 0 1 165.0614 53.408)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-8and9">
			<text transform="matrix(0 1 -1 0 156.8926 74.1886)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-9not8">
			<text transform="matrix(0 1 -1 0 156.8926 86.198)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-9not10-jr">
			<text transform="matrix(1 0 0 1 163.6617 123.647)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-9and10">
			<text transform="matrix(0 1 -1 0 156.8926 149.2485)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-10not9">
			<text transform="matrix(0 1 -1 0 156.8926 157.2549)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-11">
			<text transform="matrix(0 1 -1 0 156.8926 215.3013)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_2s-l-12">
			<text transform="matrix(0 1 -1 0 156.8926 274.1969)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_11">
	<g id="Slots_11">
		<g id="_x31_1s-s-1">
			<rect x="135.8" y="353.7" class="st9" width="3.6" height="39"/>
			
				<rect x="121.4" y="382.1" transform="matrix(-4.234143e-11 1 -1 -4.234143e-11 517.8439 271.2684)" class="st9" width="3.9" height="25"/>
		</g>
		<g id="_x31_1s-s-2">
			
				<rect x="89.2" y="384.2" transform="matrix(-5.198615e-11 1 -1 -5.198615e-11 485.6785 303.4338)" class="st10" width="3.9" height="20.7"/>
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="23"/>
			<rect x="24.6" y="349.6" class="st10" width="3.9" height="20"/>
		</g>
		<g id="_x31_1s-s-3">
			<rect x="24.6" y="285.7" class="st11" width="3.9" height="63.9"/>
		</g>
		<g id="_x31_1s-s-4">
			<rect x="24.6" y="221.5" class="st12" width="3.9" height="64.2"/>
		</g>
		<g id="_x31_1s-s-5">
			<rect x="24.6" y="204.9" class="st13" width="3.9" height="16.6"/>
			<rect x="24.6" y="125.4" class="st13" width="3.9" height="47.1"/>
		</g>
		<g id="_x31_1s-s-6">
			<rect x="24.6" y="61.5" class="st14" width="3.9" height="63.9"/>
		</g>
		<g id="_x31_1s-s-7">
			<rect x="24.6" y="41.8" class="st15" width="3.9" height="19.7"/>
			
				<rect x="96.1" y="3.5" transform="matrix(1.463079e-10 -1 1 1.463079e-10 72.4331 123.7313)" class="st15" width="3.9" height="44.3"/>
		</g>
		<g id="_x31_1s-s-8">
			
				<rect x="167.6" y="41.8" transform="matrix(-1 -5.269175e-11 5.269175e-11 -1 338.9908 147.5386)" class="st16" width="3.9" height="63.9"/>
		</g>
		<g id="_x31_1s-s-9">
			<rect x="167.6" y="112.1" class="st17" width="3.9" height="63.9"/>
		</g>
		<g id="_x31_1s-s-10">
			<rect x="167.6" y="176" class="st3" width="3.9" height="63.9"/>
		</g>
		<g id="_x31_1s-s-11">
			<rect x="167.6" y="240" class="st18" width="3.9" height="63.9"/>
		</g>
	</g>
	<g id="Edges_11">
		<g id="_x31_1s-e-10not11">
			<g>
				<line class="st20" x1="167.6" y1="240" x2="166.1" y2="240"/>
				<line class="st21" x1="163.7" y1="240" x2="155.4" y2="240"/>
				<line class="st20" x1="154.2" y1="240" x2="152.7" y2="240"/>
			</g>
		</g>
		<g id="_x31_1s-e-9not10">
			<g>
				<line class="st20" x1="167.6" y1="176" x2="166.1" y2="176"/>
				<line class="st21" x1="163.7" y1="176" x2="155.4" y2="176"/>
				<line class="st20" x1="154.2" y1="176" x2="152.7" y2="176"/>
			</g>
		</g>
		<g id="_x31_1s-e-6not7">
			<g>
				<line class="st20" x1="28.5" y1="61.5" x2="30" y2="61.5"/>
				<line class="st21" x1="32.4" y1="61.5" x2="40.7" y2="61.5"/>
				<line class="st20" x1="41.9" y1="61.5" x2="43.4" y2="61.5"/>
			</g>
		</g>
		<g id="_x31_1s-e-5not6">
			<g>
				<line class="st20" x1="28.5" y1="125.4" x2="30" y2="125.4"/>
				<line class="st21" x1="32.4" y1="125.4" x2="40.7" y2="125.4"/>
				<line class="st20" x1="41.9" y1="125.4" x2="43.4" y2="125.4"/>
			</g>
		</g>
		<g id="_x31_1s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="221.5" x2="30" y2="221.5"/>
				<line class="st21" x1="32.4" y1="221.5" x2="40.7" y2="221.5"/>
				<line class="st20" x1="41.9" y1="221.5" x2="43.4" y2="221.5"/>
			</g>
		</g>
		<g id="_x31_1s-e-3not4">
			<g>
				<line class="st20" x1="28.5" y1="285.7" x2="30" y2="285.7"/>
				<line class="st21" x1="32.4" y1="285.7" x2="40.7" y2="285.7"/>
				<line class="st20" x1="41.9" y1="285.7" x2="43.4" y2="285.7"/>
			</g>
		</g>
		<g id="_x31_1s-e-2not3">
			<g>
				<line class="st20" x1="28.5" y1="349.6" x2="30" y2="349.6"/>
				<line class="st21" x1="32.4" y1="349.6" x2="40.7" y2="349.6"/>
				<line class="st20" x1="41.9" y1="349.6" x2="43.4" y2="349.6"/>
			</g>
		</g>
		<g id="_x31_1s-e-1not2">
			<g>
				<line class="st20" x1="105.8" y1="392.6" x2="105.8" y2="391.1"/>
				<line class="st21" x1="105.8" y1="388.7" x2="105.8" y2="380.4"/>
				<line class="st20" x1="105.8" y1="379.2" x2="105.8" y2="377.7"/>
			</g>
		</g>
	</g>
	<g id="Measurements_11">
		<g id="_x31_1s-m-10not11">
			<text transform="matrix(0 1 -1 0 186.668 272.7418)" class="st22 st23 st6">91”</text>
			<polyline class="st24" points="173.4,305.5 182.7,272.8 173.4,240 			"/>
		</g>
		<g id="_x31_1s-m-9not10">
			<text transform="matrix(0 1 -1 0 186.6699 143.5403)" class="st22 st23 st6">91”</text>
			<polyline class="st24" points="173.4,176 182.7,143.5 173.4,110.8 			"/>
		</g>
		<g id="_x31_1s-m-6not7">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 52.2998)" class="st22 st23 st6">27”</text>
			<polyline class="st24" points="22.6,41.8 13.3,51.6 22.6,61.5 			"/>
		</g>
		<g id="_x31_1s-m-5not6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 148.9365)" class="st22 st23 st6">65”</text>
			<polyline class="st24" points="22.6,125.4 13.3,148.9 22.6,172.5 			"/>
		</g>
		<g id="_x31_1s-m-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 213.7998)" class="st22 st23 st6">23”</text>
			<polyline class="st24" points="22.6,204.9 13.3,213.2 22.6,221.5 			"/>
		</g>
		<g id="_x31_1s-m-3not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 22.6404 285.6572)" class="st22 st23 st6">half-ish</text>
		</g>
		<g id="_x31_1s-m-2not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 362.6865)" class="st22 st23 st6">28”</text>
			<polyline class="st24" points="22.6,349.6 13.3,359.6 22.6,369.6 			"/>
		</g>
		<g id="_x31_1s-m-1not2">
			<text transform="matrix(1 0 0 1 119.894 419.5984)" class="st22 st23 st6">42”</text>
			<polyline class="st24" points="105.8,399.5 120.8,408.8 135.8,399.5 			"/>
		</g>
	</g>
	<g id="Label_11">
		<g id="_x31_1s-l-1not2-jr">
			<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-1and2">
			<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-2not1-jr">
			<text transform="matrix(1 0 0 1 100.534 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-2not3-jl">
			<text transform="matrix(1 0 0 1 28.6544 364.1004)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-2and3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0504 324.1143)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-3not2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 317.1094)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 252.29)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-4and5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 246.2842)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-5not4-jl">
			<text transform="matrix(1 0 0 1 30.0436 215.6291)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-5_1_">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 148.9131)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-6and7">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 91.8691)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-6not7_1_">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 82.8604)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-7not6-jl">
			<text transform="matrix(1 0 0 1 30.0436 54.9327)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-7">
			<text transform="matrix(1 0 0 1 97.5317 37.562)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-8">
			<text transform="matrix(0 1 -1 0 156.8926 72.187)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-9">
			<text transform="matrix(0 1 -1 0 156.8926 143.2436)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-10">
			<text transform="matrix(0 1 -1 0 156.8926 208.2957)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_1s-l-11">
			<text transform="matrix(0 1 -1 0 156.8926 271.7483)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_10">
	<g id="Slots_10">
		<g id="_x31_0s-s-1">
			<rect x="135.8" y="347.9" class="st9" width="3.6" height="44.7"/>
			
				<rect x="121" y="381.7" transform="matrix(-5.033947e-11 1 -1 -5.033947e-11 517.5154 271.5969)" class="st9" width="3.9" height="25.7"/>
		</g>
		<g id="_x31_0s-s-2">
			
				<rect x="82.5" y="389.7" transform="matrix(-2.446417e-11 1 -1 -2.446417e-11 478.9648 310.1475)" class="st10" width="3.9" height="9.7"/>
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="23"/>
			<rect x="24.6" y="332.5" class="st10" width="3.9" height="37.1"/>
		</g>
		<g id="_x31_0s-s-3">
			<rect x="24.6" y="262.1" class="st11" width="3.9" height="70.3"/>
		</g>
		<g id="_x31_0s-s-4">
			<rect x="24.6" y="204.9" class="st12" width="3.9" height="57.2"/>
			<rect x="24.6" y="159.4" class="st12" width="3.9" height="13.1"/>
		</g>
		<g id="_x31_0s-s-5">
			<rect x="24.6" y="89" class="st13" width="3.9" height="70.3"/>
		</g>
		<g id="_x31_0s-s-6">
			<rect x="24.6" y="41.8" class="st14" width="3.9" height="47.2"/>
			
				<rect x="85.6" y="14.1" transform="matrix(6.445339e-11 -1 1 6.445339e-11 61.8445 113.1426)" class="st14" width="3.9" height="23.1"/>
		</g>
		<g id="_x31_0s-s-7">
			<rect x="167.6" y="41.8" class="st15" width="3.9" height="49.2"/>
			
				<rect x="107.7" y="15.1" transform="matrix(7.009599e-11 -1 1 7.009599e-11 83.9845 135.2827)" class="st15" width="3.9" height="21.2"/>
		</g>
		<g id="_x31_0s-s-8">
			
				<rect x="167.6" y="110.8" transform="matrix(-1 -4.445878e-11 4.445878e-11 -1 338.9907 275.6513)" class="st16" width="3.9" height="54"/>
			
				<rect x="167.6" y="91" transform="matrix(-1 -4.445878e-11 4.445878e-11 -1 338.9908 198.2894)" class="st16" width="3.9" height="16.4"/>
		</g>
		<g id="_x31_0s-s-9">
			<rect x="167.6" y="164.8" class="st17" width="3.9" height="70.3"/>
		</g>
		<g id="_x31_0s-s-10">
			<rect x="167.6" y="235.2" class="st3" width="3.9" height="70.6"/>
		</g>
	</g>
	<g id="Edges_10">
		<g id="_x31_0s-e-9not10">
			<g>
				<line class="st20" x1="167.6" y1="235.2" x2="166.1" y2="235.2"/>
				<line class="st21" x1="163.7" y1="235.2" x2="155.4" y2="235.2"/>
				<line class="st20" x1="154.2" y1="235.2" x2="152.7" y2="235.2"/>
			</g>
		</g>
		<g id="_x31_0s-e-8not9">
			<g>
				<line class="st20" x1="167.6" y1="164.8" x2="166.1" y2="164.8"/>
				<line class="st21" x1="163.7" y1="164.8" x2="155.4" y2="164.8"/>
				<line class="st20" x1="154.2" y1="164.8" x2="152.7" y2="164.8"/>
			</g>
		</g>
		<g id="_x31_0s-e-7not8">
			<g>
				<line class="st20" x1="167.6" y1="91" x2="166.1" y2="91"/>
				<line class="st21" x1="163.7" y1="91" x2="155.4" y2="91"/>
				<line class="st20" x1="154.2" y1="91" x2="152.7" y2="91"/>
			</g>
		</g>
		<g id="_x31_0s-e-6not7">
			<g>
				<line class="st20" x1="99" y1="27.6" x2="99" y2="29.1"/>
				<line class="st21" x1="99" y1="31.5" x2="99" y2="39.8"/>
				<line class="st20" x1="99" y1="41" x2="99" y2="42.5"/>
			</g>
		</g>
		<g id="_x31_0s-e-5not6">
			<g>
				<line class="st20" x1="28.5" y1="89" x2="30" y2="89"/>
				<line class="st21" x1="32.4" y1="89" x2="40.7" y2="89"/>
				<line class="st20" x1="41.9" y1="89" x2="43.4" y2="89"/>
			</g>
		</g>
		<g id="_x31_0s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="160" x2="30" y2="160"/>
				<line class="st21" x1="32.4" y1="160" x2="40.7" y2="160"/>
				<line class="st20" x1="41.9" y1="160" x2="43.4" y2="160"/>
			</g>
		</g>
		<g id="_x31_0s-e-3not4">
			<g>
				<line class="st20" x1="28.5" y1="262.1" x2="30" y2="262.1"/>
				<line class="st21" x1="32.4" y1="262.1" x2="40.7" y2="262.1"/>
				<line class="st20" x1="41.9" y1="262.1" x2="43.4" y2="262.1"/>
			</g>
		</g>
		<g id="_x31_0s-e-2not3">
			<g>
				<line class="st20" x1="28.5" y1="332.5" x2="30" y2="332.5"/>
				<line class="st21" x1="32.4" y1="332.5" x2="40.7" y2="332.5"/>
				<line class="st20" x1="41.9" y1="332.5" x2="43.4" y2="332.5"/>
			</g>
		</g>
		<g id="_x31_0s-e-1not2">
			<g>
				<line class="st20" x1="100.4" y1="392.6" x2="100.4" y2="391.1"/>
				<line class="st21" x1="100.4" y1="388.7" x2="100.4" y2="380.4"/>
				<line class="st20" x1="100.4" y1="379.2" x2="100.4" y2="377.7"/>
			</g>
		</g>
	</g>
	<g id="Measurements_10">
		<g id="_x31_0s-m-9not10_1_">
			<text transform="matrix(0 1 -1 0 186.6699 270.4388)" class="st22 st23 st6">98”</text>
			<polyline class="st24" points="173.4,305.7 182.7,270.5 173.4,235.2 			"/>
		</g>
		<g id="_x31_0s-m-8not9">
			<text transform="matrix(0 1 -1 0 186.6699 137.8258)" class="st22 st23 st6">75”</text>
			<polyline class="st24" points="173.4,164.8 182.7,137.9 173.4,110.8 			"/>
		</g>
		<g id="_x31_0s-m-7not8">
			<text transform="matrix(0 1 -1 0 186.6699 99.1445)" class="st22 st23 st6">23”</text>
			<polyline class="st24" points="173.4,107.3 182.7,99.2 173.4,91 			"/>
		</g>
		<g id="_x31_0s-m-6not7_1_">
			<text transform="matrix(1 0 0 1 99.0452 19.823)" class="st22 st23 st6">half-ish</text>
		</g>
		<g id="_x31_0s-m-5not6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 65.4219)" class="st22 st23 st6">66”</text>
			<polyline class="st24" points="22.6,41.8 13.3,65.3 22.6,89 			"/>
		</g>
		<g id="_x31_0s-m-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 165.9326)" class="st22 st23 st6">18”</text>
			<polyline class="st24" points="22.6,160 13.3,166.2 22.6,172.5 			"/>
		</g>
		<g id="_x31_0s-m-3not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3996 233.5039)" class="st22 st23 st6">80”</text>
			<polyline class="st24" points="22.6,204.9 13.3,233.4 22.6,262.1 			"/>
		</g>
		<g id="_x31_0s-m-2not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3994 351.0244)" class="st22 st23 st6">52”</text>
			<polyline class="st24" points="22.6,332.5 13.3,351 22.6,369.6 			"/>
		</g>
		<g id="_x31_0s-m-1not2">
			<text transform="matrix(1 0 0 1 118.0804 419.5984)" class="st22 st23 st6">49”</text>
			<polyline class="st24" points="100.4,399.5 118,408.8 135.8,399.5 			"/>
		</g>
	</g>
	<g id="Label_10">
		<g id="_x31_0s-l-1not2-jr">
			<text transform="matrix(0 1 -1 0 124.8086 389.568)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-1and2">
			<text transform="matrix(1 0 0 1 107.3448 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-2not1-jr">
			<text transform="matrix(1 0 0 1 97.5316 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-2not3-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0504 368.1484)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-2and3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 314.1074)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-3not2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 296.0918)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 40.0517 234.2734)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-4not5-jl">
			<text transform="matrix(1 0 0 1 30.0436 168.5914)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 126.373)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-6">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 63.8467)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-6and7_1_">
			<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-7and8">
			<text transform="matrix(0 1 -1 0 156.8926 72.7738)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-7not8">
			<text transform="matrix(0 1 -1 0 156.8926 65.7682)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-8not7-jr">
			<text transform="matrix(1 0 0 1 164.6412 102.6953)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-8">
			<text transform="matrix(0 1 -1 0 156.8926 136.825)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-9">
			<text transform="matrix(0 1 -1 0 156.8926 200.0574)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x31_0s-l-10">
			<text transform="matrix(0 1 -1 0 156.8926 269.4062)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_9">
	<g id="Slots_9">
		<g id="_x30_9s-s-1">
			<rect x="135.8" y="353.7" class="st9" width="3.6" height="38.9"/>
			
				<rect x="106.1" y="375.1" transform="matrix(-7.621477e-11 1 -1 -7.621477e-11 502.6248 286.4876)" class="st9" width="3.9" height="38.9"/>
		</g>
		<g id="_x30_9s-s-2">
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="15.7"/>
			<rect x="24.6" y="307.5" class="st10" width="3.9" height="62.1"/>
		</g>
		<g id="_x30_9s-s-3">
			<rect x="24.6" y="229.7" class="st11" width="3.9" height="77.8"/>
		</g>
		<g id="_x30_9s-s-4">
			<rect x="24.6" y="204.9" class="st12" width="3.9" height="24.8"/>
			<rect x="24.6" y="119.6" class="st12" width="3.9" height="52.9"/>
		</g>
		<g id="_x30_9s-s-5">
			<rect x="24.6" y="41.8" class="st13" width="3.9" height="77.8"/>
		</g>
		<g id="_x30_9s-s-6">
			<rect x="167.6" y="42" class="st14" width="3.9" height="26.9"/>
			
				<rect x="96.3" y="0.2" transform="matrix(1.425491e-10 -1 1 1.425491e-10 72.6131 123.9112)" class="st14" width="3.9" height="50.8"/>
		</g>
		<g id="_x30_9s-s-7">
			<rect x="167.6" y="68.9" class="st15" width="3.9" height="38.6"/>
			
				<rect x="167.6" y="110.8" transform="matrix(-1 -2.140511e-10 2.140511e-10 -1 338.9909 261.0337)" class="st15" width="3.9" height="39.4"/>
		</g>
		<g id="_x30_9s-s-8">
			
				<rect x="167.6" y="150.2" transform="matrix(-1 -6.398272e-11 6.398272e-11 -1 338.9913 378.1602)" class="st16" width="3.9" height="77.8"/>
		</g>
		<g id="_x30_9s-s-9">
			<rect x="167.6" y="228" class="st17" width="3.9" height="77.8"/>
		</g>
	</g>
	<g id="Edges_9">
		<g id="_x30_9s-e-8not9">
			<g>
				<line class="st20" x1="167.6" y1="228" x2="166.1" y2="228"/>
				<line class="st21" x1="163.7" y1="228" x2="155.4" y2="228"/>
				<line class="st20" x1="154.2" y1="228" x2="152.7" y2="228"/>
			</g>
		</g>
		<g id="_x30_9s-e-7not8">
			<g>
				<line class="st20" x1="167.6" y1="150.2" x2="166.1" y2="150.2"/>
				<line class="st21" x1="163.7" y1="150.2" x2="155.4" y2="150.2"/>
				<line class="st20" x1="154.2" y1="150.2" x2="152.7" y2="150.2"/>
			</g>
		</g>
		<g id="_x30_9s-e-6not7">
			<g>
				<line class="st20" x1="167.6" y1="68.9" x2="166.1" y2="68.9"/>
				<line class="st21" x1="163.7" y1="68.9" x2="155.4" y2="68.9"/>
				<line class="st20" x1="154.2" y1="68.9" x2="152.7" y2="68.9"/>
			</g>
		</g>
		<g id="_x30_9s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="119.6" x2="30" y2="119.6"/>
				<line class="st21" x1="32.4" y1="119.6" x2="40.7" y2="119.6"/>
				<line class="st20" x1="41.9" y1="119.6" x2="43.4" y2="119.6"/>
			</g>
		</g>
		<g id="_x30_9s-e-3not4">
			<g>
				<line class="st20" x1="29.5" y1="229.7" x2="31" y2="229.7"/>
				<line class="st21" x1="33.4" y1="229.7" x2="41.7" y2="229.7"/>
				<line class="st20" x1="42.9" y1="229.7" x2="44.4" y2="229.7"/>
			</g>
		</g>
		<g id="_x30_9s-e-2not3">
			<g>
				<line class="st20" x1="29.5" y1="307.5" x2="31" y2="307.5"/>
				<line class="st21" x1="33.4" y1="307.5" x2="41.7" y2="307.5"/>
				<line class="st20" x1="42.9" y1="307.5" x2="44.4" y2="307.5"/>
			</g>
		</g>
	</g>
	<g id="Measurements_9">
		<g id="_x30_9s-m-9not8">
			<text transform="matrix(0 1 -1 0 186.6699 266.838)" class="st22 st23 st6">108”</text>
			<polyline class="st24" points="173.4,305.7 182.7,267 173.4,228 			"/>
		</g>
		<g id="_x30_9s-m-7not8">
			<text transform="matrix(0 1 -1 0 186.6699 130.5169)" class="st22 st23 st6">55”</text>
			<polyline class="st24" points="173.4,150.2 182.7,130.6 173.4,110.8 			"/>
		</g>
		<g id="_x30_9s-m-6not7">
			<text transform="matrix(0 1 -1 0 186.6699 55.475)" class="st22 st23 st6">38”</text>
			<polyline class="st24" points="173.4,68.9 182.7,55.5 173.4,42 			"/>
		</g>
		<g id="_x30_9s-m-4not5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 145.9395)" class="st22 st23 st6">74”</text>
			<polyline class="st24" points="22.6,119.6 13.3,145.9 22.6,172.5 			"/>
		</g>
		<g id="_x30_9s-m-4not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3998 217.2998)" class="st22 st23 st6">34”</text>
			<polyline class="st24" points="22.6,204.9 13.3,217 22.6,229.2 			"/>
		</g>
		<g id="_x30_9s-m-2not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 338.5293)" class="st22 st23 st6">86”</text>
			<polyline class="st24" points="22.6,307.5 13.3,338.4 22.6,369.6 			"/>
		</g>
	</g>
	<g id="Label_9">
		<g id="_x30_9s-l-1">
			<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 338.5293)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-2-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-3not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 268.5967)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-4and3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 254.5869)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-4not3-jl">
			<text transform="matrix(1 0 0 1 30.0436 218.8464)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 145.9395)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 80.6816)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-6">
			<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-7">
			<text transform="matrix(0 1 -1 0 156.8926 129.8194)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-7not6">
			<text transform="matrix(0 1 -1 0 156.8926 87.7859)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-6and7">
			<text transform="matrix(0 1 -1 0 156.8926 72.7738)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-6not7-jr">
			<text transform="matrix(1 0 0 1 164.8991 54.7593)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-8">
			<text transform="matrix(0 1 -1 0 156.8926 189.0799)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_9s-l-9">
			<text transform="matrix(0 1 -1 0 156.8926 266.838)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_8">
	<g id="Slots_8">
		<g id="_x30_8s-s-1">
			<rect x="135.8" y="348.7" class="st9" width="3.6" height="44"/>
			
				<rect x="106.6" y="372.6" transform="matrix(-7.621477e-11 1 -1 -7.621477e-11 503.1252 285.9872)" class="st9" width="3.9" height="43.9"/>
		</g>
		<g id="_x30_8s-s-2">
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="11.2"/>
			<rect x="24.6" y="292.7" class="st10" width="3.9" height="76.9"/>
		</g>
		<g id="_x30_8s-s-3">
			<rect x="24.6" y="204.9" class="st11" width="3.9" height="87.8"/>
		</g>
		<g id="_x30_8s-s-4">
			<rect x="24.6" y="86.4" class="st12" width="3.9" height="87.8"/>
		</g>
		<g id="_x30_8s-s-5">
			<rect x="24.6" y="41.8" class="st13" width="3.9" height="44.6"/>
			<g id="_x30_8s-s-5_1_">
				
					<rect x="96.3" y="4" transform="matrix(5.645535e-11 -1 1 5.645535e-11 72.613 123.9114)" class="st13" width="3.9" height="43.2"/>
			</g>
		</g>
		<g id="_x30_8s-s-6">
			<rect x="167.6" y="110.8" class="st14" width="3.9" height="19.2"/>
			
				<rect x="167.6" y="38.7" transform="matrix(-1 -1.872437e-10 1.872437e-10 -1 338.9908 146.0158)" class="st14" width="3.9" height="68.6"/>
		</g>
		<g id="_x30_8s-s-7">
			
				<rect x="167.6" y="130" transform="matrix(-1 -2.140511e-10 2.140511e-10 -1 338.9909 347.9203)" class="st15" width="3.9" height="87.8"/>
		</g>
		<g id="_x30_8s-s-8">
			
				<rect x="167.6" y="217.9" transform="matrix(-1 -1.279653e-10 1.279653e-10 -1 338.9919 523.5957)" class="st16" width="3.9" height="87.8"/>
		</g>
	</g>
	<g id="Edges_8">
		<g id="_x30_8s-e-7not8">
			<g>
				<line class="st20" x1="167.6" y1="217.9" x2="166.1" y2="217.9"/>
				<line class="st21" x1="163.7" y1="217.9" x2="155.4" y2="217.9"/>
				<line class="st20" x1="154.2" y1="217.9" x2="152.7" y2="217.9"/>
			</g>
		</g>
		<g id="_x30_8s-e-6not7">
			<g>
				<line class="st20" x1="167.6" y1="130" x2="166.1" y2="130"/>
				<line class="st21" x1="163.7" y1="130" x2="155.4" y2="130"/>
				<line class="st20" x1="154.2" y1="130" x2="152.7" y2="130"/>
			</g>
		</g>
		<g id="_x30_8s-e-4not5">
			<g>
				<line class="st20" x1="28.5" y1="86.4" x2="30" y2="86.4"/>
				<line class="st21" x1="32.4" y1="86.4" x2="40.7" y2="86.4"/>
				<line class="st20" x1="41.9" y1="86.4" x2="43.4" y2="86.4"/>
			</g>
		</g>
		<g id="_x30_8s-e-2not3">
			<g>
				<line class="st20" x1="29.5" y1="292.7" x2="31" y2="292.7"/>
				<line class="st21" x1="33.4" y1="292.7" x2="41.7" y2="292.7"/>
				<line class="st20" x1="42.9" y1="292.7" x2="44.4" y2="292.7"/>
			</g>
		</g>
	</g>
	<g id="Measurements_8">
		<g id="_x30_8s-m-8not7">
			<text transform="matrix(0 1 -1 0 186.6699 261.7979)" class="st22 st23 st6">122”</text>
			<polyline class="st24" points="173.4,305.7 182.7,261.9 173.4,217.9 			"/>
		</g>
		<g id="_x30_8s-m-6not7">
			<text transform="matrix(0 1 -1 0 186.6699 120.4366)" class="st22 st23 st6">27”</text>
			<polyline class="st24" points="173.4,130 182.7,120.5 173.4,110.8 			"/>
		</g>
		<g id="_x30_8s-m-5not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3995 64.1211)" class="st22 st23 st6">62”</text>
			<polyline class="st24" points="22.6,41.8 13.3,64.1 22.6,86.4 			"/>
		</g>
		<g id="_x30_8s-m-2not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 331.1514)" class="st22 st23 st6">107”</text>
			<polyline class="st24" points="22.6,292.7 13.3,331 22.6,369.6 			"/>
		</g>
	</g>
	<g id="Label_8">
		<g id="_x30_8s-l-1">
			<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 331.1514)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-2-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 248.8018)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 130.3594)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-5">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 64.1211)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-5z">
			<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-6">
			<text transform="matrix(0 1 -1 0 156.8926 73.0081)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-6not7-jr">
			<text transform="matrix(1 0 0 1 165.0612 124.843)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-7and6">
			<text transform="matrix(0 1 -1 0 156.3535 167.907)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-7not6">
			<text transform="matrix(0 1 -1 0 156.8926 174.9122)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_8s-l-8">
			<text transform="matrix(0 1 -1 0 156.8926 261.7979)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_7">
	<g id="Slots_7">
		<g id="_x30_7s-s-1">
			<rect x="135.8" y="351.9" class="st9" width="3.6" height="40.7"/>
			
				<rect x="103.1" y="376.2" transform="matrix(-6.398278e-11 1 -1 -6.398278e-11 499.5803 289.5321)" class="st9" width="3.9" height="36.8"/>
		</g>
		<g id="_x30_7s-s-2">
			<rect x="47.3" y="369.6" class="st10" width="3.9" height="23"/>
			<rect x="24.6" y="272.3" class="st10" width="3.9" height="97.3"/>
		</g>
		<g id="_x30_7s-s-3">
			<rect x="24.6" y="204.9" class="st11" width="3.9" height="67.4"/>
			<g id="_x30_8s-s-3_2_">
				<rect x="24.6" y="142.3" class="st11" width="3.9" height="30.2"/>
			</g>
		</g>
		<g id="_x30_7s-s-4">
			<rect x="24.6" y="41.8" class="st12" width="3.9" height="100.5"/>
		</g>
		<g id="_x30_7s-s-5">
			<rect x="167.6" y="45" class="st13" width="3.9" height="59.2"/>
			<g id="_x30_8s-s-5_3_">
				
					<rect x="96.3" y="5" transform="matrix(5.410256e-11 -1 1 5.410256e-11 72.613 123.9114)" class="st13" width="3.9" height="41.4"/>
			</g>
		</g>
		<g id="_x30_7s-s-6">
			<rect x="167.6" y="110.8" class="st14" width="3.9" height="97.3"/>
		</g>
		<g id="_x30_7s-s-7">
			
				<rect x="167.6" y="208.2" transform="matrix(-1 -2.272237e-10 2.272237e-10 -1 338.9909 513.6686)" class="st15" width="3.9" height="97.3"/>
		</g>
	</g>
	<g id="Edges_7">
		<g id="_x30_7s-e-6not7">
			<g>
				<line class="st20" x1="167.6" y1="208.2" x2="166.1" y2="208.2"/>
				<line class="st21" x1="163.7" y1="208.2" x2="155.4" y2="208.2"/>
				<line class="st20" x1="154.2" y1="208.2" x2="152.7" y2="208.2"/>
			</g>
		</g>
		<g id="_x30_7s-e-3not4">
			<g>
				<line class="st20" x1="28.5" y1="142.3" x2="30" y2="142.3"/>
				<line class="st21" x1="32.4" y1="142.3" x2="40.7" y2="142.3"/>
				<line class="st20" x1="41.9" y1="142.3" x2="43.4" y2="142.3"/>
			</g>
		</g>
		<g id="_x30_7s-e-2not3">
			<g>
				<line class="st20" x1="29.5" y1="272.3" x2="31" y2="272.3"/>
				<line class="st21" x1="33.4" y1="272.3" x2="41.7" y2="272.3"/>
				<line class="st20" x1="42.9" y1="272.3" x2="44.4" y2="272.3"/>
			</g>
		</g>
	</g>
	<g id="Measurements_7">
		<g id="_x30_7s-m-6not7">
			<text transform="matrix(0 1 -1 0 174.4297 208.1671)" class="st22 st23 st6">half-ish</text>
		</g>
		<g id="_x30_7s-m-3not4">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.3997 157.3994)" class="st22 st23 st6">41”</text>
			<polyline class="st24" points="22.6,142.3 13.3,157.4 22.6,172.5 			"/>
		</g>
		<g id="_x30_7s-m-3not2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 9.4 238.583)" class="st22 st23 st6">94”</text>
			<polyline class="st24" points="22.6,272.3 13.3,238.7 22.6,204.9 			"/>
		</g>
	</g>
	<g id="Label_7">
		<g id="_x30_7s-l-1">
			<text transform="matrix(1 0 0 1 110.877 387.7216)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-2">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 320.9326)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-2-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 61.8762 390.2607)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0505 238.583)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-3not4-jl">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0508 170.9102)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-4and3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.0512 101.0654)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-4not3">
			<text transform="matrix(4.489659e-11 -1 1 4.489659e-11 39.051 92.0586)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-5z">
			<text transform="matrix(1 0 0 1 98.5084 38.5624)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-5">
			<text transform="matrix(0 1 -1 0 156.8926 73.0081)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-6">
			<text transform="matrix(0 1 -1 0 156.8926 159.4998)" class="st25 st5 st8">|</text>
		</g>
		<g id="_x30_7s-l-7">
			<text transform="matrix(0 1 -1 0 156.8926 256.8341)" class="st25 st5 st8">|</text>
		</g>
	</g>
</g>
<g id="show_if_slots_6">
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
<g id="show_if_slots_5">
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
<g id="show_if_slots_4">
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
<g id="show_if_slots_3">
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
<g id="Pallet">
	<rect id="color-01" x="-37" y="21.6" class="st7" width="23" height="15.4"/>
	<rect id="color-02" x="-37" y="36.9" class="st26" width="23" height="15.4"/>
	<rect id="color-03" x="-37" y="52.3" class="st19" width="23" height="15.4"/>
	<rect id="color-04" x="-37" y="67.7" class="st27" width="23" height="15.4"/>
	<rect id="color-05" x="-37" y="83.1" class="st18" width="23" height="15.4"/>
	<rect id="color-06" x="-37" y="98.4" class="st3" width="23" height="15.4"/>
	<rect id="color-07" x="-37" y="113.8" class="st17" width="23" height="15.4"/>
	<rect id="color-08" x="-37" y="129.2" class="st28" width="23" height="15.4"/>
	<rect id="color-09" x="-37" y="144.6" class="st16" width="23" height="15.4"/>
	<rect id="color-10" x="-37" y="159.9" class="st29" width="23" height="15.4"/>
	<rect id="color-11" x="-37" y="175.3" class="st15" width="23" height="15.4"/>
	<rect id="color-12" x="-37" y="190.7" class="st30" width="23" height="15.4"/>
	<rect id="color-13" x="-37" y="206.1" class="st14" width="23" height="15.4"/>
	<rect id="color-14" x="-37" y="221.5" class="st31" width="23" height="15.4"/>
	<rect id="color-15" x="-37" y="236.9" class="st13" width="23" height="15.4"/>
	<rect id="color-16" x="-37" y="252.3" class="st32" width="23" height="15.4"/>
	<rect id="color-17" x="-37" y="267.7" class="st12" width="23" height="15.4"/>
	<rect id="color-18" x="-37" y="283.1" class="st22" width="23" height="15.4"/>
	<rect id="color-19" x="-37" y="298.5" class="st11" width="23" height="15.4"/>
	<rect id="color-20" x="-37" y="313.9" class="st33" width="23" height="15.4"/>
	<rect id="color-21" x="-37" y="329.2" class="st10" width="23" height="15.4"/>
	<rect id="color-22" x="-37" y="344.6" class="st34" width="23" height="15.4"/>
	<rect id="color-23" x="-37" y="360" class="st9" width="23" height="15.4"/>
	<rect x="-37" y="375.4" class="st35" width="23" height="15.4"/>
	<rect x="-37" y="390.8" class="st24" width="23" height="15.4"/>
	<rect x="-37" y="406.2" class="st36" width="23" height="15.4"/>
</g>
</svg>

`;

var grossTagParser = function (string) {
	string = string.replaceAll('>', ' >')
		.replaceAll('/ >',' />')
		.replaceAll('<g ','<g" ')
		.replaceAll('<rect ','<rect" ')
		.replaceAll('<text ','<text" ')
		.replaceAll('<polyline ','<polyline" ')
		.replaceAll('<polygon ','<polygon" ')
		.replaceAll('<line ','<line" ')
		.trim();
	var splits = string.split('" ');
	var tagStart = splits.shift();
	var tagEnd = splits.pop();
	var result = {
		tagStart: tagStart,
		tagEnd: tagEnd,
	}
	splits.forEach(function (property) {
		var deeperSplits = property.split('=');
		var propertyName = deeperSplits[0];
		var propertyValue = deeperSplits[1].replaceAll('"', '');
		result[propertyName] = propertyValue;
	})
	return result;
};
var grossTagRestorer = function (object) {
	var result = object.tagStart;
	Object.keys(object).forEach(function (propertyName) {
		if (
			propertyName !== 'tagStart'
			&& propertyName !== 'tagEnd'
		) {
			result += ' ' + propertyName + '="' + object[propertyName] + '"';
		}
	})
	result += object.tagEnd;
	return result;
};

var trimFromEnd = function (string, count) {
	var array = string.split('');
	for (var index = 0; index < count; index++) {
		array.pop();
	}
	return array.join('');
};
var getIndicesForDynamicClasses = function (currentIndex) {
	var result = [];
	var line = dataArray[currentIndex];
	if (line.includes('<rect') || line.includes('<polygon')) {
		result.push(currentIndex);
	} else if (line.includes('<g')) {
		var childIndex = currentIndex + 1;
		var childLine = dataArray[childIndex];
		while (!childLine.includes('</g')) {
			if (childLine.includes('<g')) {
				childIndex += 1;
				childLine = dataArray[childIndex];
			} else {
				result.push(childIndex);
				childIndex += 1;
				childLine = dataArray[childIndex];
			}
		}
	}
	return result;
};

var cleanData = data.replaceAll('	','')
	.replaceAll('\n<','asdf')
	.replaceAll('\n',' ')
	.replaceAll('asdf','\n<');

var dataArray = cleanData.split('\n');
for (var index = dataArray.length - 1; index >= 0; index--) {
	var line = dataArray[index];	
	var slotNumber;
	if (line.includes('_x30_') || line.includes('_x31_')) {
		var lineObject = grossTagParser(line);
		var id = lineObject.id.replace('_x30_','');
		var splits = id.split('-');
		var parseMe = splits[2]
		if (parseMe.includes('_')) {
			parseMe = trimFromEnd(parseMe, 3);
		}
		parseMe = parseMe.replaceAll('z','');
		var displayName;
		if (parseMe.includes('not')) {
			var parsed = parseMe.split('not');
			var first = parsed[0].padStart(2, '0');
			var second = parsed[1].padStart(2, '0');
			slotNumber = first;
			var vIf = 'slot' + first + ' !== ' + 'slot' + second;
			displayName = 'slot' + first;
			lineObject['v-if'] = vIf;
		} else if (parseMe.includes('and')) {
			var parsed = parseMe.split('and');
			var first = parsed[0].padStart(2, '0');
			var second = parsed[1].padStart(2, '0');
			slotNumber = first;
			var vIf = 'slot' + first + ' === ' + 'slot' + second;
			displayName = 'slot' + first;
			lineObject['v-if'] = vIf;
		} else {
			slotNumber = parseMe;
			displayName = 'slot' + parseMe.padStart(2, '0');
		}
		displayName = '{{' + displayName + '}}';
		if (line.includes('-l-') || line.includes('-s-')) {
			var dynamicIndices = getIndicesForDynamicClasses(index);
			dynamicIndices.forEach(function (dynamicIndex) {
				if (dynamicIndex === index) {
					lineObject[':class'] = 'getArtistColorByIndex(' + parseInt(slotNumber, 10) + ')';
				} else {
					var childObject = grossTagParser(dataArray[dynamicIndex]);
					childObject[':class'] = 'getArtistColorByIndex(' + parseInt(slotNumber, 10) + ')';
					dataArray[dynamicIndex] = grossTagRestorer(childObject);
				}
			})
		}
		dataArray[index] = grossTagRestorer(lineObject);
		if (dataArray[index + 1].includes('|')) {
			dataArray[index + 1] = dataArray[index + 1].replace('|',displayName);
		}
	}
	if (line.includes('show_if_slots_')) {
		var lineObject = grossTagParser(line);
		var slotCount = lineObject.id.replace('show_if_slots_','');
		if (slotCount.includes('_')) {
			slotCount = trimFromEnd(slotCount, 3);
		}
		var vIf = 'slotCount === ' + slotCount;
		lineObject['v-if'] = vIf;
		dataArray[index] = grossTagRestorer(lineObject);
	}
	//adding additional classes to next line
	if (line.includes('-l-')) {
		var altLine = dataArray[index + 1];
		var altLineObject = grossTagParser(altLine);
		var toAdd = null;
		if (line.includes('jr')) {
			toAdd = 'jr';
		}
		if (line.includes('jl')) {
			toAdd = 'jl';
		}
		if (
			altLine // if the next line is real (not end of svg)
			&& toAdd // any class must be added
		) {
			altLineObject.class = altLineObject.class + ' ' + toAdd || toAdd;
		}
		dataArray[index + 1] = grossTagRestorer(altLineObject);
	}
}
var parsedData = dataArray.join('\n');

console.log(cleanData);
console.log(parsedData);