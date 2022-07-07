Vue.component('rotation-button-row', {
	mixins: [
		mixins,
		mixinsHistory,
	],
	props: {
		rotation: {
			type: Object,
			require: true,
		},
		buttonLabel: {
			type: String,
			require: true,
		},
	},
	computed: {
		fancyUpstairs: function () {
			return makeFloorFancy(this.rotation.artists.up);
		},
		fancyDownstairs: function () {
			return makeFloorFancy(this.rotation.artists.down);
		},
		upstairsString: function () {
			return this.fancyUpstairs.map(function (item) {
				return makePrintName(item.name, item.slotSize);
			}).join(', ');
		},
		downstairsString: function () {
			return this.fancyDownstairs.map(function (item) {
				return makePrintName(item.name, item.slotSize);
			}).join(', ');
		},
		featuredString: function () {
			return this.rotation.artists.feat.map(function (item) {
				return makeFeaturedPrintName(item.name, item.type);
			}).join(', ');
		}
	},
	methods: {
		clickedRotation: function () {
			this.$emit('clicked-on-rotation');
		}
	},
	template: /*html*/`
<div class="flex-card-wide">
	<div class="card-head">
		<span>{{makeShortLabel(rotation.rotationLabel)}}</span>
	</div>
	<div class="card-body">
		<p>
			<strong>Featured: </strong>{{featuredString}}<br/>
			<strong>Up: </strong>{{upstairsString}}<br/>
			<strong>Down: </strong>{{downstairsString}}
		</p>
		<p>
			<button
				class="big_button"
				@click="clickedRotation"
			>{{buttonLabel}}
			</button>
		</p>
	</div>
</div>
`
});
