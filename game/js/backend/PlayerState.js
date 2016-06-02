function PlayerState(game) {

	var Stats = {
		Items : {},
		AvailableItems : [],
		StockedItems : [],
		Gold : 0,
		Level : 0,
		EXP : 0,
		numSlots : 1
	}

	var SavedStats = {};

	function init() {
		Stats.StockedItems = ["sword"];
		Stats.Items = {
			"sword" : 5
		};
		Stats.AvailableItems = [
			"sword", "chicken", "shield", "bow"
		];
		Stats.Gold = 0;
		Stats.Level = 1;
		Stats.EXP = 0;
		Stats.numSlots = 1;
		saveStats();
		game.eventManager.register(game.Events.LEVEL.ACCEPT, updateUpgrade);
		game.eventManager.register(game.Events.STOCK.STARTDAY, saveStats);
	}

	this.resetStats = function() {
		Stats = JSON.parse(JSON.stringify(SavedStats));
		game.eventManager.notify(game.Events.UPDATE.GOLD, Stats.Gold);
		game.eventManager.notify(game.Events.UPDATE.ITEMS, Stats.Items);
		game.eventManager.notify(game.Events.UPDATE.STOCKGOLD, Stats.Gold);
	}

	function saveStats() {
		SavedStats = JSON.parse(JSON.stringify(Stats));
	}
	
	this.updateItem = function(item, count) {
		Stats.Items[item] = count;
	}

	function updateUpgrade(key) {
		if (key.indexOf('itemslot') >= 0) {
			Stats.numSlots++;
		}
	}

	this.decrementItem = function(item) {
		if (Stats.Items[item] === undefined || Stats.Items[item] <= 0) {
			return;
		}
		Stats.Items[item]--;
	}

	this.addsubGold = function(num) {
		Stats.Gold += num;
	}

	this.getGold = function() {
		return Stats.Gold;
	}

	this.getNumSlots = function() {
		return Stats.numSlots;
	}

	this.getItems = function() {
		return (typeof Stats.Items !== 'object') ? {} : JSON.parse(JSON.stringify(Stats.Items));
	}

	this.getStockedItems = function() {
		var stocked = {};
		for(var i = 0; i < Stats.StockedItems.length; i++) {
			stocked[Stats.StockedItems[i]] = Stats.Items[Stats.StockedItems[i]] || 0;
		}
		return stocked;
	}

	this.getAvalItems = function() {
		return (typeof Stats.Items !== 'object') ? {} : JSON.parse(JSON.stringify(Stats.AvailableItems));
	}

	this.checkStock = function(item) {
		return items[item] && Stats.StockedItems.indexOf(item) >= 0 && !(Stats.Items[item] === undefined)
			   && Stats.Items[item] > 0 && item !== 'None';
	}

	this.checkPrice = function(item, goldOffset) {
		var price = (Stats.Items[item] || !items[item]) ? 0 : items[item].jPrice;
		return(Stats.Gold + goldOffset) >= price;
	}

	this.update = function(gold, items, stocked) {
		Stats.Gold = gold;
		Stats.Items = JSON.parse(JSON.stringify(items)) || {};
		Stats.StockedItems = stocked;
		var stocked_string = Stats.StockedItems[0] || "";
		for(var i = 1; i < Stats.StockedItems.length; i++) {
			stocked_string += "_" + Stats.StockedItems[i]
		}
		game.analytics.track("STOCK.COMMIT", stocked_string, Stats.numSlots);
	}

	this.updateProfit = function(profit) {
		if(profit <= 0) {
			return;
		}
		printDebug("ADDING " + profit + " TO EXP");
		Stats.EXP += profit;
		if(Stats.EXP >= Stats.Level * 10) {
			game.eventManager.notify(game.Events.LEVEL.LEVELUP, Stats.Level + 1);
			Stats.EXP = profit %= (Stats.Level * 10);
			Stats.Level++;
			game.kongregate.submit('Max_Level', Stats.Level);
		}
		game.eventManager.notify(game.Events.LEVEL.EXPUP, Stats.EXP / (Stats.Level * 10.0));
	}

	init();
}