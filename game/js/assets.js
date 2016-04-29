function AssetManager(game) {

    this.game = game;
    
    this.assetFolder = 'assets/';

    // Paths of asset files, without extensions
    this.assets = {
        '': ['background'],

        'ui': [
            'ui_itemslot', 
            'ui_dialog', 
			'ui_table',
			'ui_table_background',
            'ui_button_accept', 
            'ui_button_reject', 
            'ui_button_question', 
            'ui_button_continue', 
            'ui_coins',
        ],
        
        'items' : [
            'item_sword', 'item_bow'
        ]
    };

}

/**
 * Iterate over paths and load the asset files
 */
AssetManager.prototype.load = function() {
    for (var path in this.assets) {
        if (this.assets.hasOwnProperty(path)) {
            console.log('path:' + path + '\n');
            for (var i = 0; i < this.assets[path].length; i++) {
                var assetId = this.assets[path][i];
                if (assetId.indexOf('button') < 0) { // single image
                    this.game.load.image(assetId, this.assetFolder + path + '/' + assetId + '.png');
                } else {    // TODO: spritesheet
                    var spriteSize = [63, 22];
                    if (assetId.indexOf('continue') > 0) {
                        spriteSize = [128, 128]
                    }
                    this.game.load.spritesheet(assetId, this.assetFolder + path + '/' + assetId + '.png', spriteSize[0], spriteSize[1]);
                }
            }   
            
        }
    }
    
    //this.game.load.image(this.assets.image.background.id, assets.image.background.url);
};

/*
var assets = {

    'image' : {

        'background' : {
            id : 'background',
            url: 'assets/background.png'
        },

        'ui' : {

            'itemslot': {
                id : 'ui_itemslot',
                url: 'assets/ui_itemslot.png'
            },

            'dialog': {
                id : 'ui_dialog',
                url: 'assets/ui_dialog.png'
            },

            'button': {

                'accept': {
                    id : 'ui_button_accept',
                    url: 'assets/ui/ui_button_accept.png'
                },

                'reject': {
                    id : 'ui_button_reject',
                    url: 'assets/ui/ui_button_reject.png'
                },

                'question': {
                    id : 'ui_button_question',
                    url: 'assets/ui/ui_button_question.png'
                },

                'continue': {
                    id : 'ui_button_continue',
                    url: 'assets/ui/ui_button_continue.png'
                },
            },
            
            'coins': {
                id : 'ui_coins',
                url: 'assets/ui/ui_coins.png'
            }
        },

        'items' : {
        
            sword: {
                id : 'item_sword',
                url: 'assets/items/sword.png'
            },
            
            bow: {
                id : 'item_bow',
                url: 'assets/items/bow.png'
            }
            
        }

    },

    'sound' : {

    }
}*/
