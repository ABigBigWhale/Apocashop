var haggles = [
	"Alright, you got me. [X] gold?",
	"Fine, fine. [X] gold?",
	"Alright, alright. [X] gold?",
	"Please, I only have [x] gold.",
	"[X] gold is the best I can do."
];

function generateHaggle(gold) {
	gold = gold || "ERROR";

	var capitalGold = gold.charAt(0).toUpperCase() + gold.slice(1);
	var index = Math.floor(Math.random() * haggles.length);
	return haggles[index].replace("[x]", gold).replace("[X]", capitalGold);
}

module.exports = {
	generateHaggle : generateHaggle
}