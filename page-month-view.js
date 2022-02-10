var monthViewPage = Vue.component('month-view', {
	mixins: [
		mixins,
	],
    data: function () {
        var guestNameString = 'GUEST';
        return {
            rotationLabel: {
                year: 2021,
                month: 12,
                version: 1,
                custom: '',
                editing: false,
            },
            guestName: guestNameString,
            lockGuest: true,
            move: {
                inProgress: false,
                name: '',
            },
            manage: {
                'feat': false,
                'up': false,
                'down': false,
            },
            artists: {
                'feat': [ // can be more than one! or zero!
                    {
                        name:'Teri',
                        type: '2D',
                        origSlotSize: 1,
                    },
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
        replaceFloor: function (floorName, event) {
            this.artists[floorName] = event;
            console.log(this.makeCompact(this.artists, this.rotationLabel));
            console.log(this.artists.feat);
            console.log(this.makeFancy(this.artists.up));
            console.log(this.makeFancy(this.artists.down));
        },
        replaceArtists: function (event) {
            this.artists = event;
        },
        swapFloorsButton: function () {
            if (this.lockGuest) {
                this.freezeGuestAndSwapFloors();
            } else {
                this.swapFloors();
            }
        },
        swapFloors: function () {
            var newArtists = {};
            newArtists.feat = this.artists.feat;
            newArtists.up = this.artists.down;
            newArtists.down = this.artists.up;
            this.artists = newArtists;
        },
        freezeGuestAndSwapFloors: function () {
            var guestName = this.guestName;
            var upGuestIndices = [];
            var upSansGuests = [];
            this.artists.up.forEach(function (halfSlot, index) {
                if (halfSlot === guestName) {
                    upGuestIndices.push(index);
                } else {
                    upSansGuests.push(halfSlot);
                }
            })
            var downGuestIndices = [];
            var downSansGuests = [];
            this.artists.down.forEach(function (halfSlot, index) {
                if (halfSlot === guestName) {
                    downGuestIndices.push(index);
                } else {
                    downSansGuests.push(halfSlot);
                }
            })
            var newArtists = {};
            newArtists.feat = this.artists.feat;
            newArtists.up = downSansGuests;
            newArtists.down = upSansGuests;
            downGuestIndices.forEach(function (guestIndex) {
                newArtists.down.splice(guestIndex, 0, guestName);
            })
            upGuestIndices.forEach(function (guestIndex) {
                newArtists.up.splice(guestIndex, 0, guestName);
            })
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
        editRotationNameStart: function () {
            this.rotationLabel.editing = true;
        },
        editRotationNameEnd: function () {
            this.rotationLabel.editing = false;
        },
        incrementLabel: function (variable) {
            if (variable === 'year') {
                this.rotationLabel.year += 1;
            } else if (variable === 'month') {
                if (this.rotationLabel.month === 12) {
                    this.rotationLabel.month = 1;
                    this.rotationLabel.year += 1;
                } else {
                    this.rotationLabel.month += 1;
                }
            } else if (variable === 'version') {
                this.rotationLabel.version += 1;
            } else {
                console.error(`You can't increment ${variable}!`)
            }
        },
        decrementLabel: function (variable) {
            if (variable === 'year') {
                this.rotationLabel.year -= 1;
            } else if (variable === 'month') {
                if (this.rotationLabel.month === 1) {
                    this.rotationLabel.month = 12;
                    this.rotationLabel.year -= 1;
                } else {
                    this.rotationLabel.month -= 1;
                }
            } else if (variable === 'version') {
                if (this.rotationLabel.version != 1) {
                    this.rotationLabel.version -= 1;
                }
            } else {
                console.error(`You can't decrement ${variable}!`)
            }
        },
    },
    template: /*html*/`
<div
    id="month-view"
>
    <h2>
        <span>Rotation: {{getLongLabel(rotationLabel)}}</span>
    </h2>
    <p>
        <button
            :disabled="rotationLabel.editing"
            title="Change the label for this rotation"
            @click="editRotationNameStart"
        >edit rotation name</button>
    </p>
    <div
        v-if="rotationLabel.editing"
        class="manager-box"
    >
        <div
            class="manager-inner round-and-shadow"
        >
            <p>
                <span>Month:</span>
                <span class="red">{{rotationLabel.month}}</span>
                <button
                    @click="decrementLabel('month')"
                >–</button>
                <button
                    @click="incrementLabel('month')"
                >+</button>
            </p>
            <p>
                <span>Year:</span>
                <span class="red">{{rotationLabel.year}}</span>
                <button
                    @click="decrementLabel('year')"
                >–</button>
                <button
                    @click="incrementLabel('year')"
                >+</button>
            </p>
            <p>
                <span>Layout version:</span>
                <span class="red">{{rotationLabel.version}}</span>
                <button
                    @click="decrementLabel('version')"
                >–</button>
                <button
                    @click="incrementLabel('version')"
                >+</button>
            </p>
            <p>
                <span>
                    Custom label:
                </span>
                <input
                    v-model="rotationLabel.custom"
                    type="text"
                />
            </p>
            <p>
                <button
                    @click="editRotationNameEnd"
                >DONE</button>
            </p>
        </div>
    </div>
    <p class="flat">
        <button
            title="Choose an artist to move to the opposite floor"
            :disabled="move.inProgress"
            @click="moveArtistToOtherFloorStart"
        >move artist to opposite floor</button>
    </p>
    <p class="flat">
        <button
            title="Move all upstairs artists downstairs and vice versa"
            :disabled="move.inProgress"
            @click="swapFloorsButton"
        >swap floors</button>
        <label
            v-if="uniqueUpstairs.includes(guestName) || uniqueDownstairs.includes(guestName)"
        >
            <input
            v-model="lockGuest"
            type="checkbox"
        />
            <span
                title="Keeps the guest in place during a floor swap."
            >Lock guest position</span>
        </label>
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
                    <div v-if="!moveName">
                        <button
                            @click="moveArtistToOtherFloorCancel"
                        >Cancel</button>
                    </div>
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
        <featured-manager
            :artists="artists"
            :manage="manage.feat"
            :unique-upstairs="uniqueUpstairs"
            :unique-downstairs="uniqueDownstairs"
            @replace-artists="replaceArtists($event)"
        >
        </featured-manager>
    </div>
    <div class="manager-box">
        <h3 class="flat">
            <span>
                {{displayFloor('up')}} ({{artists.up.length / 2}})
            </span>
            <button
                v-show="!manage.up"
                @click="manage.up=true; manage.down=false;"
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
            @click="manage.down=true; manage.up=false;"
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
    <p>
        <button
            @click=""
            disabled
        >Save</button>
        <button
            @click=""
            disabled
        >Revert</button>
        <button
            @click=""
            disabled
        >Quit</button>
    </p>
    <p>
        <button
            @click=""
            disabled
        >Get Shareable Link</button>
        <button
            @click=""
            disabled
        >Download Maps</button>
    </p>
    <div
        class="svg_preview"
    >
        <map-preview
            :manage-up="manage.up"
            :manage-down="manage.down"
            :artists="artists"
            :label="getLongLabel(rotationLabel)"
        ></map-preview>
    </div>
</div>
`
});
