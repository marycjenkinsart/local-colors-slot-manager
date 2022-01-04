var monthViewPage = Vue.component('month-view', {
	mixins: [
		mixins,
	],
    data: function () {
        var guestNameString = 'GUEST';
        return {
            rotationId: '2021-12',
            guestName: guestNameString,
            move: {
                inProgress: false,
                name: '',
            },
            manage: {
                'feat': false,
                'up': false,
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
        uniqueUpstairs: function () {
            return this.artists.up.filter(this.getUnique).sort();
        },
        uniqueDownstairs: function () {
            return this.artists.down.filter(this.getUnique).sort();
        },
        moveFloor: function () {
            var splits = this.move.name.split('-');
            var target = '';
            if (splits[0] === 'up') {
                target = 'down';
            } else if (splits[0] === 'down') {
                target = 'up';
            }
            return target || '';
        },
        moveName: function () {
            var splits = this.move.name.split('-');
            return splits[1] || '';
        }
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
        swapFloors: function () {
            var newArtists = {};
            newArtists.feat = this.artists.feat;
            newArtists.up = this.artists.down;
            newArtists.down = this.artists.up;
            this.artists = newArtists;
        },
        moveArtistToOtherFloorStart: function () {
            this.move.inProgress = true;
        },
        moveArtistToOtherFloorAttempt: function () {
            var targetFloor = this.moveFloor;
            var otherFloor = '';
            if (targetFloor === 'up') {
                otherFloor = 'down';
            } else if (targetFloor === 'down') {
                otherFloor = 'up';
            }
            if (!this.artists[targetFloor].includes(this.moveName)) {
                this.moveArtistToOtherFloorSuccess();
            } else {
                this.moveArtistToOtherFloorFail();
            }
        },
        moveArtistToOtherFloorSuccess: function () {
            var self = this;
            var targetFloor = this.moveFloor;
            var otherFloor = '';
            if (targetFloor === 'up') {
                otherFloor = 'down';
            } else if (targetFloor === 'down') {
                otherFloor = 'up';
            }
            var strippedFloor = [];
            var targetName = this.moveName;
            this.artists[otherFloor].forEach(function (halfSlot) {
                if (halfSlot === targetName) {
                    self.artists[targetFloor].push(halfSlot);
                } else {
                    strippedFloor.push(halfSlot);
                }
            })
            this.artists[otherFloor] = strippedFloor;
            this.move.message = `${this.moveName} moved ${this.moveFloor}stairs!`;
            console.log(`${this.moveName} moved ${this.moveFloor}stairs!`);
        },
        moveArtistToOtherFloorFail: function () {
            this.move.message = `An artist named ${this.moveName} is already present ${this.moveFloor}stairs! Rename one of the artists first to prevent accidental merging!`;
            console.warn(this.move.message);
            this.move.name = '';
        },
        moveArtistToOtherFloorConclude: function () {
            this.moveArtistToOtherFloorCancel();
        },
        moveArtistToOtherFloorCancel: function () {
            this.move.name = '';
            this.move.message = '';
            this.move.inProgress = false;
        },
    },
    template: /*html*/`
<div id="month-view">
    <h2>Rotation: {{getLongDate(rotationId)}}</h2>
    <p>
        <button
            :disabled="move.inProgress"
            @click="swapFloors"
        >swap artists on each floor</button>
        <button
            :disabled="move.inProgress"
            @click="moveArtistToOtherFloorStart"
        >move artist to another floor</button>
    </p>
    <div
        v-if="move.inProgress"
        class="manager-box"
    >
        <div
            class="manager-inner round-and-shadow"
        >
            <div v-if="!move.message">
                <p>Move which artist to the other floor?</p>
                <p>
                    <select
                        v-model="move.name"
                    >
                        <optgroup label="Upstairs">
                            <option
                                v-for="name in uniqueUpstairs"
                                :value="'up-' + name"
                            >{{name}}</option>
                        </optgroup>
                        <optgroup label="Downstairs">
                            <option
                                v-for="name in uniqueDownstairs"
                                :value="'down-' + name"
                            >{{name}}</option>
                        </optgroup>
                    </select>
                </p>
                <div v-if="move.name">
                    <p>Move <strong>{{moveName}}</strong> {{moveFloor}}stairs?</p>
                    <p>
                        <button
                            @click="moveArtistToOtherFloorCancel"
                        >Cancel</button>
                        <button
                            @click="moveArtistToOtherFloorAttempt"
                        >Ok</button>
                    </p>
                </div>
            </div>
            <div v-if="move.message">
                <p>{{move.message}}</p>
                <p>
                    <button
                        @click="moveArtistToOtherFloorConclude"
                    >Ok</button>
                </p>
            </div>
        </div>
    </div>
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
