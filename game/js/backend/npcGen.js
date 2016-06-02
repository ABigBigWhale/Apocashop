var generateNPC;
var applyRandomAppearance;
var generateOfferText;

function initNPCGen(game) {

	generateNPC = function(day, prePop) {
		prePop = prePop || {};
		var item = prePop.item || generateItem(day.itemData);
		var offers = prePop.offers || generateOffers(day.itemData, item);
		return {
			type : "interact",
			appearanceInfo : prePop.appearanceInfo || generateAppearance(item, offers),
			item : item,
			offers : offers,
			offerText : prePop.offerText || generateOfferText(item, offers),
			success : prePop.success || generateThanks(),
			fail : prePop.fail || generateLeave(),
			questions : prePop.questions || generateQuestions(day),
			appearConditions : prePop.appearConditions || false,
			sellConditions : prePop.sellConditions || false,
			refuseConditions : prePop.refuseConditions || false,
			stallTime : prePop.stallTime || false,
			stallConditions : prePop.stallConditions || false,
			isHero : prePop.isHero || false,
			isFalseHero : prePop.isFalseHero || false
		}
	};
	var upgradeChance = 0.0;
	var generateAppearance
	var generateGreeting;
	var generateHaggle;
	// var generateItemResponse;
	// var generateProfile;
	var generateQuestions;
	var generateThanks;
	var generateLeave;

	game.eventManager.register(game.Events.LEVEL.ACCEPT, updateUpgrade);

	function updateUpgrade(item) {
		if(item.indexOf("shop") >= 0)
			upgradeChance += (0.1 / 3.0);
	}
	function generateItem(itemData) {
		var max = 0;
		for(var item in itemData) {
			max += itemData[item].priority || 0;
		}
		var num = Math.random() * max;

		var counter = 0;
		for(var item in itemData) {
			counter += itemData[item].priority || 0;
			if(counter > num) {
				return item;
			}
		}
		return "INVALID ITEM";
	}

	function generateOffers(itemData, item) {
		var offers = [];

		var min = itemData[item].min;
		var fairPrice = Math.ceil((items[item].price + items[item].jPrice) / 2);
		var max = itemData[item].max + 1;
		var avg = Math.floor((min + max) / 2);
		var highAvg = Math.floor((avg + max) / 2);

		if(rollDice(0.8)) {
			offers.push(bellCurveIntInRange(min, fairPrice));
		} else {
			if(rollDice(0.85)) {
				offers.push(bellCurveIntInRange(fairPrice, highAvg));
			} else {
				offers.push(bellCurveIntInRange(highAvg, max));
			}
		}

		while(offers[offers.length - 1] < max) {
			var chance = (max - offers[offers.length - 1]) / (max - min);
			chance = Math.min(0.6 + upgradeChance, Math.pow(chance, 3) * 3);
			if(rollDice(chance)) {
				if(rollDice(0.7)) {
					offers.push(bellCurveIntInRange(offers[offers.length - 1] + 1, highAvg));
				} else {
					offers.push(bellCurveIntInRange(offers[offers.length - 1] + 1, max));
				}
			} else {
				break;
			}
		}

		return offers;
	}

	generateOfferText = function(item, offers) {
		var textArr = [];
		textArr.push(generateGreeting(item, offers[0]));
		for(var i = 1; i < offers.length; i++) {
			textArr.push(generateHaggle(offers[i]));
		}
		return textArr;
	}.bind(this);

	(function() {

		var apprCategory = game.assetManager.assets['npc'];

		generateAppearance = function(item, offers) {
			var maxOffer = Math.max.apply(this, offers);
			var apprQuery = '';

			for (var apprPart in apprCategory) {
				if (apprPart != 'hand') {
					var partCount = game.assetManager.assets['npc'][apprPart];
					apprQuery += apprPart + '|' + game.rnd.integerInRange(1, partCount) + ',';
				}
			}
			
			// Generate skin color
			var skinColor = generateSkinColor();
			apprQuery += 'skin|(' + 
				skinColor.r.toFixed(2) + ',' + 
				skinColor.g.toFixed(2) + ',' + 
				skinColor.b.toFixed(2) +
				')'; 
			
			return apprQuery;
		};

		applyRandomAppearance = function(npc) {
			npc.appearanceInfo = generateAppearance(npc.item, npc.offers);
		};

	})();

	(function() {

		var greetings = [
			"Can I get [x] for [y] gold?",
			"Could I get [x] for [y] gold?",
			"How's [y] gold for [x] sound?",
			"Would you part with [x] for [y] gold?",
			"Can I get [x]? [Y] gold.",
			"Need [x]. [Y] gold?",
			"How about [y] gold for [x]?"
		];

		var preGreetings = [
			"Hiya! ",
			"Howdy! ",
			"Greetings. ",
			"Hi. ",
			"Hola! ",
			"Aloha! ",
			"How's it going?/",
			"Nice day out!/",
			"Good day./"
		];

		generateGreeting = function(item, gold) {
			item = item || "ERROR";
			gold = numToStr(gold) || "ERROR";

			item = addAn(item);
			var index = Math.floor(Math.random() * preGreetings.length);
			var preGreeting = (Math.random() < 0.5) ? preGreetings[index] : "";

			index = Math.floor(Math.random() * greetings.length);
			var greeting = greetings[index];
			var capitalGold = (typeof gold === 'string') ? gold.charAt(0).toUpperCase() + gold.slice(1) : gold;
			return preGreeting + greeting.replace("[x]", item).replace("[y]", gold).replace("[Y]", capitalGold);
		};

	})();

	(function() {

		var haggles = [
			"Alright, you got me. [X] gold?",
			"Fine, fine. [X] gold?",
			"Alright, alright. [X] gold?",
			"How about [x] gold?",
			"[X] gold is the best I can do.",
			"[X] gold or I will walk away.",
			"Hmm. How about [x] gold?",
			"[X] gold. No more.",
			"Fine. [X] gold then.",
			"Alright, [x] gold then?",
			"[X] gold. That's my final offer.",
			"[X] gold is all I can offer.",
			"[X] gold is all I can afford.",
			"Okay then. [X] gold?",
			"Hmm. [X] gold?",
		];

		generateHaggle = function(gold) {
			gold = numToStr(gold) || "ERROR";

			var capitalGold = (typeof gold === 'string') ? gold.charAt(0).toUpperCase() + gold.slice(1) : gold;
			var index = Math.floor(Math.random() * haggles.length);
			return haggles[index].replace("[x]", gold).replace("[X]", capitalGold);
		}

	})();

	// (function() {

	// 	var items = {
	// 		sword : [
	// 			"Looks very sharp.",
	// 			"Ooh, @pointy.",
	// 			"Looks very sword-y."
	// 		],
	// 		bow : [
	// 			"Ooh, @pointy.",
	// 			"Looks scary.",
	// 			"Wouldn't want to be on the receiving end of that.",
	// 			"Never been a very good shot with one of those."
	// 		],
	// 		shield : [
	// 			"Looks expensive.",
	// 			"I wonder if they really are fireproof.",
	// 			"Wish I had one of those yesterday.",
	// 			"Ooh, @shiny."
	// 		],
	// 		water : [
	// 			"Looks very wet.",
	// 			"Ooh,@ water.",
	// 			"Very important.",
	// 			"I've run out of things I can say about water."
	// 		],
	// 		chicken : [
	// 			"Smells good.",
	// 			"Yum yum.",
	// 			"I need food badly."
	// 		],
	// 		default : [
	// 			"Huh?",
	// 			"Why are you showing this to me.",
	// 			"Don't really have an opinion.",
	// 			"What?",
	// 			"Why?",
	// 			"Not sure what you're trying to accomplish here.",
	// 			"Yes, I get it. @You have items."
	// 		]
	// 	}

	// 	generateItemResponse = function(item) {
	// 		var itemSayings = items[item];
	// 		if(!itemSayings) {
	// 			itemSayings = items.default;
	// 		}

	// 		var searchSpace = (Math.random() < 0.75) ? items.default : itemSayings;

	// 		var index = Math.floor(Math.random() * searchSpace.length);

	// 		return searchSpace[index];
	// 	};

	// })();

	// (function() {

	// 	var profiles = {
	// 		dayOne : [
	// 			"Oh, is that the rhyming guy? /@@Hard to believe he's our hero.",
	// 			"Oh yeah, I love that guy! He's always rhyming and singing.",
	// 			"I hate that guy, with his @@rhymes.",
	// 			"How does he always come up with so many rhymes?"
	// 		],
	// 		dayTwo : [
	// 			"Heh, not the best vocabulary on that one.",
	// 			"How does someone only learn four words?",
	// 			"There's no way they only know four words."
	// 		],
	// 		dayThree : [
	// 			"What an odd one.",
	// 			"He refused to say anything to me. Must be saving up his words for you.",
	// 			"He always manages to find a way to say what he needs to."
	// 		],
	// 		convict : [
	// 			"Looks like a sketchy guy.",
	// 			"They're the reason we all want bows. They're scared just looking at them.",
	// 			"Bleh, do not want."
	// 		],
	// 		scaredMan : [
	// 			"Aww, he looks sad.",
	// 			"He just tried to hide at my house, seemed really scared.",
	// 			"I'm not sure about him."
	// 		],
	// 		tracker : [
	// 			"He's been hunting for someone. Not sure who.",
	// 			"Looks scary."
	// 		],
	// 		dragon : [
	// 			"Don't remind me.",
	// 			"Terrifying.",
	// 			"D@o@ @n@o@t@ @w@a@n@t@.",
	// 			"*Crying sounds*"
	// 		],
	// 		default : [
	// 			"I don't know them",
	// 			"I'm not really sure what you want from me.",
	// 			"Huh?",
	// 			"What?",
	// 			"Eh?",
	// 			"No opinion on that.",
	// 			"Sorry, not sure who that is."
	// 		]	
	// 	}

	// 	generateProfile = function(profile) {
	// 		var responses = profiles[profile];
	// 		if(!responses) {
	// 			responses = profiles.default;
	// 		}

	// 		var searchSpace = (Math.random() < 0.75) ? profiles.default : responses;

	// 		var index = Math.floor(Math.random() * searchSpace.length);

	// 		return searchSpace[index];
	// 	};

	// })();

	(function() {

		var questions = {
			day : [
				"Um, good?",
				"Not particularly exciting.",
				"None of your business.",
				"Not bad.",
				"Eh.",
				"Meh.",
				"It's alright.",
				"Good, thanks.",
				"Doing well.",
				"Can't complain.",
				"Pretty alright.",
				"What's it to you?",
				"Why do you care?",
				"Boring.",
				"Wet"
			],
			news : [
				"I don't get out much.",
				"No idea.",
				"Probably some new cataclysm. We seem to get a lot of them.",
				"Dunno.",
				"Your shop opened? That's sort of news.",
				"I'm still alive. News enough for me.",
				"You probably know more than I do."
			],
			color : [
				"Red.",
				"Blue?",
				"Chartreuse. @@@Don't you dare judge me.",
				"Purple.",
				"Sky color.",
				"Ground color.",
				"The color of apples.",
				"Green.",
				"Goldenrod.",
				"Pewter.",
				"Cerulean.",
				"Fuscia.",
				"Viridian.",
				"Vermillion.",
				"Cinnibar.",
				"Saffron.",
				"Pink, I guess.",
				"Teal, no doubt.",
				"Purple and gold.",
				"Grey!",
				"The color of snow.",
				"White. I like white.",
				"Orchid.",
				"Khaki!"
			],
			number : [
				"Seven.",
				"Six.",
				"Negative one.",
				"Zero.",
				"Pi.",
				"i",
				"Fourty seven.",
				"Ninety three.",
				"Sixty two.",
				"One hundred.",
				"Seven point two. Don't ask why.",
			],
			alphabet : [
				"abcdefghijklmnopqrstuvwxyz",
				"abcefghijklmnpqrtuvwxyz",
				"bcghjlmprstvxz . . . I think that's all of them?",
				"abcdhiklmnopqrstuvwxyz"
			]
		}

		generateQuestions = function(day) {
			var questions = day.questions;
			var answers = {};
			for(var question in questions) {
				answers[question] = generateAnswer(question);
			}
			return answers;
		}

		function generateAnswer(question) {
			var options = questions[question];
			if(!options) {
				return "ERROR";
			}

			var index = Math.floor(Math.random() * options.length);
			return options[index];
		};

	})();

	(function() {

		var thanks = [
			"Pleasure doing business.",
			"Alright, thanks a lot.",
			"Thanks! I needed this.",
			"Thanks a bunch, friend.",
			"Thank you!",
			"Thanks, see ya!",
			"Thanks.",
			"You're the best, pal."	,
			"Thanks a bunch.",
			"Yes! I needed this.",
			"Good.",
			"Thanks a lot.",
			"Thanks, pal.",
			"Deal.",
		]

		generateThanks = function() {
			var index = Math.floor(Math.random() * thanks.length);
			return thanks[index];
		}

	})();

	(function() {

		var angrys = [
			"Heh, good luck getting more than that.",
			"Seriously, more? No way.",
			"You just lost my business.",
			"There's no way I can afford more.",
			"Terrible experience. Zero stars.",
			"This is a disappointment.",
			"Do I look rich to you?",
			"Welp, nevermind.",
			"More? Unbelievable.",
			"Nope, too much.",
			"No deal.",
			"No way.",
			"Heh, good luck with that.",
			// "Are you even trying to sell it?",
			// "Guess I'm not buying that.",
			"Nope, can't afford that.",
			// "Fine. I'll just look for other shops."
		]

		generateLeave = function() {
			var index = Math.floor(Math.random() * angrys.length);
			return angrys[index];
		};

	})();g

}