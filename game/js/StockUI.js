function StockUI(game) {
    
    var allLoad;
    var allBox;
    var coinstack;
    var textCoins;
    var uiCoinSlot;
    var endDayButton;
    var imgBackground;
    var ui_group;
    var callback;

    // ---- for item positions -----
    var loadSpace = 30;
    var itemSpace = 30;
    var itemSize = 50;
    var itemDistanceFromSide = 50;
    var loadInit = [30, 150];
    var itemInit = [275, 100];
    // ----------

    function init() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        ui_group = game.add.group();
        imgBackground = game.add.image(0, 0, 'gp_stock');
        uiCoinSlot = game.add.sprite(-110, 505, 'ui_itemslot');
        uiCoinSlot.scale.setTo(2.25, 2.25);
        coinstack = game.add.image(20, 528, 'ui_coinstack');

        ui_group.add(imgBackground); 
        ui_group.add(uiCoinSlot);
        ui_group.add(coinstack);
        

        game.eventManager.register(game.Events.UPDATE.ITEMS, updateItems);
        game.eventManager.register(game.Events.UPDATE.STOCKGOLD, function(gold) {
             textCoins.setText(gold);
        });
        ui_group.visible = false;
    }

    function update() {
        allBox = createItemSprites(game.playerState.getAvalItems(), game.playerState.getItems());
        allLoad = createLoads(game.playerState.getNumSlots());
        initAllLoad(allLoad);
        initAllItems(allBox);
        textCoins = game.add.text(60, 540, "0", // TODO: hardcoded
                                          { font: "30px yoster_islandregular", fill: "#ebc36f"} );
        textCoins.setText(game.playerState.getGold());
        endDayButton = game.add.button(700, 500, 'button', endDay, this, 2, 1, 0);
    }

    function killGroup() {
        for(var key in allBox) {
            allBox[key].itemborder.kill();
            allBox[key].kill();
        }
        for(var i = 0; i < allLoad.length; i++) {
            allLoad[i].minus.kill();
            allLoad[i].plus.kill();
            allLoad[i].num.kill();
            allLoad[i].kill();
        }
        textCoins.kill();
    }

    this.startDay = function(clues, func) {
        update();
        ui_group.visible = true;
        callback = func;
    }

    function endDay() {
        ui_group.visible = false;
        killGroup();
        game.eventManager.notify(game.Events.STOCK.COMMIT);
        callback();
    }

    function coinDrop(offer) {
        var coins = game.add.group();
        for (var i = 0; i < offer; i ++) {
            coins.create(20 + Math.random() * 50, 450 + Math.random() * 30, 'ui_coin');
        }
        var coidDropTweenPos = game.add.tween(coins.position).to( {y: coins.y + 100}, 800, Phaser.Easing.Quadratic.Out);
        var coidDropTweenAlp = game.add.tween(coins.alpha).to( {alpha: 0.5}, 500);
        coidDropTweenAlp.onComplete.add(function() {
            coins.destroy();
        });

        coidDropTweenPos.start();
        coidDropTweenAlp.start();
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
            sprite.num = (playerItems[avalItems[i]] === undefined) ? 0 : playerItems[avalItems[i]] + 0;
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
            boxes[key].itemborder = game.add.image(boxes[key].position.x - 6, boxes[key].position.y - 6, 
                                                    'ui_button_item_border');
            boxes[key].itemborder.scale.setTo(2, 2);
            game.world.bringToTop(boxes[key].itemborder);
            boxes[key].originalPosition = boxes[key].position.clone();
            boxes[key].price = items[key].price;
        }
    }
    function initAllLoad(loads) {
        for (var i = 0; i < loads.length; i++) {
            loads[i].anchor.setTo(0, 0);
            loads[i].name = loads[i].key + ": " + i;
            loads[i].plus = game.add.button(loads[i].position.x + loads[i].width + 10, loads[i].position.y - 2, 'ui_button_add', increaseItem, this, 1, 0, 2);
            loads[i].plus.scale.setTo(2, 2);
            ui_group.add(loads[i].plus);
            loads[i].minus = game.add.button(loads[i].position.x + loads[i].width + 10, loads[i].position.y + loads[i].height / 2, 'ui_button_sub', decreaseItem, this, 1, 0, 2);
            loads[i].minus.scale.setTo(2, 2);
            ui_group.add(loads[i].minus);
            loads[i].plus.loader = loads[i];
            loads[i].minus.loader = loads[i];
            loads[i].num = game.add.text(loads[i].position.x + loads[i].width / 2, loads[i].position.y + 8, 'X',
                                         { font: "20px yoster_islandregular", fill: '#d3af7a' });
            ui_group.add(loads[i].num);
            loads[i].loaded = null;
            game.physics.arcade.enable(loads[i]);
        }
    }

    function updateItems(Items) {
        for (var key in Items) {
            // do shallow copy of each item number
            allBox[key].num = Items[key] + 0;
        }
    }


    function decreaseItem(minus, pointer) {
        if (minus.loader != null && minus.loader.loaded != null) {
            var currCount = minus.loader.loaded.num;
            game.eventManager.notify(game.Events.STOCK.REMOVE, minus.loader.loaded.itemType, 1);
            minus.loader.num.text = minus.loader.loaded.num;
            if (currCount != minus.loader.loaded.num)
                coinDrop(1);
        }
    }

    function increaseItem(plus, pointer) {  
        if (plus.loader != null && plus.loader.loaded != null) {
            game.eventManager.notify(game.Events.STOCK.ADD, plus.loader.loaded.itemType, 1);
            plus.loader.num.text = plus.loader.loaded.num;
        }
    }

    function onDragStart(sprite, pointer) {
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
            loader.num.text = sprite.num + "";
            loader.loaded = sprite;
        } else {
            sprite.position.copyFrom(sprite.originalPosition);
            game.world.bringToTop(sprite.itemborder);
            coinDrop(sprite.num - (game.playerState.getItems()[sprite.itemType] || 0));
            game.eventManager.notify(game.Events.STOCK.OUTSTOCK, sprite.itemType);
            coinDrop()
        }
    }

    function findCollision(sprite, all) {
        for (var i = 0; i < all.length; i++) {
            if (game.physics.arcade.overlap(sprite, all[i])) {
                return all[i];
            }
        }
        return undefined;
    }    
    init();
}
