function SoundManager(game, isEnabled) {

	var self = this;

	var currSound = false;
	var currMusic = false;

	var isMusicEnabled = isEnabled;
	var isSoundEnabled = isEnabled;

	var soundVolume = 0.28;
	var musicVolume = 0.10;

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
		SWAG : generateSoundData('swag'),
		TEXTMED : [generateSoundData('textmeda'), generateSoundData('textmedb'), generateSoundData('textmedc'), generateSoundData('textmedd'), generateSoundData('textmede'), generateSoundData('textmedf'), generateSoundData('textmedg')],
		TEXTHIGH : [generateSoundData('texthigha'), generateSoundData('texthighb'), generateSoundData('texthighc'), generateSoundData('texthighd'), generateSoundData('texthighe'), generateSoundData('texthighf'), generateSoundData('texthighg')],
		TEXTMELODY : [generateSoundData('textmelodya'), generateSoundData('textmelodyb'), generateSoundData('textmelodyc'), generateSoundData('textmelodyd'), generateSoundData('textmelodye'), generateSoundData('textmelodyf'), generateSoundData('textmelodyg')],
		TEXTMURPHY : [generateSoundData('textmurphya'), generateSoundData('textmurphyb'), generateSoundData('textmurphyc'), generateSoundData('textmurphyd'), generateSoundData('textmurphye'), generateSoundData('textmurphyf'), generateSoundData('textmurphyg')],
		TEXTSTITCH : [generateSoundData('textstitcha'), generateSoundData('textstitchb'), generateSoundData('textstitchc'), generateSoundData('textstitchd'), generateSoundData('textstitche'), generateSoundData('textstitchf'), generateSoundData('textstitchg')]
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
			self.stopMusic();
		}
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
