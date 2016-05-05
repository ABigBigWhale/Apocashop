function Stock(game) {
	var Items;
	var totalGold;

	function init() {
		totalGold = 0;
		Items = {
			sword : 5
		};
		game.eventManager.register(game.Events.INVENTORY.SOLD, sellItem);
		game.eventManager.register(game.Events.STOCK.ADD, addItems);
		game.eventManager.register(game.Events.STOCK.REMOVE, removeItems);
		game.eventManager.register(game.Events.STOCK.COMMIT, adjustPlayer);
		game.eventManager.register(game.Events.STOCK.OUTSTOCK, returnStock);
		game.eventManager.register(game.Events.STOCK.INIT, initStock);
		game.eventManager.register(game.Events.LEVEL.ACCEPT, addUpgrade);
		game.eventManager.register(game.Events.STOCK.STARTDAY, initStockUI);
	}

	function initStock() {
		game.eventManager.notify(game.Events.UPDATE.ITEMS, Items);
		game.eventManager.notify(game.Events.UPDATE.STOCKGOLD, game.playerState.getGold() - totalGold);
	}

	function initStockUI() {
		game.eventManager.notify(game.Events.STOCK.INIT, game.playerState.getNumSlots(), game.playerState.getGold(),
														game.playerState.getAvalItems(), game.playerState.getItems());
	}
	function returnStock(item) {
		if (items[item] === undefined) {
			alert("Trying to remove an item that doesn't exist");
		}
		playerItems = game.playerState.getItems();
		var diff = ((Items[item] || playerItems[item]) - (playerItems[item] || 0)) || 0;
		Items[item] = playerItems[item] || 0;
		totalGold -= diff * items[item].price;
		game.eventManager.notify(game.Events.UPDATE.ITEMS, Items);
		game.eventManager.notify(game.Events.UPDATE.STOCKGOLD, game.playerState.getGold() - totalGold);
	}

	function addItem(item) {
		addItems(item, 1);
	}

	//TODO case statement on upgrades
	function addUpgrade(choice) {

	}

	function addItems(item, amount) {
		if (items[item] === undefined) {
			alert("Trying to remove an item that doesn't exist");
		} else if ((items[item].price * amount + totalGold) < game.playerState.getGold()) {
			Items[item] = (Items[item] || 0) + amount;
			totalGold += items[item].price * amount;
		}
		game.eventManager.notify(game.Events.UPDATE.ITEMS, Items);
		game.eventManager.notify(game.Events.UPDATE.STOCKGOLD, game.playerState.getGold() - totalGold);
	}

	function removeItem(item) {
		removeItems(item, 1);
	}

	function removeItems(item, amount) {
		if (items[item] === undefined) {
			alert("Trying to remove an item that doesn't exist");
		} else if (Items[item] === undefined) {
			alert("Trying to remove an item that we dont have!");
		} else if (Items[item] < amount) {
			alert("Trying to remove too many items!");
			Items[item] = 0;
		} else if (Items[item] - amount < (game.playerState.getItems()[item] || 0)) {
			Items[item] = (game.playerState.getItems()[item] || 0);
		} else {
			Items[item] = Items[item] - amount;
			totalGold -= items[item].price * amount;
		}
		game.eventManager.notify(game.Events.UPDATE.ITEMS, Items);
		game.eventManager.notify(game.Events.UPDATE.STOCKGOLD, game.playerState.getGold() - totalGold);
	}

	function sellItem(item, price) {
		var profit = price;
		if(item !== "None" && item !== "NoneNoXP") {
			if (items[item] === undefined) {
				return -1;
			}
			var currItems = game.playerState.getItems();
			var currStocked = game.playerState.getStockedItems();
			if (currItems[item] === undefined || currItems[item] <= 0 || currStocked[item] === undefined) {
				price -= items[item].jPrice;
				profit -= items[item].jPrice;
				game.eventManager.notify(game.Events.TIMER.JUMP, 4000);
			} else {
				profit -= items[item].price;
			}
			game.playerState.decrementItem(item);
			Items = game.playerState.getItems();
		}
		game.playerState.addsubGold(price);
		if(item !== "NoneNoXP") {
			game.playerState.updateProfit(profit);
		}
		game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
		game.eventManager.notify(game.Events.UPDATE.ITEMS, game.playerState.getItems());
	}

	function adjustPlayer(stocked) {
		var newGold = game.playerState.getGold() - totalGold;
		totalGold = 0;
		game.playerState.update(newGold, Items, stocked);
		game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
	}

	init();
}