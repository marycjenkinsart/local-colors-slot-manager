Vue.component('map-preview', {
	mixins: [
		mixins,
	],
    data: function () {
        return {
            colorMap: { // unique artists, not slot count
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
                
            }
        };
    },
    props: {
		manageUp: {
			type: Boolean,
			require: true,
		},
		manageDown: {
			type: Boolean,
			require: true,
		},
		artists: {
			type: Object,
			require: true,
		}
	},
    computed: {
        slot01: function () {
            return this.artists.up[0] || 'ERROR';
        },
        slot02: function () {
            return this.artists.up[1] || 'ERROR';
        },
        slot03: function () {
            return this.artists.up[2] || 'ERROR';
        },
        slot04: function () {
            return this.artists.up[3] || 'ERROR';
        },
        slot05: function () {
            return this.artists.up[4] || 'ERROR';
        },
        slot06: function () {
            return this.artists.up[5] || 'ERROR';
        },
        slot07: function () {
            return this.artists.up[6] || 'ERROR';
        },
        slot08: function () {
            return this.artists.up[7] || 'ERROR';
        },
        slot09: function () {
            return this.artists.up[8] || 'ERROR';
        },
        slot10: function () {
            return this.artists.up[9] || 'ERROR';
        },
        slot11: function () {
            return this.artists.up[10] || 'ERROR';
        },
        slot12: function () {
            return this.artists.up[11] || 'ERROR';
        },
        slot13: function () {
            return this.artists.up[12] || 'ERROR';
        },
		slotCount: function () {
			return this.artists.up.length; //TODO
		},
        uniqueArtists: function () {
            var result = this.artists.up.filter(this.getUnique);
            return result;
        },
        slotColors: function () {
            var lookup = 'count' + this.uniqueArtists.length;
            return this.colorMap[lookup];
        },
	},
    methods: {
        getArtistColorByIndex: function (index) {
            var slotName = this.artists.up[index - 1];
            var colorIndex = this.uniqueArtists.findIndex(function (item) {
                return item === slotName;
            });
            return this.slotColors[colorIndex];
        },
    },
    template: /*html*/`
<div class="map-preview">
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 24.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 218.4 630.7" style="enable-background:new 0 0 218.4 630.7;" xml:space="preserve">
<g id="Upstairs_Base">
<polyline class="st0" points="141.3,368.8 138.9,367.2 141.3,364.7 138.9,362.5 141.3,360.4 138.9,358.1 141.3,355.6 138.9,353.4  141.3,351.6 138.9,349.6 141.3,347.4 "/>
<polyline class="st0" points="150,105 151.9,107.5 148.4,108.8 150,112 146.7,112.9 148.3,116 144.8,117.3 146.5,120.4 143.2,121  145,123.9 141.6,124.9 "/>
<line class="st0" x1="150" y1="105" x2="152.2" y2="99.7"/>
<polyline class="st0" points="183.8,149 139.4,130.2 141.6,124.9 "/>
<g>
<polyline class="st0" points="94.4,52.8 96.1,55.2 92.8,56.5 94.1,59.5 91,60.4 92.3,63.4 89,64.7 90.4,67.7 87.4,68.3 88.8,71.1  85.7,72.1 "/>
<line class="st0" x1="83.5" y1="76.9" x2="85.7" y2="72.1"/>
</g>
<line class="st0" x1="34.7" y1="265.2" x2="34.7" y2="365.3"/>
<polyline class="st0" points="34.9,233.5 52.5,232.2 52.5,233.6 39.3,241.1 39.2,241.2 39.2,256.3 52.3,263.8 52.3,265.2  34.7,265.2 "/>
<polyline class="st0" points="34.9,233.5 34.9,132.4 43.2,114 63.2,123 64.7,119.8 50.1,113.2 68,73.5 83,80.2 84.4,76.9 "/>
<polyline class="st0" points="35.2,518 35.2,481.2 53.9,481.2 53.9,477.7 36.2,477.7 36.2,389.8 36.2,389.8 60,380.5 58.7,377.1  41.9,383.7 34.7,365.3 "/>
<rect x="35.2" y="518" class="st0" width="1.4" height="25.9"/>
<polyline class="st0" points="38,555.8 35.2,555.8 35.2,543.9 "/>
<line class="st0" x1="141.3" y1="373.5" x2="141.3" y2="368.8"/>
<polyline class="st0" points="141.4,377.2 138,378.5 136.7,375.2 141,373.5 "/>
<line class="st0" x1="66.8" y1="555.9" x2="66.8" y2="558.4"/>
<rect x="145.7" y="413.9" class="st0" width="38" height="62.9"/>
<rect x="145.7" y="466.3" class="st0" width="33.8" height="10.5"/>
<rect x="145.7" y="455.8" class="st0" width="33.8" height="10.5"/>
<rect x="145.7" y="445.3" class="st0" width="33.8" height="10.5"/>
<rect x="145.7" y="434.8" class="st0" width="33.8" height="10.5"/>
<rect x="145.7" y="424.4" class="st0" width="33.8" height="10.5"/>
<rect x="145.7" y="413.9" class="st0" width="33.8" height="10.5"/>
<rect x="109.6" y="27" class="st1" width="10.8" height="6.1"/>
<g> 
<rect x="25.9" y="540.2" transform="matrix(0.255 -0.9669 0.9669 0.255 -493.6406 442.3537)" class="st2" width="28.8" height="2.6"/>
<rect x="38" y="555.8" class="st0" width="28.8" height="2.6"/>
<path class="st0" d="M45,527.8c12.5,3.1,21.8,14.4,21.8,28"/>
</g>
<line class="st0" x1="96.1" y1="49.1" x2="94.4" y2="52.8"/>
<g>
<g>
<path class="st1" d="M39.7,17.1c-1.2,7.4,2.7,15,9.9,18.1"/>
</g>
<rect x="45.2" y="27" transform="matrix(0.3954 -0.9185 0.9185 0.3954 6.9267 65.9849)" class="st3" width="16.8" height="1.5"/>
<rect x="47.2" y="9.3" transform="matrix(0.1614 -0.9869 0.9869 0.1614 22.7615 62.205)" class="st4" width="1.5" height="16.8"/>
</g>
<polyline class="st0" points="183.8,149 183.8,329.4 141.3,329.4 141.3,347.4 "/>
<line class="st5" x1="182.1" y1="149" x2="182.7" y2="99.7"/>
<polyline class="st5" points="141,373.5 162.4,364.9 183.8,373.5 183.8,329.4 "/>
<path class="st5" d="M67.9,67.6"/>
<polyline class="st5" points="60.9,79.1 0,50.8 23.2,0 99.6,35.5 "/>
<line class="st5" x1="59.5" y1="16.9" x2="35.1" y2="67.1"/>
<g>
<rect x="13" y="11" transform="matrix(0.4254 -0.905 0.905 0.4254 -2.1837 30.7403)" class="st6" width="20.3" height="12.1"/>
<path class="st1" d="M27.1,13.3c1.6,0.7,1.9,3.4,0.7,5.9c-1.2,2.5-3.4,3.9-5,3.2s-1.9-3.4-0.7-5.9S25.6,12.6,27.1,13.3z"/>
<rect x="19" y="12.9" transform="matrix(0.4254 -0.905 0.905 0.4254 -2.5183 26.9071)" class="st6" width="1.8" height="5"/>
<path class="st1" d="M22.5,9.8c0.6,0.3,0.9,1,0.6,1.6s-1,0.9-1.6,0.6s-0.9-1-0.6-1.6C21.2,9.8,21.9,9.5,22.5,9.8z"/>
<path class="st1" d="M18.3,18.9c0.6,0.3,0.9,1,0.6,1.6s-1,0.9-1.6,0.6s-0.9-1-0.6-1.6C16.9,18.8,17.7,18.6,18.3,18.9z"/>
</g>
<rect x="1.2" y="39.1" transform="matrix(0.4254 -0.905 0.905 0.4254 -33.1962 30.3251)" class="st6" width="12.2" height="4.5"/>
<path class="st1" d="M17.8,39.4c3.1,1.4,4.4,5.1,2.9,8.1c-1.4,3.1-5.1,4.4-8.1,2.9c-3.1-1.4-4.4-5.1-2.9-8.1 C11.1,39.2,14.7,37.9,17.8,39.4z"/>
<path class="st1" d="M16.5,42.1c1.6,0.7,2.2,2.6,1.5,4.2c-0.7,1.6-2.6,2.2-4.2,1.5s-2.2-2.6-1.5-4.2C13.1,42,15,41.3,16.5,42.1z"/>
<circle class="st1" cx="181.2" cy="176.5" r="1.6"/>
<polyline class="st0" points="141.4,377.2 141.4,485.4 145.7,485.4 145.7,476.7 179.5,476.7 "/>
<polyline class="st0" points="179.5,536.1 174,543.2 182.2,549.7 165.7,570.6 157.5,564.2 149.6,574.2 153.4,577.2 159.4,569.7  186.1,590.6 180,598.4 183.6,601.2 160.5,630.7 69.6,559.4 "/>
<polyline class="st0" points="152.4,570.7 107,535 84.8,535 67,555.7 "/>
<polyline class="st0" points="152.2,99.7 182.7,99.7 182.7,27 120.4,27 109.6,27 99.1,27 99.1,49.1 96.1,49.1 "/>
<polyline class="st0" points="179.5,476.7 183.7,476.7 183.7,484.8 179.5,484.8 179.5,536.1 "/> 
<rect x="114.9" y="525.1" transform="matrix(0.6181 -0.7861 0.7861 0.6181 -368.7551 305.6792)" class="st7" width="30.6" height="14.5"/>
<g>
<path class="st8" d="M124.6,517.4c4.4,3.5,1.2,6.8-2.3,11.2s-5.9,8.4-10.3,4.9s-5.2-9.9-1.7-14.3 C113.7,514.7,120.1,513.9,124.6,517.4z"/>
<path class="st8" d="M123.7,521.9c2.7,2.1,0.7,4.1-1.4,6.8s-3.6,5.1-6.2,2.9c-2.7-2.1-3.1-6-1-8.7 C117.1,520.2,121,519.7,123.7,521.9z"/>
</g>
<g>
<path class="st8" d="M146.1,537.9c3,2.4,3.6,6.8,1.2,9.8c-2.4,3-6.8,3.6-9.8,1.2c-3-2.4-3.6-6.8-1.2-9.8 C138.6,536.1,143,535.5,146.1,537.9z"/>
<path class="st8" d="M153.3,542.7c0.7,0.6,1,1.4-3.5,7.1c-4.5,5.7-5.4,5.6-6.1,5.1c-0.7-0.6-1-1.4,3.5-7.1 C151.7,542,152.6,542.1,153.3,542.7z"/> 
<rect x="146.6" y="532.1" transform="matrix(0.6183 -0.786 0.786 0.6183 -365.9972 321.7223)" class="st9" width="3.2" height="11"/>
<rect x="136" y="545.6" transform="matrix(0.6182 -0.786 0.786 0.6182 -380.64 318.5566)" class="st10" width="3.2" height="11"/>
</g>
<g id="featured-show-jl_1_">
<text transform="matrix(0 -1 1 0 46.4052 183)" class="st11 st12 st13">FEATURED SHOW</text>
</g>
<g id="featured-show-jl">
<text transform="matrix(0 -1 1 0 46.4052 321.2188)" class="st11 st12 st13">FEATURED SHOW</text>
</g>
<g id="jewelry-jl">
<text transform="matrix(0 -1 1 0 47.4059 429.6504)" class="st11 st12 st13">JEWELRY</text>
</g>
</g>
<g id="show_if_slots_11" v-if="slotCount === 11">
<g id="Slots_11">
<g id="_x31_1s-s-1">
<rect x="122.9" y="23.1" class="st14" width="59.8" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x31_1s-s-2">
<rect x="182.7" y="27" class="st15" width="3.9" height="59.8" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x31_1s-s-3">
<rect x="182.7" y="86.8" class="st16" width="3.9" height="16.7" :class="getArtistColorByIndex(3)"/>
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.8971 106.7238)" class="st16" width="43.2" height="3.9" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_1s-s-4">
<rect id="stop" x="183.8" y="149" class="st17" width="3.9" height="26.4" :class="getArtistColorByIndex(4)"/>
<rect id="illustrator_x5F_no_1_" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2587 246.4457)" class="st17" width="3.9" height="19.8" :class="getArtistColorByIndex(4)"/>
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.801 223.1954)" class="st17" width="3.8" height="22.6" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_1s-s-5">
<rect x="183.8" y="175.4" class="st18" width="3.9" height="56.8" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_1s-s-6">
<rect id="at" x="183.9" y="232.2" class="st19" width="3.8" height="55.8" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_1s-s-7">
<rect id="is_1_" x="141.3" y="329.4" class="st20" width="3.8" height="16.5" :class="getArtistColorByIndex(7)"/>
<rect id="illustrator" x="183.9" y="288" class="st20" width="3.8" height="41.4" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_1s-s-8">
<rect id="bad_2_" x="141.3" y="381.8" class="st21" width="3.8" height="59.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_1s-s-9">
<polyline class="st22" points="141.2,441.6 145.1,441.6 145.1,483.3 141.2,483.3 " :class="getArtistColorByIndex(9)"/>
<rect x="179.5" y="489.5" class="st22" width="3.9" height="18.1" :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_1s-s-10">
<rect x="179.5" y="507.5" class="st23" width="3.9" height="23.9" :class="getArtistColorByIndex(10)"/>
<polyline class="st23" points="31.3,481.2 35.2,481.2 35.2,516.6 31.3,516.6 " :class="getArtistColorByIndex(10)"/>
</g>
<g id="_x31_1s-s-11">
<rect x="145.7" y="350.2" class="st24" width="33.9" height="3.9" :class="getArtistColorByIndex(11)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1757 352.987)" class="st24" width="25.9" height="3.8" :class="getArtistColorByIndex(11)"/>
</g>
</g>
<g id="Edges_11">
<g id="_x31_1s-e-9not10" v-if="slot09 !== slot10">
<g>
<line class="st25" x1="179.5" y1="507.5" x2="178" y2="507.5"/>
<line class="st26" x1="175.6" y1="507.5" x2="167.3" y2="507.5"/>
<line class="st25" x1="166.1" y1="507.5" x2="164.6" y2="507.5"/>
</g>
</g>
<g id="_x31_1s-e-8not9_1_" v-if="slot08 !== slot09">
<g>
<line class="st25" x1="141.4" y1="441.6" x2="139.9" y2="441.6"/>
<line class="st26" x1="137.5" y1="441.6" x2="129.2" y2="441.6"/>
<line class="st25" x1="128" y1="441.6" x2="126.5" y2="441.6"/>
</g>
</g>
<g id="_x31_1s-e-6not7" v-if="slot06 !== slot07">
<g>
<line class="st25" x1="183.8" y1="288" x2="182.3" y2="288"/>
<line class="st26" x1="179.9" y1="288" x2="171.6" y2="288"/>
<line class="st25" x1="170.4" y1="288" x2="168.9" y2="288"/>
</g>
</g>
<g id="_x31_1s-e-5not6_1_" v-if="slot05 !== slot06">
<g>
<line class="st25" x1="183.8" y1="232.2" x2="182.3" y2="232.2"/>
<line class="st26" x1="179.9" y1="232.2" x2="171.6" y2="232.2"/>
<line class="st25" x1="170.4" y1="232.2" x2="168.9" y2="232.2"/>
</g>
</g>
<g id="_x31_1s-e-4not5" v-if="slot04 !== slot05">
<g>
<line class="st25" x1="183.8" y1="175.4" x2="182.3" y2="175.4"/>
<line class="st26" x1="179.9" y1="175.4" x2="171.6" y2="175.4"/>
<line class="st25" x1="170.4" y1="175.4" x2="168.9" y2="175.4"/>
</g>
</g>
<g id="_x31_1s-e-2not3" v-if="slot02 !== slot03">
<g>
<line class="st25" x1="182.7" y1="86.8" x2="181.2" y2="86.8"/>
<line class="st26" x1="178.8" y1="86.8" x2="170.5" y2="86.8"/>
<line class="st25" x1="169.3" y1="86.8" x2="167.8" y2="86.8"/>
</g>
</g>
</g>
<g id="Measurements_11">
<g id="_x31_1s-m-9not10" v-if="slot09 !== slot10">
<text transform="matrix(0 1 -1 0 203.9297 496.1748)" class="st27 st28 st29">32”</text>
<polyline class="st0" points="190.7,507.5 200,496.2 190.7,484.8 "/>
</g>
<g id="_x31_1s-m-8not9" v-if="slot08 !== slot09">
<text transform="matrix(0 1 -1 0 161.3652 463.4916)" class="st30 st28 st29">60”</text>
<text transform="matrix(0 1 -1 0 161.3652 463.492)" class="st27 st28 st29">60”</text>
<polyline class="st0" points="148.1,485.4 157.4,463.6 148.1,441.6 "/>
</g>
<g id="_x31_1s-m-6not7" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 203.9297 308.6794)" class="st27 st28 st29">57”</text>
<polyline class="st0" points="190.7,329.4 200,308.7 190.7,288 "/>
</g>
<g id="_x31_1s-m-5not6" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 190.6992 232.2001)" class="st27 st28 st29">half-ish</text>
</g>
<g id="_x31_1s-m-4not5" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 162.1761)" class="st27 st28 st29">36”</text>
<polyline class="st0" points="190.7,175.4 200,162.2 190.7,149 "/>
</g>
<g id="_x31_1s-m-2not3" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 93.2627)" class="st27 st28 st29">18”</text>
<polyline class="st0" points="189.7,99.7 199,93.3 189.7,86.8 "/>
</g>
</g>
<g id="Labels_11">
<g id="_x31_1s-l-11z">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="st20 st12 st13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_1s-l-10not9-jr" v-if="slot10 !== slot09">
<text transform="matrix(1 0 0 1 176.8228 519.8721)" class="st19 st12 st13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_1s-l-9and10" v-if="slot09 === slot10">
<text transform="matrix(0 1 -1 0 168.8164 505.8609)" class="st19 st12 st13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-9not10-jr_1_" v-if="slot09 !== slot10">
<text transform="matrix(1 0 0 1 176.823 501.8575)" class="st19 st12 st13 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-11">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="st20 st12 st13" :class="getArtistColorByIndex(11)">{{slot11}}</text  >
</g>
<g id="_x31_1s-l-10-jr">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="st20 st12 st13 jr" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_1s-l-9_1_">
<text transform="matrix(0 1 -1 0 128.6484 464.2461)" class="st19 st12 st13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_1s-l-8">
<text transform="matrix(0 1 -1 0 128.6484 406.1997)" class="st19 st12 st13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_1s-l-7z">
<text transform="matrix(0 1 -1 0 172.4844 307.1243)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_1s-l-7">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_1s-l-6">
<text transform="matrix(0 1 -1 0 172.4844 259.0856)" class="st17 st12 st13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_1s-l-5">
<text transform="matrix(0 1 -1 0 172.4844 202.7634)" class="st17 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_1s-l-4">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 157.9448 149.0002)" class="st16 st12 st31" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_1s-l-3not2-jr" v-if="slot03 !== slot02">
<text transform="matrix(1 0 0 1 180.4887 96.9622)" class="st15 st12 st13 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_1s-l-3">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="st32 st12 st13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_1s-l-2">
<text transform="matrix(0 1 -1 0 172.4824 57.931)" class="st15 st12 st13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_1s-l-1">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="st14 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_10_1_" v-if="slotCount === 10">
<g id="Slots_10_1_">
<g id="_x31_0s-s-1_1_">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.8971 106.7238)" class="st14" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="st14" width="22.6" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x31_0s-s-2_1_">
<rect x="182.7" y="27" class="st15" width="3.9" height="28.9" :class="getArtistColorByIndex(2)"/>
<rect x="145.5" y="23.1" class="st15" width="37.2" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x31_0s-s-3_1_">
<rect x="151.3" y="122.7" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -29.801 223.1954)" class="st16" width="3.8" height="22.6" :class="getArtistColorByIndex(3)"/>
<rect x="182.7" y="55.9" class="st16" width="3.9" height="43.8" :class="getArtistColorByIndex(3)"/>
</g>
<g id="_x31_0s-s-4_1_">
<rect id="stop_1_" x="183.8" y="149" class="st17" width="3.9" height="45.9" :class="getArtistColorByIndex(4)"/>
<rect id="illustrator_x5F_no_2_" x="170.8" y="132.3" transform="matrix(0.3872 -0.922 0.922 0.3872 -25.2587 246.4457)" class="st17" width="3.9" height="19.8" :class="getArtistColorByIndex(4)"/>
</g>
<g id="_x31_0s-s-5_1_">
<rect x="183.8" y="194.9" class="st18" width="3.9" height="65.8" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x31_0s-s-6_1_">
<rect id="at_1_" x="183.9" y="260.7" class="st19" width="3.8" height="65.8" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x31_0s-s-7_1_">
<rect id="is_3_" x="141.3" y="329.4" class="st20" width="3.8" height="15.8" :class="getArtistColorByIndex(7)"/>
<rect id="illustrator_2_" x="141.3" y="381.8" class="st20" width="3.8" height="50" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x31_0s-s-8_1_">
<rect id="bad_3_" x="141.3" y="431.8" class="st21" width="3.8" height="65.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x31_0s-s-9_1_">
<polyline class="st22" points="31.3,481.2 35.2,481.2 35.2,525.8 31.3,525.8 " :class="getArtistColorByIndex(9)"/>
<rect x="166.6" y="557.3" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -372.1442 353.401)" class="st22" width="21.2" height="3.8" :class="getArtistColorByIndex(9)"/>
</g>
<g id="_x31_0s-s-10_1_">
<rect x="148.7" y="350.2" class="st33" width="28.1" height="3.9" :class="getArtistColorByIndex(10)"/>
<rect x="179.5" y="489" class="st33" width="3.9" height="42.5" :class="getArtistColorByIndex(10)"/>
</g>
</g>
<g id="Edges_10_1_">
<g id="_x31_0s-e-7not8_1_" v-if="slot07 !== slot08">
<g>
<line class="st25" x1="141.4" y1="431.8" x2="139.9" y2="431.8"/>
<line class="st26" x1="137.5" y1="431.8" x2="129.2" y2="431.8"/>
<line class="st25" x1="128" y1="431.8" x2="126.5" y2="431.8"/>
</g>
</g>
<g id="_x31_0s-e-5not6_1_" v-if="slot05 !== slot06">
<g>
<line class="st25" x1="183.8" y1="260.7" x2="182.3" y2="260.7"/>
<line class="st26" x1="179.9" y1="260.7" x2="171.6" y2="260.7"/>
<line class="st25" x1="170.4" y1="260.7" x2="168.9" y2="260.7"/>
</g>
</g>
<g id="_x31_0s-e-4not5_1_" v-if="slot04 !== slot05">
<g>
<line class="st25" x1="183.8" y1="194.9" x2="182.3" y2="194.9"/>
<line class="st26" x1="179.9" y1="194.9" x2="171.6" y2="194.9"/>
<line class="st25" x1="170.4" y1="194.9" x2="168.9" y2="194.9"/>
</g>
</g>
<g id="_x31_0s-e-3not4_1_" v-if="slot03 !== slot04">
<g>
<line class="st25" x1="162.9" y1="140.2" x2="162.3" y2="141.6"/>
<line class="st26" x1="161.4" y1="143.8" x2="158.1" y2="151.5"/>
<line class="st25" x1="157.7" y1="152.6" x2="157.1" y2="154"/>
</g>
</g>
<g id="_x31_0s-e-2not3_1_" v-if="slot02 !== slot03">
<g>
<line class="st25" x1="182.7" y1="55.9" x2="181.2" y2="55.9"/>
<line class="st26" x1="178.8" y1="55.9" x2="170.5" y2="55.9"/>
<line class="st25" x1="169.3" y1="55.9" x2="167.8" y2="55.9"/>
</g>
</g>
<g id="_x31_0s-e-1not2_1_" v-if="slot01 !== slot02">
<g>
<line class="st25" x1="145.5" y1="27" x2="145.5" y2="28.5"/>
<line class="st26" x1="145.5" y1="30.9" x2="145.5" y2="39.2"/>
<line class="st25" x1="145.5" y1="40.4" x2="145.5" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_10_1_">
<g id="_x31_0s-m-7not8_1_" v-if="slot07 !== slot08">
<text transform="matrix(0 1 -1 0 161.3652 405.1557)" class="st30 st28 st29">74”</text>
<text transform="matrix(0 1 -1 0 161.3652 405.1562)" class="st27 st28 st29">74”</text>
<polyline class="st0" points="148.1,431.8 157.4,405.3 148.1,378.5 "/>
</g>
<g id="_x31_0s-m-5not6_1_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 295.0534)" class="st27 st28 st29">95”</text>
<polyline class="st0" points="190.7,329.4 200,295.1 190.7,260.7 "/>
</g>
<g id="_x31_0s-m-4not5_1_" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 171.9685)" class="st27 st28 st29">64”</text>
<polyline class="st0" points="190.7,194.9 200,172 190.7,149 "/>
</g>
<g id="_x31_0s-m-3not4_1_" v-if="slot03 !== slot04">
<text transform="matrix(0.9212 0.389 -0.389 0.9212 163.4494 134.046)" class="st27 st28 st34">half-ish</text>
</g>
<g id="_x31_0s-m-2not3_2_" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 79.1002)" class="st27 st28 st29">60”</text>
<polyline class="st0" points="189.7,99.7 199,77.9 189.7,55.9 "/>
</g>
<g id="_x31_0s-m-1not2_1_" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 164.3784 7.8708)" class="st27 st28 st29">51”</text>
<polyline class="st0" points="182.7,21.1 164.2,11.8 145.5,21.1 "/>
</g>
<g id="_x31_0s-m-1and2_1_" v-if="slot01 === slot02">
<line class="st0" x1="163.7" y1="83.1" x2="84.6" y2="90.8"/>
<text transform="matrix(0.9956 -9.409466e-02 9.409466e-02 0.9956 122.0056 85.1015)" class="st30 st28 st29">can trade</text>
<text transform="matrix(0.9956 -9.409466e-02 9.409466e-02 0.9956 122.006 85.1014)" class="st27 st28 st29">can trade</text>
<polygon class="st27" points="159.5,80.5 160.5,86.9 167.4,82.2 "/>
<polygon class="st27" points="87.4,93.4 86.4,86.9 79.6,91.7 "/>
</g>
</g>
<g id="Labels_10_1_">
<g id="_x31_0s-l-10z_1_">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="st20 st12 st13" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_0s-l-10_1_">
<text transform="matrix(0 1 -1 0 168.8164 508.8633)" class="st19 st12 st13" :class="getArtistColorByIndex(10)">{{slot10}}</text  >
</g>
<g id="_x31_0s-l-9_1_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="st20 st12 st13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_0s-l-9-jr_1_">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="st20 st12 st13 jr" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x31_0s-l-8_1_">
<text transform="matrix(0 1 -1 0 128.6484 462.3132)" class="st19 st12 st13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x31_0s-l-7z_1_">
<text transform="matrix(0 1 -1 0 128.1406 401.8834)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_0s-l-7_1_">
<text transform="matrix(0 1 -1 0 128.6484 335.2117)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x31_0s-l-6_1_">
<text transform="matrix(0 1 -1 0 172.4844 294.6503)" class="st17 st12 st13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x31_0s-l-5_1_">
<text transform="matrix(0 1 -1 0 172.4844 226.5959)" class="st17 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x31_0s-l-4_1_">
<text transform="matrix(0 1 -1 0 172.4844 170.5041)" class="st17 st12 st13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x31_0s-l-3not4-jr_1_" v-if="slot03 !== slot04">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="st16 st12 st31 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-3and4_1_" v-if="slot03 === slot04">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 153.504 147.3322)" class="st16 st12 st31" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-3not2-jl_1_" v-if="slot03 !== slot02">
<text transform="matrix(0 1 -1 0 172.4824 57.931)" class="st15 st12 st13 jl" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x31_0s-l-2and3_1_" v-if="slot02 === slot03">
<text transform="matrix(0 1 -1 0 172.4824 62.935)" class="st15 st12 st13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_0s-l-2not1-jr_1_" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 180.0422 37.7803)" class="st14 st12 st13 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x31_0s-l-1and2_2_" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 152.0198 37.7803)" class="st14 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x31_0s-l-1not2-jr_1_" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 143.1988 37.7803)" class="st14 st12 st13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x31_0s-l-1_1_">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="st32 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_9_1_" v-if="slotCount === 9">
<g id="Slots_9">
<g id="_x30_9s-s-1_1_">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.8971 106.7238)" class="st14" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="st14" width="30.1" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_9s-s-2_1_">
<rect x="182.7" y="27" class="st15" width="3.9" height="43.2" :class="getArtistColorByIndex(2)"/>
<rect x="153" y="23.1" class="st15" width="29.7" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_9s-s-3_1_">
<rect x="168.8" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.889 243.7614)" class="st16" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2456 220.7961)" class="st16" width="3.8" height="18.2" :class="getArtistColorByIndex(3)"/>
<rect x="182.7" y="70.2" class="st16" width="3.9" height="29.5" :class="getArtistColorByIndex(3)"/>
</g>
<rect id="_x30_9s-s-4_1_" x="183.8" y="149" class="st17" width="3.9" height="73.1" :class="getArtistColorByIndex(4)"/>
<g id="_x30_9s-s-5_1_">
<rect x="183.8" y="222.1" class="st18" width="3.9" height="73.1" :class="getArtistColorByIndex(5)"/>
</g>
<g id="_x30_9s-s-6_1_">
<rect id="bad_1_" x="183.9" y="295.2" class="st19" width="3.8" height="34.2" :class="getArtistColorByIndex(6)"/>
<rect id="is_2_" x="141.3" y="329.4" class="st19" width="3.8" height="15.8" :class="getArtistColorByIndex(6)"/>
<rect id="illustrator_1_" x="141.3" y="381.8" class="st19" width="3.8" height="23.1" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x30_9s-s-7_1_">
<rect x="141.3" y="404.9" class="st20" width="3.8" height="73.1" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_9s-s-8_1_">
<rect x="31.3" y="481.2" class="st21" width="3.9" height="44.6" :class="getArtistColorByIndex(8)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1757 352.987)" class="st21" width="25.9" height="3.8" :class="getArtistColorByIndex(8)"/>
</g>
<g id="_x30_9s-s-9_1_">
<rect x="142.9" y="350.2" class="st22" width="39.4" height="3.9" :class="getArtistColorByIndex(9)"/>
<rect x="179.5" y="489" class="st22" width="3.9" height="42.5" :class="getArtistColorByIndex(9)"/>
</g>
</g>
<g id="Edges_9">
<g id="_x30_9s-e-6not7_1_" v-if="slot06 !== slot07">
<g>
<line class="st25" x1="141.4" y1="404.9" x2="139.9" y2="404.9"/>
<line class="st26" x1="137.5" y1="404.9" x2="129.2" y2="404.9"/>
<line class="st25" x1="128" y1="404.9" x2="126.5" y2="404.9"/>
</g>
</g>
<g id="_x30_9s-e-5not6_1_" v-if="slot05 !== slot06">
<g>
<line class="st25" x1="183.8" y1="295.2" x2="182.3" y2="295.2"/>
<line class="st26" x1="179.9" y1="295.2" x2="171.6" y2="295.2"/>
<line class="st25" x1="170.4" y1="295.2" x2="168.9" y2="295.2"/>
</g>
</g>
<g id="_x30_9s-e-4not5_2_" v-if="slot04 !== slot05">
<g>
<line class="st25" x1="183.8" y1="222.1" x2="182.3" y2="222.1"/>
<line class="st26" x1="179.9" y1="222.1" x2="171.6" y2="222.1"/>
<line class="st25" x1="170.4" y1="222.1" x2="168.9" y2="222.1"/>
</g>
</g>
<g id="_x30_9s-e-2not3_1_" v-if="slot02 !== slot03">
<g>
<line class="st25" x1="183.8" y1="70.2" x2="182.3" y2="70.2"/>
<line class="st26" x1="179.9" y1="70.2" x2="171.6" y2="70.2"/>
<line class="st25" x1="170.4" y1="70.2" x2="168.9" y2="70.2"/>
</g>
</g>
<g id="_x30_9s-e-1not2_1_" v-if="slot01 !== slot02">
<g>
<line class="st25" x1="153" y1="27" x2="153" y2="28.5"/>
<line class="st26" x1="153" y1="30.9" x2="153" y2="39.2"/>
<line class="st25" x1="153" y1="40.4" x2="153" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_9">
<g id="_x30_9s-m-6not7_1_" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 161.3652 385.1529)" class="st30 st28 st29">37”</text>
<text transform="matrix(0 1 -1 0 161.3652 385.1528)" class="st27 st28 st29">37”</text>
<polyline class="st0" points="148.1,404.9 157.4,391.8 148.1,378.5 "/>
</g>
<g id="_x30_9s-m-5not6_1_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 203.9297 312.2614)" class="st27 st28 st29">48”</text>
<polyline class="st0" points="190.7,329.4 200,312.3 190.7,295.2 "/>
</g>
<g id="_x30_9s-m-4not5_1_" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 182.2207)" class="st27 st28 st29">101”</text>
<polyline class="st0" points="190.7,222.1 200,185.6 190.7,149 "/>
</g>
<g id="_x30_9s-m-2not3_1_" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 202.9395 84.8503)" class="st27 st28 st29">41”</text>
<polyline class="st0" points="189.7,99.7 199,84.9 189.7,70 "/>
</g>
<g id="_x30_9s-m-2not1_2_" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 167.8503 7.8708)" class="st27 st28 st29">41”</text>
<polyline class="st0" points="182.7,21.1 167.9,11.8 153,21.1 "/>
</g>
</g>
<g id="Labels_9">
<g id="_x30_9s-l-9z_1_">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="st20 st12 st13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x30_9s-l-9_1_">
<text transform="matrix(0 1 -1 0 168.8164 508.8633)" class="st19 st12 st13" :class="getArtistColorByIndex(9)">{{slot09}}</text  >
</g>
<g id="_x30_9s-l-8z_1_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="st20 st12 st13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_9s-l-8-jr_1_">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 486.0127)" class="st20 st12 st13 jr" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_9s-l-7_1_">
<text transform="matrix(0 1 -1 0 128.6484 440.2957)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_9s-l-6not7-jr_1_" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 128.1406 399.8818)" class="st19 st12 st13 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_9s-l-6-jr_1_">
<text transform="matrix(1 0 0 1 180.491 323.6733)" class="st19 st12 st13 jr" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_9s-l-5_1_">
<text transform="matrix(0 1 -1 0 172.4844 259.6223)" class="st17 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_9s-l-4_1_">
<text transform="matrix(0 1 -1 0 172.4844 182.5137)" class="st17 st12 st13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_9s-l-3_1_">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="st16 st12 st31" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_9s-l-3not2-jr_1_" v-if="slot03 !== slot02">
<text transform="matrix(1 0 0 1 180.4897 95.6967)" class="st15 st12 st13 jr" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_9s-l-2and3_2_" v-if="slot02 === slot03">
<text transform="matrix(0 1 -1 0 172.4824 60.6683)" class="st15 st12 st13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_9s-l-2not3-jl_1_" v-if="slot02 !== slot03">
<text transform="matrix(0 1 -1 0 171.4824 28.8985)" class="st15 st12 st13 jl" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_9s-l-1and2_1_" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 148.0167 37.7803)" class="st14 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_9s-l-1not2-jr_1_" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 150.2044 37.7803)" class="st14 st12 st13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_9s-l-1_1_">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="st32 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_8_1_" v-if="slotCount === 8">
<g id="Slots_8">
<g id="_x30_8s-s-1_1_">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.8971 106.7238)" class="st14" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="122.9" y="23.1" class="st14" width="38.9" height="3.9" :class="getArtistColorByIndex(1)"/>
</g>
<g id="_x30_8s-s-2_1_">
<rect x="182.7" y="27" class="st15" width="3.9" height="61.2" :class="getArtistColorByIndex(2)"/>
<rect x="161.8" y="23.1" class="st15" width="20.9" height="3.9" :class="getArtistColorByIndex(2)"/>
</g>
<g id="_x30_8s-s-3_1_">
<rect x="168.8" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.889 243.7614)" class="st16" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2456 220.7961)" class="st16" width="3.8" height="18.2" :class="getArtistColorByIndex(3)"/>
<rect x="183.8" y="149" class="st16" width="3.9" height="31.9" :class="getArtistColorByIndex(3)"/>
</g>
<rect id="_x30_8s-s-4_1_" x="183.8" y="180.9" class="st17" width="3.9" height="82.1" :class="getArtistColorByIndex(4)"/>
<g id="_x30_8s-s-5_1_">
<rect x="183.8" y="262.9" class="st18" width="3.9" height="66.4" :class="getArtistColorByIndex(5)"/>
<rect x="141.3" y="329.4" class="st18" width="3.8" height="15.8" :class="getArtistColorByIndex(5)"/>
</g>
<rect id="_x30_8s-s-6_1_" x="141.3" y="381.8" class="st19" width="3.8" height="82.1" :class="getArtistColorByIndex(6)"/>
<g id="_x30_8s-s-7_1_">
<rect x="141.3" y="463.9" class="st20" width="3.8" height="19.5" :class="getArtistColorByIndex(7)"/>
<rect x="31.3" y="481.2" class="st20" width="3.9" height="44.6" :class="getArtistColorByIndex(7)"/>
<rect x="179.5" y="489.5" class="st20" width="3.9" height="21.8" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_8s-s-8_1_">
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1757 352.987)" class="st20" width="25.9" height="3.8" :class="getArtistColorByIndex(8)"/>
<rect x="179.5" y="511.3" class="st20" width="3.9" height="20.7" :class="getArtistColorByIndex(8)"/>
<rect x="142.9" y="350.2" class="st20" width="39.4" height="3.9" :class="getArtistColorByIndex(8)"/>
</g>
</g>
<g id="Edges_8">
<g id="_x30_8s-e-6not7_1_" v-if="slot06 !== slot07">
<g>
<line class="st25" x1="141.4" y1="463.9" x2="139.9" y2="463.9"/>
<line class="st26" x1="137.5" y1="463.9" x2="129.2" y2="463.9"/>
<line class="st25" x1="128" y1="463.9" x2="126.5" y2="463.9"/>
</g>
</g>
<g id="_x30_8s-e-7not8_1_" v-if="slot07 !== slot08">
<g>
<line class="st25" x1="179.5" y1="511.3" x2="178" y2="511.3"/>
<line class="st26" x1="175.6" y1="511.3" x2="167.3" y2="511.3"/>
<line class="st25" x1="166.1" y1="511.3" x2="164.6" y2="511.3"/>
</g>
</g>
<g id="_x30_8s-e-4not5_1_" v-if="slot04 !== slot05">
<g>
<line class="st25" x1="183.8" y1="262.9" x2="182.3" y2="262.9"/>
<line class="st26" x1="179.9" y1="262.9" x2="171.6" y2="262.9"/>
<line class="st25" x1="170.4" y1="262.9" x2="168.9" y2="262.9"/>
</g>
</g>
<g id="_x30_8s-e-3not4_1_" v-if="slot03 !== slot04">
<g>
<line class="st25" x1="183.8" y1="180.9" x2="182.3" y2="180.9"/>
<line class="st26" x1="179.9" y1="180.9" x2="171.6" y2="180.9"/>
<line class="st25" x1="170.4" y1="180.9" x2="168.9" y2="180.9"/>
</g>
</g>
<g id="_x30_8s-e-1not2_1_" v-if="slot01 !== slot02">
<g>
<line class="st25" x1="161.8" y1="27" x2="161.8" y2="28.5"/>
<line class="st26" x1="161.8" y1="30.9" x2="161.8" y2="39.2"/>
<line class="st25" x1="161.8" y1="40.4" x2="161.8" y2="41.9"/>
</g>
</g>
</g>
<g id="Measurements_8">
<g id="_x30_8s-m-6not7_1_" v-if="slot06 !== slot07">
<text transform="matrix(0 1 -1 0 167.3652 473.675)" class="st30 st28 st29">27”</text>
<text transform="matrix(0 1 -1 0 167.3652 473.6749)" class="st27 st28 st29">27”</text>
<polyline class="st0" points="154.1,483.4 163.4,473.7 154.1,463.9 "/>
</g>
<g id="_x30_8s-m-4not5_1_" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 203.9297 296.1207)" class="st27 st28 st29">92”</text>
<polyline class="st0" points="190.7,329.4 200,296.2 190.7,262.9 "/>
</g>
<g id="_x30_8s-m-2not1_1_" v-if="slot02 !== slot01">
<text transform="matrix(1 0 0 1 172.4848 7.8708)" class="st27 st28 st29">29”</text>
<polyline class="st0" points="182.7,21.1 172.3,11.8 161.8,21.1 "/>
</g>
<g id="_x30_8s-m-3not4_1_" v-if="slot03 !== slot04">
<polyline class="st0" points="190.7,180.9 200,164.9 190.7,149 "/>
<text transform="matrix(0 1 -1 0 203.9297 164.9342)" class="st27 st28 st29">44”</text>
</g>
</g>
<g id="Labels_8">
<g id="_x30_8s-l-7zzz_1_">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 504.8115)" class="st20 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-8zz_1_">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="st20 st12 st13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_8s-l-8z_1_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="st20 st12 st13" :class="getArtistColorByIndex(8)">{{slot08}}</text  >
</g>
<g id="_x30_8s-l-7not8-jr_1_" v-if="slot07 !== slot08">
<text transform="matrix(0 1 -1 0 168.8164 509.2813)" class="st19 st12 st13 jr" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-7not6-jl_1_" v-if="slot07 !== slot06">
<text transform="matrix(0 1 -1 0 128.6484 468.3014)" class="st19 st12 st13 jl" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-7and8_1_" v-if="slot07 === slot08">
<text transform="matrix(0 1 -1 0 168.8164 510.3063)" class="st19 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_8s-l-6_1_">
<text transform="matrix(0 1 -1 0 128.1406 422.698)" class="st19 st12 st13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_8s-l-5z_1_">
<text transform="matrix(0 1 -1 0 128.6484 336.6378)" class="st18 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_8s-l-5_1_">
<text transform="matrix(0 1 -1 0 172.4844 296.1209)" class="st17 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_8s-l-4_1_">
<text transform="matrix(0 1 -1 0 172.4844 221.5449)" class="st17 st12 st13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_8s-l-3_1_">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="st16 st12 st31" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_8s-l-2_1_">
<text transform="matrix(0 1 -1 0 171.4824 59.9999)" class="st15 st12 st13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_8s-l-1and2_1_" v-if="slot01 === slot02">
<text transform="matrix(1 0 0 1 159.8192 37.7803)" class="st14 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_8s-l-1not2-jr_1_" v-if="slot01 !== slot02">
<text transform="matrix(1 0 0 1 152.9998 37.7803)" class="st14 st12 st13 jr" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_8s-l-1_1_">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="st32 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="show_if_slots_7" v-if="slotCount === 7">
<g id="Slots_7">
<g id="_x30_7s-s-7_1_">
<rect x="150.4" y="350.1" class="st20" width="22.4" height="4.1" :class="getArtistColorByIndex(7)"/>
<rect x="31.2" y="481.2" class="st20" width="3.8" height="47.8" :class="getArtistColorByIndex(7)"/>
<rect x="162.8" y="559.2" transform="matrix(0.6173 -0.7867 0.7867 0.6173 -374.1757 352.987)" class="st20" width="25.9" height="3.8" :class="getArtistColorByIndex(7)"/>
</g>
<g id="_x30_7s-s-6_1_">
<rect x="141.3" y="434.2" class="st19" width="3.8" height="49.2" :class="getArtistColorByIndex(6)"/>
<rect x="179.5" y="489.5" class="st19" width="3.9" height="40.3" :class="getArtistColorByIndex(6)"/>
</g>
<g id="_x30_7s-s-5_1_">
<rect x="141.3" y="329.4" class="st18" width="3.8" height="15.8" :class="getArtistColorByIndex(5)"/>
<rect x="141.3" y="381.8" class="st18" width="3.8" height="52.4" :class="getArtistColorByIndex(5)"/>
<rect x="183.8" y="303.6" class="st18" width="3.9" height="25.7" :class="getArtistColorByIndex(5)"/>
</g>
<rect id="_x30_7s-s-4_1_" x="183.8" y="209.7" class="st17" width="3.9" height="94" :class="getArtistColorByIndex(4)"/>
<g id="_x30_7s-s-3_1_">
<g>
<rect x="183.8" y="149" class="st16" width="3.9" height="60.7" :class="getArtistColorByIndex(3)"/>
<rect x="168.8" y="129.2" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -25.889 243.7614)" class="st16" width="3.8" height="24.3" :class="getArtistColorByIndex(3)"/>
</g>
</g>
<g id="_x30_7s-s-2_1_">
<g>
<rect x="182.7" y="27" class="st15" width="3.9" height="71.3" :class="getArtistColorByIndex(2)"/>
<rect x="149.3" y="124.1" transform="matrix(0.3883 -0.9215 0.9215 0.3883 -30.2456 220.7961)" class="st15" width="3.8" height="18.2" :class="getArtistColorByIndex(2)"/>
</g>
</g>
<g id="_x30_7s-s-1_1_">
<rect x="35.5" y="90.8" transform="matrix(0.411 -0.9116 0.9116 0.411 -50.8971 106.7238)" class="st32" width="43.2" height="3.9" :class="getArtistColorByIndex(1)"/>
<rect x="125.7" y="23.2" class="st32" width="50.8" height="3.8" :class="getArtistColorByIndex(1)"/>
</g>
</g>
<g id="Edges_7">
<g id="_x30_7s-e-5not6_1_" v-if="slot05 !== slot06">
<g>
<line class="st25" x1="141.4" y1="434.2" x2="139.9" y2="434.2"/>
<line class="st26" x1="137.5" y1="434.2" x2="129.2" y2="434.2"/>
<line class="st25" x1="128" y1="434.2" x2="126.5" y2="434.2"/>
</g>
</g>
<g id="_x30_7s-e-4not5_1_" v-if="slot04 !== slot05">
<g>
<line class="st25" x1="183.8" y1="303.6" x2="182.3" y2="303.6"/>
<line class="st26" x1="179.9" y1="303.6" x2="171.6" y2="303.6"/>
<line class="st25" x1="170.4" y1="303.6" x2="168.9" y2="303.6"/>
</g>
</g>
<g id="_x30_7s-e-3not4_1_" v-if="slot03 !== slot04">
<g>
<line class="st25" x1="183.8" y1="209.7" x2="182.3" y2="209.7"/>
<line class="st26" x1="179.9" y1="209.7" x2="171.6" y2="209.7"/>
<line class="st25" x1="170.4" y1="209.7" x2="168.9" y2="209.7"/>
</g>
</g>
<g id="_x30_7s-e-2not3_1_" v-if="slot02 !== slot03">
<g>
<line class="st25" x1="158.8" y1="138.4" x2="158.2" y2="139.8"/>
<line class="st26" x1="157.3" y1="142" x2="154" y2="149.7"/>
<line class="st25" x1="153.6" y1="150.8" x2="153" y2="152.2"/>
</g>
</g>
</g>
<g id="Measurements_7">
<g id="_x30_7s-m-5not6_1_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="st27 st28 st29">68”</text>
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="st30 st28 st29">68”</text>
<text transform="matrix(0 1 -1 0 167.3652 458.8002)" class="st27 st28 st29">68”</text>
<polyline class="st0" points="154.1,483.4 163.4,458.8 154.1,434.2 "/>
</g>
<g id="_x30_7s-m-4not5_1_" v-if="slot04 !== slot05">
<text transform="matrix(-8.979319e-11 1 -1 -8.979319e-11 203.8027 316.6728)" class="st27 st28 st29">36”</text>
<polyline class="st0" points="190.5,329.7 199.9,316.7 190.5,303.6 "/>
</g>
<g id="_x30_7s-m-3not4_1_" v-if="slot03 !== slot04">
<text transform="matrix(-8.979319e-11 1 -1 -8.979319e-11 203.8027 179.35)" class="st27 st28 st29">84”</text>
<polyline class="st0" points="190.5,209.7 199.9,179.3 190.5,149 "/>
</g>
<g id="_x30_7s-m-2not3_2_" v-if="slot02 !== slot03">
<text transform="matrix(0.9212 0.389 -0.389 0.9212 158.4487 119.2052)" class="st27 st28 st34">25”</text>
<polyline class="st0" points="160.8,133.3 156.1,121.2 144,126.2 "/>
</g>
</g>
<g id="Labels_7">
<g id="_x30_7s-l-7zzz_1_">
<text transform="matrix(8.979319e-11 -1 1 8.979319e-11 47.0526 504.8115)" class="st20 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-7zz_1_">
<text transform="matrix(1 0 0 1 161.9476 365.9983)" class="st20 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-7_1_">
<text transform="matrix(-0.6223 0.7828 -0.7828 -0.6223 167.0468 552.9548)" class="st20 st12 st13" :class="getArtistColorByIndex(7)">{{slot07}}</text  >
</g>
<g id="_x30_7s-l-6not5_1_" v-if="slot06 !== slot05">
<text transform="matrix(0 1 -1 0 128.6484 458.1434)" class="st19 st12 st13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_7s-l-6_1_">
<text transform="matrix(0 1 -1 0 168.8164 508.8047)" class="st19 st12 st13" :class="getArtistColorByIndex(6)">{{slot06}}</text  >
</g>
<g id="_x30_7s-l-5and6_1_" v-if="slot05 === slot06">
<text transform="matrix(0 1 -1 0 128.6484 432.1982)" class="st19 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5not6_2_" v-if="slot05 !== slot06">
<text transform="matrix(0 1 -1 0 127.8496 404.3509)" class="st18 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5">
<text transform="matrix(0 1 -1 0 128.6484 336.6378)" class="st18 st12 st13" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-5-jr_1_">
<text transform="matrix(1 0 0 1 182.1089 323.5477)" class="st18 st12 st13 jr" :class="getArtistColorByIndex(5)">{{slot05}}</text  >
</g>
<g id="_x30_7s-l-4and5_1_" v-if="slot04 === slot05">
<text transform="matrix(0 1 -1 0 172.4844 272.2133)" class="st17 st12 st13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_7s-l-4not5_1_" v-if="slot04 !== slot05">
<text transform="matrix(0 1 -1 0 172.4844 251.5733)" class="st17 st12 st13" :class="getArtistColorByIndex(4)">{{slot04}}</text  >
</g>
<g id="_x30_7s-l-3_1_">
<text transform="matrix(0 1 -1 0 172.4844 177.6521)" class="st16 st12 st13" :class="getArtistColorByIndex(3)">{{slot03}}</text  >
</g>
<g id="_x30_7s-l-2and3_1_" v-if="slot02 === slot03">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 155.5056 148.333)" class="st15 st12 st31" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-2not3-jr_1_" v-if="slot02 !== slot03">
<text transform="matrix(0.9183 0.396 -0.396 0.9183 152.9828 147.5838)" class="st15 st12 st31 jr" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-2_1_">
<text transform="matrix(0 1 -1 0 171.4824 65.4022)" class="st15 st12 st13" :class="getArtistColorByIndex(2)">{{slot02}}</text  >
</g>
<g id="_x30_7s-l-1zz">
<text transform="matrix(1 0 0 1 147.3024 37.7803)" class="st32 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
<g id="_x30_7s-l-1_1_">
<text transform="matrix(0.444 -0.896 0.896 0.444 68.9994 98.6992)" class="st32 st12 st13" :class="getArtistColorByIndex(1)">{{slot01}}</text  >
</g>
</g>
</g>
<g id="Pallet">
<rect id="color-01" x="-37" y="21.6" class="st35" width="23" height="15.4"/>
<rect id="color-02" x="-37" y="36.9" class="st36" width="23" height="15.4"/>
<rect id="color-03" x="-37" y="52.3" class="st37" width="23" height="15.4"/>
<rect id="color-04" x="-37" y="67.7" class="st38" width="23" height="15.4"/>
<rect id="color-05" x="-37" y="83.1" class="st39" width="23" height="15.4"/>
<rect id="color-06" x="-37" y="98.4" class="st40" width="23" height="15.4"/>
<rect id="color-07" x="-37" y="113.8" class="st41" width="23" height="15.4"/>
<rect id="color-08" x="-37" y="129.2" class="st42" width="23" height="15.4"/>
<rect id="color-09" x="-37" y="144.6" class="st21" width="23" height="15.4"/>
<rect id="color-10" x="-37" y="159.9" class="st22" width="23" height="15.4"/>
<rect id="color-11" x="-37" y="175.3" class="st33" width="23" height="15.4"/>
<rect id="color-12" x="-37" y="190.7" class="st23" width="23" height="15.4"/>
<rect id="color-13" x="-37" y="206.1" class="st24" width="23" height="15.4"/>
<rect id="color-14" x="-37" y="221.5" class="st43" width="23" height="15.4"/>
<rect id="color-15" x="-37" y="236.9" class="st44" width="23" height="15.4"/>
<rect id="color-16" x="-37" y="252.3" class="st45" width="23" height="15.4"/>
<rect id="color-17" x="-37" y="267.7" class="st46" width="23" height="15.4"/>
<rect id="color-18" x="-37" y="283.1" class="st27" width="23" height="15.4"/>
<rect id="color-19" x="-37" y="298.5" class="st47" width="23" height="15.4"/>
<rect id="color-20" x="-37" y="313.9" class="st48" width="23" height="15.4"/>
<rect id="color-21" x="-37" y="329.2" class="st49" width="23" height="15.4"/>
<rect id="color-22" x="-37" y="344.6" class="st50" width="23" height="15.4"/>
<rect id="color-23" x="-37" y="360" class="st14" width="23" height="15.4"/>
<rect x="-37" y="375.4" class="st11" width="23" height="15.4"/>
<rect x="-37" y="390.8" class="st0" width="23" height="15.4"/>
<rect x="-37" y="406.2" class="st8" width="23" height="15.4"/>
</g>
</svg>   

</div>
`
});
