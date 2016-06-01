var generateGreeting = require('./greetings').generateGreeting;
var generateHaggle = require('./haggle').generateHaggle;
var generateThankyou = require('./thankyou').generateThankyou;
var generateAngryleave = require('./angryleave').generateAngryleave;
var hero = require('./hero');
var question = require('./question');
var item = require('./item');
var profile = require('./profile');

function generateNPC(item, price) {

}

function getSpecial(name) {

}

// var npc = {
// 	greeting : ,
// 	success : ,
// 	fail : ,
// 	haggle : ,
// 	questions : {

// 	},
// 	defaultQuestion : ,
// 	items : {

// 	},
// 	defaultItem : ,
// 	profiles : {

// 	},
// 	defaultProfile : 
// }

module.exports = {
	generateNPC : generateNPC,
	getSpecial : getSpecial,
	generateGreeting : generateGreeting,
	generateHaggle : generateHaggle,
	generateThankyou : generateThankyou,
	generateAngryleave : generateAngryleave,
	hero : hero,
	question : question,
	item : item,
	profile : profile
};