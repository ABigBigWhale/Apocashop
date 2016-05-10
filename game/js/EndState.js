function EndStateWrapper(game) {

	this.endState = {
		create: function() {
			// TODO: temporary
			game.stage.backgroundColor = '#000000';
			var loadingText = game.add.text(
				100, 200, 
				"GAME OVER: You have gone broke. \n[Click to restart]", 
				{
					font: "32px yoster_islandregular",
					fill: "#FFFFFF"
				}
			);

			game.input.onDown.add(function() {
				game.state.start('state_start');
			});
		}
	};

}