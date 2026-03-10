
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

game.state.add('preload', preloadState);
game.state.add('loadScreen', loadState);
game.state.add('menu', menuState);
game.state.add('abacManual', abacManualState);
game.state.add('abacCalc', abacCalcState);
game.state.add('calculadora', calculadoraState);


// Iniciem el state boot
game.state.start('preload');