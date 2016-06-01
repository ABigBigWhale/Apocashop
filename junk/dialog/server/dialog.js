var ws = require("nodejs-websocket")
var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var npc = require('./npc');

var port = parseInt(process.argv[2]);
console.log("Listening on port " + port);

//var connections = [];
var connection = false;

// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
	console.log("New connection")

	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		connection = false;
	})

	connection = conn;
}).listen(port)

function sendMessage(message) {
	console.log("Sending: " + message);
	if(message === "ERROR") {
		return;
	}
	if(connection) {
		connection.sendText(message);
	} else {
		console.log("NOT CONNECTED TO CLIENT");
	}
}

var activeHero = false;

rl.on('line', function(line) {

	var splitMessage = line.split(" ");

	if(splitMessage[0] === 'roll') {
		var randomNum = Math.ceil(Math.random() * parseInt(splitMessage[1]));
		console.log("Dice Roll: " + randomNum);
		return;
	}

	if(splitMessage[0] === 'set') {
		activeHero = splitMessage[1];
		console.log("HERO IS NOW: " + activeHero);
		return;
	}

	if(splitMessage[0] === 'list') {
		console.log(npc.hero.list());
		return;
	}

	if(splitMessage[0] === 'c') {
		sendMessage(splitMessage.slice(1).join(" "));
		return;
	}

	if(activeHero) {

		switch(splitMessage[0]) {
			case "q":
				if(splitMessage.length > 1) {
					console.log(npc.hero.query(activeHero, splitMessage[1]));
				} else {
					console.log(npc.hero.query(activeHero));
				}
				return;
			case "unset":
				activeHero = false;
				console.log("Back to default");
				return;
		}

		if(splitMessage.length > 1) {
			sendMessage(npc.hero.getMessage(activeHero, splitMessage[0], splitMessage[1]));
		} else {
			sendMessage(npc.hero.getMessage(activeHero, splitMessage[0]));
		}

		return;

	}

	var toSend = "ERROR";

	switch(splitMessage[0]) {
		case 'greeting':
			toSend = npc.generateGreeting(splitMessage[1], splitMessage[2]);
			break;
		case "haggle":
			toSend = npc.generateHaggle(splitMessage[1]);
			break;
		case "thankyou":
			toSend = npc.generateThankyou();
			break;
		case "angry":
			toSend = npc.generateAngryleave();
			break;
		case "questions":
			toSend = npc.question.getAnswer(splitMessage[1]);
			break;
		case "profiles":
			toSend = npc.profile.getProfile(splitMessage[1]);
			break;
		case "items":
			toSend = npc.item.getItem(splitMessage[1]);
			break;
		case "q":
			console.log("Commands: greeting, haggle, thankyou, angry, questions, profiles, items, c, set, list");
			console.log("Questions: " + npc.question.getQuestions());
			console.log("Items: " + npc.item.listItems());
			console.log("Profiles: " + npc.profile.listProfiles());
			return;
	}
	
	sendMessage(toSend);

});