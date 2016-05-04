function DialogManager(game) {

	game.dialog = {
		main : {
			box : game.add.text(250, 427, "", { font: "24px yoster_islandregular", fill: "#4d372c"} ),
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
			box : game.add.text(500, 130, "", { font : "16px yoster_islandregular" }),
			ghost : game.add.text(999, 999, "", { font : "16px yoster_islandregular" })
		}
	};

	game.depthGroups.shopGroup.add(game.dialog.jeff.box);

	game.dialog.main.box.defaultY = 427;
	game.dialog.jeff.box.defaultY = 130;

	// Prints the message to the main text box.
	this.printMain = function(message, isAlreadyRead, doneCB) {
		doneCB = doneCB || function() {};
		var brokenMessage = formatMessage(game.dialog.main.box, game.dialog.main.ghost, 383, 5, 30, message);
		game.dialog.main.message = brokenMessage;
		game.dialog.main.callback = doneCB;
		var printFunc = function() {
			if(isAlreadyRead) {
				printMessage(game.dialog.main.box, brokenMessage, 0, 0, false, doneCB);
			} else {
				printMessage(game.dialog.main.box, brokenMessage, 15, 150, false, doneCB);
			}
			game.dialog.main.unfreezeCallback = false;
		};
		if(game.dialog.main.isFrozen) {
			game.dialog.main.unfreezeCallback = printFunc;
		} else {
			printFunc();
		}
	}

	this.jumpMain = function() {
		var splitMessage = game.dialog.main.message.split("@").join("").split(/\/|\|/);
		clearTimeout(game.dialog.main.timeout);
		game.dialog.main.box.text = splitMessage.join("\n");
		game.dialog.main.callback();
	};

	this.printJeff = function(message, doneCB) {
		doneCB = doneCB || function() {};
		var brokenMessage = formatMessage(game.dialog.jeff.box, game.dialog.jeff.ghost, 230, 4, 23, message);
		printMessage(game.dialog.jeff.box, brokenMessage, 15, 100, false, doneCB);
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
	function printMessage(box, message, letterDelay, pauseDelay, letterSound, onFinish) {
		
		isPrinting = true;

		box.text = '';

		var printLetter = function(message, index) {
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
					if(message[index] == ',' || message[index] == '.' || message[index] == '?') {
						timeoutLength = pauseDelay;
					} else {
						timeoutLength = letterDelay;
					}
				}
				game.dialog.main.timeout = setTimeout(function() {
					printLetter(message, index + 1);
				}, timeoutLength);
			} else {
				onFinish();
			}
		}

		printLetter(message, 0);
	}

}