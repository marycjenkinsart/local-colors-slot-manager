Vue.component('featured-manager', {
	mixins: [
		mixins,
	],
	data: function () {
		return {
			warning: '',
			adding2D: false,
			adding3D: false,
			addingGroup: false,
			customName: '',
			move2D: '',
			message: '',
		};
	},
	computed: {
		artists: function () {
			return this.$store.state.artists;
		},
		uniqueArtists: function () {
			return this.$store.getters.uniqueArtists;
		},
		manageMe: function () {
			return this.$store.state.manage.which === 'feat';
		},
		checkEmptyCustomName: function () {
			if (this.customName.length > 1) {
				return false;
			} else {
				return true;
			}
		},
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
		},
		showGroupShowWarning: function () {
			var artistExists = false;
			var themeExists = false;
			this.artists.feat.forEach(function (item) {
				if (item.type === '2D' || item.type === '3D') {
					artistExists = true;
				} else if (item.type === 'group') {
					themeExists = true;
				}
			})
			return artistExists && themeExists;
		},
		checkForbiddenCustomName: function () {
			var result = false;
			var custom = this.customName || '';
			forbiddenChars.forEach(function (char) {
				if (custom.includes(char)) {
					result = true;
				}
			})
			return result;
		},
	},
	methods: {
		updateArtistsObject (artistsObject) {
			this.$store.dispatch('updateArtistsObject',artistsObject);
		},
		removeArtist: function (artistName) {
			var newObject = JSON.parse(JSON.stringify(this.artists));
			var newFeatured = [];
			newObject.feat.forEach(function (artist) {
				if (artist.name != artistName) {
					newFeatured.push(artist);
				}
			})
			newObject.feat = newFeatured;
			this.updateArtistsObject(newObject);
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
			this.updateArtistsObject(newObject);
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
			this.message = this.moveName + ' was added to the featured show!';
			this.updateArtistsObject(newObject);
			this.move2Dcancel();
		},
		addingCustomConfirm: function () {
			var newObject = JSON.parse(JSON.stringify(this.artists));
			var type = '';
			if (this.addingGroup) {
				type = 'group';
			} else if (this.adding3D) {
				type = '3D';
			}
			newObject.feat.push({
				name: this.customName,
				type: type,
			})
			if (this.addingGroup) {
				this.message = 'Group theme "' + this.customName + '" added!';
			} else if (this.adding3D) {
				this.message = '3D artist "' + this.customName + '" added!';
			}
			this.updateArtistsObject(newObject);
			this.addingCustomCancel();
		},
		addingCustomCancel: function () {
			this.customName = '';
			this.addingGroup = false;
			this.adding3D = false;
		},
		add3Dartist: function () {
			this.adding3D = true;
			this.$nextTick(function () {
				var inputElement = this.$refs['customNameInput'];
				inputElement.focus();
			})
		},
		addGroupShow: function () {
			this.addingGroup = true;
			this.$nextTick(function () {
				var inputElement = this.$refs['customNameInput'];
				inputElement.focus();
			})
		},
	},
	template: /*html*/`
<div class="featured-manager">
	<div v-if="!manageMe">
		<ul>
			<li v-for="(artist, index) in artists.feat">
				<span v-if="artists.feat[index].type === 'group'">Theme: </span>
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
			<button @click="message=''">Ok</button>
		</p>
	</div>
	<div
		v-if="adding2D || adding3D || addingGroup"
		class="manager-inner round-and-shadow"
	>
		<p v-if="addingGroup">New theme for group show:</p>
		<p v-if="adding3D">Name of featured 3D artist:</p>
		<div v-if="addingGroup || adding3D">
			<form
				@submit.prevent="addingCustomConfirm"
			>
				<p>
					<input
						v-model="customName"
						type="text"
						ref="customNameInput"
					/>
				</p>
				<p>
					<button
						@click="addingCustomCancel"
						type="button"
					>Cancel</button>
					<button
						:disabled="checkEmptyCustomName || checkForbiddenCustomName"
						type="submit"
					>Ok</button>
				</p>
			</form>
			<p v-if="checkForbiddenCustomName">
				<span
					class="warning"
				>"{{customName}}" contains forbidden character: {{identifyForbiddenChar(customName)}}</span>
			</p>
		</div>
		<div v-if="adding2D">
			<p>Move which artist to the featured show?</p>
			<p>
				<select v-model="move2D" >
					<optgroup label="Upstairs">
						<option v-for="name in uniqueArtists.up"
							:value="'up-' + name"
						>{{name}}</option>
					</optgroup>
					<optgroup label="Downstairs">
						<option v-for="name in uniqueArtists.down"
							:value="'down-' + name"
						>{{name}}</option>
					</optgroup>
				</select>
			</p>
			<div v-if="move2D">
				<p>Remove <strong>{{moveName}}</strong> from the {{moveFloor}}stairs and add to the featured show?</p>
				<p>
					<button @click="move2Dcancel">Cancel</button>
					<button @click="move2Dconfirm">Ok</button>
				</p>
			</div>
			</div>
	</div>
	<div 
		class="manager-inner"
		v-if="
			!adding2D && !adding3D && !addingGroup && !message
			&& manageMe
		"
		>
		<p>
			<button
				@click="add2Dartist"
				title="Add an artist from the upstairs or downstairs rotation list"
				type="button"
			>add 2D/hybrid artist</button>
			<button
				@click="add3Dartist"
				title="Add an artist that isn't in either 2D rotation list"
				type="button"
			>add 3D artist</button>
			<button
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
					class="zebra"
				>
					<td>
						<span class="artist-name nowrap">{{artist.name}}</span>
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
					class="zebra"
				>
					<td><span class="artist-name nowrap">{{artist.name}}</span></td>
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
		<h3 v-if="onlyGroup.length">Group Show</h3>
		<table>
			<tbody>
				<tr
					v-for="artist in onlyGroup"
					class="zebra"
				>
					<td><span class="artist-name">{{artist.name}}</span></td>
					<td>
						<button @click="removeArtist(artist.name)">remove group show theme</button>
					</td>
				</tr>
			</tbody>
		</table>
		<p
			v-if="showGroupShowWarning"
			class="warning"
		>WARNING: Group show themes will not be listed on the map preview while there are artists designated to be featured.</p>
	</div>
	<p
		v-if="warning"
		class="warning"
	>{{warning}}</p>
</div>
`
});
