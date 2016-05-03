function initBackend(game) {
	game.eventManager = new EventManager(game);
	game.interactionManager = new InteractionManager(game);
	game.dialogManager = new DialogManager(game);
	game.playerState = new PlayerState(game);
	game.stock = new Stock(game);
	game.jeff = new Jeff(game);
}