var monthViewPage = Vue.component('progress-bar', {
	props: {
		chapters: {
			type: Array,
			require: true,
		},
		currentChapter: {
			type: String,
			require: true,
		},
	},
	computed: {
		currentChapterIndex: function () {
			var target = this.currentChapter
			return this.chapters.findIndex(function (chapterName) {
				return chapterName === target;
			})
		},
	},
	methods: {
		determineClassByChapterIndex: function (index) {
			var result = '';
			if (index === this.currentChapterIndex) {
				result = 'progress-bar-select';
			} else if (index < this.currentChapterIndex) {
				result = 'progress-bar-complete';
			}
			return result;
		} ,
	},
	template: /*html*/`
<div
	class="progress-bar"
>
	<table
		class="progress-bar-table"
	>
		<tbody>
			<tr>
				<td
					v-for="(chapterName, index) in chapters"
					:class="determineClassByChapterIndex(index)"
				>
				</td>
			</tr>
		</tbody>
	</table>
</div>
`
});
