function Timer(func, delay, pauseCallback, resumeCallback) {

	var self = this;

	var timeoutInfo;
	var remaining = delay;
	var start;

	var isPaused = true;

	this.pause = function(skipCallback) {
		if(!isPaused) {
			clearTimeout(timeoutInfo);
			remaining -= (Date.now() - start);
			printDebug("PAUSING TIMER: " + remaining);
		}

		if(pauseCallback && !skipCallback) pauseCallback();
		isPaused = true;
	};

	this.resume = function(skipCallback) {
		if(isPaused) {
			start = Date.now();
			clearTimeout(timeoutInfo);
			timeoutInfo = setTimeout(func, remaining);
			printDebug("RESUMING TIMER: " + remaining);
		}

		if(resumeCallback && !skipCallback) resumeCallback();
		isPaused = false;
	};

	this.jumpForward = function(amount) {
		self.pause(true);
		remaining -= amount;
		self.resume(true);
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