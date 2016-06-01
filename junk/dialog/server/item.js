var items = {
	sword : [
		"Looks very sharp.",
		"Ooh, @pointy.",
		"Looks very sword-y."
	],
	bow : [
		"Ooh, @pointy.",
		"Looks scary.",
		"Wouldn't want to be on the receiving end of that.",
		"Never been a very good shot with one of those."
	],
	shield : [
		"Looks expensive.",
		"I wonder if they really are fireproof.",
		"Wish I had one of those yesterday.",
		"Ooh, @shiny."
	],
	water : [
		"Looks very wet.",
		"Ooh,@ water.",
		"Very important.",
		"I've run out of things I can say about water."
	],
	chicken : [
		"Smells good.",
		"Yum yum.",
		"I need food badly."
	],
	default : [
		"Huh?",
		"Why are you showing this to me.",
		"Don't really have an opinion.",
		"What?",
		"Why?",
		"Not sure what you're trying to accomplish here.",
		"Yes, I get it. @You have items."
	]
}

function getItem(item) {
	var itemSayings = items[item];
	if(!itemSayings) {
		itemSayings = items.default;
	}

	var searchSpace = (Math.random() < 0.75) ? items.default : itemSayings;

	var index = Math.floor(Math.random() * searchSpace.length);

	return searchSpace[index];
}

function listItems() {
	return Object.keys(items);
}

module.exports = {
	getItem : getItem,
	listItems : listItems
}