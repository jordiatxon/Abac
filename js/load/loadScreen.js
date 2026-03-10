
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var loadState = {

	init: function(strLoadScreen) {
        // La pantalla que es carrega (startup, abac teen/zero, calc)
		this.strLoadScreen = strLoadScreen;
	},

	preload: function() {

        

        // Booleana per indicarli al shutdown que ja s'ha fet el clear
        this.blnClear = true;

		// Carreguem els recursos de la pantalla indicada.
		switch (this.strLoadScreen) {
            case 'startup':
                    this.loadAleph();
                	this.loadStartup();
                break;
            case 'menu':
                    this.loadAleph();
                break;
            case 'teen':
                    this.loadAleph();
            		this.loadAbacTeen();
                break;
            case 'zero':
                    this.loadAleph();
            		this.loadAbacZero();
                break;
            case 'calc':
                    this.loadAleph();
            		this.loadCalc();
                break;
        }  
	},

	loadAleph: function() {
        var aleph = game.add.sprite(window.innerWidth/2, window.innerHeight/2, 'alephLoad');
        aleph.scale.setTo(Tools.getScale());
        aleph.anchor.setTo(0.5, 0.5);
        var xAleph = aleph.x - (aleph.width*0.386);
        var yAleph = aleph.y - (aleph.height*0.31);

        var sprLoading = game.add.sprite(xAleph, yAleph, 'loading');
        sprLoading.scale.setTo(Tools.getScale());
        sprLoading.animations.add('anim', [0,1,2,3], 10, true);
        sprLoading.animations.play('anim');
    }, 

    // Recursos necessaris comuns de totes les pantalles de la aplicació
	loadStartup: function() {

        // Atlas per a les icones de PopUp
        game.load.atlasJSONHash('atlasPopUp', 'assets/img/UI/menu/atlasPopUp.png', 'assets/img/UI/menu/atlasPopUp.json');

        // Icones (paperera, mute, back...)
        game.load.atlasJSONHash('atlasIcons', 'assets/img/UI/btn/atlasBotons.png', 'assets/img/UI/btn/atlasBotons.json');
        
        // Botons (botons de la calculadora i menus)
        switch (Tools.getLanguage()) {
            case 'es':
                game.load.atlasJSONHash('atlasMenu', 'assets/img/UI/menu/atlasMenuES.png', 'assets/img/UI/menu/atlasMenuES.json');
                break;
            case 'ca':
                game.load.atlasJSONHash('atlasMenu', 'assets/img/UI/menu/atlasMenuCA.png', 'assets/img/UI/menu/atlasMenuCA.json');
                break;
            default: // en
                game.load.atlasJSONHash('atlasMenu', 'assets/img/UI/menu/atlasMenu.png', 'assets/img/UI/menu/atlasMenu.json');
                break;
        }

        // Imatges de fons del menu
        game.load.atlasJSONHash('atlasMenuBg', 'assets/img/UI/menu/atlasMenuBg.png', 'assets/img/UI/menu/atlasMenuBg.json');

	},

    // Recursos necessaris al Àbac Zero
	loadAbacZero: function() {

        // Atlas contador
        game.load.atlasJSONHash('atlasContZero', 'assets/img/UI/abac/atlasContZero.png', 'assets/img/UI/abac/atlasContZero.json');

        // Atlas cubs
        game.load.atlasJSONHash('atlasCubszero', 'assets/img/cubs/atlasCubsZero.png', 'assets/img/cubs/atlasCubsZero.json');
        game.load.atlasJSONHash('atlasCubsbear', 'assets/img/cubs/atlasCubsBear.png', 'assets/img/cubs/atlasCubsBear.json');
        game.load.atlasJSONHash('atlasCubscar', 'assets/img/cubs/atlasCubsCar.png', 'assets/img/cubs/atlasCubsCar.json');
        game.load.atlasJSONHash('atlasCubsbulb', 'assets/img/cubs/atlasCubsBulb.png', 'assets/img/cubs/atlasCubsBulb.json');

	},

	loadAbacTeen: function() {

        // Atlas contador
        game.load.atlasJSONHash('atlasContJunior', 'assets/img/UI/abac/atlasContJunior.png', 'assets/img/UI/abac/atlasContJunior.json');

        // Atlas cubs
        game.load.atlasJSONHash('atlasCubscub', 'assets/img/cubs/atlasCubsTeen.png', 'assets/img/cubs/atlasCubsTeen.json');

	},

	loadCalc: function() {

        game.load.spritesheet('spriteSheetPause', 'assets/img/UI/btn/spriteSheet_Pause.png', 165, 46, 4);
        
        // Botons de la calculadora (numeros simbols i tal)
        game.load.atlasJSONHash('atlasCalc', 'assets/img/UI/btn/atlasCalc.png', 'assets/img/UI/btn/atlasCalc.json');

        // Botons dins el abacCalc (play/pause, linies i contador mult)
        game.load.atlasJSONHash('atlasCalcExtra', 'assets/img/UI/btn/atlasCalcExtra.png', 'assets/img/UI/btn/atlasCalcExtra.json');

        // Cubs
        game.load.atlasJSONHash('atlasCubscub', 'assets/img/cubs/atlasCubsTeen.png', 'assets/img/cubs/atlasCubsTeen.json');

	},

	create: function() {  
        // Carregar la pantalla (state) indicada.
        switch (this.strLoadScreen) {
            case 'startup':
            case 'menu':
                game.state.start('menu', true);
                break;
            case 'teen':
                game.state.start('abacManual', true, false, 'teen');
                break;
            case 'zero':
                game.state.start('abacManual', true, false, 'zero');
                break;
            case 'calc':
                game.state.start('calculadora', true);
                break;
        }          
	},

	shutdown: function () {
        if (this.blnClear) {
            delete this.blnClear;
            delete this.strLoadScreen;
            this.game.state.clearCurrentState();
        }
    }
}