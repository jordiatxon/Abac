
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

// Classe per mostrar la operació a les pantalles de la calculadora
function Operacio(sign, num1, num2, x, y, intScale) {

    // --- CONSTRUCTOR ---
    
    // El nombre de pixels que desplaçarem per tween en l'eix Y al mostrar i ocultar les labels dels nombres portant
    this.yTweenPortant = 35*intScale;
    this.grpLbls = new Grup();
    this.grpImg = new Grup();

    if (sign == '÷') {
        
        // Label del segon nombre (el de la esquerra)
        this.lblNum2 = game.add.text(x - (20*intScale), y , ' '+num2+' ', 
            { font: '150px vag', fill: '#FFFFFF'});
        this.lblNum2.scale.setTo(intScale);
        this.lblNum2.anchor.setTo(1, 0);
        this.grpLbls.add(this.lblNum2);

        var sprDiv = new SpriteBase(this.lblNum2.x - this.lblNum2.width, y + (15*intScale), 'atlasCalcExtra', 'lineDiv');
        sprDiv.anchor.setTo(0, 0);
        this.grpImg.add(sprDiv);

        // Label del primer nombre (el de la dreta)
        this.lblNum1 = game.add.text(sprDiv.x, y, ' '+num1+' ', 
            { font: '150px vag', fill: '#FFFFFF'});
        this.lblNum1.scale.setTo(intScale);
        this.lblNum1.anchor.setTo(1, 0);
        this.grpLbls.add(this.lblNum1);

        // Label on s'hi afegirà el resultat
        this.lblRes = game.add.text(this.lblNum2.x - this.lblNum2.width, sprDiv.getMaxY(), '', 
            { font: '150px vag', fill: '#FFFFFF'});
        this.lblRes.scale.setTo(intScale);
        this.lblRes.anchor.setTo(0, 0);  
        this.grpLbls.add(this.lblRes);

        this.xLblResta = this.lblNum1.x - (this.lblNum1.width * 0.73);
        this.yLblResta = this.lblNum2.y + (this.lblNum1.height * 0.8);
        
    }
    else {
        // Label del primer nombre (el de dalt)
        this.lblNum1 = game.add.text(x, y, ' '+num1+' ', 
            { font: '160px vag', fill: '#FFFFFF'});
        this.lblNum1.scale.setTo(intScale);
        this.lblNum1.anchor.setTo(1, 0);
        this.grpLbls.add(this.lblNum1);

        // Label del segon nombre (el de baix)
        this.lblNum2 = game.add.text(this.lblNum1.x , this.lblNum1.y + (this.lblNum1.height *0.9) ,' ' + sign + ' '+num2+' ', 
            { font: '160px vag', fill: '#FFFFFF'});
        this.lblNum2.scale.setTo(intScale);
        this.lblNum2.anchor.setTo(1, 0);
        this.grpLbls.add(this.lblNum2);

        var sprLine = new SpriteBase(this.lblNum2.x, this.lblNum2.y+ (this.lblNum2.height*0.9), 'atlasCalcExtra', 'lineBig');
        sprLine.anchor.setTo(1, 0);
        this.grpImg.add(sprLine);

        // Label on s'hi afegirà el resultat
        this.lblRes = game.add.text(this.lblNum2.x, this.lblNum2.y + (this.lblNum2.height)  , '', 
            { font: '170px vag', fill: '#FFFFFF'});
        this.lblRes.scale.setTo(intScale);
        this.lblRes.anchor.setTo(1, 0); 
        this.grpLbls.add(this.lblRes);  

        // Labels "Portant": aquestes labels son numerets petits al damunt de les unitats/desenes/centens,_
        //  _ que es mostren quan al fer una operació hi ha xifres "portant" _
        //  _ Exemple: "45 + 27" es comença fent "5+7=12, són 2 unitats i me'n emporto una"

        
        

        // Label de unitats "portant"
        this.lblPortantUn = game.add.text(sprLine.x - (sprLine.width*0.1) , 
            this.lblNum1.y - (this.lblNum1.height *0.30) + this.yTweenPortant ,'', 
            { font: '60px vag', fill: '#FFFFFF' });
        this.lblPortantUn.scale.setTo(intScale);
        this.lblPortantUn.anchor.setTo(1, 0);
        this.lblPortantUn.alpha = 0; // Les labels "portant" començen ocultes
        this.grpLbls.add(this.lblPortantUn);

        // Label de desenes "portant"
        this.lblPortantDes = game.add.text(sprLine.x - (sprLine.width*0.4) , 
            this.lblPortantUn.y ,'', 
            { font: '60px vag', fill: '#FFFFFF' });
        this.lblPortantDes.scale.setTo(intScale);
        this.lblPortantDes.anchor.setTo(1, 0);
        this.lblPortantDes.alpha = 0; // Les labels "portant" començen ocultes
        this.grpLbls.add(this.lblPortantDes);

        // Label de centenes "portant"
        this.lblPortantCent = game.add.text(sprLine.x - (sprLine.width*0.65) , 
            this.lblPortantDes.y  ,'', 
            { font: '60px vag', fill: '#FFFFFF' });
        this.lblPortantCent.scale.setTo(intScale);
        this.lblPortantCent.anchor.setTo(1, 0);
        this.lblPortantCent.alpha = 0; // Les labels "portant" començen ocultes
        this.grpLbls.add(this.lblPortantCent);

    }

    // --- FI DEL CONSTRUCTOR ---


    // --- FUNCIONS ---

    // Suma el string que se li passa, a la label de resultat (lblRes)
    this.addResult = function(strResult) {

    	var str = parseInt(this.lblRes.text);

        if (str) {
            if (parseInt(strResult) == 0) { 
                strResult = '0' + str;
            }
            else {
                strResult = str + parseInt(strResult);    
            }
        }

        this.tweenSize(120);    
     	this.lblRes.text = ' ' + strResult + ' ';
        if (this.lblRes.text.trim().substring(0,1) == 1) {
            this.lblRes.text = ' '+this.lblRes.text;
        } 

    };
 
    this.concatResult = function(strResult) {
        var str = parseInt(this.lblRes.text);

        if (str) {
            if (parseInt(str) == 0) { 
                strResult = '0' + str;
            }
            else {
                strResult = str + '' + strResult;    
            }
        }

        this.tweenSize(120);    
        this.lblRes.text = ' ' + strResult + ' ';
    };

    this.addRestaDiv = function(strResult) {

        strResult+=''; // Convertim el resultat en string
        var _x = this.xLblResta;

        if (strResult.substring(0,1) == 1 || strResult.substring(1,2) == 1) strResult = ' '+strResult;

        var lblResta = game.add.text(_x, this.yLblResta, strResult+' ', 
            { font: '100px vag', fill: '#FFFFFF'});

        if (strResult.substring(0,1) == '-' || strResult.substring(1,2) == '-') {
            lblResta.x -= (40*Tools.getScale());
        }
		
        lblResta.scale.setTo(intScale);
        lblResta.anchor.setTo(0, 0);
        this.yLblResta += lblResta.height*0.8; 
        this.grpLbls.add(lblResta);  
        this.lblLastAdded = lblResta;
        this.tweenSizeResta(120); 
    };
    
    this.editLastAdded = function(strAdd) {
        
        this.lblLastAdded.text = this.lblLastAdded.text.trim() + (strAdd+' ') ;
        if (this.lblLastAdded.text.trim().substring(0,1) == 1) {
            this.lblLastAdded.text = ' '+this.lblLastAdded.text;
        } 

        this.tweenSizeResta(120); 
    };
    this.addLineResta = function() {
        
        var sprDiv = new SpriteBase(this.xLblResta, this.yLblResta, 'atlasCalcExtra', 'lineSmall');
        sprDiv.anchor.setTo(0, 0);
        this.yLblResta += (10*Tools.getScale());
        this.grpImg.add(sprDiv);
        // var intScale = Tools.getScale();
        // var recuadres = game.add.graphics(0,0);
        // recuadres.lineStyle(5*intScale, 0xDA564D, 1);
        // this.yLblResta += (2*intScale);
        // recuadres.drawRect(this.xLblResta, this.yLblResta, (140*intScale), 2*this.intScale);
        // this.yLblResta += (2*intScale);
    };
    this.getLastPortant = function() {
        return this.lblLastAdded.text;
    },

    // Afegeix el valor que se li passa a la label "portant" de Unitats
    this.addPortantUn = function(strPortant) {
        if (this.lblPortantUn.alpha == 0) {
            this.lblPortantUn.text = strPortant;
            this.tweenAddPortant(this.lblPortantUn);
        }
    };

    // Afegeix el valor que se li passa a la label "portant" de Desenes
    this.addPortantDes = function(strPortant) {
        if (this.lblPortantDes.alpha == 0) {
            this.lblPortantDes.text = strPortant;
            this.tweenAddPortant(this.lblPortantDes);
        }
        else {
            this.lblPortantDes.text = strPortant;
        }
    };

    // Afegeix el valor que se li passa a la label "portant" de Centenes
    this.addPortantCen = function(strPortant) {
        if (this.lblPortantCent.alpha == 0) {
            this.lblPortantCent.text = strPortant;
            this.tweenAddPortant(this.lblPortantCent);
        }
        else {
            this.lblPortantCent.text = strPortant;
        }
    };

    // Tween que mostra una label Portant
    this.tweenAddPortant = function(lblPortant) {
        this.tweenManager = game.add.tween(lblPortant) // Afegir tween
            .to({y: lblPortant.y - this.yTweenPortant}, 200) // Desplaçament del tween
            .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
            .start(); // Començem el tween

        this.tweenManager = game.add.tween(lblPortant) // Afegir tween
            .to({alpha: 1},200,Phaser.Easing.Linear.None,true)
            .start(); // Començem el tween    
    };

    // Borra el contingut de la label portant de Unitats
    this.delPortantUn = function() {
        if (this.lblPortantUn && this.lblPortantUn.alpha == 1) {
            this.tweenClearPortant(this.lblPortantUn)
        }
    },

    // Borra el contingut de la label portant de Desenes
    this.delPortantDes = function() {
        if (this.lblPortantDes && this.lblPortantDes.alpha == 1) {
            this.tweenClearPortant(this.lblPortantDes)
        } 
    };

    // Borra el contingut de la label portant de Centenes
    this.delPortantCen = function() {
        if (this.lblPortantCent && this.lblPortantCent.alpha == 1) {
            this.tweenClearPortant(this.lblPortantCent)
        } 
    };

    // Tween que borra el contingut de una label Portant
    this.tweenClearPortant = function(lblPortant) {
        this.tweenManager = game.add.tween(lblPortant) // Afegir tween
            .to({y: lblPortant.y + this.yTweenPortant}, 300) // Desplaçament del tween
            .start(); // Començem el tween

        this.tweenManager = game.add.tween(lblPortant) // Afegir tween
            .to({alpha: 0},200,Phaser.Easing.Linear.None,true)
            .start(); // Començem el tween

        this.tweenManager.onComplete.add(function() {
            lblPortant.text = '';
        }, this);     
    };

    // Tween per augmentar el tamany i seguidament reduïr el tamany de la label de resultat
    this.tweenSize = function(intMilisec) {
        var intX = this.lblRes.scale.x;
        var intY = this.lblRes.scale.y;

        this.tweenManager = game.add.tween(this.lblRes.scale) 
            .to({x: intX*1.15, y: intY*1.15},intMilisec,Phaser.Easing.Linear.None,true)
            .start();

        this.tweenManager.onComplete.add(function() {
            this.tweenManager = game.add.tween(this.lblRes.scale) 
                .to({x: intX, y: intY},intMilisec,Phaser.Easing.Linear.None,true)
                .start();
        }, this);    
    };

    this.tweenSizeResta = function(intMilisec) {
        this.lblLastAdded.y -= this.yTweenPortant;
        this.lblLastAdded.alpha = 0;

        this.tweenManager = game.add.tween(this.lblLastAdded) // Afegir tween
            .to({y: this.lblLastAdded.y + this.yTweenPortant}, 200) // Desplaçament del tween
            .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
            .start(); // Començem el tween

        this.tweenManager = game.add.tween(this.lblLastAdded) // Afegir tween
            .to({alpha: 1},200,Phaser.Easing.Linear.None,true)
            .start(); // Començem el tween 

        // var intX = this.lblLastAdded.scale.x;
        // var intY = this.lblLastAdded.scale.y;

        // this.tweenManager = game.add.tween(this.lblLastAdded.scale) 
        //     .to({x: intX*1.15, y: intY*1.15},100,Phaser.Easing.Linear.None,true)
        //     .start();

        // this.tweenManager.onComplete.add(function() {
        //     this.tweenManager = game.add.tween(this.lblLastAdded.scale) 
        //         .to({x: intX, y: intY},100,Phaser.Easing.Linear.None,true)
        //         .start();
        // }, this);   
    };

    this.setAlphaTween = function(intMilisec, intAlpha) {
        
        // Apliquem el alpha a les LABELS        
        this.grpLbls.forEach(function(itemUI) {
            this.tweenManager = game.add.tween(itemUI) 
                .to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true)
                .start();
        }, this);

        // Apliquem el alpha a les IMATGES
        this.grpImg.forEach(function(itemUI) {
            this.tweenManager = game.add.tween(itemUI) 
                .to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true)
                .start();
        }, this);

    };

    // Allibera de memòria tots els recursos utilitzats per la classe
    this.dispose = function() {

        // Variables globals
        delete this.yTweenPortant;

        // Labels
        this.lblNum1.destroy();
        this.lblNum2.destroy();
        delete this.lblNum1;
        delete this.lblNum2;
        
        
        this.lblRes.destroy();
        delete this.lblRes;

        // Si existeix la label lblPortantUn, per pilotes existeixen la de desenes i centenes 
        //   (operacions '+', '-', 'x')
        if (this.lblPortantUn) {
            this.lblPortantUn.destroy();
            this.lblPortantDes.destroy();
            this.lblPortantCent.destroy();

            delete this.lblPortantUn;
            delete this.lblPortantDes; 
            delete this.lblPortantCent;          
        }
        // Si no existeix lblPortantUn existeixen les posicions x/y, de la label resta 
        //   (operació ÷)
        else {
            delete this.xLblResta;
            delete this.yLblResta;
        }
       
        // Tween
        if (this.tweenManager) {
            this.tweenManager.onComplete.removeAll();
            this.tweenManager.stop();
            this.tweenManager = null;
        }
    };
}