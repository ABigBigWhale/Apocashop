function StartStateWrapper(game) {

	this.startState = {
		preload : function() {
			if(!game.soundManager) {
				game.soundManager = new SoundManager(game, gameConfig.SOUNDENABLED);
			}
		},

		create: function() {
			game.displayManager.putLoadingBackground();
			game.displayManager.prepareStage();
			game.displayManager.putTitleScreen();
			game.soundManager.playMusic(game.Music.TITLEMUS);
			game.input.onDown.add(function() {
				printDebug('STARTING state_play');
				game.state.start('state_play');
			});
		}
	};

}