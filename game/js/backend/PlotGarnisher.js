// Helper for dayGen
function PlotGarnisher(game) {

	var NUM_ELEMENTS = 2;
	var NUM_DOG_ELEMENTS = 0;
	var LAST_AVAILABLE_INDEX = 20;

	var storyElements;

	function init() {
		storyElements = [];

		var storyArrayTemp = storyArray;
		for(var i = 0; i < NUM_ELEMENTS; i++) {
			var story = randomElement(storyArrayTemp);
			storyArrayTemp = storyArrayTemp.filter(function(element) {
				return element !== story && stories[story].invalidOthers.indexOf(element) < 0;
			});
			storyElements.push(story);
		}

		var dogStoryArrayTemp = dogStoryArray;
		for(var j = 0; j < NUM_DOG_ELEMENTS; j++) {
			var story = randomElement(dogStoryArrayTemp);
			dogStoryArrayTemp = dogStoryArrayTemp.filter(function(element) {
				return element !== story && stories[story].invalidOthers.indexOf(element) < 0;
			});
			storyElements.push(story);
		}
	}

	this.garnishDay = function(day, index) {
		for(var i = 0; i < storyElements.length; i++) {
			var story = stories[storyElements[i]];
			var dayStory = story[index];
			if(dayStory) {
				insertCharacters(day, storyElements[i], dayStory.chars, dayStory.isOrdered);
				insertConditions(day, dayStory.conditions);
				insertWrapup(day, dayStory.wrapup);
			}
		}
	};

	function insertCharacters(day, storyName, charArray, isOrdered) {
		var sequence = day.sequence;
		var validIndexes = getValidIndexes(sequence);

		for(var i = 0; i < charArray.length; i++) {
			var index;
			if(isOrdered) {
				var segmentLength = Math.floor(validIndexes.length / charArray.length);
				var validIndexSubset = validIndexes.slice(segmentLength * i, segmentLength * (i + 1));
				index = randomElement(validIndexSubset);
				validIndexes.splice(validIndexes.indexOf(index), 1);
			} else {
				index = randomElement(validIndexes, true);
			}
			sequence[index] = generateHeroData(storyName, charArray[i]);
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

	function insertConditions(day, conditions) {
		if(conditions) {
			for(var condition in conditions) {
				day.conditions[condition] = conditions[condition];
			}
		}
	}

	function insertWrapup(day, wrapup) {
		if(wrapup) {
			for(var i = 0; i < wrapup.length; i++) {
				day.wrapup.push(wrapup[i]);
			}
		}
	}

	var storyArray = ["urchin", "treasure"];

	var dogStoryArray = [];
	
	var stories = {
		urchin : {
			1 : {
				chars : ["1scaredMan", "1trackerSearch", "1trackerWarn"],
				isOrdered : true,
				conditions : {
					urchin_manGrateful : {
						components : ["urchin_manLived"],
						chance : 1.0,
						isLongTerm : true
					},
					urchin_manWary : {
						components : ["urchin_manRefused"],
						chance : 1.0,
						isLongTerm : true
					},
					urchin_familyAngry : {
						components : ['urchin_manDead'],
						chance : 1.0,
						isLongTerm : true
					}
				},
				wrapup : [
					{
						conditions : ["manGrateful"],
						text : "You think you feel a presence nearby while you're sleeping, but you can't be sure."
					}
				]
			},
			2 : {
				chars : ["2gratefulMan", "2angryFamily"],
				isOrdered : false,
				conditions : {
					urchin_manWary : {
						components : ["urchin_refusedGift"],
						chance : 1.0,
						isLongTerm : true
					},
					urchin_trackerSuspicious : {
						components : ["urchin_acceptedGift"],
						chance : 1.0,
						isLongTerm : true
					}
				},
				wrapup : [
					{
						conditions : ["urchin_familyAngry"],
						text : "You feel a hostile presence watching you as you sleep."
					}
				],
			},
			4 : {
				chars : ["4tracker", "4waryMan", "4trackerWarning"],
				isOrdered : false,
				conditions : {
					urchin_trackerMad : {
						components : ["urchin_trackerTruth"],
						chance : 0.8,
						isLongTerm : true
					},
					urchin_trackerVengeful : {
						components : ["urchin_trackerLied"],
						chance : 0.4,
						isLongTerm : true
					}
				},
				wrapup : [
					{
						conditions : ["urchin_unprotected"],
						text : "You feel the presence again in the night, though this time it slices your arm with a blade. You pay the town doctor 13 gold.",
						gold : -13
					},
					{
						conditions : ["urchin_trackerProtect"],
						text : "You feel the presence again in the night. A shadowy figure pounces on you, but your protector drives it away.",
					}
				],
			},
			5 : {
				chars : ["5waryManTest", "5madTracker"],
				isOrdered : false,
				conditions : {
					urchin_trackerVengeful : {
						components : ["urchin_trackerRefused"],
						chance : 0.6,
						isLongTerm : true
					},
					urchin_manProud : {
						components : ["urchin_manSold"],
						chance : 1.0,
						isLongTerm : true
					}
				}

			},
			6 : {
				chars : ["6proudMan", "6vengefulTracker"],
				isOrdered : false
			},
			invalidOthers : []
		},
		treasure : {
			2 : {
				chars : ["2offer"],
				isOrdered : false,
				conditions : {
					treasure_happy : {
						components : ["treasure_bought"],
						chance : 1.0,
						isLongTerm : true
					},
					treasure_sad : {
						components : ["treasure_refused"],
						chance : 1.0,
						isLongTerm : true
					},
					treasure_good : {
						components : ["treasure_bought"],
						chance : 0.75,
						isLongTerm : false
					}
				},
				wrapup : [
					{
						conditions : ["treasure_bought"],
						text : "At nightfall, you set out to follow your new treasure map, but you can't seem to find anything."
					},
					{
						conditions : ["treasure_good"],
						text : "Just as you're about to leave, you spot a stack of 12 gold!",
						gold : 12
					}
				]
			},
			3 : {
				chars : ["3friendlyOffer", "3sadOffer"],
				isOrdered : false,
				conditions : {
					treasure_hunting : {
						components : ["treasure_bought", "treasure_happy"],
						chance : 1.0,
						isLongTerm : true
					},
					treasure_sad : {
						components : ["treasure_refused"],
						chance : 1.0,
						isLongTerm : true
					},
					treasure_good : {
						components : ["treasure_bought"],
						chance : 0.75,
						isLongTerm : false
					}
				},
				wrapup : [
					{
						conditions : ["treasure_bought"],
						text : "At nightfall, you set out to follow your new treasure map, but you can't seem to find anything."
					},
					{
						conditions : ["treasure_good"],
						text : "Just as you're about to leave, you spot a stack of 18 gold!",
						gold : 18
					}
				]
			},
			4 : {
				chars : ["4dungeonOffer", "4lastMap"],
				conditions : {
					treasure_hunting2 : {
						components : ["treasure_bought", "treasure_hunting"],
						chance : 1.0,
						isLongTerm : true
					},
					treasure_good : {
						components : ["treasure_bought"],
						chance : 0.75,
						isLongTerm : false
					}
				},
				wrapup : [
					{
						conditions : ["treasure_bought"],
						text : "At nightfall, you set out to follow this last treasure map, but you can't seem to find anything."
					},
					{
						conditions : ["treasure_good"],
						text : "That is, until you spot a stack of 20 gold!",
						gold : 20
					}
				]
			},
			6 : {
				chars : ["6goodbye"],
				isOrdered : false
			},
			invalidOthers : []
		}
	};

	init();
	game.reset.register(init);

}