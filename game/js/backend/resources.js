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

var heroes = {
	dayOne : {
		"introJeff" : {
			type : "dialog",
			appearanceInfo : "jeff",
			dialog : [
				"Hey kiddo, I'm Jeff the Magic Anvil!@@/Just accept it. We don't have time for questions.",
				"It looks like you've got five swords there to sell./The going rate for those is five gold a piece.",
				"Let's see how you do selling them!/Don't worry kid, I'll be right here if you need me."
			]
		},
		tutorialWoman : {
			type : "dialog",
			appearanceInfo : "face|2,body|2,hair|2,eye|5,nose|11,mouth|3,misc|1",
			dialog : [
				"I don't have much time. My cousin's on his way. He wants a sword./@@Please don't sell him one.",
				"I wrote clues to help you find him./If you turn him away, I'll make sure you're paid."
			],
			finishConditions : ["tutorialBegin"]
		},
		tutorialWomanHappy : {
			type : "dialog",
			appearanceInfo : "face|2,body|2,hair|2,eye|5,nose|11,mouth|3,misc|1",
			appearConditions : ["refuseCousin"],
			dialog : "Thank you so much. Here's a little something for the help.",
			endMoney : 7
		},
		tutorialWomanAngry : {
			type : "dialog",
			appearanceInfo : "face|2,body|2,hair|2,eye|5,nose|11,mouth|3,misc|1",
			appearConditions : ["soldCousin"],
			dialog : "I can't believe you sold to my cousin. Did you even bother asking about his favorite color?"
		},
		"badCousin" : {
			type : "interact",
			item : "sword",
			appearanceInfo : "random",
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
			refuseConditions : ["refuseCousin"]
		},
		chickenJeff : {
			type : "dialog",
			appearanceInfo : "jeff",
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
			appearanceInfo : 'jeff',
			dialog : [
				"Alright kiddo, time for another exciting day of shopkeeping.",
				"Don't forget to check out your notebook. While you were resting your weak organic body, I was doing some research.",
				"I read about a hero who was destined to save this town. You'd better make sure they get what they need."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : 'jeff',
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
			refuseConditions : ["refusedHero"]
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
			refuseConditions : ["refusedFalse"]
		},
		scaredMan : {
			type : "interact",
			item : "None",
			appearanceInfo : "face|5,misc|6,body|3,hair|2,eye|2,nose|8,mouth|2",
			offers : [0],
			offerText : "I need to hide here. He's after me./Please, @@he'll kill me if he finds me.",
			success : "Thank you.",
			fail : "Oh no.",
			questions : {
				day : "Very, @@very@ bad.",
				color : "I don't know.",
				default : "Please,@@ I don't have much time."
			},
			items : {
				shield : "I don't know what to make of that.",
				default : "I don't know what to make of that."
			},
			profiles : {
				dragon : "There's a dragon?",
				default : "I don't know them."
			},
			sellConditions : ['hidMan']
		},
		tracker : {
			type : "interact",
			item : "None",
			appearanceInfo : "face|1,misc|6,body|5,hair|8,eye|3,nose|11,mouth|6",
			offers : [10, 15],
			offerText : [
				"A very dangerous man is loose and I need to find him./I'll pay you ten gold for any information.",
				"What if I offered you fifteen?"
			],
			success : "Well, well street urchin. You're coming with me.",
			fail : "Very well,@@ I hope you've been honest with me./@@@@For your sake.",
			questions : {
				day : "Busy.",
				color : "Whatever will make you move faster.",
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
			appearConditions : ['hidMan'],
			sellConditions : ['soldMan'],
			refuseConditions : ['manLived']
		}
	},
	dayThree : {
		introJeff : {
			type : 'dialog',
			appearanceInfo : 'jeff',
			dialog : [
				"Alright kiddo, third day's the charm. Let's do this.",
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : 'jeff',
			dialog : [
				{
					soldHero : "Nice work, kid. Let's get some sleep.",
					default : "We made it, kiddo. Let's hope we don't get robbed."
				}
			]
		},
		scaredMan : {
			type : 'interact',
			item : "None",
			appearanceInfo : "face|1,misc|6,body|5,hair|8,eye|3,nose|11,mouth|6",
			offers : [10],
			offerText : [
				"Thank you so much for hiding me yesterday. Would you accept this gift?"
			],
			success : "Use it well.",
			fail : "Very well, friend.",
			questions : {
				number : "I'll go with ten.",
				color : "The color of sky, the color of freedom.",
				default : "ERROR: NO ANSWER."
			},
			items : {
				default : "ERROR: NO ANSWER."
			},
			profiles : {
				default : "ERROR: NO ANSWER."
			},
			appearConditions : ['manGrateful']
		},
		vocabMan : {
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
			items : {
				bow : "Bow!",
				default : ". . ."
			},
			profiles : {
				convict : "Bow get!",
				default : ". . ."
			},
			sellConditions : ['soldHero'],
			refuseConditions : ['refusedHero']
		},
		badVocabMan : {
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
			items : {
				bow : "Nice!",
				default : "Huh?"
			},
			profiles : {
				convict : ". . .",
				default : ". . ."
			}
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
			appearanceInfo : 'jeff',
			dialog : [
				"Oh my god, can we keep it, can we keep it?",
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
			appearanceInfo : 'jeff',
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
	generatedDay : {
		genericJeff : {
			type : 'dialog',
			appearanceInfo : 'jeff',
			dialog : [
				"Alright kiddo, time for another fun filled day. Let's do this.",
				"Also, just so you know, sort of in beta, so no promises it won't break."
			]
		},
		endJeff : {
			type : 'dialog',
			appearanceInfo : 'jeff',
			dialog : [
				"Hey kid, it's getting late. I think it's time to get some sleep."
			]
		}
	}
};

var days = [
	{
		itemData : {
			sword : {
				min : 2,
				max : 11,
				priority : 5
			}
		},
		sequence : {
			0 : {
				category : "dayOne",
				hero : "introJeff",
				fuzz : 0,
				force : true
			},
			1 : {
				hero : {
					item : "sword",
					offers : [7]
				},
				fuzz : 0,
				force : true
			},
			2 : {
				hero : {
					item : "sword",
					offers : [1, 8]
				},
				fuzz : 0,
				force : true
			},
			3 : {
				category : "dayOne",
				hero : "tutorialWoman",
				fuzz : 0,
				force : true
			},
			6 : {
				hero : {
					item : "chicken",
					offers : [3, 6],
					sellConditions : ["soldChicken"]
				},
				fuzz : 0,
				force : true
			},
			7 : {
				category : "dayOne",
				hero : "chickenJeff",
				fuzz : 0,
				force : true
			},
			8 : {
				category : "dayOne",
				hero : "badCousin",
				fuzz : 3,
				force : true
			},
			11 : {
				category : "dayOne",
				hero : "tutorialWomanAngry",
				fuzz : 3,
				force : true
			},
			12 : {
				category : "dayOne",
				hero : "tutorialWomanHappy",
				fuzz : 3,
				force : true
			},
			9999 : {
				category : "dayOne",
				hero : "endOfTutorialJeff",
				fuzz : 0,
				force : true
			}
		},
		conditions : {
			tutorialItemGive : {
				components : ["tutorialBegin"],
				chance : 1.0,
				events : ["Events.TUTORIAL.BEGIN"],
				isLongTerm : false
			},
			dayOneRobbery : {
				components : ["soldCousin"],
				chance : 1.0,
				isLongTerm : true
			}
		},
		clues : {
			hero : [
				"My cousin is rather rude.",
				"My cousin's favorite color is 'Mac and Cheese'"
			],
			crisis : [""]
		},
		questions : {
			day : "How was your day?",
			color : "Favorite color?"
		},
		wrapup : [
			{
				text : "You're forced by King Zoran to pay 10 gold in taxes.",
				gold : -10
			},
			// {
			// 	text : "He also demands that the shop should run faster and should collect more data on its customers."
			// },
			{
				conditions : ["soldCousin"],
				text : "Your store is robbed in the night. The robber leaves a note on Mac and Cheese colored paper.",
				gold : -3
			}
		],
		length : 60000
	},
	{
		itemData : {
			sword : {
				min : 2,
				max : 11,
				priority : 5
			},
			chicken : {
				min : 1,
				max : 9,
				priority : 2
			}
		},
		sequence : {
			0 : {
				category : "dayTwo",
				hero : "introJeff",
				fuzz : 0,
				force : true
			},
			4 : {
				category : "dayTwo",
				hero : "rhymeMan",
				fuzz : 7,
				force : true
			},
			5 : {
				category : "dayTwo",
				hero : "scaredMan",
				fuzz : 6,
				force : false
			},
			6 : {
				category : "dayTwo",
				hero : "badRhymeMan",
				fuzz : 7,
				force : false
			},
			7 : {
				category : "dayTwo",
				hero : "tracker",
				fuzz : 6,
				force : true
			},
			9999 : {
				category : "dayTwo",
				hero : "endJeff",
				fuzz : 0,
				force : true
			}
		},
		conditions : {
			manGrateful : {
				components : ["manLived"],
				chance : 1.0,
				isLongTerm : true
			},
			trackerGrateful : {
				components : ["soldMan"],
				chance : 0.4,
				isLongTerm : true
			}
		},
		clues : {
			hero : [
				"The hero speaks only in rhyme.",
				"The hero does not use made up words to force a rhyme."
			],
			crisis : [
				"Goblins have been harassing townspeople.",
				"As a result, swords are in high demand."
			]
		},
		questions : {
			day : "How was your day?",
			color : "Favorite color?"
		},
		wrapup : [
			{
				text : "You're forced by King Zoran to pay 10 gold in taxes.",
				gold : -10
			},
			{
				conditions : ["soldHero"],
				text : "Thanks to the sword you sold to the hero, goblins are driven from the town."
			},
			{
				conditions : ["refusedHero"],
				text : "Unfortunately, the hero did not have a sword and the town was overrun by goblins. Your store was pillaged in the night.",
				gold : -20
			},
			{
				conditions : ["soldFalse"],
				text : "After giving a discount to the fake hero, you're getting a reputation around town. You might see some more people looking for hero discounts."
			}
		],
		length : 100000
	},
	{
		itemData : {
			sword : {
				min : 2,
				max : 11,
				priority : 2
			},
			chicken : {
				min : 1,
				max : 8,
				priority : 2
			},
			bow : {
				min : 3,
				max : 12,
				priority : 8
			}
		},
		sequence : {
			0 : {
				category : "dayThree",
				hero : "introJeff",
				fuzz : 0,
				force : true
			},
			1 : {
				category : 'dayThree',
				hero : 'vocabMan',
				fuzz : 12,
				force : true
			},
			2 : {
				category : 'dayThree',
				hero : 'badVocabMan',
				fuzz : 12,
				force : true
			},
			3 : {
				category : 'dayThree',
				hero : 'scaredMan',
				fuzz : 12,
				force : true
			},
			6 : {
				category : 'dayThree',
				hero : 'startDog',
				fuzz : 0,
				force : true
			},
			7 : {
				category : 'dayThree',
				hero : 'jeffDog',
				fuzz : 0,
				force : true
			},
			8 : {
				category : 'dayThree',
				hero : 'dogChoice',
				fuzz : 0,
				force : true
			},
			9 : {
				category : 'dayThree',
				hero : 'jeffHappy',
				fuzz : 0,
				force : true
			},
			9999 : {
				category : "dayThree",
				hero : "endJeff",
				fuzz : 0,
				force : true
			}
		},
		conditions : {
			dogAppear : {
				components : ["gotDog"],
				events : ["Events.DOG.APPEAR"],
				chance : 1.0,
				isLongTerm : true
			}
		},
		clues : {
			hero : [
				"The hero knows only four words.",
				"Hint: You may need to question the hero."
			],
			crisis : [
				"The town's being attacked by convicts with very short swords.",
				"Bows are in high demand."
			]
		},
		questions : {
			number : "Favorite number?",
			color : "Favorite color?"
		},
		wrapup : [
			{
				text : "You're forced by King Zoran to pay 10 gold in taxes.",
				gold : -10
			},
			{
				conditions : ["soldHero"],
				text : "Using his sharpshooting skills, the hero drove the convicts from the town.",
			},
			{
				conditions : ['soldHero'],
				text : "When interviewed, he would only repeat 'BOW GET, FIVE GOLD!'."
			},
			{
				conditions : ["refusedHero"],
				text : "Without the hero to drive them away, the convicts pillage the town and destroy your storefront. You spend 15 gold to repair it.",
				gold : -15
			}
		],
		length : 60000
	},
];

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
