function SoundManager(game, isEnabled) {

	var self = this;

	var currSound = false;
	var currMusic = false;

	var isMusicEnabled = isEnabled;
	var isSoundEnabled = isEnabled;

	this.soundVolume = 0.28;
	this.musicVolume = 0.12;

	game.Music = {
		WIN : 'winending',
		GAMEOVER : 'gameover',
		TITLEMUS : 'titleMusic',
		LV0 : 'lv0music'
	}

	game.Sounds = {
		COINS : [generateSoundData('coin1'), generateSoundData('coin2')],
		BOOM : generateSoundData('notify'),
		NOTIFY : generateSoundData('notify'),
		POWERUP : generateSoundData('powerup'),
		TAP : generateSoundData('tap'),
		BLIP : generateSoundData('blip'),
		ACCEPT : generateSoundData('accept'),
		REJECT : generateSoundData('reject'),
		FART : [generateSoundData('fart'), generateSoundData('fart2')],
		SWAG : generateSoundData('swag')
	}

	this.playMusic = function(songInfo, fadeDuration, isCrossfade) {

		if (!isMusicEnabled) {
			return;
		}

		fadeDuration = fadeDuration || 0;

		var song = songInfo instanceof Array ? randomElement(songInfo) : songInfo;
		song = generateMusicData(song);

		if(isCrossfade) {
			self.stopMusic(fadeDuration);
		} else {
			self.stopMusic(0);
		}
		
		currMusic = song;
		currMusic.onDecoded.add(function() {
			if(currMusic === song) {
				currMusic.volume = 0;
				currMusic.play();
				currMusic.fadeTo(fadeDuration, self.musicVolume);
			}
		}, this);

	}

	this.stopMusic = function(fadeDuration) {
		fadeDuration = fadeDuration || 0;
		if (currMusic) {
			var fadingMusic = currMusic;
			currMusic = false;
			fadingMusic.fadeOut(fadeDuration);
			setTimeout(function() {
				if(currMusic !== fadingMusic) {
					fadingMusic.stop();
				}
			}, fadeDuration + 50);
		}
	}

	this.toggleMusic = function(isEnabled) {
		isMusicEnabled = isEnabled;
		if(!isEnabled) {
			self.stopMusic();
		}
	}

	this.playSound = function(soundInfo) {

		if (!isSoundEnabled) {
			return;
		}

		var sound = soundInfo instanceof Array ? randomElement(soundInfo) : soundInfo;

		currSound = sound;
		currSound.play();

	}

	this.stopSound = function() {
		if (currSound) {
			currSound.stop();
		}
		currSound = false;
	}

	this.toggleSound = function(isEnabled) {
		isSoundEnabled = isEnabled;
		if(!isEnabled) {
			self.stopSound();
		}
	}

	function generateMusicData(name) {
		return game.add.audio(name, 0, true);
	}

	function generateSoundData(name) {
		return game.add.audio(name, self.soundVolume);
	}

}
