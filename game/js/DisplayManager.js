function DisplayManager(game) {

	//----------- Objects in title screen ------------
	var title;
	var titleStartText;

	//----------- Objects in environment -------------
	var imgBackgroundSky;
	var clouds, cloudGenOn = false, 
		cloudIntv = randomIntInRange(5, 13), 
		cloudY = randomIntInRange(200, 300),
		cloudDur = randomIntInRange(1800, 3200),
		cloudTimer = game.time.create(false);
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

	this.putEnvironment = function() {
		this.imgBackgroundSky = game.add.image(0, 0, 'gp_background_sky');
		this.clouds = game.add.group();
		this.pedests = game.add.group();
		this.cloudTimer = game.time.create(false);
		this.pedestTimer = game.time.create(false);
		this.imgBackgroundTown = game.add.image(0, 0, 'gp_background_town');
		this.shopKeeper = game.add.sprite(500, 272, 'gp_shopkeeper');
		this.dog = game.add.sprite(440, 300, 'gp_dog_small');
		this.dog.visible = false;
		this.shop = game.add.sprite(0, 0, 'shop_rock');
		this.jeff = game.add.sprite(this.shopKeeper.x + 35, 277, 'gp_jeff_noshadow');
		this.jeffShadow = game.add.sprite(this.shopKeeper.x + 43, 
										  this.shopKeeper.y + this.shopKeeper.height - 7, 'gp_jeff_shadow');

		game.depthGroups.envGroup.add(this.imgBackgroundSky);
		game.depthGroups.envGroup.add(this.clouds);
		game.depthGroups.envGroup.add(this.imgBackgroundTown);
		game.depthGroups.envGroup.add(this.shopKeeper);
		game.depthGroups.envGroup.add(this.dog);
		game.depthGroups.envGroup.add(this.jeff);
		game.depthGroups.envGroup.add(this.jeffShadow);
		game.depthGroups.envGroup.add(this.pedests);


		this.shop.smoothed = false;
		this.shop.alpha = 0;
		this.shop.visible = false;

		this.shop.shopFadeTween = game.add.tween(this.shop).to(
			{alpha: 1}, 2000, Phaser.Easing.Linear.None, false
		);

		setPositionLowerMiddle(this.shop, this.shopKeeper);

		this.dog.anim = this.dog.animations.add('doge');
		this.dog.animations.play('doge', 3, true);

		this.jeff.floating = game.add.tween(this.jeff).to({
			y: 260
		}, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);

		this.jeffShadow.alpha = 0.6;
		this.jeffShadow.fadeIn = game.add.tween(this.jeffShadow).to({
			alpha: 0.2
		}, 2000, Phaser.Easing.Quadratic.None, true, 0, 1000, true);

	};


	this.putLoadingBackground = function() {
		var background = game.add.image(0, 500, 'gp_background');
		background.arriveTween = game.add.tween(background).to({
			y:'-300'
		}, 300, Phaser.Easing.Quadratic.None, true);
	}

	this.putTitleScreen = function() {
		var title = game.add.sprite(0, 0, 'gp_title');
		var clickStart = game.add.sprite(400, 400, 'gp_clickstart');
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
	};

	function starCloudClicked() {
		this.cloud.inputEnabled = false;
		var reward = randomIntInRange(5, 8);
		printDebug("UI: star cloud clicked! Rewarding " + reward + " gold.");

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
		if (randomIntInRange(1, 14) == 2) {   // Generate special clouds
			cloudAsset = 'gp_cloud_star';
			this.cloudDur = 6000;
		}
		var cloud = this.clouds.create(-58, this.cloudY, cloudAsset);
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
		this.cloudIntv = randomIntInRange(5, 13);
		this.cloudY = randomIntInRange(100, 240);
		this.cloudDur = randomIntInRange(40000, 80000);
	}

	this.putPedestrian = function() {
		this.randomPedestAttr();
		
		var pedestAsset = 'gp_passerby';
		var pedestrian = this.pedests.create(300, this.pedestY, pedestAsset);
		var pedestStepDur = this.pedestDur / 90;

		pedestrian.anchor.setTo(0, 1);
		pedestrian.tint = 0x999999 - (Math.random() * 0x004000);
		pedestrian.stepCount = 0;
		
		printDebug('UI: Putting pedestrian at ' + this.pedestY + ' with tint: ' + pedestrian.tint.toString(16));

		pedestrian.moveTween = game.add.tween(pedestrian)
			.to( {x: gameConfig.RESOLUTION[0]}, this.pedestDur, Phaser.Easing.Linear.None, true, 0, -1);

		pedestrian.walkTween = game.add.tween(pedestrian)
			.to( {y: '-4'}, pedestStepDur, Phaser.Easing.Quadratic.InOut, true, 0, 500, true);


		pedestrian.moveTween.onComplete.add(function() { 
			pedestrian.destroy();
		});

		pedestrian.walkTween.start();
		pedestrian.moveTween.start();

		if (this.pedestGenerationOn) {
			this.pedestTimer.add(
				Phaser.Timer.SECOND * game.rnd.realInRange(3, 8),
				this.putPedestrian, 
				this
			);
		}
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
		this.pedestIntv = randomIntInRange(2, 24);
		this.pedestY = randomIntInRange(350, 400);
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
		var middle = dialog.create(x + cornerSize/2, y + cornerSize/2);
		middle.addChild(middleRect);

		dialog.x = x + w/2;
		dialog.y = y + h/2;
		dialog.pivot.x = x + w/2;
		dialog.pivot.y = y + h/2;
		dialog.alpha = 0;

		printDebug('UI: put Jeff dialog at ' + x + ', ' + y + ' with width: ' + w + ' height: ' + h);
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
	}

	this.clearJeffDialog = function() {
		for (var i = 0; i < game.depthGroups.dialogGroup.children.length; i++) {
			var dialog = game.depthGroups.dialogGroup.children[i];
			dialog.dialogOut.start();
		}
	}
}