var game = new Phaser.Game(800, 600, Phaser.AUTO, 'npcgen', { preload: preload, create: create });

const heroAssets = [
	['body', 3], ['eye', 5], ['face', 3], ['hair', 4], 
	['mouth', 6], ['nose', 5]
];
	
function preload() {
	game.load.image('background-forrest', 'assets/forrest_bg.png');
	game.load.image('button-hero', 'assets/button_hero.png');
	game.load.image('hero-background', 'assets/hero_bg.png');
	
	loadHeroAssets();
}

var background;
var heroBackground;
var button;

var heroBmd;
var hero;

function create() {
	game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);	
	game.stage.smoothed = false;
	
	game.stage.backgroundColor = '#447474';
	
	background = game.add.tileSprite(0, 0, 800, 600, 'background-forrest');
	
	button = game.add.button(game.world.centerX + 200, 500, 'button-hero', buttonOnClick, this);
	button.anchor.setTo(0.5, 0.5);
	button.smoothed = false;
	button.scale.setTo(8, 8);
	
	heroBackground = game.add.image(10, 300, 'hero-background');
	button.smoothed = false;
	heroBackground.scale.setTo(6, 6);
	
}

function loadHeroAssets() {
	heroAssets.forEach(function(elem, i, arr) {
		console.log(elem[0] + " " + elem[1] + '\n');
		for (j = 1; j <= elem[1]; j++) {
			game.load.image('hero-' + elem[0] + '-' + j, 
					   'assets/' + elem[0] + '/' + j + ".png");
		}
	});
}

function buttonOnClick() {
	if (hero) hero.kill();
	
	hero = game.add.sprite(40, 340, drawRandomHero());
	hero.scale.setTo(3, 3);
}

function drawRandomHero() {
	var heroBmd = game.add.bitmapData(40, 60);
	
	heroAssets.forEach(function(elem, i, arr) {
		heroBmd.draw('hero-' + elem[0] + '-' + game.rnd.integerInRange(1, elem[1]));
	});
	
	return heroBmd;
}
