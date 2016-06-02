function DisplayManager(game) {

	var self = this;

	//----------- Objects in title screen ------------
	var title;
	var titleStartText;

	//----------- Objects in environment -------------
	var tint = 0xFFFFFF;
	var imgBackgroundSky;
	var imgSum;
	var clouds, cloudGenOn = false, 
		cloudIntv = randomIntInRange(5, 13), 
		cloudY = randomIntInRange(200, 300),
		cloudDur = randomIntInRange(1800, 3200),
		cloudTimer = game.time.create(false),
		spawnGoldenCloud = true;
	var pedests, pedestsGenOn = false,
		pedestIntv = randomIntInRange(4, 10),
		pedestY = randomIntInRange(350, 400),
		pedestDur = randomIntInRange(1200, 2000),
		pedestTimer = game.time.create(false);
	var imgBackgroundTown;
	var shopKeeper;
	var dog;
	var shop;
	var jeff, jeffShadow;

	//----------- UI components ----------------------
	var soundControl;
	var coins, prevGold;

	function setPositionLowerMiddle(shop, player) {
		shop.position.copyFrom(player);
		shop.position.y += player.height - shop.height / 2;
		shop.position.x += (player.width / 2) - (shop.width / 2);
	}

	this.prepareStage = function() {
		game.renderer.renderSession.roundPixels = true;
		game.stage.smoothed = false;
		game.stage.backgroundColor = '#92cb9a';
	};

	this.tintClouds = function(tintVal) {
		this.clouds.setAll('tint', tintVal);
		tint = tintVal;

	}

	this.prepareGroups = function() {
		game.depthGroups = {
			titleGroup: game.add.group(),
			envGroup: game.add.group(),
			dialogGroup: game.add.group(),
			shopGroup: game.add.group(),
			pedestGroup: game.add.group(),
			noteGroup : game.add.group(),
			questionGroup : game.add.group(),
			uiGroup: game.add.group(),
			frontGroup: game.add.group()
		};
	}

	this.putEnvironment = function() {
		this.imgBackgroundSky = game.add.group();
		this.imgBackgroundSky.dawn = game.add.image(0, 0, 'gp_background_sky_dawn');
		this.imgBackgroundSky.noon = game.add.image(0, 0, 'gp_background_sky');
		this.imgBackgroundSky.afternoon = game.add.image(0, 0, 'gp_background_sky_noon');
		this.imgBackgroundSky.dusk = game.add.image(0, 0, 'gp_background_sky_dusk');

		this.imgSun = game.add.sprite(400, 100, 'gp_sun');
		this.clouds = game.add.group();
		this.pedests = game.add.group();
		this.cloudTimer = game.time.create(false);
		this.pedestTimer = game.time.create(false);
		this.imgBackgroundTown = game.add.image(0, 0, 'gp_background_town');
		this.shopKeeper = game.add.sprite(500, 272, 'gp_shopkeeper');
		this.dog = game.add.sprite(440, 300, 'gp_dog_small');
		this.dog.visible = false;
		this.shop = game.add.sprite(0, 0, 'shop_rock');
		this.jeff = game.add.sprite(this.shopKeeper.x + 56, 282, 'gp_jeff_noshadow');
		this.jeffShadow = game.add.sprite(this.shopKeeper.x + 43, 
										  this.shopKeeper.y + this.shopKeeper.height - 7, 'gp_jeff_shadow');

		this.imgBackgroundSky.add(this.imgBackgroundSky.dawn);
		this.imgBackgroundSky.add(this.imgBackgroundSky.noon);
		this.imgBackgroundSky.add(this.imgBackgroundSky.afternoon);
		this.imgBackgroundSky.add(this.imgBackgroundSky.dusk);

		game.depthGroups.envGroup.add(this.imgBackgroundSky);
		game.depthGroups.envGroup.add(this.imgSun);
		game.depthGroups.envGroup.add(this.clouds);
		game.depthGroups.envGroup.add(this.imgBackgroundTown);
		game.depthGroups.envGroup.add(this.shopKeeper);
		game.depthGroups.envGroup.add(this.dog);
		game.depthGroups.envGroup.add(this.jeff);
		game.depthGroups.envGroup.add(this.jeffShadow);
		game.depthGroups.pedestGroup.add(this.pedests);

		this.imgSun.anchor.setTo(0.5, 0.5);

		this.shop.smoothed = false;
		this.shop.alpha = 0;
		this.shop.visible = false;

		this.shop.shopFadeTween = game.add.tween(this.shop).to(
			{alpha: 1}, 2000, Phaser.Easing.Linear.None, false
		);

		setPositionLowerMiddle(this.shop, this.shopKeeper);

		this.dog.anim = this.dog.animations.add('doge');
		this.dog.animations.play('doge', 3, true);

		this.jeff.anchor.setTo(0.5, 0.5);
		this.jeff.floating = game.add.tween(this.jeff).to({
			y: 260
		}, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);
		this.jeff.tweenRotate = game.add.tween(this.jeff).to({
			angle: 1440
		}, 1000, Phaser.Easing.Linear.None);
		this.jeff.itemMaking = false;
		this.jeff.tweenBounce = game.add.tween(this.jeff).to({
			y: this.jeff.y - 10
		}, 300, Phaser.Easing.Quadratic.In).to({
			Y: this.jeff.y
		}, 400, Phaser.Easing.Quadratic.out);
		this.jeff.tweenRotate.onComplete.add(function() {
			game.displayManager.jeff.tweenBounce.start();
		});
		this.jeff.tweenBounce.onComplete.add(function() {
			if (game.displayManager.jeff.itemMaking) {
				game.displayManager.jeff.floating.resume();
				game.displayManager.jeff.itemMaking = false;
			}
		});

		this.jeffShadow.alpha = 0.6;
		this.jeffShadow.fadeIn = game.add.tween(this.jeffShadow).to({
			alpha: 0.2
		}, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);

	};

	this.putUIComponents = function() {
		this.soundControl = game.add.button(gameConfig.RESOLUTION[0] - 8, 8,
											'ui_sound',
											this.soundControlClickCB,
											this,
											null, null, null);
		this.prevGold = 0;
		this.coins = game.add.group();

		game.depthGroups.uiGroup.add(this.soundControl);
		game.depthGroups.frontGroup.add(this.coins);

		this.soundControl.anchor.setTo(1, 0);
		this.soundControl.alpha = 0.5;
		this.soundControl.frame = 1;

		this.soundControl.tweenHover = game.add.tween(this.soundControl).to( {alpha : 1}, 200, 'Linear');
		this.soundControl.tweenOut = game.add.tween(this.soundControl).to( {alpha : 0.5}, 400, 'Linear');

		this.soundControl.events.onInputOver.add(this.soundControlHoverCB, this);
		this.soundControl.events.onInputOut.add(this.soundControlOutCB, this);

		this.coins.tweenHit = game.add.tween(this.coins).to({
			x: this.coins.x + 10
		}, 30)
			.to({
			x: this.coins.x - 10,
			y: this.coins.y
		}, 60)
			.to({
			x: this.coins.x + 10,
			y: this.coins.y
		}, 60)
			.to({
			x: this.coins.x,
			y: this.coins.y
		}, 30);
	}

	this.soundControlClickCB = function() {
		if (game.soundManager.musicEnabled()) {
			this.soundControl.frame = 0;
			//game.soundManager.changeMusicVolume(0.0);
			game.soundManager.toggleMusic(false);
			game.soundManager.toggleSound(false);
		} else {
			this.soundControl.frame = 1;
			//game.soundManager.changeMusicVolume(0.10);
			game.soundManager.toggleMusic(true);
			game.soundManager.toggleSound(true);
		}
		printDebug("UI: sound toggle clicked!");
	}

	this.soundControlHoverCB = function() {
		this.soundControl.tweenHover.start();
	}

	this.soundControlOutCB = function() {
		this.soundControl.tweenOut.start();
	}

	function resetCoins() {
		coins.removeAll();
		prevGold = game.playerState.getGold();
		for (var i = 0; i < prevGold / 2; i++) {
			addCoin(i);
		}
	}
	
	var surplusCoins = 0;
	var MAX_DISPLAYED_GOLD = 120;

	function addCoin(index, coins) {
		printDebug("UI: adding coins at index: " + index);

		if(self.coins && self.coins.length > 60) {
			surplusCoins++;
		} else {
			var pos = {x: 30, y: gameConfig.RESOLUTION[1] - 34 - 4*index};
			if (index >= 9 && index < 16) {
				pos.x = 42;
				pos.y = gameConfig.RESOLUTION[1] - 24 - 4 * (index - 9);
			} else if (index >= 16) {
				pos.x = 20;
				pos.y = gameConfig.RESOLUTION[1] - 22 - 4 * (index - 16);
			}
			var coin = game.add.image(pos.x, pos.y, 'ui_coin');
			coin.anchor.setTo(0, 1);
			coins.add(coin);
		}
	}

	function removeCoin() {
		if(surplusCoins > 0) {
			surplusCoins--;
		} else {
			var removedCoin = self.coins.removeChildAt(self.coins.length - 1);
			removedCoin.destroy();
		}
	}

	this.updateCoins = function() {
		var currGold = game.playerState.getGold();
		var diff = currGold - this.prevGold;
		var coinDiff = Math.round(Math.abs(diff / 2));

		printDebug("UI: coins changed! Diff: " + coinDiff);
		printDebug("UI: coins changed! Curr: " + currGold);
		printDebug("UI: coins changed! Prev: " + this.prevGold);

		if (currGold < prevGold) {
			this.coins.tweenHit.start();
		} 

		if(diff > 20 || (diff > 0 && game.currentScreen === "STOCKING")) {
			for(var i = 0; i < coinDiff; i++) {
				addCoin(this.coins.length - 1, this.coins);
			}
			this.prevGold = currGold;
			return;
		}

		if((diff < -20 || (diff < 0 && game.currentScreen === "STOCKING")) && this.coins.length + surplusCoins >= coinDiff) {
			for(var i = 0; i < coinDiff; i++) {
				removeCoin();
			}
			this.prevGold = currGold;
			return;
		}

		var tmr = game.time.create(true);
		tmr.count = 0;
		tmr.loop(50, function(){
			if (tmr.count < coinDiff) {
				tmr.count++;
				if (diff > 0 && game.currentScreen === "SALES") {
					game.soundManager.playSound(game.Sounds.COINS[1]);
				}
				if (diff > 0 && this.prevGold >= 0) {
					addCoin(this.coins.length - 1, this.coins);
				}

				if (diff < 0 && this.coins.length > 0) {
					if (game.currentScreen === "SALES") {
						game.soundManager.playSound(game.Sounds.REJECT);
					}
					removeCoin();
				} else if (diff < 0 && game.currentScreen === "SALES") {
					game.soundManager.playSound(game.Sounds.COINLOST);
				}
			} else {
				this.prevGold = currGold;
				tmr.stop();
				tmr.destroy();
			}
		}, this);
		tmr.start();
	}

	this.putLoadingBackground = function() {
		var background = game.add.image(0, 500, 'gp_background');
		background.arriveTween = game.add.tween(background).to({
			y:'-300'
		}, 300, Phaser.Easing.Quadratic.None, true);
		if(gameConfig.ISALBINO) {
			game.add.text(310, 10, "Permission to be hosted by albinoblacksheep.com", { font: "18px yoster_islandregular", fill: Colors.PassiveMain} );
		}
	}

	this.putTitleScreen = function() {
		var title = game.add.sprite(0, 0, 'gp_title');
		var clickStart = game.add.sprite(400, 400, 'gp_clickstart');
		var dev = game.add.sprite(400, 590, 'gp_dev');

		title.alpha = 0;
		clickStart.alpha = 0;
		clickStart.anchor.setTo(0.5, 0.5);
		clickStart.blinkTween = game.add.tween(clickStart).to({
			alpha: 1
		}, 1000, Phaser.Easing.Linear.None, true, 0, 500, true);

		title.shakeTween = game.add.tween(title).to({
			y: '-10'
		}, 1000, Phaser.Easing.Quadratic.In, true, 0, 500, true);
		title.fadeIn = game.add.tween(title).to({
			alpha: 1
		}, 300, Phaser.Easing.Quadratic.None, true);;
		dev.anchor.setTo(0.5, 1);
	};

	this.updateSunPosition = function(dayPercent) {
		this.imgSun.position.x = gameConfig.RESOLUTION[0] * (dayPercent - 0.05);
		this.imgSun.position.y = gameConfig.RESOLUTION[1] / 3 - 
			Math.sin((1-dayPercent) * Math.PI) * (gameConfig.RESOLUTION[1] / 6);
	}

	this.updateSky = function(dayPercent) {
		var percent = 1 - dayPercent;
		this.imgBackgroundSky.dawn.alpha = 
			(percent >= DayTimes.dawn.start && percent <= DayTimes.dawn.end) ?
			1 - percent / DayTimes.dawn.end : 0;
		this.imgBackgroundSky.noon.alpha = 
			(percent >= DayTimes.noon.start && percent <= DayTimes.noon.end) ?
			Math.sin((percent - DayTimes.noon.start) / (DayTimes.noon.end - DayTimes.noon.start) * Math.PI) : 0;
		this.imgBackgroundSky.afternoon.alpha = 
			(percent >= DayTimes.afternoon.start && percent <= DayTimes.afternoon.end) ?
			Math.sin((percent - DayTimes.afternoon.start) / (DayTimes.afternoon.end - DayTimes.afternoon.start) * Math.PI) : 0;
		this.imgBackgroundSky.dusk.alpha = 
			(percent >= DayTimes.dusk.start) ?
			Math.sin((percent - DayTimes.dusk.start) / (DayTimes.dusk.end - DayTimes.dusk.start) * Math.PI / 2) : 0;
		this.imgBackgroundSky.dusk.alpha = (percent >= DayTimes.dusk.end) ?
			1 : this.imgBackgroundSky.dusk.alpha;
	}

	function starCloudClicked() {
		game.kongregate.submit('CloudClicker', 1);
		this.cloud.inputEnabled = false;
		game.soundManager.playSound(game.Sounds.SWAG);
		var reward = randomIntInRange(5, 8);
		printDebug("UI: star cloud clicked! Rewarding " + reward + " gold.");
		game.analytics.track("cloud", "clicked");

		var coins = game.add.group();
		for (var i = 0; i < reward; i++) {
			coins.create(this.cloud.x + randomIntInRange(-20, 20), this.cloud.y + randomIntInRange(-20, 20), 'ui_coin');
		}
		var coidDropTweenPos = game.add.tween(coins.position).to({
			x: 10 - this.cloud.x, y: 570 - this.cloud.y
		}, 800, Phaser.Easing.Quadratic.Out);
		var coidDropTweenAlp = game.add.tween(coins).to({
			alpha: 0
		}, 500);
		coidDropTweenAlp.onComplete.add(function() {
			coins.destroy();
		});
		coidDropTweenPos.start();
		coidDropTweenAlp.start();

		game.playerState.addsubGold(reward);

		var c = this.cloud;
		var cloudDrop = game.add.tween(this.cloud).to( {y: '+10'}, 100).to( {y: 600}, 700, Phaser.Easing.Bounce.Out);
		cloudDrop.onComplete.add(function () {
			c.destroy();
		});
		cloudDrop.start();

		game.eventManager.notify(game.Events.UPDATE.GOLD, game.playerState.getGold());
	};

	// duration: time takes to reach end of screen
	this.putCloud = function() {
		this.randomCloudAttr();
		printDebug('UI: Putting cloud at ' + this.cloudY);
		var cloudAsset = 'gp_cloud';
		if (randomIntInRange(1, 14) == 2 && spawnGoldenCloud) {   // Generate special clouds
			cloudAsset = 'gp_cloud_star';
			this.cloudDur = 4800;
		}
		var cloud = this.clouds.create(-58, this.cloudY, cloudAsset);
		cloud.tint = tint;
		cloud.floatTween = game.add.tween(cloud).to( {x: gameConfig.RESOLUTION[0]}, this.cloudDur);
		cloud.floatTween.start();
		cloud.floatTween.onComplete.add(function() { 
			cloud.destroy();
		});
		if (cloudAsset == 'gp_cloud_star') {
			cloud.inputEnabled = true;
			cloud.events.onInputDown.add(starCloudClicked, {cloud : cloud});
		}

		if (this.cloudGenerationOn) {
			this.cloudTimer.add(
				Phaser.Timer.SECOND * game.rnd.realInRange(3, 8),
				this.putCloud, 
				this
			);
		}
	}

	this.toggleCloudGeneration = function(cloudGen) {
		this.cloudGenOn = cloudGen;
		if (cloudGen) {
			this.putCloud();
			this.cloudTimer.start();
		} else if (this.cloudTimer.running) {
			this.cloudTimer.stop();
		}
	}

	this.cloudGenerationOn = function() {
		return this.cloudGenOn;
	}

	this.randomCloudAttr = function() {
		this.cloudIntv = randomIntInRange(1, 15);
		this.cloudY = randomIntInRange(100, 240);
		this.cloudDur = randomIntInRange(40000, 80000);
	}

	var MAX_PEDESTRIANS = 10;
	var numPedestrians = 0;

	this.putPedestrian = function() {
		if(numPedestrians > MAX_PEDESTRIANS) {
			return;
		}

		numPedestrians++;

		this.randomPedestAttr();

		var pedestAsset = 'gp_passerby';
		var pedestrian = this.pedests.create(-15, this.pedestY, pedestAsset);
		var pedestStepDur = this.pedestDur / 90;

		pedestrian.anchor.setTo(0.5, 1);
		pedestrian.tint = 0x999999 - (Math.random() * 0x004000);
		pedestrian.stepCount = 0;

		printDebug('UI: Putting pedestrian at ' + this.pedestY + ' with tint: ' + pedestrian.tint.toString(16));

		if (randomIntInRange(1, 3) == 1) {
			pedestrian.moveTween = game.add.tween(pedestrian)
				.to( {x: gameConfig.RESOLUTION[0] + 15}, this.pedestDur, Phaser.Easing.Linear.None, true, 0, -1);
		} else {
			pedestrian.x = gameConfig.RESOLUTION[0] + 15;
			pedestrian.scale.x *= -1;
			pedestrian.moveTween = game.add.tween(pedestrian)
				.to( {x: -15}, this.pedestDur, Phaser.Easing.Linear.None, true, 0, -1);
		}
		pedestrian.walkTween = game.add.tween(pedestrian)
			.to( {y: '-4'}, pedestStepDur, Phaser.Easing.Quadratic.InOut, true, 0, 500, true);


		pedestrian.moveTween.onComplete.add(function() { 
			numPedestrians--;
			pedestrian.destroy();
		});

		pedestrian.walkTween.start();
		pedestrian.moveTween.start();

		if (this.pedestGenerationOn()) {
			this.pedestTimer.add(
				Phaser.Timer.SECOND * this.pedestIntv,
				this.putPedestrian, 
				this
			);
		}

		this.pedests.sort('y', Phaser.Group.SORT_ASCENDING);
	}

	this.togglePedestGeneration = function(pedestGen) {
		this.pedestGenOn = pedestGen;
		if (pedestGen) {
			this.putPedestrian();
			this.pedestTimer.start();
		} else if (this.pedestTimer.running) {
			this.pedestTimer.stop();
		}
	}

	this.pedestGenerationOn = function() {
		return this.pedestGenOn;
	}

	this.randomPedestAttr = function() {
		this.pedestIntv = randomIntInRange(2, 40);
		this.pedestY = randomIntInRange(350, 420);
		this.pedestDur = randomIntInRange(24000, 48000);
	}

	function createDialogTweens(dialog) {
		dialog.dialogIn = game.add.tween(dialog)
			.to( {alpha: 1}, 500, Phaser.Easing.Bounce.In);
		dialog.dialogPop = game.add.tween(dialog.scale)
			.from( {x: 0, y: 0}, 700, Phaser.Easing.Bounce.Out);
		dialog.dialogOut = game.add.tween(dialog.scale)
			.to( {x: 0, y: 0}, 300, Phaser.Easing.Quadratic.Out);
		(dialog.dialogOut.onComplete.add(function() {
			dialog.destroy();
		}));
	}

	function createJeffDialog(x, y, w, h) {
		game.soundManager.playSound(game.Sounds.NOTIFY);
		var dialog = game.add.group();
		game.depthGroups.dialogGroup.add(dialog);
		createDialogTweens(dialog);

		var cornerSize = 12;
		var cornerUL = dialog.create(x, y, 'ui_jeff_dialog_corner');
		var cornerUR = dialog.create(x+w+cornerSize, y, 'ui_jeff_dialog_corner');
		var cornerLL = dialog.create(x, y+h-8, 'ui_jeff_dialog_tip');
		var cornerLR = dialog.create(x+w+cornerSize, y+h, 'ui_jeff_dialog_corner');

		cornerUR.angle += 90;
		cornerLR.angle += 180;

		for (var ix = x + cornerSize; ix <= x + w; ix += 2) {
			var sideTop = dialog.create(ix, y, 'ui_jeff_dialog_border');
			var sideButtom = dialog.create(ix, y+h, 'ui_jeff_dialog_border');
			sideButtom.angle += 180;
		}
		for (var iy = y + cornerSize; iy <= y + h; iy += 2) {
			var sideLeft = dialog.create(x, iy, 'ui_jeff_dialog_border');
			sideLeft.angle += 270;
			if (iy < y + h - cornerSize) {
				var sideRight = dialog.create(x+w+cornerSize, iy, 'ui_jeff_dialog_border');	
				sideRight.angle += 90;
			}
		}

		var middleRect = game.add.graphics(0, 0);
		middleRect.beginFill(0xFFFFCA);
		middleRect.drawRect(0, 0, w , h - cornerSize);
		var middle = game.add.sprite(x + cornerSize/2, y + cornerSize/2);
		middle.addChild(middleRect);

		var middleFade = game.add.graphics(0, 0);
		middleFade.beginFill(0x000000);
		middleFade.drawRect(0, 0, w, h - cornerSize);
		var midFade = game.add.sprite(x + cornerSize/2, y + cornerSize/2);
		midFade.addChild(middleFade);
		midFade.alphaset = 0;

		game.depthGroups.dialogGroup.jeffBox = midFade;
		dialog.add(middle);
		dialog.add(midFade);

		dialog.x = x + w/2;
		dialog.y = y + h/2;
		dialog.pivot.x = x + w/2;
		dialog.pivot.y = y + h/2;
		dialog.alpha = 0;

		printDebug('UI: put Jeff dialog at ' + x + ', ' + y + ' with width: ' + w + ' height: ' + h);
	}

	this.tintJeffBox = function(tint) {
		var midFade = game.depthGroups.dialogGroup.jeffBox;
		if (midFade === undefined)
			return;
		if (tint) {
			midFade.alpha = 0.7;
			midFade.alphaset = 0.7;
		} else {
			midFade.alpha = 0;
			midFade.alphaset = 0;
		}
	}

	this.putJeffDialog = function(x, y, w, h, doneCB) {
		doneCB = doneCB || function() {};
		createJeffDialog(x, y, w, h);
		for (var i = 0; i < game.depthGroups.dialogGroup.children.length; i++) {
			var dialog = game.depthGroups.dialogGroup.children[i];
			dialog.dialogIn.onComplete.add(doneCB);
			dialog.dialogIn.start();
			dialog.dialogPop.start();
		}
		game.depthGroups.dialogGroup.jeffBox.alpha = game.depthGroups.dialogGroup.jeffBox.alphaset;
	}

	this.clearJeffDialog = function() {
		for (var i = 0; i < game.depthGroups.dialogGroup.children.length; i++) {
			var dialog = game.depthGroups.dialogGroup.children[i];
			dialog.dialogOut.start();
		}
	}

	this.drawRandomNPC = function(appearanceInfo, skinColor) {
		var npcBmd = game.add.bitmapData(60, 70);
		var parts = appearanceInfo.split(',');
		for (var i = 0; i < parts.length; i++) {
			var partArr = parts[i].split('|');
			var partName = partArr[0];
			var partNumb = parseInt(partArr[1]);
			npcBmd.draw('npc-' + partName + '-' + partNumb);
		}

		bitmapDataReplaceColor(npcBmd, 190, 147, 125, 255,
							   skinColor.r, skinColor.g, skinColor.b, 255,
							   60, 70);
		bitmapDataReplaceColor(npcBmd, 173, 122, 95, 255,
							   0.85 * skinColor.r, 0.75 * skinColor.g, 0.65 * skinColor.b, 255,
							   60, 70);

		return npcBmd;
	}

	this.generateNPCHands = function(left, right, skinColor) {
		var palmLeft = game.make.image(0, 0, 'npc-hand');

		var handsBmd = game.add.bitmapData(168, 198);

		palmLeft.anchor.setTo(1, 0);
		palmLeft.scale.x = -1;	// Flip image of left hand
		palmLeft.smoothed = false;

		handsBmd.draw(palmLeft, 10, 100);
		handsBmd.draw('npc-hand', 70, 100);

		for (var i = 0; i < 5; i++) {
			var flagLeft = left.charAt(i) == '1' ? '' : '-c';
			var flagRight = right.charAt(i) == '1' ? '' : '-c';

			var fingerLeft = game.make.image(0, 0, 'npc-hand-' + i + flagLeft);

			fingerLeft.anchor.setTo(1, 0);
			fingerLeft.scale.x = -1;
			fingerLeft.smoothed = false;

			handsBmd.draw(fingerLeft, 10, 100);
			handsBmd.draw('npc-hand-' + i + flagRight, 70, 100);

			fingerLeft.destroy();
		}

		bitmapDataReplaceColor(handsBmd, 190, 147, 125, 255,
							   skinColor.r, skinColor.g, skinColor.b, 255,
							   168, 198);
		bitmapDataReplaceColor(handsBmd, 173, 122, 95, 255,
							   0.85 * skinColor.r, 0.75 * skinColor.g, 0.65 * skinColor.b, 255,
							   168, 198);
		palmLeft.destroy();

		return handsBmd;
	}

	this.generateItemDrop = function() {

	}

}
