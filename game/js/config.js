// DO NOT CHANGE ME OR THE BUILD SCRIPT WILL BREAK
var SETUP = "DEBUG";

var gameConfig = {
	DEBUG_MODE: true,
	SOUNDENABLED : true,
	MENDOZA : 12,
	EXTRACAP : 7,
	RESOLUTION: [800, 600],
	VERSION : "TESTING",
	ISSCALED : true,
	ISALBINO : false,
	ISKONGREGATE : false
};

switch(SETUP) {
	case "NEWGROUNDS":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.6-ng";
		gameConfig.ISSCALED = false;
		break;
	case "OMNITHON":
		gameConfig.DEBUG_MODE = false;
		gameConfig.SOUNDENABLED = false;
		gameConfig.VERSION = "0.6-om";
		break;
	case "KONGREGATE":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.6-kg";
		gameConfig.ISSCALED = false;
		gameConfig.ISKONGREGATE = true;
		break;
	case "ALBINO":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.6-ab";
		gameConfig.ISSCALED = true;
		gameConfig.ISALBINO = true;
		break;
	case "OMGTEST":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "OMGTEST";
		break;
	case "HAO":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "HAO";
		gameConfig.isScaled = true;
		break;
}

if (navigator && (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)))) {
	gameConfig.SOUNDENABLED = false
}