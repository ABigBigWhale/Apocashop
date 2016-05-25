// Helper for dayGen
function PlotGarnisher(game) {

	var NUM_ELEMENTS = 1;
	var NUM_DOG_ELEMENTS = 0;
	var LAST_AVAILABLE_INDEX = 20;

	var storyElements = [];

	function init() {
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

	var storyArray = ["urchin"];

	var dogStoryArray = [];

	var stories = {
		urchin : {
			1 : {
				chars : ["scaredMan", "tracker"],
				isOrdered : true,
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
				wrapup : [
					{
						conditions : ["manGrateful"],
						text : "You think you feel a presence nearby while you're sleeping, but you can't be sure."
					}
				]
			},
			2 : {
				chars : ["scaredManReturn"],
				isOrdered : false,
			}
		},
		invalidOthers : []
	};

	init();

}