var monthViewPage = Vue.component('month-view', {
	mixins: [
		mixins,
	],
    data: function () {
        var guestNameString = 'GUEST';
        return {
            rotationId: '2021-12',
            guestName: guestNameString,
            manage: {
                'feat': false,
                'up': true,
                'down': false,
            },
            featuredData: [
                    {
                        'Teri': {
                            type: '2D',
                            slotSize: 2,
                        }
                    }
                ],
            artists: {
                'feat': [ // can be more than one! or zero!
                    'Teri',
                ],
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
            var result = 'No featured artists found!'
            var featureds = this.artists.feat
            if (featureds.length > 0) {
                result = featureds[0];
            }
            if (featureds.length > 1) {
                for (let index = 1; index < featureds.length; index++) {
                    result += ', ' + featureds[index];
                }
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

        },
    },
    template: /*html*/`
<div id="month-view">
    <h2>Rotation: {{getLongDate(rotationId)}}</h2>
    <div class="manager-box">
        <h3 class="flat">
            <span>
                Featured
            </span>
            <button
                v-show="!manage.feat"
                @click="manage.feat=true"
            >Manage</button>
            <button
                v-show="manage.feat"
                @click="manage.feat=false"
            >DONE</button>
        </h3>
        <p>
            <span class="artist-name">
                {{displayFeatured}}
            </span>
        </p>
    </div>
    <div class="manager-box">
        <h3 class="flat">
            <span>
                {{displayFloor('up')}} ({{artists.up.length / 2}})
            </span>
            <button
                v-show="!manage.up"
                @click="manage.up=true"
            >Manage</button>
            <button
                v-show="manage.up"
                @click="manage.up=false"
            >DONE</button>
        </h3>
        <name-manager
            :name-list="artists.up"
            :guest-name-string="guestName"
            :floor-name="'up'"
            :manage="manage.up"
            @replace-floor="replaceFloor('up',$event)"
        ></name-manager>
    </div>
    <div class="manager-box">
    <h3 class="flat">
        <span>
            {{displayFloor('down')}} ({{artists.down.length / 2}})
        </span>
        <button
            v-show="!manage.down"
            @click="manage.down=true"
        >Manage</button>
        <button
            v-show="manage.down"
            @click="manage.down=false"
        >DONE</button>
    </h3>
        <name-manager
            :name-list="artists.down"
            :guest-name-string="guestName"
            :floor-name="'down'"
            :manage="manage.down"
            @replace-floor="replaceFloor('down',$event)"
        ></name-manager>
    </div>
</div>
`
});
