function ConditionManager(game) {

	var persistentConditions = [];

	var conditions;
	var compoundConditions;

	this.init = function(compound) {
		compoundConditions = compound;
		conditions = persistentConditions.slice();
	};

	this.set = function(condition) {
		if(conditions.indexOf(condition) === -1) {
			conditions.push(condition);
			printDebug("SETTING CONDITION: " + condition);
			for(var name in compoundConditions) {
				handleCompound(name);
			}
		}
	};

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

	function handleCompound(name) {
		var compound = compoundConditions[name];
		if(checkCompound(compound)) {
			if(rollDice(compound.chance)) {
				printDebug("SETTING COMPOUND CONDITION: " + name);
				conditions.push(name);
				if(compound.isLongTerm) {
					printDebug("SETTING LONGTERM CONDITION: " + name);
					persistentConditions.push(name);
				}
			}
			delete compoundConditions[name];
		}
	}

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