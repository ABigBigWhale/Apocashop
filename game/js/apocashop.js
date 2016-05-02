var gameConfig = {
	DEBUG_MODE: true,
	RESOLUTION: [800, 600]
};

document.addEventListener( 'DOMContentLoaded', function () {
	// Do stuff...

	var game = new Phaser.Game(
		gameConfig.RESOLUTION[0], 
		gameConfig.RESOLUTION[1],               // Resolution
		Phaser.AUTO,                            // Rendering context
		'gameDiv',                              // DOM object to insert canvas
		{ preload: preload, create: create }    // Function references
	);

	//if (gameConfig.DEBUG_MODE) window.game = game;

	function preload() {
		///////////////////////////// Assets ///////////////////////////
		game.assetManager = new AssetManager(game);
		game.assetManager.load();
	}

	// TODO: Lots of hard-coding right now
	function create() {
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.stage.smoothed = false;

		game.stage.backgroundColor = '#447474';

		var imgBackground = game.add.image(0, 0, 'gp_background');

		///////////////////////////// UI elems ///////////////////////////
		for (var i = 0; i < 4; i++) {
			var uiItemslot = game.add.sprite(10, 10 + 50 * i, 'ui_itemslot');
			uiItemslot.anchor.setTo(0, 0);
			// TODO: demo use only
			var itemSword = game.add.sprite(14, 14, 'item_sword');
			var itemBow = game.add.sprite(14, 14 + 50, 'item_bow');
			itemSword.scale.setTo(2, 2);
			itemBow.scale.setTo(2, 2);
			itemSword.smoothed = false;
			itemBow.smoothed = false;
		}

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

		var uiNote = game.add.sprite(145, 535, 'ui_note');

		var uiButtonAcceptCB = function() {
			game.eventManager.notify(game.Events.INPUT.YES)
		};
		var uiButtonRejectCB = function() {
			game.eventManager.notify(game.Events.INPUT.NO)
		};
		var uiButtonContinueCB = function() {
			game.eventManager.notify(game.Events.INPUT.CONTINUE)
		};

		var textCoins = game.add.text(60, 540, "20", // TODO: hardcoded
									  { font: "30px yoster_islandregular", fill: "#ebc36f"} );
		var coinDrop = function(offer) {
			var coins = game.add.group();
			for (var i = 0; i < offer; i ++) {
				coins.create(20 + Math.random() * 50, 450 + Math.random() * 30, 'ui_coin');
			}
			var coidDropTweenPos = game.add.tween(coins.position).to( {y: coins.y + 100}, 800, Phaser.Easing.Quadratic.Out);
			var coidDropTweenAlp = game.add.tween(coins.alpha).to( {alpha: 0.5}, 500);
			coidDropTweenAlp.onComplete.add(function() {
				coins.destroy();
			});

			coidDropTweenPos.start();
			coidDropTweenAlp.start();
		}

		var uiButtonAccept = game.add.button(660, 420, 'ui_button_accept', 
											 uiButtonAcceptCB, this, 1, 0, 2);
		var uiButtonReject = game.add.button(660, 480, 'ui_button_reject', 
											 uiButtonRejectCB, this, 1, 0, 2);
		var uiButtonQuestion = game.add.button(660, 540, 'ui_button_question', 
											   null, this, 1, 0, 2);
		var uiButtonContinue = game.add.button(660, 440,
											   'ui_button_continue', 
											   uiButtonContinueCB, this, 1, 0, 2);

		uiButtonAccept.scale.setTo(2, 2);
		uiButtonReject.scale.setTo(2, 2);
		uiButtonQuestion.scale.setTo(2, 2);

		uiButtonAccept.smoothed = false;
		uiButtonReject.smoothed = false;
		uiButtonQuestion.smoothed = false;

		function switchButtons(isInteract) {
			uiButtonAccept.visible = isInteract;
			uiButtonReject.visible = isInteract;
			uiButtonContinue.visible = !isInteract;
		}

		function toggleButtons(isEnabled) {
			uiButtonAccept.inputEnabled = isEnabled;
			uiButtonReject.inputEnabled = isEnabled;
			uiButtonContinue.inputEnabled = isEnabled;
		}

		var shopkeeper = game.add.sprite(500, 272, 'gp_shopkeeper');
		var jeff = game.add.sprite(shopkeeper.x + 30, 300, 'gp_jeff');

		//--------------------- Current NPC ----------------------//
		var currNPC;
		var currNPCIn;
		var currNPCOut;

		var setNPCTween = function() {
			var npcPos = {x: 20, y: 360};
			currNPCIn = game.add.tween(currNPC).from({x: currNPC.x - 300, y: currNPC.y + 300}, 550, Phaser.Easing.Quadratic.Out);
			currNPCOut = game.add.tween(currNPC).to({x: 320, y: 660},550);
			currNPCHit = game.add.tween(currNPC).to({x: currNPC.x + 10}, 30)
				.to({x:currNPC.x - 10, y:currNPC.y}, 60)
				.to({x:currNPC.x + 10, y:currNPC.y}, 60)
				.to({x:currNPC.x, y:currNPC.y}, 30);

			currNPCOut.onComplete.add(function() {
				currNPC.destroy();
			}, this);
		}
		//--------------------------------------------------------//

		///////////////////////////// Backend ///////////////////////////
		game.eventManager = new EventManager(game);
		game.interactionManager = new InteractionManager(game);
		game.dialogManager = new DialogManager(game);
		game.playerState = new PlayerState(game);
		game.stock = new Stock(game);
		game.jeff = new Jeff(game);
		initNPCGen(game);

		uiButtonAccept.visible = false;
		uiButtonReject.visible = false;
		uiButtonQuestion.visible = false;

		game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer, isRepeat) {
			switchButtons(true);
			toggleButtons(false);
			game.dialogManager.printMain(offer, isRepeat, function() {
				toggleButtons(true);
			});
		});

		game.eventManager.register(game.Events.INPUT.NO, function() {
			if (currNPC) {
				printDebug('currNPC.x: ' + currNPC.x);
				currNPCHit.start();
				printDebug('currNPC.x: ' + currNPC.x);
				printDebug(currNPC);
			}
		});

		game.eventManager.register(game.Events.INVENTORY.SOLD, function (item, offer){
			coinDrop(offer);
		});

		game.eventManager.register(game.Events.UPDATE.GOLD, function(gold) {
			textCoins.setText(gold);
		});

		game.eventManager.register(game.Events.UPDATE.ITEMS, function(items) {
			var string = "";
			for (var key in items) {
				string += key + ": " + items[key] + " ";
			}
		});

		game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
			switchButtons(false);
			toggleButtons(false);
			game.dialogManager.printMain(dialog, false, function() {
				toggleButtons(true);
			});
		});

		game.eventManager.register(game.Events.INTERACT.NEW, function (appearanceInfo) {
			// This function returns a BitmapData generated with the given indices of 
			// body part images.
			/** NOTE: The size of the avatar frame is 168x198 **/
			printDebug("GENERATING NPC IMG: " + appearanceInfo);
			var isRandom = false;
			switch (appearanceInfo) {
				case 'SUP':
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
			var showNPC = function(isRandom) {
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
				currNPCIn.start();
			}

			if (currNPC) { 
				currNPCOut.start();
				currNPCOut.onComplete.add(showNPC);
			} else {
				showNPC(isRandom);
			}

		});

		game.interactionManager.startDay(days[0]);
		
	}

}, false );

