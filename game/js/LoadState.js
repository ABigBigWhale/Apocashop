function LoadStateWrapper(game) {

    this.loadState = {

        preload: function() {
            // Makes sure the font is loaded before we initialize any of the actual text.
            game.add.text(1000, 1000, "fix", {
                font: "1px yoster_islandregular",
                fill: "#FFFFFF"
            });

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
            game.state.start('state_start');
        }
    };
}