var previewPage = Vue.component('preview', {
	mixins: [
		mixins,
	],
    data: function () {
        return {
            test: 'l|2021,12&f|Teri=2D=1&u|GUEST=1,Adam,Nuha,Pam,Mary,Jan&d|Bill,J._Clay=1,Jeff_M.,Emily,Blaine',
        }
    },
    computed: {
        upstairsSlotCount: function () {
            return artists.up.length / 2;
        },
        downstairsSlotCount: function () {
            return artists.down.length / 2;
        },
        uniqueUpstairs: function () {
            return this.artists.up.filter(this.getUnique).sort();
        },
        uniqueDownstairs: function () {
            return this.artists.down.filter(this.getUnique).sort();
        },
        artists: function () {
            return this.makeUncompact(this.test);
        },
        rotationLabel: function () {
            return this.makeLabelUncompact(this.test);
        }
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
            :label="getLongLabel(
                rotationLabel.year,
                rotationLabel.month,
                rotationLabel.version,
            )"
        ></map-preview>
    </div>
</div>
`
});
