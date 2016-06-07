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
	// make a bell curve that is based around 0
	// will return numbers -1 to 1 in gaussian probabilities
	var bellFunc = gaussian(0, 0.6);
	var num = (max + min) / 2;
	num += Math.max(Math.min(1, bellFunc()), -1) * ((max - min) / 2); // difference from average is bell curve :D
	return Math.ceil(num);
}

function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       return retval;
   }
}

function printDebug(message) {
	if(gameConfig.DEBUG_MODE) {
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
	var imgdata = bmd.ctx.getImageData(0, 0, w, h);
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

function generateFingerString(num) {
	num = Math.min(num, 8);
	var fingerArray = [];
	for(var i = 0; i < num; i++) {
		var index;
		do {
			index = randomIntInRange(1, 9);
			index = (index > 4) ? index + 1 : index;
		} while(fingerArray[index] || isObscene(fingerArray, index));
		fingerArray[index] = true;
	}

	var fingerString = "";
	for(var i = 0; i < 10; i++) {
		fingerString += (fingerArray[i]) ? "1" : "0";
	}
	return fingerString;
}

function tweenTint(obj, startColor, endColor, time) {    
	// create an object to tween with our step value at 0    
	var colorBlend = {step: 0};    
	// create the tween on this object and tween its step property to 100    
	var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
	// run the interpolateColor function every time the tween updates, feeding it the    
	// updated value of our tween each time, and set the result as our tint    
	colorTween.onUpdateCallback(function() {      
		obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
	});        
	// set the object to the start color straight away    
	obj.tint = startColor;            
	// start the tween    
	colorTween.start();
	printDebug('tweenTint()');
}

function isObscene(fingerArray, newIndex) {
	if(newIndex === 2) {
		return isObsceneHelper(fingerArray.slice(0, 5));
	} else if(newIndex === 7) {
		return isObsceneHelper(fingerArray.slice(5, 10));
	} else {
		return false;
	}
}

function isObsceneHelper(singleHand) {
	for(var i = 1; i < 5; i++) {
		if(singleHand[i]) {
			return false;
		}
	}
	return true;
}

function randomIntInRange(min, max) {
	var range = max-min;
	var rand = Math.random() * range + min;
	return Math.floor(rand);
}

var nullFunc = function() {};

function iddqd(amount) {
	gameConfig.MENDOZA = 0;
	debugGame.eventManager.register(debugGame.Events.DAY.START, function() {
		setTimeout(function() {
			debugGame.dayTimer.jumpForward(90000)
		}, 5000);
	});
	amount = amount || 500;
	debugGame.playerState.addsubGold(amount);
	debugGame.eventManager.notify(debugGame.Events.UPDATE.GOLD, debugGame.playerState.getGold());
	debugGame.dayTimer.jumpForward(90000);
}