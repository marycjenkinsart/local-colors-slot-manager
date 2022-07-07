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
	<table
		class="rotation-button-row"
	>
		<tr>
			<td>
				<button
					class="big_button"
					@click="clickedRotation"
				>{{makeShortLabel(rotation.rotationLabel)}}
				</button>
			</td>
			<td>
				<strong>Up: </strong>{{upstairsString}}<br/>
				<strong>Down: </strong>{{downstairsString}}
			</td>
			<td>
				<strong>Featured: </strong>{{featuredString}}
			</td>
		</tr>
	</table>
`
});
