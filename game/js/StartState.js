function StartStateWrapper(game) {

	this.startState = {
		create: function() {
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

			game.input.onDown.add(function() {
				printDebug('STARTING state_play');
				game.state.start('state_play');
			});
		}
	};

}