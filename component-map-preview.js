var svgSizes = {
	up: { x: 218.4, y: 630.7 },
	down: { x: 197, y: 480 },
	combined: { x: 612, y: 792 }
};

var offsets = {
	up: { x: 63.9, y: 103.1 },
	down: { x: 324.97, y: 120.19 }
};

Vue.component('map-preview', {
	mixins: [
		mixins,
	],
	props: {
		artists: {
			type: Object,
			require: true,
		},
		label: {
			type: String,
			require: true,
		},
	},
	computed: {
		manageWhich: function () {
			return this.$store.state.manage;
		},
		overallView: function () {
			return !(this.manageWhich === 'up' || this.manageWhich === 'down');
		},
		wrapperSize: function () {
			var lookup = svgSizes[this.manageWhich] || svgSizes.combined;
			return {
				x: lookup.x,
				y: lookup.y,
			};
		},
		viewBoxString: function () {
			result = "0 0 ";
			x = this.wrapperSize.x;
			y = this.wrapperSize.y;
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
			var result = offsets[floor]
			if (this.manageWhich === floor) {
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
			v-if="manageWhich !== 'up'"
			:artists="artists.down"
			floor-name="down"
			:origin="origins('down')"
			:canvas-size="wrapperSize"
		>
		</floor-preview>
		<floor-preview
			v-if="manageWhich !== 'down'"
			:artists="artists.up"
			floor-name="up"
			:origin="origins('up')"
			:canvas-size="wrapperSize"
		>
		</floor-preview>
		<g
			v-if="overallView"
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
