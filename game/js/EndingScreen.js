function EndingScreen(game) {

	var recapGroup;
    var moonStars;
	var blackScreenSprite;

	function init() {
		recapGroup = game.add.group();
		blackScreenSprite = game.add.sprite(0, 0);
        moonStars = game.add.image(0, 0, 'gp_moon');

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
        recapGroup.fadeOut = game.add.tween(recapGroup)
            .to( {alpha: 0}, 500);
        
		recapGroup.add(blackScreenSprite);
        recapGroup.add(moonStars);
		recapGroup.add(game.dialog.wrapup.box);
		recapGroup.visible = false;
	}

	function requestNext() {
		blackScreenSprite.events.onInputDown.removeAll();
		game.eventManager.notify(game.Events.WRAPUP.NEXT);
	}

	game.eventManager.register(game.Events.WRAPUP.START, function() {
		blackScreenSprite.events.onInputDown.removeAll();
		game.dialogManager.printWrapup("");
        recapGroup.alpha = 0;
		recapGroup.visible = true;
        recapGroup.fadeIn.onComplete.addOnce(requestNext);
        recapGroup.fadeIn.start();
	});

	game.eventManager.register(game.Events.WRAPUP.END, function() {
		game.dialogManager.printWrapup("");
		recapGroup.visible = false;
        recapGroup.fadeOut.start();
	});

	game.eventManager.register(game.Events.WRAPUP.MESSAGE, function(message) {
		game.dialogManager.printWrapup(message, function() {
			blackScreenSprite.events.onInputDown.add(requestNext, this);
		});
	});

	init();

}