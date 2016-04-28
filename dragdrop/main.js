var game = new Phaser.Game(800, 600, Phaser.AUTO, 'drag-drop game', { preload: preload, create: create, render: render });

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
var button;

var loadSpace = 30;
var itemSpace = 30;
var itemSize = 50;
var itemDistanceFromSide = 100;
var loadInit = [30, 150];
var itemInit = [300, 150];

function preload() {
    game.load.image('red', 'assets/red.png');
    game.load.image('green', 'assets/green.png');
    game.load.image('yellow', 'assets/yellow.png');
    game.load.image('blue', 'assets/blue.png'); // 50 x 50
    game.load.image('target', 'assets/load.png');
    game.load.image('plus', 'assets/plus.png'); // 25 x 25
    game.load.image('minus', 'assets/minus.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    load1	= game.add.sprite(30, 50, 'target');
    load2	= game.add.sprite(30, 150, 'target');
    load3	= game.add.sprite(30, 250, 'target');
    load4	= game.add.sprite(30, 350, 'target');
    allLoad = [load1, load2, load3, load4];
    //TODO: callget all items in global item Manager
    green	= game.add.sprite(350, 250, 'green');
    blue	= game.add.sprite(300, 250, 'blue');
    red		= game.add.sprite(300, 200, 'red');
    yellow	= game.add.sprite(350, 200, 'yellow');
    allBox = [green, blue, red, yellow]; 

    //button = game.add.button(700, 500, 'button', actionOnClick, this, 2, 1, 0);

    initAllItems(allBox);
    initAllLoad(allLoad);
}

function initAllItems(boxes) {
    var numberMod = Math.floor((game.width - 2 * itemDistanceFromSide)/ (itemSpace + itemSize)); 
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].num = 0;
        game.physics.arcade.enable(boxes[i]);
        boxes[i].inputEnabled = true;
        boxes[i].input.enableDrag();
        boxes[i].events.onDragStop.add(onDragStop, this);
        boxes[i].events.onDragStart.add(onDragStart, this);
        boxes[i].position.x = itemInit[0] + ((i % numberMod) * (itemSpace + itemSize));
        boxes[i].position.y = itemInit[1] + Math.floor(i / numberMod); 
        boxes[i].originalPosition = boxes[i].position.clone();
    }
}
function initAllLoad(loads) {
    for (var i = 0; i < loads.length; i++) {
    	loads[i].anchor.setTo(0, 0);
    	loads[i].name = loads[i].key + ": " + i;
        loads[i].position.x = loadInit[0];
        loads[i].position.y = loadInit[1] + ((loadSpace + itemSize) * i);
        loads[i].plus = game.add.sprite(loads[i].position.x + loadSpace + itemSize, loads[i].position.y, 'plus');
        loads[i].minus = game.add.sprite(loads[i].position.x + loadSpace + itemSize, loads[i].position.y + itemSize / 2, 'minus');
        loads[i].plus.inputEnabled = true;
        loads[i].plus.loader = loads[i];
        loads[i].minus.inputEnabled = true;
        loads[i].minus.loader = loads[i];
        loads[i].plus.events.onInputDown.add(increaseItem, this);
        loads[i].minus.events.onInputDown.add(decreaseItem, this);
        loads[i].num = game.add.text(loads[i].position.x + loadSpace + (itemSize / 2), loads[i].position.y, "X");
        loads[i].num.fill = 'red';
        loads[i].loaded = null;
    	game.physics.arcade.enable(loads[i]);
    }
}

function decreaseItem(minus, pointer) {
    if (minus.loader != null && minus.loader.loaded != null && minus.loader.loaded.num > 0) {
        minus.loader.loaded.num = minus.loader.loaded.num - 1;
        minus.loader.num.text = minus.loader.loaded.num + "";
    }
}

function increaseItem(plus, pointer) {  
    if (plus.loader != null && plus.loader.loaded != null) {
        plus.loader.loaded.num = plus.loader.loaded.num + 1;
        plus.loader.num.text = plus.loader.loaded.num + "";
    }
}

function onDragStart(sprite, pointer) {
    result = "Dragging " + sprite.key;
    game.world.bringToTop(sprite);
    for (var i = 0; i < allLoad.length; i++) {
        if (game.physics.arcade.overlap(sprite, allLoad[i])) {
            allLoad[i].num.text = 'X';
            allLoad[i].loaded = null;
        }
    }
}

function onDragStop(sprite, pointer) {
    var loader = findCollision(sprite, allLoad);
    if (loader != undefined && !(loader.loaded === undefined) && loader.loaded == null) {
        sprite.position.copyFrom(loader.position);
        result = sprite.key + " is on " + loader.name;
        loader.num.text = sprite.num + "";
        loader.loaded = sprite;
    } else {
        sprite.position.copyFrom(sprite.originalPosition);
        sprite.num = 0;
    }
}

function findCollision(sprite, all) {
    for (var i = 0; i < all.length; i++) {
        if (this.game.physics.arcade.overlap(sprite, all[i])) {
            return all[i];
        }
    }
    return undefined;
}

function render() {
    game.debug.text(result, 10, 20);
}