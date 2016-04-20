var greetings = [
	"Can I get [x] for [y] gold?",
	"Could I get [x] for [y] gold?",
	"How's [y] gold for [x] sound?",
	"Would you part with [x] for [y] gold?",
	"Can I get [x]? [Y] gold.",
	"Need [x]. [Y] gold?"
];

var preGreetings = [
	"Hiya! ",
	"Howdy! ",
	"How's it going?\\",
	"Nice day out!\\"
];

function generateGreeting(item, gold) {
	item = item || "ERROR";
	gold = gold || "ERROR";

	item = addAn(item);
	var index = Math.floor(Math.random() * preGreetings.length);
	var preGreeting = (Math.random() < 0.5) ? preGreetings[index] : "";

	index = Math.floor(Math.random() * greetings.length);
	var greeting = greetings[index];
	var capitalGold = gold.charAt(0).toUpperCase() + gold.slice(1);
	return preGreeting + greeting.replace("[x]", item).replace("[y]", gold).replace("[Y]", capitalGold);
}

function addAn(str) {
	var vowels = ['a', 'e', 'i', 'o', 'u'];
	if(vowels.indexOf(str.charAt(0).toLowerCase()) !== -1) {
		return "an " + str;
	} else {
		return "a " + str;
	}
}

module.exports = {
	generateGreeting : generateGreeting
}