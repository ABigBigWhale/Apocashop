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
	}, 
	"meat" : {
		price : 3,
		jPrice : 5
	},
	"shield" : {
		price : 6,
		jPrice : 8
	},
	"staff" : {
		price : 8,
		jPrice : 11
	}, 
	"bone_sword" : {
		price : 12,
		jPrice : 15
	}
};

var heroLooks = {
	tutorialWoman : "face|2,body|2,hair|2,eye|5,nose|11,mouth|3,misc|1,skin|(259.58,198.19,158.71)",
	scaredMan : "face|5,misc|6,body|3,hair|2,eye|2,nose|8,mouth|2,skin|(259.58,198.19,158.71)",
	tracker : "face|1,misc|6,body|5,hair|8,eye|3,nose|11,mouth|6,skin|(259.58,198.19,158.71)",
};

var heroes = {
	dayOne : {
		"introJeff" : {
			type : "dialog",
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Hey kiddo, I'm Jeff the Magic Anvil!@@/Just accept it. We don't have time for questions.",
				"It looks like you've got five swords there to sell./The going rate for those is five gold a piece.",
				"Let's see how you do selling them!/Don't worry kid, I'll be right here if you need me."
			]
		},
		"messUpJeff" : {
			type : "dialog",
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Kid, you might want to keep a closer eye on what they're offering.",
				"Remember, those swords cost you five gold each."
			],
			appearConditions : ['jeffReminder']
		},
		tutorialWoman : {
			type : "dialog",
			appearanceInfo : heroLooks.tutorialWoman,
			dialog : [
				"I don't have much time. My cousin's on his way. He wants a sword./@@Please don't sell him one.",
				"I wrote clues to help you find him./If you turn him away, I'll make sure you're paid."
			],
			finishConditions : ["tutorialBegin"]
		},
		tutorialWomanHappy : {
			type : "dialog",
			appearanceInfo : heroLooks.tutorialWoman,
			appearConditions : ["refuseCousin"],
			dialog : "Thank you so much. Here's a little something for the help.",
			endMoney : 7
		},
		tutorialWomanAngry : {
			type : "dialog",
			appearanceInfo : heroLooks.tutorialWoman,
			appearConditions : ["soldCousin"],
			dialog : "I can't believe you sold to my cousin. Did you even bother asking about his favorite color?"
		},
		"badCousin" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			voice : "MURPHY",
			offers : [10],
			offerText : "Give me a sword and you can have ten gold instead of a mouth full of teeth.",
			success : "Heh, thanks.",
			fail : "I'll be back.",
			questions : {
				color : "Mac and Cheese.",
				default : "I don't care."
			},
			items : {
				default : "I don't care."
			},
			profiles : {
				default : "I don't care."
			},
			sellConditions : ["soldCousin"],
			refuseConditions : ["refuseCousin"],
			isFalseHero : true
		},
		chickenJeff : {
			type : "dialog",
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Oh, I forgot to mention. I can make you anything that the people want and you don't have, for a price.",
				"YOUR@ S@O@U@L@@/But for you kid, I'll also accept gold pieces.",
				"If I see that you're out of what the customer wants, I'll be sure to shout my price at you.",
				{
					soldChicken : "You're pretty lucky to have me, kid. @@Not many anvils can magic up a cooked chicken.",
					default : "You might want to try haggling and selling more next time."
				}
			]
		},
		endOfTutorialJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Nicely done, kid. We're still in business!/. . . Against all odds.",
				{
					soldCousin : "We need to keep a closer eye out for who to sell to./I have an idea on how to fix that.",
					default : "We got lucky to get that tip about the cousin./I'll make sure we don't have to rely on luck again."
				},
				"I'll research who we should and shouldn't sell to, and put it in that notebook.",
				"Now let's get some sleep. We've got a long day ahead of us."
			]
		}
	},
	"dayTwo" : {
		introJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Alright kiddo, time for another exciting day of shopkeeping.",
				"Don't forget to check out your notebook. While you were resting your weak organic body, I was doing some research.",
				"I read about a hero who was destined to save this town. You'd better make sure they get what they need."
			]
		},
		rhymeMan : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			offers : [4],
			offerText : "Hello shopkeeper, I hope you're not bored./For four gold, I would like to buy a sword!",
			success : "Thank you sir!/Were I a cat, I would purr!",
			fail : "I do not have the cash,/my apologies for being brash!",
			questions : {
				color : "Though it may fill some with dread,/I must say, my favorite color is red!",
				day : "My day has been fun, not too short not too long./If this takes much longer, I may break out in song!",
				default : "Of that, I have not been taught,/and thus I sadly know naught."
			},
			items : {
				sword : "Swords are great for stabbing./Note: they are not meant for grabbing!",
				default : "I do not know what to make of that,/but I am glad to have had this chat!"
			},
			profiles : {
				goblin : "Ah, my mortal enemy is that./I wish to engage one in single combat.",
				default : "What a face, what a smile!/And what dashing style!"
			},
			sellConditions : ["soldHero"],
			refuseConditions : ["refusedHero"],
			isHero : true
		},
		badRhymeMan : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			offers : [2],
			offerText : "Ahoy there friend, this is a good month./I'd like a sword for two gold please./@Urm, @@@dunth?",
			success : "Thank you my friend!",
			fail : "Fine, I'll go elsewhere.",
			questions : {
				color : "Though I love many colors, my favorite is orange./It's the greatest of colors, because it's so . . . @@@@florange?",
				day : "Good.",
				default : "What?"
			},
			items : {
				sword : "Swords are the best, I need one. @@@@Um.@@@@@/Rhyming is hard, and I've run out of rhymes.",
				default : "Erm, @@cool?"
			},
			profiles : {
				goblin : "Eek! Get it away, get it away!",
				default : "Yup, that's a person?"
			},
			sellConditions : ["soldFalse"],
			refuseConditions : ["refusedFalse"],
			isFalseHero : true
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				{
					soldHero : "Nice work, kid. Glad you read my instructions.",
					default : "Well, we made it. Wish you had read my instructions though."
				},
				{
					dayOneRobbery : "Hope we don't get robbed again. Haven't felt right since Mr. Mac and Cheese tried to steal me.",
					default : "Let's hope our streak of good luck continues."
				}
			]
		}
	},
	dayThree : {
		introJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Alright kiddo, third day's the charm. Let's do this.",
				"Remember, if you're not sure if someone's the hero, you might want to question them or look at them closely."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				{
					soldHero : "Nice work, kid. Let's get some sleep.",
					default : "We made it, kiddo. Let's hope we don't get robbed."
				}
			]
		},
		startDog : {
			type : 'dialog',
			appearanceInfo : 'dog',
			dialog : [
				"*Arf!* @*Arf!*"
			]
		},
		jeffDog : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Oh my gosh, can we keep it, can we keep it?",
				"Please please please please please please please please please."
			]
		},
		dogChoice : {
			type : 'interact',
			item : 'chicken',
			appearanceInfo : 'dog',
			offers : [0],
			offerText : "*Arf!*@@/(It looks like the dog will want a free chicken in exchange for staying.)",
			success : "*Arf!*",
			fail : "*Arf.*",
			questions : {
				default : "*Arf!*"
			},
			items : {
				default : "*Arf!*"
			},
			profiles : {
				default : "*Arf!*"
			},
			sellConditions : ["gotDog"],
			refuseConditions : ["lostDog"]
		},
		jeffHappy : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				{
					gotDog : "YES, this is the best day. Dogs are one of the few things I can't create.",
					default : "This is the worst day ever."
				},
				{
					gotDog : "Well, I can,@@@ but I can only make dead ones.",
					default : "I am irate."
				}
			]
		}
	},
	randomGenHero : {
		// HeroGenerator.js populates this field
	},
	jeffPoolStart : {
		genericJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Alright kiddo, time for another fun filled day. Let's do this."
			]
		},
		genericJeff2 : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Hey kid, you ready for another day?",
				"Well, if you aren't, then too bad. The sun waits for nobody."
			]
		},
		genericJeff3 : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Let's do this thing, kid.",
				"I have a feeling this is our lucky day."
			]
		},
		genericJeff4 : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			appearSong : "CURRENTLEVEL",
			dialog : [
				"Kiddo, this is the first day of the rest of our lives. Let's make it count."
			]
		},
	},
	jeffPoolEnd : {
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Hey kid, it's getting late. I think it's time to get some sleep."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Kiddo, I think it's time to close up shop. It's getting dark out."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Kid, I don't need sleep, but you do. It's time to pack up shop."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Not a bad day out there. Let's get some rest and start back up tomorrow morning."
			]
		}
	},
	finalDay : {
		introJeff : {
			type : "dialog",
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Hey kiddo, time for another beautiful day./Doesn't something about today seem diff~~"
			]
		},
		introZoran : {
			type : "dialog",
			appearanceInfo : "king_zoran",
			appearSong : "ZORAN",
			voice : "MURPHY",
			leaveSong : "LV7",
			dialog : [
				"Hello there, humble shopkeeper. I am your glorious ruler, King Zoran.",
				"I've heard good things about you and your shop and I am here to see for myself what you are capable of.",
				"Impress me, and I fill find work for you and your metal friend in the royal palace, but be warned, I am not easily impressed.",
				"Good luck."
			]
		},
		endZoran : {
			type : "dialog",
			appearanceInfo : "king_zoran",
			appearSong : "ZORAN",
			voice : "MURPHY",
			dialog : [
				{
					"gold_100" : "Well done, shopkeeper./You have proven yourself worthy to stand at my side.",
					"gold_50" : "I am mildly impressed, shopkeeper. I am sure we can find a place for you in the capital.",
					"gold_20" : "That wasn't a bad effort, shopkeeper. ",
					default : "I am disappointed, shopkeeper. I expected more."
				},
				{
					"gold_20" : "Come, let us go to the palace. There is much to see there.",
					"default" : "Feel free to restart the game and try again. I will be waiting."
				}
			]
		}
	},
	vocabMan : {
		hero : {
			type : 'interact',
			item : 'bow',
			appearanceInfo : 'random',
			offers : [2],
			offerText : "Get @bow,@@ two @gold?",
			success : "Two gold, @bow get!",
			fail : "Two gold bow . . .",
			questions : {
				color : "@@Gold!",
				number : "@@Two!",
				default : ". . ."
			},
			sellConditions : ['soldHero'],
			refuseConditions : ['refusedHero'],
			isHero : true
		},
		villain : {
			type : 'interact',
			item : 'bow',
			appearanceInfo : 'random',
			offers : [3],
			offerText : "Three gold, bow get?",
			success : "Thanks!",
			fail : "Ugh, fine.",
			questions : {
				color : "Red!",
				number : "Four!",
				default : "Huh?"
			},
			isFalseHero : true
		},
		villain2 : {
			type : 'interact',
			item : 'bow',
			appearanceInfo : 'random',
			offers : [1],
			offerText : "One gold to get bow?",
			success : "Thank you!",
			fail : "Darn.",
			questions : {
				color : "Gold!",
				number : "One!",
				default : "Huh?"
			},
			isFalseHero : true
		},
		villain3 : {
			type : 'interact',
			item : 'bow',
			appearanceInfo : 'random',
			offers : [2],
			offerText : "For two gold, bow get?",
			success : "Get bow!",
			fail : "No get bow . . .",
			questions : {
				color : "Gold!",
				number : "Two!",
				default : "Huh?"
			},
			isFalseHero : true
		},
	},
	// stutterMan : {
	// 	hero : {
	// 		type : 'interact',
	// 		item : 'shield',
	// 		appearanceInfo : 'random',
	// 		offers : [4, 1],
	// 		offerText : ["I would like a brand new sssshiny sssshield. Four gold?",
	// 					"Comon good sssssir. How about one gold? Thatssss more than four!"],
	// 		success : "YESSSSSSSSSSSSSSS...",
	// 		fail : "Lookssss like I will just head to the pub with my gold ...",
	// 		questions : {
	// 			numbers : "Ummmmmm ... Maybe Ten and two fifthsssss?",
	// 			animal : "You ssssay it like they're niccccce. I aint afraid of no ssssnakesss. Exccccept on planesss ...",
	// 			default : ". . ."
	// 		},
	// 		items : {
	// 			shiled : "Sssssshiny!",
	// 			default : ". . ."
	// 		},
	// 		profiles : {
	// 			convict : "Poopoo fart I should not be here",
	// 			default : ". . ."
	// 		},
	// 		sellConditions : ['soldHero'],
	// 		refuseConditions : ['refusedHero'],
	// 		isHero : true
	// 	},
	// 	villain1 : {
	// 		type : 'interact',
	// 		item : 'shield',
	// 		appearanceInfo : 'random',
	// 		offers : [2],
	// 		offerText : "Whats it take to get a nice ssshiny sssshield? Two gold?",
	// 		success : "That was easy! HAHA! I am no hero!",
	// 		fail : "How did you know? I stuttered and everything ...",
	// 		questions : {
	// 			numbers : "Four of course! Everyone knowssss that!",
	// 			animal : "Snakes? .@.@.@ I mean sssssnakes are bad",
	// 			default : "Huh?"
	// 		},
	// 		items : {
	// 			shield : "That is what I want. Yessss",
	// 			default : "Huh?"
	// 		},
	// 		profiles : {
	// 			convict : ". . .",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	},
	// 	villain2 : {
	// 		type : 'interact',
	// 		item : 'shield',
	// 		appearanceInfo : 'random',
	// 		offers : [3, 4],
	// 		offerText : ["I know how to bash! Ssssshields are great for that. Three gold?", 
	// 					 "Okay, four gold. Four issss more than three!"],
	// 		success : "Snakes. @Planes. @Snow. @@Pepperoni. @I can say it all you fool!",
	// 		fail : "Maybe im not caught up for the acting business. I'm better at smashing ...",
	// 		questions : {
	// 			numbers : "Four. Like two lesss than sssix!",
	// 			animal : "I can ssssmash ssssnakesss with a sssshiled. Gimmie, gimmie!",
	// 			default : "Huh?"
	// 		},
	// 		items : {
	// 			shield : "That is what I want. Yessss",
	// 			default : "Huh?"
	// 		},
	// 		profiles : {
	// 			convict : ". . .",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	},
	// 	villain3 : {
	// 		type : 'interact',
	// 		item : 'shield',
	// 		appearanceInfo : 'random',
	// 		offers : [1],
	// 		offerText : "One gold for shield?",
	// 		success : "Why thank you. What a good deal for an honest, not sneaky, person like myself.",
	// 		fail : "I thought if I talked less you would believe me",
	// 		questions : {
	// 			numbers : "Ten. Like three lesss than sssix!",
	// 			animal : "Snakes. Yeah ...",
	// 			default : "Huh?"
	// 		},
	// 		items : {
	// 			shield : "That is what I want.",
	// 			default : "Huh?"
	// 		},
	// 		profiles : {
	// 			convict : ". . .",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	}
	// },
	// rhymeAdvance : {
	// 	"hero" : {
	// 		type : "interact",
	// 		item : "shield",
	// 		appearanceInfo : "random",
	// 		offers : [2],
	// 		offerText : ["You, friendly shopkeeper. Your heart is true? I need a shield for two./. . . gold."],
	// 		success : "Thank you my friend, that gold I am happy to spend.",
	// 		fail : "Very well friend, I hope this is not the end.",
	// 		questions : {
	// 			day : "Very normal, not too exciting.",
	// 			color : "Orange brown",
	// 			default : ". . ."
	// 		},
	// 		sellConditions : ["soldHero"],
	// 		refuseConditions : ["refusedHero"],
	// 		isHero : true
	// 	},
	// 	"falseHero1" : {
	// 		type : "interact",
	// 		item : "shield",
	// 		appearanceInfo : "random",
	// 		offers : [2],
	// 		offerText : ["You, friendly shopkeeper. Your heart is true? I need a shield for the gold of two."],
	// 		success : "Heh, thanks.",
	// 		fail : "Fine.",
	// 		questions : {
	// 			day : "It was fine.",
	// 			color : "Navy.",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	},
	// 	"falseHero2" : {
	// 		type : "interact",
	// 		item : "shield",
	// 		appearanceInfo : "random",
	// 		offers : [3],
	// 		offerText : ["Why shopkeeper, you seem a nice guy. A shield I need for three gold."],
	// 		success : "Heh, thanks.",
	// 		fail : "Fine.",
	// 		questions : {
	// 			day : "Nothing out of the ordinary.",
	// 			color : "Chartreuse.",
	// 			default : ". . ."
	// 		},
	// 		sellConditions : ["soldHero"],
	// 		refuseConditions : ["refusedHero"],
	// 		isFalseHero : true
	// 	},
	// 	"falseHero3" : {
	// 		type : "interact",
	// 		item : "shield",
	// 		appearanceInfo : "random",
	// 		offers : [3],
	// 		offerText : ["You, shopkeeper. Your heart is true? . . . I need a shield for three gold."],
	// 		success : "Heh, thanks.",
	// 		fail : "Fine.",
	// 		questions : {
	// 			day : "Not too bad.",
	// 			color : "Purple blue",
	// 			default : ". . ."
	// 		},
	// 		sellConditions : ["soldHero"],
	// 		refuseConditions : ["refusedHero"],
	// 	}
	// },
	// stallingMan : {
	// 	hero : {
	// 		type : 'interact',
	// 		item : 'sword',
	// 		appearanceInfo : 'random',
	// 		offers : [0],
	// 		offerText : "I need a @@@pointy thing to @@@protect the town! @@@I have no @@@money can I @@@have for free?",
	// 		success : "This supercallfraglisticous pointy @@@thing will do @@@wonderfully",
	// 		fail : "I guess I'll @@@find another pointy @@@thing to fight @@@with!",
	// 		questions : {
	// 			sword : "What is that? @@@It's pointy, that @@@will do.",
	// 			super : "... supercallilictousesness ... supercallfraglisticous? ... Thats my new @@@word!",
	// 			default : ". . ."
	// 		},
	// 		items : {
	// 			sword : "Oooooh pointy",
	// 			default : ". . ."
	// 		},
	// 		profiles : {
	// 			convict : "Poopoo fart I should not be here",
	// 			default : ". . ."
	// 		},
	// 		sellConditions : ['soldHero'],
	// 		refuseConditions : ['refusedHero'],
	// 		isHero : true
	// 	},
	// 	villain1 : {
	// 		type : 'interact',
	// 		item : 'sword',
	// 		appearanceInfo : 'random',
	// 		offers : [0, 0],
	// 		offerText : ["I'm the hero. @@@I'll take a free @@@sword, please.",
	// 					 "Seriously though. I @@@am the hero. @@@free sword!"],
	// 		success : "Sucka! I knew that would work.",
	// 		fail : "Can't blame me for trying right?",
	// 		questions : {
	// 			sword : "That's what I @@@want!",
	// 			super : "Supercalifragilisticexpialidocious. From the @@@movies!",
	// 			default : "Huh?"
	// 		},
	// 		items : {
	// 			sword : "That is what I want. Yessss",
	// 			default : "Huh?"
	// 		},
	// 		profiles : {
	// 			convict : ". . .",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	},
	// 	villain2 : {
	// 		type : 'interact',
	// 		item : 'sword',
	// 		appearanceInfo : 'random',
	// 		offers : [0],
	// 		offerText : "I'll take a pointy thing for free please",
	// 		success : "I'll send a couple of my friends here to get free swords too!",
	// 		fail : "I'll be off then ...",
	// 		questions : {
	// 			sword : "That is a pointy thing!",
	// 			super : "I don't even know what you just said",
	// 			default : "Huh?"
	// 		},
	// 		items : {
	// 			shield : "That is what I want. Yessss",
	// 			default : "Huh?"
	// 		},
	// 		profiles : {
	// 			convict : ". . .",
	// 			default : ". . ."
	// 		},
	// 		isFalseHero : true
	// 	}
	// },
	fingers : {
		"hero" : {
			type : "interact",
			item : "shield",
			appearanceInfo : "random",
			isFingers : true,
			fingerTime : 3000,
			offers : [5],
			offerText : ["Can I get a shield for this many gold?"],
			success : "What a deal! Thumbs up, thank you.",
			fail : "Thumbs down.",
			questions : {
				number : "I'm showing it to you right now.",
				color : "Probably yellow?",
				default : ". . ."
			},
			sellConditions : ["soldHero"],
			refuseConditions : ["refusedHero"],
			isHero : true
		},
		"falseHero1" : {
			type : "interact",
			item : "shield",
			appearanceInfo : "random",
			isFingers : true,
			fingerTime : 3000,
			offers : [3],
			offerText : ["I would like a shield for this many gold."],
			success : "Thank you, three gold is such a steal!",
			fail : "Bleh, fine.",
			questions : {
				number : "I'd say three?",
				color : "Probably yellow?",
				default : ". . ."
			},
			isFalseHero : true
		},
		"falseHero2" : {
			type : "interact",
			item : "shield",
			appearanceInfo : "random",
			isFingers : true,
			fingerTime : 3000,
			offers : [4],
			offerText : ["Can I get a shield for this many gold?"],
			success : "Hah, nobody sells shields for four gold.",
			fail : "Fine, be that way.",
			questions : {
				number : "I don't want to say.",
				color : "Turquoise.",
				default : ". . ."
			},
			isFalseHero : true
		},
		"falseHero3" : {
			type : "interact",
			item : "shield",
			appearanceInfo : "random",
			isFingers : true,
			fingerTime : 3000,
			offers : [2],
			offerText : ["Can I get a shield for two gold?"],
			success : "Heh, what a steal. Thanks.",
			fail : "Darn.",
			questions : {
				number : ". . .",
				color : "I'll go with a simple green.",
				default : ". . ."
			},
			isFalseHero : true
		}
	},
	noLetter : {
		"hero" : {
			type : "interact",
			item : "bow",
			appearanceInfo : "random",
			offers : [1],
			offerText : ["My friend, can I get a bow for one gold?"],
			success : "I am in your debt",
			fail : "Arg, very well.",
			questions : {
				alphabet : "abcdefgijklmnopqrtuvwxyz",
				color : "I'm feeling green.",
				default : ". . ."
			},
			sellConditions : ["soldHero"],
			refuseConditions : ["refusedHero"],
			isHero : true
		},
		"falseHero1" : {
			type : "interact",
			item : "bow",
			appearanceInfo : "random",
			offers : [3],
			offerText : ["My friend, can I get a bow for three gold?"],
			success : "Heh, thanks.",
			fail : "This is an outrage.",
			questions : {
				alphabet : "abcdfghijklmnopqrtuvwxyz",
				color : "Green.",
				default : ". . ."
			},
			isFalseHero : true
		},
		"falseHero2" : {
			type : "interact",
			item : "shield",
			appearanceInfo : "random",
			offers : [2],
			offerText : ["Can I get a shield for two gold?"],
			success : "Why thanks, friend.",
			fail : "How dare you. This is wrong.",
			questions : {
				alphabet : "abcdefgijklmnopqrstuvwxyz",
				color : "I'm thinking red.",
				default : ". . ."
			},
			isFalseHero : true
		},
		"falseHero3" : {
			type : "interact",
			item : "chicken",
			appearanceInfo : "random",
			offers : [1],
			offerText : ["Could I please get a chicken for one gold?"],
			success : "Ha, thank you, friend.",
			fail : "This isn't the last you'll see of me.",
			questions : {
				alphabet : "abcdefghijklmnopstuvwxyz",
				color : "I'm feeling blue.",
				default : ". . ."
			},
			isFalseHero : true
		},
	},
	noNumber : {
		"hero" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			offers : [3],
			offerText : ["Hello, can I get a sword for gold equaling the number of five letter words I've said?"],
			success : "Why thank you, friend.",
			fail : "I expected more, shopkeeper.",
			questions : {
				number : "The number of letters in this sentence.",
				day : "Not bad, could be better.",
				default : ". . ."
			},
			sellConditions : ["soldHero"],
			refuseConditions : ["refusedHero"],
			isHero : true
		},
		"falseHero1" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			offers : [3],
			offerText : ["Can I get a sword for gold equaling the number of five letter words I've said?"],
			success : "That was two easy.",
			fail : "Zero stars.",
			questions : {
				number : "Five",
				day : "Alright, I guess.",
				default : ". . ."
			},
			isFalseHero : true
		},
		"falseHero2" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
			offers : [3],
			offerText : ["Hello, can I get one sword for gold equaling the number of five letter words I've said?"],
			success : "Heh, thanks pal.",
			fail : "You can't just give me one sword?",
			questions : {
				number : "I'm not sure.",
				day : "I'd give it less than five stars.",
				default : ". . ."
			},
			isFalseHero : true
		}
	},
	urchin : {
		"1scaredMan" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.scaredMan,
			offers : [0],
			offerText : "I need to hide here. He's after me./Please, @@he'll kill me if he finds me.",
			success : "Thank you.",
			fail : "Oh dear.",
			questions : {
				default : "Please, there's no time."
			},
			sellConditions : ["urchin_hidMan"],
			refuseConditions : ["urchin_manRefused"]
		},
		"1trackerSearch" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.tracker,
			offers : [10, 15],
			offerText : [
				"A very dangerous man is loose and I need to find him./I'll pay you ten gold for any information.",
				"What if I offered you fifteen?"
			],
			success : "Well, well street urchin. You're coming with me.",
			fail : "Very well,@@ I hope you've been honest with me./@@@@For your sake.",
			questions : {
				default : "I'm asking the questions here."
			},
			appearConditions : ["urchin_hidMan"],
			sellConditions : ["urchin_manDead"],
			refuseConditions : ["urchin_manLived"]
		},
		"1trackerWarn" : {
			type : "dialog",
			appearanceInfo : heroLooks.tracker,
			dialog : [
				"A very dangerous man is loose and I need to find him./If you see anyone suspicious, do not trust them."
			],
			appearConditions : ["urchin_manRefused"]
		},
		"2gratefulMan" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.scaredMan,
			offers : [10],
			offerText : [
				"Thank you so much for hiding me. Would you accept this token of my appreciation?"
			],
			success : "Use it well friend. Be wary of the bounty hunter, he may suspect you of hiding me.",
			fail : ". . . I will return.",
			questions : {
				number : "44.",
				color : "The color of sky.",
				alphabet : "I never learned it.",
				day : "Much better than yesterday.",
				default : ". . ."
			},
			appearConditions : ["urchin_manGrateful"],
			sellConditions : ["urchin_acceptedGift"],
			refuseConditions : ["urchin_refusedGift"]
		},
		"2angryFamily" : {
			type : "dialog",
			appearanceInfo : "random",
			dialog : [
				"We know you sold our brother out to that bounty hunter.",
				"Watch your back, coward."
			],
			appearConditions : ["urchin_familyAngry"],
		},
		"4tracker" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.tracker,
			offers : [0],
			offerText : [
				"Did you lie to me when I was last here?/@@I demand to know the truth."
			],
			success : ". . . I'll be back.",
			fail : ". . .",
			questions : {
				default : "Answer me. Now."
			},
			appearConditions : ["urchin_trackerSuspicious"],
			sellConditions : ["urchin_trackerTruth"],
			refuseConditions : ["urchin_trackerLied"]
		},
		"4waryMan" : {
			type : "dialog",
			appearanceInfo : heroLooks.scaredMan,
			dialog : [
				"I don't quite know what to make of you, but you seem like you may be a kind soul.",
				"Tomorrow, I will be back, and will try to buy a sword for two gold.",
				"If you remember my face, I would be grateful."
			],
			appearConditions : ["urchin_manWary"]
		},
		"4trackerWarning" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.tracker,
			offers : [-7],
			offerText : [
				"The man you helped me capture has dangerous friends who are now your dangerous enemies./@I'll protect you for seven gold."
			],
			success : "Very good, I will return here tonight.",
			fail : "Very well, good luck. You will need it.",
			questions : {
				default : "My patience is wearing thin."
			},
			appearConditions : ["urchin_familyAngry"],
			sellConditions : ["urchin_trackerProtect"],
			refuseConditions : ["urchin_unprotected"]
		},
		"5waryManTest" : {
			type : "interact",
			item : "sword",
			appearanceInfo : heroLooks.scaredMan,
			offers : [2],
			offerText : [
				"Hiya! Can I get a sword for two gold?"
			],
			success : "Well done, shopkeeper.",
			fail : "Hrm . . .",
			questions : {
				number : "31",
				color : "Green.",
				alphabet : "abcdefghijklmnopqrstuvwxyz",
				day : "Not bad.",
				default : ". . ."
			},
			appearConditions : ["urchin_manWary"],
			sellConditions : ["urchin_manSold"]
		},
		"5madTracker" : {
			type : "interact",
			item : "None",
			appearanceInfo : heroLooks.tracker,
			offers : [-10],
			offerText : [
				"I've been thinking, shopkeeper. If you lied to me about the man, I want my ten gold back./Will you return it?"
			],
			success : "Good choice.",
			fail : ". . .",
			questions : {
				default : "Stop wasting my time and answer!"
			},
			appearConditions : ["urchin_trackerMad"],
			sellConditions : ["urchin_trackerBribed"],
			refuseConditions : ["urchin_trackerRefused"]
		},
		"6proudMan" : {
			type : "dialog",
			appearanceInfo : heroLooks.scaredMan,
			dialog : [
				"I am honored that you remember my face.",
				"Please shopkeeper, accept this gift."
			],
			appearConditions : ["urchin_manProud"],
			endMoney : 15
		},
		"6vengefulTracker" : {
			type : "dialog",
			appearanceInfo : heroLooks.tracker,
			dialog : [
				". . .",
				"* The Tracker punches you in the stomach and takes 15 gold from your counter. *",
				". . .",
				"Be glad I'm taking your gold and not your life."
			],
			appearConditions : ["urchin_trackerVengeful"],
			endMoney : -15
		}
	},
	treasure : {
		"2offer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "treasure_hunter",
			offers : [-5],
			offerText : ["Howdy shopkeep, in my many incredible adventures, I found this treasure map./Want it? Five gold."],
			success : "Hope it's worth it!@@/I mean, why wouldn't it be?",
			fail : "Your loss, shopkeep.",
			questions : {
				number : "Lucky number seven.",
				color : "Beige, but you know, the cool kind of beige.",
				alphabet : "What is this, a math test?",
				day : "Adventurey, like all of my days.",
				default : ". . ."
			},
			sellConditions : ["treasure_bought"],
			refuseConditions : ["treasure_refused"],
		},
		"3friendlyOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "treasure_hunter",
			offers : [-10],
			offerText : ["Hey shopkeep, always nice to see your face. How about another map? Ten gold this time."],
			success : "Have fun with it, pal.",
			fail : "Alright then, I'll still be back tomorrow. Haven't given up on you yet.",
			questions : {
				number : "Lucky number seven.",
				color : "Beige, but you know, the cool kind of beige.",
				alphabet : "What is this, a math test?",
				day : "Adventurey, like all of my days.",
				default : ". . ."
			},
			appearConditions : ["treasure_happy"],
			sellConditions : ["treasure_bought"],
			refuseConditions : ["treasure_refused"],
		},
		"3sadOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "treasure_hunter",
			offers : [-10],
			offerText : ["Hey shopkeep, this time I have an even better map. Want it for ten gold?"],
			success : "Have fun with it, pal.",
			fail : "Alright then, I'll still be back tomorrow. Haven't given up on you yet.",
			questions : {
				number : "Lucky number seven.",
				color : "Beige, but you know, the cool kind of beige.",
				alphabet : "What is this, a math test?",
				day : "Adventurey, like all of my days.",
				default : ". . ."
			},
			appearConditions : ["treasure_sad"],
			sellConditions : ["treasure_bought"],
			refuseConditions : ["treasure_refused"],
		},
		"4dungeonOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "treasure_hunter",
			offers : [-15],
			offerText : ["Howdy shopkeep, I'm going to explore a dungeon tonight. Want to invest and split the keep? I'll need fifteen gold."],
			success : "Wish me luck, pal. Not that I'll need it, of course.",
			fail : "Alright, I'll find myself some other investor.",
			questions : {
				number : "Lucky number seven.",
				color : "Beige, but you know, the cool kind of beige.",
				alphabet : "What is this, a math test?",
				day : "Adventurey, like all of my days.",
				default : ". . ."
			},
			appearConditions : ["treasure_hunting"],
			sellConditions : ["treasure_invested"],
			refuseConditions : ["treasure_refused"],
		},
		"4lastMap" : {
			type : "interact",
			item : "None",
			appearanceInfo : "treasure_hunter",
			offers : [-15],
			offerText : ["Hey shopkeep, I've got one last map for you that'll knock your socks off. It'll be fifteen gold."],
			success : "Happy travels, shopkeep.",
			fail : "Alrighty shopkeep, have it your way.",
			questions : {
				number : "Lucky number seven.",
				color : "Beige, but you know, the cool kind of beige.",
				alphabet : "What is this, a math test?",
				day : "Adventurey, like all of my days.",
				default : ". . ."
			},
			appearConditions : ["treasure_sad"],
			sellConditions : ["treasure_bought"],
			refuseConditions : ["treasure_refused"],
		},
		"6goodbye" : {
			type : "dialog",
			appearanceInfo : "treasure_hunter",
			dialog : [
				"Hey shopkeep! As expected, I got through the dungeon with absolutely no problems at all.",
				"Please ignore the scorch marks on my back, and the claw marks on my pack.",
				"As promised, here's the return on your investment. Spend it well, pal."
			],
			appearConditions : ["treasure_hunting2"],
			endMoney : 30
		}
	},
	artifact : {
		"1initialGive" : {
			type : "dialog",
			appearanceInfo : "artifact",
			dialog : [
				"I don't have much time. Hold onto this orb for me./@@I'll pay you 50 gold if you hold onto it for 5 days.",
				"~~Frantically, the man gives you a black orb~~",
				"~~It pulses with unnatural energy~~",
				"Be careful with it."
			],
		},
		"2shinyOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "random",
			offers : [10],
			offerText : ["Ooh, that orb is beautiful. Think I could take it off your hands for ten gold?"],
			success : "Thanks, appreciate it.",
			fail : "Oh well, it was a long shot anyway.",
			questions : {
				number : "Eighty eight.",
				color : "Tealish green.",
				alphabet : "abcdefghijklmnopqrstuvwxyz",
				day : "Shiny!",
				default : ". . ."
			},
			sellConditions : ["artifact_soldOrb"],
			refuseConditions : ["artifact_keptOrb"],
		},
		"3studyOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "random",
			offers : [20],
			offerText : ["That orb has a fascinating color. Do you think I could buy it from you for 20 gold?"],
			success : "Thank you, I cannot wait to study this.",
			fail : "Well, darn.",
			questions : {
				number : "Seventy two.",
				color : "Whatever color that orb is.",
				alphabet : "abcdefghijklmnopqrstuvwxyz",
				day : "Rather boring, until now that is.",
				default : ". . ."
			},
			appearConditions : ["artifact_haveOrb2"],
			sellConditions : ["artifact_soldOrb"],
			refuseConditions : ["artifact_keptOrb"],
		},
		"4collectorOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "random",
			offers : [40],
			offerText : ["Oh my, that orb would look fantastic on my mantle. Would you part with it for 40 gold?"],
			success : "Well isn't this my lucky day.",
			fail : "Oh dearie me . . .",
			questions : {
				number : "Ninety nine.",
				color : "Green blue.",
				alphabet : "abcdefghijklmnopqrstuvwxyz",
				day : "Smashing.",
				default : ". . ."
			},
			appearConditions : ["artifact_haveOrb3"],
			sellConditions : ["artifact_soldOrb"],
			refuseConditions : ["artifact_keptOrb"],
		},
		"5villainOffer" : {
			type : "interact",
			item : "None",
			appearanceInfo : "random",
			offers : [60],
			offerText : ["With that orb, unlimited power could be mine! GIVE IT TO ME. Sixty gold."],
			success : "AHAHAHAHAHAHA",
			fail : ". . .",
			questions : {
				default : "UNLIMITED POWER."
			},
			appearConditions : ["artifact_haveOrb4"],
			sellConditions : ["artifact_soldOrb"],
			refuseConditions : ["artifact_keptOrb"],
		},
		"6returnHappy" : {
			type : "dialog",
			appearanceInfo : "artifact",
			dialog : [
				"Thank you for holding onto that for me, child.",
				"Here is your payment, as promised."
			],
			appearConditions : ["haveOrb5"],
			endMoney : 50
		},
		"6returnSad" : {
			type : "dialog",
			appearanceInfo : "artifact",
			dialog : [
				"You didn't keep the orb? Curse you, child."
			],
			appearConditions : ["artifact_lostOrb"],
		},

		"6returnScared" : {
			type : "dialog",
			appearanceInfo : "artifact",
			dialog : [
				"Oh dear child, you sold my orb to that lunatic?",
				"You truly are a fool."
			],
			appearConditions : ["artifact_villainOrb"],
		}
	},
	uprising : {
		"2intro" : {
			type : "dialog",
			appearanceInfo : "cloak",
			dialog : [
				"For too long have we been taxed and trodden upon./We must rise up and topple those who would exploit us.",
				"I shall return tomorrow in clever disguise. If you are with us, accept my third offer. It will be one gold.",
				"We are the night."
			],
		},
		"3return" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "cloak_stache",
			offers : [2, 3, 1],
			offerText : [
				"Hello friend who I have never seen before. Two gold for a sword?",
				"How about three?",
				"Or one?"
			],
			success : "We are the night.",
			fail : ". . . very well.",
			questions : {
				number : "Our official number is three.",
				color : "Our official color is 'Mystery Cloak'.",
				alphabet : "Our official alphabet is 'abcdefghijklmnopqrstuvwxyz'",
				day : "Officially, my day has been standard to above standard.",
				default : ". . ."
			},
			sellConditions : ["uprising_rebel"],
			refuseConditions : ["uprising_citizen"],
		},
		"4policeIntro" : {
			type : "dialog",
			appearanceInfo : "guardian",
			dialog : [
				"We've heard of some dangerous characters starting up a rebellion against the glorious King Zoran.",
				"If you hear anything, you are required by law to report it. I will be back tomorrow."
			],
		},
		"4rebelMoney" : {
			type : "interact",
			item : "None",
			appearanceInfo : "cloak",
			offers : [-7],
			offerText : [
				"Hello again, my friend. The rebellion requires seven gold. Will you help us free the people?"
			],
			success : "We are the night.",
			fail : ". . . very well.",
			questions : {
				number : "Officially, our favorite number is currently seven.",
				color : "Currently, our favorite color is 'Charcoal Cloak'.",
				alphabet : "Officially, our alphabet is 'abcdefghijklmnopqrstuvwxyz'.",
				day : "This day has been pleasant enough.",
				default : ". . ."
			},
			appearConditions : ["uprising_rebelBegin"],
			sellConditions : ["uprising_rebel"],
			refuseConditions : ["uprising_citizen"],
		},
		"5rebelWarning" : {
			type : "dialog",
			appearanceInfo : "cloak",
			dialog : [
				"Hello friend. Thank you for listening to us.",
				"You should probably think about staying out of the town square today.",
				". . . Not that we are doing anything there. No reason at all, nothing to worry about./@@@Bye."
			],
			appearConditions : ["uprising_citizenBegin"],
		},
		"5rebelJob" : {
			type : "dialog",
			appearanceInfo : "cloak",
			dialog : [
				"Hello friend, I have your first mission to help free our people.",
				"A nasty city official will be here soon to buy a bow for one gold.",
				"Stall him for five seconds before you reject him so we can kidnap . . .",
				"so we can talk to him."
			],
			appearConditions : ["uprising_rebelJoined"],
		},
		"5official" : {
			type : "interact",
			item : "bow",
			appearanceInfo : "random",
			offers : [1],
			offerText : ["I am an official representative of the city, and I demand a bow for one gold."],
			success : "You made the right choice",
			fail : "Your king will hear of this.",
			questions : {
				default : "Move faster, peasant."
			},
			stallTime : 4000,
			appearConditions : ["uprising_rebelJoined"],
			stallConditions : ["uprising_officialStalled"],
		},
		"5policeAsk" : {
			type : "interact",
			item : "None",
			appearanceInfo : "guardian",
			offers : [0, 5],
			offerText : [
				"Can you tell me anything about the rebels?",
				"What if I offer you five gold? Not that I should have to pay you to help your king."
			],
			success : "Thank you, this will help us greatly.",
			fail : "Very well, I hope you've been honest. We could make your life very difficult.",
			questions : {
				default : "Please sir, just answer the question."
			},
			sellConditions : ["uprising_informant"],
			refuseConditions : ["uprising_traitor"],
		},
		"5stallThanks" : {
			type : "dialog",
			appearanceInfo : "cloak",
			dialog : ["Hello friend, thank you for the help. Now we pay you."],
			appearConditions : ["uprising_officialStalled"],
			endMoney : 17
		},
		"6stallAsk" : {
			type : "dialog",
			appearanceInfo : "guardian",
			dialog : [
				"Hello citizen, we've heard that one of the rebels will make contact with you today.",
				"Stall her for seven seconds when she's here, and we'll make it worth your while."
			],
			appearConditions : ["uprising_informantHelper"],
		},
		"6rebelStall" : {
			type : "interact",
			item : "None",
			appearanceInfo : "cloak",
			offers : [0],
			offerText : ["Hello friend, this is last time I come here. You are sure you will not join?"],
			success : "Fantastic! We will see you soon.",
			fail : "All right, friend. I will see you around then.",
			questions : {
				number : "My personal favorite number is eight.",
				color : "Our official color of the day is 'Nighttime Black'.",
				alphabet : "abcdefghijklmnopqrstuvwxyz",
				day : "Officially I am required to say that today was pleasant.",
				default : ". . ."
			},
			stallTime : 6000,
			appearConditions : ["uprising_informantHelper"],
			stallConditions : ["uprising_informant"],
		},
		"6policeBribe" : {
			type : "dialog",
			appearanceInfo : "guardian",
			dialog : ["We know you are lying. You're lucky I'm only taking your gold and not your head."],
			appearConditions : ["uprising_traitorFound"],
			endMoney : -15
		}
	},
	timer : {
		jeffNotify : {
			type : "dialog",
			appearanceInfo : "jeff",
			voice : "MED",
			dialog : [
				"Hey kiddo, we should probably close up shop, but we've been moving a bit too slowly today.",
				"Tomorrow, try getting people through here faster, and watch the sun to see how much time you have left.",
				"For now, we'll just have to work a bit of overtime to catch up."
			],
			finishConditions : ["timer_slow"]
		}
	}
};

