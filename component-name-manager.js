Vue.component('name-manager', {
    props: {
        nameList: {
            type: Array,
            require: true,
        },
        floorName: {
            type: String,
            require: true,
        },
        guestNameString: {
            type: String,
            require: false,
        }
    },
    data: function () {
        return {
            lockGuest: false,
            guestName: this.guestNameString || 'GUEST',
            // shift: 0,
        };
    },
    computed: {
        displayFloor: function () {
            var result = this.floorName + 'stairs'
            return result.toLocaleUpperCase();
        },
        slotCount: function () {
            return this.nameList.length / 2;
        },
        hasGuestArtist: function () {
            return this.nameList.includes(this.guestName);
        },
        fancyNameList: function () {
            return this.makeFancy(this.nameList);
        },
    },
    methods: {
        // detectWrapping: function (array) {
        //     var first = array[0];
        //     var last = array[array.length-1];
        //     var result = false;
        //     if (first === last) {
        //         result = true;
        //     }
        //     return result;
        // },
        getDisplaySlotSize: function (slotSize) {
            var result = JSON.stringify(slotSize);
            result = result.replace('.5', '½').replace('0','');
            return result;
        },
        getArtistSlotCount: function (artistName) {
            var tally = 0;
            this.nameList.forEach(function (halfSlot) {
                if (halfSlot === artistName) {
                    tally += 0.5;
                }
            })
            return tally;
        },
        makeFancy: function (array) {
            var result = [];
            var latest = '';
            array.forEach(function (halfSlot, index) {
                if (latest === halfSlot) {
                    result[result.length-1].slotSize += 0.5;
                } else {
                    result.push(
                        {
                            name: halfSlot,
                            slotSize: 0.5,
                            slotIndex: index
                        }
                    );
                    latest = halfSlot;
                }
            })
            result.forEach(function (artistObject) {
                var indices = [];
                array.forEach(function (halfSlot, index) {
                    if (artistObject.name === halfSlot) {
                        indices.push(index);
                    }
                })
                artistObject.indices = indices;
            })
            // actually need index for actual slot being selected
            return result;
        },
        makeUnfancy: function (array) {
            var result = [];
            array.forEach(function (object) {
                var halfSlots = object.slotSize * 2;
                for (let index = 0; index < halfSlots; index++) {
                    result.push(object.name);
                }
            })
            return result;
        },
        reduceArtist: function (slotIndex) {
            var newFloor = this.nameList.slice();
            newFloor.splice(slotIndex,1);
            this.$emit('replace-floor', newFloor);
        },
        expandArtist: function (slotIndex) {
            var newFloor = this.nameList.slice();
            newFloor.splice(slotIndex,0,newFloor[slotIndex]);
            this.$emit('replace-floor', newFloor);
        },
        exciseGuests: function (unfancyArray) {
            var array = unfancyArray.slice();
            var guestIndices = [];
            if (this.lockGuest) {
                while (array.includes(this.guestName)) {
                    var guestIndex = array.indexOf(this.guestName);
                    guestIndices.push(guestIndex);
                    array.splice(guestIndex,1);
                }
            }
            return {
                array: array,
                indices: guestIndices,
            } // unfancy only
        },
        restoreGuests: function (array, indices) {
            var guestIndices = indices.slice();
            var newArray = array.slice();
            while (guestIndices.length > 0) {
                var currentIndex = guestIndices.pop();
                newArray.splice(currentIndex,0,this.guestName);
                }
            return newArray; // unfancy only
        },
        rotateFloorCCW: function () {
            var surgery = this.exciseGuests(this.nameList.slice());
            var guestIndices = surgery.indices;
            var newFloor = surgery.array;
            newFloor = this.rotateArrayCCW(newFloor);
            newFloor = this.restoreGuests(newFloor, guestIndices);
            this.$emit('replace-floor', newFloor);
        },
        rotateFloorCW: function () {
            var surgery = this.exciseGuests(this.nameList.slice());
            var guestIndices = surgery.indices;
            var newFloor = surgery.array;
            newFloor = this.rotateArrayCW(newFloor);
            newFloor = this.restoreGuests(newFloor, guestIndices);
            this.$emit('replace-floor', newFloor);
        },
        rotateArrayCW: function (array) {
            var newArray = array.slice();
            newArray.unshift(newArray.pop());
            return newArray;
        },
        rotateArrayCCW: function (array) {
            var newArray = array.slice();
            newArray.push(newArray.shift());
            return newArray;
        },
        findUpIndex: function (index) {
            var result = index - 1;
            if (result === - 1) {
                result = this.nameList.length - 1;
            }
            return result;
        },
        findDownIndex: function (index) {
            var result = index + 1;
            if (result === this.nameList.length) {
                result = 0;
            }
            return result;
        },
        findUpNeighbor: function (index) {
            var currentName = this.nameList[index];
            var upIndex = this.findUpIndex(index);
            var upName = this.nameList[upIndex];
            while (currentName === upName) {
                upIndex = this.findUpIndex(upIndex);
                upName = this.nameList[upIndex];
            }
            return upIndex;
        },
        findDownNeighbor: function (fancyIndex) {
            var index = this.fancyNameList[fancyIndex].slotIndex;
            var currentName = this.nameList[index];
            var downIndex = this.findDownIndex(index);
            var downName = this.nameList[downIndex];
            while (currentName === downName) {
                downIndex = this.findDownIndex(downIndex);
                downName = this.nameList[downIndex];
            }
            return downIndex;
        },
        getContiguousIndices: function (index) { // slotIndex
            var testName = this.nameList[index];
            var resultCCW = [];
            var resultCW = [];
            var names = this.nameList;
            // check clockwise
            var testIndex = index;
            for (let index = 0; index < names.length; index++) {
                testIndex = this.findDownIndex(testIndex);
                if (names[testIndex] === testName) {
                    resultCCW.push(testIndex);
                } else if (names[testIndex] === this.guestName) {
                    continue
                } else {
                    break
                }
            }
            // check counter-clockwise
            testIndex = index;
            for (let index = 0; index < names.length; index++) {
                testIndex = this.findUpIndex(testIndex);
                if (names[testIndex] === testName) {
                    resultCW.push(testIndex);
                } else if (names[testIndex] === this.guestName) {
                    continue
                } else {
                    break
                }
            }
            resultCW.reverse();
            resultCW.push(index);
            var result = [].concat(resultCW, resultCCW);
            return result;
        },
        moveOneSlotUp: function (index, _array) {
            var array = _array || this.nameList.slice();
            var upIndex = index - 1;
            var splice = array.splice(index, 1);
            if (upIndex === -1) {
                var swap = array.pop();
                array.unshift(swap);
                array.push(splice[0]);
            } else {
                array.splice(upIndex, 0, splice[0]);
            }
            return array;
        },
        rotateArtistUp: function (slotIndex) {
            var newFloor = this.nameList.slice();
            var indices = this.getContiguousIndices(slotIndex);
            console.log(`contiguous indices: ${JSON.stringify(indices)}`);
            var upIndices = this.getContiguousIndices(this.findUpNeighbor(slotIndex));
            console.log(`up neighbor's contiguous indices: ${JSON.stringify(upIndices)}`);
            var moveCount = upIndices.length;
            var workingIndex; // ewww
            var self = this;
            indices.forEach(function (movingPiece) {
                workingIndex = movingPiece;
                console.log(`MOVING PIECE AT INDEX ${workingIndex}`)
                for (let index = 0; index < self.shift; index++) {
                    workingIndex = self.findUpIndex(workingIndex);
                }
                for (let index = 0; index < moveCount; index++) {
                    console.log(`moving from ${workingIndex}`)
                    newFloor = self.moveOneSlotUp(workingIndex, newFloor);
                    workingIndex = self.findUpIndex(workingIndex);
                    console.log(newFloor.slice());
                }
            })
            this.$emit('replace-floor', newFloor);
        }
    },
    template: /*html*/`
<div class="name-manager">
    <h3>
        <span>{{displayFloor}} ({{slotCount}})</span>
        
    </h3>
    <div>
        <p
            v-if="hasGuestArtist"
        >
            <label>
                <input
                v-model="lockGuest"
                type="checkbox"
            />
                <span>Lock guest artist position (floor rotation only)</span>
            </label>
        </p>
        <p class="artist-controls">
            <button
                class="third"
                @click="rotateFloorCCW"
                title="rotate counter-clockwise"
            >↑ Rotate</button>
            <button
            class="third"
                @click="rotateFloorCW"
                title="rotate clockwise"
            >Rotate ↓</button>
            <button
            class="third"
                @click=""
            >+ Add Artist</button>
        </p>
        <table class="artist-controls">
            <tbody>
                <template
                v-for="(artist, index) in fancyNameList"
                >
                    <tr class="whole">
                        <td class="center half">
                            <span class="artist-name">{{artist.name}}</span>
                        </td>
                        <td class="quarter">
                            <span
                                v-if="artist.slotSize != 1"
                            > ({{getDisplaySlotSize(artist.slotSize)}})</span>
                        </td>
                        <td class="center quarter">
                            <button
                                class="blue-button"
                                @click="reduceArtist(artist.slotIndex)"
                            >–</button>
                            <button
                                class="blue-button"
                                @click="expandArtist(artist.slotIndex)"
                            >+</button>
                        </td>
                    </tr>
                    <tr class="whole">
                        <td class="center">
                            <button
                                class="mini"
                                @click="rotateArtistUp(findDownNeighbor(index))"
                            >↑↓ Swap</button>
                        </td>
                        <td></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</div>
`
});
