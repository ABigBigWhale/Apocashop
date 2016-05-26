function initBackend(game) {
	game.reset = new ResetHelper();
	game.conditionManager = new ConditionManager(game);
	game.eventManager = new EventManager(game);
	game.analytics = new AnalyticsWrapper();
	initNPCGen(game);
	initDayGenerator(game);
	game.interactionManager = new InteractionManager(game);
	game.questionManager = new QuestionManager(game);
	game.dialogManager = new DialogManager(game);
	game.playerState = new PlayerState(game);
	game.wrapupManager = new WrapupManager(game);
	game.stock = new Stock(game);
	game.jeff = new Jeff(game);
	game.endingScreen = new EndingScreen(game);
	game.stockUI = new StockUI(game);
	game.endState = new EndStateWrapper(game);
}

function beginGame(game) {

	var currentDayIndex = 0;
	var currentDay = getDay(currentDayIndex);

	game.timesFailed = 0;
	game.timesWon = 0;

	if(currentDayIndex > 0 && debugGame) {
		debugGame.eventManager.notify(debugGame.Events.TUTORIAL.BEGIN);
	}
	
	game.analytics.track('day', 'begin' + currentDayIndex, currentDayIndex);
	game.analytics.set("dimension1", currentDayIndex);

	game.eventManager.register(game.Events.UPDATE.GOLD, function(amount) {
		if (amount < 0) {
			game.timesFailed++;
			game.analytics.set("dimension4", game.timesFailed);
			game.analytics.track('game', 'fail', currentDayIndex);
			game.endStateWrapper.setGameResult(false);
			game.endState.endState();
		}
	});

	var beginStocking = function() {
		game.stockUI.startDay(currentDay.clues.crisis, function() {
			beginSales(currentDay);
		});
	};

	var beginSales = function() {
		// For some reason, this event doesn't take in wrapupManager's callback
		// sometimes. Throwing it here as well for safety.
		// Hey, when you have a one month dev cycle, this is what happens.
		game.eventManager.notify(game.Events.WRAPUP.END);
		game.interactionManager.startDay(currentDay, currentDayIndex, function() {
			game.eventManager.notify(game.Events.DAY.END);
			beginWrapup();
		});
	};

	var beginWrapup = function() {
		game.wrapupManager.startDay(currentDay, function() {
			game.eventManager.notify(game.Events.WRAPUP.END);
			currentDayIndex++;
			game.analytics.track('day', 'begin' + currentDayIndex, currentDayIndex);
			game.analytics.set("dimension1", currentDayIndex);
			// TODO: only going to day 3
			if (currentDayIndex < 7) {
				currentDay = getDay(currentDayIndex);
				beginStocking();
			} else {
				game.timesWon++;
				game.analytics.set("dimension4", game.timesWon);
				game.endStateWrapper.setGameResult(true);
				game.endState.endState();
			}
		});
	};

	if(debugGame) {
		window.forceStock = beginStocking;
	}

	game.reset.register(function() {
		currentDay = 0;
		currentDayIndex = getDay(currentDayIndex);
	});

	game.restartDay = function() {
		if(currentDayIndex === 0) {
			beginSales();
		} else {
			beginStocking();
		}
	};

	beginSales();

}	