function DialogManager(game) {

	game.dialog = {
		main : {
			box : game.add.text(250, 427, "", { font: "24px yoster_islandregular", fill: Colors.PassiveMain} ),
			ghost : game.add.text(999, 999, "", { font: "24px yoster_islandregular"} ),
			isPrinting : false,
			isFrozen : false,
			freeze : function(toggle) {
				if(toggle) {
					this.isFrozen = true;
				} else {
					this.isFrozen = false;
					if(this.unfreezeCallback) {
						this.unfreezeCallback();
					}
				}
			},
			message : false,
			timeout : false,
			callback : false,
			unfreezeCallback : false
		},
		jeff : {
			box : game.add.text(560, 70, "", { font : "16px yoster_islandregular", fill: Colors.PassiveDarker }),
			ghost : game.add.text(999, 999, "", { font : "16px yoster_islandregular" }),
			timeout : false
		},
		dog : {
			box : game.add.text(300, 130, "", { font : "16px yoster_islandregular", fill: Colors.PassiveDarker }),
			ghost : game.add.text(999, 999, "", { font : "16px yoster_islandregular" }),
			timeout : false
		},
		wrapup : {
			box : game.add.text(150, 300, "", { font: "24px yoster_islandregular", fill: Colors.PassiveLighter }),
			ghost : game.add.text(999, 999, "", { font: "24px yoster_islandregular" }),
			timeout : false
		}
	};

	game.depthGroups.shopGroup.add(game.dialog.jeff.box);

	game.dialog.main.box.defaultY = 427;
	game.dialog.jeff.box.defaultY = 130;
	game.dialog.wrapup.box.defaultY = 300;

	this.printWrapup = function(message, doneCB) {
		doneCB = doneCB || function() {};
		clearTimeout(game.dialog.wrapup.timeout);
		var brokenMessage = formatMessage(game.dialog.wrapup.box, game.dialog.wrapup.ghost, 500, 5, 30, message);
		printMessage(game.dialog.wrapup.box, brokenMessage, 10, 100, false, game.dialog.wrapup, doneCB);
	};

	var mainSound = game.Sounds.TEXTHIGH;

	this.setMainSound = function(sound) {
		if(sound) {
			mainSound = game.Sounds["TEXT" + sound];
		} else {
			mainSound = randomElement([game.Sounds.TEXTMED, game.Sounds.TEXTHIGH, game.Sounds.TEXTMELODY, game.Sounds.TEXTMURPHY, game.Sounds.TEXTSTITCH]);
		}
	}

	// Prints the message to the main text box.
	this.printMain = function(message, isAlreadyRead, doneCBStub) {
		doneCBStub = doneCBStub || function() {};
		var doneCB = function() {
			doneCBStub();
			game.analytics.track("text", "noSkipText");
		};
		clearTimeout(game.dialog.main.timeout);
		var brokenMessage = formatMessage(game.dialog.main.box, game.dialog.main.ghost, 383, 5, 30, message);
		game.dialog.main.message = brokenMessage;
		game.dialog.main.callback = doneCBStub;
		var printFunc = function() {
			if(isAlreadyRead) {
				printMessage(game.dialog.main.box, brokenMessage, 0, 0, false, game.dialog.main, doneCBStub);
			} else {
				printMessage(game.dialog.main.box, brokenMessage, 15, 150, mainSound, game.dialog.main, doneCB);
			}
			game.dialog.main.unfreezeCallback = false;
		};
		if(game.dialog.main.isFrozen) {
			game.dialog.main.unfreezeCallback = printFunc;
		} else {
			printFunc();
		}
	};

	this.jumpMain = function() {
		game.analytics.track("text", "skipText");
		var splitMessage = game.dialog.main.message.split("@").join("").split(/\/|\|/);
		clearTimeout(game.dialog.main.timeout);
		game.dialog.main.box.text = splitMessage.join("\n");
		game.dialog.main.callback();
	};

	var isJeffActive = false;

	this.printJeff = function(message, doneCB) {
		doneCB = doneCB || function() {};
		if(message === "") {
			isJeffActive = false;
			clearTimeout(game.dialog.jeff.timeout);
			game.dialog.jeff.box.text = "";
			game.displayManager.clearJeffDialog();
			doneCB();
			return;
		}
		var printFunc = function() {
			clearTimeout(game.dialog.jeff.timeout);
			var brokenMessage = formatMessage(game.dialog.jeff.box, game.dialog.jeff.ghost, 180, 3, 23, message);
			printMessage(game.dialog.jeff.box, brokenMessage, 15, 100, false, game.dialog.jeff, doneCB);
		}
		if(isJeffActive) {
			printFunc();
		} else {
			game.displayManager.putJeffDialog(550, 70, 200, 180, printFunc);
			isJeffActive = true;
		}
	};

	this.printDog = function(message, doneCB) {
		doneCB = doneCB || function() {};
		clearTimeout(game.dialog.dog.timeout);
		var brokenMessage = formatMessage(game.dialog.dog.box, game.dialog.dog.ghost, 230, 4, 23, message);
		printMessage(game.dialog.dog.box, brokenMessage, 15, 100, false, game.dialog.dog, doneCB);
	};

	// Adds line breaks into the message, and nudges the text box vertically to
	// center it in the text area.
	function formatMessage(box, ghostBox, maxWidth, numLines, lineHeight, message) {
		box.text = "";
		box.position.y = box.defaultY;
		var lineCount = 0;
		var lines = message.split("/");
		lineCount += lines.length;
		for(var i = 0; i < lines.length; i++) {
			ghostBox.text = "";
			var splitMessage = lines[i].split(" ");
			for(var j = 0; j < splitMessage.length; j++) {
				ghostBox.text += splitMessage[j] + " ";
				if(ghostBox.width > maxWidth) {
					splitMessage[j - 1] += "|";
					lineCount++;
					ghostBox.text = splitMessage[j] + " ";
				}
			}
			lines[i] = splitMessage.join(" ");
		}
		box.position.y += (numLines - lineCount) * (lineHeight / 2);
		return lines.join("/").split("| ").join("|");
	}

	// Prints the message into the text box, one character at a time.
	function printMessage(box, message, letterDelay, pauseDelay, letterSound, boxObj, onFinish) {
		
		isPrinting = true;

		box.text = '';

		var printLetter = function(message, index, isSound) {
			if(index < message.length) {
				var timeoutLength;

				if(message[index] === '/') {
					box.text = box.text + '\n';
					timeoutLength = pauseDelay;
				} else if(message[index] === "|") {
					box.text = box.text + "\n";
					timeoutLength = 0;
				} else if(message[index] === '@') {
					timeoutLength = pauseDelay;
				} else {
					box.text = box.text + message[index];
					if(letterSound && isSound) {
						game.soundManager.playSound(letterSound);
					}
					if(message[index] == ',' || message[index] == '.' || message[index] == '?') {
						timeoutLength = pauseDelay;
					} else {
						timeoutLength = letterDelay;
					}
				}
				boxObj.timeout = setTimeout(function() {
					printLetter(message, index + 1, !isSound);
				}, timeoutLength);
			} else {
				onFinish();
			}
		}

		printLetter(message, 0, true);
	}

}