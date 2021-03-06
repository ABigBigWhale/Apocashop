function initBackend(game) {
	game.reset = new ResetHelper();
	game.conditionManager = new ConditionManager(game);
	game.eventManager = new EventManager(game);
	if(!game.analytics) {
		game.analytics = new AnalyticsWrapper();
	} else {
		game.analytics.setRunID();
	}
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

	game.currentScreen = "";

	var currentDayIndex = 0;
	var currentDay = getDay(currentDayIndex);

	game.timesFailed = 0;
	game.timesWon = 0;

	if(currentDayIndex > 0 && debugGame) {
		debugGame.eventManager.notify(debugGame.Events.TUTORIAL.BEGIN);
	}
	
	game.analytics.set("dimension1", currentDayIndex);
	game.analytics.track('day', 'begin' + currentDayIndex, game.playerState.getGold());
	game.kongregate.submit('DayReached', currentDayIndex);

	var beginStocking = function() {
		game.currentScreen = "STOCKING";
		game.soundManager.stopMusic(500);
		game.stockUI.startDay(currentDay.clues.crisis, function() {
			beginSales(currentDay);
		});
	};

	var beginSales = function() {
		// For some reason, this event doesn't take in wrapupManager's callback
		// sometimes. Throwing it here as well for safety.
		// Hey, when you have a one month dev cycle, this is what happens.
		game.currentScreen = "SALES";
		if(currentDayIndex === 0) {
			game.soundManager.stopMusic(100);
		}
		game.eventManager.notify(game.Events.WRAPUP.END);
		game.interactionManager.startDay(currentDay, currentDayIndex, function() {
			game.eventManager.notify(game.Events.DAY.END);
			beginWrapup();
		});
	};

	var beginWrapup = function() {
		game.wrapupManager.startDay(currentDay, function() {
			game.currentScreen = "WRAPUP";
			game.eventManager.notify(game.Events.WRAPUP.END);
			if (game.playerState.getGold() < 0) {
				game.timesFailed++;
				game.analytics.set("dimension4", game.timesFailed);
				game.analytics.track('game', 'fail', currentDayIndex);
				game.endStateWrapper.setGameResult(false);
				game.endState.endState();
			} else {
				currentDayIndex++;
				game.analytics.set("dimension1", currentDayIndex);
				game.analytics.track('day', 'begin' + currentDayIndex, game.playerState.getGold());
				game.kongregate.submit('DayReached', currentDayIndex);
				if (currentDayIndex <= 7) {
					if(game.playerState.getGold() >= 0) {
						currentDay = getDay(currentDayIndex);
						beginStocking();
					}
				} else {
					game.timesWon++;
					game.analytics.set("dimension4", game.timesWon);
					game.endStateWrapper.setGameResult(true);
					game.endState.endState();
				}
			}
		});
	};

	if(debugGame) {
		window.forceWrapup = beginWrapup;
		window.forceStock = beginStocking;
	}

	game.restartDay = function() {
		if(currentDayIndex === 0) {
			beginSales();
		} else {
			beginStocking();
		}
	};

	beginSales();

}	