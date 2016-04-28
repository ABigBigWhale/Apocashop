function DialogManager(game) {

	var self = this;

	game.dialog = {
		main : {
			box : game.add.text(250, 427, "", { font: "24px yoster_islandregular"} ),
			ghost : game.add.text(999, 999, "", { font: "24px yoster_islandregular"} )
		}
	};

	var messageBuffer = [];

	function parseMessage(message) {

		var isImmediate = (messageBuffer.length === 0);

		var splitMessage = message.split("^");
		for(var i = 0; i < splitMessage.length; i++) {
			messageBuffer.push(splitMessage[i]);
		}

		if(isImmediate) {
			printMessage(messageBuffer.shift());
		}

	}

	this.printMain = function(message) {
		self.printMessage(game.dialog.main.box, game.dialog.main.ghost, 375, message);
	}

	var isPrinting = false;

	this.printMessage = function(box, ghostBox, maxWidth, message) {

		isPrinting = true;

		box.text = "";

		var printLetter = function(message, index) {
			if(index < message.length) {
				var timeoutLength;

				if(index === 0) {
					ghostBox.text = message.split(" ")[0];
				}

				if(message[index] === " ") {
					var ghostWord = " ";
					for(var i = index + 1; i < message.length; i++) {
						if(message[i] === ' ') {
							break;
						}
						ghostWord += message[i];
					}
					ghostBox.text += ghostWord;
					if(ghostBox.width > maxWidth) {
						box.text = box.text + "\n";
						ghostBox.text = ghostWord.slice(1);
					} else {
						box.text = box.text + " ";
					}
				} else if(message[index] === '/') {
					box.text = box.text + '\n';
					ghostBox.text = "";
					timeoutLength = 200;
				} else if(message[index] === "|") {
					box.text = box.text + "\n";
					ghostBox.text = "";
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
				isPrinting = false;
			}
		}

		printLetter(message, 0);
	}

}