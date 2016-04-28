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
        ///////////////////////////// Assets ///////////////////////////
        /*
        game.load.image(assets.image.background.id, assets.image.background.url);
        game.load.image(assets.image.ui.itemslot.id, assets.image.ui.itemslot.url);
        game.load.image(assets.image.ui.dialog.id, assets.image.ui.dialog.url);
        game.load.image(assets.image.ui.coins.id, assets.image.ui.coins.url);
        
        

        game.load.spritesheet(assets.image.ui.button.accept.id, 
                              assets.image.ui.button.accept.url, 63, 22);
        game.load.spritesheet(assets.image.ui.button.reject.id, 
                              assets.image.ui.button.reject.url, 63, 22);
        game.load.spritesheet(assets.image.ui.button.question.id,
                              assets.image.ui.button.question.url, 63, 22);
        game.load.spritesheet(assets.image.ui.button.continue.id,
                              assets.image.ui.button.continue.url, 128, 128);

        game.load.image(assets.image.items.sword.id, assets.image.items.sword.url);
        game.load.image(assets.image.items.bow.id, assets.image.items.bow.url);
    
        game.load.audio('bip', 'assets/sounds/sfx-bip.wav');
=======
        */
        
        game.load.image('sk', 'assets/gameplay/gp_shopkeeper.png');
        game.assetManager = new AssetManager(game);
        game.assetManager.load();
    }

    // TODO: Lots of hard-coding right now
    function create() {
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        game.stage.smoothed = false;

        game.stage.backgroundColor = '#447474';

        var imgBackground = game.add.image(0, 0, 'background');

        ///////////////////////////// UI elems ///////////////////////////
        for (var i = 0; i < 4; i++) {
            var uiItemslot = game.add.sprite(10, 10 + 90 * i, 'ui_itemslot');
            uiItemslot.anchor.setTo(0, 0);
        }

        var uiDialog = game.add.sprite(0, 400, 'ui_dialog');

        var uiButtonAcceptCB = function() {
            game.eventManager.notify(game.Events.INPUT.YES)
        };
        var uiButtonRejectCB = function() {
            game.eventManager.notify(game.Events.INPUT.NO)
        };
        var uiButtonContinueCB = function() {
            game.eventManager.notify(game.Events.INPUT.CONTINUE)
        };

        var uiCoins = game.add.sprite(0, 520, 'ui_coins');
        var textCoins = game.add.text(80, 540, "20", // TODO: hardcoded
                                      { font: "30px yoster_islandregular", fill: "#ebc36f"} );
        
        var uiButtonAccept = game.add.button(660, 420, 'ui_button_accept', 
                                             uiButtonAcceptCB, this, 1, 0, 2);
        var uiButtonReject = game.add.button(660, 480, 'ui_button_reject', 
                                             uiButtonRejectCB, this, 1, 0, 2);
        var uiButtonQuestion = game.add.button(660, 540, 'ui_button_question', 
                                               null, this, 1, 0, 2);
        var uiButtonContinue = game.add.button(660, 440,
                                               'ui_button_continue', 
                                               uiButtonContinueCB, this, 1, 0, 2);

        uiButtonAccept.scale.setTo(2, 2);
        uiButtonReject.scale.setTo(2, 2);
        uiButtonQuestion.scale.setTo(2, 2);

        uiButtonAccept.smoothed = false;
        uiButtonReject.smoothed = false;
        uiButtonQuestion.smoothed = false;

        function switchButtons(isInteract) {
            uiButtonAccept.visible = isInteract;
            uiButtonReject.visible = isInteract;
            uiButtonContinue.visible = !isInteract;
        }

        function toggleButtons(isEnabled) {
            uiButtonAccept.inputEnabled = isEnabled;
            uiButtonReject.inputEnabled = isEnabled;
            uiButtonContinue.inputEnabled = isEnabled;
        }

        // TODO: demo use only
        var itemSword = game.add.sprite(16, 16, 'item_sword');
        var itemBow = game.add.sprite(16, 106, 'item_bow');
        itemSword.scale.setTo(2, 2);
        itemBow.scale.setTo(2, 2);
        itemSword.smoothed = false;
        itemBow.smoothed = false;
        
        var shopkeeper = game.add.sprite(500, 272, 'sk');

        ///////////////////////////// Backend ///////////////////////////
        game.eventManager = new EventManager(game);
        game.interactionManager = new InteractionManager(game);
        game.dialogManager = new DialogManager(game);
        game.playerState = new PlayerState(game);
        game.stock = new Stock(game);
        game.jeff = new Jeff(game);
        initNPCGen(game);

        uiButtonAccept.visible = false;
        uiButtonReject.visible = false;
        uiButtonQuestion.visible = false;

        game.interactionManager.startDay(days[0]);

        game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer, isRepeat) {
            switchButtons(true);
            //game.dialogManager.clearMain();
            toggleButtons(false);
            game.dialogManager.printMain(offer, isRepeat, function() {
                toggleButtons(true);
            });
        });

        game.eventManager.register(game.Events.UPDATE.GOLD, function(gold) {
            textCoins.setText(gold);
        });

        game.eventManager.register(game.Events.UPDATE.ITEMS, function(items) {
            var string = "";
            for (var key in items) {
                string += key + ": " + items[key] + " ";
            }
            //document.getElementById('items').innerHTML = ("Items: " + string);
        });

        game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
            switchButtons(false);
            //game.dialogManager.clearMain();
            toggleButtons(false);
            game.dialogManager.printMain(dialog, false, function() {
                toggleButtons(true);
            });
            //game.dialogManager.clearMain();
        });

    }

})();

