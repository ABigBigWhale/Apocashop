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
		}
	}

	var reverseEvents;
	var lookup;

	if(DEBUG_FLAG) {

		reverseEvents = {};

		lookup = function(arr) {
			for(var key in reverseEvents) {
				if(reverseEvents[key] === arr) {
					return key;
				}
			}
			return false;
		}

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
		if(DEBUG_FLAG) {
			console.log("Registering callback for: " + lookup(arr));
		}
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
		if(DEBUG_FLAG) {
			console.log("Removing callback for: " + lookup(arr));
		}
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
		if(DEBUG_FLAG) {
			console.log("Notifying callbacks for: " + lookup(arr) + ", with args: " + JSON.stringify(args));
		}
		for(var j = 0; j < arr.length; j++) {
			arr[j].apply(window, args);
		}
	};

}