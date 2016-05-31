function SoundManager(game, play) {
	/*'sounds' : {
			// 'example' : 'example_2061365_sound_coin.ogg'
			// 'arrayOfSound' : ['example1.ogg', 'ifOggNotSupportedUseThis.mp3']
			'coins' : ['sfx/coin.wav', 'sfx/coin2.wav'],
			'boom' : 'sfx/boom.wav',
			'notify' : 'sfx/notify.wav',
			'powerup' : 'sfx/powerup.wav',
			'tap' : 'sfx/tap.wav',
			'accept' : 'sfx/UI/accept.mp3',
			'reject' : 'sfx/UI/reject.mp3',
			'fart' : 'sfx/Never/fart_1.wav',
			'titleMusic' : 'mus/wintervillage.mp3'
		}*/
	game.playSound = play;

	game.Music = {
		WIN : ['winending'],
		GAMEOVER : ['gameover'],
		TITLEMUS : ['titleMusic']
	}

	game.Sounds = {
		COINS : ['coin1', 'coin2'],
		BOOM : ['notify'],
		NOTIFY : ['notify'],
		POWERUP : ['powerup'],
		TAP : ['tap'],
		BLIP : ['blip'],
		ACCEPT : ['accept'],
		REJECT : ['reject'],
		FART : ['fart', 'fart2'],
		SWAG : ['swag']
	}

	var currsound = null;
	var currMusic = null;

	this.playMusic = function(option) {
		if (!game.playSound) 
			return;
		if(!isMusic(option)) {
			alert("Trying to play music that is not music ...");
			return;
		}
		this.stopMusic();
		currMusic = game.add.audio(option[0], 0.3, true);
		currMusic.volume = 0.1;
		currMusic.onDecoded.add(function() { currMusic.fadeIn(500); }, this);
		//currMusic.play();
	}
	this.playSound = function(option) {
		if (!game.playSound) 
			return;
		if(isMusic(option)) {
			alert("Trying to play music as a sound ...");
			return;
		}
		var select = randomIntInRange(0, option.length);
		currsound = game.add.audio(option[select], 0.5);
		currsound.play();

	}

	this.stopSound = function() {
		if (currsound != null) {
			currsound.stop();
		}
	}

	this.stopMusic = function() {
		if (currMusic != null) {
			currMusic.fadeOut(500);
		}
	}

	function isMusic(option) {
		return option[0] == 'titleMusic' || option[0] == 'gameover' || option[0] == 'winending';
	}
}
