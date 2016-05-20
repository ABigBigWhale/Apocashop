function InteractionManager(game) {

	var conditionManager = game.conditionManager;

	// The current day
	var currentDay;

	// Trips when the day ends
	var isEnd;

	// The listing of planned NPCs for today
	var npcs;

	// The index of the NPC we're currently at
	var npcIndex;

	// The current NPC we're interacting with
	var currentNPC;

	// The index of the offer the current NPC is currently giving
	var offerIndex;

	// The index of the dialog the current NPC is giving
	var dialogIndex;

	var dayEndCallback;

	var dayTimer;

	var dayUpgrade;

	function init() {
		dayUpgrade = 1;
		// When continue is pushed, send out a new NPC
		game.eventManager.register(game.Events.INPUT.CONTINUE, function() {
			if(currentNPC && currentNPC.type === 'interact') {
				pushOffer(currentNPC, offerIndex, true);
			} else if(currentNPC && currentNPC.type === 'dialog' && (((typeof currentNPC.dialog === 'string') && dialogIndex == 0) || ((currentNPC.dialog instanceof Array) && dialogIndex < currentNPC.dialog.length))) {
				pushDialog(currentNPC, dialogIndex);
				dialogIndex++;
			} else {
				if(currentNPC) {
					dayTimer.resume();
					if(currentNPC.finishConditions) {
						for(var i = 0; i < currentNPC.finishConditions.length; i++) {
							conditionManager.set(currentNPC.finishConditions[i]);
						}
					}
					if(currentNPC.endMoney) {
						game.eventManager.notify(game.Events.INVENTORY.SOLD, "None", currentNPC.endMoney);
					}
				}
				pushNPC();
			}
		});
		// When we accept a level_up, we want to check if we upgraded time and adjust accordingly
		game.eventManager.register(game.Events.LEVEL.ACCEPT, function(type) {
			if (type.indexOf("time") >= 0)
				dayUpgrade += 0.05;
		});
		// When yes is selected, trip sellConditions if they exist. Check if the item
		// can be sold. If so, sell it and send success dialog. Otherwise, fail.
		game.eventManager.register(game.Events.INPUT.YES, function() {
			game.eventManager.notify(game.Events.INVENTORY.SOLD, currentNPC.item, currentNPC.offers[offerIndex]);
			var sellConditions = currentNPC.sellConditions;
			if(sellConditions) {
				for(var i = 0; i < sellConditions.length; i++) {
					conditionManager.set(sellConditions[i]);
				}
			}
			game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC, "success"));
			currentNPC = false;
		});

		// When no is selected, if there is an unsent offer, send it. Otherwise, trip refuse
		// Conditions and send fail dialog.
		game.eventManager.register(game.Events.INPUT.NO, function() {
			game.analytics.track("NOTSOLD", currentNPC.item, currentNPC.offers[offerIndex]);
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
				game.eventManager.notify(game.Events.TIMER.JUMP, 1000);
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

		game.eventManager.register(game.Events.TIMER.JUMP, function(amount) {
			dayTimer.jumpForward(amount);
		});
	}

	// Begin the day, set the day timer, and send our first NPC.
	this.startDay = function(day, endCallback) {
		isEnd = false;
		currentDay = day;
		dayEndCallback = endCallback;
		conditionManager.init(day.conditions);
		game.eventManager.notify(game.Events.DAY.START, {
			clues : day.clues,
			questions : day.questions
		});
		npcIndex = 0;
		initNPCs(day);
		dayTimer = new Timer(function() {
			printDebug("DAY ENDING TIMER");
			isEnd = true;
		}, day.length * dayUpgrade);
		this.dayTimer = dayTimer;
		pushNPC();
	}

	// Smudge NPC order using fuzz values and initialize the npc
	// manifest for the current day.
	function initNPCs(day) {
		npcs = {};
		var sequence = day.sequence;
		var fuzzSequence = {};

		for(var index in sequence) {
			if(sequence[index].fuzz === 0) {
				npcs[index] = sequence[index];
			} else {
				fuzzSequence[index] = sequence[index];
			}
		}
		
		for(var index in fuzzSequence) {
			var newIndex;
			var escapeCounter = 0;
			do {
				if(escapeCounter >= fuzzSequence[index].fuzz * 2) {
					fuzzSequence[index].fuzz++;
					escapeCounter = 0
				}
				index = parseInt(index);
				newIndex = index + Math.floor(Math.random() * fuzzSequence[index].fuzz);
				escapeCounter++;
			} while(npcs[newIndex]);
			npcs[newIndex] = fuzzSequence[index];
		}
	}

	// Returns the next planned NPC if we're at their index, a randomly
	// generated NPC for this day, or false if the day has ended.
	function getNextNPC() {
		var npc = npcs[npcIndex];
		var storedHero = false;
		if(npc) {
			storedHero = npc.category ? heroes[npc.category][npc.hero] : heroes[npc.hero];
		}
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
			if(typeof npc.hero === 'object') {
				return generateNPC(currentDay, npc.hero);
			} else {
				return npc.category ? heroes[npc.category][npc.hero] : heroes[npc.hero];
			}
		}
		if(npc && storedHero) {
			return storedHero;
		} else if(npc && typeof npc.hero === 'object') {
			return generateNPC(currentDay, npc.hero);
		} else {
			return generateNPC(currentDay);
		}
	}

	// Sets our current NPC to the next NPC. If the day has ended and there is no next
	// NPC, sends the day end event instead.
	function pushNPC() {
		do {
			currentNPC = getNextNPC();
			if(!currentNPC) {
				//game.eventManager.notify(game.Events.DAY.END);
				dayEndCallback();
				return;
			}
		} while(currentNPC.appearConditions && !conditionManager.get(currentNPC.appearConditions));

		if(currentNPC.appearanceInfo === 'random') {
			applyRandomAppearance(currentNPC);
		}

		offerIndex = 0;
		dialogIndex = 0;

		if(currentNPC.type === "interact") {
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo);
			pushOffer(currentNPC, offerIndex);
		} else if(currentNPC.type === "dialog") {
			dayTimer.pause();
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo);
			pushDialog(currentNPC, dialogIndex);
			dialogIndex++;
		}
	}

	// Sends the next offer for the current NPC.
	function pushOffer(data, index, isRepeat) {
		var dialog = (typeof data.offerText === 'string') ? data.offerText : data.offerText[index];
		var offer = data.offers[index] || 0;
		if(typeof dialog === 'object') {
			for(var name in dialog) {
				if(conditionManager.get(name)) {
					game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog[name], isRepeat);
					return;
				}
			}
			if(dialog.default) {
				game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog.default, isRepeat);
			} else {
				game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, "ERROR, NO DIALOG AVAILABLE", isRepeat);
			}
		} else if(typeof dialog === 'string') {
			game.eventManager.notify(game.Events.INTERACT.OFFER, offer, data.item, dialog, isRepeat);
		}
	}

	function pushDialog(data, index) {
		var dialog = (currentNPC.dialog instanceof Array) ? currentNPC.dialog[index] : currentNPC.dialog;
		if(typeof dialog === 'object') {
			for(var name in dialog) {
				if(conditionManager.get(name)) {
					game.eventManager.notify(game.Events.INTERACT.DIALOG, dialog[name]);
					return;
				}
			}
			if(dialog.default) {
				game.eventManager.notify(game.Events.INTERACT.DIALOG, dialog.default);
			} else {
				game.eventManager.notify(game.Events.INTERACT.DIALOG, "ERROR, NO DIALOG AVAILABLE");
			}
		} else {
			game.eventManager.notify(game.Events.INTERACT.DIALOG, dialog);
		}
	}

	// Get the prewritten dialog, default dialog, or generic error dialog.
	function getDialog(obj, name) {
		return obj[name] || obj.default || "ERROR: NO DIALOG SET";
	}

	init();

}