function InteractionManager(game) {

	var conditionManager = game.conditionManager;

	var dayIndex;

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

	var npcLeaveSong;

	var interruptNPCs;

	var npcStallTimer;

	// The index of the offer the current NPC is currently giving
	var offerIndex;

	// The index of the dialog the current NPC is giving
	var dialogIndex;

	var dayEndCallback;

	var dayUpgrade;

	var potentialProfit;
	var itemsStocked;
	var itemsRequested;

	var overtimeStartIndex;

	this.getCurrentDay = function() {
		return dayIndex;
	}

	function init() {
		interruptNPCs = [];
		dayUpgrade = 1;
		npcLeaveSong = false;
		// When continue is pushed, send out a new NPC
		game.eventManager.register(game.Events.INPUT.CONTINUE, function() {
			if(currentNPC && currentNPC.type === 'interact' && offerIndex < currentNPC.offers.length) {
				pushOffer(currentNPC, offerIndex, true);
			} else if(currentNPC && currentNPC.type === 'dialog' && (((typeof currentNPC.dialog === 'string') && dialogIndex == 0) || ((currentNPC.dialog instanceof Array) && dialogIndex < currentNPC.dialog.length))) {
				pushDialog(currentNPC, dialogIndex);
				dialogIndex++;
			} else {
				if(currentNPC) {
					game.dayTimer.resume();
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
			if(currentNPC.isHero) {
				game.analytics.track("hero", "sold_good" + dayIndex);
			}
			if(currentNPC.isFalseHero) {
				game.analytics.track("hero", "sold_bad" + dayIndex);
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
				if(currentNPC.isHero) {
					game.analytics.track("hero", "refused_good" + dayIndex);
				}
				if(currentNPC.isFalseHero) {
					game.analytics.track("hero", "refused_bad" + dayIndex);
				}
				game.eventManager.notify(game.Events.INVENTORY.NOTSOLD, currentNPC.item, currentNPC.offers[offerIndex]);
				game.eventManager.notify(game.Events.INTERACT.DIALOG, getDialog(currentNPC, "fail"))
				if(!currentNPC.isFalseHero) {
					game.eventManager.notify(game.Events.TIMER.JUMP, 1000);
				}
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
			game.dayTimer.jumpForward(amount);
		});

		game.reset.register(function() {
			if(game.dayTimer) {
				game.dayTimer.pause();
			}
		});
	}

	// Begin the day, set the day timer, and send our first NPC.
	this.startDay = function(day, index, endCallback) {
		if(game.dayTimer) {
			game.dayTimer.pause();
		}
		isEnd = false;
		potentialProfit = 0;
		itemsRequested = {};
		stockedItems = game.playerState.getStockedItems();
		dayIndex = index;
		currentDay = day;
		interruptNPCs = day.interruptNPCs || [];
		dayEndCallback = function() {
			game.analytics.track("game", "potentialProfit", calculatePotentialProfit());
			endCallback();
		};
		conditionManager.init(day.conditions);
		game.eventManager.notify(game.Events.DAY.START, {
			clues : day.clues,
			questions : day.questions
		});
		npcIndex = 0;
		initNPCs(day);
		
		game.dayTimer = new Timer(function() {
			printDebug("DAY ENDING TIMER");
			game.displayManager.toggleGoldenClouds(false);
			isEnd = true;
			if(!checkDayOver()) {
				game.analytics.track("mendoza", "fail" + dayIndex, potentialProfit);
				addInterruptNPC(generateHeroData("timer", "jeffNotify"));
				startOvertime();
			} else {
				game.analytics.track("mendoza", "success" + dayIndex, potentialProfit);
			}
		}, day.length * dayUpgrade, function() {
			game.eventManager.notify(game.Events.TIMER.PAUSE, 0x191919);
			game.displayManager.toggleGoldenClouds(false);
			game.displayManager.imgSun.frame = 1;
			game.displayManager.imgSun.blinking = false;
			game.displayManager.spawnGoldenCloud = false;
		}, function() {
			game.eventManager.notify(game.Events.TIMER.RESUME, 0xFFFFFF);
			game.displayManager.toggleGoldenClouds(true);
			game.displayManager.imgSun.frame = 0;
			game.displayManager.spawnGoldenCloud = true;
		});
		pushNPC();
	}

	function startOvertime() {
		overtimeStartIndex = npcIndex;
	}

	function checkDayOver() {
		var isProfitGood = calculatePotentialProfit() >= gameConfig.MENDOZA;
		var isMaxedPityNPCs = npcIndex - overtimeStartIndex > gameConfig.EXTRACAP;
		var isNoInterrupt = interruptNPCs.length === 0;
		var isLastLevel = dayIndex > 6
		return isEnd && (isProfitGood || (isMaxedPityNPCs && isNoInterrupt) || isLastLevel);
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

		var npc;

		if(npcIndex > 0 && interruptNPCs.length > 0) {
			npc = interruptNPCs.shift();
		} else {
			npc = npcs[npcIndex];
			npcIndex++;
		}

		var storedHero = false;
		if(npc) {
			storedHero = npc.category ? heroes[npc.category][npc.hero] : heroes[npc.hero];
		}
		
		if(checkDayOver()) {
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
		if(npcStallTimer) {
			clearTimeout(npcStallTimer);
			npcStallTimer = false;
		}
		do {
			currentNPC = getNextNPC();
			if(!currentNPC) {
				dayEndCallback();
				dayEndCallback = nullFunc;
				return;
			}
		} while(currentNPC.appearConditions && !conditionManager.get(currentNPC.appearConditions));

		if(currentNPC.appearanceInfo === 'random') {
			applyRandomAppearance(currentNPC);
		}

		offerIndex = 0;
		dialogIndex = 0;

		if(currentNPC.type === "interact") {
			trackPotentialProfit(currentNPC);
			var fingerString = currentNPC.isFingers ? generateFingerString(currentNPC.offers[0]) : false;
			var fingerTime = currentNPC.isFingers ? currentNPC.fingerTime : false;
			var song = currentNPC.appearSong || npcLeaveSong;
			if(song === "CURRENTLEVEL" && dayIndex < 7) {
				song = "LV" + dayIndex;
			}
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo, currentNPC.voice, song, fingerString, fingerTime);
			pushOffer(currentNPC, offerIndex);
		} else if(currentNPC.type === "dialog") {
			game.dayTimer.pause();
			var song = currentNPC.appearSong || npcLeaveSong;
			if(song === "CURRENTLEVEL" && dayIndex < 7) {
				song = "LV" + dayIndex;
			}
			game.eventManager.notify(game.Events.INTERACT.NEW, currentNPC.appearanceInfo, currentNPC.voice, song);
			pushDialog(currentNPC, dialogIndex);
			dialogIndex++;
		} else {
			return;
		}

		npcLeaveSong = currentNPC.leaveSong;

		if(currentNPC.stallTime) {
			npcStallTimer = setTimeout(function() {
				var stallConditions = currentNPC.stallConditions;
				if(stallConditions) {
					for(var i = 0; i < stallConditions.length; i++) {
						conditionManager.set(stallConditions[i]);
					}
				}
				npcStallTimer = false;
			}, currentNPC.stallTime);
		}
	}

	function addInterruptNPC(npc) {
		interruptNPCs.push(npc);
	}

	function trackPotentialProfit(npc) {
		var maxOffer = Math.max.apply(this, npc.offers);

		if(items[npc.item]) {
			var profit = maxOffer - items[npc.item].jPrice;
			if(profit >= 0) {
				potentialProfit += maxOffer - items[npc.item].jPrice;
				itemsRequested[npc.item] = itemsRequested[npc.item] || 0;
				itemsRequested[npc.item]++;
			}
		}
	}

	function calculatePotentialProfit() {
		var potentialProfitCalc = potentialProfit;
		for(var item in stockedItems) {
			if(itemsRequested[item]) {
				potentialProfitCalc += (Math.min(itemsRequested[item], stockedItems[item]) * (items[item].jPrice - items[item].price));
			}
		}
		return potentialProfitCalc;
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