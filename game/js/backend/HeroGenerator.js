var generateRandomHero;

function initRandomHeroes(game) {

	//var NUM_GENERATED_HEROES = 6;
	var NUM_FALSE_HEROES = 2;

	generateRandomHero = function(index) {
		var collectionData = {
			hero : "hero",
			falseHeroes : [],
			clues : [],
			questions : {},
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
		};

		var hero = generateNPC(collectionData, {
			sellConditions : ['soldHero'],
			refuseConditions : ['refusedHero'],
			isHero : true
		});
		var falseHeroes = [];
		for(var i = 0; i < NUM_FALSE_HEROES; i++) {
			falseHeroes.push(generateNPC(collectionData, {
				sellConditions : ['soldFalse'],
				isFalseHero : true
			}));
		}

		generateQuestionClue(collectionData, hero, falseHeroes, false);

		generateOfferClue(collectionData, hero, falseHeroes, false);

		generateLetterClue(collectionData, hero, falseHeroes, true);

		generateWrapup(collectionData);

		delete collectionData.itemData;

		heroes.randomGenHero.hero = hero;

		for(var i = 0; i < NUM_FALSE_HEROES; i++) {
			collectionData.falseHeroes.push("falseHero" + i);
			heroes.randomGenHero["falseHero" + i] = falseHeroes[i];
		}

		return collectionData;

	};

	var generateQuestionClue;
	var generateOfferClue;
	var generateNeighborClue;
	var generateWrapup;

	(function() {

		generateWrapup = function(day) {
			day.wrapup = [
				{
					conditions : ["soldHero"],
					text : "Thanks to your help, the hero saves the town. In thanks, the hero brings you some of the cash he won and said more bland randomly generated things.",
					gold : 5
				},
				{
					conditions : ["refusedHero"],
					text : "Unfortunately, without your help, the very bland hero was unable to stop the threat. Your store was pillaged in the night.",
					gold : -10
				},
			]
		};

	})();

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
				"alright, I guess",
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
					day.clues.push(generateClue(question, heroAnswer));
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

			day.clues.push(generateFlavor(hero.offers[numOffers - 1], numOffers));

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
				var randAdd = Math.floor(Math.random() * 3);
				offers.push(numOffers + randAdd - i);
			}
			return offers;
		}

		function generateFlavor(offer, index) {
			var flavor = randomElement(offerFlavor);
			return flavor.replace('[n]', numToThStr(index)).replace('[x]', numToStr(offer));
		}

	})();

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

		day.clues.push(generateLetterFlavor(char, index));

	}

	function generateLetterFlavor(character, index) {
		index += 1;
		var clueStr = "The " + getOrdinal(index) + " letter the hero says will be '" + character + "'.";
		return clueStr;
	}

}