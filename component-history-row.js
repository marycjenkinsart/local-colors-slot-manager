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
		insertName: {
			type: String,
			require: false,
		},
		highlightName: {
			type: String,
			require: false,
		},
		featured: {
			type: Array,
			require: false,
		},
		hoverNames: {
			type: Boolean,
			require: false
		}
	},
	computed: {
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
			if (this.insertName === name) {
				result = 'selected-to-insert';
			} else if (this.highlightName === name) {
				result = 'selected';
			} else {
				result = 'not-selected';
			}
			return result;
		}
	},
	template: /*html*/`
	<table
		class="history"
	>
		<tr>
			<td
				class="historyLabel"
			>{{label}}</td>
			<template
				v-for="(artist, index) in fancyNames"
			>
				<td
					:class="classByName(artist.name)"	
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
			>{{featuredString}}</td>
		</tr>
	</table>
`
});
