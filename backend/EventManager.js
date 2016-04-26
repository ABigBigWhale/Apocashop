function EventManager(game) {

	game.Events = {
		GAME : {
			START : [],
			END : []
		},
		INPUT : {
			YES : [],
			NO : [],
			QUESTION : {
				OPEN : [],
				ONE : [],
				TWO : []
			}
		}
	}

	this.register = function(arr, newCB) {
		if(!(arr instanceof Array) || !(typeof newCB === 'function')) {
			if(DEBUG_FLAG) {
				alert("REGISTERING INVALID CALLBACK");
			}
			return false;
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
		for(var j = 0; j < arr.length; j++) {
			arr[j].apply(args, window);
		}
	};

}