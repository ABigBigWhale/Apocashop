var gameConfig = {
    DEBUG_MODE: true,
    RESOLUTION: [800, 600]
};

document.addEventListener('DOMContentLoaded', function() {
    // Do stuff...

    var game = new Phaser.Game(
        gameConfig.RESOLUTION[0],
        gameConfig.RESOLUTION[1], // Resolution
        Phaser.AUTO, // Rendering context
        'gameDiv', // DOM object to insert canvas
        {
            preload: preload,
            create: create,
            update: update
        } // Function references
    );

    if (gameConfig.DEBUG_MODE) window.debugGame = game;

    function preload() {
        // Makes sure the font is loaded before we initialize any of the actual text.
        game.add.text(1000, 1000, "fix", {
            font: "1px yoster_islandregular",
            fill: "#FFFFFF"
        });

        ///////////////////////////// Assets ///////////////////////////
        game.assetManager = new AssetManager(game);
        game.assetManager.load();
    }

    var uiFunnelSandTop;
    var uiFunnelSandButtom;
    var uiFunnelSetTime;
    // TODO: Lots of hard-coding right now
    function create() {
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        game.stage.smoothed = false;

        game.stage.backgroundColor = '#447474';

        var imgBackground = game.add.image(0, 0, 'gp_background');

        game.depthGroups = {
            shopGroup: game.add.group()
        };

        var shopkeeper = game.add.sprite(500, 272, 'gp_shopkeeper');

        var shop = game.add.sprite(0, 0, 'shop_rock');
        shop.smoothed = false;
        shop.alpha = 0;
        var shop_fade_tween = game.add.tween(shop).to({
            alpha: 1
        }, 2000, Phaser.Easing.Linear.None, false);
        shop.visible = false;
        setPositionLowerMiddle(shop, shopkeeper);

        var jeff = game.add.sprite(shopkeeper.x + 35, 277, 'gp_jeff_noshadow');
        jeff.floating = game.add.tween(jeff).to({
            y: 260
        }, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);
        var jeffshadow = game.add.sprite(shopkeeper.x + 43, shopkeeper.y + shopkeeper.height - 7, 'gp_jeff_shadow');
        jeffshadow.alpha = 0.6;
        jeffshadow.fadeIn = game.add.tween(jeffshadow).to({
            alpha: 0.2
        }, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);


        ///////////////////////////// UI elems ///////////////////////////

        //-------------------------- Item slots --------------------------
        for (var i = 0; i < 1; i++) {
            var uiItemslot = game.add.sprite(10, 10 + 50 * i, 'ui_itemslot');
            uiItemslot.anchor.setTo(0, 0);
        }
        // TODO: demo use only
        var itemSword = game.add.sprite(14, 14, 'item_sword');
        var itemCountSword = game.add.text(64, 16, '5', // TODO: much hard-coding...
            {
                font: "20px yoster_islandregular",
                fill: '#d3af7a'
            });
        itemSword.scale.setTo(2, 2);
        itemSword.smoothed = false;

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

        printDebug("RECT: " + uiFunnelSandTopCrop.toString());

        var uiFunnel = game.add.sprite(uiFunnelPos.x, uiFunnelPos.y, 'ui_funnel');

        uiFunnelSandTop.crop(uiFunnelSandTopCrop);
        uiFunnelSandButtom.crop(uiFunnelSandButtomCrop);
				
				uiFunnelSetTime = function(ratio) {
					uiFunnelSandTopCrop.y = (1 - ratio) * uiFunnelSandTop.height;
					uiFunnelSandTopCrop.height = ratio * uiFunnelSandTop.height;
					uiFunnelSandButtomCrop.y = ratio * uiFunnelSandButtom.height;
					uiFunnelSandButtomCrop.height = (1 - ratio) * uiFunnelSandButtom.height;
				};

        //------------------------- Notes & Clues ------------------------
        var uiNoteLayer = game.add.group();
        var uiNoteDisplay = uiNoteLayer.create(800, 1000, 'ui_note_big');
        uiNoteDisplay.smoothed = false;
        uiNoteDisplay.anchor.setTo(1, 1);

        var crisisClueText = game.add.text(240, 650, "HELLO THERE", // TODO: hardcoded
            {
                font: "18px yoster_islandregular",
                fill: "#4d372c",
                wordWrap: true,
                wordWrapWidth: 250
            });
        uiNoteLayer.add(crisisClueText);

        var heroClueText = game.add.text(525, 650, "HELLO THERE", // TODO: hardcoded
            {
                font: "18px yoster_islandregular",
                fill: "#4d372c",
                wordWrap: true,
                wordWrapWidth: 250
            });
        uiNoteLayer.add(heroClueText);

        var uiNoteDisplayShown = false;

        //------------------------- Question options ---------------------
        var uiQuestionLayer = game.add.group();

        //------------------------- Desk & Avatar ------------------------

        var uiDeskBgLayer = game.add.group();
        var uiAvatarLayer = game.add.group();
        var uiDeskLayer = game.add.group();
        var uiDialogLayer = game.add.group();

        var uiDialog = uiDialogLayer.create(800, 600, 'ui_dialog');
        var uiDeskBg = uiDeskBgLayer.create(0, 600, 'ui_table_background');
        var uiDesk = uiDeskLayer.create(0, 600, 'ui_table');
        uiDialog.anchor.setTo(1, 1);
        uiDesk.anchor.setTo(0, 1);
        uiDeskBg.anchor.setTo(0, 1);

        var uiNote = game.add.sprite(145, 600, 'ui_note');

        var toggleNoteDisplay = function() {
            printDebug("UI: note clicked; shown: " + uiNoteDisplayShown);
            if (uiNote.alpha != 1) {
                uiNote.fadeIn.stop();
                uiNote.alpha = 1;
            }
            var uiNoteDisplayTween;
            var uiNoteTween;

            if (uiNoteDisplayShown) { // Out
                uiNoteDisplayTween = game.add.tween(uiNoteLayer.position)
                    .to({
                        y: '+600'
                    }, 300, Phaser.Easing.Quadratic.Out);
                uiNoteTween = game.add.tween(uiNote).to({
                    y: '-200'
                }, 200, Phaser.Easing.Quadratic.Out);
            } else { // In
                uiNoteDisplayTween = game.add.tween(uiNoteLayer.position)
                    .to({
                        y: '-600'
                    }, 200, Phaser.Easing.Quadratic.In);
                uiNoteTween = game.add.tween(uiNote).to({
                    y: '+200'
                }, 300, Phaser.Easing.Quadratic.Out);
            }
            uiNoteDisplayTween.start();
            uiNoteTween.start();
            uiNoteDisplayShown = !uiNoteDisplayShown;
        }

        uiNote.inputEnabled = true;
        uiNoteDisplay.inputEnabled = true;
        uiNote.events.onInputDown.add(toggleNoteDisplay, this);
        uiNoteDisplay.events.onInputDown.add(toggleNoteDisplay, this);

        var textCoins = game.add.text(60, 540, "0", // TODO: hardcoded
            {
                font: "30px yoster_islandregular",
                fill: "#ebc36f"
            });
        var coinDrop = function(offer) {
            var coins = game.add.group();
            for (var i = 0; i < offer; i++) {
                coins.create(20 + Math.random() * 50, 450 + Math.random() * 30, 'ui_coin');
            }
            var coidDropTweenPos = game.add.tween(coins.position).to({
                y: coins.y + 100
            }, 800, Phaser.Easing.Quadratic.Out);
            var coidDropTweenAlp = game.add.tween(coins.alpha).to({
                alpha: 0.5
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
                game.dialogManager.jumpMain();
            } else {
                game.eventManager.notify(game.Events.INPUT.YES)
            }
        };
        var uiButtonRejectCB = function() {
            if (game.dialog.main.isPrinting) {
                game.dialogManager.jumpMain();
            } else {
                game.eventManager.notify(game.Events.INPUT.NO)
            }
        };
        var uiButtonContinueCB = function() {
            if (game.dialog.main.isPrinting) {
                game.dialogManager.jumpMain();
            } else {
                game.eventManager.notify(game.Events.INPUT.CONTINUE)
            }
        };
        var uiButtonQuestionCB = function() {
            if (uiButtonQuestion.alpha != 1) {
                uiButtonQuestion.fadeIn.stop();
                uiButtonQuestion.alpha = 1;
            }
            game.questionManager.toggleQuestions();
        }

        var uiButtonAccept = game.add.button(660, 420, 'ui_button_accept',
            uiButtonAcceptCB, this, 1, 0, 2);
        var uiButtonReject = game.add.button(660, 480, 'ui_button_reject',
            uiButtonRejectCB, this, 1, 0, 2);
        var uiButtonQuestion = game.add.button(800, 540, 'ui_button_question',
            uiButtonQuestionCB, this, 1, 0, 2);
        var uiButtonContinue = game.add.button(660, 440,
            'ui_button_continue',
            uiButtonContinueCB, this, 1, 0, 2);

        uiButtonAccept.scale.setTo(2, 2);
        uiButtonReject.scale.setTo(2, 2);

        uiButtonQuestion.scale.setTo(2, 2);
        uiButtonQuestion.alpha = 0;
        uiButtonQuestion.fadeIn = game.add.tween(uiButtonQuestion).to({
            alpha: 0.9
        }, 1000, Phaser.Easing.Linear.None, false, 0, 1000, true);
        uiButtonQuestion.dragIn = game.add.tween(uiButtonQuestion).to({
            x: 660
        }, 1000, Phaser.Easing.Linear.None, false);

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

        function setPositionLowerMiddle(shop, player) {
            shop.position.copyFrom(player);
            shop.position.y += player.height - shop.height / 2;
            shop.position.x += (player.width / 2) - (shop.width / 2);
        }


        //----------------------Upgrades--------------------------

        var fireworks = game.add.emitter(0, 0, 100);
        fireworks.makeParticles('ui_coin');
        fireworks.gravity = 200;

        function makeFireworks() {
            fireworks.x = 100;
            fireworks.y = 100;
            fireworks.start(true, 1500, null, 25);

            fireworks.x = game.width - 100;
            fireworks.y = 100;
            fireworks.start(true, 1500, null, 20);
        }

        function tintAll(tintVal) {
            uiButtonContinue.tint = tintVal;
            uiButtonAccept.tint = tintVal;
            uiButtonQuestion.tint = tintVal;
            uiButtonReject.tint = tintVal;
            uiNote.tint = tintVal;
            uiDesk.tint = tintVal;
            uiDialog.tint = tintVal;
            imgBackground.tint = tintVal;
            currNPC.tint = tintVal;
            uiDeskBg.tint = tintVal;
        }

        function toggleUpgrades() {
            var isEnabled = uiButtonAccept.inputEnabled && uiButtonContinue.inputEnabled;
            toggleButtons(!isEnabled);
            if (isEnabled) {
                makeFireworks();
                tintAll(0xA9A9A9);
            } else {
                tintAll(0xFFFFFF);
            }
            uiLevelUp.visible = isEnabled;
            for (var i = 0; i < upgrades.length; i++) {
                upgrades[i].inputEnabled = isEnabled;
                upgrades[i].visible = isEnabled;
            }
        }

        // --------------------------- Upgrades -----------------------
        //TODO: make this create based off of upgrades taken from stock.nextUpgrades
        var upgradeNames = ['upgrade_shop'];

        var upgrades = [];
        createUpgrades(upgrades, upgradeNames);
        var uiLevelUp = game.add.sprite(game.world.centerX, 20, 'ui_levelup');
        uiLevelUp.scale.setTo(0.75, 0.75);
        uiLevelUp.x -= uiLevelUp.width / 2 - 12;
        uiLevelUp.visible = false;

        function createUpgrades(ups, names) {
            for (var i = 0; i < names.length; i++) {
                var but = game.add.button(game.world.centerX, game.world.centerY + 100, names[i], acceptUpgrade, this, 1, 0, 0);
                but.x -= but.width / 2;
                but.y -= but.height / 2;
                but.visible = false;
                but.inputEnabled = false;
                ups.push(but);
            }
        }

        function acceptUpgrade(sprite, pointer) {
            game.eventManager.notify(game.Events.LEVEL.ACCEPT, sprite.key);
            if (sprite.key.indexOf("shop") > 0) {
                shop_fade_tween.start();
                shop.visible = true;
            }
            fireworks.x = sprite.x + sprite.width / 2;
            fireworks.y = sprite.y + sprite.height / 2;
            fireworks.start(true, 1000, null, 15);
            toggleUpgrades();
        }

        // ---------------------- EXP bar ------------------------
        var exp = game.add.graphics(15, game.height / 2 - 6);
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
        initNPCGen(game);

        uiButtonAccept.visible = false;
        uiButtonReject.visible = false;
        uiButtonQuestion.visible = false;
        uiNote.visible = false;

        game.eventManager.register(game.Events.DAY.START, function(data) {
            game.questionManager.populateQuestions(data.questions, uiQuestionLayer);
            heroClueText.text = formatClues(data.clues.hero);
            crisisClueText.text = formatClues(data.clues.crisis);
        });

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
            game.dialog.main.isPrinting = true;
            game.dialogManager.printMain(offer, isRepeat, function() {
                game.dialog.main.isPrinting = false;
            });
        });

        game.eventManager.register(game.Events.LEVEL.EXPUP, drawExp);
        game.eventManager.register(game.Events.LEVEL.LEVELUP, toggleUpgrades);
        game.eventManager.register(game.Events.INPUT.NO, currNPCHitStart);
        game.eventManager.register(game.Events.INVENTORY.SOLD, function(item, offer) {
            coinDrop(offer);
            var string = "";
            var itemDupl = game.add.sprite(14, 14, 'item_' + item);
            itemDupl.scale.setTo(2, 2);
            itemDupl.smoothed = false;
            var itemTweenScale = game.add.tween(itemDupl.scale).to({
                x: 8,
                y: 8
            }, 550, Phaser.Easing.Linear.None, true);
            var itemTween = game.add.tween(itemDupl).to({
                x: 50,
                y: 450,
                alpha: 0
            }, 550, Phaser.Easing.Quadratic.Out, true);

            itemTween.onComplete.add(function() {
                itemDupl.destroy();
            });
            itemTween.start();
            itemTweenScale.start();
        });

        game.eventManager.register(game.Events.UPDATE.ITEMS, function(items) {
        	for(var item in items) {
        		if(item === 'sword') {
        			itemCountSword.setText(items[item]);
        		}
        	}
        });

        game.eventManager.register(game.Events.UPDATE.GOLD, function(gold) {
            textCoins.setText(gold);
        });

        game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
            switchButtons(false);
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
            }, 1000, Phaser.Easing.Linear.None, false, 0, 1000, true);
            uiNote.dragIn = game.add.tween(uiNote).to({
                y: 535
            }, 1000, Phaser.Easing.Linear.None, false);
            uiNote.fadeIn.start();
            uiNote.dragIn.start();
            game.tutorial.questionVisible = true;
            uiButtonQuestion.fadeIn.start();
            uiButtonQuestion.dragIn.start();
        });

        game.eventManager.register(game.Events.INTERACT.NEW, function(appearanceInfo) {
            // This function returns a BitmapData generated with the given indices of 
            // body part images.
            /** NOTE: The size of the avatar frame is 168x198 **/
            game.dialog.main.freeze(true);
            game.questionManager.hideQuestions();
            toggleButtons(false);

            printDebug("GENERATING NPC IMG: " + appearanceInfo);
            var isRandom = false;
            switch (appearanceInfo) {
                case 'jeff':
                    appearanceInfo = 'gp_jeff_big';
                    break;
                default:
                    isRandom = true;
                    break;
            }

            var drawRandomNPC = function(game, appearanceInfo) {
                var npcBmd = game.add.bitmapData(60, 70);
                var parts = appearanceInfo.split(',');
                for (var i = 0; i < parts.length; i++) {
                    var partArr = parts[i].split('|');
                    var partName = partArr[0];
                    var partNumb = parseInt(partArr[1]);
                    npcBmd.draw('npc-' + partName + '-' + partNumb);
                }

                return npcBmd;
            }

            // NOTE: position at (20, 360)
            var showNPC = function() {
                var npcAssetId;
                if (isRandom) {
                    npcAssetId = drawRandomNPC(game, appearanceInfo);
                } else {
                    npcAssetId = appearanceInfo;
                }
                currNPC = uiAvatarLayer.create(20, 360, npcAssetId);
                setNPCTween();
                if (isRandom) currNPC.scale.setTo(3, 3);
                else {
                    currNPC.scale.setTo(2, 2);
                    currNPC.smoothed = false;
                }
                currNPCIn.onComplete.add(function() {
                    toggleButtons(true);
                    game.dialog.main.freeze(false);
                })
                currNPCIn.start();
            }

            if (currNPC) {
                currNPCOut.start();
                currNPCOut.onComplete.add(showNPC);
            } else {
                showNPC(isRandom);
            }
        });

        beginGame(game);

    }

    function update() {
				uiFunnelSetTime(game.interactionManager.dayTimer.getPercent());
        uiFunnelSandTop.updateCrop();
        uiFunnelSandButtom.updateCrop();
    }

}, false);