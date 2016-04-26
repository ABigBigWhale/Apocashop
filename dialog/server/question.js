var questions = {
	day : [
		"Um, good?",
		"Not particularly exciting.",
		"None of your business.",
		"Not bad.",
		"Eh.",
		"Meh.",
		"Pretty alright.",
		"What's it to you?",
		"Why do you care?",
		"Boring."
	],
	news : [
		"I don't get out much.",
		"No idea.",
		"Probably some new cataclysm. We seem to get a lot of them.",
		"Dunno.",
		"Your shop opened? That's sort of news.",
		"I'm still alive. News enough for me.",
		"You probably know more than I do."
	],
	color : [
		"Red.",
		"Whatever answer will get you to stop talking to me.",
		"Blue?",
		"Chartreuse. @@@Don't you dare judge me.",
		"8BA870",
		"Purple.",
		"Sky color.",
		"Ground color.",
		"The color of apples.",
		"Goldenrod.",
		"Pewter.",
		"Cerulean.",
		"Fuscia.",
		"Viridian.",
		"Vermillion.",
		"Cinnibar.",
		"Saffron.",
		"Why do you care?"
	],
	number : [
		"Seven.",
		"Six.",
		"Negative one.",
		"Zero.",
		"Pi.",
		"i",
		"Fourty seven.",
		"Ninety three.",
		"Sixty two.",
		"One hundred.",
		"What a strange question.",
		"I guess I've never given that much thought...",
		"What's it to you?"
	],
}

function getAnswer(question) {
	var options = questions[question];
	if(!options) {
		return "ERROR";
	}

	var index = Math.floor(Math.random() * options.length);
	return options[index];
}

function getQuestions() {
	return Object.keys(questions);
}

module.exports = {
	getAnswer : getAnswer,
	getQuestions : getQuestions
};