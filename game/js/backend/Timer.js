function Timer(func, delay) {

	var timeoutInfo;
	var remaining = delay;
	var start;

	this.pause = function() {
		clearTimeout(timeoutInfo);
		remaining -= (Date.now() - start);
		printDebug("PAUSING TIMER: " + remaining);
	};

	this.resume = function() {
		start = Date.now();
		clearTimeout(timeoutInfo);
		timeoutInfo = setTimeout(func, remaining);
		printDebug("RESUMING TIMER: " + remaining);
	};

	this.resume();

}