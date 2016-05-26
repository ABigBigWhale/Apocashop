function ConditionManager(game) {

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
				var isCondition = conditions.indexOf(condition[i]) > -1;
				// var isStateCondition = game.playerState.conditions.indexOf(condition[i]) > -1;
				// if(!isCondition && !isStateCondition) {
				// 	return false;
				// }
				if(!isCondition) {
					return false;
				}
			}
			return true;
		} else {
			var isCondition = conditions.indexOf(condition) > -1;
			// var isStateCondition = game.playerState.conditions.indexOf(condition) > -1;
			// return isCondition || isStateCondition;
			return isCondition;
		}
	};

	// Helper for set. If the compound condition was tripped, rolls a dice based
	// on the chance value for that compound condition. If the dice roll passes,
	// trips the condition. Deletes the compound condition from consideration regardless.
	function handleCompound(name) {
		var compound = compoundConditions[name];
		if(checkCompound(compound)) {
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

	// Helper for handleCompound. Checks if the compound condition has
	// been tripped.
	function checkCompound(compound) {
		var components = compound.components;
		for(var i = 0; i < components.length; i++) {
			var isCondition = conditions.indexOf(components[i]) > -1;
			// var isStateCondition = conditions.indexOf(components[i]) > -1;
			// if(!isCondition && !isStateCondition) {
			// 	return false;
			// }
			if(!isCondition) {
				return false;
			}
		}
		return true;
	}

}