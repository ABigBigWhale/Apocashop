function initBackend(game) {
	game.conditionManager = new ConditionManager(game);
	game.eventManager = new EventManager(game);
	game.analytics = new AnalyticsWrapper();
	game.interactionManager = new InteractionManager(game);
	game.questionManager = new QuestionManager(game);
	game.dialogManager = new DialogManager(game);
	game.playerState = new PlayerState(game);
	game.wrapupManager = new WrapupManager(game);
	game.stock = new Stock(game);
	game.jeff = new Jeff(game);
	game.endingScreen = new EndingScreen(game);
	game.stockUI = new StockUI(game);
}

function beginGame(game) {

	var currentDay = 0;
	
	if (currentDay > 0) {
		debugGame.eventManager.notify(debugGame.Events.TUTORIAL.BEGIN);
	}
	
	game.analytics.track('day', 'begin' + currentDay, currentDay);
	game.analytics.set('day', 1);

	game.eventManager.register(game.Events.UPDATE.GOLD, function(amount) {
		if (amount < 0) {
			game.endStateWrapper.setGameResult(false);
			game.state.start('state_end');
		}
	});

	var beginTitle = function() {
		// game.eventManager.notify(game.Events.TITLE.INIT);
		// game.eventManager.register(game.Events.TITLE.START, function() {
		// 	beginSales();
		// });
	};

	var beginStocking = function() {
		var day = getDay(currentDay);
		game.stockUI.startDay(day.clues.crisis, function() {
			beginSales(day);
		});
	};

	var beginSales = function(day) {
		// For some reason, this event doesn't take in wrapupManager's callback
		// sometimes. Throwing it here as well for safety.
		// Hey, when you have a one month dev cycle, this is what happens.
		game.eventManager.notify(game.Events.WRAPUP.END);
		game.interactionManager.startDay(day, function() {
			game.eventManager.notify(game.Events.DAY.END);
			beginWrapup(day);
		});
	};

	var beginWrapup = function(day) {
		game.wrapupManager.startDay(day, function() {
			game.eventManager.notify(game.Events.WRAPUP.END);
			currentDay++;
			game.analytics.track('day', 'begin' + currentDay, currentDay);
			game.analytics.set('day', 1);
			// TODO: only going to day 3
			if (currentDay <= 7) beginStocking();
			else {
				game.endStateWrapper.setGameResult(true);
				game.state.start('state_end');
			}
		});
	};

	// beginTitle();

	window.forceStock = beginStocking;

	beginSales(getDay(currentDay));

}	