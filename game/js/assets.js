function AssetManager(game) {

	this.game = game;

	this.assetFolder = 'assets/';

	// Paths of asset files, without extensions
	this.assets = {
		'gameplay': [
			'gp_background',
			'gp_shopkeeper',
			'gp_jeff',
			'gp_jeff_noshadow',
			'gp_jeff_shadow',
			'gp_stock',
			'gp_jeff_big'
		],

		'ui': [
			'ui_itemslot', 
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
			'upgrade_jeff',
			'upgrade_shop',
			'ui_coin',
			'ui_coins',
			'ui_coinstack'
		],

		'items' : [
			'item_sword', 'item_bow', 'item_meat', 'item_shield'
		],
		
		// 'part' : #of files
		'npc' : {
			'face' : 3,
			'body' : 4,
			'hair' : 6,
			'eye' : 8,
			'nose' : 11,
			'mouth' : 11,
			'misc' : 7
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
								spriteSize = [128, 128]
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
