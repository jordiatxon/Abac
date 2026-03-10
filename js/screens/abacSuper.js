
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

AbacSuper = function (strMode) {

	// --- VARIABLES GLOBALS ---
	this.strMode = strMode; // (teen / zero / sum / res / mult / div)
	this.blnClear = true; // Comprovem si ja s'ha executat el 'shutdown'
    this.objBoard; // Tauler on arrosseguem els blocs
    this.strBlockImg; // codi de la textura utilitzada per als blocs
    this.tweenManager;
    this.sprCurrentDrag;
    
    // Creem la variable grpUI després del sprBg pq quedi per sobre en l'eix Z
    this.grpUI = new Grup(); //Grup per la UI bàsica del menú
    
    // La variable "intScale" declara quant hem de reescalar les imatges respecte a la amplada/alçada nativa
    //   La amplada nativa és 2048px, i la alçada 1536px
    //   Dividim la amplada i alçada per la nativa, i el valor mes petit serà el nostre valor de reescalt       
    this.intScale = Tools.getScale();


    // Indiquem la textura que ha de agafar per als cubs segons el mode
    //   Tant el 'teen' com qualcevol mode de calculadora fan servir el 'cub' normal
    if (strMode == 'zero') {
        this.strBlockImg = 'zero';
    }
    else {
        this.strBlockImg = 'cub';
    }


    // --- FUNCIONS ---
    // Crea un bloc
    this.createBlock = function(x, y, power, num, blnInputEnabled) {
        //A partir de la potència i la suma dels nùmeros, carreguem el nou objecte
        var newBlock = new SpriteBase(x, y, 'atlasCubs'+this.strBlockImg, power+num, true, blnInputEnabled);
        newBlock.anchor.setTo(0.5, 0.5);

        // Afegeix el bloc al grup al que pertany
        this.objBoard.addSpriteToGroup(newBlock);

        // Retorna el bloc creat
        return newBlock;
    },

    this.createSumBlock = function(x, y, pow, num, blnMove) {

        var newBlock = this.createBlock(x, y, pow, num, (this.strMode == 'teen' || this.strMode == 'zero'));


        // Animació de crear sprite
        newBlock.tweenSize(100);

        // Indiquem si el sprite que s'acaba de crear s'ha de moure
        if (blnMove && (this.strMode == 'teen' || this.strMode == 'zero')) {
            this.sprCurrentDrag = newBlock;
            game.world.bringToTop(this.objBoard.getMyGroup(pow));
        }
    },

    // Ajuntar dos blocs quan coalisionen
    this.sumBlocks = function(sprBlockA, sprBlockB, _X, _Y) {

        var arrReturn = [];
        var blnNextPow = false;

        // Agafem la potència i sumem el numero dels sprites ajuntats
        var intLoad_num = sprBlockA.getValor() + sprBlockB.getValor();
        var strLoad_pow = sprBlockA.getPotencia();

        // Si la potencia es una milena, o si es una desena en el cas del 'zero', no sumarem pas
        if (strLoad_pow === 'M' || (this.strMode === 'zero' && strLoad_pow === 'D')) {
            return;
        }

        // En cas de que li passem els paràmetres _X i _Y posem el sprite a aquesta posició (abacCalc)
        //   _ Si NO li hem passat els paràmetres _X i _Y, creem a la poscició on estem apretant (abacManual)
        var xNewBlock = _X || this.game.input.x;
        var yNewBlock = _Y || this.game.input.y;

        // Agafem el grup corresponent a la potècia que treballem
        var grpCurrent = this.objBoard.getMyGroup(strLoad_pow);
        
        // Posem el curretnDrag a undefined, i destruïm els dos sprites que sumem
        this.sprCurrentDrag = undefined;
        sprBlockA.dispose();
        sprBlockB.dispose();
        var strSound = 'sum';

        // Si la suma es 10, busquem la següent potència i el seu grup, i canviem el num per 1
        if (intLoad_num === 10) {
            // Actualitzem el contador de la potencia actual
            this.objBoard.actualitzarContador(strLoad_pow);

            // Agafem la següent potència
            strLoad_pow = Tools.getNextPotencia(strLoad_pow);
            grpCurrent = this.objBoard.getMyGroup(strLoad_pow);
            intLoad_num = 1;
            strSound = 'sumSup';
        }

        // Si la suma es major a 10, restem 10 i activem la booleana CrearSeguentPotencia
        //   (restem 10 pq serà 1 en la següent potència)
        else if (intLoad_num > 10) {
            blnNextPow = true;
            intLoad_num -= 10;
            strSound = 'sumSup';
        }

        SoundManager.playSound(strSound);
		
        // Creem el sprite de suma corresponent
        var newBlock = this.createSumBlock(xNewBlock, yNewBlock, strLoad_pow, intLoad_num, true);
        arrReturn.push(strLoad_pow);
        //Actualitzem el contador del grup on hem creat el sprite
        this.objBoard.actualitzarContador(strLoad_pow);

        // Si està activat el CrearSeguentPotencia, creem un sprite de la següent potència de valor 1
        if (blnNextPow) {
            var pow = Tools.getNextPotencia(strLoad_pow);

            this.createSumBlock(xNewBlock - (100*this.intScale), yNewBlock - (100*this.intScale), 
                                    pow, 1, false);
            arrReturn.push(pow);
            this.objBoard.actualitzarContador(pow);
         
            if (this.blnSorting) {
                this.blnSumWhileSort = true;
            }
        }
        return arrReturn;
    },

    // Tornar al menú anterior
    this.goBack = function() {
        if (this.strMode == 'teen' || this.strMode == 'zero') {
            if (Tools.getCubeImg() != 'cub') Tools.setCubeImg('cub');
            game.state.start('menu');    
        }
        else {
            game.state.start('calculadora');       
        } 
    },

    this.dispose = function () {
        delete this.strMode;
        delete this.blnClear;
        delete this.intScale;
        delete this.strBlockImg;

        if (this.sprCurrentDrag) {
            this.sprCurrentDrag.dispose();
            delete this.sprCurrentDrag;  
        } 
        
        if (this.tweenManager) {
            this.tweenManager.onComplete.removeAll();
            this.tweenManager.stop();
            this.tweenManager = undefined;
        }

        this.objBoard.dispose();
        delete this.objBoard;

        this.grpUI.dispose();
        delete this.grpUI;
    }
};