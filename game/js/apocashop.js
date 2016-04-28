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
        { preload: preload, create: create, update : update }    // Function references
    );

    if (gameConfig.DEBUG_MODE) window.game = game;

    function preload() {
        game.load.image(assets.image.background.id, assets.image.background.url);
        game.load.image(assets.image.ui.itemslot.id, assets.image.ui.itemslot.url);
        game.load.image(assets.image.ui.dialog.id, assets.image.ui.dialog.url);
        
        game.load.image(assets.image.ui.button.accept.idle.id,
                       assets.image.ui.button.accept.idle.url);
        game.load.image(assets.image.ui.button.accept.idle.id,
                       assets.image.ui.button.accept.idle.url);
        game.load.image(assets.image.ui.button.accept.idle.id,
                       assets.image.ui.button.accept.idle.url);
        
        game.load.image(assets.image.ui.button.reject.idle.id,
                       assets.image.ui.button.reject.idle.url);
        game.load.image(assets.image.ui.button.reject.idle.id,
                       assets.image.ui.button.reject.idle.url);
        game.load.image(assets.image.ui.button.reject.idle.id,
                       assets.image.ui.button.reject.idle.url);
        
        game.load.image(assets.image.ui.button.question.idle.id,
                       assets.image.ui.button.question.idle.url);
        game.load.image(assets.image.ui.button.question.idle.id,
                       assets.image.ui.button.question.idle.url);
        game.load.image(assets.image.ui.button.question.idle.id,
                       assets.image.ui.button.question.idle.url);
    }

    // TODO: Lots of hard-coding right now
    function create() {
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        game.stage.smoothed = false;

        game.stage.backgroundColor = '#447474';

        var imgBackground = game.add.image(0, 0, assets.image.background.id);
        
        for (var i = 0; i < 4; i++) {
            var uiItemslot = game.add.sprite(10, 10 + 60 * i, assets.image.ui.itemslot.id);
            uiItemslot.anchor.setTo(0, 0);
        }
        
        var uiDialog = game.add.sprite(0, 400, assets.image.ui.dialog.id);
        
        var uiButtonAccept = game.add.sprite(660, 420, assets.image.ui.button.accept.idle.id);
        var uiButtonReject = game.add.sprite(660, 480, assets.image.ui.button.reject.idle.id);
        var uiButtonQuestion = game.add.sprite(660, 540, assets.image.ui.button.question.idle.id);
        
        uiButtonAccept.scale.setTo(2, 2);
        uiButtonReject.scale.setTo(2, 2);
        uiButtonQuestion.scale.setTo(2, 2);
        
        uiButtonAccept.smoothed = false;
        uiButtonReject.smoothed = false;
        uiButtonQuestion.smoothed = false;

        game.dialog = {};
        game.dialog.mainBox = game.add.text(250, 430, "", { font: "24px yoster_islandregular"} );
        game.dialog.mainGhost = game.add.text(999, 999, "", { font: "24px yoster_islandregular"} );

    }

    function update() {

        //text.setText('Bitmap Fonts!\nx: ' + Date.now());

    }

})();

