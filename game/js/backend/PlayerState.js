function PlayerState(game) {
	var Items;
	var Gold;

	var Level;
	var EXP;

	function init() {
		Items = {
			sword : 1
		};
		Gold = 40;
		Level = 1;
		EXP = 0;
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

	this.getItems = function() {
		return (Items === undefined) ? {} : Object.assign({}, Items);
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
		game.eventManager.notify(game.Events.LEVEL.EXPUP, EXP / (Level * 10));
	}

	init();
}