var previewPage = Vue.component('preview', {
	mixins: [
		mixins,
	],
	data: function () {
		return {
			test: {
				l:'1970,1,1,LABEL_ERROR',
				f:'FEAT-2D-1',
				u:'test1-1,test2,test3-1,test4',
				d:'temp1-1,temp2,temp3,temp4-1,temp1-1',
			}
		}
	},
	computed: {
		queryData: function () {
			var query = this.$route.query; // requires the vue router
			return {
				l: query && query.l || this.test.l,
				f: query && query.f || this.test.f,
				u: query && query.u || this.test.u,
				d: query && query.d || this.test.d,
			};
		},
		labelData: function () {
			return this.makeLabelUncompact(this.queryData.l);
		},
		artists: function () {
			return result = {
				feat: this.makeCompactFeaturedUnfancy(this.queryData.f),
				up: this.makeCompactFloorUnfancy(this.queryData.u),
				down: this.makeCompactFloorUnfancy(this.queryData.d),
			};
		},
	},
	template: /*html*/`
<div
	id="month-preview"
>
	<div
		class="view_only_preview"
	>
		<map-preview
			:artists="artists"
			:label="getLongLabel(labelData)"
		></map-preview>
	</div>
</div>
`
});
