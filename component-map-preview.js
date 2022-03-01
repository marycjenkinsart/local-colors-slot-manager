Vue.component('map-preview', {
	mixins: [
		mixins,
	],
	props: {
		manageUp: {
			type: Boolean,
			require: false,
		},
		manageDown: {
			type: Boolean,
			require: false,
		},
		artists: {
			type: Object,
			require: true,
		},
		label: {
			type: String,
			require: true,
		},
		templateInfo: {
			type: Object,
			require: true,
		}
	},
	data: function () {
		return {
			svgSizes: {
				up: {
					x: 218.4,
					y: 630.7
				},
				down: {
					x: 197,
					y: 480
				},
				combined: {
					x: 612,
					y: 792
				}
			},
			offsets: {
				up: {
					x: 63.9,
					y: 103.1
				},
				down: {
					x: 324.97,
					y: 120.19
				}
			}
		
		}
	},
	computed: {
		managing: function () {
			var result = 'combined';
			if (this.manageUp && !this.manageDown) {
				result = 'up';
			} else if (this.manageDown && !this.manageUp) {
				result = 'down'
			}
			return result;
		},
		wrapperSize: function () {
			var result = {
				x: this.svgSizes.combined.x,
				y: this.svgSizes.combined.y,
			}
			if (this.managing === 'up') {
				result = this.svgSizes.up;
			} else if (this.managing === 'down') {
				result = this.svgSizes.down;
			}
			return result;
		},
		viewBoxString: function () {
			result = "0 0 "
			var whichOne = this.managing;
			x = this.svgSizes[whichOne].x;
			y = this.svgSizes[whichOne].y;
			result += x + ' ' + y;
			return result;
		},
		unwrappedFeatureds: function () {
			var threeDee = [];
			var twoDee = [];
			var themes = [];
			this.artists.feat.forEach(function (item) {
				if (item.type === '2D') {
					twoDee.push(item.name);
				} else if (item.type === '3D') {
					threeDee.push(item.name);
				} else if (item.type === 'group') {
					themes.push(item.name);
				}
			})
			return {
				threeDee: threeDee,
				twoDee: twoDee,
				themes: themes,
			}
		},
		featuredLabelString: function () {
			var twoDee = this.unwrappedFeatureds.twoDee;
			var threeDee = this.unwrappedFeatureds.threeDee;
			var themes = this.unwrappedFeatureds.themes;
			var string = '';
			var artistCount = twoDee.length + threeDee.length;
			if (artistCount) {
				if (artistCount === 1) {
					string = 'Featured artist:';
				} else if (artistCount > 1) {
					string = 'Featured artists:';
				}
			} else if (themes.length) {
				if (themes.length === 1) {
					string = 'Featured group show theme:';
				} else if (themes.length > 1) {
					string = 'Featured group show themes:';
					}
				} else {
				string = 'Featured:';
			}
			return string;
		},
		featuredBodyString: function () {
			var twoDee = this.unwrappedFeatureds.twoDee;
			var threeDee = this.unwrappedFeatureds.threeDee;
			var themes = this.unwrappedFeatureds.themes;
			var string = '';
			if (twoDee.length || threeDee.length) {
				var artists = twoDee.concat(threeDee);
				string = artists.join(', ');
			} else if (themes.length) {
				string = themes.join(', ');
			} else {
				string = 'ERROR: no feat. items found';
			}
			return string;
		},
	},
	methods: {
		origins: function (floor) {
			var result = this.offsets[floor]
			if (this.managing === floor) {
				result = {
					x: 0,
					y: 0,
				};
			}
			return result;
		},
	},
	template: /*html*/`
<div class="map-preview">
<svg version="1.1" id="wrapping" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	x="0px"
	y="0px"
	:viewBox="viewBoxString"
>
		<floor-preview
			v-if="managing !== 'up'"
			:manage="manageDown"
			:artists="artists.down"
			:floor-name="'down'"
			:origin="origins('down')"
			:canvas-size="wrapperSize"
			:new-view="true"
			:template-floor-info="templateInfo.down"
		>
		</floor-preview>
		<floor-preview
			v-if="managing !== 'down'"
			:manage="manageUp"
			:artists="artists.up"
			:floor-name="'up'"
			:origin="origins('up')"
			:canvas-size="wrapperSize"
			:new-view="true"
			:template-floor-info="templateInfo.up"
		>
		</floor-preview>
		<g
			v-if="manageUp === manageDown"
		>
			<text
				x="305.9999"
				y="67.5836"
			>
				<tspan
					class="ust11 ust12 bigfont"
				>Preview: {{label}}</tspan>
			</text>
			<text>
				<tspan
					x="320"
					y="590"
					class="jl ust11 ust12 ust13"
				>{{featuredLabelString}}</tspan>
				<tspan
					x="320"
					dy="1.2em"
					class="jl ust11 ust12 ust13"
				>{{featuredBodyString}}</tspan>
			</text>
		</g>
	</svg>
	
</div>
`
});
