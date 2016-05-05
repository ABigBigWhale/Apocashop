function PlayerState(game) {
	var Items;
	var availableItems;
	var Gold;
	var Level;
	var EXP;
	var numSlots;

	function init() {
		Items = {
			"sword" : 5
		};
		availableItems = [
			"sword", "chicken", "shield", "bow"
		];
		Gold = 0;
		Level = 1;
		EXP = 0;
		numSlots = 2;
	}

	this.updateItem = function(item, count) {
		Items[item] = count;
	}

	this.decrementItem = function(item) {
		if (Items[item] === undefined || Items[item] <= 0) {
			return;
		}
		Items[item]--;
	}

	this.addsubGold = function(num) {
		Gold += num;
	}

	this.getGold = function() {
		return Gold;
	}

	this.getNumSlots = function() {
		return numSlots;
	}

	this.getItems = function() {
		return (typeof Items !== 'object') ? {} : JSON.parse(JSON.stringify(Items));
	}

	this.getAvalItems = function() {
		return (typeof Items !== 'object') ? {} : JSON.parse(JSON.stringify(availableItems));
	}

	this.checkStock = function(item) {
		return !items[item] || Items[item] || item === 'none';
	}

	this.checkPrice = function(item, goldOffset) {
		var price = (Items[item] || !items[item]) ? 0 : items[item].jPrice;
		return(Gold + goldOffset) >= price;
	}

	this.update = function(gold, items) {
		Gold = gold;
		Items = Object.assign({}, items);
	}

	this.updateProfit = function(profit) {
		if(profit <= 0) {
			return;
		}
		printDebug("ADDING " + profit + " TO EXP");
		EXP += profit;
		if(EXP >= Level * 10) {
			game.eventManager.notify(game.Events.LEVEL.LEVELUP, Level + 1);
			EXP = profit %= (Level * 10);
			Level++;
		}
		game.eventManager.notify(game.Events.LEVEL.EXPUP, EXP / (Level * 10.0));
	}

	init();
}