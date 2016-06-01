var angrys = [
	"Heh, good luck with that.",
	"Seriously?@ No way.",
	"You just lost my business.",
	"There's @no@ way@ I can afford that.",
	"Terrible experience.@@ Zero stars."
]

function generateAngryleave() {
	var index = Math.floor(Math.random() * angrys.length);
	return angrys[index];
}

module.exports = {
	generateAngryleave : generateAngryleave
}