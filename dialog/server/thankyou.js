var thanks = [
	"Pleasure doing business.",
	"Thanks! I needed this.",
	"Thanks a bunch, friend.",
	"Thank you!",
	"Thanks, see ya!",
	"Thanks."	
]

function generateThankyou() {
	var index = Math.floor(Math.random() * thanks.length);
	return thanks[index];
}

module.exports = {
	generateThankyou : generateThankyou
}