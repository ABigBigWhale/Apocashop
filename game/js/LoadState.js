function LoadStateWrapper(game) {

    this.loadState = {
        preload: function() {
            //game.kongregate = kongregateAPI.getAPI();
            var imgLoading = game.add.sprite(63, 258, 'loadingImage');
            imgLoading.alpha = 0.25;
            var tween = game.add.tween(imgLoading).to( { alpha: 1 }, 500, "Linear", true, 0, -1);

            //  And this tells it to yoyo, i.e. fade back to zero again before repeating.
            tween.yoyo(true, 500);
            
            game.stage.backgroundColor = "#92CD9A";
            game.input.mouse.capture = true;

            game.displayManager = new DisplayManager(game);
            game.assetManager = new AssetManager(game);
            game.reset = new ResetHelper();
            game.displayManager.prepareStage();
            game.kongregate = new KongregateHelper(game);
            game.assetManager.load();
            //initBackend(game);
        },

        create: function() {
            game.soundManager = new SoundManager(game, gameConfig.SOUNDENABLED, function() {
                printDebug('WAITING FOR KONGREGATE');
                game.state.start('state_start');
            });
        }
    };
}