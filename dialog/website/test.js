var ghost = $("#ghostMessage");
var cont = $("#continue");
cont.hide();
//ghost.hide();

//var exampleSocket = new WebSocket("ws://192.168.0.106:8001");

var oldHost = localStorage.getItem("host");

oldHost = oldHost || "localhost:8001";

var address = prompt("Enter address", oldHost);

localStorage.setItem("host", address);

var exampleSocket = new WebSocket("ws://" + address);

exampleSocket.onopen = function() {

	exampleSocket.onmessage = function(event) {
		//printMessage(event.data);
		parseMessage(event.data);
	}

	exampleSocket.send("sup");

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

var blinkTimeout = false;

function startBlink() {

	var blinkOn = function() {
		cont.show();
		blinkTimeout = setTimeout(blinkOff, 500);
	};

	var blinkOff = function() {
		cont.hide();
		blinkTimeout = setTimeout(blinkOn, 500);
	};

	blinkOn();

}

function stopBlink() {
	cont.hide();
	clearTimeout(blinkTimeout);
	blinkTimeout = false;
}

$("body").click(function() {
	if(messageBuffer.length > 0 && !isPrinting) {
		printMessage(messageBuffer.shift());
	}
});

var isPrinting = false;

function printMessage(message) {

	isPrinting = true;

	stopBlink();

	var location = document.getElementById('message');

	location.innerHTML = "";

	message = addBreaks(message);

	console.log(message);

	var printLetter = function(message, index) {
		if(index < message.length) {
			var timeoutLength;
			if(message[index] == '/') {
				location.innerHTML = location.innerHTML + '<br>';
				timeoutLength = 200;
			} else if(message[index] == "|") {
				location.innerHTML = location.innerHTML + "<br>";
				timeoutLength = 0;
			} else if(message[index] == '@') {
				timeoutLength = 200;
			} else {
				location.innerHTML = location.innerHTML + message[index];
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
			if(messageBuffer.length > 0) {
				startBlink();
			} else {
				stopBlink();
			}
		}
	}

	printLetter(message, 0);
}

function addBreaks(message) {
	messageHeight = 0;
	message = message.split("...").join(". . .");
	var lineSplit = message.split("/");
	for(var j = 0; j < lineSplit.length; j++) {
		ghost.text("");
		var affectedIndexes = [];
		var splitMessage = lineSplit[j].split(" ");
		var oldHeight = ghost.height();
		for(var i = 0; i < splitMessage.length; i++) {
			ghost.append(splitMessage[i].split("@").join("") + " ");
			if(ghost.height() > oldHeight && oldHeight !== 0) {
				//alert("ghostHeight: " + ghost.height() + ", oldHeight: " + oldHeight);
				splitMessage[i] = "|" + splitMessage[i];
				affectedIndexes.push(i);
			}
			oldHeight = ghost.height();
		}
		lineSplit[j] = splitMessage.join(" ").split(" |").join("|");
		messageHeight += ghost.height();
		console.log(affectedIndexes);
	}
	console.log(messageHeight);
	$("#message").css("padding-top", (($(window).height() - messageHeight) / 2 - 12) + "px")
	return lineSplit.join("/");
}