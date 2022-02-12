Vue.component('name-manager', {
	mixins: [
		mixins,
	],
	data: function () {
		return {
			lockGuest: true,
			listColors: false,
			editName: {
				editing: false,
				oldName: '',
				newName: '',
			},
			newName: {
				editing: false,
				newName: '',
			},
			artistTransfer: {
				attempt: false,
			},
			guestName: this.guestNameString || 'GUEST',
			// shift: 0,
		};
	},
	props: {
		nameList: {
			type: Array,
			require: true,
		},
		floorName: {
			type: String,
			require: true,
		},
		manage: {
			type: Boolean,
			require: true,
		},
		guestNameString: {
			type: String,
			require: false,
		},
	},
	computed: {
		slotCount: function () {
			return this.nameList.length / 2;
		},
		hasGuestArtist: function () {
			return this.nameList.includes(this.guestName);
		},
		fancyNameList: function () {
			return this.makeFancy(this.nameList);
		},
		forbiddenNewNames: function () {
			var unique = this.nameList.filter(this.getUnique);
			var oldIndex = unique.indexOf(this.editName.oldName);
			unique.splice(oldIndex,1);
			return unique;
		},
		checkForbiddenNew: function () {
			if (
				this.forbiddenNewNames.includes(this.newName.newName)
			) {
				return true;
			} else {
				return false;
			}
		},
		checkEmptyNew: function () {
			if (!this.newName.newName) {
				return true;
			} else {
				return false;
			}
		},
		checkForbiddenDouble: function () {
			if (
				this.editName.oldName != this.editName.newName
				&& this.forbiddenNewNames.includes(this.editName.newName)
			) {
				return true;
			} else {
				return false;
			}
		},
		checkForbiddenChar: function () {
			var result = false;
			var newName = this.editName.newName || '';
			this.forbiddenChars.forEach(function (char) {
				if (newName.includes(char)) {
					result = true;
				}
			})
			return result;
		},
		checkEmptyEdit: function () {
			if (!this.editName.newName) {
				return true;
			} else {
				return false;
			}
		},
		uniqueArtists: function () {
			var result = this.nameList.filter(this.getUnique);
			return result;
		},
		slotColors: function () {
			var lookup = 'count' + this.uniqueArtists.length;
			return this.colorMap[lookup];
		},
	},
	methods: {
		getArtistColorByName: function (name) {
			var colorIndex = this.uniqueArtists.findIndex(function (uniqueName) {
				return name === uniqueName;
			});
			var result = '';
			if (this.listColors) {
				result = this.slotColors[colorIndex];
			}
			return result;
		},
		editNameStart: function (name) {
			this.editName.editing = true;
			this.editName.oldName = name;
			this.$nextTick(function () {
				var inputElement = this.$refs['editNameInput'];
				inputElement.focus();
			})
		},
		editNameCancel: function () {
			this.editName.editing = false;
			this.editName.oldName = '';
			this.editName.newName = '';
		},
		editNameSubmit: function () {
			var newFloor = [];
			var oldName = this.editName.oldName;
			var newName = this.editName.newName;
			this.nameList.forEach(function (name) {
				if (name === oldName) {
					newFloor.push(newName);
				} else {
					newFloor.push(name);
				}
			})
			this.editNameCancel();
			this.$emit('replace-floor', newFloor);
		},
		newNameStart: function () {
			this.newName.editing = true;
			this.$nextTick(function () {
				var inputElement = this.$refs['newNameInput'];
				inputElement.focus();
			})
		},
		newNameCancel: function () {
			this.newName.editing = false;
			this.newName.newName = '';
		},
		newNameSubmit: function () {
			var newFloor = this.nameList.slice();
			var name = this.newName.newName;
			newFloor.push(name);
			newFloor.push(name);
			this.newNameCancel();
			this.$emit('replace-floor', newFloor);
		},
		// detectWrapping: function (array) {
		//	 var first = array[0];
		//	 var last = array[array.length-1];
		//	 var result = false;
		//	 if (first === last) {
		//		 result = true;
		//	 }
		//	 return result;
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
			var upIndices = this.getContiguousIndices(this.findUpNeighbor(slotIndex));
			var moveCount = upIndices.length;
			var workingIndex; // ewww
			var self = this;
			indices.forEach(function (movingPiece) {
				workingIndex = movingPiece;
				for (let index = 0; index < self.shift; index++) {
					workingIndex = self.findUpIndex(workingIndex);
				}
				for (let index = 0; index < moveCount; index++) {
					newFloor = self.moveOneSlotUp(workingIndex, newFloor);
					workingIndex = self.findUpIndex(workingIndex);
				}
			})
			this.$emit('replace-floor', newFloor);
		},
		getSwapMessage: function (fancyIndex) {
			var targetArtist = this.fancyNameList[fancyIndex].name;
			var neighborArtist = this.nameList[this.findDownNeighbor(fancyIndex)];
			return `swap ${targetArtist} and ${neighborArtist}`
		},
		attemptArtistMove: function (artistName) {
			this.artistTransfer.attempt = true;
		},
	},
	template: /*html*/`
<div class="name-manager">
	<div v-if="!manage">
		<ul>
			<li
				v-for="(artist, index) in fancyNameList"
			>
				<span class="artist-name">{{artist.name}}</span>
				<span
					v-if="artist.slotSize != 1"
				> ({{getDisplaySlotSize(artist.slotSize)}})</span>
			</li>
		</ul>
	</div>
	<div
		v-if="editName.editing"
		class="manager-inner round-and-shadow"
	>
		<form
			@submit.prevent="editNameSubmit"
		>
			<p>
				<span>New name for</span>
				<span class="artist-name">"{{editName.oldName}}":</span>
			</p>
			<p>
				<input
					v-model="editName.newName"
					type="text"
					ref="editNameInput"
				/>
			</p>
			<p>
				<button
					@click="editNameCancel"
					type="button"
				>Cancel</button>
				<button
					:disabled="
						editName.oldName === editName.newName
						|| checkForbiddenDouble
						|| checkForbiddenChar
						|| checkEmptyEdit
					"
					type="submit"
				>OK</button>
			</p>
			<p v-if="!checkForbiddenDouble && !checkForbiddenChar">
				<span>TIP: keep the display name reasonably short!</span>
			</p>
			<p v-if="checkForbiddenDouble">
				<span
					class="warning"
				>"{{editName.newName}}" is the name of another artist! Please make the new name unique!</span>
			</p>
			<p v-if="checkForbiddenChar">
				<span
					class="warning"
				>"{{editName.newName}}" contains forbidden character: {{identifyForbiddenChar(editName.newName)}}</span>
			</p>
		</form>
	</div>
	<div
		v-if="artistTransfer.attempt"
		class="manager-inner round-and-shadow"
	>
		<form
			@submit.prevent="artistTransfer.attempt = false"
		>
			<p>Moving an artist to the opposite floor is currently handled on the overall view, not the floor view.</p>
			<p>
				<button
					type="submit"
				>OK</button>
			</p>
		</form>
	</div>
	<div
		v-if="newName.editing"
		class="manager-inner round-and-shadow"
	>
		<form
			@submit.prevent="newNameSubmit"
		>
			<p>
				<span>New artist's name:</span>
			</p>
			<p>
				<input
					v-model="newName.newName"
					type="text"
					ref="newNameInput"
				/>
			</p>
			<p>
				<button
					@click="newNameCancel"
					type="button"
				>Cancel</button>
				<button
					:disabled="
						checkForbiddenNew
						|| checkEmptyNew
					"
					type="submit"
				>OK</button>
			</p>
			<p v-if="!checkForbiddenNew">
				<span>TIP: keep the display name reasonably short!</span>
			</p>
			<p v-if="checkForbiddenNew">
				<span
					class="warning"
				>"{{newName.newName}}" is the name of another artist! Please make the new name unique!</span>
			</p>
		</form>
	</div>
	<div
		class="manager-inner"
		v-if="manage && !editName.editing && !newName.editing && !artistTransfer.attempt"
	>
		<div>
			<p>
				<button
					title="Rotate counter-clockwise"
					@click="rotateFloorCCW"
				>↑ Rotate ½ slot</button>
				<button
					title="Rotate clockwise"
					@click="rotateFloorCW"
				>Rotate ½ slot ↓</button>
				<button
					title="Add a new artist and choose their name"
					@click="newNameStart"
				>Add Artist</button>
			</p>
			<p
				v-if="hasGuestArtist"
			>
				<label>
					<span
						title="Keeps the guest in place during a rotation"
					>Lock guest position: </span>
					<input
						v-model="lockGuest"
						type="checkbox"
					/>
				</label>
			</p>
			<p>
				<label>
					<span
						title="Turns on colored labels"
					>Colors: </span>
					<input
						v-model="listColors"
						type="checkbox"
					/>
				</label>
			</p>
			<table class="whole">
				<tbody>
					<template
					v-for="(artist, index) in fancyNameList"
					>
						<tr class="zebra">
							<td class="table_first">
								<button
									@click="rotateArtistUp(findDownNeighbor(index))"
								>↓</button>
								<button
									@click="rotateArtistUp(artist.slotIndex)"
								>↑</button>
							</td>
							<td class="table_second">
								<span
									class="artist-name"
									:class="getArtistColorByName(artist.name)"
								>{{artist.name}}</span>
								<button
									:disabled="artist.name === guestName"
									@click="editNameStart(artist.name)"
									title="change the artist's name"
								>edit</button>
							</td>
							<td class="table_third">
								<button
									title="Reduce artist slot size"
									@click="reduceArtist(artist.slotIndex)"
								>–</button>
								<button
									title="Increase artist slot size"
									@click="expandArtist(artist.slotIndex)"
								>+</button>
								<span
									class="medium-mini"
								>{{getDisplaySlotSize(artist.slotSize)}} slot</span><span
									v-if="artist.slotSize > 1"
									class="medium-mini"
								>s</span>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</div>
`
});
