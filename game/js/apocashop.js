var gameConfig = {
    DEBUG_MODE: true,
    RESOLUTION: [800, 600]
};

(function() {
    var game = new Phaser.Game(
        gameConfig.RESOLUTION[0], 
        gameConfig.RESOLUTION[1],               // Resolution
        Phaser.AUTO,                            // Rendering context
        'gameDiv',                              // DOM object to insert canvas
        { preload: preload, create: create }    // Function references
    );
    
    if (gameConfig.DEBUG_MODE) window.game = game;

    function preload() {
        game.load.image(assets.image.background.id, assets.image.background.url);
	game.load.image(assets.image.ui.items.id, assets.image.ui.items.url);
	game.load.image(assets.image.ui.dialog.id, assets.image.ui.dialog.url);
    }
    
    function create() {
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        game.stage.smoothed = false;
        
        game.stage.backgroundColor = '#447474';
        
        var imgBackground = game.add.image(0, 0, assets.image.background.id);
	//imgBackground.set.anchor(1, 0);
	var uiItems = game.add.sprite(0, 400, assets.image.ui.items.id);
	uiItems.anchor.setTo(0, 1);
	var uiDialog = game.add.sprite(0, 400, assets.image.ui.dialog.id);
    }
    
})();

