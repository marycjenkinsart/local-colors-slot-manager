Vue.component('name-manager', {
	mixins: [
		mixins,
	],
	props: {
		floorName: {
			type: String,
			require: true,
		},
	},
	data: function () {
		return {
			lockGuest: true,
			listColors: false,
			// lockColors: false,
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
		};
	},
	computed: {
		artists: function () {
			return this.$store.getters.artists;
		},
		nameList: function () {
			return this.artists[this.floorName];
		},
		guestName: function () {
			return this.$store.getters.guestNameString;
		},
		showCircles: function () {
			return this.$store.getters.showCircles;
		},
		advancedModeOn: function () {
			return this.$store.getters.advancedModeOn;
		},
		legacyModeOn: function () {
			return this.$store.getters.templateInfo.legacyMode;
		},
		manageMe: function () {
			return this.$store.getters.manageWhich === this.floorName;
		},
		featTemplateFloorInfo: function () {
			return this.$store.getters.templateInfo['feat'];
		},
		featTemplateBaseOptions: function () {
			return Object.keys(templates['feat']);
		},
		showFeaturedExtras: function () {
			return this.$store.getters.featuredExtras;
		},
		templateFloorInfo: function () {
			return this.$store.getters.templateInfo[this.floorName];
		},
		snapOn: function () {
			return this.$store.getters.snapOn[this.floorName];
		},
		templateBaseOptions: function () {
			return Object.keys(templates[this.floorName]);
		},
		slotCount: function () {
			return this.nameList.length / 2;
		},
		hasGuestArtist: function () {
			return this.nameList.includes(this.guestName);
		},
		fancyNameList: function () {
			return makeFloorFancy(this.nameList);
		},
		artistPar: function () {
			return this.$store.getters.artistPar[this.floorName];
		},
		halfSlotSize: function () {
			return this.$store.getters.naiveHalfSlotLengths[this.floorName][0].size;
		},
		// slot size analyses
		fullSlotSizeInches: function () {
			return templateNumberToInches(this.halfSlotSize * 2).toFixed(0);
		},
		fullSlotSizeReport: function () {
			return getSlotSizeParReport(this.fullSlotSizeInches, 144);
		},
		featLinesTotalInches: function () {
			var raw = this.$store.getters.featLinesTotal;
			var inches = templateNumberToInches(raw).toFixed(0);
			return inches;
		},
		featuredSizeReport: function () {
			return getSlotSizeParReport(this.featLinesTotalInches, this.fullSlotSizeInches);
		},
		forbiddenNewNames: function () {
			var unique = this.nameList.filter(getUnique);
			var oldIndex = unique.indexOf(this.editName.oldName);
			unique.splice(oldIndex,1);
			return unique;
		},
		checkForbiddenNew: function () {
			if (
				this.thisFloorUniqueArtists.includes(this.newName.newName)
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
			forbiddenChars.forEach(function (char) {
				if (newName.includes(char)) {
					result = true;
				}
			})
			return result;
		},
		checkForbiddenCharNewName: function () {
			var result = false;
			var newName = this.newName.newName || '';
			forbiddenChars.forEach(function (char) {
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
		thisFloorUniqueArtists: function () {
			return this.nameList.filter(getUnique);
		},
		slotColors: function () {
			var lookup = 'count' + this.thisFloorUniqueArtists.length;
			return colorMap[lookup];
		},
		adjustments: function () {
			var halfSlotCount = 2 * this.slotCount;
			return this.$store.getters.templateInfo[this.floorName].adjustments[halfSlotCount] || [];
		},
	},
	methods: {
		resetAdjustments: function () {
			this.$store.dispatch('resetAdjustments',this.floorName);
		},
		setAdjustment: function (index, value) {
			var newAdjustments = clone(this.adjustments);
			newAdjustments[index] = value;
			var args = {
				floorName: this.floorName,
				adjustments: newAdjustments,
				halfSlotCount: this.adjustments.length,
			}
			this.$store.dispatch('updateAdjustments',args);
		},
		adjustAdjustment: function (index, direction) {
			var newAdjustments = clone(this.adjustments);
			newAdjustments[index] += direction * 3;
			var args = {
				floorName: this.floorName,
				adjustments: newAdjustments,
				halfSlotCount: this.adjustments.length,
			}
			this.$store.dispatch('updateAdjustments',args);
		},
		toggleAdvancedMode: function () {
			this.$store.dispatch('toggleAdvancedMode');
		},
		togglelegacyMode: function () {
			this.$store.dispatch('togglelegacyMode');
		},
		updateFloor: function (floor) {
			var artistsObject = clone(this.artists);
			artistsObject[this.floorName] = floor;
			this.$store.dispatch('updateArtistsObject',artistsObject);
		},
		getArtistColorByName: function (name) {
			// var thisFloorUniqueArtists = this.lockColors ? this.thisFloorUniqueArtists.sort() : this.thisFloorUniqueArtists
			// TODO: re-enable above, but only if you make the preview maps support this, too
			var unique = this.thisFloorUniqueArtists;
			var colorIndex = unique.findIndex(function (uniqueName) {
				return name === uniqueName;
			});
			var result = '';
			result = this.slotColors[colorIndex];
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
			this.updateFloor(newFloor);
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
			this.updateFloor(newFloor);
		},
		makeSlotCountPretty: makeSlotCountPretty,
		makePrintName: makePrintName,
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
			this.updateFloor(newFloor);
		},
		expandArtist: function (slotIndex) {
			var newFloor = this.nameList.slice();
			newFloor.splice(slotIndex,0,newFloor[slotIndex]);
			this.updateFloor(newFloor);
		},
		exciseGuests: function (array) {
			var newArray = array.slice();
			var guestIndices = [];
			var guestName = this.guestName;
			if (this.lockGuest) {
				newArray.forEach(function (name, index) {
					if (name === guestName) {
						guestIndices.push(index);
					}
				})
				newArray = array.filter(function (name) {
					return name !== guestName;
				})
			}
			return {
				array: newArray,
				indices: guestIndices,
			} // unfancy only
		},
		restoreGuests: function (array, indices) {
			// assumes the guest's slots are contiguous
			var guestIndices = indices || [];
			var newArray = array.slice();
			var guestName = this.guestName;
			if (guestIndices.length > 0) {
				var guestCount = guestIndices.length;
				var guestMin = guestIndices[0]
				guestIndices.forEach(function (curr) {
					guestMin = Math.min(curr, guestMin);
				})
				for (var i = 0; i < guestCount; i++) {
					newArray.splice(guestMin, 0, guestName);
				}
			}
			return newArray; // unfancy only
		},
		rotateFloorCCW: function () {
			var surgery = this.exciseGuests(this.nameList.slice());
			var guestIndices = surgery.indices;
			var newFloor = surgery.array;
			newFloor = this.rotateArrayCCW(newFloor);
			newFloor = this.restoreGuests(newFloor, guestIndices);
			this.updateFloor(newFloor);
		},
		rotateFloorCW: function () {
			var surgery = this.exciseGuests(this.nameList.slice());
			var guestIndices = surgery.indices;
			var newFloor = surgery.array;
			newFloor = this.rotateArrayCW(newFloor);
			newFloor = this.restoreGuests(newFloor, guestIndices);
			this.updateFloor(newFloor);
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
		moveArtistChunky: function (slotIndex, direction) {
			var newFloor = this.nameList.slice()
			var exciseGuest = this.lockGuest && newFloor.includes(this.guestName);
			newFloor = moveNameChunky(
				slotIndex,
				newFloor,
				direction,
				exciseGuest ? this.guestName : null
			);
			this.updateFloor(newFloor);
		},
		getSwapMessage: function (fancyIndex) {
			var targetArtist = this.fancyNameList[fancyIndex].name;
			var neighborArtist = this.nameList[this.findDownNeighbor(fancyIndex)];
			var message = 'swap ' + targetArtist + ' and ' + neighborArtist;
			return message;
		},
		attemptArtistMove: function () {
			this.artistTransfer.attempt = true;
		},
		toggleCornerSnap: function () {
			this.$store.dispatch('toggleCornerSnap',this.floorName);
		},
		toggleSnapCircles: function () {
			this.$store.dispatch('toggleSnapCircles');
		},
		changeCornerSnapThreshold: function (value) {
			this.$store.dispatch('changeCornerSnapThreshold',{
				floorName: this.floorName,
				value: value,
			});
		},
		setSelectedTemplateBase: function (value) {
			this.$store.dispatch('setSelectedTemplateBase',{
				floorName: this.floorName,
				value: value,
			});
		},
		setSelectedFeatTemplateBase: function (value) {
			this.$store.dispatch('setSelectedTemplateBase',{
				floorName: 'feat',
				value: value,
			});
		},
		goToHistoryInsert: function (floor) {
			scrollToTop();
			this.$store.dispatch('historySetSelectedFloor', floor);
			this.$router.push({
				path: '/insert',
				query: this.$route.query,
			});
		},
	},
	template: /*html*/`
<div class="name-manager">
	<div v-if="!manageMe">
		<ul>
			<li
				v-for="(artist, index) in fancyNameList"
			>
				<span class="artist-name">{{makePrintName(artist.name, artist.slotSize)}}</span>
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
						|| checkForbiddenCharNewName
						|| checkEmptyNew
					"
					type="submit"
				>OK</button>
			</p>
			<p v-if="!checkForbiddenNew && !checkForbiddenCharNewName">
				<span>TIP: keep the display name reasonably short!</span>
			</p>
			<p v-if="checkForbiddenNew">
				<span
					class="warning"
				>"{{newName.newName}}" is the name of another artist! Please make the new name unique!</span>
			</p>
			<p v-if="checkForbiddenCharNewName">
				<span
					class="warning"
				>"{{newName.newName}}" contains forbidden character: {{identifyForbiddenChar(newName.newName)}}</span>
			</p>
		</form>
	</div>
	<div
		class="manager-inner"
		v-if="manageMe && !editName.editing && !newName.editing && !artistTransfer.attempt"
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
						title="Turns on colored labels in the list below"
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
									title="move artist clockwise"
									@click="moveArtistChunky(artist.indices[0], 1)"
								>↓</button>
								<button
								title="move artist counter-clockwise"
									@click="moveArtistChunky(artist.indices[0], -1)"
								>↑</button>
							</td>
							<td class="table_second">
								<span
									class="artist-name"
									:class="
										listColors
										? getArtistColorByName(artist.name)
										: ''
									"
								>{{artist.name}}</span>
								<button
									:disabled="artist.name === guestName"
									@click="editNameStart(artist.name)"
									title="change the artist's name"
								>edit</button>
								<span
									:title="overParSummaryDisplay(artistPar[artist.name].slotTotal,artistPar[artist.name].par)"
									v-if="!legacyModeOn"
									class="medium-mini"
									:class="getDisplayInches(artistPar[artist.name].overPar).includes('+') ? 'green' : 'red'"
								>{{getDisplayInches(artistPar[artist.name].overPar)}}</span>
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
								>{{makeSlotCountPretty(artist.slotSize)}} slot</span><span
									v-if="artist.slotSize > 1"
									class="medium-mini"
								>s</span>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
			<p>
				<button
					title="Use the history view to insert these names."
					@click="goToHistoryInsert(floorName)"
					class="unflat"
				>Insert current names via history view</button>
			</p>
			<div
				class="unflat"
			>
				<table
					class="bare-table"
				>
					<tbody>
						<tr>
							<td class="right">Full slot:</td>
							<td>{{fullSlotSizeReport.inches}}"</td>
							<td>({{fullSlotSizeReport.feet}}')</td>
						</tr>
						<tr>
							<td
								class="right"
								:class="fullSlotSizeReport.color"
							></td>
							<td>
								<span>144"</span>
								<span
									:class="fullSlotSizeReport.color"
								>{{fullSlotSizeReport.inchesOverParPrint}}</span>
							</td>
							<td>
								<span>(12'</span>
								<span
									:class="fullSlotSizeReport.color"
								>{{fullSlotSizeReport.feetOverParPrint}}</span><span>)</span>
							</td>
							<td
								:class="fullSlotSizeReport.color"
							>{{fullSlotSizeReport.percent}}%</td>
						</tr>
						<tr
							v-if="floorName === 'up' && showFeaturedExtras"
						>
							<td class="right">Featured:</td>
							<td>
								<span>{{featuredSizeReport.inches}}"</span>
							</td>
							<td>
								<span>({{featuredSizeReport.feet}})'</span>
							</td>
						</tr>
						<tr
							v-if="floorName === 'up' && showFeaturedExtras"
						>
							<td class="right green"></td>
							<td>
								<span>{{fullSlotSizeReport.inches}}"</span>
								<span
									:class="featuredSizeReport.color"
								>{{featuredSizeReport.inchesOverParPrint}}</span>
							</td>
							<td>
								<span>({{fullSlotSizeReport.feet}}</span>
								<span
									:class="featuredSizeReport.color"
								>
									{{featuredSizeReport.feetOverParPrint}}</span><span>)</span>
							</td>
							<td
								:class="featuredSizeReport.color"
							>{{featuredSizeReport.percent}}%</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				class="manager-inner-inner"
			>
				<p
					class="red"
				>
					<span>Show advanced edge control:</span>
					<button
						v-if="!advancedModeOn"
						@click="toggleAdvancedMode"
					>Show</button>
					<button
						v-if="advancedModeOn"
						@click="toggleAdvancedMode"
					>Hide</button>
				</p>
				<div
					v-show="advancedModeOn"
				>
					<p>
						<label>
							<span
								title="Use the old 'rigid' handmade templates"
							>Legacy mode: </span>
							<input
								type="checkbox"
								:checked="legacyModeOn"
								@input="togglelegacyMode"
							/>
						</label>
					</p>
					<p>
						<label>
							<span
								:class="legacyModeOn ? 'pretend-disabled' : ''"
								title="Choose which wall flow to use"
							>Template base: </span>
							<select
								:disabled="legacyModeOn"
								:value="templateFloorInfo.selectedTemplateBase"
								@input="setSelectedTemplateBase($event.target.value)"
							>
								<option
									v-for="templateName in templateBaseOptions"
								>{{templateName}}</option>
							</select>
						</label>
					</p>
					<p
						v-if="floorName === 'up' && showFeaturedExtras"
					>
						<label>
							<span
								:class="legacyModeOn ? 'pretend-disabled' : ''"
								title="Choose which wall flow to use for featured space)"
							>Template base (featured): </span>
							<select
								:disabled="legacyModeOn"
								:value="featTemplateFloorInfo.selectedTemplateBase"
								@input="setSelectedFeatTemplateBase($event.target.value)"
							>
								<option
									v-for="featTemplateName in featTemplateBaseOptions"
								>{{featTemplateName}}</option>
							</select>
						</label>
					</p>
					<p>
						<label>
							<span
								:class="legacyModeOn ? 'pretend-disabled' : ''"
								title="Control snapping to corners"
							>Snap: </span>
							<input
								type="checkbox"
								:disabled="legacyModeOn"
								:checked="snapOn"
								@input="toggleCornerSnap"
							/>
						</label>
						<label
							style="margin-left: 8px;"
						>
							<span
								:class="legacyModeOn ? 'pretend-disabled' : ''"
								title="Slot 'islands' smaller than this will be snapped to the nearest edge"
							>Threshold (inches): </span>
							<input
								class="threshold-inches"
								type="number"
								:disabled="legacyModeOn"
								:value="templateFloorInfo.snapInches"
								@input="changeCornerSnapThreshold($event.target.value)"
							/>
						</label>
					</p>
					<p>
						<span
							title="Adjust half slot edges manually (including fused edges)"
							:class="legacyModeOn ? 'pretend-disabled' : ''"
						>Tune edges:</span>
						<button
							v-if="!showCircles"
							:disabled="legacyModeOn"
							@click="toggleSnapCircles"
						>Show</button>
						<button
							v-if="showCircles"
							:disabled="legacyModeOn"
							@click="toggleSnapCircles"
						>Hide</button>
					</p>
					<p
						v-if="!legacyModeOn && showCircles"
					>
						<table>
							<tbody>
								<template
									v-for="(adjustment, index) in adjustments"
								>
									<tr
										v-if="index !== adjustments.length - 1"
										:class="
											nameList[index] !== nameList[index+1]
											? 'white-bg'
											: ''
										"
									>
										<td>
											<span
												:class="
													nameList[index] !== nameList[index+1]
													? 'artist-name ' + getArtistColorByName(nameList[index])
													: 'pretend-disabled'
												"
											>{{nameList[index]}}</span>
										</td>
										<td>
											<button
												title="Give previous artist less space"
												@click="adjustAdjustment(index, -1)"
											>←</button>
										</td>
										<td
											class="center"
											:class="
												nameList[index] === nameList[index+1]
												? 'pretend-disabled'
												: ''
											"
										
											style="width: 35px;"
										>
											{{adjustment}}"
										</td>
										<td>
											<button
												title="Give previous artist more space"
												@click="adjustAdjustment(index, 1)"
											>→</button>
										</td>
										<td>
											<span
												:class="
													nameList[index] !== nameList[index+1]
													? 'artist-name ' + getArtistColorByName(nameList[index + 1])
													: 'pretend-disabled'
												"
											>{{nameList[index+1]}}</span>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
						<button
							class="unflat"
							title="Set each value to 0"
							v-if="showCircles"
							:disabled="legacyModeOn"
							@click="resetAdjustments"
						>Reset edge tuning</button>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
`
});
