var gameConfig = {
	DEBUG_MODE: true,
	RESOLUTION: [800, 600]
};

(function() {
	var game = new Phaser.Game(
		gameConfig.RESOLUTION[0], 
		gameConfig.RESOLUTION[1],               // Resolution
		Phaser.AUTO,                            // Rendering context
		'gameDiv',                              // DOM object to insert canvas
		{ preload: preload, create: create }    // Function references
	);

	if (gameConfig.DEBUG_MODE) window.game = game;

	function preload() {
		///////////////////////////// Assets ///////////////////////////
		game.load.image('sk', 'assets/gameplay/gp_shopkeeper.png');
		game.assetManager = new AssetManager(game);
		game.assetManager.load();
	}

	// TODO: Lots of hard-coding right now
	function create() {
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.stage.smoothed = false;

		game.stage.backgroundColor = '#447474';

		var imgBackground = game.add.image(0, 0, 'background');

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

		var shopkeeper = game.add.sprite(500, 272, 'sk');

		//--------------------- Current NPC ----------------------//
		var currNPC;
		var currNPCIn;
		var currNPCOut;

		var setNPCTween = function() {
			currNPCIn = game.add.tween(currNPC).to({x:20, y:360},550, 'Quart.easeOut');
			currNPCOut = game.add.tween(currNPC).to({x:320, y:660},550, 'Quart.easeOut');
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

		game.interactionManager.startDay(days[0]);

		game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer, isRepeat) {
			switchButtons(true);
			toggleButtons(false);
			game.dialogManager.printMain(offer, isRepeat, function() {
				toggleButtons(true);
			});
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
				currNPC = uiAvatarLayer.create(-280, 660, drawRandomNPC(game, appearanceInfo));
				setNPCTween();
				currNPC.scale.setTo(3, 3);
				currNPCIn.start();
			}

			if (currNPC) { 
				currNPCOut.start();
				currNPCOut.onComplete.add(showNPC);
			} else {
				showNPC();
			}

		});

	}

})();

