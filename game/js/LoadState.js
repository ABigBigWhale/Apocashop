function LoadStateWrapper(game) {

	this.loadState = {

		preload: function() {
			// Makes sure the font is loaded before we initialize any of the actual text.
			game.add.text(1000, 1000, "fix", {
				font: "1px yoster_islandregular",
				fill: "#FFFFFF"
			});

			var loadingText = game.add.text(100, 200, "fix", {
				font: "1px yoster_islandregular",
				fill: "#FFFFFF"
			});

			game.input.mouse.capture = true;

			game.assetManager = new AssetManager(game);
			game.displayManager = new DisplayManager(game);
			

			game.displayManager.prepareStage();
			game.assetManager.load();
			//initBackend(game);
		},

		create: function() {
			game.state.start('state_start');
		}

	};
}