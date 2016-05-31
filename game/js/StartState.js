function StartStateWrapper(game) {

	this.startState = {
		create: function() {
			game.displayManager.putLoadingBackground();
			game.displayManager.prepareStage();
			game.displayManager.putTitleScreen();
			game.soundManager.playSound(game.Sounds.TITLEMUS);
			game.input.onDown.add(function() {
				printDebug('STARTING state_play');
				game.soundManager.stopSound();
				game.state.start('state_play');
			});
		}
	};

}