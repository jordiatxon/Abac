
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //


function SpriteBase(intX, intY, strKey, strFrame, blnEnJoc, blnInputEnabled) {
	Phaser.Sprite.call(this, game, intX, intY, strKey, strFrame);

    // Variables Globals
    this.blnEnJoc = blnEnJoc || false; // Indica si el sprite es dels que estem arrossegant a la pantalla de joc.
    this.lastInputX = 0; // Posició X del últim input
    this.lastInputY = 0; // Posició Y del últim input
    this.blnBorrar = false; // Indica si està en estat de "borrar"
    this.strTag; // Variable de text per indicar propietats diverses del sprite
    this.arrNoSumar = []; // Array de els sprites que no s'han de sumar (per que no s'ajuntin en cadena al desmontar un bloc)

    this.scale.setTo(Tools.getScale());
    this.inputEnabled = blnInputEnabled;
    this.tweenManager;
    
    // -- OJU -- això crec que no cal, aqui s'hauria de indicar que si es un bloc agafi _
    //   la potencia i el valor, i si no que no faci res
    if (strFrame) {
        this.chrPotencia = strFrame.substring(0, 1);
        this.intValue = strFrame.substring(1,2);    
    }
    else {
        this.chrPotencia = strKey.substring(0, 1);
        this.intValue = strKey.substring(1,2);        
    }
    
    // Afegim el sprite al "món"
    game.add.existing(this);

    // Si te el inputEnabled i està en joc o el seu valor es 1
    if (blnInputEnabled && (this.blnEnJoc || this.intValue == 1)) {
        // Afegim la funció "setInputPosition" al inputDown
        this.events.onInputDown.add(this.setInputPosition, this);
        this.blnJustPressed = false; // Creem la variable justPressed com a false
        this.blnJustCreated = true;  // Creem la variable justCreated com a true
        this.alpha = 0.5; // Per defecte al crear el sprite de bloc es crea com a transparent
        this.game.time.events.add(50, function() {
            // Passats 0.05 segons posem el blnJustCreated a 'false'
            this.blnJustCreated = false;
            this.alpha = 1;
        }, this);
    }
}

SpriteBase.prototype = Object.create(Phaser.Sprite.prototype);
SpriteBase.prototype.constructor = SpriteBase;

// Posicions X/Y
SpriteBase.prototype.getMinX = function() {
    switch (this.anchor.x) {
        case 0:
            return this.x;
        case 0.5:
            return this.x - (this.width/2);
        case 1:
            return this.x - this.width;
    }
},
SpriteBase.prototype.getCenterX = function() {
    switch (this.anchor.x) {
        case 0:
            return this.x + (this.width/2);
        case 0.5:
            return this.x;
        case 1:
            return this.x - (this.width/2);
    }
},
SpriteBase.prototype.getMaxX = function() {
    switch (this.anchor.x) {
        case 0:
            return this.x + this.width;
        case 0.5:
            return this.x + (this.width/2);
        case 1:
            return this.x;
    }
},
SpriteBase.prototype.getMinY = function() {
    switch (this.anchor.y) {
        case 0:
            return this.y;
        case 0.5:
            return this.y - (this.height/2);
        case 1:
            return this.y - this.height;
    }
},
SpriteBase.prototype.getCenterY = function() {
    switch (this.anchor.y) {
        case 0:
            return this.y + (this.height/2);
        case 0.5:
            return this.y;
        case 1:
            return this.y - (this.height/2);
    }
},
SpriteBase.prototype.getMaxY = function() {
    switch (this.anchor.y) {
        case 0:
            return this.y + this.height;
        case 0.5:
            return this.y + (this.height/2);
        case 1:
            return this.y;
    }
},

// Indicar si el sprite ha entrat en joc (al crearlos des de menú)
SpriteBase.prototype.setEnJoc = function(blnEnJoc) {
    this.blnEnJoc = blnEnJoc;
},
SpriteBase.prototype.getEnJoc = function() {
    return this.blnEnJoc;
},

// Variable auxiliar de text 
SpriteBase.prototype.setTag = function(strTag) {
    this.strTag = strTag;
},
SpriteBase.prototype.getTag = function() {
    if (this.strTag) return this.strTag;
    else return '';
},


// Guarda la posició on s'ha fet un input durant 0.3 segons
SpriteBase.prototype.setInputPosition = function() {
    
    // esperem 5ms a posar la posició, ja que aquesta s'actualitza al clicar sobre el sprite per centrarlo en el input
    this.game.time.events.add(5, function() {
        // guardem la posició on s'ha fet el input
        this.lastInputX = this.x;
        this.lastInputY = this.y;
    }, this);

    this.game.time.events.add(300, function() {
        // Passats 0.3 segons posem el justPressed a 'false'
        this.blnJustPressed = false;
    }, this);
},

// Potència del sprite
SpriteBase.prototype.getPotencia = function() {
    return this.chrPotencia;
},

