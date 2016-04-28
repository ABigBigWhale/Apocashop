function DialogManager(game) {

	game.dialog = {
		main : {
			box : game.add.text(250, 427, "", { font: "24px yoster_islandregular", fill: "#4d372c"} ),
			ghost : game.add.text(999, 999, "", { font: "24px yoster_islandregular"} )
		}
	};

	game.dialog.main.box.defaultY = 427;

	// Prints the message to the main text box.
	this.printMain = function(message) {
		var brokenMessage = formatMessage(game.dialog.main.box, game.dialog.main.ghost, 383, 5, 30, message);
		printMessage(game.dialog.main.box, brokenMessage, function() {
			console.log("MESSAGE IN MAIN TEXTBOX FINISHED PRINTING");
		});
	}

	this.clearMain = function() {
		game.dialog.main.box.destroy();
		game.dialog.main.box = game.add.text(250, 427, "", { font: "24px yoster_islandregular", fill: "#4d372c"} );
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
	function printMessage(box, message, onFinish) {

		isPrinting = true;

		box.text = '';

		var printLetter = function(message, index) {
			if(index < message.length) {
				var timeoutLength;

				if(message[index] === '/') {
					box.text = box.text + '\n';
					timeoutLength = 200;
				} else if(message[index] === "|") {
					box.text = box.text + "\n";
					timeoutLength = 0;
				} else if(message[index] === '@') {
					timeoutLength = 200;
				} else {
					box.text = box.text + message[index];
					if(message[index] == ',' || message[index] == '.' || message[index] == '?') {
						timeoutLength = 200;
					} else {
						timeoutLength = 25;
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