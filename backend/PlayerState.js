function PlayerState(game) {
	var Items;
	var Gold;

	function init() {
		Gold = 10;
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
		return Items;
	}

	this.checkPrice = function(item, goldOffset) {
		var price = (Items[item] || !items[item]) ? 0 : items[item].jPrice;
		return(Gold + goldOffset) >= price;
	}

	this.update = function(gold, items) {
		Gold = gold;
		Items = items;
	}

	init();
}