// Valor del sprite
SpriteBase.prototype.getValor = function() {
    return parseInt(this.intValue);
},

// Tween per fer el "bounce" manual (reescalar a gran i empetitir)
SpriteBase.prototype.tweenSize = function(intMilisec, _intMult) {
    if (!this.tweenManager || !this.tweenManager.isRunning) {
        var intX = this.scale.x;
        var intY = this.scale.y;
        var intMult = _intMult || 1.2;

        this.tweenManager = game.add.tween(this.scale) 
            .to({x: intX*intMult, y: intY*intMult},intMilisec,Phaser.Easing.Linear.None,true)
            .start();

        this.tweenManager.onComplete.add(function() {
            this.tweenManager = game.add.tween(this.scale) 
                .to({x: intX, y: intY},intMilisec,Phaser.Easing.Linear.None,true)
                .start();
        }, this);    
    }
},

// Canvia el alpha i al completar el tween fa un altre tween per tornar al aplha original
SpriteBase.prototype.tweenAlpha = function(intMilisec, intAlpha) {
    // Si no està declarat el tweenManager o si aquest s'està executant, no s'executa la funció
    if (!this.tweenManager || !this.tweenManager.isRunning) {
    
        var a = this.alpha;

        this.tweenManager = game.add.tween(this) 
            .to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true)
            .start();

        this.tweenManager.onComplete.add(function() {
            this.tweenManager = game.add.tween(this) 
                .to({alpha: a},intMilisec,Phaser.Easing.Linear.None,true)
                .start();
        }, this);  
    }
},

// Canvia el alpha sense tornar al alhpa original
SpriteBase.prototype.tweenAlphaFix = function(intMilisec, intAlpha) {
    // Si no està declarat el tweenManager o si aquest s'està executant, no s'executa la funció
    this.tweenManager = game.add.tween(this) 
        .to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true)
        .start();
},


// Animació "zoom in" al crear el sprite
SpriteBase.prototype.tweenSizeCreate = function(intMilisec, blnBounce) {
    var intX = this.scale.x;
    var intY = this.scale.y;
    this.scale.setTo(0);
    if (blnBounce) {
        this.tweenManager = game.add.tween(this.scale) 
            .to({x: intX, y: intY},intMilisec,Phaser.Easing.Linear.None,true)
            .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
            .start();
    }
    else {
        this.tweenManager = game.add.tween(this.scale) 
            .to({x: intX, y: intY},intMilisec,Phaser.Easing.Linear.None,true)
            .start();    
    }
},

// Enable o Disable del sprite
SpriteBase.prototype.setEnabled = function(blnEnabled, intAlpha) {
    this.inputEnabled = blnEnabled;
    if (blnEnabled) {
        this.tweenManager = game.add.tween(this) 
            .to({alpha: 1},100,Phaser.Easing.Linear.None,true)
            .start();
    }
    else {
        if (intAlpha == undefined) intAlpha = 0.5;
        this.tweenManager = game.add.tween(this) 
            .to({alpha: intAlpha},100,Phaser.Easing.Linear.None,true)
            .start();
    }
},

// Funcions per controlar els sprites que no s'han de sumar (per evitar la reacció en cadena dels superposats)
SpriteBase.prototype.addNoSumar = function(idNoSumar) {
    this.arrNoSumar.push(idNoSumar);
},
SpriteBase.prototype.removeNoSumar = function(idNoSumar) {
    var index = this.arrNoSumar.indexOf(idNoSumar);
    if (index > -1) this.arrNoSumar.splice(index, 1);
},
SpriteBase.prototype.getNoSumar = function() {
    return this.arrNoSumar;
},
SpriteBase.prototype.isInNoSumar = function(idNoSumar) {
    var index = this.arrNoSumar.indexOf(idNoSumar);
    return index != -1;
},
SpriteBase.prototype.esPotSumar = function() {
    var blnReturn = true;
    if (!this.input.isDragged) blnReturn = false;

    return (this.input.isDragged && !blnJustCreated);
},

// Per controlar si una variable s'ha de borrar al fer el inputUp (paperera)
SpriteBase.prototype.isBorrar = function() {
    return this.blnBorrar;
},
SpriteBase.prototype.setBorrar = function(bln) {
    this.blnBorrar = bln;
},
SpriteBase.prototype.dispose = function() {
    delete this.blnEnJoc;
    delete this.lastInputX;
    delete this.lastInputY;
    delete this.blnBorrar;
    delete this.chrPotencia;
    delete this.intValue;
    delete this.blnJustPressed;
    delete this.blnJustCreated;
    delete this.strTag;
    
    if (this.arrNoSumar) this.arrNoSumar.length = 0;
    delete this.arrNoSumar;

    if (this.tweenManager) {
        this.tweenManager.onComplete.removeAll();
        this.tweenManager.stop();
        this.tweenManager = null;
    }
    this.destroy();
}