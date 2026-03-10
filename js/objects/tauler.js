
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //


function Tauler(intXContador, intYContador, strContador) {
    
    // --- VARIABLES DEL CONSTRUCTOR ---
    this.maxX = window.innerWidth;
    this.maxY = window.innerHeight;
    this.arrSpritesSeparats = [];

    // Només creem la variable "strContador" si per paràmetre ens ve definida
    if (strContador) this.strContador = strContador;
 
    // Grup on es mouen els sprites (es posa primer perquè quedin sempre a sota del menú)
    this.grpUnitats = new Grup();
    this.grpDesenes = new Grup();
    this.grpCentenes = new Grup();
    this.grpMilenes = new Grup();

    // Inicialitzar contador només si tenim posició X (abac zero i juvenil)
    if (intXContador) {
        this.objContador = new Contador(intXContador, intYContador, this.strContador);    
    }

    // Si el contador es 'countC', significa que es multipliació, per tant, creem la llista que necessita
    if (this.strContador == 'countC') {
        this.createLblsMult();
    }


    // --- FUNCIONS ---

    // -v- Contadors multiplicació -v- 
    this.createLblsMult = function() {
        var intScale = Tools.getScale();

        // Posem el sprCont en una variable (per no anarlo a buscar 3 vegades)
        var sprCont = this.objContador.sprContador;

        // Declarem el separador entre les labels C/D/U del contador
        var intSeparador = sprCont.width*0.28;

        // Declarem les posicions X/Y per les labels del contador
        var xU = sprCont.x - (90*intScale);
        var yU = sprCont.y + (90*intScale);

        var xD = xU - intSeparador;
        var yD = yU;

        var xC = xD - intSeparador;
        var yC = yU;

        // Borrem la variable auxiliar del sprContador, que ja no necessitem
        delete sprCont;

        // Creem tres lliestes (C/D/U) amb dues posicions:
        //   val:   valor al que ha de arribar la quantitat
        //   quant: quantitat de cubs de aquella potència
        this.cntMultU = {val:0, quant:0};
        this.cntMultD = {val:0, quant:0};
        this.cntMultC = {val:0, quant:0};

        // Label per a la UNITAT
        this.lblUnitats = game.add.text(xU, yU,'', { font: '50px vag', fill: '#585858'});
        this.lblUnitats.scale.setTo(intScale);
        this.lblUnitats.anchor.setTo(0.5, 0.5);

        // Label per a la DESENA
        this.lblDesenes = game.add.text(xD, yD,'', { font: '50px vag', fill: '#585858'});
        this.lblDesenes.scale.setTo(intScale);
        this.lblDesenes.anchor.setTo(0.5, 0.5);

        // Label per a la CENTENA
        this.lblCentena = game.add.text(xC, yC,'', { font: '50px vag', fill: '#000000'});
        this.lblCentena.scale.setTo(intScale);
        this.lblCentena.anchor.setTo(0.5, 0.5);
        this.lblCentena.alpha = 0;
    },

    //Inicialitzem els valors de les tres llistes ()
    this.initValues = function(intValue) {
        // Si el intValue es major o igual a 10, vol dir que tenim desenes
        if (intValue >= 10) {
            // Separem desena i unitat
            var arrValue = Tools.separarDesenaUnitat(intValue);

            //Afegim la desena
            this.cntMultD.val = arrValue.desena;
            this.cntMultD.quant = 1;

            // Si tenim unitat, la afegim
            if (arrValue.unitat > 0 ) {
                this.cntMultU.val = arrValue.unitat;
                this.cntMultU.quant = 1;
            }
        }
        else {
            // Si intValue es menor a 10, simplement afegim el valor com a unitat
            this.cntMultU.val = intValue;
            this.cntMultU.quant = 1;
        }

        // Inicialitzem les labels
        this.initLabels();
    },
 
    // Inicialitzar les labels
    this.initLabels = function() {
        // Mostrem el contador de Unitats (si n'hi ha)
        if (this.cntMultU.quant > 0) {
            this.lblUnitats.setText(this.cntMultU.quant + ' x ' + this.cntMultU.val);
        }
        // Mostrem el contador de Desenes (si n'hi ha)
        if (this.cntMultD.quant > 0) {
            this.lblDesenes.setText(this.cntMultD.quant + ' x ' + this.cntMultD.val);
        }
    },

    // Afegir un valor a una label (indicada per la potència)
    this.addValue = function(strPow) {
        switch(strPow) {
            case 'U':
                // Separem el text i el valor de la label de unitats
                var strTextLabel = this.lblUnitats.text;
                var val = strTextLabel.substring(0,1);
                var str = strTextLabel.substring(1);

                // Afegim el text concatenant el valor +1
                
                this.lblUnitats.setText((++val) + str);
                break;
            case 'D':
                // Separem el text i el valor de la label de desenes
                var strTextLabel = this.lblDesenes.text;
                var val = strTextLabel.substring(0,1);
                var str = strTextLabel.substring(1);

                // Afegim el text concatenant el valor +1
                this.lblDesenes.setText((++val) + str);
                break;
        }
    },

    // Quan acaba la multiplicació automàtica, es posen els valors del resultat al contador
    this.setResultMult = function() {
        // Fem un fade out de les labels de unitat i desena que conten els cubs (ex: '4 x 7')
        this.tweenManager = game.add.tween(this.lblUnitats); // Creem el tween
        this.tweenManager.to({alpha: 0},300,Phaser.Easing.Linear.None,true); // Fem el fade-out

        this.tweenManager = game.add.tween(this.lblDesenes); // Creem el tween
        this.tweenManager.to({alpha: 0},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
        
        // Un cop s'ha fet el fade out de les labels que conten els cubs, fem fade-in del resultat
        this.tweenManager.onComplete.add(function() {

            // Borrem el contingut de les labels
            this.lblUnitats.setText('');
            this.lblDesenes.setText('');

            // Agafem el valor de cada grup
            var intTotalUn = this.grpUnitats.getTotalGrup();
            var intTotalDes = this.grpDesenes.getTotalGrup();
            var intTotalCen = this.grpCentenes.getTotalGrup();

            // Omplim les labels de contador amb el valor que correspon a la seva potència
            //   i en fem el fade-in
            // Label UNITATS
            this.lblUnitats.setText(intTotalUn);
            this.lblUnitats.addColor('#585858', 0);
            this.tweenManager = game.add.tween(this.lblUnitats); // Creem el tween
            this.tweenManager.to({alpha: 0.4},300,Phaser.Easing.Linear.None,true); // Fem el fade-out

            // Label DESENES
            this.lblDesenes.setText(intTotalDes); 
            this.lblDesenes.addColor('#585858', 0);   
            this.tweenManager = game.add.tween(this.lblDesenes); // Creem el tween
            this.tweenManager.to({alpha: 0.4},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
            
            // Label CENTENES
            this.lblCentena.setText(this.grpCentenes.getTotalGrup());
            this.lblCentena.addColor('#585858', 0);
            this.tweenManager = game.add.tween(this.lblCentena); // Creem el tween
            this.tweenManager.to({alpha: 0.4},300,Phaser.Easing.Linear.None,true); // Fem el fade-out

        }, this);
    },

    // Posem les labels de color verd per indicar que ja és el valor correcte
    this.countOk = function(strPow) {
        switch(strPow) {
            case 'U':
                // Posem l'espai al final pq de vegades surt el numero mig tallat (fuck phaser)
                this.lblUnitats.setText(this.lblUnitats.text + ' ');
                this.lblUnitats.addColor('#12AF39', 0); // Pintem la label de color verd
                break;
            case 'D':
                this.lblDesenes.setText(this.lblDesenes.text + ' ');
                this.lblDesenes.addColor('#12AF39', 0);
                break;
        }
    },
    // -^- Contadors multiplicació -^- 


    // -- GENERALS --

    // Borrem tots els cubs del tauler amb animació
    this.netejarTaulerTween = function(){

        // Abans de cridar el 'netejar' de cada grup, comprovem que aquell grup tingui blocs
        if (this.grpUnitats.length > 0) this.grpUnitats.netejarGrupTween();
        if (this.grpDesenes.length > 0) this.grpDesenes.netejarGrupTween();
        if (this.grpCentenes.length > 0) this.grpCentenes.netejarGrupTween();
        if (this.grpMilenes.length > 0) this.grpMilenes.netejarGrupTween();

        // passats 0.8s (1ms mes del que dura el tween), actualitzem els contadors
        game.time.events.add(950, function() {
            this.actualitzarTotsContadors();
        }, this);
    },

    // Borrem tots els cubs del tauler sense animació
    this.netejarTauler = function() {
        // Només cridarem al 'netejar' si hi ha algun item al grup
        if (this.grpUnitats.length > 0) this.grpUnitats.netejarGrup();
        if (this.grpDesenes.length > 0) this.grpDesenes.netejarGrup();
        if (this.grpCentenes.length > 0) this.grpCentenes.netejarGrup();
        if (this.grpMilenes.length > 0) this.grpMilenes.netejarGrup();

        // Un cop borrats els cubs, actualitzem el contador
        this.actualitzarTotsContadors();
    },

    // Canviem la textura dels cubs a la textura que l'hi passem (abac zero)
    this.changeIcons = function(strIcon) {

        // Fem un fade-out de tots els grups
        this.enableItemsTween(false, 300, 0);

        // Esperem 0.35 segons per canviar la textura dels cubs
        game.time.events.add(350, function() {

            // Canviem la textura de cada cub de cada grup
            this.grpUnitats.forEachAlive(function(itemObj) {
                itemObj.loadTexture('atlasCubs'+ strIcon, itemObj.frameName);
            }, this);

            this.grpDesenes.forEachAlive(function(itemObj) {
                itemObj.loadTexture('atlasCubs'+ strIcon, itemObj.frameName);
            }, this);

            this.grpCentenes.forEachAlive(function(itemObj) {
                itemObj.loadTexture('atlasCubs'+ strIcon, itemObj.frameName);
            }, this);

            // I fem el fade-in dels cubs
            this.enableItemsTween(true, 300, 1);

        }, this);
    },



    // -- GRUPS --

    // Afegeix un sprite al grup que li correspon
    this.addSpriteToGroup = function(objSprite) {
        switch(objSprite.getPotencia()) {
            case 'U':
                this.grpUnitats.add(objSprite);
                break;
            case 'D':
                this.grpDesenes.add(objSprite);
                break;
            case 'C':
                this.grpCentenes.add(objSprite);
                break;
            case 'M':
                this.grpMilenes.add(objSprite);
                break;
        };
    },

    // Retorna el grup segons la potencia que li passem
    this.getMyGroup = function(strPotencia) {
        switch(strPotencia) {
            case 'U':
                return this.grpUnitats;
                break;
            case 'D':
                return this.grpDesenes;
                break;
            case 'C':
                return this.grpCentenes;
                break;
            case 'M':
                return this.grpMilenes;
                break;
        };
    },

    // Getters dels grups M/C/D/U
    this.getGrpUnitats = function() {
        return this.grpUnitats;
    },
    this.getGrpDesenes = function() {
        return this.grpDesenes;
    },
    this.getGrpCentenes = function() {
        return this.grpCentenes;
    },
    this.getGrpMilenes = function() {
        return this.grpMilenes;
    },

    // Retorna la suma total de un grup (segons potencia)
    this.getTotalGrup = function(strPotencia) {
        switch(strPotencia) {
            case 'U':
                return this.grpUnitats.getTotalGrup();
                break;
            case 'D':
                return this.grpDesenes.getTotalGrup();
                break;
            case 'C':
                return this.grpCentenes.getTotalGrup();
                break;
            case 'M':
                return this.grpMilenes.getTotalGrup();
                break;
        };
    },
    // Retorna la suma total de tots els grups del tauler
    this.getTotalTauler = function() {
        return this.grpUnitats.getTotalGrup() 
                + (this.grpDesenes.getTotalGrup()*10)
                + (this.grpCentenes.getTotalGrup()*100)
                + (this.grpMilenes.getTotalGrup()*1000);
    },

    // Retorna el número total de blocs del tauler
    this.getTotalBlocks = function(){
        return this.grpUnitats.getTotalGrup() 
                + this.grpDesenes.getTotalGrup()
                + this.grpCentenes.getTotalGrup()
                + this.grpMilenes.getTotalGrup();
    },

    // Fa enable/disable dels grups M/C/D/U 
    this.enableItemsTween = function(blnEnable, intMilisec, intAlpha) {
        if (this.grpUnitats.getTotalGrup() > 0) {
            this.grpUnitats.enableItemsTween(blnEnable, intMilisec, intAlpha);
        }
        if (this.grpDesenes.getTotalGrup() > 0) {
            this.grpDesenes.enableItemsTween(blnEnable, intMilisec, intAlpha);
        }
        if (this.grpCentenes.getTotalGrup() > 0) {
            this.grpCentenes.enableItemsTween(blnEnable, intMilisec, intAlpha);
        }
        if (this.grpMilenes.getTotalGrup() > 0) {
            this.grpMilenes.enableItemsTween(blnEnable, intMilisec, intAlpha);
        }
    },  
    this.tweenAlphaContador = function(intMilisec, intAlpha) {
        this.objContador.tweenAlphaContador(intMilisec, intAlpha);
    }

    // -- CONTADOR --

    // Crea el contador del tauler
    this.addContador = function(intXContador, intYContador, strContador){
        this.objContador = new Contador(intXContador, intYContador, strContador);    
        this.createLblsMult();
    },

    // Actualitza el contador de la potència indicada
    this.actualitzarContador = function(strPow){
        if (this.objContador) {
            this.objContador.actualitzarContador(strPow, this.getMyGroup(strPow).getTotalGrup());
        }
    },

    // Actualitza tots els contadors
    this.actualitzarTotsContadors = function() {
        if (this.objContador) {
            this.objContador.actualitzarContador('U', this.grpUnitats.getTotalGrup());
            this.objContador.actualitzarContador('D', this.grpDesenes.getTotalGrup());
            this.objContador.actualitzarContador('C', this.grpCentenes.getTotalGrup());
            this.objContador.actualitzarContador('M', this.grpMilenes.getTotalGrup());
        }
    },

    // Fa apareixer o desapareixer el contador de desenes (Àbac 0)
    this.tweenContDes = function(intAlpha) {
        this.tweenManager = game.add.tween(this.objContador.sprContDes); // Creem el tween
        this.tweenManager.to({alpha: intAlpha},300,Phaser.Easing.Linear.None,true); // Fem el fade-in

        this.tweenManager = game.add.tween(this.objContador.lblContDes); // Creem el tween
        this.tweenManager.to({alpha: intAlpha},300,Phaser.Easing.Linear.None,true); // Fem el fade-in
    },
    this.getSprContador = function() {
        return this.objContador.sprContador;
    },
    this.getSprContDes = function() {
        if (this.objContador.sprContDes) return this.objContador.sprContDes;
        else return;
    },

    // -- SEPARAR SPRITES --
    
    // Comprovem si s'ha de desmontar el bloc (Abac Zero)
    this.checkSplitZero = function(sprBlock) {
        var intScale = Tools.getScale();

        // Agafem la diferència x i y desde el lastInput fins a la posicio actual
        var difX = (Math.max(sprBlock.x, sprBlock.lastInputX) - Math.min(sprBlock.x, sprBlock.lastInputX));
        var difY = (Math.max(sprBlock.y, sprBlock.lastInputY) - Math.min(sprBlock.y, sprBlock.lastInputY));
       
        if (difX < 30*intScale && difY < 30*intScale) {
            return true;
        }
        else {
            return false;
        }
    },

    // Comprovem si s'ha de desmontar el bloc (Abac Junior)
    this.checkSplitTeen = function(sprBlock) {  
        var intScale = Tools.getScale();

        // Agafem la diferència x i y desde el lastInput fins a la posicio actual
        var difX = (Math.max(sprBlock.x, sprBlock.lastInputX) - Math.min(sprBlock.x, sprBlock.lastInputX));
        var difY = (Math.max(sprBlock.y, sprBlock.lastInputY) - Math.min(sprBlock.y, sprBlock.lastInputY));
        
        // Si la diferencia es menor a 30px, desmontem el bloc
        if (difX < 30*intScale && difY < 30*intScale) {
            this.preSepararTots(sprBlock);
        }
    },

    // Decideix a quina funció "separar" s'ha de cridar, i el nº de blocs i posicions entre ells
    this.preSepararTots = function(sprBlock) {

        // Matem el sprite actual i posem el numero i la potencia del sprite actual en variables
        sprBlock.kill();
        var numObjs = parseInt(sprBlock.getValor());
        var potObj = sprBlock.getPotencia();

        // Destruïm el sprite per alliberar de memòria
        sprBlock.dispose();

        var intScale = Tools.getScale();
        switch(potObj) {
            case 'U':
                    if (numObjs > 4) {
                        // Si el numero de sprites en que s'ha de dividir es major de 4, cridem dues vegades a la funció
                        //  dividint entre 2 el numero i arrodonint decimals, per posarlos en dues files horitzontals
                        //      Exemple: 5 es dividirà en una fila de 2 i una de 3
                        this.separarUnitats(Math.floor(numObjs/2), (-70*intScale));
                        this.separarUnitats(Math.round(numObjs/2), (70*intScale));
                    }
                    else {
                        // Si es menor de 4 cridem a la funció, normal.
                        this.separarUnitats(numObjs, 0);
                    }
                break;
            case 'D':
                if (numObjs === 1) {
                    // Si només tenim una desena, la dividim en 10 unitats
                    this.separarUnitats(5, (-70*intScale));
                    this.separarUnitats(5, (70*intScale));
                }
                else {
                    // Si tenim mes de una desena, la desmontem
                    this.separarDesenes(numObjs, 'D', 125 * intScale, 10 * intScale);
                }
                
                break;
            case 'C':
                if (numObjs === 1) {
                    // Si només tenim una centena, la dividim en 10 desenes
                    this.separarDesenes(10, 'D', 125 * intScale, 10 * intScale);
                }
                else if (numObjs > 6) {
                    // Si el numero de sprites en que s'ha de dividir es major de 6, cridem dues vegades a la funció
                    //  dividint entre 2 el numero i arrodonint decimals, per posarlos en dues columnes verticals
                    //      Exemple: 7 es dividirà en una columna de 3 i una de 4
                    this.separarCentenes(Math.floor(numObjs/2), (-300*intScale));
                    this.separarCentenes(Math.round(numObjs/2), (300*intScale));
                }
                else {
                    // Si es menor de 6 cridem a la funció, normal.
                    this.separarCentenes(numObjs, 0);
                }
                break;
            case 'M':
                // La unitat de miler serà sempre només una, aixi que la dividim en dues columnes de centenes
                this.separarCentenes(5, (-300*intScale));
                this.separarCentenes(5, (300*intScale));
                break;
        };
    },

    // Omple el array de posicions al separar UNITATS
    this.separarUnitats = function(numObjs, intMoureY) {
        var intScale = Tools.getScale();

        // Cada iteracio neguem aquesta variable, 
        //  _ per indicar si la posem a esquerra (posició negativa) o dreta (posició positiva)
        var intPos_Neg = 1;
        
        // numObjs Parell
        if (numObjs % 2 == 0) {
            // Si es parell es mou 70 pixels en l'eix X les primeres dues iteracions
            var intMoureX = 70 * intScale;
            for (var i = 1; i <= numObjs; i++) { // Començem el bucle de vomitar sprites en cantitat

                // Anem afegint valors x/y al arrSpritesSeparats
                this.addArrSpritesSeparats([game.input.x + (intMoureX*intPos_Neg), game.input.y + (intMoureY), 'U', 1]);
                
                // Actualitzarem la posició de X cada 2 iteracions
                if (i % 2 == 0) {
                    intMoureX += (140 * intScale);
                }
                //Neguem la variable cada iteració, així, quan no s'actualitza intMoureX, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };
        } 
        // NumObjs Senar
        else {
            // Si es senar el mourem 140 pixels en l'eix X, però el primer el posarem a la posició 
            //  _on hem clickat, per tant el bucle comença a la posició 2
            var intMoureX = 140*intScale;

            // Afegim la primera posició al punt on hem fet el input
            this.addArrSpritesSeparats([game.input.x, game.input.y + (intMoureY), 'U', 1]);

            for (var i = 2; i <= numObjs; i++) {
                // Anem omplint l'array de posicions
                this.addArrSpritesSeparats([game.input.x + (intMoureX*intPos_Neg), game.input.y + (intMoureY), 'U', 1]);

                // Actualitzarem la posició de X cada 2 iteracions
                if (i % 2 != 0) {
                    intMoureX += (140 * intScale);
                }

                //Neguem la variable cada iteració, així, quan no s'actualitza intMoureX, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };    
        }
    },
    
    // Omple el array de posicions al separar DESENES
    this.separarDesenes = function(numObjs, pot, intMoureY, intMoureX) {
        // Cada iteracio neguem aquesta variable, 
        //  _ per indicar si la posem a esquerra (posició negativa) o dreta (posició positiva)
        var intPos_Neg = 1;

        // Guardem els valors de intMoure X/Y, i els utilitzarem com a increment
        var incrementY = intMoureY;
        var incrementX = intMoureX;
        
        // NumObjs Parell
        if (numObjs % 2 === 0) {
            // Si es parell es mou 70 pixels en l'eix X les primeres dues iteracions
            intMoureY = intMoureY/2;

            for (var i = 1; i <= numObjs; i++) { // Començem el bucle de vomitar sprites en cantitat
                // Anem omplint l'array de posicions
                this.addArrSpritesSeparats([game.input.x + (-intMoureX*intPos_Neg), game.input.y + (intMoureY*intPos_Neg), pot, 1]);
                
                // Actualitzarem la posició de Y cada 2 iteracions
                if (i % 2 === 0) {
                    intMoureY += incrementY;
                    
                }
                // La posició X s'incrementa a cada iteració
                intMoureX += incrementX;

                //Neguem la variable cada iteració, aixi, quan no s'actualitza intMoureY, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };
        } 
        // NumObjs Senar
        else {
            // Si es senar el mourem 140 pixels en l'eix X, pero el primer el posarem a la posició on hem clickat
            //  per tant el bucle comença a la posició 2
            this.addArrSpritesSeparats([game.input.x , game.input.y, pot, 1]);

            for (var i = 2; i <= numObjs; i++) {
                // Anem omplint l'array de posicions
                this.addArrSpritesSeparats([game.input.x + (-intMoureX*intPos_Neg), game.input.y + (intMoureY*intPos_Neg), pot, 1]);

                // Actualitzarem la posició de Y cada 2 iteracions
                if (i % 2 != 0) {
                    intMoureY += incrementY;
                }
                // La posició X s'incrementa a cada iteració
                intMoureX += incrementX;

                //Neguem la variable cada iteració, aixi, quan no s'actualitza intMoureY, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };    
        }
    },
    
    // Omple el array de posicions al separar CENTENES
    this.separarCentenes = function(numObjs, intMoureX) {
        var intScale = Tools.getScale();

        // Cada iteració neguem aquesta variable
        var intPos_Neg = 1;

        // NumObjs Parell
        if (numObjs % 2 == 0) {
            // Si es parell es mou 100 pixels en l'eix Y les primeres dues iteracions
            var intMoureY = 100 * intScale;

            for (var i = 1; i <= numObjs; i++) { // Començem el bucle de vomitar sprites en cantitat
                // Anem omplint l'array de posicions
                this.addArrSpritesSeparats([game.input.x + (intMoureX), game.input.y + (intMoureY*intPos_Neg), 'C', 1]);
                
                // Actualitzarem la posició de Y cada 2 iteracions
                if (i % 2 == 0) {
                    intMoureY += (200 * intScale);
                }
                //Neguem la variable cada iteració, així, quan no s'actualitza intMoureX, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };
        } 
        // NumObjs Senar
        else {
            // Si es senar el mourem 140 pixels en l'eix X, pero el primer el posarem a la posició on hem clickat
            //  per tane el bucle comença a la posició 2
            var intMoureY = 200 * intScale;
            //this.crearSprite(game.input.x , game.input.y + (intMoureY), 'U', 1);
            this.addArrSpritesSeparats([game.input.x + (intMoureX) , game.input.y, 'C', 1]);

            for (var i = 2; i <= numObjs; i++) {
                // Anem omplint l'array de posicions
                this.addArrSpritesSeparats([game.input.x + (intMoureX), game.input.y + (intMoureY*intPos_Neg), 'C', 1]);

                // Actualitzarem la posició de Y cada 2 iteracions
                if (i % 2 != 0) {
                    intMoureY += (200 * intScale);
                }

                //Neguem la variable cada iteració, aixi, quan no s'actualitza intMoureX, posem el sprite 
                // a la anterior posició, peró negada, es a dir, si la hem poat a la dreta ara va a la esquerra
                intPos_Neg *= -1;
            };    
        }
    },


    // MÉTODES DEL ARRAY DE POSICIONS DE DESMONTAR SPRITES

    // Omple un array de objectes amb posició 'x', 'y'
    //    x = [0] 
    //    y = [1]
    // S'utilitza per trobar les posicions dels múltiples sprites sprites quan en dividim un.
    this.addArrSpritesSeparats = function(objAdd) {
        // Comprovem si el sprite se surt de la pantalla, i si és així, el reposicionem
        if (objAdd[0] > window.innerWidth) objAdd[0] = window.innerWidth;
        else if (objAdd[0] < 0) objAdd[0] = 0;
        if (objAdd[1] > window.innerHeight) objAdd[1] = window.innerHeight;
        else if (objAdd[1] < 0) objAdd[1] = 0;

        // Afegim la posició al final del array de posicions.
        this.arrSpritesSeparats.push(objAdd);
    },

    // Posa a 0 (alliberar de memoria) el array de sprites separats
    this.resetArrSpritesSeparats = function() {
        this.arrSpritesSeparats.length = 0;
    },

    // Retorna el array de posicions dels blocs sparats
    this.getArrSpritesSeparats = function() {
        return this.arrSpritesSeparats;
    },
    this.dispose = function() {

        // Variables generals
        delete this.maxX;
        delete this.maxY;
        delete this.strContador;

        this.arrSpritesSeparats = 0;
        delete this.arrSpritesSeparats;

        // Grups on s'enmagatzemen els blocs
        this.grpUnitats.dispose();
        this.grpDesenes.dispose();
        this.grpCentenes.dispose();
        this.grpMilenes.dispose();
        delete this.grpUnitats;
        delete this.grpDesenes;
        delete this.grpCentenes;
        delete this.grpMilenes;

        // Contador (menu superior dret)
        if (this.objContador) this.objContador.dispose();

        // Si es el tauler de la calculadora en mode multiplicació, borrem les variables extres
        if (this.strContador == 'countC') {

            this.cntMultU.length = 0;
            this.cntMultD.length = 0;
            this.cntMultC.length = 0;
            delete this.cntMultU;
            delete this.cntMultD;
            delete this.cntMultC;

            this.lblUnitats.destroy();
            this.lblDesenes.destroy();
            this.lblCentena.destroy();
            delete this.lblUnitats;
            delete this.lblDesenes;
            delete this.lblCentena;
        }
        
        // Tween
        if (this.tweenManager) {
            this.tweenManager.onComplete.removeAll();
            this.tweenManager.stop();
            this.tweenManager = null;
        }
    }
}

    // MERDA PER UN TUBU

    // this.showCount = function(strPow) {
    //     switch (strPow) {
    //         case 'U':
    //             var alpha = this.lblUnitats.alpha;
    //             if (alpha == 0) alpha = 1;
    //             else alpha = 0;
    //             this.tweenManager = game.add.tween(this.lblUnitats); // Creem el tween
    //             this.tweenManager.to({alpha: alpha},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
    //             break;
    //         case 'D':
    //             var alpha = this.lblDesenes.alpha;
    //             if (alpha == 0) alpha = 1;
    //             else alpha = 0;
    //             this.tweenManager = game.add.tween(this.lblDesenes); // Creem el tween
    //             this.tweenManager.to({alpha: alpha},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
    //             break;
    //         case 'C':
    //             var alpha = this.lblCentena.alpha;
    //             if (alpha == 0) alpha = 1;
    //             else alpha = 0;
    //             this.tweenManager = game.add.tween(this.lblCentena); // Creem el tween
    //             this.tweenManager.to({alpha: alpha},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
    //             break;
    //     }
    // },

    // Comprova si un sprite està dins el tauler
    // this.isInBounds = function(objSprite) {
    //     return  (objSprite.x > this.x) &&
    //             (objSprite.x < this.maxX) &&
    //             (objSprite.y > this.y) &&
    //             (objSprite.y < this.maxY);
    // },


    // this.reposicionar = function(objSprite){
    //     var intScale = Tools.getScale();
    //     if (objSprite.getMinX() < this.x) objSprite.x = this.x + (objSprite.width/2) + 10*intScale;
    //     if (objSprite.getMaxX() > this.maxX) objSprite.x = this.maxX - (objSprite.width/2) - 10*intScale;
    //     if (objSprite.getMinY() < this.y) objSprite.y = this.y + (objSprite.height/2) + 10*intScale;
    //     if (objSprite.getMaxY() > this.maxY) objSprite.y = this.maxY - (objSprite.height/2) - 10*intScale;
    // },

    
    // this.isLoaded = function() {
    //     var bln = true;
    //     if (this.grpUnitats.length > 0) {
    //         this.grpUnitats.forEachAlive(function(itemObj) {
    //             if (itemObj.alpha < 1) bln = false;
    //         }, this);
    //     }
    //     if (this.grpDesenes.length > 0) {
    //         this.grpDesenes.forEachAlive(function(itemObj) {
    //             if (itemObj.alpha < 1) bln = false;
    //         }, this);
    //     }
    //     return bln;
    // },

    // this.totsJunts = function() {
    //     return (this.grpUnitats.countLiving() <= 1) &&
    //            (this.grpDesenes.countLiving() <= 1) &&
    //            (this.grpCentenes.countLiving() <= 1);
    // },

    // Bloqueja tots els items de tots els grups M/C/D/U
    // this.bloquejar = function() {
    //     this.grpUnitats.forEachAlive(function(itemObj) {
    //         itemObj.inputEnabled = false;
    //     }, this);
    //     this.grpDesenes.forEachAlive(function(itemObj) {
    //         itemObj.inputEnabled = false;
    //     }, this);
    //     this.grpCentenes.forEachAlive(function(itemObj) {
    //         itemObj.inputEnabled = false;
    //     }, this);
    //     this.grpMilenes.forEachAlive(function(itemObj) {
    //         itemObj.inputEnabled = false;
    //     }, this);
    // },

    // this.separarSprites = function(strPow) {   
    //     switch(strPow) {
    //         case 'U':
    //             this.comprovarSeparar(this.grpUnitats);
    //             break;
    //         case 'D':
    //             this.comprovarSeparar(this.grpDesenes);
    //             break;
    //         case 'C':
    //             this.comprovarSeparar(this.grpCentenes);
    //             break;
    //         case 'M':
    //             this.comprovarSeparar(this.grpMilenes);
    //             break;
    //     }
    // },
    // this.comprovarSeparar = function(grpComprovar) {
    //     var intScale = Tools.getScale();
    //     grpComprovar.forEachAlive(function(itemObj) {

    //         if (itemObj.input != undefined && itemObj.input.isDragged) {  

    //             var difX = (Math.max(itemObj.x, itemObj.lastInputX) - Math.min(itemObj.x, itemObj.lastInputX));
    //             var difY = (Math.max(itemObj.y, itemObj.lastInputY) - Math.min(itemObj.y, itemObj.lastInputY));
               
    //             if (difX < 30*intScale && difY < 30*intScale) {
    //                 this.preSepararTots(itemObj);   
    //             }
    //         }
    //     }, this);
    // },