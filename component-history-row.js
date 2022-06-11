Vue.component('history-row', {
	mixins: [
		mixins,
	],
	props: {
		label: {
			type: String,
			require: true,
		},
		names: {
			type: Array,
			require: true,
		},
		featured: {
			type: Array,
			require: false,
		},
		hoverNames: {
			type: Boolean,
			require: false
		},
		pale: {
			type: Boolean,
			require: false
		}
	},
	computed: {
		highlightedName: function () {
			return this.$store.state.history.highlightedName;
		},
		fancyNames: function () {
			return makeFancy(this.names);
		},
		featuredString: function () {
			var result = '';
			if (this.featured.length > 0) {
				var working = this.featured.slice();
				result = working.shift().name;
				while (working.length > 0) {
					result += ' + ' + working.shift().name;
				}
			}
			return result;
		},
	},
	methods: {
		clickedOn: function (args) {
			this.$emit('clicked-on-name', args);
		},
		classByName: function (name) {
			var result = '';
			if (this.highlightedName === name) {
				result = 'selected';
			} else {
				result = 'not-selected';
			}
			return result;
		},
		setHighlightedName: function (name) {
			this.$store.dispatch('historySetHighlightedName', name);
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
