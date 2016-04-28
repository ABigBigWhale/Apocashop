function EventManager(game) {

	game.Events = {
		DAY : {
			START : [],
			END : []
		},
		INPUT : {
			YES : [],
			NO : [],
			CONTINUE : [],
			QUESTION : [],
			ITEM : [],
			PROFILE : []
		},
		INTERACT : {
			NEW : [],
			DIALOG : [],
			OFFER : []
		},
		INVENTORY : {
			SOLD : [],
			NOTSOLD : []
		},
		UPDATE : {
			GOLD : [],
			ITEMS : []
		},
		STOCK : {
			ADD : [],
			REMOVE : [],
			COMMIT : []
		}
	};

	var reverseEvents;
	var lookup = function() {};

	if(DEBUG_FLAG) {

		reverseEvents = {};

		// Looks up the given array in the reverse lookup table. Unfortunately,
		// we can't map the arrays to the names and just do a simple object lookup
		// in reverseEvents because arrays hash based on contents, not reference.
		// Thus, we have to use the names as the keys and the arrays as the values.
		lookup = function(arr) {
			for(var key in reverseEvents) {
				if(reverseEvents[key] === arr) {
					return key;
				}
			}
			return false;
		}

		// Recursively builds a lookup table from programmer-used
		// event name to the callback array. This allows us to view
		// the event being notified / registered / removed when debugging.
		function buildReverse(obj, str) {
			if(obj instanceof Array) {
				reverseEvents[str] = obj;
			} else {
				for(var key in obj) {
					buildReverse(obj[key], str + "." + key);
				}
			}
		}

		buildReverse(game.Events, "Events");

	}

	this.register = function(arr, newCB) {
		if(!(arr instanceof Array) || !(typeof newCB === 'function')) {
			if(DEBUG_FLAG) {
				alert("REGISTERING INVALID CALLBACK");
			}
			return false;
		}
		printDebug("REGISTERING CB FOR: " + lookup(arr))
		arr.push(newCB);
		return true;
	};

	this.remove = function(arr, oldCB) {
		if(!(arr instanceof Array) || !(typeof oldCB === 'function')) {
			if(DEBUG_FLAG) {
				alert("REMOVING INVALID CALLBACK");
			}
			return false;
		}
		printDebug("REMOVING CB FOR: " + lookup(arr))
		var index = arr.indexOf(oldCB);
		if(index > -1) {
			arr.splice(index, 1);
		}
	};

	this.notify = function(arr) {
		if(!(arr instanceof Array)) {
			if(DEBUG_FLAG) {
				alert("NOTIFYING INVALID CALLBACK");
			}
			return false;
		}
		var args = [];
		for(var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		// There's a chance one of the callbacks will modify arr by
		// removing itself or some other callback. Thus, we need to
		// deep copy the array to protect this loop from modification.
		var tempArr = arr.slice();
		printDebug("NOTIFYING CB(s) FOR: " + lookup(arr) + ", with args: " + JSON.stringify(args))
		for(var j = 0; j < tempArr.length; j++) {
			tempArr[j].apply(window, args);
		}
	};

}