// Helper for dayGen
function HeroManager(game) {

	initRandomHeroes(game);

	var LAST_AVAILABLE_INDEX = 20;

	var validHeroCollections = [];

	function init() {
		heroCollections.randomGenHero = generateRandomHero();
		validHeroCollections = Object.keys(heroCollections);
	}

	this.insertHeroes = function(day, numFalse) {
		var heroCollection = randomElement(validHeroCollections, true);
		var validIndexes = getValidIndexes(day.sequence);
		handleHero(day, heroCollection, validIndexes);
		handleFalseHeroes(day, heroCollection, validIndexes, numFalse);
		handleClues(day, heroCollection);
		handleQuestions(day, heroCollection);
		handleWrapupText(day, heroCollection);
	};

	function handleHero(day, heroCollection, validIndexes) {
		var index = randomElement(validIndexes, true);
		var hero = heroCollections[heroCollection].hero;
		day.sequence[index] = generateHeroData(heroCollection, hero);
	}

	function handleFalseHeroes(day, heroCollection, validIndexes, numFalse) {
		var falseArray = heroCollections[heroCollection].falseHeroes;
		for(var i = 0; i < Math.min(falseArray.length, numFalse); i++) {
			var index = randomElement(validIndexes, true);
			var falseHero = falseArray[i];
			day.sequence[index] = generateHeroData(heroCollection, falseHero);
		}
	}

	function handleWrapupText(day, heroCollection) {
		var wrapup = heroCollections[heroCollection].wrapup;
		for(var i = 0; i < wrapup.length; i++) {
			day.wrapup.push(wrapup[i]);
		}
	}

	function handleClues(day, heroCollection) {
		var clues = heroCollections[heroCollection].clues;
		for(var i = 0; i < clues.length; i++) {
			day.clues.hero.push(clues[i]);
		}
	}

	function handleQuestions(day, heroCollection) {
		var questions = heroCollections[heroCollection].questions;
		for(var question in questions) {
			day.questions[question] = questions[question];
		}
	}

	function getValidIndexes(sequence) {
		var validIndexes = [];
		for(var i = 0; i < LAST_AVAILABLE_INDEX; i++) {
			if(!sequence[i]) {
				validIndexes.push(i);
			}
		}
		return validIndexes;
	}

	var heroCollections = {
		vocabMan : {
			hero : "hero",
			falseHeroes : ["villain"],
			clues : [
				"The hero knows only four words."
			],
			questions : {
				number : "Favorite number?",
				color : "Favorite color?"
			},
			wrapup : [
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
			]
		}
	};

	init();
	game.reset.register(init);

}