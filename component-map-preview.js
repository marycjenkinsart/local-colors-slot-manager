var rawSvgSizes = {
	// the size of the SVG "artboard" for each floor
	// (0,0 is origin, which is at the top-left)
	up: { x: 218.4, y: 630.7 },
	down: { x: 197, y: 480 },
	combined: { x: 612, y: 792 },
};

var rawOffsets = {
	// use the single-floor SVG file origins ("solo") when viewing just a single floor:
	solo: { x: 0, y: 0 },
	// otherwise, you'll want to position them on the 8.5 x 11 "page":
	up: { x: 63.9, y: 103.1 },
	down: { x: 324.97, y: 120.19 },
};

// In practice, the above is too tightly spaced for solo floor view and too spacious for combined
// (Printing the preview page does not yield original SVG dimensions, which would have been the reason to do it)
// Therefore, use the following instead:

var padding = 10;
var undoUSLetterSize = {
	x: -60,
	y: -40,
};

var svgSizes = {
	up: {
		x: 218.4 + padding*2,
		y: 630.7 + padding*2
	},
	down: {
		x: 197 + padding*2,
		y: 480 + padding*2
	},
	combined: {
		x: 528 + undoUSLetterSize.x,
		y: 750 + undoUSLetterSize.y
	},
};

var offsets = {
	solo: {
		x: padding,
		y: padding
	},
	up: {
		x: 63.9 + undoUSLetterSize.x,
		y: 103.1 + undoUSLetterSize.y
	},
	down: {
		x: 324.97 + undoUSLetterSize.x,
		y: 120.19 + undoUSLetterSize.y
	},
};

var otherCoords = {
	svgRotationLabel: {
		x: 305.9999 + undoUSLetterSize.x,
		y: 67.5836 + undoUSLetterSize.y,
	},
	svgFeaturedLabel: {
		x: 320 + undoUSLetterSize.x,
		y: 590 + undoUSLetterSize.y,
	}
}

Vue.component('map-preview', {
	mixins: [
		mixins,
	],
	data: function () {
		return {
			secretClickCount: 0,
		};
	},
	computed: {
		artists: function () {
			return this.$store.getters.artists;
		},
		rotationLabel: function () {
			return this.$store.getters.rotationLabel;
		},
		// the above should be the only place these things come from!!
		longLabel: function () {
			return getLongLabel(this.rotationLabel);
		},
		manageWhich: function () {
			return this.$store.getters.manageWhich;
		},
		overallView: function () {
			return !(this.manageWhich === 'up' || this.manageWhich === 'down');
		},
		otherCoords: function () {
			return otherCoords;
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
		clickedOnLabel: function () {
			var currentPath = this.$route.path;
			if (currentPath === '/view') {
				this.secretClickCount += 1;
			};
			console.log(this.$route);
			if (this.secretClickCount === 5) {
				this.secretClickCount = 0;
				this.$router.push({
					path: '/hub',
					query: this.$route.query,
				});
			};
		},
		origins: function (floor) {
			var result = offsets[floor]
			if (this.manageWhich === floor) {
				result = {
					x: offsets.solo.x,
					y: offsets.solo.y,
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
			floor-name="down"
			:origin="origins('down')"
			:canvas-size="wrapperSize"
		>
		</floor-preview>
		<floor-preview
			v-if="manageWhich !== 'down'"
			floor-name="up"
			:origin="origins('up')"
			:canvas-size="wrapperSize"
		>
		</floor-preview>
		<g
			v-if="overallView"
		>
			<text
				:x="otherCoords.svgRotationLabel.x"
				:y="otherCoords.svgRotationLabel.y"
			>
				<tspan
					@click="clickedOnLabel"
					class="ust11 ust12 bigfont"
				>Preview: {{longLabel}}</tspan>
			</text>
			<text>
				<tspan
					:x="otherCoords.svgFeaturedLabel.x"
					:y="otherCoords.svgFeaturedLabel.y"
					class="jl ust11 ust12 ust13"
				>{{featuredLabelString}}</tspan>
				<tspan
					:x="otherCoords.svgFeaturedLabel.x"
					dy="1.2em"
					class="jl ust11 ust12 ust13"
				>{{featuredBodyString}}</tspan>
			</text>
		</g>
	</svg>
	
</div>
`
});
