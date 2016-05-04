var DEBUG_FLAG = true;

function rollDice(chance) {
	return Math.random() <= chance; 
}

function randomIntInRange(min, max) {
	var range = max - min;
	return min + Math.floor(Math.random() * range);
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
                    "sixteen", "seventeen", "eighteen", "nineteen"];

    var tensArray = ["zero", "ten", "twenty", "thirty", "fourty", "fifty",
    				 "sixty", "seventy", "eighty", "ninety"];
    
	if(typeof num === 'number') {
		if(num < numArray.length) {
			return numArray[num];
		} else if(num < 100) {
			var tens = tensArray[Math.floor(num / 10)];
			var ones = numArray[num % 10];
			return tens + " " + ones;
		}
	}
		
	return num;
}

function addAn(str) {
	var vowels = ['a', 'e', 'i', 'o', 'u'];
	if(vowels.indexOf(str.charAt(0).toLowerCase()) !== -1) {
		return "an " + str;
	} else {
		return "a " + str;
	}
}