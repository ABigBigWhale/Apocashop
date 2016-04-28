var DEBUG_FLAG = true;

function rollDice(chance) {
	return Math.random() <= chance; 
}

function printDebug(message) {
	if(DEBUG_FLAG) {
		console.log(message);
	}
}

function numToStr(num) {
	var numArray = ["zero", "one", "two", "three", "four", "five", 
                    "six", "seven", "eight", "nine", "ten", 
                    "eleven", "twelve", "thirteen", "fourteen", "fifteen", 
                    "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
    
	if(typeof num === 'number' && num < numArray.length) {
		return numArray[num];
	} else {
		return num;
	}
}