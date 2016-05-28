function WrapupManager(game) {

	var messageIndex = 0;
	var messages = [];

	var goldDiff = 0;

	var endCallback;

	this.startDay = function(day, endCB) {

		endCallback = endCB || function() {};

		for(var i = 0; i < day.wrapup.length; i++) {

			var event = day.wrapup[i];

			if(event.conditions) {
				var failedCondition = false;

				for(var j = 0; j < event.conditions.length; j++) {
					if(!game.conditionManager.get(event.conditions[j])) {
						failedCondition = true;
						break;
					}
				}

				if(failedCondition) {
					continue;
				}
			}

			if(event.gold) {
				goldDiff += event.gold;
			}

			var text = (event.text instanceof Array) ? event.text : [event.text];
			for(var j = 0; j < text.length; j++) {
				messages.push(text[j]);
			}

		}

		isEndEnabled = true;

		game.eventManager.register(game.Events.WRAPUP.NEXT, sendNext);
		game.eventManager.notify(game.Events.WRAPUP.START);

	};

	var isEndEnabled = false;

	function sendNext() {
		if(messageIndex >= messages.length) {
			game.eventManager.remove(game.Events.WRAPUP.NEXT, sendNext);
			endWrapup();
		} else {
			game.eventManager.notify(game.Events.WRAPUP.MESSAGE, messages[messageIndex]);
			messageIndex++;
		}
	}

	function endWrapup() {
		if(isEndEnabled) {
			isEndEnabled = false;
			game.analytics.track("wrapup", "goldLost", goldDiff);
			game.playerState.addsubGold(goldDiff);
			goldDiff = 0;
			messages = [];
			messageIndex = 0;
			game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
			endCallback();
		}
	}

}