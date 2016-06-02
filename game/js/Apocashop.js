document.addEventListener('DOMContentLoaded', function() {
	
	// Prevents right clicks on the game window
	document.getElementById("gameDiv").addEventListener('contextmenu', function(e) {
	  e.preventDefault();
	}, false);

	var game = new Phaser.Game(
		gameConfig.RESOLUTION[0],
		gameConfig.RESOLUTION[1], // Resolution
		Phaser.AUTO, // Rendering context
		'gameDiv', // DOM object to insert canvas
		{
			preload : preload,
			create: create
		}// Function references
	);

	function preload() {
		game.load.image('loadingImage', 'assets/loading/loading.png');

	    // Makes sure the font is loaded before we initialize any of the actual text.
        game.add.text(1000, 1000, "fix", {
            font: "1px yoster_islandregular",
            fill: "#FFFFFF"
        });

        if(gameConfig.SOUNDENABLED) {
        	// These are here so they'll be decoded first and won't have to wait in line.
	        // They're six tiny wav files, so this doesn't add much to loading times.
	        game.load.audio('textmeda', 'assets/sounds/sfx/text/med/a.wav');
	        game.load.audio('textmedb', 'assets/sounds/sfx/text/med/b.wav');
	        game.load.audio('textmedc', 'assets/sounds/sfx/text/med/c.wav');
	        game.load.audio('textmedd', 'assets/sounds/sfx/text/med/d.wav');
	        game.load.audio('textmede', 'assets/sounds/sfx/text/med/e.wav');
	        game.load.audio('textmedf', 'assets/sounds/sfx/text/med/f.wav');
	        game.load.audio('textmedg', 'assets/sounds/sfx/text/med/g.wav');
        }
	}

	function create() {
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

		if(gameConfig.ISSCALED) {
			game.stage.scale.pageAlignHorizontally = true;
			game.stage.scale.pageAlignVeritcally = true;
			game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

			window.addEventListener('resize', modifyAspectRatio);
			//window.addEventListener('fullscreenchange', modifyAspectRatio);

			modifyAspectRatio();
		}

	}

	function modifyAspectRatio(event) {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var aspect = 800/600;
		if(width > height * aspect) {
			// limit by height
			document.getElementById("gameDiv").style.height = "100vh";
			document.getElementById("gameDiv").style.width = height * aspect + "px";
			document.getElementById("gameDiv").style.top = "";
			document.getElementById("gameDiv").style.left = "50%";
			document.getElementById("gameDiv").style.margin = "0 0 0 -" + height * aspect / 2 + "px"
		} else {
			// limit by width
			document.getElementById("gameDiv").style.width = "100vw";
			document.getElementById("gameDiv").style.height = width / aspect + "px";
			document.getElementById("gameDiv").style.top = "50%";
			document.getElementById("gameDiv").style.left = "";
			document.getElementById("gameDiv").style.margin =  -width / aspect / 2 + "px" + " 0 0 0"
		}
	}

});