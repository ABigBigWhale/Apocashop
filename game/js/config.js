var SETUP = "DEBUG";

var gameConfig = {
	DEBUG_MODE: true,
	SOUNDENABLED : true,
	MENDOZA : 12,
	EXTRACAP : 7,
	RESOLUTION: [800, 600],
	VERSION : "TESTING",
	ISSCALED : true,
	ISALBINO : false
};

switch(SETUP) {
	case "NEWGROUNDS":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.3-ng";
		gameConfig.ISSCALED = false;
		break;
	case "OMNITHON":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.3-om";
		gameConfig.ISSCALED = false;
		break;
	case "KONGREGATE":
		gameConfig.DEBUG_MODE = false;
		gameConfig.VERSION = "0.3-kg";
		gameConfig.
		break;
}