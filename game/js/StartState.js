function StartStateWrapper(game) {

	this.startState = {
		create: function() {
			game.displayManager.putLoadingBackground();
			game.displayManager.prepareStage();
			game.displayManager.putTitleScreen();
			game.soundManager.playMusic(game.Music.TITLEMUS);
			var timeout = new Date().getTime() + 300; // wait 2 seconds
			game.input.onDown.add(function() {
				if (new Date().getTime() > timeout) {
					printDebug('STARTING state_play');
					game.soundManager.stopMusic();
					game.state.start('state_play');
				}
			});
		}
	};

}