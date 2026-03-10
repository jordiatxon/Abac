
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var preloadState = {

	preload: function() {
        // La pantalla que es carrega (startup, abac teen/zero, calc)
		this.blnClear = true;

		// Carregar imatge de loading
		game.load.image('alephLoad', 'assets/img/aleph/alephLoading.png');
		game.load.spritesheet('loading', 'assets/img/UI/menu/loading.png', 128, 128);

		// Recursos de audio
        game.load.audio('sum', 'assets/snd/blocs/sumB.ogg');
        game.load.audio('sumSup', 'assets/snd/blocs/sumSupA.ogg');
        game.load.audio('div', 'assets/snd/blocs/divA.ogg');
        game.load.audio('divInf', 'assets/snd/blocs/divInfA.ogg');
        game.load.audio('mult', 'assets/snd/blocs/multB.ogg');
        game.load.audio('create', 'assets/snd/blocs/createB.ogg');
        game.load.audio('del', 'assets/snd/blocs/del.ogg');
        game.load.audio('delAll', 'assets/snd/blocs/delAll.ogg');
        game.load.audio('btn', 'assets/snd/btn.wav');
        game.load.audio('calc_ok', 'assets/snd/calc_ok.ogg');
	},

	create: function() {
		
		// Tamany del joc
		game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
		
		// Afegim color de fons
		game.stage.backgroundColor = '#FFFEF9';

		// Mode de reescalat de Phaser, indiquem que ocupi tota la pantalla
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		// limitem el número de "pointers" a 1 (inputs que es poden fer a la pantalla)
		game.input.maxPointers = 1;
		
		// Inicialitzem la classe tools i els sons
		Tools.init(); 
        SoundManager.load();
        
		// Carreguem la pantalla 'menu'
		game.state.start('loadScreen', true, false, 'startup');
	},

    shutdown: function () {
        if (this.blnClear) {
            delete this.blnClear;
            this.game.state.clearCurrentState();
        }
    }
};