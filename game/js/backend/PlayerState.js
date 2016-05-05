function PlayerState(game) {
	var Items;
	var AvailableItems;
	var StockedItems;
	var Gold;
	var Level;
	var EXP;
	var numSlots;

	function init() {
		StockedItems = ["sword"];
		Items = {
			"sword" : 5
		};
		AvailableItems = [
			"sword", "chicken", "shield", "bow"
		];
		Gold = 0;
		Level = 1;
		EXP = 0;
		numSlots = 1;
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

	this.getStockedItems = function() {
		var stocked = {};
		for(var i = 0; i < StockedItems.length; i++) {
			stocked[StockedItems[i]] = Items[StockedItems[i]] || 0;
		}
		return stocked;
	}

	this.getAvalItems = function() {
		return (typeof Items !== 'object') ? {} : JSON.parse(JSON.stringify(AvailableItems));
	}

	this.checkStock = function(item) {
		return items[item] && StockedItems.indexOf(item) >= 0 && !(Items[item] === undefined)
			   && Items[item] > 0 && item !== 'none';
	}

	this.checkPrice = function(item, goldOffset) {
		var price = (Items[item] || !items[item]) ? 0 : items[item].jPrice;
		return(Gold + goldOffset) >= price;
	}

	this.update = function(gold, items, stocked) {
		Gold = gold;
		Items = Object.assign({}, items);
		StockedItems = stocked
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