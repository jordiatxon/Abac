
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

function CustomButton(x, y, atlas, callBack, btnName, strLabel, intFontSize) {
	Phaser.Button.call(this, game, x, y, atlas, callBack, this,
                        btnName + 'Up',  btnName + 'Up',  btnName + 'Down');
    // Apliquem el so del botó per defecte
    this.setDownSound(SoundManager.getSndBtn());

    this.strCoreFrame = btnName;
    var intScale = Tools.getScale();
    this.intFontSize = intFontSize || 45;
    this.tweenManager = undefined;

    this.inputEnabled = true;
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    
    this.scale.setTo(intScale);

}

CustomButton.prototype = Object.create(Phaser.Button.prototype);
CustomButton.prototype.constructor = CustomButton;

// Canvia el alpha tant de la label com del botó
CustomButton.prototype.setAlpha = function(intAlpha) {
    this.alpha = intAlpha;
    if (this.lblButton) this.lblButton.alpha = intAlpha;
},

// Modifica la amplada del botó i reposiciona la label al centre
CustomButton.prototype.setWidth = function(intWidth) {
    this.width = intWidth;
    if (this.lblButton) this.lblButton.x = this.x + this.width/2;
},

// Modifica la alçada del botó i reposiciona la label al centre
CustomButton.prototype.setHeight = function(intHeight) {
    this.height = intHeight;
    if (this.lblButton) this.lblButton.y = this.y + (this.height/2);
},

// Modifica el anchor del botó
CustomButton.prototype.setAnchor = function(xAnc, yAnc) {
    this.anchor.setTo(xAnc, yAnc);

    // Un cop modificat el anchor del botó, reubiquem la label.
    if (this.lblButton) {
        if (xAnc < 0.5) {
           this.lblButton.x = this.x + this.width/2; 
        }
        else if (xAnc > 0.5) {
           this.lblButton.x = this.x - this.width/2; 
        }
         if (yAnc < 0.5) {
           this.lblButton.y = this.y + this.height/2; 
        }
        else if (xAnc > 0.5) {
           this.lblButton.y = this.y - this.height/2; 
        }    
    }
},

// Retorna la posició X màxima
CustomButton.prototype.getMaxX = function() {
    switch (this.anchor.x) {
        case 0:
            return this.x + this.width;
        case 0.5:
            return this.x + (this.width/2);
        case 1:
            return this.x;
    }
},
CustomButton.prototype.getCenterY = function() {
    switch (this.anchor.y) {
        case 0:
            return this.y + (this.height/2);
        case 0.5:
            return this.y;
        case 1:
            return this.y - (this.height/2);
    }
},

// Retorna el contingut de la label
CustomButton.prototype.getText = function() {
    if (this.lblButton) return this.lblButton.text;
    else return;
},

// Animació del alpha del botó i la label
CustomButton.prototype.tweenAlpha = function(intMilisec) {
    // Si no està declarat el tweenManager o si aquest s'està executant, no s'executa la funció
    if (this.tweenManager && this.tweenManager.isRunning) return;

    // Es fan dues animacions iguals, una per el botó i l'altre per la label
    this.tweenManager = game.add.tween(this) 
        .to({alpha: 1},intMilisec,Phaser.Easing.Linear.None,true)
        .start();

    if (this.lblButton) {
        this.tweenManager = game.add.tween(this.lblButton)
        .to({alpha: 1},intMilisec,Phaser.Easing.Linear.None,true)
        .start();
    } 
}, 

// Animació del tamany del botó i la label
CustomButton.prototype.tweenSize = function(intMilisec) {
    // Si no està declarat el tweenManager o si aquest s'està executant, no s'executa la funció
    if (this.tweenManager && this.tweenManager.isRunning) return;
    
    var intX = this.scale.x;
    var intY = this.scale.y;

    // Fem dues animacions (botó i label) incrementant el tamany un 20%
    this.tweenManager = game.add.tween(this.scale) 
        .to({x: intX*1.1, y: intY*1.1},intMilisec,Phaser.Easing.Linear.None,true)
        .start();

    // Quan les animacions de incrementar el tamany han acabat, és fan dués animacions per tornar el botó al seu tamany
    this.tweenManager.onComplete.add(function() {
        this.tweenManager = game.add.tween(this.scale) 
            .to({x: intX, y: intY},intMilisec,Phaser.Easing.Linear.None,true)
            .start();
    }, this);
},

// Habilita o deshabilita el botó
CustomButton.prototype.setEnabled = function(blnEnabled, intMilisec, intAlpha) {
    this.inputEnabled = blnEnabled;

    // Si els milisec no estan declarats, posem un valor per defecte de 100ms
    if (!intMilisec) {
        intMilisec = 100;
    }
    if (intAlpha != 0 && !intAlpha) {
        if (blnEnabled) intAlpha = 1;
        else intAlpha = 0.5;
    }

    if (blnEnabled) {
        this.setFrames(this.strCoreFrame + 'Up', this.strCoreFrame + 'Up', this.strCoreFrame + 'Down', this.strCoreFrame + 'Up');
        this.tweenManager = game.add.tween(this) 
            .to({alpha: 1},intMilisec,Phaser.Easing.Linear.None,true)
            .start();
    }
    else {
        this.setFrames(this.strCoreFrame + 'Up', this.strCoreFrame + 'Up', this.strCoreFrame + 'Up', this.strCoreFrame + 'Up');
        this.tweenManager = game.add.tween(this) 
            .to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true)
            .start();
    }
},

// Per centrar label i botó sense haver de tocar el anchor
CustomButton.prototype.centrar = function() {
    this.x += this.width/2;
    this.y += this.height/2;
},

// Netejem de memòria tots els objectes utilitzats 
CustomButton.prototype.dispose = function () {
    delete this.strCoreFrame;
    delete this.intFontSize;
    
    if (this.tweenManager) {
        this.tweenManager.onComplete.removeAll();
        this.tweenManager.stop();
        this.tweenManager = null;
        delete this.tweenManager;
    }

    if (this.lblButton) {
        this.lblButton.destroy();
        delete this.lblButton;    
    }

    this.destroy();
}