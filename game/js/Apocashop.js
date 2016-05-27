var gameConfig = {
	DEBUG_MODE: false,
	RESOLUTION: [800, 600]
};

document.addEventListener('DOMContentLoaded', function() {
	
	// Prevents right clicks on the game window
	document.getElementById("gameDiv").addEventListener('contextmenu', function(e) {
	  e.preventDefault();
	}, false);

	var game = new Phaser.Game(
		gameConfig.RESOLUTION[0],
		gameConfig.RESOLUTION[1], // Resolution
		Phaser.AUTO, // Rendering context
		'gameDiv' // DOM object to insert canvas
		/*{
			preload: preload,
			create: create,
			update: update
		}*/ // Function references
	);

	if (gameConfig.DEBUG_MODE) {
		window.debugGame = game;
	} else {
		window.debugGame = false;
	}

	game.loadStateWrapper = new LoadStateWrapper(game);
	game.startStateWrapper = new StartStateWrapper(game);
	game.playStateWrapper = new PlayStateWrapper(game);
	game.endStateWrapper = new EndStateWrapper(game);
	
	game.state.add('state_load',
				   game.loadStateWrapper.loadState);
	game.state.add('state_start',
				   game.startStateWrapper.startState);
	game.state.add('state_play',
				   game.playStateWrapper.playState);
	
	game.state.start('state_load');
});