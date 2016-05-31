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
	game.Sounds = {
		COINS : ['coin1', 'coin2'],
		BOOM : ['notify'],
		NOTIFY : ['notify'],
		POWERUP : ['powerup'],
		TAP : ['tap'],
		ACCEPT : ['accept'],
		REJECT : ['reject'],
		FART : ['fart'],
		SWAG : ['swag'],
		TITLEMUS : ['titleMusic']
	}

	var currsound = null;

	this.playSound = function(option) {
		if (!game.playSound) 
			return;
		this.stopSound();
		var select = randomIntInRange(0, option.length - 1);
		currsound = game.add.audio(option[select], 0.5);
		/*if (isMusic(option))
			currsound.fadeIn(500);
		else*/
			currsound.play();

	}

	this.stopSound = function() {
		if (currsound != null) {
			if (isMusic([currsound.key])) 
				currsound.fadeOut(500);
			else
				currsound.stop();
		}
	}

	function isMusic(option) {
		return option[0] == 'titleMusic';
	}
}
