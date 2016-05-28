var Colors = {

	// Used for non-interactive items such as 
	// dialog boxes
	PassiveLighter: '#ffffca',
	PassiveLight:   '#af9165',
	PassiveMain:    '#4d372c',
	PassiveDark:    '#4d372c',
	PassiveDarker:  '#4d361e',
	PassiveDarkest: '#2e2821',  // Recommended only for shadows

	// Interactive items such as buttons
	ActiveLight:  '#cfcece',
	ActiveMain:   '#acacac',
	ActiveDark:   '#575757',

	AccentAccept: '#92cb9a',
	AccentReject: '#cb929a',

	Background: '#92cb9a',

	SkyDawnPrimary: '#92cb9a',
	SkyDawnSecondary: '#a4dbb6',
};

var DayTimes = {
	dawn: {
		start:	0,
		end:	0.2
	},
	
	noon: {
		start:	0.15,
		end:	0.6
	},
	
	afternoon: {
		start:	0.4,
		end:	0.9
	},
	
	dusk: {
		start:	0.75,
		end:	1.0
	}
};