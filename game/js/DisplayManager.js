function DisplayManager(game) {

	//----------- Objects in title screen ------------
	var title;
	var titleStartText;

	//----------- Objects in environment -------------
	var imgBackground;
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
		this.imgBackground = game.add.image(0, 0, 'gp_background');
		this.shopKeeper = game.add.sprite(500, 272, 'gp_shopkeeper');
		this.dog = game.add.sprite(440, 300, 'gp_dog_small');
		this.dog.visible = false;
		this.shop = game.add.sprite(0, 0, 'shop_rock');
		this.jeff = game.add.sprite(this.shopKeeper.x + 35, 277, 'gp_jeff_noshadow');
		this.jeffShadow = game.add.sprite(this.shopKeeper.x + 43, 
										  this.shopKeeper.y + this.shopKeeper.height - 7, 'gp_jeff_shadow');

		game.depthGroups.envGroup.add(this.imgBackground);
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



	this.putTitleScreen = function() {
		game.add.image(0, 200, 'gp_background');
		var title = game.add.sprite(0, 0, 'gp_title');
		var clickStart = game.add.sprite(400, 500, 'gp_clickstart');

		clickStart.anchor.setTo(0.5, 0.5);
		clickStart.blinkTween = game.add.tween(clickStart).to({
			alpha: 0
		}, 1000, Phaser.Easing.Linear.None, true, 0, 500, true);

		title.shakeTween = game.add.tween(title).to({
			y: '-10'
		}, 1000, Phaser.Easing.Quadratic.In, true, 0, 500, true);
	};
}