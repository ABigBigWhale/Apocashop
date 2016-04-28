function Jeff(game) {
	
	game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);

	function jeffListening(amount, item, offer) {
		if(!game.playerState.checkStock(item)) {
			document.getElementById('jeff').innerHTML = "JEFF notices you're out of " + item + ". He'll make you one for: " + items[item].jPrice;
			game.eventManager.register(game.Events.INVENTORY.SOLD, jeffHappy);
			game.eventManager.register(game.Events.INVENTORY.NOTSOLD, jeffSad);
			game.eventManager.remove(game.Events.INTERACT.OFFER, jeffListening);
		}
	}

	function jeffHappy() {
		document.getElementById('jeff').innerHTML = "JEFF is happy to have helped.";
		game.eventManager.remove(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.remove(game.Events.INVENTORY.NOTSOLD, jeffHappy);
		game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);
	}

	function jeffSad() {
		document.getElementById('jeff').innerHTML = "JEFF is disappointed he couldn't help.";
		game.eventManager.remove(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.remove(game.Events.INVENTORY.NOTSOLD, jeffHappy);
		game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);
	}

}