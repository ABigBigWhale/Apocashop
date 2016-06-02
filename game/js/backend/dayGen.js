var getDay;

function initDayGenerator(game) {

	var heroManager = new HeroManager(game);
	var plotGarnisher = new PlotGarnisher(game);
	var jeffInserter = new JeffInserter(game);

	var days;

	getDay = function(num) {
		var day = days[num] ? days[num] : deepCopy(dayTemplate);

		if(!day.isPreset.length) {
			generateLength(day);
		}

		if(!day.isPreset.items) {
			var crisis = generateCrisis(day);
			generateItemData(day, crisis);
		}

		if(!day.isPreset.tax) {
			generateTaxWrapup(day, num);
		}
		
		if(!day.isPreset.jeff) {
			jeffInserter.insertJeff(day, num);
		}

		if(!day.isPreset.hero) {
			heroManager.insertHeroes(day, Math.ceil(num/3));
		}
	
		if(!day.isPreset.plot) {
			plotGarnisher.garnishDay(day, num);
		}

		return day;
	}

	function generateItemData(day, crisis) {
		for(var i = 0; i < crisis.items.length; i++) {
			var item = crisis.items[i];
			var averagePrice = Math.round((items[item].price + items[item].jPrice) / 2);
			day.itemData[item] = {
				min : Math.floor(averagePrice / 2),
				max : Math.ceil(averagePrice * 2),
				priority : 100 / (i+1)
			};
		}
	}

	function generateLength(day) {
		day.length = 50000;
	}

	var generateCrisis;
	var generateTaxWrapup;

	(function() {

		var NUM_ITEMS = 3;
		var NUM_ITEMS_SHOWN = 2;

		var threats = [
			"ruffians",
			"beholders",
			"ill-mannered honey badgers"
		];

		var threatFlavor = [
			"The town is being menaced by [x].",
			"Our town's being attacked by [x].",
			"Your shop is being threatened by [x]",
			"The town is imperiled by [x]"
		];

		var demandFlavor = [
			"People seem to really want [x]s.",
			"The townspeople are clamoring for [x]s.",
			"Everyone in town wants [ax].",
			"[x]s have been in high demand.",
			"People are searching for [x]s"
		];

		generateCrisis = function(day) {
			var crisis = {
				threat : generateThreat(),
				items : generateItems().slice(0, NUM_ITEMS)
			};

			day.clues.crisis.push(generateThreatFlavor(crisis.threat));

			for(var i = 0; i < NUM_ITEMS_SHOWN; i++) {
				day.clues.crisis.push(generateDemandFlavor(crisis.items[i]));
			}

			return crisis;
		};

		function generateItems() {
			return shuffleArray(game.playerState.getAvalItems());
		}

		function generateThreat() {
			return randomElement(threats);
		}

		function generateThreatFlavor(threat) {
			return randomElement(threatFlavor).replace('[x]', threat);
		}

		function generateDemandFlavor(item) {
			var flavor = randomElement(demandFlavor);
			return flavor.replace('[ax]', addAn(item)).replace('[x]', item);
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

		generateTaxWrapup = function(day, index) {
			var taxes = Math.ceil((1 + index) / 4) * 10;
			var nextTax = Math.ceil((2 + index) / 4) * 10;
			day.wrapup.push(generateMessage("You are forced by King Zoran to pay " + taxes + " gold in taxes.", -taxes));
			if(taxes !== nextTax) {
				day.wrapup.push(generateMessage("You are warned that tomorrow, Zoran will want " + nextTax + " gold.", 0));
			}
		};

	})();

	var dayTemplate = {
		isPreset : {},
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
			isPreset : {
				length : true,
				items : true,
				tax : true,
				jeff : true,
				hero : true,
				plot : true
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
						offers : [1, 8],
						sellConditions : ['tutorialFailed'],
						refuseConditions : ['tutorialFailed']
					},
					fuzz : 0,
					force : true
				},
				3 : {
					category : 'dayOne',
					hero : 'messUpJeff',
					fuzz : 0,
					force : true
				},
				4 : {
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
				},
				uglyHackTracking : {
					components : ["tutorialFailed"],
					chance : 1.0,
					events : ["Events.TUTORIAL.FAILED"],
					isLongTerm : false
				}
			},
			clues : {
				hero : [
					"My cousin is rather rude.",
					"My cousin will offer ten gold.",
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
					text : "You're forced by King Zoran to pay five gold in taxes.",
					gold : -5
				},
				{
					conditions : ["soldCousin"],
					text : "Your store is robbed in the night. The robber leaves a note on Mac and Cheese colored paper.",
					gold : -3
				}
			],
			length : 40000
		},
		{
			isPreset : {
				length : true,
				items : true,
				tax : true,
				jeff : true,
				hero : true,
				plot : false
			},
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
				6 : {
					category : "dayTwo",
					hero : "badRhymeMan",
					fuzz : 7,
					force : false
				},
				9999 : {
					category : "dayTwo",
					hero : "endJeff",
					fuzz : 0,
					force : true
				}
			},
			conditions : {},
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
					text : "You're forced by King Zoran to pay five gold in taxes.",
					gold : -5
				},
				{
					text : "You are warned that tomorrow, he will expect ten."
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
			length : 40000
		},
		{
			isPreset : {
				length : true,
				items : false,
				tax : true,
				jeff : true,
				hero : false,
				plot : false
			},
			itemData : {},
			sequence : {
				0 : {
					category : "dayThree",
					hero : "introJeff",
					fuzz : 0,
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
				dog_have : {
					components : ["gotDog"],
					events : ["Events.DOG.APPEAR"],
					chance : 1.0,
					isLongTerm : true
				}
			},
			clues : {
				hero : [],
				crisis : []
			},
			questions : {},
			wrapup : [
				{
					text : "You're forced by King Zoran to pay 10 gold in taxes.",
					gold : -10
				}
			],
			length : 40000
		},
		false,
		false,
		false,
		false,
		{
			isPreset : {
				length : true,
				items : false,
				tax : true,
				jeff : true,
				hero : true,
				plot : false
			},
			itemData : {},
			sequence : {
				0 : {
					category : "finalDay",
					hero : "introJeff",
					fuzz : 0,
					force : true
				},
				1 : {
					category : 'finalDay',
					hero : 'introZoran',
					fuzz : 0,
					force : true
				},
				9999 : {
					category : "finalDay",
					hero : "endZoran",
					fuzz : 0,
					force : true
				}
			},
			clues : {
				hero : ["Today, you are the hero."],
				crisis : []
			},
			questions : {},
			wrapup : [],
			length : 60000
		},
	];

}
