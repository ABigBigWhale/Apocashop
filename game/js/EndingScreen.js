function EndingScreen(game) {

	var recapGroup;
	var blackScreenSprite;

	function init() {
		recapGroup = game.add.group();
		blackScreenSprite = game.add.sprite(0, 0);

		var blackScreen = game.add.graphics(0, 0);
		blackScreen.beginFill(0x0, 1);
		blackScreen.drawRect(0, 0, 800, 600);

		blackScreenSprite.width = 800;
		blackScreenSprite.height = 600;

		blackScreenSprite.events.onInputDown.add(requestNext, this);

		blackScreenSprite.addChild(blackScreen);
		blackScreenSprite.inputEnabled = true;

		recapGroup.add(blackScreenSprite);
		recapGroup.add(game.dialog.wrapup.box);
		recapGroup.visible = false;
	}

	function requestNext() {
		game.eventManager.notify(game.Events.WRAPUP.NEXT);
	}

	game.eventManager.register(game.Events.WRAPUP.START, function() {
		game.dialogManager.printWrapup("");
		recapGroup.visible = true;
		requestNext();
	});

	game.eventManager.register(game.Events.WRAPUP.END, function() {
		game.dialogManager.printWrapup("");
		recapGroup.visible = false;
	});

	game.eventManager.register(game.Events.WRAPUP.MESSAGE, function(message) {
		blackScreenSprite.events.onInputDown.removeAll();
		game.dialogManager.printWrapup(message, function() {
			blackScreenSprite.events.onInputDown.add(requestNext, this);
		});
	});

	init();

}