var getDay;

initDayGenerator({
	playerState : {
		getAvalItems : function() {
			return ['sword', 'shield', 'chicken', 'water'];
		}
	}
});

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
		day.length = 60000;
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
			"beholders"
		];

		function generateThreat() {
			return randomElement(threats);
		}

		var threatFlavor = [
			"The town is being menaced by [x].",
			"Our town's being attacked by [x].",
			"Your shop is being threatened by [x]"
		];

		function generateThreatFlavor(threat) {
			return randomElement(threatFlavor).replace('[x]', threat);
		}

		var demandFlavor = [
			"People seem to really want [x]s.",
			"The townspeople are clamoring for [x]s.",
			"Everyone in town wants [ax]."
		]

		function generateDemandFlavor(item) {
			var flavor = randomElement(demandFlavor);
			return flavor.replace('[ax]', addAn(item)).replace('[x]', item);
		}

	})();

	(function() {

		generateHero = function(day, crisis) {
			var NUM_FALSE_HEROES = 2;
			var isAddedToSequence = false;

			var hero = generateNPC(day, {});
			var falseHeroes = [];
			for(var i = 0; i < NUM_FALSE_HEROES; i++) {
				falseHeroes.push(generateNPC(day, {}));
			}

			var numClues = Math.ceil(worldState.difficulty / 1);

			generateQuestionClue(day, hero, falseHeroes, numClues === 1);

			if(numClues >= 2) {
				if(rollDice(0.5)) {
					generateNeighborClue(day, hero, falseHeroes);
					isAddedToSequence = true;
				} else {
					generateOfferClue(day, hero, falseHeroes);
				}
			} else {
				generateRandomOffer(day, hero, falseHeroes);
			}

			if(numClues >= 3) {
				generateLetterClue(day, hero, falseHeroes);
			} else {
				generateMessages(day, hero, falseHeroes);
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
					"a complete disaster",
					"'really normal'",
					"'smelly'"
				],
				color : [
					"mac and cheese",
					"worm colored",
					"Royal Purple",
					"Radical Red",
					"Outrageous Orange",
					"Razzle Dazzle Rose",
					"Purple Pizzazz",
					"Magic Mint",
					"Screamin' Green"
				],
				number : [
					"negative twelve",
					"banana",
					"fourty",
					"sixty two",
					"eight hundred"
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

		function generateOfferClue(day, hero, falseHeroes) {

		}

		function generateNeighborClue(day, hero, falseHeroes) {

		}

		function generateRandomOffer(day, hero, falseHeroes) {

		}

		function generateLetterClue(day, hero, falseHeroes) {

		}

		function generateMessages(day, hero, falseHeroes) {

		}

		function addToSequence(day, hero, falseHeroes) {

		}

	})();

	(function() {

		generateWrapup = function(day, hero, crisis) {

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

}