function PlayStateWrapper(game) {
	var uiFunnelSandTop;
	var uiFunnelSandButtom;
	var uiFunnelSetTime;

	this.playState = {
		// TODO: Lots of hard-coding right now
		create: function() {
			Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

			game.displayManager.prepareGroups();
			game.displayManager.putEnvironment();
			game.displayManager.putUIComponents();
			game.displayManager.putScreenShade(0x292929, 0.75);

			/*
			var hands = game.displayManager.generateNPCHands('01100', '11001');
			hands.x = 80;
			hands.y = 525;
			game.depthGroups.frontGroup.add(hands);
			*/

			var shop = game.displayManager.shop;	// TODO: temporary work-around
			///////////////////////////// UI elems ///////////////////////////

			//-------------------------- Item slots --------------------------
			var uiItemNums = {};
			game.uiItemGroup = game.add.group();
			var uiPutItemSlots = function(numSlots, items) {
				for (var i = 0; i < numSlots; i++) {
					var uiItemslot = game.uiItemGroup.create(20, 40 + 50 * i, 'ui_itemslot');
					uiItemslot.anchor.setTo(0, 0);
				}
				var j = -1;
				for (var key in items) {
					j++;
					var itemIcon = game.uiItemGroup.create(24, 44 + 50 * j, 'item_' + key);
					itemIcon.scale.setTo(2, 2);
					itemIcon.smoothed = false;
					var itemCount = game.add.text(74, 46 + 50 * j, items[key], {
						font: "20px yoster_islandregular",
						fill: '#d3af7a'
					}, game.uiItemGroup);
					printDebug('UI: itemKey ' + key + '\nUI: itemCount ' + items[key]);
					uiItemNums[key] = itemCount;
				}
			};

			game.depthGroups.uiGroup.add(game.uiItemGroup);

			//------------------------- Clock --------------------------------
			var uiFunnelPos = {
				x: 223,
				y: 600 - 270 - 2
			};
			uiFunnelSandTop = game.add.sprite(uiFunnelPos.x + 6, uiFunnelPos.y + 32, 'ui_funnel_sand_top');
			uiFunnelSandButtom = game.add.sprite(uiFunnelPos.x + 6, uiFunnelPos.y + 62, 'ui_funnel_sand_buttom');
			uiFunnelSandTop.anchor.setTo(0, 1);
			uiFunnelSandButtom.anchor.setTo(0, 1);

			var uiFunnelSandTopCrop = new Phaser.Rectangle(0, 0,
														   uiFunnelSandTop.width, uiFunnelSandTop.height);
			var uiFunnelSandButtomCrop = new Phaser.Rectangle(0, uiFunnelSandButtom.height,
															  uiFunnelSandButtom.width, 0);

			var uiFunnel = game.add.sprite(uiFunnelPos.x, uiFunnelPos.y, 'ui_funnel');



			var th = uiFunnelSandTop.height;
			var bh = uiFunnelSandButtom.height;
			uiFunnelSetTime = function(ratio) {
				uiFunnelSandTopCrop.y = Math.round((1 - ratio) * th);
				uiFunnelSandTopCrop.height = Math.round(ratio * th);
				uiFunnelSandButtomCrop.y = Math.round(ratio * bh);
				uiFunnelSandButtomCrop.height = Math.round((1 - ratio) * bh);
			};

			uiFunnelSandTop.crop(uiFunnelSandTopCrop);
			uiFunnelSandButtom.crop(uiFunnelSandButtomCrop);
			game.clockUI = [uiFunnel, uiFunnelSandTop, uiFunnelSandButtom];
			game.depthGroups.uiGroup.add(uiFunnelSandTop);
			game.depthGroups.uiGroup.add(uiFunnelSandButtom);
			game.depthGroups.uiGroup.add(uiFunnel);

			uiFunnelSandTop.visible = false;
			uiFunnelSandButtom.visible = false;
			uiFunnel.visible = false;

			//------------------------- Calendar ------------------------
			var uiCalendarLayer = game.add.group();
			game.depthGroups.uiGroup.add(uiCalendarLayer);
			uiCalendarLayer.create(223, 600-270, 'ui_calendar');

			var uiCalendarDay = game.add.text(223+26, 600-270+22, '0',  { font: "bold 32px Arial", fill: "#cfcece", boundsAlignH: "center", boundsAlignV: "middle" });
			uiCalendarLayer.add(uiCalendarDay);

			uiCalendarLayer.visible = false;

			//------------------------- Notes & Clues ------------------------
			var uiNoteLayer = game.add.group();
			uiNoteLayer.y = 400;

			var uiNoteDisplay = uiNoteLayer.create(800, 400, 'ui_note_big');
			uiNoteDisplay.smoothed = false;
			uiNoteDisplay.anchor.setTo(1, 1);

			var uiNoteCurtain = game.add.sprite(0, 0);
			uiNoteCurtain.width = 800;
			uiNoteCurtain.height = 600;
			uiNoteCurtain.visible = false;

			var crisisClueText = game.add.text(240, 50, "HELLO THERE", // TODO: hardcoded
											   {
				font: "18px yoster_islandregular",
				fill: "#4d372c",
				wordWrap: true,
				wordWrapWidth: 250
			});
			uiNoteLayer.add(crisisClueText);

			var heroClueText = game.add.text(525, 50, "HELLO THERE", // TODO: hardcoded
											 {
				font: "18px yoster_islandregular",
				fill: "#4d372c",
				wordWrap: true,
				wordWrapWidth: 250
			});
			uiNoteLayer.add(heroClueText);

			var uiNoteDisplayShown = false;

			game.depthGroups.noteGroup.add(uiNoteLayer);
			game.depthGroups.noteGroup.add(uiNoteCurtain);

			//------------------------- Question options ---------------------
			var uiQuestionLayer = game.add.group();

			game.depthGroups.uiGroup.add(uiQuestionLayer);
			//------------------------- Desk & Avatar ------------------------

			var uiDeskBgLayer = game.add.group();
			var uiAvatarLayer = game.add.group();
			var uiDeskLayer = game.add.group();
			var uiDialogLayer = game.add.group();

			game.depthGroups.uiGroup.add(uiDeskBgLayer);
			game.depthGroups.uiGroup.add(uiAvatarLayer);
			game.depthGroups.uiGroup.add(uiDeskLayer);
			game.depthGroups.uiGroup.add(uiDialogLayer);

			var uiDialog = uiDialogLayer.create(800, 600, 'ui_dialog');
			var uiDeskBg = uiDeskBgLayer.create(0, 600, 'ui_table_background');
			var uiDesk = uiDeskLayer.create(0, 600, 'ui_table_nogold');
			uiDialog.anchor.setTo(1, 1);
			uiDesk.anchor.setTo(0, 1);
			uiDeskBg.anchor.setTo(0, 1);

			var uiNote = uiDeskLayer.create(145, 600, 'ui_note');

			var toggleNoteDisplay = function() {
				printDebug("UI: note clicked; shown: " + uiNoteDisplayShown);
				if (uiNote.alpha != 1) {
					uiNote.fadeIn.stop();
					uiNote.shake.stop();
					uiNote.alpha = 1;
				}
				var uiNoteDisplayTween;
				var uiNoteTween;

				if (uiNoteDisplayShown) { // Out
					game.soundManager.playSound(game.Sounds.TAP);
					uiNoteDisplayTween = game.add.tween(uiNoteLayer.position)
						.to({
						y: 400
					}, 300, Phaser.Easing.Quadratic.Out);
					uiNoteTween = game.add.tween(uiNote).to({
						y: 520
					}, 200, Phaser.Easing.Quadratic.Out);
					uiNoteCurtain.visible = false;
				} else { // In
					uiNoteDisplayTween = game.add.tween(uiNoteLayer.position)
						.to({
						y: 0
					}, 200, Phaser.Easing.Quadratic.In);
					uiNoteTween = game.add.tween(uiNote).to({
						y: 700
					}, 300, Phaser.Easing.Quadratic.Out);
					uiNoteCurtain.visible = true;
				}
				uiNoteDisplayTween.start();
				uiNoteTween.start();
				uiNoteDisplayShown = !uiNoteDisplayShown;
			}

			uiNote.inputEnabled = true;
			uiNoteCurtain.inputEnabled = true;
			uiNote.events.onInputDown.add(function() {
				game.soundManager.playSound(game.Sounds.TAP);
				toggleNoteDisplay();
				//game.analytics.track("note", "clicked")
			}, this);
			uiNoteCurtain.events.onInputDown.add(toggleNoteDisplay, this);

			var textCoins = game.add.text(70, 540, "0", // TODO: hardcoded
										  {
				font: "30px yoster_islandregular",
				fill: "#ebc36f"
			});

			textCoins.setAmount = function(newAmount) {
				var diff = newAmount - parseInt(textCoins.text);
				var tmr = game.time.create(true);
				if(Math.abs(diff) > 20 || game.currentScreen === "STOCKING") {
					setTextCoinsText(newAmount);
					var twinkle = game.depthGroups.uiGroup.create(70 + Math.random() * 20, 540 + Math.random() * textCoins.width, 'ui_twinkle');
					var scale = 1.5  + Math.random() * 4;
					twinkle.scale.setTo(scale, scale);
					setTimeout(function() {
						twinkle.destroy();
					}, 50);
				} else {
					tmr.count = 0;
					tmr.loop(50, function() { 
						if (tmr.count < Math.abs(diff)) {
							setTextCoinsText(parseInt(textCoins.text) + (diff > 0 ? 1 : -1));
							tmr.count++;

							if (tmr.twinkle) { tmr.twinkle.destroy(); }
							tmr.twinkle = game.depthGroups.uiGroup.create(70 + Math.random() * 20, 540 + Math.random() * textCoins.width, 'ui_twinkle');
							var scale = 1.5  + Math.random() * 4;
							tmr.twinkle.scale.setTo(scale, scale);

						} else {
							tmr.stop();
							tmr.destroy();
							if (tmr.twinkle) { tmr.twinkle.destroy(); }
						} 

						printDebug("UI: coin text now: " + textCoins);
					}, this);
					tmr.start();
				}
			}

			var setTextCoinsText = function(amount) {
				var fontStorage = textCoins.style;
				if(parseInt(amount) >= 0) {
					fontStorage.fill = "#ebc36f";
				} else {
					fontStorage.fill = "#DC143C";
				}
				textCoins.setStyle(fontStorage);
				textCoins.setText(amount);
			}

			game.depthGroups.uiGroup.add(textCoins);

			var coinDrop = function(offer) {
				var coins = game.add.group();
				for (var i = 0; i < offer; i++) {
					coins.create(20 + Math.random() * 50, 450 + Math.random() * 30, 'ui_coin');
				}
				var coidDropTweenPos = game.add.tween(coins.position).to({
					y: coins.y + 100
				}, 800, Phaser.Easing.Quadratic.Out);
				var coidDropTweenAlp = game.add.tween(coins).to({
					alpha: 0
				}, 500);
				coidDropTweenAlp.onComplete.add(function() {
					coins.destroy();
				});

				coidDropTweenPos.start();
				coidDropTweenAlp.start();
			}

			//----------------------------------------------------------------

			//------------------------- Buttons ------------------------------

			var uiButtonAcceptCB = function() {
				if (game.dialog.main.isPrinting) {
					game.soundManager.playSound(game.Sounds.TAP);
					game.dialogManager.jumpMain();
				} else {
					game.soundManager.playSound(game.Sounds.ACCEPT);
					game.eventManager.notify(game.Events.INPUT.YES);
				}
			};
			var uiButtonRejectCB = function() {
				if (game.dialog.main.isPrinting) {
					game.soundManager.playSound(game.Sounds.TAP);
					game.dialogManager.jumpMain();
				} else {
					game.soundManager.playSound(game.Sounds.REJECT);
					game.eventManager.notify(game.Events.INPUT.NO);
				}
			};
			var uiButtonContinueCB = function() {
				game.soundManager.playSound(game.Sounds.TAP);
				if (game.dialog.main.isPrinting) {
					game.dialogManager.jumpMain();
				} else {
					game.eventManager.notify(game.Events.INPUT.CONTINUE);
				}
			};
			var uiButtonQuestionCB = function() {
				game.soundManager.playSound(game.Sounds.TAP);
				if (uiButtonQuestion.alpha != 1) {
					uiButtonQuestion.fadeIn.stop();
					uiButtonQuestion.alpha = 1;
				}
				// TODO: 
				//game.analytics.track("question", "toggled");
				game.questionManager.toggleQuestions();
			};

			var uiButtonAccept = game.add.button(660, 420, 'ui_button_accept',
												 uiButtonAcceptCB, this, 1, 0, 2);
			var uiButtonReject = game.add.button(660, 480, 'ui_button_reject',
												 uiButtonRejectCB, this, 1, 0, 2);
			var uiButtonQuestion = game.add.button(800, 540, 'ui_button_question',
												   uiButtonQuestionCB, this, 1, 0, 2);
			var uiButtonContinue = game.add.button(660, 440,
												   'ui_button_continue',
												   uiButtonContinueCB, this, 1, 0, 2);

			game.depthGroups.uiGroup.add(uiButtonAccept);
			game.depthGroups.uiGroup.add(uiButtonReject);
			game.depthGroups.uiGroup.add(uiButtonQuestion);
			game.depthGroups.uiGroup.add(uiButtonContinue);

			uiButtonAccept.scale.setTo(2, 2);
			uiButtonReject.scale.setTo(2, 2);

			uiButtonQuestion.scale.setTo(2, 2);
			uiButtonQuestion.alpha = 0;
			uiButtonQuestion.fadeIn = game.add.tween(uiButtonQuestion).to({
				alpha: 0.9
			}, 500, Phaser.Easing.Linear.None, false, 0, 1000, true);
			uiButtonQuestion.dragIn = game.add.tween(uiButtonQuestion).to({
				x: 660
			}, 500, Phaser.Easing.Linear.None, false);

			uiButtonAccept.smoothed = false;
			uiButtonReject.smoothed = false;
			uiButtonQuestion.smoothed = false;

			function switchButtons(isInteract) {
				uiButtonAccept.visible = isInteract;
				uiButtonReject.visible = isInteract;
				if (game.tutorial.questionVisible) {
					uiButtonQuestion.visible = isInteract;
				}
				uiButtonContinue.visible = !isInteract;
			}

			function toggleButtons(isEnabled) {
				uiButtonAccept.inputEnabled = isEnabled;
				uiButtonReject.inputEnabled = isEnabled;
				uiButtonQuestion.inputEnabled = isEnabled;
				uiButtonContinue.inputEnabled = isEnabled;
			}

			//----------------------Upgrades--------------------------

			var fireworks = game.add.emitter(0, 0, 200);
			fireworks.makeParticles('ui_coin');
			fireworks.gravity = 130;

			function makeFireworks() {
				fireworks.x = 100;
				fireworks.y = 75;
				fireworks.start(true, 4000, null, 50);

				fireworks.x = game.width - 100;
				fireworks.y = 75;
				fireworks.start(true, 4000, null, 50);
			}

			/*function tintBackground(tintVal) {
				game.displayManager.tintClouds(tintVal);
				game.depthGroups.envGroup.setAll('tint', tintVal);
			}

			function tintClock(tintVal) {
				for (var i = 0; i < game.clockUI.length; i++) {
					game.clockUI[i].tint = tintVal;
				}
			}
			var tinted = 0xFFFFFF;

			function tintAll(tintVal) {
				tinted = tintVal;
				game.displayManager.tintClouds(tintVal);
				if (tintVal == 0xFFFFFF) {
					game.displayManager.tintJeffBox(false);
				} else {
					game.displayManager.tintJeffBox(true);
				}
				game.dialog.main.box.tint = tintVal;
				uiNoteLayer.setAll('tint', tintVal);
				currNPC.tint = tintVal;
				uiDeskBg.tint = tintVal;
				uiQuestionLayer.setAll('tint', tintVal);
				game.uiItemGroup.setAll('tint', tintVal);
				game.depthGroups.titleGroup.setAll('tint', tintVal);
				game.depthGroups.envGroup.setAll('tint', tintVal);
				game.displayManager.imgBackgroundSky.setAll('tint', tintVal);
				game.depthGroups.dialogGroup.setAll('tint', tintVal);
				for(var i = 0; i < game.depthGroups.dialogGroup.children.length; i++) {
					if (game.depthGroups.dialogGroup.children[i].children != undefined)
						game.depthGroups.dialogGroup.children[i].setAll('tint', tintVal);
				}
				game.depthGroups.shopGroup.setAll('tint', tintVal);
				game.depthGroups.questionGroup.setAll('tint', tintVal);
				game.depthGroups.uiGroup.setAll('tint', tintVal);
                game.depthGroups.frontGroup.setAll('tint', tintVal);
                for(var i = 0; i < game.depthGroups.frontGroup.children.length; i++) {
					if (game.depthGroups.frontGroup.children[i].children != undefined)
						game.depthGroups.frontGroup.children[i].setAll('tint', tintVal);
				}
				uiDeskBgLayer.setAll('tint', tintVal);
				uiAvatarLayer.setAll('tint', tintVal);
				uiDeskLayer.setAll('tint', tintVal);
				uiDialogLayer.setAll('tint', tintVal);
			}*/

			// --------------------------- Upgrades -----------------------
			//TODO: make this create based off of upgrades taken from stock.nextUpgrades
			var currUpgrade = 0;
			var currShop = 0;
			var upgradeGroup = game.add.group();
			var uiLevelUp = game.add.sprite(game.world.centerX, 20, 'ui_levelup');
			uiLevelUp.scale.setTo(0.75, 0.75);
			uiLevelUp.x -= uiLevelUp.width / 2 - 12;
			uiLevelUp.visible = false;

			var upgradeIndexes = {};

			function initUpgradeIndexes(indexes) {
				for(var key in upgrades) {
					indexes[key] = 0;
				}
			}

			function createUpgrades(ups, names) {
				var used = names[currUpgrade] || ['time'];
				for (var i = 0; i < used.length; i++) {
					var but = game.add.button(game.world.centerX, game.world.centerY + 100, 
											  "upgrade_" + used[i], acceptUpgrade, this, 1, 0, 0);
					but.x -= ((but.width + 10 ) * (used.length)) / 2 - ((but.width + 10) * i);
					but.y -= but.height / 2;
					but.nextVisual = "shop_" + (upgrades[used[i]][currShop] ||
												upgrades[used[i]][upgrades[used[i]].length - 1]).name;
					but.nextPos = (upgrades[used[i]][currShop]|| 
								   upgrades[used[i]][upgrades[used[i]].length - 1]).position;
					but.visible = true;
					but.inputEnabled = true;
					but.descText = game.add.text(but.x + 65 - 200, but.y + 120,
												 (upgrades[used[i]][currShop] ||
												  upgrades[used[i]][upgrades[used[i]].length - 1]).effect
												 + "\n\n" +
												 (upgrades[used[i]][currShop] ||
												  upgrades[used[i]][upgrades[used[i]].length - 1]).description 
												 ,
												 // ,
												 {
						font: "20px yoster_islandregular",
						fill: '#d3af7a',
						wordWrap: true, wordWrapWidth: 400, align: "center"
					});
					but.descText.visible = false;
					but.events.onInputOver.add(function(but) { but.descText.visible = true;}, but);
					but.events.onInputOut.add(function(but) { but.descText.visible = false;}, but);
					upgradeGroup.add(but.descText);
					upgradeGroup.add(but);
				}
				currUpgrade++;
			}

			function acceptUpgrade(sprite, pointer) {
				game.soundManager.playSound(game.Sounds.BLIP);
				game.eventManager.notify(game.Events.LEVEL.ACCEPT, sprite.key);
				if (sprite.key.indexOf("shop") > 0) {
					shop.kill();
					shop = game.add.sprite(sprite.nextPos[0], sprite.nextPos[1], sprite.nextVisual);
					shop.smoothed = false;
					shop.alpha = 1;
					shop.visible = true;
					game.depthGroups.shopGroup.add(shop);
					currShop++;
					//shop.shopFadeTween.start();
				}
				fireworks.x = sprite.x + sprite.width / 2;
				fireworks.y = sprite.y + sprite.height / 2;
				fireworks.start(true, 1000, null, 15);
				toggleUpgrades(false);
			}

			function toggleUpgrades(isEnabled) {
				toggleButtons(!isEnabled);
				if (isEnabled) {
					game.displayManager.toggleScreenShade(true);
					game.soundManager.playSound(game.Sounds.POWERUP);
					makeFireworks();
					upgradeGroup = game.add.group();
					createUpgrades(upgradeGroup, upgradeSequence);
					//tintAll(0x191919);
					game.dayTimer.pause();
				} else {
					game.displayManager.toggleScreenShade(false);
					//tintAll(0xFFFFFF);
					game.dayTimer.resume();
					upgradeGroup.visible = false;
					upgradeGroup.callAll('kill');
				}
				uiLevelUp.visible = isEnabled;
			}

			// ---------------------- EXP bar ------------------------
			var exp = game.add.graphics(15, game.height / 2 - 6);
			game.depthGroups.uiGroup.add(exp);

			exp.lineStyle(1, 0x4d372c, 1);
			exp.beginFill(0xffffca, 0.5);
			exp.startx = exp.x;
			exp.starty = exp.y;
			exp.currwidth = 0;
			exp.barwidth = 177 - 15;
			exp.barheight = 9;
			exp.drawRect(exp.startx, exp.starty, 2, exp.barheight);
			// exp bar on 15, game.height / 2 - 6 to to 177 

			function drawExp(amount) {
				exp.clear();
				exp.lineStyle(1, 0x4d372c, 1);
				exp.beginFill(0xffffca, 0.5);
				// TODO: add animation to draw exp bar
				exp.drawRect(exp.startx, exp.starty,
							 exp.barwidth * amount, exp.barheight);
			}

			//--------------------- Current NPC ----------------------//
			var currNPC;
			var currNPCIn;
			var currNPCOut;
			var npcHandsBg;
			var npcHands;

			var setNPCTween = function() {
				var npcPos = {
					x: 20,
					y: 360
				};
				currNPCIn = game.add.tween(currNPC).from({
					x: currNPC.x - 300,
					y: currNPC.y + 300
				}, 550, Phaser.Easing.Quadratic.Out);
				currNPCOut = game.add.tween(currNPC).to({
					x: 320,
					y: 660
				}, 550);
				currNPCHit = game.add.tween(currNPC).to({
					x: currNPC.x + 10
				}, 30)
					.to({
					x: currNPC.x - 10,
					y: currNPC.y
				}, 60)
					.to({
					x: currNPC.x + 10,
					y: currNPC.y
				}, 60)
					.to({
					x: currNPC.x,
					y: currNPC.y
				}, 30);

				currNPCOut.onComplete.add(function() {
					currNPC.destroy();
				}, this);
			}

			var currNPCHitStart = function() {
				if (currNPC && currNPCHit) {
					printDebug('currNPC.x: ' + currNPC.x);
					currNPCHit.start();
					printDebug('currNPC.x: ' + currNPC.x);
					printDebug(currNPC);
				}
			}

			///////////////////////////// Backend ///////////////////////////

			initBackend(game);

			game.tutorial = {
				questionVisible: false
			};

			var isBeginningDayToggle = false;

			uiButtonAccept.visible = false;
			uiButtonReject.visible = false;
			uiButtonQuestion.visible = false;
			uiNote.visible = false;

			game.eventManager.register(game.Events.DAY.START, function(data) {
				// Turn on cloud generation
				game.soundManager.stopSound();
				//game.soundManager.stopMusic();
				game.displayManager.toggleCloudGeneration(true);
				game.displayManager.togglePedestGeneration(true);

				// Set up day game
				game.questionManager.populateQuestions(data.questions, uiQuestionLayer);
				game.uiItemGroup.callAll('kill');
				uiPutItemSlots(game.playerState.getNumSlots(), game.playerState.getStockedItems());
				heroClueText.text = formatClues(data.clues.hero);
				crisisClueText.text = formatClues(data.clues.crisis);
				uiCalendarDay.text = (game.interactionManager.getCurrentDay() + 1).toString();

				if ((game.interactionManager.getCurrentDay() || 0) > 0 && !(uiNoteDisplayShown || false)) {
					toggleNoteDisplay();
					isBeginningDayToggle = true;
				}
			});
			//game.eventManager.register(game.Events.TIMER.PAUSE, tintClock);
			//game.eventManager.register(game.Events.TIMER.RESUME, tintClock);

			function formatClues(clues) {
				var retString = "";
				for (var i = 0; i < clues.length; i++) {
					if (clues[i] !== "") {
						retString += "> " + clues[i] + "\n";
					}
				}
				return retString;
			}

			game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer, isRepeat) {
				switchButtons(true);
				game.dayTimer.pause();
				game.dialog.main.isPrinting = true;
				game.dialogManager.printMain(offer, isRepeat, function() {
					game.dayTimer.resume();
					game.dialog.main.isPrinting = false;
				});
			});

			game.eventManager.register(game.Events.LEVEL.EXPUP, drawExp);
			game.eventManager.register(game.Events.LEVEL.LEVELUP, function() {
				toggleUpgrades(true);
			});
			game.eventManager.register(game.Events.INPUT.NO, currNPCHitStart);
			game.eventManager.register(game.Events.INVENTORY.SOLD, function(item, offer) {
				coinDrop(offer);
				if (game.playerState.getAvalItems().indexOf(item) >= 0) {
					var string = "";
					var itemDupl = game.add.sprite(14, 14, 'item_' + item);
					itemDupl.scale.setTo(2, 2);
					itemDupl.smoothed = false;
					var itemTweenScale = game.add.tween(itemDupl.scale).to({
						x: 8,
						y: 8
					}, 700, Phaser.Easing.Linear.None, true);
					var itemTween = game.add.tween(itemDupl).to({
						x: 50,
						y: 450,
						alpha: 0
					}, 700, Phaser.Easing.Quadratic.Out, true);

					itemTween.onComplete.add(function() {
						itemDupl.destroy();
					});
					itemTween.start();
					itemTweenScale.start();
				}
			});

			game.eventManager.register(game.Events.UPDATE.ITEMS, function(items) {
				for(var item in items) {
					if (uiItemNums[item] != undefined) {
						uiItemNums[item].setText((game.playerState.getItems()[item] || 0).toString());
					}
				}
			});

			game.eventManager.register(game.Events.UPDATE.GOLD, function(gold) {
				textCoins.setAmount(gold);
				game.displayManager.updateCoins();
			});

			game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
				switchButtons(false);
				game.dayTimer.pause();
				//toggleButtons(false);
				game.dialog.main.isPrinting = true;
				game.dialogManager.printMain(dialog, false, function() {
					game.dialog.main.isPrinting = false;
					//toggleButtons(true);
				});
			});

			game.eventManager.register(game.Events.TUTORIAL.BEGIN, function() {
				uiNote.visible = true;
				uiNote.alpha = 0;
				uiNote.fadeIn = game.add.tween(uiNote).to({
					alpha: 0.9
				}, 500, Phaser.Easing.Linear.None, false, 0, 1000, true);
				uiNote.dragIn = game.add.tween(uiNote).to({
					y: 535
				}, 500, Phaser.Easing.Linear.None, false);
				uiNote.shake = game.add.tween(uiNote.position).to({
					x : '10'
				}, 100, Phaser.Easing.Quadratic.None, false, 0, 1000, true);
				uiNote.fadeIn.start();
				uiNote.shake.start();
				uiNote.visible = false;
				uiNote.dragIn.start();
				uiNote.dragIn.onComplete.addOnce(function() {
					uiNote.visible = true;
					toggleNoteDisplay();
				});
				game.tutorial.questionVisible = true;
				uiButtonQuestion.fadeIn.start();
				uiButtonQuestion.dragIn.start();
			});

			game.eventManager.register(game.Events.TUTORIAL.FAILED, function() {
				// Oh my god, I'm so sorry for this code. It's the only way though.
				if(game.playerState.getGold() <= 1) {
					game.analytics.set('dimension3', "inexperiened");
					game.conditionManager.set('jeffReminder');
					game.analytics.track("interaction", "jeffReminder");
				} else {
					game.analytics.set('dimension3', "experiened");
				}
			});

			game.eventManager.register(game.Events.DOG.APPEAR, function() {
				game.kongregate.submit('Dog', 1);
				game.analytics.track('dog', 'got');
				game.displayManager.dog.visible = true;
			});

			game.reset.register(function() {
				game.displayManager.dog.visible = false;
			});

			game.eventManager.register(game.Events.INTERACT.NEW, 
									   function(appearanceInfo, voice, appearSong, handsInfo, handsTime) {
				// This function returns a BitmapData generated with the given indices of 
				// body part images.
				/** NOTE: The size of the avatar frame is 168x198 **/
				game.dialog.main.freeze(true);
				game.dialogManager.setMainSound(voice);
				game.questionManager.hideQuestions();
				toggleButtons(false);

				printDebug("GENERATING NPC IMG: " + appearanceInfo);

				var isRandom = false;
				var animFunc = null; 	// Function for moving parts
				switch (appearanceInfo) {
					case 'jeff':
						appearanceInfo = 'gp_jeff_big';
						break;
					case 'dog':
						appearanceInfo = 'gp_dog_set';
						animFunc = function(layer) {
							// TODO: Create tails, tounges, claws, and make tweens for them?
						}
						break;
					case 'artifact':
						appearanceInfo = 'hero_artifact';
						break;
					case 'cloak':
						appearanceInfo = 'hero_cloak';
						break;
					case 'cloak_stache':
						appearanceInfo = 'hero_cloak_stache';
						break;
					case 'guardian':
						appearanceInfo = 'hero_guardian';
						break;
					case 'king_zoran':
						appearanceInfo = 'hero_king_zoran';
						break;
					case 'treasure_hunter':
						appearanceInfo = 'hero_treasure_hunter';
						break;
					default:
						isRandom = true;
						break;
				}

				function parseSkinColor(str) {
					str = str.substring(str.indexOf('skin') + 6, str.length - 1);
					var cArr = str.split(',');
					return {
						r: parseFloat(cArr[0]), 
						g: parseFloat(cArr[1]),
						b: parseFloat(cArr[2])
					};
				}

				// NOTE: position at (20, 360)
				var showNPC = function() {
					var npcAssetId;
					var skinColor = parseSkinColor(appearanceInfo);

					if (isRandom) {
						npcAssetId = game.displayManager.drawRandomNPC(
							appearanceInfo.substring(0, appearanceInfo.indexOf('skin') - 1), 
							skinColor
						);

					} else {
						npcAssetId = appearanceInfo;
					}

					currNPC = uiAvatarLayer.create(20, 360, npcAssetId);
					//currNPC.tint = tinted;

					if (handsInfo && handsInfo.substring() && handsInfo.length == 10) {
						// If we are generating fingers
						var npcHandsBmd = game.displayManager.generateNPCHands(
							handsInfo.substring(0, 5), handsInfo.substring(5, 10), skinColor);
						npcHandsBg = uiAvatarLayer.create(20, 600-59, 'ui_hands_background');
						npcHands = uiAvatarLayer.create(50, 600, npcHandsBmd);

						npcHandsBg.anchor.setTo(0, 1);
						npcHandsBg.scale.setTo(3, 3);
						npcHandsBg.alpha = 0;
						npcHandsBg.visible = false;

						npcHands.tweenIn = game.add.tween(npcHands).to( {y: 390}, 500);
						npcHands.tweenOut = game.add.tween(npcHands).to( {y: 600}, 300);

						npcHands.tweenVisible = game.add.tween(npcHandsBg).to( {alpha: 1}, 500);
						npcHands.tweenInvisible = game.add.tween(npcHandsBg).to( {alpha: 0}, 250);

						npcHands.tweenIn.onComplete.addOnce(function() {
							game.time.events.add(
								Phaser.Timer.SECOND * (handsTime ? handsTime : 1.5),
								function() {npcHands.tweenOut.start();},
								this
							);
						});

						npcHands.tweenOut.onComplete.addOnce(function() {
							npcHandsBg.visible = false;
							npcHands.destroy();
							npcHandsBg.destroy();
						});
					}


					// TODO: probably create all moving parts here?
					// 		 and make currNPC a group?

					setNPCTween();


					if (isRandom) {
						currNPC.scale.setTo(3, 3);
					} else {
						switch (npcAssetId) {
							case 'gp_jeff_big':
								currNPC.scale.setTo(2, 2);
								break;
							case 'gp_dog_set':
								currNPC.scale.setTo(1.5, 1.5);
								break;
						}
						currNPC.smoothed = false;
					}
					currNPCIn.onComplete.add(function() {
						if (handsInfo) { 
							npcHandsBg.visible = true;
							npcHands.tweenIn.start();
							npcHands.tweenVisible.start();
						}
						toggleButtons(true);
						game.dialog.main.freeze(false);
						if(appearSong && appearSong !== "KILLMUSIC") {
							var song = game.Music[appearSong];
							if(song) {
								game.soundManager.playMusic(song);
							}
						}
					})
					currNPCIn.start();
				}

				if (currNPC) {
					if (npcHands) { 
						npcHands.tweenOut.start(); 
						npcHands.tweenInvisible.start();
					}
					currNPCOut.start();
					currNPCOut.onComplete.addOnce(showNPC);
					currNPCOut.onComplete.addOnce(function() {
						if(appearSong) {
							game.soundManager.stopMusic(200);
						}
					});
					// This is a bit of an ugly hack, sorry. - Kyle
					if(uiNoteDisplayShown && !isBeginningDayToggle) {
						toggleNoteDisplay();
					} else {
						isBeginningDayToggle = false;
					}
				} else {
					showNPC(isRandom);
				}
			});

			game.eventManager.register(game.Events.DAY.END, function() {
				game.displayManager.toggleCloudGeneration(false);
				game.displayManager.togglePedestGeneration(false);
				if(uiNoteDisplayShown) {
					toggleNoteDisplay();
				}
			});

			beginGame(game);

		},

		update: function() {
			uiFunnelSetTime(game.dayTimer.getPercent());
			uiFunnelSandTop.updateCrop();
			uiFunnelSandButtom.updateCrop();
			game.displayManager.updateSunPosition(game.dayTimer.getPercent());
			game.displayManager.updateSky(game.dayTimer.getPercent());
		}

	};
}