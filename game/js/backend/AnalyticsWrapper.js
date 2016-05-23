function AnalyticsWrapper() {

	// Change this whenever we want to start collecting
	// to a new data set
	var VERSION_NUM = 'TESTING';

	// The value argument isn't required, you can just
	// not include it if it doesn't really apply.

	// EXAMPLES:
	// category : day, buttons, interactions, timer
	// action : begin, question, accept, haggle
	// value : 7

	// EXAMPLE CALLS:
	// track('day', 'begin', 2)
	// track('interactions', 'haggle', 7)
	// track('buttons', 'question')
	this.track = function(category, action, value) {

		printDebug("Tracking: " + category + ", " + action + ", " + value);

		// This is the only area we'll need to change based on the
		// analytics framework.
		ga('send', {
			hitType : 'event',
			eventCategory : category,
			eventAction : action,
			eventLabel : VERSION_NUM,
			eventValue : value
		});
	};

	this.set = function(metric, val) {
		printDebug("Tracking dimension: " + metric + ", " + val);
		ga('set', metric, val);
		ga('send', 'pageview');
	};

	function makeID() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ ) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return text;
	}

	this.set("dimension2", makeID());

}
