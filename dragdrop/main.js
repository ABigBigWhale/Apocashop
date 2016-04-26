var game = new Phaser.Game(800, 600, Phaser.AUTO, 'drag-drop game', { preload: preload, create: create, render: render });

function preload() {
    game.load.image('red', 'assets/red.png');
    game.load.image('green', 'assets/green.png');
    game.load.image('yellow', 'assets/yellow.png');
    game.load.image('blue', 'assets/blue.png');
    game.load.image('target', 'assets/load.png');
}

var result = 'Drag a sprite';
var allLoad;
var load1;
var load2;
var load3;
var load4;
var allBox;
var green;
var blue;
var yellow;
var red;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    load1	= game.add.sprite(30, 50, 'target');
    load2	= game.add.sprite(30, 150, 'target');
    load3	= game.add.sprite(30, 250, 'target');
    load4	= game.add.sprite(30, 350, 'target');
    green	= game.add.sprite(350, 250, 'green');
    blue	= game.add.sprite(300, 250, 'blue');
    red		= game.add.sprite(300, 200, 'red');
    yellow	= game.add.sprite(350, 200, 'yellow');
    allLoad = [load1, load2, load3, load4];
    allBox = [green, blue, red, yellow];
    init(green);
    init(blue);
    init(red);
    init(yellow);
    initL(load1, 1);
    initL(load2, 2);
    initL(load3, 3);
    initL(load4, 4);
}

function initL(sprite, num) {
	sprite.anchor.setTo(0, 0);
	sprite.name = sprite.key + ": " + num;
	game.physics.arcade.enable(sprite);
}

function init(sonic) {
    game.physics.arcade.enable(sonic);
    sonic.inputEnabled = true;
    sonic.input.enableDrag();
    sonic.events.onDragStop.add(onDragStop, this);
    sonic.events.onDragStart.add(onDragStart, this);
    sonic.originalPosition = sonic.position.clone();
}

function onDragStart(sprite, pointer) {
    result = "Dragging " + sprite.key;
    game.world.bringToTop(sprite);
}

function onDragStop(sprite, pointer) {
	if (!(stopDrag(sprite, load1) && !isFull(load1, sprite)) && 
	    !(stopDrag(sprite, load2) && !isFull(load2, sprite)) &&
	    !(stopDrag(sprite, load3) && !isFull(load3, sprite)) && 
	    !(stopDrag(sprite, load4) && !isFull(load4, sprite))) {
		sprite.position.copyFrom(sprite.originalPosition);	
	}
}

function isFull(load, box) {
	return 	(this.game.physics.arcade.overlap(green, load) && 
			green != box) ||
	       	(this.game.physics.arcade.overlap(red, load) &&
			red != box) ||
		(this.game.physics.arcade.overlap(blue, load) &&
			blue != box) ||
		(this.game.physics.arcade.overlap(yellow, load) &&
			yellow != box);
}

function stopDrag(box, loads) {
	return this.game.physics.arcade.overlap(box, loads, 
			function() {
				box.position.copyFrom(loads.position);
				result = box.key + " is on " + loads.name;
			},
		null, true);
}

function render() {
    game.debug.text(result, 10, 20);
}
