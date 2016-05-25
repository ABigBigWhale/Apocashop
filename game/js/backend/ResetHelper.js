function ResetHelper() {

	var resetCallbacks = [];

	this.register = function(cb) {
		resetCallbacks.push(cb);
	};

	this.start = function() {
		for(var i = 0; i < resetCallbacks.length; i++) {
			resetCallbacks[i]();
		}
	};

}