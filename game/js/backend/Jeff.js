function Jeff(game) {

	var promptedItem;
	
	game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);

	//game.eventManager.register(game.Events.COMPANIONS.JEFF, game.dialogManager.printJeff);

	function jeffListening(amount, item, offer) {
		if(!game.playerState.checkStock(item) && item !== "None") {
			game.dialogManager.printJeff(generatePrompt(item, items[item].jPrice));
			promptedItem = item;
			primeJeff();
		}
	}

	function jeffHappy() {
		game.dialogManager.printJeff(generateYes(promptedItem));
		stopJeff();
	}

	function jeffSad() {
		game.dialogManager.printJeff(generateNo(promptedItem));
		stopJeff();
	}

	function primeJeff() {
		removeAll();
		game.eventManager.register(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.register(game.Events.INVENTORY.NOTSOLD, jeffSad);
	}

	function stopJeff() {
		removeAll();
		game.eventManager.register(game.Events.INTERACT.OFFER, jeffListening);
		game.eventManager.register(game.Events.INTERACT.NEW, clearJeff);
	}

	function removeAll() {
		game.eventManager.remove(game.Events.INVENTORY.SOLD, jeffHappy);
		game.eventManager.remove(game.Events.INVENTORY.NOTSOLD, jeffSad);
		game.eventManager.remove(game.Events.INTERACT.OFFER, jeffListening);
	}

	function clearJeff() {
		game.dialogManager.printJeff("");
		promptedItem = false;
		game.eventManager.remove(game.Events.INTERACT.NEW, clearJeff);
	}

	var generatePrompt;
	var generateYes;
	var generateNo;

	(function() {

		var prompts = [
			"Hey kiddo, it looks like you're out of [x]s. I'll magic you up one for [y] gold.",
			"You can't sell what you don't have. Lucky for you, I can make you [ax] for [y] gold.",
			"We don't have any [x]s. Want me to magic out one for [y] gold?",
			"Kid, we need to stock up on [x]s. I can make you one right now for [y] gold."
		];

		generatePrompt = function(item, gold) {
			item = item || "ERROR";
			gold = numToStr(gold) || "ERROR";

			var aItem = addAn(item);

			var index = Math.floor(Math.random() * prompts.length);
			var prompt = prompts[index];
			var capitalGold = (typeof gold === 'string') ? gold.charAt(0).toUpperCase() + gold.slice(1) : gold;
			return prompt.replace("[x]", item).replace("[y]", gold).replace("[Y]", capitalGold).replace("[ax]", aItem);
		};

	})();

	(function() {

		var responses = {
			sword : [
				"Extra pointy sword, coming right up!",
				"Here comes a sword, everyone stand clear!"
			],
			chicken : [
				"Mmmmm, smells nice.",
				"Delicious precooked chicken, coming right up!"
			],
			bow : [
				"Alrighty, here comes a bow!",
				"Extra springy bow, coming right up!"
			],
			default : [
				"URRRRRRGH@@, item making isn't easy.",
				"Alright, fresh hot items, coming right up.",
				"Thanks for the cash kid, I'll have the item ready in no time.",
				"Don't watch me while I make it. I get nervous."
			]
		};

		generateYes = function(item) {
			item = item || "ERROR";

			var possibleResponses = responses[item] ? responses[item].concat(responses.default) : responses.default;

			var index = Math.floor(Math.random() * possibleResponses.length);

			return possibleResponses[index];
		};

	})();

	(function() {

		var responses = {
			sword : [
				"Darn. I really like making swords.",
				"Oh well, we'll get the next one."
			],
			chicken : [
				"I'll just make myself a chicken to eat. @@@@Well, at least I would if I had a mouth."
			],
			bow : [
				"But bows are so funnnnnn. Fine."
			],
			default : [
				"Come on, I don't get to show off my magic powers? So disappointing.",
				"Just so you know, I could have made that item if I wanted to.",
				"Too poor to spring for it? Oh well."
			]
		};

		generateNo = function(item) {
			item = item || "ERROR";

			var possibleResponses = responses[item] ? responses[item].concat(responses.default) : responses.default;

			var index = Math.floor(Math.random() * possibleResponses.length);

			return possibleResponses[index];
		};

	})();

}