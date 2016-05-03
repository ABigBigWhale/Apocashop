function Jeff(game) {
	
	game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);

	function jeffListening(amount, item, offer) {
		if(!game.playerState.checkStock(item)) {
			//document.getElementById('jeff').innerHTML = "JEFF notices you're out of " + item + ". He'll make you one for: " + items[item].jPrice;
			game.dialogManager.printJeff("JEFF notices you're out of " + item + ". He'll make you one for: " + items[item].jPrice);
			primeJeff();
		}
	}

	function jeffHappy() {
		//document.getElementById('jeff').innerHTML = "JEFF is happy to have helped.";
		game.dialogManager.printJeff("JEFF is happy to have helped.");
		stopJeff();
	}

	function jeffSad() {
		//document.getElementById('jeff').innerHTML = "JEFF is disappointed he couldn't help.";
		game.dialogManager.printJeff("JEFF is disappointed he couldn't help.");
		stopJeff();
	}

	function primeJeff() {
		removeAll();
		game.eventManager.register(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.register(game.Events.INVENTORY.NOTSOLD, jeffSad);
	}

	function stopJeff() {
		removeAll();
		game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);
		game.eventManager.register(game.Events.INTERACT.NEW, clearJeff);
	}

	function removeAll() {
		game.eventManager.remove(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.remove(game.Events.INVENTORY.NOTSOLD, jeffSad);
		game.eventManager.remove(game.Events.INTERACT.OFFER, jeffListening);
	}

	function clearJeff() {
		game.dialogManager.printJeff("");
		game.eventManager.remove(game.Events.INTERACT.NEW, clearJeff);
	}

}