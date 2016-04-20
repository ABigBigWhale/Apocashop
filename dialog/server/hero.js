var heroes = {
	"jeff" : {
		greeting : "Hey pal, I'm Jeff!\\Jeff the Magic Anvil!\\No, seriously. That's what I am.",
		greeting2 : "I'm here to help you run this shop!",
		greeting3 : "If you give me five minutes, I can make any item you want\\...\\for a price.",
		greeting4 : "Y@O@U@R@ @S@O@U@L@ . @ .@ .@\\But for you kid, I'll also accept gold pieces.",
		greeting5 : "You've got a lot of responsibility to this town. If you don't sell to the right people, things may get bad.",
		greeting6 : "Stay sharp kiddo, but don't worry, I've got your back.\\I'll let you know if you take a wrong turn.",
	},
	"seer" : {
		firstDay : "For many moons have I seen your coming, humble shopkeeper.",
		explanation : "Revealing all the matching cards shall make your path clear.",
		congratsOne : "Congratulations youngling, you've managed to match two cards.\\@@Songs will be sung of this day.",
		congratsGeneral : "Well done, youngling!\\This effort shall make your burden much lighter.",
		match1 : "Nicely done!",
		match2 : "Ooh!"
	},
	"dog" : {
		greeting : "Arf!\\@(The dog is eyeing one of your chickens. He doesn't appear to have any gold.)",
		success : "Arf!\\@(The dog trots off triumphantly, chicken in mouth.)",
		fail : "Arf!\\@(The dog stumbles away dejectedly, eyeing a group of pigeons.)",
		default : "Arf!"
	},
	"dayOne" : {
		greeting : "Hello shopkeeper, I hope you're not bored,\\for five gold, I would like to buy a sword!",
		success : "Thank you sir,\\were I a cat, I would purr!",
		fail : "I do not have the cash,\\my apologies for being brash!",
		questions : {
			color : "Though it may fill some with dread,\\I must say, my favorite color is red!",
			day : "My day has been fun, not too short not too long.\\If this takes much longer, I may break out in song!",
			default : "Of that, I have not been taught,\\and thus I sadly know naught."
		},
		items : {
			sword : "Swords are great for stabbing,\\Note: they are not meant for grabbing!",
			default : "I do not know what to make of that,\\but I am glad to have had this chat!"
		},
		profiles : {
			goblin : "Ah, my mortal enemy is that.\\I wish to engage one in single combat.",
			default : "What a face, what a smile!\\And what dashing style!"
		}
	},
	"falseDayOne" : {
		greeting : "Ahoy there friend, this is a good month,\\I'd like a sword for two gold please.\\@Urm, @@@dunth?",
		success : "Thank you my friend!",
		fail : "Fine, I'll go elsewhere.",
		questions : {
			color : "Though I love many colors, my favorite is orange.\\It's the greatest of colors, because it's so ... @@@@florange?",
			day : "Good.",
			default : "What?"
		},
		items : {
			sword : "Swords are the best, I need one. @@@@Um.@@@@@ Rhyming is hard, and I've run out of rhymes.",
			default : "Erm, @@cool?"
		},
		profiles : {
			goblin : "Eek! Get it away, get it away!",
			default : "Yup, that's a person?"
		}
	},
	"dayTwo" : {
		greeting : "Get @bow,@@ five @gold?",
		success : "Five gold, @bow get!",
		fail : "Five gold bow ...",
		questions : {
			color : "@@Gold!",
			number : "@@Five!",
			default : "..."
		},
		items : {
			bow : "Bow!",
			default : "..."
		},
		profiles : {
			convict : "Bow get!",
			default : "..."
		}
	},
	"falseDayTwo" : {
		greeting : "Three gold, bow get?",
		success : "Thanks!",
		fail : "Ugh, fine.",
		questions : {
			color : "Red!",
			number : "Four!",
			default : "Huh?"
		},
		items : {
			bow : "Nice!",
			default : "Huh?"
		},
		profiles : {
			convict : "...",
			default : "..."
		}
	},
	"dayTwoConvict" : {
		greeting : "Hey pal, can I get one of your bows for seven gold?",
		success : "Heh. Thanks.",
		fail : "We'll get you for this.",
		questions : {
			color : "@B@l@o@o@d@.",
			number : "What?",
			default : "Huh?"
		},
		items : {
			bow : "Eep! Get that thing away from me.",
			default : "Stop wasting my time."
		},
		profiles : {
			convict : "Heh.",
			default : "Why are you showing this to me?"
		}
	},
	"salesman" : {
		greeting : "Hey, want a new item? Word is, it'll be useful ...\\I'll part with it for ten gold.",
		success : "Pleasure doing business.",
		fail : "Alright, alright, I'll get out of your hair.\\You'll regret this.",
		questions : {
			color : "Money.",
			number : "The highest you can think of.",
			default : "Don't know, don't care."
		},
		items : {
			bow : "Looks expensive.",
			default : "Huh?"
		},
		profiles : {
			convict : "Better watch out for these guys.",
			default : "No thoughts."
		}
	},
	"dayThree" : {
		greeting : "One gold, a shield of fire?",
		success : "...",
		fail : "...",
		questions : {
			day : "A day is nice!",
			news : "Another dead in North?",
			default : "..."
		},
		items : {
			shield : "Ah, defense is necessary!",
			default : "..."
		},
		profiles : {
			dragon : "Another dragon is nothing!",
			default : "..."
		}
	},
	"falseDayThree" : {
		greeting : "Normally, I don't ask for odd shields.\\Three gold on?",
		success : "Heh, thanks!",
		fail : "Darn.",
		questions : {
			day : "Not too bad!",
			news : "Nothing of note.",
			default : "Not sure."
		},
		items : {
			shield : "What a shield!",
			default : "Meh."
		},
		profiles : {
			dragon : "Aha! The beast that I must slay!",
			default : "Meh."
		}
	},
	"scaredMan" : {
		greeting : "I need to hide here. He's after me.\\Please, @@he'll kill me if he finds me.",
		success : "Thank you.",
		fail : "Oh no.",
		questions : {
			day : "Very, @@very@ bad.",
			news : "Things are not good.",
			default : "Please,@@ I don't have much time."
		},
		items : {
			shield : "I don't know what to make of that.",
			default : "I don't know what to make of that."
		},
		profiles : {
			dragon : "There's a dragon?",
			default : "I don't know them."
		}
	},
	"tracker" : {
		greeting : "A very dangerous man is loose and I need to find him.\\I'll pay you ten gold for any information.",
		success : "You won't get away this time!",
		fail : "Very well,@@ I hope you've been honest with me.\\@@@@For your sake.",
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
		}
	},
	"beggar" : {
		greeting : "Please, I need a bucket of water ...\\@@Please.",
		success : "Thank you, thank you.",
		fail : "...",
		questions : {
			day : "Very,@@ very,@@ very bad.",
			news : "Fire. @@@So much fire.",
			default : "..."
		},
		items : {
			shield : "Wish I had that yesterday.",
			water : "Please...",
			default : "..."
		},
		profiles : {
			dragon : "... ... ...",
			default : "..."
		}
	},
	"hardHero" : {
		greeting : "Hiya! I'm going to need a fireproof shield, please.\\@Two gold.",
		success : "Thank you, thank you.",
		fail : "...",
		questions : {
			day : "Very,@@ very,@@ very bad.",
			news : "Fire. @@@So much fire.",
			default : "..."
		},
		items : {
			shield : "Wish I had that yesterday.",
			water : "Please...",
			default : "..."
		},
		profiles : {
			dragon : "... ... ...",
			default : "..."
		}
	}
}

function list() {
	return Object.keys(heroes);
}

function getMessage(hero, term, subTerm) {
	hero = heroes[hero];
	if(!hero) {
		return "ERROR";
	}
	var message = hero[term];
	if(!message) {
		return "ERROR";
	}
	if(typeof message === 'string') {
		return message;
	} else {
		subTerm = subTerm || "default";
		return message[subTerm] || message.default;
	}
}

function query(hero, category) {
	var heroData = heroes[hero];
	if(!heroData) {
		return "ERROR";
	}
	if(category) {
		if(!heroData[category]) {
			return "ERROR";
		}
		return Object.keys(heroData[category]);
	} else {
		return Object.keys(heroData);
	}
}

function query(hero) {
	var heroData = heroes[hero];
	if(!heroData) {
		return "ERROR";
	}
	var keys = Object.keys(heroData);
	var retString = "Commands: " + keys;
	for(var i = 0; i < keys.length; i++) {
		var key = keys[i];
		if(typeof heroData[key] === 'object') {
			retString += "\n" + key + ": " + Object.keys(heroData[key]);
		}
	}
	return retString + "\n";
}

module.exports = {
	list : list,
	getMessage : getMessage,
	query : query
}