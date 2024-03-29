var monthViewPage = Vue.component('month-view', {
	mixins: [
		mixins,
	],
	data: function () {
		return {
			lockGuest: true,
			move: {
				name: '',
				message: '',
			},
		}
	},
	computed: {
		rotation: function () {
			return this.$store.getters.rotation;
		},
		artists: function () {
			return this.rotation.artists;
		},
		rotationLabel: function () {
			return this.rotation.rotationLabel;
		},
		longLabel: function () {
			return getLongLabel(this.rotationLabel);
		},
		guestName: function () {
			return this.$store.getters.guestNameString;
		},
		manageLabel: function () {
			return this.$store.getters.manageLabel;
		},
		manageWhich: function () {
			return this.$store.getters.manageWhich;
		},
		uniqueArtists: function () {
			return {
				up: this.artists.up.filter(getUnique),
				down: this.artists.down.filter(getUnique),
			};
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
		compactURL: function () {
			return this.$store.getters.compactURL;
		},
		checkForbiddenLabel: function () {
			var result = false;
			var custom = this.rotationLabel.custom || '';
			forbiddenChars.forEach(function (char) {
				if (custom.includes(char)) {
					result = true;
				}
			})
			return result;
		},
	},
	methods: {
		replaceFloor: function (floorName, floorData) {
			var artists = clone(this.artists);
			artists[floorName] = floorData;
			this.replaceArtists(artists);
		},
		replaceArtists: function (artists) {
			this.$store.dispatch('updateArtistsObject',artists);
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
			this.$store.dispatch('updateArtistsObject',newArtists);
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
			newArtists.feat = clone(this.artists.feat);
			newArtists.up = downSansGuests;
			newArtists.down = upSansGuests;
			downGuestIndices.forEach(function (guestIndex) {
				newArtists.down.splice(guestIndex, 0, guestName);
			})
			upGuestIndices.forEach(function (guestIndex) {
				newArtists.up.splice(guestIndex, 0, guestName);
			})
			this.replaceArtists(newArtists);
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
			this.replaceFloor(otherFloor, strippedFloor);
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
		},
		editRotationNameStart: function () {
			this.$store.dispatch('setManageLabel',true);
		},
		editRotationNameEnd: function () {
			this.$store.dispatch('setManageLabel',false);
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
		manageThis: function (value) {
			this.moveArtistToOtherFloorCancel();
			this.$store.dispatch('manageThis',value);
		},
		returnToHub: function () {
			scrollToTop();
			this.$router.push({
				path: '/hub',
				query: this.$route.query,
			});
		},
	},
	template: /*html*/`
<div
	id="month-view"
>
	<my-header></my-header>
	<h2>
		<span>Rotation: {{longLabel}}</span>
	</h2>
	<p>
		<button
			:disabled="manageLabel"
			title="Change the label for this rotation"
			@click="editRotationNameStart"
		>edit rotation name</button>
	</p>
	<div
		v-if="manageLabel"
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
					:disabled="checkForbiddenLabel"
				>DONE</button>
			</p>
			<p v-if="checkForbiddenLabel">
				<span
					class="warning"
				>"{{rotationLabel.custom}}" contains forbidden character: {{identifyForbiddenChar(rotationLabel.custom)}}</span>
			</p>
		</div>
	</div>
		<p class="flat">
		<button
			title="Move all upstairs artists downstairs and vice versa"
			:disabled="!!move.name.length"
			@click="swapFloorsButton"
		>swap floors</button>
		<label
			v-if="uniqueArtists.up.includes(guestName) || uniqueArtists.down.includes(guestName)"
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
	<p>
		<span>move artist to opposite floor:</span>
		<select
			v-model="move.name"
		>
			<optgroup label="Upstairs">
				<option
					v-for="name in uniqueArtists.up"
					:value="'up-' + name"
				>{{name}}</option>
			</optgroup>
			<optgroup label="Downstairs">
				<option
					v-for="name in uniqueArtists.down"
					:value="'down-' + name"
				>{{name}}</option>
			</optgroup>
		</select>
	</p>
	<div
		v-if="move.name || move.message"
		class="manager-box"
	>
		<div
			class="manager-inner round-and-shadow"
		>
			<div v-if="!move.message">
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
				v-show="manageWhich !== 'feat'"
				@click="manageThis('feat')"
			>Manage</button>
			<button
				v-show="manageWhich === 'feat'"
				@click="manageThis('')"
			>DONE</button>
		</h3>
		<featured-manager>
		</featured-manager>
	</div>
	<div class="manager-box">
		<h3 class="flat">
			<span>
				{{displayFloor('up')}} ({{artists.up.length / 2}})
			</span>
			<button
				v-show="manageWhich !== 'up'"
				@click="manageThis('up')"
			>Manage</button>
			<button
				v-show="manageWhich === 'up'"
				@click="manageThis('')"
			>DONE</button>
		</h3>
		<name-manager
			floor-name="up"
		></name-manager>
	</div>
	<div class="manager-box">
		<h3 class="flat">
			<span>
				{{displayFloor('down')}} ({{artists.down.length / 2}})
			</span>
			<button
				v-show="manageWhich !== 'down'"
				@click="manageThis('down')"
			>Manage</button>
			<button
				v-show="manageWhich === 'down'"
				@click="manageThis('')"
			>DONE</button>
		</h3>
		<name-manager
			floor-name="down"
		></name-manager>
	</div>
	<p>
		<span>URL for this map:</span>
	</p>
	<shareable-link></shareable-link>
	<p>
		<button
			@click="returnToHub"
			title="Go back to the LC Rotation hub"
		>Return to Hub</button>
	</p>
	<div
		class="svg_preview"
	>
		<map-preview
			:rotation="rotation"
		></map-preview>
	</div>
</div>
`
});
