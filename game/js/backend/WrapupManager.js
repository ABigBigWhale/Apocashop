function WrapupManager(game) {

	game.eventManager.register(game.Events.WRAPUP.MESSAGE, function(message) {
		alert(message);
	});

	this.startDay = function(day, endCB) {

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
				game.playerState.addsubGold(event.gold);
				game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
			}

			var text = (event.text instanceof Array) ? event.text : [event.text];
			for(var j = 0; j < text.length; j++) {
				game.eventManager.notify(game.Events.WRAPUP.MESSAGE, text[j]);
			}

		}

		endCB();

	};

}