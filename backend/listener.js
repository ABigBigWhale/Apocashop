game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, offer) {
	document.getElementById('yes').style.display = '';
	document.getElementById('no').style.display = '';
	document.getElementById('continue').style.display = 'none';
	document.getElementById('dialog').innerHTML = ("OFFER: " + offer);
});

game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
	document.getElementById('yes').style.display = 'none';
	document.getElementById('no').style.display = 'none';
	document.getElementById('continue').style.display = '';
	document.getElementById('dialog').innerHTML = ("DIALOG: " + dialog);
});