var upgradeSequence = [['shop'], ['itemslot'], ['shop', 'time'], ['itemslot', 'time'], ['shop', 'time'], ['itemslot', 'time']];

var upgrades = {
	'shop' : [
		{
			name: 'stone',
			description: 'A rock doesn\'t look very good ... But at least people know it\'s a shop.',
			effect: 'Increased chance of counter offer',	//TODO
			position : [470, 308]
		},
		{
			name: 'wooden_desk',
			description: 'Finally it matches your dialog box... desks are great!',
			effect: 'Increased chance of counter offer',	
			position : [481, 305]
		},
				{
			name: 'wooden',
			description: 'You moved your sign for all to see. Coolio!',
			effect: 'Increased chance of counter offer',	
			position : [481, 252]
		},
				{
			name: 'wooden_plus',
			description: 'Might as well show off some of the goods!',
			effect: 'Increased chance of counter offer',	
			position : [481, 252]
		}
	],
	
	'jeff' : [
		{
			
		}
	],
	'itemslot' : [
		{
			name: 'item_slot',
			description: 'Grow some muscles. You can carry more items than that!',
			effect: 'Additional item slot for stocking', 
			position : [0, 0]
		}
	],
	'time' : [
		{
			name: 'time',
			description: 'The moon has nothing on you. Bring on the heat!',
			effect: 'More time to sell during the day',
			position : [0, 0]
		}
	],
	'stock' : [
		
	]
};
