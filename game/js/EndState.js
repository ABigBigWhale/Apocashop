function EndStateWrapper(game) {

	var blackScreen;
	var restartHard;
	var restartSoft;
	var hardBox;
	var softBox;
	var gameOverText = null;
	var endOfDemoText = null;

	this.gameWon = false;
	
	this.setGameResult = function(won) {
		gameWon = won;	
	};

	var textStyle = {
		font: '20px yoster_islandregular',
		fill: '#FFFFFF',
		//wordWrap: true,
		//wordWrapWidth: optionWidth,
		align: 'right',
		//backgroundColor: '#acacac'
	};

	this.endState = function() {
			// TODO: temporary
			game.stage.backgroundColor = '#000000';
			blackScreen = game.add.graphics(0, 0);
			blackScreen.beginFill(0x0, 1);
			blackScreen.drawRect(0, 0, 800, 600);

			restartHard = game.add.text(800 - 100, 500, "Restart Game", {
				font: '20px yoster_islandregular',
				fill: '#FFFFFF',
				align: 'right'
			});
			restartSoft = game.add.text(240, 500, "Restart Day", {
				font: '20px yoster_islandregular',
				fill: '#FFFFFF',
				align: 'left'
			});
			restartHard.anchor.setTo(1, 1);
			restartHard.inputEnabled = true;
			restartSoft.anchor.setTo(1, 1);
			restartSoft.inputEnabled = true;

			restartSoft.events.onInputOver.add(function() {
				restartSoft.fill = '#d3af7a';
			}, this);
			restartHard.events.onInputOver.add(function() {
				restartHard.fill = '#d3af7a';
			}, this);
			restartSoft.events.onInputOut.add(function() {
				restartSoft.fill = '#FFFFFF';
			}, this);
			restartHard.events.onInputOut.add(function() {
				restartHard.fill = '#FFFFFF';
			}, this);
			restartHard.events.onInputDown.add(restartGame);
			restartSoft.events.onInputDown.add(restartLevel);

			hardBox = game.add.image(0, 0, 'endday_boxoutline');
			softBox = game.add.image(0, 0, 'endday_boxoutline');
			hardBox.x = restartHard.x - restartHard.width - 10;
			softBox.x = restartSoft.x - restartSoft.width - 10;
			hardBox.y = restartHard.y - restartHard.height - 15;
			softBox.y = restartSoft.y - restartSoft.height - 15;

			if (!gameWon) {
				gameOverText = game.add.text(
					100, 200, 
					"GAME OVER: You have gone broke", 
					{
						font: "32px yoster_islandregular",
						fill: "#FFFFFF"
					}
				);
			} else {
				restartSoft.kill();
				softBox.kill();
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
				
				endOfDemoText = game.add.text(
					100, 200,
					"THANK YOU!\nYou have reached the end of the demo.\n" + 
					"The ancient sales manager gave you\n a rating of " + 
					parseFloat(Math.round(score * 10) / 10).toFixed(1) + '/4.0\n\n' + 
					commentText,
					{
						font: "28px yoster_islandregular",
						fill: '#e7bd68'
					}
				);
			}

			function killScreen() {
				blackScreen.kill();
				restartHard.kill();
				restartSoft.kill();
				hardBox.kill();
				softBox.kill();
				if (gameOverText != null) 
					gameOverText.kill();
				gameOverText = null;
				if (endOfDemoText != null)
					endOfDemoText.kill();
				endOfDemoText = null;
			}

			function restartLevel() {
				game.analytics.track("game", "restartLevel");
				killScreen();
				game.conditionManager.revertToCheckpoint();
				game.playerState.resetStats();
				game.stock.resetStock(game.playerState.getItems());
				game.restartDay();
			}

			function restartGame() {
				game.analytics.track("game", "restartGame");
				killScreen();
				game.reset.start();
				game.state.start('state_start');
				//location.reload();
			}
		}
}