function DialogManager(game) {

	game.dialog = {
		main : {
			box : game.add.text(250, 427, "", { font: "24px yoster_islandregular", fill: "#4d372c"} ),
			ghost : game.add.text(999, 999, "", { font: "24px yoster_islandregular"} )
		},
		jeff : {
			box : game.add.text(500, 130, "SUP, I'M JEFF. How's it?", { font : "16px yoster_islandregular" }),
			ghost : game.add.text(999, 999, "", { font : "16px yoster_islandregular" })
		}
	};

	game.dialog.main.box.defaultY = 427;
	game.dialog.jeff.box.defaultY = 130;

	// Prints the message to the main text box.
	this.printMain = function(message, doneCB) {
		doneCB = doneCB || function() {};
		var brokenMessage = formatMessage(game.dialog.main.box, game.dialog.main.ghost, 383, 5, 30, message);
		printMessage(game.dialog.main.box, brokenMessage, 25, 200, game.audio.bip, doneCB);
	}

	this.printJeff = function(message, doneCB) {
		doneCB = doneCB || function() {};
		var brokenMessage = formatMessage(game.dialog.jeff.box, game.dialog.jeff.ghost, 230, 4, 23, message);
		printMessage(game.dialog.jeff.box, brokenMessage, 15, 100, false, doneCB);
	}

	// Adds line breaks into the message, and nudges the text box vertically to
	// center it in the text area.
	function formatMessage(box, ghostBox, maxWidth, numLines, lineHeight, message) {
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
					if(letterSound) {
						letterSound.stop();
						letterSound.play();
					}
					if(message[index] == ',' || message[index] == '.' || message[index] == '?') {
						timeoutLength = pauseDelay;
					} else {
						timeoutLength = letterDelay;
					}
				}
				setTimeout(function() {
					printLetter(message, index + 1);
				}, timeoutLength);
			} else {
				onFinish();
			}
		}

		printLetter(message, 0);
	}

}