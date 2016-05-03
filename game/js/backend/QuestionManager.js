/**
 * game: Phaser game object
 * questionLayer: the Phaser group containing question sprites
 */
function QuestionManager(game) {
	
	var optionButtomBound = 400;
	var optionMargin = 75;
	var optionWidth = 200;
	
	var textStyle = {
		font: '20px yoster_islandregular',
		fill: '#4b4b4b',
		wordWrap: true,
		wordWrapWidth: optionWidth,
		align: 'left',
		backgroundColor: '#acacac'
	};

	var self = this;
	
	var questionVisible = false;
	
	var questions = [];
	
	var options = [];
	
	this.populateQuestions = function(q, questionLayer) {
		
		questions = Object.keys(q);
		
		var setUpListeners = function(option, question) {
			option.events.onInputOver.add(function() {
				option.fill = '#d3af7a';
			}, this);
			option.events.onInputOut.add(function() {
				option.fill = '#4b4b4b';
			}, this);
			option.events.onInputDown.add(function() {
				printDebug('QUESTION SELECTED: ' + question);
				game.eventManager.notify(game.Events.INPUT.QUESTION, question);
				self.hideQuestions();
			}, this);
		};
		
		for (var i = 0; i < questions.length; i++) {
			printDebug('QUESTION OPT: ' + questions[i]);
			
			var opt = game.add.text(775, 835, q[questions[i]], textStyle, questionLayer);
			opt.anchor.setTo(1, 1);
			opt.inputEnabled = true;
			options.push(opt);
			
			setUpListeners(options[i], questions[i]);

		}
		
	};
	
	this.toggleQuestions = function() {
		
		questionVisible = !questionVisible;
		printDebug('QUESTIONS TOGGLE: size[' + options.length + ']');
		// Show or hide question options
		if (!questionVisible) {	// Out
			
			for (var i = 0; i < options.length; i++) {
				
				var optTween = game.add.tween(options[i])
					.to( {y: 800}, 500, Phaser.Easing.Quadratic.Out);
				optTween.start();
			}
			
		}  else {	// In
			
			for (var i = 0; i < options.length; i++) {
				
				var yPos = -400 - (i + 1) * optionMargin;
				var optTween = game.add.tween(options[i])
					.to( {y: yPos.toString()}, 500, Phaser.Easing.Quadratic.Out);
				optTween.start();
			}	
		}
		
	};

	this.hideQuestions = function() {
		if(questionVisible) {
			for (var i = 0; i < options.length; i++) {
				
				var optTween = game.add.tween(options[i])
					.to( {y: 800}, 500, Phaser.Easing.Quadratic.Out);
				optTween.start();
			}
		}
		questionVisible = false;
	};
}