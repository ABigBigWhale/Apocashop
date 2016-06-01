function LoadStateWrapper(game) {

    this.loadState = {
        preload: function() {

            game.add.sprite(63, 258, 'loadingImage');

            game.stage.backgroundColor = "#92CD9A";
            game.input.mouse.capture = true;

            game.displayManager = new DisplayManager(game);
            game.assetManager = new AssetManager(game);
            game.reset = new ResetHelper();
            game.displayManager.prepareStage();
            game.assetManager.load();
            //initBackend(game);
        },

        create: function() {
            game.soundManager = new SoundManager(game, gameConfig.SOUNDENABLED, function() {
                game.state.start('state_start');
            });
        }
    };
}