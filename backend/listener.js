game.eventManager.register(game.Events.INTERACT.OFFER, function(amount, offer) {
	document.getElementById('dialog').innerHTML = ("OFFER: " + offer);
});

game.eventManager.register(game.Events.INTERACT.DIALOG, function(dialog) {
	document.getElementById('dialog').innerHTML = ("DIALOG: " + dialog);
});