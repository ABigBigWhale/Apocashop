function initBackend(game) {
	game.conditionManager = new ConditionManager(game);
	game.eventManager = new EventManager(game);
	game.interactionManager = new InteractionManager(game);
	game.dialogManager = new DialogManager(game);
	game.playerState = new PlayerState(game);
	game.stock = new Stock(game);
	game.jeff = new Jeff(game);
}

function beginGame(game) {

	var currentDay = 0;

	var beginTitle = function() {
		// game.eventManager.notify(game.Events.TITLE.INIT);
		// game.eventManager.register(game.Events.TITLE.START, function() {
		// 	beginSales();
		// });
	};

	var beginStocking = function() {
		// game.eventManager.notify(game.Events.STOCK.BEGIN);
		// game.stockingManager.startDay(days[dayIndex], function() {
		// 	game.eventManager.notify(game.Events.STOCK.END);
		// 	beginSales();
		// });

		beginSales();
	};

	var beginSales = function() {
		game.interactionManager.startDay(days[currentDay], function() {
			game.eventManager.notify(game.Events.DAY.END);
			beginWrapup();
		});
	};

	var beginWrapup = function() {
		// game.wrapupManager.startDay(days[currentDay], function() {
		// 	game.eventManager.notify(game.Events.WRAPUP.END);
		// 	currentDay++;
		// 	beginStocking();
		// });

		alert("DONE");
	};

	// beginTitle();

	beginSales();

}	