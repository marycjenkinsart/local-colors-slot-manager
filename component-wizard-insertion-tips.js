Vue.component('wizard-insertion-tips', {
	props: {
		showTips: {
			type: Boolean,
			require: true,
		},
	},
	methods: {
		setTips: function (bool) {
			this.$emit('set-tips', bool);
		},
	},
	template: /*html*/`
<div
	class="wizard-insertion-tips"
>
	<div
		v-if="!showTips"
	>
		<p>
			<button
				class="medium_button"
				@click="setTips(true)"
			>Show tips</button>
		</p>
	</div>
	<div
		class="hint"
		v-if="showTips"
	>
		<h3>Tips:</h3>
		<p>Click one of the square buttons to select that artist's name, then click on one of the "empty" half slot cells (on the top row, i.e. the insertion row) to place them.</p>
		<p>Artists with 1 full slot will take up 2 half cells: the cell you clicked on, and the cell just to the right. (Note: artists with 1 full slot will wrap around the end of the layout if you click the last half cell.)</p>
		<p>On the top row (the insertion row), you can click a red name to turn it black, which makes it insertable again. To remove the name from the top row altogether, click it while it is black. (You can also insert a fresh name on top of a placed name to remove it.)</p>
		<p>
			<button
				class="medium_button"
				@click="setTips(false)"
			>Hide tips</button>
		</p>
	</div>
</div>
`
});