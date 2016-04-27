function Jeff(game) {
	
	game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer) {
		if(!game.playerState.checkStock(item)) {
			console.log("JEFF notices you're out of " + item + ". He'll make you one for: " + items[item].jPrice);
		}

		game.eventManager.register(game.Events.INPUT.YES, jeffHappy);
		game.eventManager.register(game.Events.INPUT.NO, jeffSad);
	});

	function jeffHappy() {
		console.log("JEFF is happy to have helped.");
		game.eventManager.remove(game.Events.INPUT.YES, jeffHappy);
		game.eventManager.remove(game.Events.INPUT.NO, jeffHappy);
	}

	function jeffSad() {
		console.log("JEFF is disappointed he couldn't help.");
		game.eventManager.remove(game.Events.INPUT.YES, jeffHappy);
		game.eventManager.remove(game.Events.INPUT.NO, jeffHappy);
	}

}