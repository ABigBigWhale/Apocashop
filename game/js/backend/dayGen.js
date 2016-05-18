var getDay;

function initDayGenerator(game) {

	var days;

	var worldState = {
		happiness : 0,
		difficulty : 0
	};

	getDay = function(num) {
		worldState.difficulty = num;
		if(num < days.length) {
			return days[num];
		} else {
			return generateDay(num);
		}
	};

	function generateDay(num) {
		var day = JSON.parse(JSON.stringify(dayTemplate));

		generateLength(day);

		var crisis = generateCrisis(day);
		generateItemData(day, crisis);

		var hero = generateHero(day, crisis);

		generateWrapup(day, hero, crisis);
		generateStoryNPCs(day, crisis);

		return day;
	}

	function generateItemData(day, crisis) {
		for(var i = 0; i < crisis.items.length; i++) {
			var item = crisis.items[i];
			day.itemData[item] = {
				min : items[item].price / 2,
				max : items[item].price * 2,
				priority : 100 / (i+1)
			};
		}
	}

	function generateLength(day) {
		day.length = 40000;
	}

	var generateCrisis;
	var generateHero;
	var generateFalseHero;
	var generateWrapup;
	var generateStoryNPCs;

	(function() {

		var NUM_ITEMS = 2;

		generateCrisis = function(day) {
			var crisis = {
				threat : generateThreat(),
				items : generateItems().slice(0, NUM_ITEMS)
			};

			day.clues.crisis.push(generateThreatFlavor(crisis.threat));

			for(var i = 0; i < NUM_ITEMS; i++) {
				day.clues.crisis.push(generateDemandFlavor(crisis.items[i]));
			}

			return crisis;
		};

		function generateItems() {
			return shuffleArray(game.playerState.getAvalItems());
		}

		var threats = [
			"goblins",
			"escaped convicts",
			"ruffians",
			"violent youths",
			"orcs",
			"beholders",
			"inedible mushroom monsters",
			"ill-mannered honey badgers"
		];

		function generateThreat() {
			return randomElement(threats);
		}

		var threatFlavor = [
			"The town is being menaced by [x].",
			"Our town's being attacked by [x].",
			"Your shop is being threatened by [x]",
			"The town is imperiled by [x]"
		];

		function generateThreatFlavor(threat) {
			return randomElement(threatFlavor).replace('[x]', threat);
		}

		var demandFlavor = [
			"People seem to really want [x]s.",
			"The townspeople are clamoring for [x]s.",
			"Everyone in town wants [ax].",
			"[x]s have been in high demand.",
			"People are searching for [x]s"
		]

		function generateDemandFlavor(item) {
			var flavor = randomElement(demandFlavor);
			return flavor.replace('[ax]', addAn(item)).replace('[x]', item);
		}

	})();

	(function() {

		var NUM_FALSE_HEROES = 2;

		// structure: {hero : heroID, falseHeroes : [array of heroIDs]}
		// Actual heroes are set up in the generatedDay section of the
		// heroes object. Make sure you do NOT use hero or falseHero
		// followed by a number as an ID or it will be overwritten.
		var preGenHeroes = [];

		generateHero = function(day, crisis) {
			var isAddedToSequence = false;

			if(preGenHeroes.length > 0 && rollDice(0.2)) {
				var genDay = heroes.generatedDay;
				var randomHeroInfo = randomElement(preGenHeroes, true);

				var hero = genDay[randomHeroInfo.hero];
				var falseHeroes = [];
				for(var i = 0; i < randomHeroInfo.falseHeroes.length; i++) {
					falseHeroes.push(genDay[randomHeroInfo.falseHeroes[i]]);
				}
				addToSequence(day, hero, falseHeroes);
				return; 
			}

			var hero = generateNPC(day, {
				sellConditions : ['soldHero'],
				refuseConditions : ['refusedHero']
			});
			var falseHeroes = [];
			for(var i = 0; i < NUM_FALSE_HEROES; i++) {
				falseHeroes.push(generateNPC(day, {
					sellConditions : ['soldFalse']
				}));
			}

			var numClues = Math.ceil(worldState.difficulty);

			generateQuestionClue(day, hero, falseHeroes, numClues === 1);

			if(numClues >= 2) {
				if(rollDice(0)) {
					generateNeighborClue(day, hero, falseHeroes, numClues === 2);
					isAddedToSequence = true;
				} else {
					generateOfferClue(day, hero, falseHeroes, numClues === 2);
				}
			} else {
				lowerOffers(day, hero, falseHeroes);
			}

			if(numClues >= 3) {
				generateLetterClue(day, hero, falseHeroes, true);
			}

			heroes.generatedDay.hero = hero;

			for(var i = 0; i < NUM_FALSE_HEROES; i++) {
				heroes.generatedDay["falseHero" + i] = falseHeroes[i];
			}

			if(!isAddedToSequence) {
				addToSequence(day, hero, falseHeroes);
			}

		};

		var generateQuestionClue;
		var generateOfferClue;
		var generateNeighborClue;

		(function() {

			var questions = {
				day : "How was day?",
				color : "Favorite color?",
				number : "Favorite number?"
			};

			var answerFlavor = {
				day : [
					"Ah, it was [x].",
					"It was [x].",
					"My day was [x].",
					"My day? It was [x].",
					"Just like every other day. It was [x]."
				],
				color : [
					"The best color is obviously [x].",
					"My favorite color? Definitely [x].",
					"My favorite color is [x].",
					"Easily [x]."
				],
				number : [
					"My favorite number is [x].",
					"The best number is [x].",
					"I have to go with [x].",
					"Easily [x]."
				]
			};

			var answers = {
				day : [
					"'well'",
					"alright, I guess.",
					"not bad, could've been better",
					"good, good...",
					"a complete disaster",
					"'really normal'",
					"'smelly'"
				],
				color : [
					"'Mac and Cheese'",
					"the color of worms",
					"'Royal Purple'",
					"'Radical Red'",
					"'Outrageous Orange'",
					"'Razzle Dazzle Rose'",
					"'Purple Pizzazz'",
					"'Magic Mint'",
					"'Screamin' Green'"
				],
				number : [
					"negative twelve",
					"banana",
					"fourty",
					"sixty two",
					"eight hundred",
					"seven point nine two six two eight nine five",
					"twoteen",
					"seven-eleven"
				]
			};

			var clues = {
				day : [
					"The hero will say their day was [x].",
					"The hero's day has been [x]."
				],
				color : [
					"The hero's favorite color is [x]."
				],
				number : [
					"The hero's favorite number is [x]."
				]
			};

			generateQuestionClue = function(day, hero, falseHeroes, isFoolproof) {
				var questions = getQuestions(day);
				var clueIndex = Math.floor(Math.random() * questions.length);
				for(var i = 0; i < questions.length; i++) {
					var invalidAnswers = [];
					var question = questions[i];

					var heroAnswer = generateAnswer(question);
					if(i === clueIndex) {
						if(isFoolproof) {
							invalidAnswers.push(heroAnswer);
						}
						day.clues.hero.push(generateClue(question, heroAnswer));
					}
					hero.questions[question] = generateFlavor(question, heroAnswer);

					for(var j = 0; j < falseHeroes.length; j++) {
						var falseAnswer = generateAnswer(question, invalidAnswers);
						falseHeroes[j].questions[question] = generateFlavor(question, falseAnswer);
					}
				}
			};

			function getQuestions(day) {
				var shuffledQuestions = shuffleArray(Object.keys(questions)).slice(0, 2);
				for(var i = 0; i < shuffledQuestions.length; i++) {
					day.questions[shuffledQuestions[i]] = questions[shuffledQuestions[i]];
				}
				return shuffledQuestions;
			}

			function generateAnswer(question, invalidList) {
				var answer = "";
				if(invalidList && invalidList.length >= answers[question].length) {
					return "NOT ENOUGH OPTIONS FOR UNIQUE";
				}
				do {
					answer = randomElement(answers[question]);
				} while(invalidList && invalidList.indexOf(answer) >= 0)
				return answer;
			}

			function generateFlavor(question, answer) {
				return randomElement(answerFlavor[question]).replace('[x]', answer);
			}

			function generateClue(question, answer) {
				return randomElement(clues[question]).replace('[x]', answer);
			}

		})();

		(function() {

			var offerFlavor = [
				"The hero's [n] offer will be [x] gold."
			];

			generateOfferClue = function(day, hero, falseHeroes, isFoolproof) {
				var numOffers = rollDice(60/100) ? 1 :
					rollDice(25/40) ? 2 :
					rollDice(10/15) ? 3 : 4;

				hero.offers = generateOffers(numOffers);
				hero.offerText = generateOfferText(hero.item, hero.offers);

				day.clues.hero.push(generateFlavor(hero.offers[numOffers - 1], numOffers));

				if(isFoolproof) {
					for(var i = 0; i < falseHeroes.length; i++) {
						var offer = falseHeroes[i].offers[numOffers - 1];
						if(offer && offer === hero.offers[numOffers - 1]) {
							falseHeroes[i].offers[numOffers - 1] -= 1;
						}
					}
				}

			};

			function generateOffers(numOffers) {
				var offers = [];
				for(var i = 0; i < numOffers; i++) {
					offers.push(numOffers - i);
				}
				return offers;
			}

			function generateFlavor(offer, index) {
				var flavor = randomElement(offerFlavor);
				return flavor.replace('[n]', numToThStr(index)).replace('[x]', numToStr(offer));
			}

		})();

		(function() {

			generateNeighborClue = function(day, hero, falseHeroes) {

			};

		})();

		function lowerOffers(day, hero, falseHeroes) {
			var allHeroes = [hero].concat(falseHeroes);
			for(var i = 0; i < allHeroes.length; i++) {
				var offers = allHeroes[i].offers;
				for(var j = 0; j < offers.length; j++) {
					if(offers[j] > items[hero.item].price) {
						offers.splice(j, 1);
						j--;
					}
				}
				if(offers.length === 0) {
					allHeroes[i].offers = [2];
				}
				allHeroes[i].offerText = generateOfferText(allHeroes[i].item, allHeroes[i].offers);
			}
		}

		function generateLetterClue(day, hero, falseHeroes, isFoolproof) {
			var text = hero.offerText[0].split(/[^a-zA-Z]/).join("");
			var index = Math.floor(Math.random() * text.length);
			var originalIndex = index;
			var char = text.charAt(index);

			if(isFoolproof) {
				for(var i = 0; i < falseHeroes.length; i++) {
					var falseText = falseHeroes[i].offerText[0].split(/[^a-zA-Z]/).join("");
					var falseChar = falseText.charAt(index);
					if(falseChar === char) {
						index = (index + 1) % text.length;
						if(index === originalIndex) {
							return;
						}
						char = text.charAt(index);
						i = 0;
					}
				}
			}

			day.clues.hero.push(generateLetterFlavor(char, index));

		}

		function generateLetterFlavor(character, index) {
			index += 1;
			var clueStr = "The " + getOrdinal(index) + " letter the hero says will be '" + character + "'.";
			return clueStr;
		}

		function generateHeroData(heroName) {
			return {
				category : "generatedDay",
				hero : heroName,
				fuzz : 0,
				force : true
			}
		}

		function addToSequence(day, hero, falseHeroes) {
			var index = randomIntInRange(1, 20);
			day.sequence[index] = generateHeroData('hero');
			for(var i = 0; i < falseHeroes.length; i++) {
				do {
					index = randomIntInRange(1, 20);
				} while(day.sequence[index]);
				day.sequence[index] = generateHeroData('falseHero' + i);
			}

			day.sequence[0] = generateHeroData('genericJeff');
			day.sequence[9999] = generateHeroData('endJeff');
		}

	})();

	(function() {

		function generateMessage(text, gold, conditions) {
			return {
				text : text,
				gold : gold,
				conditions : conditions
			};
		}

		generateWrapup = function(day, hero, crisis) {
			var taxes = Math.ceil(worldState.difficulty / 5) * 10;
			day.wrapup.push(generateMessage("You are forced by King Zoran to pay " + taxes + " gold in taxes.", -taxes));
			var robbedCash = Math.ceil(worldState.difficulty / 3) * 10;
			day.wrapup.push(generateMessage("The hero was unable to save the town. You lose " + robbedCash + " gold.", -robbedCash, ['refusedHero']));
		};

	})();

	(function() {

		generateStoryNPCs = function(day, crisis) {

		};

	})();

	var dayTemplate = {
		itemData : {},
		sequence : {},
		conditions : {},
		clues : {
			hero : [],
			crisis : []
		},
		questions : {},
		wrapup : []
	}

	days = [
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

}
