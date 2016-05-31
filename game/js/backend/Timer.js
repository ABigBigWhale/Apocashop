function Timer(func, delay, pauseCallback, resumeCallback) {

	var self = this;

	var timeoutInfo;
	var remaining = delay;
	var start;

	var isPaused = true;
	var isFinished = false;

	var callbackFunc = function() {
		func();
		isFinished = true;
	}

	this.pause = function(skipCallback) {
		if(isFinished) {
			return;
		}

		if(!isPaused) {
			clearTimeout(timeoutInfo);
			remaining -= (Date.now() - start);
			if(pauseCallback && !skipCallback) pauseCallback();
			printDebug("PAUSING TIMER: " + remaining);
		}

		isPaused = true;
	};

	this.resume = function(skipCallback) {
		if(isFinished) {
			return;
		}

		if(isPaused) {
			start = Date.now();
			clearTimeout(timeoutInfo);
			timeoutInfo = setTimeout(callbackFunc, remaining);
			if(resumeCallback && !skipCallback) resumeCallback();
			printDebug("RESUMING TIMER: " + remaining);
		}

		isPaused = false;
	};

	var fastForwardAmount = 0;
	var fastForwardFrom = 0;

	this.jumpForward = function(amount) {
		self.pause(true);
		if(fastForwardAmount + fastForwardFrom - Date.now() > 0) {
			fastForwardFrom = Date.now() - fastForwardAmount;
			fastForwardAmount += amount;
		} else {
			fastForwardFrom = Date.now();
			fastForwardAmount = amount;
		}
		remaining -= amount;
		self.resume(true);
	};

	this.getPercent = function() {
		if(isFinished) {
			return 0;
		}

		var percentConsidered = (remaining + Math.max(fastForwardAmount + fastForwardFrom - Date.now(), 0)) / delay;
		if(isPaused) {
			return percentConsidered;
		}

		var percentThrough = (remaining + start - Date.now() + Math.max(fastForwardAmount + fastForwardFrom - Date.now(), 0)) / delay;
		return percentThrough;
	};

	this.resume();

}