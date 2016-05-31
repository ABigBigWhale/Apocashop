function AssetManager(game) {

	this.game = game;

	this.assetFolder = 'assets/';

	this.spriteSheets = {
		'button_item_border' : [22, 22],
		'button_add' : [11, 11],
		'button_sub' : [11, 11],
		'gp_dog_small' : [48, 36],
		'upgrade_' : [100, 100],
		'button_continue' : [128, 128],
		'button_start' : [160, 53],
		'button_accept' : [63, 22],
		'button_reject' : [63, 22],
		'button_question' : [63, 22],
		'gp_sun' : [96, 96]
	};

	// Paths of asset files, without extensions
	this.assets = {
		
		'gameplay': [
			'gp_title',
			'gp_clickstart',
			'gp_dev',
			'gp_background',
			'gp_background_town',
			'gp_background_sky',
			'gp_background_sky_dawn',
			'gp_background_sky_noon',
			'gp_background_sky_dusk',
			'gp_sun', 'gp_moon',
			'gp_cloud', 'gp_cloud_star',
			'gp_shopkeeper',
			'gp_passerby',
			'gp_stock',
			/* Jeff */
			'gp_jeff',
			'gp_jeff_noshadow',
			'gp_jeff_shadow',
			'gp_jeff_big',
			/* Dog */
			'gp_dog_small',
			'gp_dog_big', 'gp_dog_tail', 'gp_dog_tounge', 'gp_dog_claw_1',
			'gp_dog_claw_2',
			'gp_dog_set'
		],

		'ui': [
			'endday_boxoutline',
			'ui_itemslot', 
			'ui_jeff_dialog_corner', 'ui_jeff_dialog_tip', 'ui_jeff_dialog_border',
			'ui_dialog',
			'ui_note',
			'ui_note_big',
			'ui_calendar',
			'ui_table',
			'ui_levelup',
			'ui_table_background',
			'ui_clock',
			'ui_funnel', 'ui_funnel_sand_top', 'ui_funnel_sand_buttom',
			'ui_hands_background',
			'ui_button_accept', 
			'ui_button_reject', 
			'ui_button_question', 
			'ui_button_continue', 
			'ui_button_add', 
			'ui_button_sub', 
			'ui_button_item_border',
			'shop_rock',
			'shop_wooden',
			'shop_wooden_plus',
			'shop_wooden_desk',
			'shop_stone',
			'upgrade_jeff',
			'upgrade_shop',
			'upgrade_itemslot',
			'upgrade_time',
			'ui_coin',
			'ui_coins',
			'ui_coinstack',
			'ui_button_start',
			'right_textbox',
			'left_textbox',
			'middle_textbox'
		],
		
		'hero': [
			'hero_artifact',
			'hero_cloak',
			'hero_cloak_stache',
			'hero_guardian',
			'hero_king_zoran',
			'hero_treasure_hunter'
		],

		'items' : [
			'item_sword', 'item_bow', 'item_chicken', 'item_shield'
		],

		// 'part' : #of files
		'npc' : {
			'face' : 5,
			'misc' : 7,
			'body' : 8,
			'hair' : 11,
			'eye' : 10,
			'nose' : 11,
			'mouth' : 11,
			'hand' : 'npc_hand',
		},
		
		'sounds' : {
			// 'example' : 'example_2061365_sound_coin.ogg'
			// 'arrayOfSound' : ['example1.ogg', 'ifOggNotSupportedUseThis.mp3']
			'coin1' : 'sfx/coin.wav', 
			'coin2' : 'sfx/coin2.wav',
			'boom' : 'sfx/boom.wav',
			'notify' : 'sfx/notify.wav',
			'powerup' : 'sfx/powerup.wav',
			'tap' : 'sfx/tap.wav',
			'accept' : 'sfx/UI/accept.mp3',
			'reject' : 'sfx/UI/reject.mp3',
			'fart' : 'sfx/Never/fart_1.wav',
			'titleMusic' : 'mus/wintervillage.mp3',
			'swag' : 'sfx/swag.wav'
		}


	};

	this.load = function() {
		for (var path in this.assets) {
			if (this.assets.hasOwnProperty(path)) {

				if (path == 'npc') {
					// Load parts for NPC avatar
					for (var npcPart in this.assets[path]) {
						var partCount = this.assets[path][npcPart];
						
						if (partCount.substring) {	// Hand
							var imgPath = 'assets/npc/' + npcPart + '/' + partCount + ".png";
							game.load.image('npc-' + npcPart, imgPath);
							for (var j = 0; j < 5; j++) {
								var imgPathPrefix = 'assets/npc/' + npcPart + '/' + partCount + '_' + j;
								var id = 'npc-' + npcPart + '-' + j;
								game.load.image(id, imgPathPrefix + '.png');
								game.load.image(id + '-c', imgPathPrefix + '_c.png');
								printDebug('LOADING NPC HANDS [' + npcPart + '] #' + j + '\t' + imgPathPrefix + '\tid: ' + id);
							}
							
						} else {
							for (var j = 1; j <= partCount; j++) {
								var partPath = 'assets/npc/' + npcPart + '/' + j + ".png";
								game.load.image('npc-' + npcPart + '-' + j, partPath);
								printDebug('LOADING NPC PART [' + npcPart + '] #' + j + '\t' + partPath);
							}
						}
					}

				} else if (path == 'sounds') {
					for (var id in this.assets[path]) {
						var sndPath = 'assets/' + path + '/' + this.assets[path][id];
						game.load.audio(id, sndPath);
					}
					
				} else {
					// Load other image files
					for (var i = 0; i < this.assets[path].length; i++) {
						var assetId = this.assets[path][i];
						var fullPath = this.assetFolder + path + '/' + assetId + '.png';
						var isSpritesheet = false;

						for (var key in this.spriteSheets) {
							// Load spritesheets
							if (assetId.indexOf(key) >= 0) {
								printDebug('LOADING(spritesheet): ' + fullPath);
								this.game.load.spritesheet(assetId, fullPath, 
														   this.spriteSheets[key][0],
														   this.spriteSheets[key][1]);
								isSpritesheet = true;
								break;
							}
						}

						if (!isSpritesheet) {
							// Load images
							printDebug('LOADING(image): ' + fullPath);
							this.game.load.image(assetId, fullPath);
						}

						printDebug('LOADED: ' + assetId);

					}   
				}
			}
		}
	};

}
