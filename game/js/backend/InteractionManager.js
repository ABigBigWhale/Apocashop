function InteractionManager(game) {

	var DAY_LENGTH = 100000;

	var conditionManager = new ConditionManager(game);

	// The index of the current day
	var dayIndex = 0;

	// Trips when the day ends
	var isEnd = false;

	// The listing of planned NPCs for today
	var npcs;

	// The index of the NPC we're currently at
	var npcIndex;

	// The current NPC we're interacting with
	var currentNPC;

	// The index of the offer the current NPC is currently giving
	var offerIndex;

	function init() {

		// When continue is pushed, send out a new NPC
		game.eventManager.register(game.Events.INPUT.CONTINUE, function() {
			pushNPC();
		});

		// When yes is selected, trip sellConditions if they exist. Check if the item
		// can be sold. If so, sell it and send success dialog. Otherwise, fail.
		game.eventManager.register(game.Events.INPUT.YES, function() {
			var sellConditions = currentNPC.sellConditions;
			if(sellConditions) {
				for(var i = 0; i < sellConditions.length; i++) {
					conditionManager.set(sellConditions[i]);
				}
			}
			if(game.playerState.checkPrice(currentNPC.item, currentNPC.offers[offerIndex])) {
				game.eventManager.notify(game.Events.INVENTORY.SOLD, currentNPC.item, currentNPC.offers[offerIndex]);
				game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC, "success"));
			} else {
				game.eventManager.notify(game.Events.INVENTORY.NOTSOLD, currentNPC.item, currentNPC.offers[offerIndex]);
				game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC, "fail"))
			}
			currentNPC = false;
		});

		// When no is selected, if there is an unsent offer, send it. Otherwise, trip refuse
		// Conditions and send fail dialog.
		game.eventManager.register(game.Events.INPUT.NO, function() {
			var offers = currentNPC.offers;
			offerIndex++;
			if(currentNPC.offers.length > offerIndex) {
				pushOffer(currentNPC, offerIndex);
			} else {
				var refuseConditions = currentNPC.refuseConditions;
				if(refuseConditions) {
					for(var i = 0; i < refuseConditions.length; i++) {
						conditionManager.set(refuseConditions[i]);
					}
				}
				game.eventManager.notify(game.Events.INVENTORY.NOTSOLD, currentNPC.item, currentNPC.offers[offerIndex]);
				game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC, "fail"))
				currentNPC = false;
			}
		});

		// Send dialog for the requested question
		game.eventManager.register(game.Events.INPUT.QUESTION, function(name) {
			game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC.questions, name));
		});

		// Send dialog for the requested item
		game.eventManager.register(game.Events.INPUT.ITEM, function(name) {
			game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC.items, name));
		});

		// Send dialog for the requested profile
		game.eventManager.register(game.Events.INPUT.PROFILE, function(name) {
			game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC.profiles, name));
		});
	}

	// Begin the day, set the day timer, and send our first NPC.
	this.startDay = function(day) {
		conditionManager.init(day.conditions);
		game.eventManager.notify(game.Events.DAY.START, day.clues);
		npcIndex = 0;
		initNPCs();
		pushNPC();
		setTimeout(function() {
			printDebug("DAY ENDING TIMER");
			isEnd = true;
		}, day.length);
	}

	// Smudge NPC order using fuzz values and initialize the npc
	// manifest for the current day.
	function initNPCs() {
		npcs = {};
		var sequence = days[dayIndex].sequence;
		for(var index in sequence) {
			var newIndex;
			do {
				index = parseInt(index);
				newIndex = index + Math.floor(Math.random() * sequence[index].fuzz);
			} while(npcs[newIndex]);
			npcs[newIndex] = sequence[index];
		}
	}

	// Returns the next planned NPC if we're at their index, a randomly
	// generated NPC for this day, or false if the day has ended.
	function getNextNPC() {
		var npc = npcs[npcIndex];
		npcIndex++;
		if(isEnd) {
			var max = Math.max.apply(this, Object.keys(npcs));
			while(!npc || !npc.force) {
				if(npcIndex > max) {
					return false;
				}
				npc = npcs[npcIndex];
				npcIndex++;
			}
			return heroes[npc.hero];
		}
		if(npc && heroes[npc.hero]) {
			return heroes[npc.hero];
		} else {
			return generateNPC(days[dayIndex]);
		}
	}

	// Sets our current NPC to the next NPC. If the day has ended and there is no next
	// NPC, sends the day end event instead.
	function pushNPC() {
		do {
			currentNPC = getNextNPC();
			if(!currentNPC) {
				game.eventManager.notify(game.Events.DAY.END);
				return;
			}
		} while(currentNPC.appearConditions && !conditionManager.get(currentNPC.appearConditions));

		offerIndex = 0;

		if(currentNPC.type === "interact") {
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo);
			pushOffer(currentNPC, offerIndex);
		} else if(currentNPC.type === "dialog") {
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo);
			game.eventManager.notify(game.Events.INTERACT.DIALOG, currentNPC.dialog);
		}
	}

	// Sends the next offer for the current NPC.
	function pushOffer(data, index) {
		var dialog = (typeof data.offerText === 'string') ? data.offerText : data.offerText[index];
		var offer = data.offers[index] || 0;
		if(typeof dialog === 'object') {
			for(var name in dialog) {
				if(conditionManager.get(name)) {
					game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog[name]);
					return;
				}
			}
			if(dialog.default) {
				game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog.default);
			} else {
				game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, "ERROR, NO DIALOG AVAILABLE");
			}
		} else if(typeof dialog === 'string') {
			game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog);
		}
	}

	// Get the prewritten dialog, default dialog, or generic error dialog.
	function getDialog(obj, name) {
		return obj[name] || obj.default || "ERROR: NO DIALOG SET";
	}

	init();

}