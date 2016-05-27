// Helper for dayGen
function HeroManager(game) {

	initRandomHeroes(game);

	var LAST_AVAILABLE_INDEX = 20;

	var validHeroCollections = [];

	function init() {
		heroCollections.randomGenHero = generateRandomHero();
		//validHeroCollections = Object.keys(heroCollections);
		validHeroCollections = ["stallingMan"];//["vocabMan", "randomGenHero", "vocabMan", "randomGenHero", "vocabMan", "vocabMan"];
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
		},
		stutterMan : {
			hero : "hero",
			falseHeroes : ["villain1", "villain2", "villain3"],
			clues : [
				"The hero has a hard time with the \"s\" sound. Be patient, he might take a while to pronounce sssssnake",
				"The hero does not know the difference between numbers"
			],
			questions : {
				numbers : "Two plus two?",
				animal : "Snakes?"
			},
			wrapup : [
				{
					conditions : ["soldHero"],
					text : "Our hero slayed the enemies while screaming SSSSSnakessssss are not SSSSScary!\n" + 
						   "He stopped by your store to give you a small tip of 1 gold. You helped him overcome his secret fear of snakes he didn't know he had ...",
					gold : 1
				},
				{
					conditions : ['soldHero'],
					text : "Our hero couldn't stop hissing. Or shushing? Can't really tell ... Maybe someone forgot to reset him?"

				},
				{
					conditions : ['soldHero'],
					text : "When asked how many he had slain, our hero said \'Two plussssss two many! Ssssssso around 10.4 I would guesssssssss\'. He's not our brightest hero"
				},
				{
					conditions : ["refusedHero"],
					text : "Our hero was found in the local town pub talking about how he 'would have' saved the villiage if a 'ccccccertain ssssssssomeone' would have sold him a shield. The townspeople wept and a couple of them joined forces and trashed your shop. You spent 10 gold in repairs.",
					gold : -10
				}
			]
		},
		stallingMan : {
			hero : "hero",
			falseHeroes : ["villain1", "villain2"],
			clues : [
				"The hero speaks in bursts of three words",
				"The hero cannot pronounce supercalifragilisticexpialidocious",
				"Our hero does not know what a sword is. But he will want to buy one",
				"Our hero has no money, he will ask for the sword for free"
			],
			questions : {
				sword : "Sword?",
				super : "Supercalifragilisticexpialidocious?"
			},
			wrapup : [
				{
					conditions : ["soldHero"],
					text : "Our hero stormed into battle in a gallop and slayed the enemies with a quick 1,2,3 of the sword.\n" +
						   "Now that he has some money, he stops by and thanks you by giving you 1 gold out of his overflowing gold bag.",	
					gold : 1
				},
				{
					conditions : ['soldHero'],
					text : "Our ran to the front lines and drew his shiny new (free) sword. Everyone cowered in fear and fled. " +
						   "Unfortunatley, our hero didn't make any money because of it. So he is still goldless :("

				},
				{
					conditions : ['soldHero'],
					text : "When interviewed, our hero could not stop talking about his supercallfraglisticous pointy thing that he used so well"
				},
				{
					conditions : ["refusedHero"],
					text : "Our hero thought that a stick on the ground would be suitible to fend off the enemies. It didn't work. " +
						   "King Zoran took an extra 15 gold in taxes to repair the town after the ransacking.",
					gold : -15
				}
			]
		}
	};

	init();
	game.reset.register(init);

}