var profiles = {
	dayOne : [
		"Oh, is that the rhyming guy? /@@Hard to believe he's our hero.",
		"Oh yeah, I love that guy! He's always rhyming and singing.",
		"I hate that guy, with his @@rhymes.",
		"How does he always come up with so many rhymes?"
	],
	dayTwo : [
		"Heh, not the best vocabulary on that one.",
		"How does someone only learn four words?",
		"There's no way they only know four words."
	],
	dayThree : [
		"What an odd one.",
		"He refused to say anything to me. Must be saving up his words for you.",
		"He always manages to find a way to say what he needs to."
	],
	convict : [
		"Looks like a sketchy guy.",
		"They're the reason we all want bows. They're scared just looking at them.",
		"Bleh, do not want."
	],
	scaredMan : [
		"Aww, he looks sad.",
		"He just tried to hide at my house, seemed really scared.",
		"I'm not sure about him."
	],
	tracker : [
		"He's been hunting for someone. Not sure who.",
		"Looks scary."
	],
	dragon : [
		"Don't remind me.",
		"Terrifying.",
		"D@o@ @n@o@t@ @w@a@n@t@.",
		"*Crying sounds*"
	],
	default : [
		"I don't know them",
		"I'm not really sure what you want from me.",
		"Huh?",
		"What?",
		"Eh?",
		"No opinion on that.",
		"Sorry, not sure who that is."
	]	
}

function getProfile(profile) {
	var responses = profiles[profile];
	if(!responses) {
		responses = profiles.default;
	}

	var searchSpace = (Math.random() < 0.75) ? profiles.default : responses;

	var index = Math.floor(Math.random() * searchSpace.length);

	return searchSpace[index];
}

function listProfiles() {
	return Object.keys(profiles);
}

module.exports = {
	getProfile : getProfile,
	listProfiles : listProfiles
}