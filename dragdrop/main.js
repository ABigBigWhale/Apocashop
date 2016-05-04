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
var money;

var loadSpace = 30;
var itemSpace = 30;
var itemSize = 50;
var itemDistanceFromSide = 50;
var loadInit = [30, 150];
var itemInit = [300, 150];

function init() {
    game.assetManager = new AssetManager(game);
    game.assetManager.load();
    game.eventManager = new EventManager(game);
    game.eventManager.register(game.Events.UPDATE.STOCKGOLD, updateGold);
    game.eventManager.register(game.Events.UPDATE.ITEMS, updateItems);
    game.playerState = new PlayerState(game);
    game.Stock = new Stock(game);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    game.stage.smoothed = false;
    game.stage.backgroundColor = '#447474';
}

function preload() {
    init();
}

function create() {
    var imgBackground = game.add.image(0, 0, 'gp_stock');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    gold = game.add.text(game.width - 300, 100, "Gold: ");
    gold.fill = 'yellow';
    allBox = createItemSprites(game.playerState.getAvalItems(), game.playerState.getItems());
    //button = game.add.button(700, 500, 'button', actionOnClick, this, 2, 1, 0);
    allLoad = createLoads(game.playerState.getNumSlots());
    initAllItems(allBox);
    initAllLoad(allLoad);
    game.eventManager.notify(game.Events.STOCK.ADD, "sword", 3);
    game.eventManager.notify(game.Events.STOCK.ADD, "bow", 2);
    game.eventManager.notify(game.Events.STOCK.COMMIT);



}

function createLoads(numSlots) {
    var returned = [];
    for (var i = 0; i < numSlots; i++) {
            var uiItemslot = game.add.sprite(20, 40 + 50 * i, 'ui_itemslot');
            uiItemslot.anchor.setTo(0, 0);
            returned.push(uiItemslot);
    }
    return returned;
}
function createItemSprites(avalItems, playerItems) {
    var sprites = {};
    for (var i = 0; i < avalItems.length; i++) {
        // get graphics to load for correct boxes
        var sprite = game.add.sprite(0, 0, "item_" + avalItems[i]);
        sprite.itemType = avalItems[i];
        sprite.num = (playerItems === undefined) ? 0 : playerItems[avalItems[i]] + 0;
        sprites[avalItems[i]] = sprite;
    }
    return sprites;
}

function initAllItems(boxes) {
    var numberMod = Math.floor((game.width - itemDistanceFromSide - itemInit[0])/ (itemSpace + itemSize)); 
    var curr = -1;
    for (var key in boxes) {
        curr++;
        game.physics.arcade.enable(boxes[key]);
        boxes[key].inputEnabled = true;
        boxes[key].scale.setTo(2, 2);
        boxes[key].input.enableDrag();
        boxes[key].events.onDragStop.add(onDragStop, this);
        boxes[key].events.onDragStart.add(onDragStart, this);
        boxes[key].position.x = itemInit[0] + ((curr % numberMod) * (itemSpace + itemSize));
        boxes[key].position.y = itemInit[1] + Math.floor(curr / numberMod) * (itemSpace + itemSize); 
        boxes[key].originalPosition = boxes[key].position.clone();
        boxes[key].price = items[key].price;
    }
}
function initAllLoad(loads) {
    for (var i = 0; i < loads.length; i++) {
    	loads[i].anchor.setTo(0, 0);
    	loads[i].name = loads[i].key + ": " + i;
        loads[i].plus = game.add.sprite(loads[i].position.x + loads[i].width + 10, loads[i].position.y - 2, 'ui_button_add');
        loads[i].plus.scale.setTo(2, 2);
        loads[i].minus = game.add.sprite(loads[i].position.x + loads[i].width + 10, loads[i].position.y + loads[i].height / 2, 'ui_button_sub');
        loads[i].minus.scale.setTo(2, 2);
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


function updateGold(amount) {
    gold.text = "Gold: " + amount;
}

function updateItems(Items) {
    for (var key in Items) {
        // do shallow copy of each item number
        allBox[key].num = Items[key] + 0;
    }
}


function decreaseItem(minus, pointer) {
    if (minus.loader != null && minus.loader.loaded != null) {
        game.eventManager.notify(game.Events.STOCK.REMOVE, minus.loader.loaded.itemType, 1);
        minus.loader.num.text = minus.loader.loaded.num;
    }
}

function increaseItem(plus, pointer) {  
    if (plus.loader != null && plus.loader.loaded != null) {
        game.eventManager.notify(game.Events.STOCK.ADD, plus.loader.loaded.itemType, 1);
        plus.loader.num.text = plus.loader.loaded.num;
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
        sprite.position.x += 4;
        sprite.position.y += 4;
        result = sprite.key + " is on " + loader.name;
        loader.num.text = sprite.num + "";
        loader.loaded = sprite;
    } else {
        sprite.position.copyFrom(sprite.originalPosition);
        game.eventManager.notify(game.Events.STOCK.OUTSTOCK, sprite.itemType);
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