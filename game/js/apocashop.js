var gameConfig = {
    DEBUG_MODE: true,
    RESOLUTION: [800, 600]
};

(function() {
    var game = new Phaser.Game(
        gameConfig.RESOLUTION[0], 
        gameConfig.RESOLUTION[1],               // Resolution
        Phaser.AUTO,                            // Rendering context
        'gameDiv',                              // DOM object to insert canvas
        { preload: preload, create: create }    // Function references
    );
    
    if (gameConfig.DEBUG_MODE) window.game = game;

    function preload() {
        
    }
    
    function create() {
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        game.stage.smoothed = false;
        
        game.stage.backgroundColor = '#447474';
        
        
    }
    
})();

