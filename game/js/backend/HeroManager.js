// Helper for dayGen
function HeroManager(game) {

	initRandomHeroes(game);

	var LAST_AVAILABLE_INDEX = 20;

	var validHeroCollections = [];

	function init() {
		heroCollections.randomGenHero = generateRandomHero();
		validHeroCollections = Object.keys(heroCollections);
		//validHeroCollections = ["randomGenHero", "randomGenHero", "randomGenHero", "randomGenHero", "randomGenHero"];
	}

	this.insertHeroes = function(day, numFalse) {
		var heroCollection = randomElement(validHeroCollections, true);
		var validIndexes = getValidIndexes(day.sequence);
		handleHero(day, heroCollection, validIndexes);
		handleFalseHeroes(day, heroCollection, validIndexes, numFalse);
		handleItemData(day, heroCollection);
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
		var falseArray = deepCopy(heroCollections[heroCollection].falseHeroes);
		for(var i = 0; i < Math.min(falseArray.length, numFalse); i++) {
			var index = randomElement(validIndexes, true);
			var falseHero = randomElement(falseArray, true);
			day.sequence[index] = generateHeroData(heroCollection, falseHero);
		}
	}

	function handleItemData(day, heroCollection) {
		var itemData = heroCollections[heroCollection].itemData;
		
		if(itemData) {
			day.itemData = {};
			for(var item in itemData) {
				day.itemData[item] = itemData[item];
			}
		}
	}

	function handleWrapupText(day, heroCollection) {
		var wrapup = heroCollections[heroCollection].wrapup;
		for(var i = 0; i < wrapup.length; i++) {
			day.wrapup.push(wrapup[i]);
		}
	}

	function handleClues(day, heroCollection) {
		var heroClues = heroCollections[heroCollection].clues.hero;
		var crisisClues = heroCollections[heroCollection].clues.crisis;

		for(var i = 0; i < heroClues.length; i++) {
			day.clues.hero.push(heroClues[i]);
		}

		if(crisisClues) {
			day.clues.crisis = [];

			for(var i = 0; i < crisisClues.length; i++) {
				day.clues.crisis.push(crisisClues[i]);
			}
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
			falseHeroes : ["villain", "villain2", "villain3"],
			itemData : {
				sword : {
					min : 2,
					max : 11,
					priority : 2
				},
				chicken : {
					min : 1,
					max : 7,
					priority : 2
				},
				bow : {
					min : 1,
					max : 10,
					priority : 8
				}
			},
			clues : {
				hero : [
					"The hero knows only four words."
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
					conditions : ["soldHero"],
					text : "Using his sharpshooting skills, the hero drove the convicts from the town.",
				},
				{
					conditions : ['soldHero'],
					text : "When interviewed, he would only repeat 'BOW GET, FIVE GOLD!'."
				},
				{
					conditions : ["refusedHero"],
					text : "Without the hero to drive them away, the convicts pillage the town and destroy your storefront.",
				},
				{
					conditions : ["refusedHero"],
					text : "You spend 12 gold to repair it.",
					gold : -12
				}
			]
		},
		fingers : {
			hero : "hero",
			falseHeroes : ["falseHero1", "falseHero2", "falseHero3"],
			itemData : {
				shield : {
					min : 1,
					max : 11,
					priority : 7
				},
				chicken : {
					min : 1,
					max : 8,
					priority : 2
				},
				bow : {
					min : 1,
					max : 9,
					priority : 1
				}
			},
			clues : {
				hero : [
					"The hero will offer five gold for a shield.",
					"The hero refuses to say numbers.",
					"The hero likes to talk with their hands."
				],
				crisis : [
					"Your shop is being threatened by violent youths.",
					"The townsfolk are looking for something to cower behind."
				]
			},
			questions : {
				number : "Favorite number?",
				color : "Favorite color?"
			},
			wrapup : [
				{
					conditions : ['soldHero'],
					text : "Thanks to their shiny new shield, the hero was able to drive the youths from the town."
				},
				{
					conditions : ['refusedHero'],
					text : "Without a shield to protect themselves, the hero was unable to stop the youths."
				},
				{
					conditions : ['refusedHero'],
					text : "They were also unable to warn of how many were coming, since there were more than ten.//You are unprepared and your storefront is destroyed.",
					gold : -12
				}
			]
		},
		noLetter : {
			hero : "hero",
			falseHeroes : ["falseHero1", "falseHero2", "falseHero3"],
			itemData : {
				bow : {
					min : 1,
					max : 10,
					priority : 7
				},
				chicken : {
					min : 1,
					max : 8,
					priority : 2
				},
				shield : {
					min : 2,
					max : 10,
					priority : 1
				}
			},
			clues : {
				hero : [
					"The hero is the only customer to not say a single 's' or 'h'"
				],
				crisis : [
					"The town is being menaced by inedible and pungent mushroom monsters.",
					"Everyone is looking for a way to fend them off without getting too close."
				]
			},
			questions : {
				alphabet : "Alphabet?",
				color : "Favorite color?"
			},
			wrapup : [
				{
					conditions : ['soldHero'],
					text : "Using their newly purchased bow, the hero drives the mushrooms and their odor out of the town.",
					gold : 10
				},
				{
					conditions : ['soldHero'],
					text : "It turns out a sword, shield, or chicken would have worked better, but the hero was unable to ask for them."
				},
				{
					conditions : ['refusedHero'],
					text : "Without access to a bow, the hero succumbed to the odor of the mushrooms.//You spend money thoroughly cleaning your store.",
					gold : -10
				}
			]
		},
		noNumber : {
			hero : "hero",
			falseHeroes : ["falseHero1", "falseHero2"],
			itemData : {
				sword : {
					min : 1,
					max : 9,
					priority : 7
				},
				chicken : {
					min : 1,
					max : 7,
					priority : 2
				},
				bow : {
					min : 1,
					max : 9,
					priority : 1
				}
			},
			clues : {
				hero : [
					"The hero will offer three gold.",
					"The hero refuses to say any number except five.",
					"The hero enjoys word games."
				],
				crisis : [
					"Orcs are planning to raid the village.",
					"Townspeople are looking for pointy things to stab into them."
				]
			},
			questions : {
				number : "Favorite number?",
				day : "How was day?"
			},
			wrapup : [
				{
					conditions : ['soldHero'],
					text : "Thanks to their new sword, the hero was able to stab many orcs."
				},
				{
					conditions : ['soldHero'],
					text : "They come back, thank you for helping them, and offer you two gold for every 't' in this sentence.",
					gold : 14
				},
				{
					conditions : ['refusedHero'],
					text : "Without a sword, the hero was no match for the hordes of orcs.//Your shop is heavily damaged.",
					gold : -8
				}
			]
		},
		// rhymeAdvance : {
		// 	hero : "hero",
		// 	falseHeroes : ["falseHero1", "falseHero2", "falseHero3"],
		// 	clues : [
		// 		"The first, seventh, and thirteenth word the hero says will rhyme."
		// 	],
		// 	questions : {
		// 		day : "How was day?",
		// 		color : "Favorite Color?"
		// 	},
		// 	wrapup : [
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "Using their newly purchased shield to cower behind, the hero was able to confuse and defeat the monsters with their rhymes."
		// 		},
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "In appreciation, they return with some of the monster's keep.",
		// 			gold : 5
		// 		},
		// 		{
		// 			conditions : ['refusedHero'],
		// 			text : "Without a shield, the hero was lost while trying to distract the monsters with their rhymes./@Your store is pillaged.",
		// 			gold : -12
		// 		}
		// 	]
		// },
		// stallingMan : {
		// 	hero : "hero",
		// 	falseHeroes : ["villain1", "villain2"],
		// 	clues : [
		// 		"The hero speaks in bursts of three words",
		// 		"The hero cannot pronounce 'supercalifragilistic\nexpialidocious'",
		// 		"Our hero does not know what a sword is. But he will want to buy one",
		// 		"Our hero has no money, he will ask for the sword for free"
		// 	],
		// 	questions : {
		// 		sword : "Sword?",
		// 		super : "Supercalifragilisticexpialidocious?"
		// 	},
		// 	wrapup : [
		// 		{
		// 			conditions : ["soldHero"],
		// 			text : "Our hero stormed into battle in a gallop and slayed the enemies with a quick 1,2,3 of the sword.\n" +
		// 				   "Now that he has some money, he stops by and thanks you by giving you 1 gold out of his overflowing gold bag.",	
		// 			gold : 1
		// 		},
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "Our ran to the front lines and drew his shiny new (free) sword. Everyone cowered in fear and fled. " +
		// 				   "Unfortunatley, our hero didn't make any money because of it. So he is still goldless :("

		// 		},
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "When interviewed, our hero could not stop talking about his supercallfraglisticous pointy thing that he used so well"
		// 		},
		// 		{
		// 			conditions : ["refusedHero"],
		// 			text : "Our hero thought that a stick on the ground would be suitible to fend off the enemies. It didn't work. " +
		// 				   "King Zoran took an extra 15 gold in taxes to repair the town after the ransacking.",
		// 			gold : -15
		// 		}
		// 	]
		// },
		// stutterMan : {
		// 	hero : "hero",
		// 	falseHeroes : ["villain1", "villain2", "villain3"],
		// 	clues : [
		// 		"The hero has a hard time with the \"s\" sound. Be patient, he might take a while to pronounce sssssnake",
		// 		"The hero does not know the difference between numbers"
		// 	],
		// 	questions : {
		// 		numbers : "Two plus two?",
		// 		animal : "Snakes?"
		// 	},
		// 	wrapup : [
		// 		{
		// 			conditions : ["soldHero"],
		// 			text : "Our hero slayed the enemies while screaming SSSSSnakessssss are not SSSSScary!\n" + 
		// 				   "He stopped by your store to give you a small tip of 1 gold. You helped him overcome his secret fear of snakes he didn't know he had ...",
		// 			gold : 1
		// 		},
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "Our hero couldn't stop hissing. Or shushing? Can't really tell ... Maybe someone forgot to reset him?"

		// 		},
		// 		{
		// 			conditions : ['soldHero'],
		// 			text : "When asked how many he had slain, our hero said \'Two plussssss two many! Ssssssso around 10.4 I would guesssssssss\'. He's not our brightest hero"
		// 		},
		// 		{
		// 			conditions : ["refusedHero"],
		// 			text : "Our hero was found in the local town pub talking about how he 'would have' saved the villiage if a 'ccccccertain ssssssssomeone' would have sold him a shield. The townspeople wept and a couple of them joined forces and trashed your shop. You spent 10 gold in repairs.",
		// 			gold : -10
		// 		}
		// 	]
		// },
	};

	init();

}