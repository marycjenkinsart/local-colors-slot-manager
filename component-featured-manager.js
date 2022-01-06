Vue.component('featured-manager', {
	mixins: [
		mixins,
	],
    props: {
        artists: {
            type: Object,
            require: true,
        },
        manage: {
            type: Boolean,
            require: true,
        },
        uniqueUpstairs: {
            type: Array,
            require: true,
        },
        uniqueDownstairs: {
            type: Array,
            require: true,
        },
    },
    data: function () {
        return {
            warning: '',
            adding2D: false,
            adding3D: false,
            addingGroup: false,
            move2D: '',
            message: '',
        };
    },
    computed: {
        only2D: function () {
            var result = [];
            this.artists.feat.forEach(function (artist) {
                if (artist.type === '2D') {
                    result.push(artist);
                }
            })
            return result;
        },
        only3D: function () {
            var result = [];
            this.artists.feat.forEach(function (artist) {
                if (artist.type === '3D') {
                    result.push(artist);
                }
            })
            return result;
        },
        onlyGroup: function () {
            var result = [];
            this.artists.feat.forEach(function (artist) {
                if (artist.type === 'group') {
                    result.push(artist);
                }
            })
            return result;
        },
        moveFloor: function () {
            var splits = this.move2D.split('-');
            var target = splits[0];
            return target || '';
        },
        moveName: function () {
            var splits = this.move2D.split('-');
            return splits[1] || '';
        }
        // displayFeatured: function () {
        //     var result = 'No featured artists found!'
        //     var featureds = this.artists.feat
        //     if (featureds.length > 0) {
        //         result = featureds[0].name;
        //     }
        //     if (featureds.length > 1) {
        //         for (let index = 1; index < featureds.length; index++) {
        //             result += ', ' + featureds[index].name;
        //         }
        //     }
        //     return result;
        // },
    },
    methods: {
        removeArtist: function (artistName) {
            var newObject = JSON.parse(JSON.stringify(this.artists));
            var newFeatured = [];
            newObject.feat.forEach(function (artist) {
                if (artist.name != artistName) {
                    newFeatured.push(artist);
                }
            })
            newObject.feat = newFeatured;
            this.$emit('replace-artists', newObject);
        },
        moveArtistToFloor: function (artistName, floor) {
            var newObject = JSON.parse(JSON.stringify(this.artists));
            var newFeatured = [];
            var halfSlotCount = 0;
            newObject.feat.forEach(function (artist) {
                if (artist.name === artistName) {
                    halfSlotCount = artist.origSlotSize * 2;
                } else {
                    newFeatured.push(artist);
                }
            })
            newObject.feat = newFeatured;
            for (let index = 0; index < halfSlotCount; index++) {
                newObject[floor].push(artistName);
            }
            this.$emit('replace-artists', newObject);
        },
        add2Dartist: function () {
            this.adding2D = true;
        },
        move2Dcancel: function () {
            this.adding2D = false;
            this.move2D = '';
        },
        move2Dconfirm: function () {
            var newObject = JSON.parse(JSON.stringify(this.artists));
            var slotSize = 0;
            var newFloor = [];
            var self = this
            newObject[this.moveFloor].forEach(function (halfSlot) {
                if (halfSlot === self.moveName) {
                    slotSize += 0.5;
                } else {
                    newFloor.push(halfSlot);
                }
            })
            newObject[this.moveFloor] = newFloor;
            newObject.feat.push({
                name: this.moveName,
                type: '2D',
                origSlotSize: slotSize,
            })
            this.message = this.moveName + ' added to the featured show!';
            this.$emit('replace-artists', newObject);
            this.move2Dcancel();
        },
        add3Dartist: function () {
            
        },
        addGroupShow: function () {
            
        },
    },
    template: /*html*/`
<div class="featured-manager">
    <div v-if="!manage">
        <ul>
            <li
                v-for="(artist, index) in artists.feat"
            >
                <span class="artist-name">{{artist.name}}</span>
            </li>
        </ul>
    </div>
    <div
        v-if="message"
        class="manager-inner round-and-shadow"
    >
        <p>{{message}}</p>
        <p>
            <button
                @click="message=''"
            >Ok</button>
        </p>
    </div>
    <div
        v-if="adding2D || adding3D || addingGroup"
        class="manager-inner round-and-shadow"
    >
        <div v-if="adding2D">
            <p>Move which artist to the featured show?</p>
            <p>
                <select
                    v-model="move2D"
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
            <div v-if="move2D">
                <p>Remove <strong>{{moveName}}</strong> from the {{moveFloor}}stairs to add to the featured show?</p>
                <p>
                    <button
                        @click="move2Dcancel"
                    >Cancel</button>
                    <button
                        @click="move2Dconfirm"
                    >Ok</button>
                </p>
            </div>
        </div>
    </div>
    <div 
        class="manager-inner"
        v-if="
            !adding2D && !adding3D && !addingGroup && !message
            && manage
        "
    >
        <p>
            <button
                @click="add2Dartist"
                title="Add an artist from the upstairs or downstairs rotation list"
                type="button"
            >add 2D/hybrid artist</button>
            <button
                disabled
                @click="add3Dartist"
                title="Add an artist that isn't in either 2D rotation list"
                type="button"
            >add 3D artist</button>
            <button
                disabled
                @click="addGroupShow"
                title="Make a group show with a custom name"
                type="button"
            >add group show</button>
        </p>
        <h3 v-if="only2D.length">2D / Hybrid Artists</h3>
        <table>
            <tbody>
                <tr
                    v-for="artist in only2D"
                >
                    <td>
                        <span class="artist-name">{{artist.name}}</span>
                    </td>
                    <td>
                        <button
                            :disabled="artist.type != '2D'"
                            :title="'Remove ' + artist.name + ' from the featured show and add to the upstairs list'"
                            @click="moveArtistToFloor(artist.name, 'up')"
                            type="button"
                        >move to upstairs</button>
                        <button
                            :disabled="artist.type != '2D'"
                            :title="'Remove ' + artist.name + ' from the featured show and add to the downstairs list'"
                            @click="moveArtistToFloor(artist.name, 'down')"
                            type="button"
                        >move to downstairs</button>
                        <button
                            :title="'Remove ' + artist.name + ' from the gallery altogether'"
                            @click="removeArtist(artist.name)"
                            type="button"
                        >remove from gallery</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <h3 v-if="only3D.length">3D Artists</h3>
        <table>
            <tbody>
                <tr
                    v-for="artist in only3D"
                >
                    <td>
                        <span class="artist-name">{{artist.name}}</span>
                    </td>
                    <td>
                        <button
                            :title="'Remove ' + artist.name + ' from the featured show'"
                            @click="removeArtist(artist.name)"
                            type="button"
                        >remove from featured show</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <p
        v-if="warning"
        class="warning"
    >{{warning}}</p>
</div>
`
});
