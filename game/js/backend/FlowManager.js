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
	game.analytics.map("day", currentDay, true);

	game.eventManager.register(game.Events.UPDATE.GOLD, function(amount) {
		if(amount < 0) {
			alert("GAME OVER, OUT OF MONEY");
		}
	});

	var beginTitle = function() {
		// game.eventManager.notify(game.Events.TITLE.INIT);
		// game.eventManager.register(game.Events.TITLE.START, function() {
		// 	beginSales();
		// });
	};

	var beginStocking = function() {
		game.stockUI.startDay(days[currentDay].clues.crisis, function() {
			beginSales();
		});
	};

	var beginSales = function() {
		game.interactionManager.startDay(days[currentDay], function() {
			game.eventManager.notify(game.Events.DAY.END);
			beginWrapup();
		});
	};

	var beginWrapup = function() {
		game.wrapupManager.startDay(days[currentDay], function() {
			game.eventManager.notify(game.Events.WRAPUP.END);
			currentDay++;
			game.analytics.map("day", currentDay, true);
			beginStocking();
		});
	};

	// beginTitle();

	beginSales();

	document.getElementById("stockChange").onclick = beginStocking;

}	