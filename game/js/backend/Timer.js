function Timer(func, delay) {

	var self = this;

	var timeoutInfo;
	var remaining = delay;
	var start;

	var isPaused = true;

	this.pause = function() {
		clearTimeout(timeoutInfo);
		remaining -= (Date.now() - start);
		printDebug("PAUSING TIMER: " + remaining);

		isPaused = true;
	};

	this.resume = function() {
		if(isPaused) {
			start = Date.now();
			clearTimeout(timeoutInfo);
			timeoutInfo = setTimeout(func, remaining);
			printDebug("RESUMING TIMER: " + remaining);
		}

		isPaused = false;
	};

	this.getPercent = function() {
		var percentConsidered = remaining / delay;
		if(isPaused) {
			return percentConsidered;
		}

		var percentThrough = (remaining + start - Date.now()) / delay;
		return percentThrough;
	};

	this.resume();

}