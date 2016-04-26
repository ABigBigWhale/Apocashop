var DEBUG_FLAG = true;

function rollDice(chance) {
	return Math.random() <= chance; 
}

function printDebug(message) {
	if(DEBUG_FLAG) {
		console.log(message);
	}
}