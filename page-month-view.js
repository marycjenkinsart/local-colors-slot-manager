var monthViewPage = Vue.component('month-view', {
    data: function () {
        var guestNameString = 'GUEST';
        return {
            rotationId: '2021-12',
            guestName: guestNameString,
            artists: {
                'up': [
                    guestNameString,
                    'Bill',
                    'Bill',
                    'J. Clay',
                    'Jeff M.',
                    'Jeff M.',
                    'Emily',
                    'Emily',
                    'Blaine',
                    'Blaine',
                ],
                'down': [
                    'Adam',
                    'Nuha',
                    'Nuha',
                    'Pam',
                    'Pam',
                    'Mary',
                    'Mary',
                    'Jan',
                    'Jan',
                    'Adam',
                ],
                'feat': [ // can be more than one!
                    'Teri',
                    'Teri',
                ],
            },
            featData: {
                slotSize: 2,
                previousFloor: 'up'
            },
        }
    },
    computed: {
        upstairsSlotCount: function () {
            return artists.up.length / 2;
        },
        downstairsSlotCount: function () {
            return artists.down.length / 2;
        },
        displayFeatured: function () {
            var result = this.artists.feat[0];
            if (this.artists.feat[0] !== this.artists.feat[1]) {
                result = this.artists.feat[0] + ', ' + this.artists.feat[1];
            }
            return result;
        },
    },
    methods: {
        getDisplaySlotSize: function (slotSize) {
            if (slotSize === 1) {
                return '1';
            } else if (slotSize === 0.5) {
                return '½';
            }
        },
        getLongDate: function (id) {
            var splits = id.split('-');
            var monthMap = [
                'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
                'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
            ]
            var monthName = monthMap[parseInt(splits[1],10) - 1];
            return monthName + ' ' + splits[0];
        },
        replaceFloor: function (floorName, event) {
            this.artists[floorName] = event;
        },
        moveArtistToOtherFloor: function (artistName) {

        }
    },
    template: /*html*/`
<div id="month-view">
    <h1>Rotation: {{getLongDate(rotationId)}}</h1>
    <p>Featured: {{displayFeatured}}</p>
    <name-manager
        :name-list="artists.up"
        :guest-name-string="guestName"
        :floor-name="'up'"
        @replace-floor="replaceFloor('up',$event)"
    ></name-manager>
    <name-manager
        :name-list="artists.down"
        :guest-name-string="guestName"
        :floor-name="'down'"
        @replace-floor="replaceFloor('down',$event)"
    ></name-manager>
</div>
`
});
