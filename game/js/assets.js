function AssetManager(game) {

	this.game = game;

	this.assetFolder = 'assets/';

	// Paths of asset files, without extensions
	this.assets = {
		'gameplay': [
			'gp_background',
			'gp_shopkeeper',
			'gp_jeff',
			'gp_jeff_big'
		],

		'ui': [
			'ui_itemslot', 
			'ui_dialog',
			'ui_note',
			'ui_table',
			'ui_table_background',
			'ui_button_accept', 
			'ui_button_reject', 
			'ui_button_question', 
			'ui_button_continue', 
			'ui_coin',
			'ui_coins',
		],

		'items' : [
			'item_sword', 'item_bow'
		],
		'gameplay' : [
			'gp_shopkeeper', 'upgrade_jeff', 'upgrade_shop'
		],
		
		// 'part' : #of files
		'npc' : {
			'face' : 3,
			'body' : 2,
			'hair' : 6,
			'eye' : 8,
			'nose' : 11,
			'mouth' : 11,
			'misc' : 7
		}

	};

}

/**
 * Iterate over paths and load the asset files
 */
AssetManager.prototype.load = function() {
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
					if (assetId.indexOf('button') < 0) { // single image
						this.game.load.image(assetId, fullPath);
					} else {    // TODO: spritesheet
						var spriteSize = [63, 22];
						if (assetId.indexOf('continue') > 0) {
							spriteSize = [128, 128]
						}
						this.game.load.spritesheet(assetId, fullPath, spriteSize[0], spriteSize[1]);
					}
					printDebug('LOADING: ' + fullPath);
				}   
			}
		}
	}
};