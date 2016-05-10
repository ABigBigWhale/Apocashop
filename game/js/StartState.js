function StartStateWrapper(game) {

	this.startState = {
		create: function() {
			game.displayManager.putTitleScreen();

			game.input.onDown.add(function() {
				printDebug('STARTING state_play');
				game.state.start('state_play');
			});
		}
	};

}