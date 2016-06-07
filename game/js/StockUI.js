function StockUI(game) {

	var allLoad;
	var lockedLoad;
	var allBox;
	var allNews;
	var textCoins;
	var imgCoin;
	var endDayButton;
	var reminder;
	var imgBackground;
	var ui_group;
	var callback;

	// ---- for item positions -----
	var loadSpace = 30;
	var itemSpace = 30;
	var itemSize = 50;
	var itemDistanceFromSide = 50;
	var loadInit = [30, 150];
	var itemInit = [275, 100];
	// ----------

	function init() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		ui_group = game.add.group();
		imgBackground = game.add.image(0, 0, 'gp_stock');
		endDayButton = game.add.button(620, 538, 'ui_button_start', endDay, this, 1, 0, 2);
		reminder = game.add.text(627, 542 - endDayButton.height / 2, "Stock Items", 
								 { font: "20px yoster_islandregular" , fill: "#CC0000"});

		ui_group.add(imgBackground); 
		ui_group.add(endDayButton);
		ui_group.add(reminder);
		reminder.alpha = 0;
		ui_group.fadeIn = game.add.tween(ui_group)
			.to( {alpha: 1}, 500);
		ui_group.fadeOut = game.add.tween(ui_group)
			.to( {alpha: 0}, 500);
		ui_group.fadeOut.onComplete.add(function() {
			ui_group.visible = false;
		});
		game.eventManager.register(game.Events.UPDATE.ITEMS, updateItems);
		game.eventManager.register(game.Events.UPDATE.STOCKGOLD, function(gold) {
			if (textCoins !== undefined && textCoins != null)
				textCoins.setText(gold);
		});
		game.eventManager.register(game.Events.STOCK.INIT, updateItemUI);
		ui_group.alpha = 0;
		ui_group.visible = false;
		//ui_group.fadeOut.start();
	}

	function updateNewsUI(news) {
		allNews = game.add.text(200, 435, formatClues(news), 
								{ font: "20px yoster_islandregular" , fill: "#3B3B3B", wordWrap : true,
								 wordWrapWidth : 400});
	}

	function updateItemUI(numSlots, gold, avalItems, playerItems) {
		allBox = createItemSprites(avalItems, playerItems);

		var loadResult = createLoads(numSlots);
		allLoad = loadResult[0];
		lockedLoad = loadResult[1];

		initAllItems(allBox);
		initAllLoad(allLoad);
		textCoins = game.add.text(70, 535, "0",
								  { font: "30px yoster_islandregular", fill: Colors.PassiveLighter} );
		imgCoin = game.add.image(38, 502, 'ui_coin_flat');

		ui_group.add(imgCoin);
		ui_group.add(textCoins);
		textCoins.setText(gold);
		textCoins.anchor.setTo(0.5, 0.5);
		coinAlert();
	}

	function formatClues(clues) {
		var retString = "";
		for(var i = 0; i < clues.length; i++) {
			if(clues[i] !== "") {
				retString += "> " + clues[i] + "\n";
			}
		}
		return retString;
	}

	function destroyGroup() {
		for(var key in allBox) {
			allBox[key].tinted.destroy();
			allBox[key].xtext.visible = false;
			allBox[key].count.visible = false;
			allBox[key].priceText.visible = false;
			allBox[key].increaseStock.destroy();
			allBox[key].decreaseStock.destroy();
			allBox[key].itemborder.destroy();
			allBox[key].destroy();
		}
		for(var i = 0; i < allLoad.length; i++) {
			/*allLoad[i].minus.destroy();
			allLoad[i].plus.destroy();*/
			allLoad[i].num.destroy();
			allLoad[i].destroy();
		}
		for (var i = 0; i < lockedLoad.length; i++) {
			lockedLoad[i].destroy();
		}

		textCoins.destroy();
		allNews.destroy();
	}

	this.startDay = function(clues, func) {
		ui_group.visible = true;
		// hack so that reminder does not fade in with rest of ui_group
		reminder.visible = false;
		ui_group.fadeIn.start();
		game.soundManager.playMusic(game.Music.STOCK, 500);
		reminder.alpha = 0;
		reminder.visible = true;
		game.world.bringToTop(ui_group);
		updateNewsUI(clues);
		callback = func;
		game.eventManager.notify(game.Events.STOCK.STARTDAY); // call updateItemUI
	}

	function endDay() {
		if (!somethingLoaded()) {
			remindPlayer();
			return;
		}
		game.soundManager.stopMusic(500);
		game.soundManager.playSound(game.Sounds.BLIP);
		for(var key in allBox) {
			allBox[key].priceText.visible = false;
		}
		destroyGroup();
		ui_group.fadeOut.start();
		game.eventManager.notify(game.Events.STOCK.COMMIT, currStocked());
		callback();
	}

	function remindPlayer() {
		game.soundManager.playSound(game.Sounds.NOTIFY);
		var remindertween = game.add.tween(reminder).to( {alpha: 1}, 1000);
		remindertween.onComplete.add(function() {
			var disappeartween = game.add.tween(reminder).to( {alpha: 0}, 1000);
			disappeartween.start();
		});
		remindertween.start();
	}

	function somethingLoaded() {
		for (var i = 0; i < allLoad.length; i++) {
			if (allLoad[i] && allLoad[i].loaded != null) {
				return true;
			}
		}
	}

	function currStocked() {
		var stocked = [];
		for(var i =  0; i < allLoad.length; i++) {
			if(allLoad[i].loaded != null) {
				stocked.push(allLoad[i].loaded.itemname);
			}
		}
		return stocked;
	}

	function coinDrop(offer) {
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

	function tweenTint(obj, startColor, endColor, time, onCompleteCB) {    
		// create an object to tween with our step value at 0    
		var colorBlend = {step: 0};    
		// create the tween on this object and tween its step property to 100    
		var colorTween = game.add.tween(colorBlend).to({step: 100}, time, Phaser.Easing.Quadratic.Out);        
		// run the interpolateColor function every time the tween updates, feeding it the    
		// updated value of our tween each time, and set the result as our tint    
		colorTween.onUpdateCallback(function() {      
			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
		});

		if (onCompleteCB) {
			colorTween.onComplete.addOnce(onCompleteCB);
		}
		// set the object to the start color straight away    
		obj.tint = startColor;            
		// start the tween    
		colorTween.start();
	}

	function tweenAlert(obj) {
		tweenTint(obj, 0xcb929a, 0xffffff, 1000);
	}

	function coinAlert() {
		tweenTint(imgCoin, 0xcb929a, 0xffffff, 1000);
	}

	function coinFlash() {
		tweenTint(imgCoin, 0x92cb9a, 0xffffff, 1000);
	}

	function createLoads(numSlots) {
		var result = [];
		var loadArray = [];
		var lockedArray = [];

		for (var i = 0; i < 4; i++) {
			var uiItemslot;
			if (i < numSlots) {
				uiItemslot = game.add.image(20, 40 + 70 * i, 'ui_itemslot');
				loadArray.push(uiItemslot);
			} else {
				uiItemslot = game.add.image(20, 40 + 70 * i, 'ui_itemslot_locked');
				lockedArray.push(uiItemslot);
			}
			uiItemslot.anchor.setTo(0, 0);
		}

		result.push(loadArray);
		result.push(lockedArray);
		return result;
	}

	function createItemSprites(avalItems, playerItems) {
		var sprites = {};
		for (var i = 0; i < avalItems.length; i++) {
			// get graphics to load for correct boxes
			var sprite = game.add.sprite(0, 0, "item_" + avalItems[i]);
			sprite.itemType = avalItems[i];
			sprite.num = (playerItems[avalItems[i]] === undefined) ? 0 : playerItems[avalItems[i]] + 0;
			sprite.orignum = (playerItems[avalItems[i]] === undefined) ? 0 : playerItems[avalItems[i]] + 0;
			sprite.smoothed = false;

			sprite.count = game.add.text(0, 0, '×' + sprite.num, 
										 { font: "30px yoster_islandregular", fill: Colors.PassiveDark });
			sprites[avalItems[i]] = sprite;
		}
		return sprites;
	}

	function initAllItems(boxes) {
		var numberMod = Math.floor((game.width - itemDistanceFromSide - itemInit[0])/ (itemSpace + itemSize)); 
		var curr = -1;
		for (var key in boxes) {
			curr++;
			game.physics.arcade.enable(boxes[key]);
			boxes[key].itemname = key;
			boxes[key].loaded = false;
			boxes[key].inputEnabled = true;
			boxes[key].scale.setTo(2, 2);
			boxes[key].input.enableDrag();
			boxes[key].events.onDragStop.add(onDragStop, this);
			boxes[key].events.onDragStart.add(onDragStart, this);
			boxes[key].position.x = itemInit[0] + ((curr % numberMod) * 1.25 * (itemSpace + itemSize));
			boxes[key].position.y = itemInit[1] + Math.floor(curr / numberMod) * (itemSpace + itemSize); 
			boxes[key].count.x = boxes[key].position.x + itemSpace + 8;
			boxes[key].count.y = boxes[key].position.y;


			boxes[key].itemborder = game.add.image(boxes[key].position.x - 6, boxes[key].position.y - 6, 
												   'ui_button_item_border');
			boxes[key].itemborder.scale.setTo(2, 2);
			game.world.bringToTop(boxes[key].itemborder);

			boxes[key].increaseStock = game.add.button(boxes[key].count.x, boxes[key].count.y, 
													   'ui_stock_increase', increaseStock, this, 1, 0, 2);
			boxes[key].decreaseStock = game.add.button(boxes[key].count.x, boxes[key].count.y + boxes[key].height,
													   'ui_stock_decrease', decreaseStock, this, 1, 0, 2);
			boxes[key].increaseStock.anchor.setTo(0, 1);
			boxes[key].increaseStock.item = boxes[key];
			boxes[key].decreaseStock.item = boxes[key];

			boxes[key].originalPosition = boxes[key].position.clone();
			boxes[key].price = items[key].price;

			boxes[key].priceText = game.add.group();
			boxes[key].priceText.position.setTo(boxes[key].itemborder.x + 4, boxes[key].itemborder.y + boxes[key].itemborder.height + 2);

			var priceText = game.add.text(0, 0,  boxes[key].price + ' ',
										  {font: "16px yoster_islandregular", fill: '#ffffca'})

			boxes[key].priceText.add(priceText);
			boxes[key].priceText.add(game.add.image(priceText.x + priceText.width, priceText.y, 'ui_coin'));


			boxes[key].xtext = game.add.text(boxes[key].position.x + boxes[key].width, boxes[key].position.y + boxes[key].height + 5, "×",
											 { font: "14px yoster_islandregular", fill: Colors.PassiveLight });
			boxes[key].xtext.visible = false;
			boxes[key].priceText.visible = true;

			boxes[key].tinted = game.add.image(boxes[key].position.x, boxes[key].position.y, boxes[key].key);
			boxes[key].tinted.scale.setTo(2, 2);
			boxes[key].tinted.tint = 0x4d372c;

			game.world.bringToTop(boxes[key]);
			boxes[key].events.onInputOver.add(hoverOnItem, boxes[key]);
			boxes[key].events.onInputOut.add(deHoverOnItem, boxes[key]);
			boxes[key].loader = null;
		}
	}

	function hoverOnItem(sprite, pointer) {
		//sprite.priceText.visible = true;
		/*sprite.priceText.x = sprite.position.x;
		if(!sprite.loaded)
			sprite.priceText.x -= 20;
		sprite.priceText.y = sprite.position.y + sprite.height + 5;*/
	}

	function deHoverOnItem(sprite, pointer) {
		//if (!sprite.loaded)
		//sprite.priceText.visible = false;
	}

	function initAllLoad(loads) {
		for (var i = 0; i < loads.length; i++) {
			loads[i].anchor.setTo(0, 0);
			loads[i].name = loads[i].key + ": " + i;
			printDebug("Loader name: " + loads[i].name);
			/*loads[i].plus = game.add.button(loads[i].position.x + loads[i].width + 10, loads[i].position.y - 2, 'ui_button_add', increaseItem, this, 1, 0, 2);
			loads[i].plus.scale.setTo(2, 2);
			loads[i].minus = game.add.button(loads[i].position.x + loads[i].width + 10, loads[i].position.y + loads[i].height / 2, 'ui_button_sub', decreaseItem, this, 1, 0, 2);
			loads[i].minus.scale.setTo(2, 2);
			loads[i].plus.loader = loads[i];
			loads[i].minus.loader = loads[i];*/
			loads[i].num = game.add.text(loads[i].position.x + loads[i].width / 2, loads[i].position.y + 8, 'X',
										 { font: "20px yoster_islandregular", fill: '#d3af7a' });
			loads[i].loaded = null;
			game.physics.arcade.enable(loads[i]);
		}
	}

	function updateItems(Items) {
		for (var key in Items) {
			// do shallow copy of each item number
			if (!(allBox === undefined) && allBox != null) {
				allBox[key].num = Items[key] + 0;
			}
		}
		//game.playerState.StockedItems = Items;
	}

	function updateLoaderCount(name, count) {
		for (var i = 0; i < allLoad.length; i++) {
			if (allLoad[i].loaded && allLoad[i].loaded.itemname.indexOf(name) >= 0) {
				allLoad[i].num.setText(count);
				break;
			}
		}
	}

	function increaseStock(button) {
		if (button.item) {
			var prevNum = button.item.num;
			game.eventManager.notify(game.Events.STOCK.ADD, button.item.itemname, 1);
			var currNum = button.item.num;
			button.item.count.setText('×' + currNum);
			updateLoaderCount(button.item.itemname, currNum);
			if (prevNum == currNum) {
				coinAlert();
			} else {
				coinFlash();
			}
		} else {
			printDebug("ERROR: !button.item");
		}
	}

	function decreaseStock(button) {
		if (button.item) {
			var prevNum = button.item.num;
			game.eventManager.notify(game.Events.STOCK.REMOVE, button.item.itemname, 1);
			var currNum = button.item.num;
			button.item.count.setText('×' + currNum);
			updateLoaderCount(button.item.itemname, currNum);
			if (prevNum == currNum) {
				tweenAlert(button);
			} else {
				coinFlash();
			}
		} else {
			printDebug("ERROR: !button.item");
		}
	}

	/*function decreaseItem(minus, pointer) {
		if (minus.loader != null && minus.loader.loaded != null) {
			var currCount = minus.loader.loaded.num;
			game.eventManager.notify(game.Events.STOCK.REMOVE, minus.loader.loaded.itemType, 1);
			minus.loader.num.text = minus.loader.loaded.num;
			if (currCount != minus.loader.loaded.num)
				coinDrop(1);
		}
	}

	function increaseItem(plus, pointer) {  
		if (plus.loader != null && plus.loader.loaded != null) {
			game.eventManager.notify(game.Events.STOCK.ADD, plus.loader.loaded.itemType, 1);
			plus.loader.num.text = plus.loader.loaded.num;
		}
	}*/

	function onDragStart(sprite, pointer) {
		game.soundManager.playSound(game.Sounds.TAP);
		game.world.bringToTop(sprite);
		deHoverOnItem(sprite, pointer);
		for (var i = 0; i < allLoad.length; i++) {
			if (Phaser.Rectangle.intersects(sprite.getBounds(), allLoad[i].getBounds())) {
				allLoad[i].num.text = 'X';
				allLoad[i].loaded = null;
			}
		}
	}

	function onDragStop(sprite, pointer) {
		var loaded;
		var inbounds = false;
		if (Phaser.Rectangle.intersects(sprite.getBounds(), sprite.itemborder.getBounds())) {
			loader = findEmptyLoad();
			inbounds = true;
		} else {
			loader = findCollision(sprite, allLoad);
		}
		if ((loader && loader !== undefined && !(loader.loaded === undefined) && loader.loaded === null && sprite.loader === null) ||
			(loader === undefined && sprite.loader !== null && inbounds === false)) {
			if (loader === undefined)
				loader = sprite.loader;
			sprite.position.copyFrom(loader.position);
			sprite.position.x += 4;
			sprite.position.y += 4;
			sprite.loaded = true;
			sprite.loader = loader;
			sprite.xtext.x = sprite.position.x + sprite.width - 8;
			sprite.xtext.y = sprite.position.y - 3;
			sprite.xtext.visible = true;
			hoverOnItem(sprite, null);
			loader.num.text = sprite.num + "";
			loader.loaded = sprite;

		} else {
			sprite.position.copyFrom(sprite.originalPosition);
			sprite.loaded = false;
			sprite.loader = null;
			sprite.xtext.visible = false;
			game.world.bringToTop(sprite.itemborder);
			//coinDrop(sprite.num - sprite.orignum);
			game.soundManager.playSound(game.Sounds.REJECT);
			//game.eventManager.notify(game.Events.STOCK.OUTSTOCK, sprite.itemType);
			//coinDrop()
			//deHoverOnItem(sprite, pointer);
		}
	}

	function findEmptyLoad() {
		for (var i = 0; i < allLoad.length; i++) {
			if (allLoad[i].loaded == null) {
				return allLoad[i];
			}
		}
		return null;
	}

	function findCollision(sprite, all) {
		for (var i = 0; i < all.length; i++) {
			if (Phaser.Rectangle.intersects(sprite.getBounds(), all[i].getBounds())) {
				return all[i];
			}
		}
		return undefined;
	}    
	init();
}
