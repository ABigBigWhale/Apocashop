function EndStateWrapper(game) {

	this.gameWon = false;
	
	this.setGameResult = function(won) {
		gameWon = won;	
	};

	this.endState = {
		create: function() {
			// TODO: temporary
			game.stage.backgroundColor = '#000000';

			if (!gameWon) {
				var gameOverText = game.add.text(
					100, 200, 
					"GAME OVER: You have gone broke. \n[Click to restart]", 
					{
						font: "32px yoster_islandregular",
						fill: "#FFFFFF"
					}
				);
			} else {
				var topScore = 62.0;
				var score = game.playerState.getGold() * 1.0;
				
				var items = game.playerState.getStockedItems();
				
				for (var key in items) {
					var itemNum = items[key];
					var price = 0;
					switch (key) {
						case 'sword':
							price = 4.5;
							break;
						case 'chicken':
							price = 2.8;
							break;
						case 'bow':
							price = 6.4;
							break;
						case 'shield':
							price = 1.5;
							break;
					}
					score += itemNum * price;
				}
				
				score = 4.0 * Math.min(1.0, score / topScore);
				
				var endOfDemoText = game.add.text(
					100, 200,
					"THANK YOU!\nYou have reached the end of the demo.\n" + 
					"The ancient sales manager gave you\n a rating of " + 
					parseFloat(Math.round(score * 10) / 10).toFixed(1) + '/4.0\n\n' + 
					"[Click to restart]",
					{
						font: "32px yoster_islandregular",
						fill: '#e7bd68'
					}
				);
			}

			game.input.onDown.add(function() {
				//game.state.start('state_start');
				location.reload();
			});
		}
	};

}