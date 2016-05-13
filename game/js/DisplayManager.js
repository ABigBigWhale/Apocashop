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
	var imgBackgroundTown;
	var shopKeeper;
	var dog;
	var shop;
	var jeff, jeffShadow;



	/*
	var environment = {
		imgBackground: null,
		shopKeeper: null,
		dog: null,
		shop: null,
	};
	*/
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
		this.cloudTimer = game.time.create();
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

		this.shop.smoothed = false;
		this.shop.alpha = 0;
		this.shop.visible = false;

		this.shop.shopFadeTween = game.add.tween(this.shop).to(
			{alpha: 1}, 2000, Phaser.Easing.Linear.None, false
		);

		setPositionLowerMiddle(this.shop, this.shopKeeper);

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

	// duration: time takes to reach end of screen
	this.putCloud = function() {
		this.randomCloudAttr();
		printDebug('UI: Putting cloud at ' + this.cloudY);
		var cloud = this.clouds.create(-58, this.cloudY, 'gp_cloud');
		cloud.floatTween = game.add.tween(cloud).to( {x: gameConfig.RESOLUTION[0]}, this.cloudDur);
		cloud.floatTween.start();
		cloud.floatTween.onComplete.add(function() { 
			cloud.kill();
		});
		
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
}