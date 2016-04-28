// This is just a dumping ground for code to test my
// backend classes and interactions.

var game = {};

var items = {
	"sword" : {
		price : 5,
		jPrice : 7 
	}, 
	"chicken" : {
		price : 3,
		jPrice : 5,
	},
	"bow" : {
		price : 4,
		jPrice : 6
	},
	"water" : {
		price : 2,
		jPrice : 3
	}
}
var heroes = {
	"jeff" : {
		type : "dialog",
		dialog : "Sup, I'm Jeff!"
	},
	"man" : {
		type : "interact",
		item : "none",
		appearanceInfo : "MAN",
		offers : [0],
		offerText : "Yo, please hide me",
		success : "Thanks!",
		fail : "Well, guess I'll die then.",
		questions : {
			default : "Please, no time."
		},
		items : {
			default : "Please, no time.."
		},
		profiles : {
			default : "Please, no time."
		},
		sellConditions : ["hidMan"],
		refuseConditions : ["manDied"]
	},
	"tracker" : {
		type : "interact",
		item : "none",
		appearanceInfo : "TRACKER",
		offers : [10, 15],
		offerText : [
			"A very dangerous man is loose and I need to find him./I'll pay you ten gold for any information."
		, {
			hidPoorly : "I know he is here. WHERE IS HE!",
			default : "How about 15? I know you're not making enough to feed your family."
		}],
		success : "You won't get away this time!",
		fail : "Very well,@@ I hope you've been honest with me./@@@@For your sake.",
		questions : {
			day : "Busy.",
			news : "I just told you the news.",
			default : "Stop wasting my time."
		},
		items : {
			shield : "I have no need for that.",
			default : "Stop wasting my time."
		},
		profiles : {
			dragon : "That is not my concern, leave that to Fosado.",
			scaredMan : "Aha, That's him!@@ W@h@e@r@e@ @i@s@ @h@e@...",
			default : "Beneath my concern."
		},
		appearConditions : ["hidMan"],
		sellConditions : ["manDead"],
		refuseConditions : ["manLived"]
	}
}

// function generateNPC(day) {
// 	return {
// 		type : "interact",
// 		appearanceInfo : "APPEARANCE INFO",
// 		item : "sword",
// 		offers : [10],
// 		offerText : "SUP IM A RANDOM. TEN GOLD SWORD?",
// 		success : "YEYE THANKS BOI",
// 		fail : "POO."
// 	};
// }

var days = [
	{
		itemData : {
			sword : {
				min : 2,
				max : 9,
				priority : 5
			},
			chicken : {
				min : 1,
				max : 7,
				priority : 2
			}
		},
		sequence : {
			0 : {
				hero : "jeff",
				fuzz : 0,
				force : true
			},
			2 : {
				hero : "man",
				fuzz : 2,
				force : true
			},
			5 : {
				hero : "tracker",
				fuzz : 0,
				force : true
			}
		},
		conditions : {
			hidPoorly : {
				components : ["hidMan"],
				chance : 0.5,
				isLongTerm : false
			}
		},
		clues : {
			hero : [
				"Hero is this person",
				"Hero looks like this"
			],
			crisis : [
				"Look out for goblins",
				"Scary business, look out."
			]
		},
		questions : {
			day : "How was your day?",
			color : "What's your favorite color?"
		},
		length : 60000
	}
];

game.eventManager = new EventManager(game);
game.interactionManager = new InteractionManager(game);
game.playerState = new PlayerState(game);
game.stock = new Stock(game);
game.jeff = new Jeff(game);

// function crier(arg1, arg2) {
// 	console.log("HEY CRIER ARG1 is: " + arg1 + ", ARG2 is: " + arg2);
// }

// function crier2(arg1, arg2) {
// 	console.log("HEY CRIER2 ARG1 is: " + arg1 + ", ARG2 is: " + arg2);
// }

// eventManager.register(game.Events.DAY.START, crier);
// eventManager.register(game.Events.DAY.START, crier2);

// eventManager.notify(game.Events.DAY.START, "sup", "potato");

// eventManager.remove(game.Events.DAY.START, crier2);

// eventManager.notify(game.Events.DAY.START, "sup", "potato");

// eventManager.remove(game.Events.DAY.START, crier);

// eventManager.notify(game.Events.DAY.START, "sup", "potato");

document.getElementById('yes').onclick = function() {
	game.eventManager.notify(game.Events.INPUT.YES)
};

document.getElementById('no').onclick = function() {
	game.eventManager.notify(game.Events.INPUT.NO)
};

document.getElementById('continue').onclick = function() {
	game.eventManager.notify(game.Events.INPUT.CONTINUE)
};

document.getElementById('start').onclick = function() {
	game.interactionManager.startDay(days[0]);
	document.getElementById('start').style.display = 'none';
};

document.getElementById('yes').style.display = 'none';
document.getElementById('no').style.display = 'none';
document.getElementById('continue').style.display = 'none';

game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, item, offer) {
	document.getElementById('yes').style.display = '';
	document.getElementById('no').style.display = '';
	document.getElementById('continue').style.display = 'none';
	document.getElementById('dialog').innerHTML = ("OFFER: " + offer);
});

game.eventManager.register(game.Events.UPDATE.GOLD, function(gold) {
	document.getElementById('gold').innerHTML = ("Gold: " + gold);
});

game.eventManager.register(game.Events.UPDATE.ITEMS, function(items) {
	var string = "";
	for (var key in items) {
		string += key + ": " + items[key] + " ";
	}
	document.getElementById('items').innerHTML = ("Items: " + string);
});

game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
	document.getElementById('yes').style.display = 'none';
	document.getElementById('no').style.display = 'none';
	document.getElementById('continue').style.display = '';
	document.getElementById('dialog').innerHTML = ("DIALOG: " + dialog);
});