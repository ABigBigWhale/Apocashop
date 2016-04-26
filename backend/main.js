var game = {};

var heroes = {
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

function generateNPC(day) {
	return {
		type : "interact",
		item : "sword",
		offers : [10],
		offerText : "SUP IM A RANDOM. TEN GOLD SWORD?",
		success : "YEYE THANKS BOI",
		fail : "POO."
	};
}

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
			1 : {
				hero : "man",
				fuzz : 1,
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
				chance : 0.05,
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
		}
	}
];

game.eventManager = new EventManager(game);
game.interactionManager = new InteractionManager(game);

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
	game.interactionManager.startDay();
	document.getElementById('start').style.display = 'none';
};

document.getElementById('yes').style.display = 'none';
document.getElementById('no').style.display = 'none';
document.getElementById('continue').style.display = 'none';