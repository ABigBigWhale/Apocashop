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

			restartHard = game.add.text(400, 500, "Restart Game", {
				font: '24px yoster_islandregular',
				fill: '#FFFFFF',
				align: 'right'
			});
			restartSoft = game.add.text(400, 400, "Retry Day", {
				font: '32px yoster_islandregular',
				fill: '#FFFFFF',
				align: 'left'
			});
			restartHard.anchor.setTo(0.5, 0.5);
			restartHard.inputEnabled = true;
			restartSoft.anchor.setTo(0.5, 0.5);
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
			hardBox.scale.setTo(1.5, 1.5);
			hardBox.anchor.setTo(0.5, 0.5);
			softBox = game.add.image(0, 0, 'endday_boxoutline');
			softBox.scale.setTo(1.5, 1.5);
			softBox.anchor.setTo(0.5, 0.5);
			hardBox.x = restartHard.x;
			softBox.x = restartSoft.x;
			hardBox.y = restartHard.y;
			softBox.y = restartSoft.y;

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
				// restartHard.x = 400 - restartHard.width;
				// hardBox.x = restartHard.x - restartHard.width - (hardBox.width - restartHard.width) / 2;
				var topScore = 100.0;
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
				if (score <= 1.8) commentText = "King Zoran sends you home, hoping you'll try again.";
				else if (score <= 2.5) commentText = 'King Zoran sends you on our way with a hefty sack of gold.';
				else if (score <= 3.0) commentText = 'King Zoran stops making you pay taxes.\nWell, some of your taxes.';
				else if (score <= 3.5) commentText = 'King Zoran sets you up with a shop in the capital.';
				else if (score <= 3.9) commentText = 'King Zoran makes you an official advisor.';
				else commentText = 'King Zoran makes you an official advisor.\n' + 
					'Someday, you and Jeff may even rule this\nkingdom.';
				
				endOfDemoText = game.add.text(
					100, 200,
					"You and the king arrive at the palace\n" + 
					"King Zoran gives you an\n official rating of " + 
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