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
		jprice : 5
	},
	"shield" : {
		price : 6,
		jprice : 8
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
		appearanceInfo : "face|1,body|1,hair|4,eye|8,nose|6,mouth|3,misc|4",
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
			"YOUR SOUL.@ But for you kid, I'll also accept gold pieces.",
			"If I see that you're out of what the customer wants, I'll be sure to shout my price at you.",
			{
				soldChicken : "You're pretty lucky to have me, kid. @@Not many anvils can make a cooked chicken.",
				default : "You might want to try haggling and selling more next time."
			}
		]
	},
	endOfTutorialJeff : {
		type : 'dialog',
		appearanceInfo : "jeff",
		dialog : [
			"Nicely done, kid. We're still in business!/@@Against all odds.",
			{
				soldCousin : "We need to keep a closer eye out for who to sell to./I have an idea on how to fix that.",
				default : "We got lucky to get that tip about the cousin./I'll make sure we don't have to rely on luck again."
			},
			"I'll research who we should and shouldn't sell to, and put it in that notebook.",
			"Now let's get some sleep. We've got a long day ahead of us."
		]
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
				hero : "chickenJeff",
				fuzz : 0,
				force : true
			},
			8 : {
				hero : "badCousin",
				fuzz : 3,
				force : true
			},
			11 : {
				hero : "tutorialWomanAngry",
				fuzz : 3,
				force : true
			},
			12 : {
				hero : "tutorialWomanHappy",
				fuzz : 3,
				force : true
			},
			9999 : {
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
			testLongTerm : {
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
				text : "You're forced by King Zoran to pay 3 gold in taxes.",
				gold : -3
			},
			{
				text : "He also demands that the shop should run faster and should collect more data on its customers."
			},
			{
				conditions : ["soldCousin"],
				text : "Your store is robbed in the night. The robber leaves a note on Mac and Cheese colored paper.",
				gold : -7
			}
		],
		length : 45000
	},
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
				hero : {
					item : "None",
					offers : [0],
					offerText : [
						{
							testLongTerm : "YOU SOLD TO HIM",
							default : "YOU DIDN'T SELL TO HIM"
						}
					]
				},
				fuzz : 0,
				force : true
			},
			2 : {
				hero : "man",
				fuzz : 3,
				force : true
			},
			5 : {
				hero : "tracker",
				fuzz : 0,
				force : true
			}
		},
		conditions : {
			eventTrigger : {
				components : ["tutorialPerson"],
				chance : 1.0,
				events : ["Events.TEST"],
				isLongTerm : false
			},
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