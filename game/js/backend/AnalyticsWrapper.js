function AnalyticsWrapper() {

	var self = this;

	var mappedVals = {};

	this.map = function(key, val, isSend) {
		mappedVals[key] = val;
		if(isSend) {
			self.track(key, val);
		}
	};

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