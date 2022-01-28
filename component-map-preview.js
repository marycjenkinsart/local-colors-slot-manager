Vue.component('map-preview', {
	mixins: [
		mixins,
	],
    props: {
		manageUp: {
			type: Boolean,
			require: true,
		},
		manageDown: {
			type: Boolean,
			require: true,
		},
		artists: {
			type: Object,
			require: true,
		}
	},
    computed: {},
    methods: {},
    template: /*html*/`
<div class="map-preview">
    <floor-preview
        :manage="manageDown"
        :artists="artists.down"
        :floor-name="'down'"
    >
    </floor-preview>
</div>
`
});
