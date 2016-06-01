function KongregateHelper(game) {

	var queue = [];
	function init() {
		game.kong = undefined;
		if(gameConfig.ISKONGREGATE) {
            kongregateAPI.loadAPI(function() {
                game.kong = kongregateAPI.getAPI();
                printDebug("LOADED KONGREGATE API");
            });
		}
	}

	this.submit = function(key, value) {
		if(gameConfig.ISKONGREGATE) {
			if (game.kong === undefined) {
				queue.push({'key' : key,
							'val' : value});
			} else {
				if (queue.length > 0) {
					for (var i = 0; i < queue.length; i++) {
						game.kong.stats.submit(queue[i]['key'], queue[i]['val']);
					}
					queue = [];
				}
				game.kong.stats.submit(key, value);
			}
		}
	}
	init();
}