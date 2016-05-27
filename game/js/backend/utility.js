var DEBUG_FLAG = true;

function rollDice(chance) {
	return Math.random() <= chance; 
}

function deepCopy(value) {
	return JSON.parse(JSON.stringify(value));
}

function randomIntInRange(min, max) {
	var range = max - min;
	return Math.floor(min + Math.random() * range);
}

function bellCurveIntInRange(min, max) {
	var index = Math.random() * 100;
	var diff = max - min;
	var number;
	if (index < 3) {
		number = randomIntInRange(min, min + 1);
	} else if (index < 17) {
		number =  randomIntInRange(min + 1, min + 2);
	} else if (index < 75) {
		number = randomIntInRange(max - diff / 2 - 2, max - diff / 2 + 2);		
	} else if (index < 97) {
		number = randomIntInRange(max - 2, max - 1);
	} else {
		number = randomIntInRange(max - 1, max);
	}
	number = Math.min(number, max);
	number = Math.max(number, min);
	return number;
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

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function randomElement(arr, isRemove) {
	var index = Math.floor(Math.random() * arr.length);
	var retVal = arr[index];
	if(isRemove) {
		arr.splice(index, 1);
	}
	return retVal;
}

function numToThStr(num) {
	var numArray = ["zeroeth", "first", "second", "third", "fourth",
				   ];
	return numArray[num];
}

function generateHeroData(story, name) {
	return {
		category : story,
		hero : name,
		fuzz : 0,
		force : true
	}
}

function getOrdinal(n) {
	var s=["th","st","nd","rd"],
		v=n%100;
	return n+(s[(v-20)%10]||s[v]||s[0]);
}

function rgbToHex(r, g, b) {
	return (r << 16) + (g << 8) + b;
}

function generateSkinColor() {
	var color = { r: 255, g: 255, b: 255 };
	var factor = -3 + 6 * Math.random();
	if (Math.random() < 0.5) {
		// Lighter skin color
		color.r = 224.3 + 9.6 * factor;
		color.g = 193.1 + 17.0 * factor;
		color.b = 177.6 + 21.0 * factor;
	} else {
		// Darker skin color
		color.r = 168.8 + 38.5 * factor;
		color.g = 122.5 + 32.1 * factor;
		color.b = 96.7 + 26.3 * factor;
	}
	return color;
}

function bitmapDataReplaceColor(bmd, r, g, b, a, newR, newG, newB, newA, w, h) {
	var imgdata = bmd.ctx.getImageData(0, 0, 60, 70);
	var imgdatalen = imgdata.data.length;
	
	// Iterate over every pixel in the bitmapdata
	for (var i=0; i< imgdatalen/4; i++) {  

		if ( (imgdata.data[4*i] === r) && (imgdata.data[4*i+1] === g) && (imgdata.data[4*i+2] === b )) {

			imgdata.data[4*i] = newR;    // RED (0-255)

			imgdata.data[4*i+1] = newG;    // GREEN (0-255)

			imgdata.data[4*i+2] = newB;    // BLUE (0-255)

			imgdata.data[4*i+3] = newA;  // APLHA (0-255)

		}

	}
	
	bmd.ctx.putImageData(imgdata, 0, 0);
}