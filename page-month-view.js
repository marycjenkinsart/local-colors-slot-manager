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
		rotationLabel: function () {
			return this.$store.state.rotationLabel;
		},
		artists: function () {
			return this.$store.state.artists;
		},
		guestName: function () {
			return this.$store.state.guestNameString;
		},
		manage: function () {
			return this.$store.state.manage;
		},
		uniqueUpstairs: function () {
			return this.artists.up.filter(getUnique).sort();
		},
		uniqueDownstairs: function () {
			return this.artists.down.filter(getUnique).sort();
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
		compactFloor: function () {
			return makeCompact(this.artists, this.rotationLabel);
		},
		compactFloorURL: function () {
			var viewURL = "https://marycjenkinsart.github.io/local-colors-slot-manager/#/view?";
			return viewURL + this.compactFloor;
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
	created: function () {
		var actualQueryData = this.$route.query;
		var patchedQueryData = {};
		var artistsFromQuery = {};
		var defaultData = {
			l: '1969,12,1337,No_router_query_data_found',
			f: 'no_router_query_data_found-3D-1',
			u: 'no-1,router,query-1,data,found',
			d: 'No-1,Rrouter,Query,Data,Found-1',
		}
		Object.keys(defaultData).forEach(function (key) {
			patchedQueryData[key] = actualQueryData && actualQueryData[key] || defaultData[key];
		})
		var rotationLabel = makeLabelUncompact(patchedQueryData.l);
		artistsFromQuery.feat = makeCompactFeaturedUnfancy(patchedQueryData.f);
		artistsFromQuery.up = makeCompactFloorUnfancy(patchedQueryData.u);
		artistsFromQuery.down = makeCompactFloorUnfancy(patchedQueryData.d);
		this.$store.dispatch('updateLabelObject',rotationLabel);
		this.$store.dispatch('updateArtistsObject',artistsFromQuery);
	},
	methods: {
		replaceFloor: function (floorName, floorData) {
			var artists = JSON.parse(JSON.stringify(this.$store.state.artists));
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
			newArtists.feat = JSON.parse(JSON.stringify(this.artists.feat));
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
		copyLink: function () {
			this.$refs.linkToCopy.select();
			document.execCommand("copy");
		},
		manageThis: function (value) {
			this.$store.dispatch('manageThis',value);
		},
	},
	template: /*html*/`
<div
	id="month-view"
>
	<h1 class="flat">LC Rotation Manager</h1>
	<h2>
		<span>Rotation: {{getLongLabel(rotationLabel)}}</span>
	</h2>
	<p>
		<button
			:disabled="manage.label"
			title="Change the label for this rotation"
			@click="editRotationNameStart"
		>edit rotation name</button>
	</p>
	<div
		v-if="manage.label"
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
	<p>
		<span>move artist to opposite floor:</span>
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
				v-show="manage.which !== 'feat'"
				@click="manageThis('feat')"
			>Manage</button>
			<button
				v-show="manage.which === 'feat'"
				@click="manageThis('')"
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
				v-show="manage.which !== 'up'"
				@click="manageThis('up')"
			>Manage</button>
			<button
				v-show="manage.which === 'up'"
				@click="manageThis('')"
			>DONE</button>
		</h3>
		<name-manager
			floor-name="up"
			:name-list="artists.up"
			:guest-name-string="guestName"
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
			v-show="manage.which !== 'down'"
			@click="manageThis('down')"
		>Manage</button>
		<button
			v-show="manage.which === 'down'"
			@click="manageThis('')"
		>DONE</button>
	</h3>
		<name-manager
			floor-name="down"
			:name-list="artists.down"
			:guest-name-string="guestName"
			:manage="manage.down"
			@replace-floor="replaceFloor('down',$event)"
		></name-manager>
	</div>
	<p>
		<span>URL for this map:</span>
	</p>
	<p>
		<textarea
			cols="50"
			rows="4"
			class="position-absolute"
			ref="linkToCopy"
			readonly
		>{{compactFloorURL}}</textarea>
	</p>
	<p>
		<button
			@click="copyLink"
		>Copy Shareable Link</button>
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
