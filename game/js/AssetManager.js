function AssetManager(game) {

	this.game = game;

	this.assetFolder = 'assets/';

	// Paths of asset files, without extensions
	this.assets = {
		'gameplay': [
			'gp_title',
			'gp_clickstart',
			'gp_background',
			'gp_background_town',
			'gp_background_sky',
			'gp_cloud', 'gp_cloud_star',
			'gp_shopkeeper',
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
			'ui_itemslot', 
			'ui_jeff_dialog_corner', 'ui_jeff_dialog_tip', 'ui_jeff_dialog_border',
			'ui_dialog',
			'ui_note',
			'ui_note_big',
			'ui_table',
			'ui_levelup',
			'ui_table_background',
			'ui_clock',
			'ui_funnel', 'ui_funnel_sand_top', 'ui_funnel_sand_buttom',
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

		'items' : [
			'item_sword', 'item_bow', 'item_chicken', 'item_shield'
		],

		// 'part' : #of files
		'npc' : {
			'face' : 5,
			'misc' : 7,
			'body' : 5,
			'hair' : 11,
			'eye' : 10,
			'nose' : 11,
			'mouth' : 11
		}

	};

	this.load = function() {
		for (var path in this.assets) {
			if (this.assets.hasOwnProperty(path)) {

				if (path == 'npc') {
					// Load parts for NPC avatar
					for (var npcPart in this.assets[path]) {
						var partCount = this.assets[path][npcPart];
						for (j = 1; j <= partCount; j++) {
							var partPath = 'assets/npc/' + npcPart + '/' + j + ".png";
							game.load.image('npc-' + npcPart + '-' + j, partPath);
							printDebug('LOADING NPC PART [' + npcPart + '] #' + j + '\t' + partPath);
						}
					}

				} else {
					// Load other image files
					for (var i = 0; i < this.assets[path].length; i++) {
						var assetId = this.assets[path][i];
						var fullPath = this.assetFolder + path + '/' + assetId + '.png';
						if (assetId.indexOf('button_item_border') > 0) {
							var spriteSize = [22, 22];
							this.game.load.spritesheet(assetId, fullPath, spriteSize[0], spriteSize[1]);

						}
						if (assetId.indexOf('button_add') > 0 || assetId.indexOf('button_sub') > 0) {
							var spriteSize = [11, 11];
							this.game.load.spritesheet(assetId, fullPath, spriteSize[0], spriteSize[1]);
						} else if (assetId.indexOf('button') < 0 && assetId.indexOf('upgrade') < 0) { // single image
							this.game.load.image(assetId, fullPath);
						} else if (assetId.indexOf('upgrade') < 0) {
							var spriteSize = [63, 22];
							if (assetId.indexOf('continue') > 0) {
								spriteSize = [128, 128];
							} else if (assetId.indexOf('start') > 0) {
								spriteSize = [160, 53];
							}
							this.game.load.spritesheet(assetId, fullPath, spriteSize[0], spriteSize[1]);
						} else {    // TODO: spritesheet
							var spriteSize = [100, 100];
							this.game.load.spritesheet(assetId, fullPath, spriteSize[0], spriteSize[1]);
						}
						printDebug('LOADING: ' + fullPath);
					}   
				}
			}
		}
	};

}
