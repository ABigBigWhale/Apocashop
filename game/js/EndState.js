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
				var topScore = 52.0;
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

				game.analytics.track("game", "won", score);
				
				score = 4.0 * Math.min(1.0, score / topScore);
				
				var commentText = '';
				if (score <= 1.8) commentText = 'I mean...Come on...';
				else if (score <= 2.5) commentText = 'Awwwww...This is pretty sad...';
				else if (score <= 3.0) commentText = 'I hope you have S/NS\'ed...';
				else if (score <= 3.5) commentText = 'Still, probably won\'t make the Dean\'s List.';
				else if (score <= 3.9) commentText = 'That\'ll look nice on the Grade Report.';
				else commentText = 'Wow... [The ancient sales manager is surprised.]\n' + 
					'[Sadly...\n he doesn\'t have any surprise for you...]';
				
				var endOfDemoText = game.add.text(
					100, 200,
					"THANK YOU!\nYou have reached the end of the demo.\n" + 
					"The ancient sales manager gave you\n a rating of " + 
					parseFloat(Math.round(score * 10) / 10).toFixed(1) + '/4.0\n\n' + 
					commentText + '\n' +
					"[Click to restart]",
					{
						font: "28px yoster_islandregular",
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