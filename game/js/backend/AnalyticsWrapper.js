function AnalyticsWrapper() {

	var self = this;

	var mappedVals = {};

	// Maps a key to be used for a later analytics call. For example,
	// we can map the current day, and then include it in a future call
	// by putting "day" in the mappedKeys array for a track call.
	this.map = function(key, val, isSend) {
		mappedVals[key] = val;
		if(isSend) {
			self.track(key, val);
		}
	};

	// Call this with the event you want to track, the value you
	// want to track with it (just put false if you don't care about
	// the value), and an optional array of mapped keys to include.
	this.track = function(event, val, mappedKeys) {
		var trackedVals = {};
		mappedKeys = mappedKeys || [];
		for(var i = 0; i < mappedKeys.length; i++) {
			trackedVals[mappedKeys[i]] = mappedVals[mappedKeys[i]];
		}
		trackedVals[event] = val;

		// This is the only area we'll need to change based on the
		// analytics framework.
		dummyFramework.track(trackedVals);
	};

}

var dummyFramework = {
	track : function(vals) {
		printDebug("TRACKING: " + JSON.stringify(vals));
	}
};