Vue.component('history-row', {
	mixins: [
		mixins,
		mixinsHistory,
	],
	props: {
		label: {
			type: String,
			require: true,
		},
		names: {
			// unfancy artist names
			type: Array,
			require: true,
		},
		featured: {
			// the featured array
			type: Array,
			require: false,
		},
		insertable: {
			// whether this row is eligible for name insertion
			// (affects whether names will turn black if insertable)
			type: Boolean,
			require: false
		},
		pale: {
			// if true, draws the boxes (and words) paler
			// (meant for the table header)
			type: Boolean,
			require: false
		},
	},
	computed: {
		fancyNames: function () {
			return makeFloorFancy(this.names);
		},
		featuredString: function () {
			// a string to put in the "featured" column
			var featured = this.featured || [];
			var names = featured.map(function (item) {
				return item.name;
			})
			return names.join(' + ') || '(none)';
		},
	},
	methods: {
		clickedOn: function (args) {
			this.$emit('clicked-on-name', args);
		},
		classByName: function (name) {
			var result = '';
			if (this.insertName === name && this.insertable) {
				result = 'selected-to-insert';
			} else if (this.highlightedName === name) {
				result = 'selected';
			} else {
				result = 'not-selected';
			}
			return result;
		},
	},
	template: /*html*/`
	<table
		class="history"
	>
		<tr>
			<td
				class="historyLabel"
				:class="pale ? 'history-header-text' : ''"
			>{{label}}</td>
			<template
				v-for="(artist, index) in fancyNames"
			>
				<td
					:class="pale ? 'history-header-box' : classByName(artist.name)"	
					@click="clickedOn({name: artist.name, index: artist.slotIndex})"
					:colspan="Math.floor(artist.slotSize * 2)"
				>
					<span>
						{{artist.name}}
					</span>
				</td>
				</template>
			<td
				class="historyFeatured"
				:class="pale ? 'history-header-text' : ''"
			>{{featuredString}}</td>
		</tr>
	</table>
`
});
