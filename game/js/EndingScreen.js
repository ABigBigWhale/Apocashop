function EndingScreen(game) {

	var recapGroup;
	var moonStars;
	var coinStack;
	var prevGold = 0;
	var blackScreenSprite;

	function init() {
		recapGroup = game.add.group();
		blackScreenSprite = game.add.sprite(0, 0);
		moonStars = game.add.image(0, 0, 'gp_moon');
		coinStack = game.add.group();

		var blackScreen = game.add.graphics(0, 0);
		blackScreen.beginFill(0x0, 1);
		blackScreen.drawRect(0, 0, 800, 600);

		blackScreenSprite.width = 800;
		blackScreenSprite.height = 600;

		blackScreenSprite.events.onInputDown.add(requestNext, this);

		blackScreenSprite.addChild(blackScreen);
		blackScreenSprite.inputEnabled = true;

		recapGroup.fadeIn = game.add.tween(recapGroup)
			.to( {alpha: 1}, 500);
		recapGroup.realFadeOut = game.add.tween(recapGroup)
			.to({alpha : 0.9}, 500);
		recapGroup.realFadeOut.onComplete.add(function() {
			recapGroup.fadeOut.start();
		});
		recapGroup.fadeOut = game.add.tween(recapGroup)
			.to( {alpha: 0}, 500);
		recapGroup.fadeOut.onComplete.add(function() {
			recapGroup.visible = false;
		});

		//coinStack.anchor.setTo(0, 1);
		coinStack.tweenHit = game.add.tween(coinStack).to({
			x: coinStack.x + 10
		}, 30)
			.to({
			x: coinStack.x - 10,
			y: coinStack.y
		}, 60)
			.to({
			x: coinStack.x + 10,
			y: coinStack.y
		}, 60)
			.to({
			x: coinStack.x,
			y: coinStack.y
		}, 30);

		recapGroup.add(blackScreenSprite);
		recapGroup.add(moonStars);
		recapGroup.add(coinStack);
		recapGroup.add(game.dialog.wrapup.box);
		recapGroup.visible = false;

		blackScreenSprite.events.onInputDown.add(trackFutileClick, this);
	}

	var isReading = false;

	function resetCoins() {
		coinStack.removeAll();
		for (var i = 0; i < prevGold / 2; i++) {
			addCoin(i);
		}
	}

	function addCoin(index) {
		var pos = {x: 50, y: gameConfig.RESOLUTION[1] - 34 - 4*index};
		if (index >= 9 && index < 16) {
			pos.x = 62;
			pos.y = gameConfig.RESOLUTION[1] - 24 - 4 * (index - 9);
		} else if (index >= 16) {
			pos.x = 40;
			pos.y = gameConfig.RESOLUTION[1] - 22 - 4 * (index - 16);
		}
		var coin = game.add.image(pos.x, pos.y, 'ui_coin_frame');
		coin.anchor.setTo(0, 1);
		coinStack.add(coin);
	}

	function requestNext() {
		if(isReading) {
			game.analytics.track("text", "wrapupNoSkip");
		}
		blackScreenSprite.events.onInputDown.removeAll();
		isReading = true;
		blackScreenSprite.events.onInputDown.add(trackFutileClick, this);
		game.eventManager.notify(game.Events.WRAPUP.NEXT);
	}

	function trackFutileClick() {
		if(isReading) {
			game.analytics.track("text", "wrapupSkipAttempt");
		}
		isReading = false;
	}

	game.eventManager.register(game.Events.WRAPUP.START, function() {
		blackScreenSprite.events.onInputDown.removeAll();
		blackScreenSprite.events.onInputDown.add(trackFutileClick, this);
		game.dialogManager.printWrapup("");
		
		//game.playerState.addsubGold(41);
		prevGold = game.playerState.getGold();
		resetCoins();
		
		recapGroup.alpha = 0;
		recapGroup.visible = true;
		recapGroup.fadeIn.onComplete.addOnce(requestNext);
		recapGroup.fadeIn.start();
	});

	game.eventManager.register(game.Events.WRAPUP.END, function() {
		game.dialogManager.printWrapup("");
		recapGroup.fadeOut.start();
	});

	game.eventManager.register(game.Events.WRAPUP.MESSAGE, function(message) {
		game.dialogManager.printWrapup(message, function() {
			printDebug("EventGold: " + game.wrapupManager.eventGold);
			var currGold = prevGold + game.wrapupManager.eventGold.pop();
			var diff = currGold - prevGold;
			var coinDiff = Math.round(Math.abs(diff / 2));

			if (currGold < prevGold) {
				coinStack.tweenHit.start();
			} 

			var tmr = game.time.create(true);
			tmr.count = 0;
			tmr.loop(100, function(){
				if (tmr.count < coinDiff) {
					tmr.count++;
					if (diff > 0) {
						game.soundManager.playSound(game.Sounds.ACCEPT);
					}
					if (diff > 0 && prevGold >= 0) {
						addCoin(coinStack.length - 1);
					}
					
					if (diff < 0 && coinStack.length > 0) {
						game.soundManager.playSound(game.Sounds.REJECT);
						var removedCoin = coinStack.removeChildAt(coinStack.length - 1);
						removedCoin.destroy();
					} else if (diff < 0) {
						game.soundManager.playSound(game.Sounds.COINLOST);
					}
				} else {
					tmr.stop();
					tmr.destroy();
					prevGold = currGold;
				}
			}, this);
			tmr.start();

			blackScreenSprite.events.onInputDown.removeAll();
			blackScreenSprite.events.onInputDown.add(requestNext, this);
		});
	});

	init();

}