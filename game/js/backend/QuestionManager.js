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
		fill: '0x000000',
		//wordWrap: true,
		//wordWrapWidth: optionWidth,
		align: 'left',
		//backgroundColor: '#acacac'
	};

	var self = this;
	
	var questionVisible = false;
	
	var questionBox;
	var questions = [];
	
	var options = [];

	var dialogDraw;
	var start = false;
	game.eventManager.register(game.Events.DAY.END, removeCurrentQuestions);

	function removeCurrentQuestions() {
		for(var i = 0; i < options.length; i++) {
			options[i].visible = false;
			options[i].textbox.visible = false;
			options[i].kill();
		}
		options = [];
	}

	this.populateQuestions = function(q, questionLayer) {
		questions = Object.keys(q);
		
		var setUpListeners = function(option, question) {
			option.events.onInputOver.add(function() {
				option.fill = '#d3af7a';
			}, this);
			option.events.onInputOut.add(function() {
				option.fill = '#000000';
			}, this);
			option.events.onInputDown.add(function() {
				printDebug('QUESTION SELECTED: ' + question);
				game.eventManager.notify(game.Events.INPUT.QUESTION, question);
				self.hideQuestions();
			}, this);
		};
		for (var i = 0; i < questions.length; i++) {
			printDebug('QUESTION OPT: ' + questions[i]);
			var opt = game.add.text(775, 835, " " + q[questions[i]] + " ", textStyle, questionLayer);
			opt.anchor.setTo(1, 1);
			opt.inputEnabled = true;
			options.push(opt);
			setUpListeners(options[i], questions[i]);
			opt.textbox = generateTextbox(opt);
		}
		var optionGroup = game.add.group();
		for(var i = 0; i < options.length; i++) {
			optionGroup.add(options[i]);		
		}
		game.depthGroups.questionGroup.add(optionGroup);
	};
	
	function generateTextbox(sprite) {
		var totalSpots = Math.ceil((20 + sprite.width) / 19); // find the number of slots we need to generate
		var textBox = game.add.group();
		game.depthGroups.questionGroup.add(textBox);
		var right = game.add.sprite(sprite.x, sprite.y, 'right_textbox');
		var left = game.add.sprite(sprite.x - totalSpots * 19, sprite.y, 'left_textbox');
		textBox.add(left);
		for (var i = 1; i < totalSpots; i++) {
			var middle = game.add.sprite(sprite.x - i * 19, sprite.y, 'middle_textbox');
			textBox.add(middle);
		}
		textBox.add(right);
		return textBox;
	}

	this.toggleQuestions = function() {
		
		questionVisible = !questionVisible;
		printDebug('QUESTIONS TOGGLE: size[' + options.length + ']');
		// Show or hide question options
		if (!questionVisible) {	// Out
			
			for (var i = 0; i < options.length; i++) {
				options[i].textbox.forEach(function(sprite) {	
					var textBoxTween = game.add.tween(sprite)
						.to( {y: 835}, 200, Phaser.Easing.Quadratic.Out);
					textBoxTween.start();
				});
				var optTween = game.add.tween(options[i])
					.to( {y: 835}, 200, Phaser.Easing.Quadratic.Out);
				optTween.start();
			}
			
		}  else {	// In
			
			for (var i = 0; i < options.length; i++) {
				
				var yPos = -400 - (i + 1) * optionMargin;
				options[i].textbox.forEach(function(sprite) {
					var textBoxTween = game.add.tween(sprite)
						.to( {y: (yPos - 35).toString()}, 200, Phaser.Easing.Quadratic.Out);
					textBoxTween.start();
				});
				var optTween = game.add.tween(options[i])
					.to( {y: yPos.toString()}, 200, Phaser.Easing.Quadratic.Out);
				optTween.start();
			}	
		}
		
	};

	this.hideQuestions = function() {
		if(questionVisible) {
			for (var i = 0; i < options.length; i++) {
				
				var optTween = game.add.tween(options[i])
					.to( {y: 835}, 200, Phaser.Easing.Quadratic.Out);
				optTween.start();
				options[i].textbox.forEach(function(sprite) {	
					var textBoxTween = game.add.tween(sprite)
						.to( {y: 835}, 200, Phaser.Easing.Quadratic.Out);
					textBoxTween.start();
				});
			}
		}
		questionVisible = false;
	};
}