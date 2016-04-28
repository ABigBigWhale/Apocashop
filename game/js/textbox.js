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

// var blinkTimeout = false;

// function startBlink() {

// 	var blinkOn = function() {
// 		cont.show();
// 		blinkTimeout = setTimeout(blinkOff, 500);
// 	};

// 	var blinkOff = function() {
// 		cont.hide();
// 		blinkTimeout = setTimeout(blinkOn, 500);
// 	};

// 	blinkOn();

// }

// function stopBlink() {
// 	cont.hide();
// 	clearTimeout(blinkTimeout);
// 	blinkTimeout = false;
// }

// $("body").click(function() {
// 	if(messageBuffer.length > 0 && !isPrinting) {
// 		printMessage(messageBuffer.shift());
// 	}
// });

function printMain(message) {
	printMessage(game.dialog.mainBox, message, game.dialog.mainGhost, 375);
}

var isPrinting = false;

function printMessage(box, message, ghostBox, maxWidth) {

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