
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

function SoundManager() {};

// -- Inicialitzar --

SoundManager.load = function(){
    this.sndSum = game.add.audio('sum');
    this.sndSumSup = game.add.audio('sumSup');
    this.sndDiv = game.add.audio('div');
    this.sndDivInf = game.add.audio('divInf');
    this.sndMult = game.add.audio('mult');
    this.sndCreate = game.add.audio('create');
    this.sndDel = game.add.audio('del');
    this.sndDelAll = game.add.audio('delAll');
    this.sndBtn = game.add.audio('btn');
    this.sndCalc = game.add.audio('calc_ok');

    //OJUUU que he tret el so per testejar
    //game.sound.mute = true;
},
SoundManager.playSound = function(strSound){
    if (!game.sound.mute){
        switch (strSound) {
            case 'sum':
                this.sndSum.play();
                break;
            case 'sumSup':
                this.sndSumSup.play();
                break;
            case 'div':
                this.sndDiv.play();
                break;
            case 'divInf':
                this.sndDivInf.play();
                break;
            case 'mult':
                this.sndMult.play();
                break;
            case 'create':
                this.sndCreate.play();
                break;
            case 'del':
                this.sndDel.play();
                break;
            case 'delAll':
                this.sndDelAll.play();
                break;
            case 'btn':
                this.sndBtn.play();
                break;
            case 'calc_ok':
                this.sndCalc.play();
                break;
        }    
    }

},
SoundManager.getSndBtn = function(){
    return this.sndBtn;
},
SoundManager.getSndDelAll = function(){
    return this.sndDelAll;
},
SoundManager.setEnableSound = function(){
    game.sound.mute = !game.sound.mute;
},
SoundManager.isMute = function(){
    return game.sound.mute;
}