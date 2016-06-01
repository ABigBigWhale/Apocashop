function SoundManager(game, isEnabled, doneCB) {

	var self = this;

	var currSound = false;
	var currMusic = false;

	var isMusicEnabled = isEnabled;
	var isSoundEnabled = isEnabled;

	var soundVolume = 0.25;
	var musicVolume = 0.07;

	game.Music = {
		WIN : 'winending',
		// GAMEOVER : 'gameover',
		STOCK : 'stockmusic',
		TITLEMUS : 'titleMusic',
		ZORAN : 'zoranmusic',
		LV0 : 'lv0music',
		LV1 : 'lv1music',
		LV2 : 'lv2music',
		LV3 : 'lv0music',
		LV4 : 'lv4music',
		LV5 : 'lv1music',
		LV6 : 'lv2music',
		LV7 : 'lv7music'
	}

	game.Sounds = {};

	var necessarySounds = [generateSoundData('textmeda'), generateSoundData('textmedb'), generateSoundData('textmedc'), generateSoundData('textmedd'), generateSoundData('textmede'), generateSoundData('textmedf'), generateSoundData('textmedg')];

	game.sound.setDecodedCallback(necessarySounds, function() {

		doneCB();

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
			SWAG : generateSoundData('swag'),
			GAMEOVER : generateSoundData('gameover'),
			TEXTMED : necessarySounds,
			TEXTHIGH : [generateSoundData('texthigha'), generateSoundData('texthighb'), generateSoundData('texthighc'), generateSoundData('texthighd'), generateSoundData('texthighe'), generateSoundData('texthighf'), generateSoundData('texthighg')],
			TEXTMELODY : [generateSoundData('textmelodya'), generateSoundData('textmelodyb'), generateSoundData('textmelodyc'), generateSoundData('textmelodyd'), generateSoundData('textmelodye'), generateSoundData('textmelodyf'), generateSoundData('textmelodyg')],
			TEXTMURPHY : [generateSoundData('textmurphya'), generateSoundData('textmurphyb'), generateSoundData('textmurphyc'), generateSoundData('textmurphyd'), generateSoundData('textmurphye'), generateSoundData('textmurphyf'), generateSoundData('textmurphyg')],
			TEXTSTITCH : [generateSoundData('textstitcha'), generateSoundData('textstitchb'), generateSoundData('textstitchc'), generateSoundData('textstitchd'), generateSoundData('textstitche'), generateSoundData('textstitchf'), generateSoundData('textstitchg')]
		}

	}, this);

	this.playMusic = function(songInfo, fadeDuration, prevFade) {

		fadeDuration = fadeDuration || 0;
		prevFade = prevFade || prevFade;

		var song = songInfo instanceof Array ? randomElement(songInfo) : songInfo;
		song = generateMusicData(song);

		self.stopMusic(prevFade);
		
		currMusic = song;

		if (!isMusicEnabled) {
			return;
		}

		currMusic.onDecoded.add(function() {
			if(currMusic === song) {
				if(fadeDuration > 0) {
					currMusic.volume = 0;
				} else {
					currMusic.volume = musicVolume;
				}
				currMusic.play();
				currMusic.fadeTo(fadeDuration, musicVolume);
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
			currMusic.fadeTo(300, 0);
		} else if(currMusic) {
			currMusic.volume = 0;
			currMusic.play();
			currMusic.fadeTo(300, musicVolume);
		}
	}
	
	this.musicEnabled = function() {
		return isMusicEnabled;
	}

	this.getMusicVolume = function() {
		return musicVolume;
	}

	this.changeMusicVolume = function(newVolume) {
		musicVolume = newVolume;
		if(currMusic) {
			currMusic.volume = newVolume;
		}
	}

	this.playSound = function(soundInfo, volume) {

		if (!isSoundEnabled) {
			return;
		}

		var sound = soundInfo instanceof Array ? randomElement(soundInfo) : soundInfo;

		if(volume) {
			sound.volume = volume;
		}

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
	
	this.soundEnabled = function() {
		return isSoundEnabled;
	}

	this.getSoundVolume = function() {
		return soundVolume;
	}

	this.changeSoundVolume = function(newVolume) {
		soundVolume = newVolume;
		if(currSound) {
			currSound.volume = newVolume;
		}
	}

	function generateMusicData(name) {
		return game.add.audio(name, 0, true);
	}

	function generateSoundData(name) {
		return game.add.audio(name, soundVolume);
	}

}
