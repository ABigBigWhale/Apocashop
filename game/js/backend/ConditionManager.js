function ConditionManager(game) {

	var self = this;

	// Conditions that persist between days
	var persistentConditions = [];

	// Conditions for today, including a copy of the persistent conditions.
	// Cleared between days
	var conditions;

	// Contains the conditions and probabilities for compound conditions.
	var compoundConditions;

	var checkpoint;

	// Clears our daily conditions and takes in a new set of compound condition properties.
	this.init = function(compound) {
		compoundConditions = compound;
		conditions = persistentConditions.slice();
		checkpoint = persistentConditions.slice();
	};

	this.revertToCheckpoint = function() {
		persistentConditions = checkpoint;
	};

	// Trips the condition, if it hasn't already been tripped.
	// Checks all compound conditions to see if any of them have been tripped.
	this.set = function(condition) {
		if(conditions.indexOf(condition) === -1) {
			conditions.push(condition);
			printDebug("SETTING CONDITION: " + condition);
			for(var name in compoundConditions) {
				handleCompound(name);
			}
		}
	};

	// Returns true if the condition was tripped, false if not.
	// Can accept an array of conditions, in which case it will return false
	// if any condition is false, or a single condition.
	this.get = function(condition) {
		if(condition instanceof Array) {
			for(var i = 0; i < condition.length; i++) {
				var isNegated = condition[i].charAt(0) === '!';
				var thisCondition = isNegated ? condition[i].substring(1) : condition[i];
				var isCondition = conditions.indexOf(condition[i]) > -1;
				if(isCondition === isNegated) {
					return false;
				}
			}
			return true;
		} else {
			if(condition.indexOf("gold_") > -1) {
				var gold = parseInt(condition.substring(5))
				return gold <= game.playerState.getGold();
			}
			var isNegated = condition.charAt(0) === '!';
			condition = isNegated ? condition.substring(1) : condition;
			var isCondition = conditions.indexOf(condition) > -1;
			return isCondition !== isNegated;
		}
	};

	// Helper for set. If the compound condition was tripped, rolls a dice based
	// on the chance value for that compound condition. If the dice roll passes,
	// trips the condition. Deletes the compound condition from consideration regardless.
	function handleCompound(name) {
		var compound = compoundConditions[name];
		if(self.get(compound.components)) {
			if(rollDice(compound.chance)) {
				printDebug("SETTING COMPOUND CONDITION: " + name);
				conditions.push(name);
				if(compound.events) {
					for(var i = 0; i < compound.events.length; i++) {
						game.eventManager.notifyByName(compound.events[i]);
					}
				}
				if(compound.isLongTerm) {
					printDebug("SETTING LONGTERM CONDITION: " + name);
					persistentConditions.push(name);
				}
			} else {
				printDebug("DROPPING COMPOUND CONDITION: " + name);
			}
			delete compoundConditions[name];
		}
	}

}