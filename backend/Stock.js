function Stock(game) {
	var Items;
	var totalGold;
	function init() {
		totalGold = -64;
		Items = {};
		addItem("bow");
		addItems("sword", 10);
		adjustPlayer();
		game.eventManager.register(game.Events.INVENTORY.SOLD, sellItem);
		game.eventManager.register(game.Events.STOCK.ADD, addItem);
		game.eventManager.register(game.Events.STOCK.REMOVE, removeItem);
		game.eventManager.register(game.Events.STOCK.COMMIT, adjustPlayer);
	}

	function addItem(item) {
		addItems(item, 1);
	}

	function addItems(item, amount) {
		if (items[item] === undefined) {
			alert("Trying to remove an item that doesn't exist");
		} else if ((items[item].price * amount + totalGold) < game.playerState.getGold()) {
			Items[item] = (Items[item] || 0) + amount;
			totalGold += items[item].price * amount;
		}
	}

	function removeItem(item) {
		removeItems(item, 1);
	}

	function removeItems(item, amount) {
		if (items.item === undefined) {
			alert("Trying to remove an item that doesn't exist");
		} else if (Items[item] === undefined) {
			alert("Trying to remove an item that we dont have!");
		} else if (Items[item] < amount) {
			alert("Trying to remove too many items!");
			this.Items[item] = 0;
		} else {
			this.Items[item] = this.Items[item] - amount;
			totalGold -= items[item].price * amount;
		}
	}

	function sellItem(item, price) {
		if (items[item] === undefined) {
			return -1;
		}
		var currItems = game.playerState.getItems();
		if (currItems[item] <= 0) {
			return -1;
		}
		game.playerState.addsubGold(price);
		game.playerState.decrementItem(item);
		game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
		game.eventManager.notify(game.Events.UPDATE.ITEMS, game.playerState.getItems());
	}

	function adjustPlayer() {
		var newGold = game.playerState.getGold() - totalGold;
		game.playerState.update(newGold, Items);
	}

	init();
}