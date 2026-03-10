
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var abacCalcState = {

// -- CREATE -- 
	init: function(strMode, num1, num2) {
		AbacSuper.call(this, strMode);
        // Els dos digits de la operació en cas que sigui claculadora
        this.intCalc1 = num1;
        this.intCalc2 = num2;
	},

	create: function() {
        
        this.colorMenu = 0x52BAD3; // Color del recuadre de la operació i les linies divisòries
        this.colorBack = 0xFFFEF9; // Color blanc de fons
        this.blnPaused = false; // Indica si està pausat el autoResoldre
        this.blnOperant = false; // Indica si esta a mig fer una animació
        this.blnJustInput = false; // per controlar el pause
        this.intRetard = 1000; // El interval de temps entre cada pas
        this.intMarge = 20*this.intScale;
        this.blnResolt = false;    
        
        // EL recuadre blau fosc on es resol la operació
        var recResoldre = game.add.graphics(0,0);
        recResoldre.beginFill(this.colorMenu);
        recResoldre.drawRect(window.innerWidth*0.01, 
                             window.innerHeight*0.15, 
                             window.innerWidth*0.33, 
                             window.innerHeight*0.4);

        var intYbtns = 45*this.intScale;
        // Botó per tornar al main menú
        var btnExit = new CustomButton(0, intYbtns, 'atlasIcons', null, 'btnBack');
        btnExit.anchor.setTo(0,0);
        btnExit.events.onInputUp.add(function() {
                                              this.goBack();
                                            }, this);

        // Icones pause i play
        // this.sprPause = new SpriteBase(window.innerWidth *0.5, window.innerHeight *0.5, 'atlasCalcExtra', 'bgPauseCenter');
        // this.sprPause.anchor.setTo(0.5, 0.5);
        // this.sprPause.alpha = 0;

        // this.sprPlay = new SpriteBase(window.innerWidth *0.5, window.innerHeight *0.5, 'atlasCalcExtra', 'bgPlayCenter');
        // this.sprPlay.anchor.setTo(0.5, 0.5);
        // this.sprPlay.alpha = 0;

        var xBtns = window.innerWidth*0.175;

        this.btnPause = new CustomButton(xBtns, intYbtns, 'atlasCalcExtra', null, 'btnPause');
        this.btnPause.anchor.setTo(0.5, 0);
        this.btnPause.events.onInputUp.add(function() {
                                              this.btnPauseClick();
                                            }, this);
        this.btnPause.alpha = 0.5;
        this.btnPause.setEnabled(false);

        this.btnPlay = new CustomButton(xBtns, intYbtns, 'atlasCalcExtra', null, 'btnPlay');
        this.btnPlay.anchor.setTo(0.5, 0);        
        this.btnPlay.alpha = 0;
        this.btnPlay.events.onInputUp.add(function() {
                                              this.btnPauseClick();
                                            }, this);
        this.btnPlay.setEnabled(false, 100, 0);

        this.sprLoadingPause = game.add.sprite(xBtns, this.btnPause.getCenterY(), 'spriteSheetPause');
        this.sprLoadingPause.anchor.setTo(0.5, 0.5); 
        this.sprLoadingPause.scale.setTo(this.intScale);
        this.sprLoadingPause.alpha = 0;

        this.grpUI.add(btnExit);
        this.grpUI.add(this.btnPlay);
        this.grpUI.add(this.btnPause);
        this.grpUI.add(this.sprLoadingPause);

        // Per tornar enrere quan es pica damunt de la pantalla
        //this.game.input.onUp.add(this.dobleClick, this); 

        // Creem el tauler
        this.objBoard = new Tauler(); 

        // Rectangles de fons (recBg) i de tauler de joc
        var recBg = game.add.graphics(0,0);
        recBg.beginFill(this.colorMenu, 0.25);
        recBg.drawRect(0, 
							   0, 
							   window.innerWidth, 
							   window.innerHeight);
        
        // Rectangle blanc (recResoldre) on es mouen els cubs
        var recResoldre = game.add.graphics(0,0);
        recResoldre.beginFill(this.colorBack);
        recResoldre.drawRect(window.innerWidth*0.35, 
										this.intMarge, 
										(window.innerWidth*0.65) - (this.intMarge), 
										window.innerHeight - (this.intMarge*2));
        
        // Enviem els dos rectangles al fons de tot
        game.world.sendToBack(recResoldre);
        game.world.sendToBack(recBg);
        
        //Carreguem el abac segons el Mode
        switch (this.strMode) {
        	case 'sum':
        		this.createSumMode();
        		break;
        	case 'res':
        		this.createResMode();
        		break;
        	case 'mult':
        		this.createMultMode();
        		break;
        	case 'div':
        		this.createDivMode();
        		break;
        }
		
        game.world.bringToTop(this.grpUI);

        //var xMargeEsquerra = window.innerWidth*0.25;
        //var xCentre = (window.innerWidth + xMargeEsquerra)*0.5;
        this.sprOK = new SpriteBase(window.innerWidth*0.5, window.innerHeight *0.05, 'atlasCalcExtra', 'ninotOk');
        this.sprOK.anchor.setTo(0.5, 0);
        this.sprOK.alpha = 0;
        //this.grpUI.add(this.sprOK);
	},

	createSumMode: function() {

        // Posicions x/y on hi posarem la operació
        var xOperacio = window.innerWidth*0.25;
        var yOperacio = window.innerHeight*0.185;

        // Guardem els sprites que generen les sumes portant
        this.arrPortant = [];

        // Mostra la operació que s'està resolent
        this.op = new Operacio('+', this.intCalc1, this.intCalc2, xOperacio, yOperacio, this.intScale);


        // Creem els blocs de els dos nombres de la operació
        this.createBlocksCalc(this.intCalc1, window.innerWidth*0.515);
        this.createBlocksCalc(this.intCalc2, window.innerWidth*0.825);


        // Variables de posicionament per als tweens.
        this.xSolvedU = window.innerWidth*0.86;
        this.xSolvedD = window.innerWidth*0.63;
        this.xSolvedC = window.innerWidth*0.45;
        this.ySolved = window.innerHeight*0.8;

        this.xPortantD = window.innerWidth*0.7;
        this.xPortantC = window.innerWidth*0.5;
        this.yPortant = window.innerHeight*0.1;

        // Declarem les variables que indiquen si una potència s'ha resolt:
        // Si hi ha coses a un grup, vol dir que no està resolt
        this.uniOk = (this.objBoard.getGrpUnitats().length == 0);
        this.desOk = (this.objBoard.getGrpDesenes().length == 0);
        this.cenOk = (this.objBoard.getGrpCentenes().length == 0);
        
        game.time.events.add(this.intRetard, function() {
            this.btnPause.setEnabled(true);
            this.prepareAutoSum();
        }, this);
    },

    createResMode: function() {

        // Posicions x/y on hi posarem la operació
        var xOperacio = window.innerWidth*0.25;
        var yOperacio = window.innerHeight*0.2;

        var recResoldre = game.add.graphics(0,0);
        recResoldre.beginFill(this.colorMenu, 0.25);
        recResoldre.drawRect(window.innerWidth*0.35, 
                            window.innerHeight*0.65, 
                            (window.innerWidth*0.65) - (this.intMarge), 
                            this.intMarge);

        this.op = new Operacio('-', this.intCalc1, this.intCalc2, xOperacio, yOperacio, this.intScale);
        this.blnMoveResult = false;

        this.createBlocksCalc(this.intCalc1, window.innerWidth*0.83);
        
        // Unitats i desenes del minuend
        this.minuU = 0;
        this.minuD = 0;
        if (this.intCalc1 > 9) {
            this.minuD = Math.floor(this.intCalc1/10);
        }
        this.minuU = this.intCalc1 - (this.minuD*10);

        // Unitats i desenes del substraend
        this.subsU = 0;
        this.subsD = 0;
        if (this.intCalc2 > 9) {
            this.subsD = Math.floor(this.intCalc2/10);
        }
        this.subsU = this.intCalc2 - (this.subsD*10);

        // Variables de posicionament de els sprites
        this.xSolvedU = window.innerWidth*0.83;
        this.xSolvedD = window.innerWidth*0.515;
        this.ySolved = window.innerHeight*0.5;
        this.ySolvedSubstraend = window.innerHeight*0.8;

        this.xPortantU = window.innerWidth*0.8;
        this.yPortant = window.innerHeight*0.1;

        // Si les dues unitats son 0, no s'ha de operar amb unitats per tant les deixem com a OK
        // El mateix passa amb els desenes
        this.uniOk = (this.minuU == 0 && this.subsU == 0);
        this.desOk = (this.minuD == 0 && this.subsD == 0);

        game.time.events.add(this.intRetard, function() {
            this.btnPause.setEnabled(true);
            this.prepareAutoRes();
        }, this);
    },

    createMultMode: function() {
        // Posicions x/y on hi posarem la operació
        var xOperacio = window.innerWidth*0.25;
        var yOperacio = window.innerHeight*0.2;

        // Guardem els sprites que generen les sumes portant
        this.arrPortant = [];


        this.op = new Operacio('x', this.intCalc1, this.intCalc2, xOperacio, yOperacio, this.intScale);

        this.objBoard.addContador(window.innerWidth - (10*this.intScale), 0, 'countMult');

        this.createBlocksCalc(this.intCalc1, window.innerWidth*0.825);

        // Declarem les variables que indiquen si una potència s'ha resolt:
        // Si hi ha coses a un grup, vol dir que no està resolt
        this.uniMultOk = (this.objBoard.getGrpUnitats().length == 0);
        this.desMultOk = (this.objBoard.getGrpDesenes().length == 0);



        this.uniSumOk = this.uniMultOk;
        this.desSumOk = this.desMultOk;
        this.cenSumOk = true;
        this.sortMultOK = false;


        this.intMultiplicador = 1;

        this.xLeft = (window.innerWidth*0.35)
        this.xRight = (window.innerWidth-(20*this.intScale)) 
        var area = this.xRight - this.xLeft ;
        var center = this.xLeft  + (area/2);
        
        
        this.xSolvedU = this.xRight;
        this.xSolvedD = center;
        this.xSolvedC = this.xLeft;
        this.ySolved = window.innerHeight*0.8;

        this.xPortantD = window.innerWidth*0.8;
        this.yPortantD = window.innerHeight*0.2;

        this.xPortantC = window.innerWidth*0.5;
        this.yPortantC = 0;

        this.objBoard.initValues(parseInt(this.intCalc1));
        if (this.objBoard.cntMultU.val == 0) this.blnMultU = false;

        game.time.events.add(this.intRetard, function() {
            // Si multipliquem per 1, posem la bln de multiplicar a true_
            //  _i canviem el color del contador a verd (OK)
            if (this.intCalc2 == 1) {
                this.uniMultOk = true;
                this.desMultOk = true;
                this.objBoard.countOk('U');
                this.objBoard.countOk('D');
            }
            this.btnPause.setEnabled(true);
            this.prepareAutoMult();
        }, this);
    },

    // Mostar el contador
    // showCount: function(strPow) {
    //     this.objBoard.showCount(strPow);
    // },

    createDivMode: function() {
        
        // Posicions x/y on hi posarem la operació
        var xOperacio = window.innerWidth*0.23;
        var yOperacio = window.innerHeight*0.17;

        this.intDivU = 0;
        this.intDivD = 0;
        this.intResultat = parseInt(this.intCalc1/this.intCalc2);
        this.sprDividir = undefined;
        this.strStep;
        this.strStepComplex;

        // Recuadre on començen els cubs, abans de separarlos
        var recCubs = game.add.graphics(0,0); 
        recCubs.beginFill(this.colorBack);
        recCubs.drawRect(window.innerWidth*0.01, 
                            window.innerHeight*0.56, 
                            window.innerWidth*0.33, 
                            window.innerHeight*0.43);
        recCubs.endFill();

        this.grpDiv = new Grup();

        var arrDU = Tools.separarDesenaUnitat(this.intCalc1);
        this.intDivD = arrDU.desena;
        this.intDivU = arrDU.unitat;

        this.op = new Operacio('÷', this.intCalc1, this.intCalc2, xOperacio, yOperacio, this.intScale);

        // var intGruix = window.innerHeight*0.005;
        // var recuadres = game.add.graphics(0,0);
        // recuadres.beginFill(this.colorMenu, 0.25);

        // var xTauler = window.innerWidth*0.35;
        // var yTauler = window.innerHeight*0.01;
        // var widthTauler = window.innerWidth - (window.innerWidth*0.36);
        // var heightTauler = ((window.innerHeight - (yTauler*1.5)) / this.intCalc2) - intGruix;

        // this.arrYSolved = [this.intCalc2];
        // this.posY = 0;
        // for (var i = 0; i <= this.intCalc2; i++) {
        //     if (i < this.intCalc2) {
        //         recuadres.drawRect(xTauler, yTauler, widthTauler, heightTauler);
        //         //game.world.sendToBack(recuadres);
        //     }
        //     this.arrYSolved[i-1] = yTauler - (heightTauler/2);
        //     yTauler += heightTauler + intGruix;
        // };
        // recuadres.endFill();

        var recuadres = game.add.graphics(0,0);
        recuadres.beginFill(this.colorMenu, 0.25);

        var widthTauler = window.innerWidth*0.64;
        var heightTauler = (window.innerHeight) / this.intCalc2;
        var xTauler = window.innerWidth*0.35;
        var yTauler = 0;
        var yExtra = 0;
        var minY = 0;
        this.arrYSolved = [this.intCalc2];
        this.posY = 0;

        for (var i = 1; i <= this.intCalc2; i++) {
            // var rec = game.add.graphics(0,0); 
            // rec.lineStyle(5*intScale, 0x0000F, 1);
            if (i < this.intCalc2) {
                recuadres.drawRect(xTauler, yTauler + heightTauler, widthTauler, this.intMarge);
                //game.world.sendToBack(recuadres);
                //this.grpUI.add(recuadres)   
            }
            this.arrYSolved[i-1] = yTauler + (heightTauler/2);
            yTauler += heightTauler;

            if (yExtra === 0) yExtra = 9*this.intScale;
            minY += heightTauler;
        };
        recuadres.endFill();

        this.xSolvedU = window.innerWidth*0.8;
        this.xSolvedD = window.innerWidth*0.5;

        //this.createBoardsDiv();
        this.createBlocksCalc(this.intCalc1, window.innerWidth*0.17);

        // En aquest array posem les unitats que se separen de les desenes en la divisió portant
        this.arrUnitats = [];
        this.arrDesenes = [];
        game.world.bringToTop(this.objBoard.getGrpUnitats())
        game.world.bringToTop(this.objBoard.getGrpDesenes())
        
        // Comprovem  quin es el pas de la divisió que s'ha de fer 
        this.checkStep();

        game.time.events.add(this.intRetard, function() {
            this.btnPause.setEnabled(true);
            this.prepareAutoDiv();
        }, this);
    },

    // En mode calculadora, crea els sprites de inici
    createBlocksCalc: function(intNum, xSprites) {
        var yUn, yDes, xDes;
        switch (this.strMode) {
            case 'sum':
                yUn = window.innerHeight*0.5;
                yDes = window.innerHeight*0.4;
                xDes = xSprites;
                break;
            case 'res':
                xDes = window.innerWidth*0.515;
                yUn = window.innerHeight*0.4;
                yDes = window.innerHeight*0.4;
                break;
            case 'mult':
                xDes = window.innerWidth*0.515;
                yUn = window.innerHeight*0.9;
                yDes = window.innerHeight*0.9;
                break;
            case 'div':
                yUn = window.innerHeight*0.9;
                yDes = window.innerHeight*0.8;
                xDes = xSprites;
                break;
        }

        var intUnitats = 0;
        var intDesenes = 0;
        if (intNum > 9) {
            intDesenes = Math.floor(intNum/10);
        }
        intUnitats = intNum - (intDesenes*10);
        
        if (intDesenes > 0) {
            var nouSpr = this.createBlock(xDes, yDes, 'D', intDesenes,false);

            game.world.bringToTop(this.objBoard.getGrpDesenes());
        }

        if (intUnitats > 0) {

            var nouSpr = this.createBlock(xSprites, yUn, 'U', intUnitats, false);
            if (this.strMode === 'div') {
                // A la unitat, li posem el tag 'sum' per saber que es un dels que s'ha de ajuntar amb altres unitats si n'hi ha a la resta
                nouSpr.setTag('sum');
            }
        }
    },
// -- END CREATE -- 

// --- FUNCIONS AUTO-RESOLDRE ---

//   -- SUMA --
    // Encarregada de triar quina potència operem
    prepareAutoSum: function() {

        this.blnOperant = false;
        if (this.blnPaused) return;

        // Sempre espera un interval entre operació i operació
        game.time.events.add(this.intRetard, function() {
            this.blnOperant = true;
            // Si les unitats no s'han operat, les operem:
            if (!this.uniOk) {
                // Cridem el solveAutoSum amb les variables necessàries per a les UNITATS
                this.solveAutoSum(this.objBoard.getGrpUnitats(), // Agafem el grup de unitats, que serà el que operarem
                                    'U'); // El str de la potència que operem (unitats)
            }
            else if (!this.desOk) {
                // Cridem el solveAutoSum amb les variables necessàries per a les DESENES
                this.solveAutoSum(this.objBoard.getGrpDesenes(), // Agafem el grup de desenes, que serà el que operarem
                                    'D');        // El str de la potència que operem (desenes)
            }
            else if (!this.cenOk) {
                // Cridem el solveAutoSum amb les variables necessàries per a les CENTENES
                this.solveAutoSum(this.objBoard.getGrpCentenes(), // Agafem el grup de centenes, que serà el que operarem
                                    'C');        // El str de la potència que operem (centenes)
            }
            else {
                game.world.bringToTop(this.objBoard.getGrpDesenes());
                this.solveOperation();
            }

        }, this);
    },

    // Fa la operació necessària, segons l'estat de la operació
    solveAutoSum: function(grpOperar, strPow) {

        // Si només hi ha un sprite, el movem cap a la posició "Solved"
        if (grpOperar.length == 1) {
            this.autoMove(grpOperar.getAt(0), this.getXSolved(strPow), this.ySolved, 1, false, true);
        }
        // Comprovem si tenim coses al arrPortant 
        //  (Si es unitat no fa falta comprovar-ho pq mai hi haurà una unitat portant)
        else if (strPow != 'U' && this.arrPortant.length > 0) {

            var grpPortant = this.objBoard.getMyGroup(strPow);

            switch (grpPortant.length) {
                case 2: // Si només hi ha dos sprites a la potència
                    this.arrPortant.splice(0, 1); // Borrem el primer dels sprites
                    game.time.events.add(this.intRetard, function() { // Ocultem la label portant
                        this.ocultarLabelPortant(strPow)
                    }, this);
                case 3: // Si hi ha 2 o 3 sprites a la potència (no fem el 'break' en el 'case 2'_
                        // _perque ens interessa que també entri per aquí en cas de haver-n'hi 2)
                    
                    game.world.bringToTop(grpPortant);

                    // Sumem els dos primers sprites del grup
                    //  Si n'hi ha 2, sumarem el portant amb l'altre
                    //  Si n'hi ha 3, al haver creat el portant posteriorment, l'ignorarà_
                    //   _ i sumarà els altres dos
                    this.autoSum(grpPortant, grpPortant.getAt(0), grpPortant.getAt(1));
                    break;
            }
           
        }
        // Si hi ha només dos sprites, simplement s'ajunten
        else if (grpOperar.length == 2) {
            this.autoSum(grpOperar, grpOperar.getAt(0), grpOperar.getAt(1))
        }
    },

    autoSum: function(grpCurrent, spr1, spr2, bln1to2, blnMultPortant) {
        var valSpr1 = spr1.getValor();
        var valSpr2 = spr2.getValor();

        // Resultat de la suma
        var result = parseInt(valSpr1) + parseInt(valSpr2);

        // Potència de la suma
        var strPow = spr2.getPotencia();

        if (valSpr1 >= valSpr2) {
            grpCurrent.bringToTop(spr2);
        }
        else {
            grpCurrent.bringToTop(spr1);
        }

        // Busquem la posició central entre els dos sprites
        var xMin = Math.min(spr1.x, spr2.x);
        var yMin = Math.min(spr1.y, spr2.y);

        var xDesti = (Math.max(spr1.x, spr2.x) - xMin) /2;
        xDesti += xMin;

        var yDesti = (Math.max(spr1.y, spr2.y) - yMin) /2;
        yDesti += yMin;

        if (bln1to2) {
            if (spr1.y < spr2.y) {
                this.tweenManager = game.add.tween(spr1) 
                    .to({x: spr2.x, y: spr2.y},this.intRetard/2,Phaser.Easing.Linear.None,true)
                    .start();
            }
            else {
                this.tweenManager = game.add.tween(spr2) 
                        .to({x: spr1.x, y: spr1.y},this.intRetard/2,Phaser.Easing.Linear.None,true)
                        .start();
            }
        }
        else {
            // Movem els dos sprites al centre, fent-los convergir
            game.add.tween(spr1) 
                .to({x: xDesti, y: yDesti},this.intRetard/2,Phaser.Easing.Linear.None,true)
                .start();

            this.tweenManager = game.add.tween(spr2) 
                .to({x: xDesti, y: yDesti},this.intRetard/2,Phaser.Easing.Linear.None,true)
                .start();    
        }
        
        this.tweenManager.onComplete.add(function() {
            
            // Ajuntem els dos blocks
            this.sumBlocks(spr1, spr2, spr2.x, spr2.y); 
            // Aquesta variable indica si s'ha de augmentar el temps de retràs per moure el sprite resultant
            //  Si hi ha un sprite "portant" de la següent potència, posarem el intMultTimer a 2_
            //  _per que s'erperi el doble de temps per moure el sprite resultant (mentre es mou el spr Portant)
            var intMultTimer = 1;

            if (blnMultPortant) {
                var sprResult = grpCurrent.getTop();

                // Borrem els dos primers del arrPortant (els que acabem de sumar)
                //   I afegim el sprite que acabem de crear
                this.arrPortant.splice(0,2);
                this.arrPortant.push(sprResult); 
                grpCurrent.sendToBack(sprResult);

                game.time.events.add(300, function() {
                    this.tweenManager = game.add.tween(sprResult.scale) 
                        .to({x: sprResult.scale.x*0.75, y: sprResult.scale.y*0.75},500,Phaser.Easing.Linear.None,true)
                        .start();                  
                }, this);
            }
            // Si el resultat de la suma és major a 10, afegim el sprite de la següent potència al arrPortant
            if (result >= 10) { 
                var strNextPow = Tools.getNextPotencia(strPow);
                var grpNextPow = this.objBoard.getMyGroup(strNextPow);
                var spr = grpNextPow.getTop();

                // Com que en portem una a la següent potència, posem la seva varOk a false
                if (this.strMode == 'mult') {

                    grpNextPow.sendToBack(spr);
                    this.addYPortant(strNextPow, spr.height*0.6);
                    this.arrPortant.push(spr);

                    this.portantMult(strNextPow);

                    this.setPowMultOK(strNextPow, false, false)
                }
                else {
                    this.setPowOK(strNextPow, false)  

                    // Si estem fent una suma, el resultat de la operacio és 10, _
                    //  _ i ens quedarem sense altres sprites al grup, donem la potència com a resolta
                    
                    if (this.strMode == 'sum') {
                        this.arrPortant.push(spr);
                        if (result == 10 && grpCurrent.length == 0) {
                            this.setPowOK(strPow, true);
                            var strLabelResult = '0';
                            if (strPow == 'D') strLabelResult = '00';
                            this.op.addResult(strLabelResult);
                        }
                        intMultTimer = 2;
                    }
                }
                
                game.time.events.add(this.intRetard, function() {
                    this.autoMove(spr, this.getXPortant(strNextPow), this.getYPortant(strNextPow), -1, true, false);
                }, this);  
            }

            // Si es una resta, no hem de esperar el interval de temps com amb la suma
            if (this.strMode != 'sum') {
                if (this.strMode == 'div') {
                    this.arrUnitats.push(grpCurrent.getTop());
                }
                this.callAutoSolve();
            }
            else {
                game.time.events.add(this.intRetard*intMultTimer, function() {
                    if (grpCurrent.length == 1) {
                        this.autoMove(grpCurrent.getAt(0), this.getXSolved(strPow), this.ySolved, 1, false, true);
                    }
                    else {
                        this.callAutoSolve();    
                    }
                }, this);    
            }

        }, this);
    },
//   -- END SUMA --


//   -- RESTA --

    prepareAutoRes: function() {
        this.blnOperant = false;
        if (this.blnPaused) return;

        // Sempre espera un interval entre operació
        game.time.events.add(this.intRetard, function() {
            this.blnOperant = true;
            // Si les unitats no s'han operat, les operem:
            if (!this.uniOk) {
                // Cridem el solveAutoRes amb les variables necessàries per a les UNITATS
                this.solveAutoRes(this.objBoard.getGrpUnitats(), // Agafem el grup de unitats, que serà el que operarem
                                    this.minuU, // Les unitats del minuent de la operació
                                    this.subsU, // Les unitats del substraent de la operació
                                    'U');       // El str de la potència que operem (unitats)
            }
            else if (!this.desOk) {
                this.op.delPortantUn();
                this.op.delPortantDes();
                // Cridem el solveAutoRes amb les variables necessàries per a les DESENES
                this.solveAutoRes(this.objBoard.getGrpDesenes(), // Agafem el grup de desenes, que serà el que operarem
                                    this.minuD, // Les desenes del minuent de la operació
                                    this.subsD, // Les desenes del substraent de la operació
                                    'D');       // El str de la potència que operem (desenes)
            }
            else {
                this.solveOperation();
            }

        }, this);
    },

    // Aquesta funció és la que s'encarrega de triar quina serà la operació a executar-se
    solveAutoRes: function(grpOperar, intMinuent, intSubstraent, strPow) {
        game.world.bringToTop(grpOperar); // El posem a sobre de tot

        // blnMoveResult indica que els sprites s'han separat i que s'han de moure a les seves respectives posicions
        if (this.blnMoveResult) {
            var spr1 = grpOperar.getAt(0);
            var spr2 = grpOperar.getAt(1);

            // Si hi ha mes de dos sprites, vol dir que s'han de sumar les dues unitats del minuent
            // Només passarà en el cas de les unitats
            if (grpOperar.length > 2) {
                
                var spr3 = grpOperar.getAt(2);
                // Busquem quin valor té el substraent, i ajuntem les altres dues.
                switch (intSubstraent) {
                    case spr1.getValor():
                        this.autoMove(spr1, this.getXSolved(strPow), this.ySolvedSubstraend, -1);
                        // Sumar 2 i 3
                        this.game.time.events.add(this.intRetard*2, function() {
                            this.autoSum(grpOperar, spr2, spr3);
                        }, this);
                        break;
                    case spr2.getValor():
                        this.autoMove(spr2, this.getXSolved(strPow), this.ySolvedSubstraend, -1);
                        // Sumar 1 i 3
                        this.game.time.events.add(this.intRetard*2, function() {
                            this.autoSum(grpOperar, spr1, spr3);
                        }, this);
                        break;
                    case spr3.getValor():
                        this.autoMove(spr3, this.getXSolved(strPow), this.ySolvedSubstraend, -1);
                        // Sumar 1 i 2
                        this.game.time.events.add(this.intRetard*2, function() {
                            this.autoSum(grpOperar, spr1, spr2);
                        }, this);
                        break;
                }
            }
            else {
                // Mirem quin dels dos es el substraent
                if (spr1.getValor() == intSubstraent) {
                    // Cridem la funció per moure minuent i substraent a la seva respectiva posició "Solved"
                    this.moveMinuentSubstraent(spr2, spr1, strPow); // (minuent, substraent, potència)  
                } 
                else {
                    this.moveMinuentSubstraent(spr1, spr2, strPow); // (minuent, substraent, potència)  
                }
                this.blnMoveResult = false; // Posem el blnMoveResult a false per indicar que ja s'han mogut
                this.setPowOK(strPow, true); // Operació en unitats completada correctament
            }
        }
        // Si el substraent es 0 o el minuent i el substraent son iguals, 
        //   la unica acció que haurem de fer es moure el sprite de unitats
        else if (intSubstraent == 0 || intMinuent == intSubstraent) {

            // Agafem el sprite a moure
            var sprMoure = grpOperar.getAt(0);
            
            var y; // Posició y on es mourà
            var intAddResult; // Variable que indica el resultat a mostrar a la operació

            // En cas de que haguem de treure el substraent al minuent
            if (intMinuent == intSubstraent) {
                y = this.ySolvedSubstraend; // La posició Y serà la del substraent
                intAddResult = 0; // Si son iguals, a la label de resultat ha de afegir un 0 com a resulat de la unitat
                //sprMoure.setIdTauler(1); // El canviem de tauler, al tauler inferior (substraents)
            }
            // En cas de que haguem de restar 0 al minuent
            else {
                y = this.ySolved; // La posició Y serà la del minuent
                intAddResult = 1; // indiquem que afegeixi valor del minuent com a resultat de la unitat                   
            }
            
            // Movem el sprite a la posició indicada
            this.autoMove(sprMoure, this.getXSolved(), y, intAddResult, false, true);

            // Indiquem que la operació en les unitats s'ha completat correctament
            this.setPowOK(strPow, true);
        }
        // El minuent es major al substraent, per tant, se li pot restar a la unitat tranquil·lament
        else if (intMinuent > intSubstraent) {
            this.autoRes(grpOperar.getAt(0), intSubstraent); // En restem les unitats
        }
        // El minuent es menor al substraent, per tant hem de desmontar la desena
        else if (intMinuent < intSubstraent) {

            // Agafem el grup i el primer sprite de la següent potència, i posem el grup a damunt de tot
            var grpNextPow = this.objBoard.getMyGroup(Tools.getNextPotencia(strPow));
            var spr = grpNextPow.getAt(0);
            game.world.bringToTop(grpNextPow);


            if (spr.getValor() > 1) {
                // Si hi ha més de una desena i la separem, estant en potència 'U'_
                //  _ restem 1 al minuent de desenes
                if (strPow == 'U') this.minuD -= 1;

                // Cridem al autoRestar per treure una desena
                this.autoRes(spr, 1, true, true);
            }
            else {
                // Si només hi ha una desena i la separem, estant en potència 'U'_
                //  _indiquem que les desenes s'han operat correctament
                if (strPow == 'U') this.desOk = true;
                
                // Separem la desena
                this.separarDesena(spr, intSubstraent);
            }
        }
    },

    // Funció que agafa un sprite i li resta el valSubstraent,_
    //   _creant dos sprites mes petits, i desplaçant-ne un d'ells lleugerament
    /* Explicació de les variables:
        sprResta: El sprite a dividir
        valSubstraent: El valor que l'hi treiem al sprResta
        blnSepararDesena: Indica si el sprite del substraent es una desena_
                           _a la que se l'hi ha de restar les unitats el substraent de la operació (this.subsU)
        blnPortant: Indica si es una resta "portant", per indicar-ho a la funció "autoMove()"
    */
    autoRes: function(sprResta, valSubstraent, blnSepararDesena, blnPortant, _x, _y, blnSpiteDividir) {
        
        var valMinuent;
        var strPow;

        // Si el valor del sprite és mes petit, vol dir que és de una potència superior
        if (sprResta.getValor() < valSubstraent) {
            valMinuent = (sprResta.getValor()*10) - valSubstraent;
            strPow = Tools.getPrevPotencia(sprResta.getPotencia());
        }
        else { 
            valMinuent = sprResta.getValor() - valSubstraent;
            strPow = sprResta.getPotencia();
        }

        var x = sprResta.x;
        var y = sprResta.y;

        if (valMinuent > 0) {
            var sprMinuent = this.createBlock(x, y, strPow, valMinuent, false);   
            SoundManager.playSound('div');
        }
        var sprSubstraent = this.createBlock(x, y, strPow, valSubstraent, false);

        // Si hi ha '_x' vol dir que es una divisió portant
        if (_x) {
            x = _x;
            if (blnSpiteDividir) {
                this.sprDividir = sprSubstraent;
                
            }
            // Si hi ha minuent, l'afegim al array de unitats
            if (sprMinuent) {
                sprMinuent.setTag('sum');
                this.arrUnitats.push(sprMinuent);
            }
        }
        y = _y || y + ((sprSubstraent.height*2));

        sprResta.dispose();
        
        if (blnSepararDesena) {
            this.autoMove(sprSubstraent, this.xPortantU, this.yPortant , -1, blnPortant);
            this.game.time.events.add(this.intRetard*2, function() {
                this.separarDesena(sprSubstraent, this.subsU);
            }, this);
        }
        else {
            this.blnMoveResult = true;  
            this.autoMove(sprSubstraent, x, y, -1, blnPortant, true);  
        }
    },

    // Mou els sprites de Minuent i Substraent a la seva respectiva posició "Solved"
    moveMinuentSubstraent: function(sprMinuent, sprSubstraent, strPow) {
        var xSolv;
        // Indiquem la posició X a on ha de anar segons la potència _
        //  _ i posem a "ok" la potencia que estiguem tractant
        if (strPow == 'U') {
            xSolv = this.xSolvedU;
            this.uniOk = true;
        }
        else {
            xSolv = this.xSolvedD;
            this.desOk = true;            
        }

        // Movem el substraent
        this.autoMove(sprSubstraent, xSolv, this.ySolvedSubstraend, -1);

        // if (sprMinuent.x > xSolv - 5 && sprMinuent.y > this.ySolved - 5) {
        //     Tools.addText('AutoSolve lol');
        //     this.callAutoSolve();
        // }
        // else {
            // Posem unaltre timer pq no es moguin le sdues alhora
            this.game.time.events.add(this.intRetard, function() {
                // Movem el minuent
                this.autoMove(sprMinuent, xSolv, this.ySolved, 1, false, true);
            }, this);    
        //}
    },

    // Agafa una desena de valor 1 (1D)  i la divideix en unitats, treient-li el intSubst que se li passa
    separarDesena: function(sprResta, intSubst) {
        var valMinuent = (sprResta.getValor()*10) - intSubst;
        var x = sprResta.x;
        var y = sprResta.y;
       
        var sprSubstraent = this.createBlock(x, y, 'U', intSubst, false);
        var sprMinuent = this.createBlock(x, y, 'U', valMinuent, false);   
        
        // Canviem el valor de minU (minuent de la unitat) per el que hem tret de la desena
        this.blnMoveResult = true; 
        
        sprResta.dispose();

        SoundManager.playSound('divInf');
        this.autoMove(sprSubstraent, x, y + (sprSubstraent.height*2), -1, true, true);
    },
//   -- END RESTA --


//   -- MULTIPLICACIÓ --

    prepareAutoMult: function() {
        this.blnOperant = false;
        if (this.blnPaused) return;

        // Sempre espera un interval entre operació
        game.time.events.add(this.intRetard, function() {
            this.blnOperant = true;

            // Multipliquem els sprites:
            if (!this.uniMultOk) {
                this.solveAutoMult(this.objBoard.getGrpUnitats(), 'U');
            }
            // Sumem els sprites multiplicats
            else if (!this.uniSumOk) {
                this.autoMultSum(this.objBoard.getGrpUnitats(), 'U');
            }
            else if (this.arrPortant.length > 1
                && this.arrPortant[0].getPotencia() == 'D'
                && this.arrPortant[1].getPotencia() == 'D') {
                
                var grpPortant = this.objBoard.getMyGroup(this.arrPortant[0].getPotencia());
                
                this.autoSum(grpPortant, 
                            this.arrPortant[0], 
                            this.arrPortant[1], 
                            false, true);
            }
            else if (!this.desMultOk) {
                this.solveAutoMult(this.objBoard.getGrpDesenes(), 'D');
            }
            else if (!this.desSumOk) {
                this.autoMultSum(this.objBoard.getGrpDesenes(), 'D');
            }
            else if (!this.cenSumOk) {
                this.op.delPortantDes();
                this.autoMultSum(this.objBoard.getGrpCentenes(), 'C');
            }
            else if (!this.sortMultOK) {
                this.sortMult();
            }
            else {
                this.objBoard.setResultMult();
                this.op.delPortantCen();
                this.solveOperation();
            }

        }, this);
    },

    solveAutoMult: function(grpOperar, strPow) {
        this.intMultiplicador++; // Sumem 1 al multiplicador
        var sprAnterior = grpOperar.getTop();
        var intValue = sprAnterior.getValor();
        var intModY = 1;
        if (strPow == 'D' && intValue > 4) intModY = 0.6;

        var newBlock = this.createBlock(sprAnterior.x, 
                                        sprAnterior.y - (sprAnterior.height*intModY), 
                                        strPow, 
                                        intValue,
                                        false);
        
        this.objBoard.addValue(strPow);

        newBlock.tweenSize(100);
        SoundManager.playSound('mult');
        // Si el multiplicador ha arribat al valor pel que multipliquem, posem al potencia a Ok_
        //  _ i tornem a deixar el valor del multiplicador a 1.
        if (this.intMultiplicador == this.intCalc2) {
            this.setPowMultOK(strPow, true, true);
            this.objBoard.countOk(strPow);
            this.intMultiplicador = 1;
        }
        this.endLoadingPause();
        this.prepareAutoMult();
    },

    // Per ajuntar els sprites un cop multiplicats
    autoMultSum: function(grpOperar, strPow) {
        var intLenght = grpOperar.length;
        if (intLenght == 0) {
            this.setPowMultOK(strPow, true, false);
            var strLabelResult = '0';
            if (strPow == 'D') strLabelResult = '00';
            this.op.addResult(strLabelResult);
            this.callAutoSolve();
        }
        else if (intLenght == 1) {
            this.setPowMultOK(strPow, true, false);
            var sprMove = grpOperar.getAt(0)
            switch (strPow) {
                case 'U':
                    var intOffset = (sprMove.width*0.75*0.5)+(10*this.intScale) ;
                    break;
                case 'D':
                    var intOffset = 0;
                    break;
                case 'C':
                    var intOffset = -((10*this.intScale) + (sprMove.width*0.5));
                    break;
            };
            
            this.autoMove(sprMove, this.getXSolved(strPow)-intOffset, this.ySolved, 1, false, true);
        }
        else {

            this.autoSum(grpOperar, grpOperar.getTop(), grpOperar.getAt(intLenght-2), true);
        }
    },

    portantMult: function(strNextPow) {
        var intPortant = 0;

        for (var i = this.arrPortant.length - 1; i >= 0; i--) {
            if (this.arrPortant[i].getPotencia() == strNextPow) {
                intPortant++;
            }
        }; 

        switch (strNextPow) {
            case 'D':
                this.op.addPortantDes('+' + intPortant);
                break;
            case 'C':
                this.op.addPortantCen('+' + intPortant);
                break;
        };

    },
    
    sortMult: function() {
        
        var arrResult = [];
        
        if (this.objBoard.getGrpCentenes().length > 0) {
            arrResult.push(this.objBoard.getGrpCentenes().getFirstAlive());
        }
        if (this.objBoard.getGrpDesenes().length > 0){
            arrResult.push(this.objBoard.getGrpDesenes().getFirstAlive());
        }
        if (this.objBoard.getGrpUnitats().length > 0) {
            arrResult.push(this.objBoard.getGrpUnitats().getFirstAlive());
        }
        var blankSpace = 0;
        
        
        var dif = arrResult[0].getMinX() - this.xLeft;
        blankSpace += dif;
        
        for (i = 0; i < arrResult.length-1; i++) { 
            var dif = arrResult[i+1].getMinX() - arrResult[i].getMaxX();
            blankSpace += dif;
        }

        dif = this.xRight - arrResult[arrResult.length-1].getMaxX();
        blankSpace += dif;
        blankSpace /= arrResult.length+1;
        
        var prev = this.xLeft;
        
        for (i = 0; i < arrResult.length; i++) { 
            var xStart = arrResult[i].x;
            var offset = prev + blankSpace + (arrResult[i].width*0.5)
            
            this.tweenManager = game.add.tween(arrResult[i]) 
                        .to({x: offset},750,Phaser.Easing.Linear.None,true)
                        .easing(Phaser.Easing.Bounce.Out)
                        .start();
            prev = offset + (arrResult[i].width*0.5);
        }
        
        this.tweenManager.onComplete.add(function() {
            this.sortMultOK = true;
            this.callAutoSolve();
        }, this);
        
/*        if (sprCent && sprDes && sprCent.getMaxX() > sprDes.getMinX() ) {
            var superposat = sprCent.getMaxX() - sprDes.getMinX();
            this.tweenManager = game.add.tween(sprDes) 
                .to({x: sprDes.x + superposat},500,Phaser.Easing.Linear.None,true)
                .easing(Phaser.Easing.Bounce.Out)
                .start();
            
             this.tweenManager.onComplete.add(function() {
                 
                if (sprUnits && sprDes.getMaxX() > sprUnits.getMinX()) {
                    superposat = sprDes.getMaxX() - sprUnits.getMinX();
                    this.tweenManager = game.add.tween(sprUnits) 
                        .to({x: sprUnits.x + superposat},500,Phaser.Easing.Linear.None,true)
                        .easing(Phaser.Easing.Bounce.Out)
                        .start();
                     this.tweenManager.onComplete.add(function() {
                        this.sortMultOK = true;
                        this.callAutoSolve();
                    }, this);
                }
                else {
                    this.sortMultOK = true;
                    this.callAutoSolve();     
                }
                
            }, this);
        }*/
        
/*        arrPoints[intPoint++] = window.innerWidth-(20*this.intScale);
        if (sprCent && sprDes && sprUnits && sprDes.getMinX() < sprCent.getMaxX()) {
            var espai = arrPoints[5] - arrPoints[4];
            espai += arrPoints[7] - arrPoints[6]
            
            var superposat = arrPoints[2] - arrPoints[3];
            
            console.log(superposat + " / " + espai);
//            this.tweenManager = game.add.tween(sprDes) 
//                .to({x: intX},this.intRetard+intDelay,Phaser.Easing.Linear.None,true)
//                .easing(Phaser.Easing.Bounce.Out)
//                .start();
            
            this.tweenManager = game.add.tween(sprDes) 
                .to({x: sprDes.x + superposat},500,Phaser.Easing.Linear.None,true)
                .easing(Phaser.Easing.Bounce.Out)
                .start();
//            this.tweenManager = game.add.tween(sprUnits) 
//                .to({x: sprUnits.x + superposat},600,Phaser.Easing.Linear.None,true)
//                .easing(Phaser.Easing.Bounce.Out)
//                .start();
            this.tweenManager.onComplete.add(function() {
                this.sortMultOK = true;
                this.callAutoSolve();
            }, this); 
        }*/
    },
    
    moveSorted: function() {
        
    },
//   -- END MULTIPLICACIÓ --
    
// -- DIVISIÓ --

    prepareAutoDiv: function() {
        this.blnOperant = false;
        if (this.blnPaused) return;

        game.time.events.add(this.intRetard, function() {
            this.blnOperant = true;

            switch (this.strStep) {
                case 'addLabel':
                    this.addLabelOperacio();
                    break;
                case 'baixarNum':
                    if (this.intBaixar1 != undefined) {
                        this.op.addRestaDiv(this.intBaixar1);
                        this.intBaixar1 = undefined;
                        if (!this.intBaixar2) {
                            this.checkStep();
                        }
                    }
                    else {
                        this.op.editLastAdded(this.intBaixar2);
                        this.intBaixar2 = undefined;
                        this.strStep = 'addLabel';    
                    }
                    this.game.time.events.add(this.intRetard*0.5, function() {
                        this.callAutoSolve();
                    }, this);
                    
                    break;
                case 'div':
                    var arrDividir = this.getIntDividir();
                    var sprDivident = this.objBoard.getMyGroup(arrDividir[0]).getTop();
                    
                    var intResult = parseInt(arrDividir[1]/this.intCalc2); // El resultat de la divisió
                    var intSeparar = parseInt(intResult*this.intCalc2); // El nombre de sprites que hem de separar
        
                    this.autoDiv(sprDivident, intSeparar, intResult);

					if (intSeparar == intResult) {
						this.objBoard.getGrpUnitats().remove(sprDivident);
						this.grpDiv.add(sprDivident);
						this.strStep = 'baixarNum';
					}
					else {
						this.strStep = 'unfold';
					}
                    
                    break;
                case 'unfold':
				
                    this.unfoldSprite(this.sprDividir);
                    if (this.intBaixar1 || this.intBaixar2) {
                        this.strStep = 'baixarNum';
                    }
                    else if (parseInt(this.op.lblRes.text) == this.intResultat){
                        this.strStep = 'ok';
                    }
                    else {
                        this.strStep = undefined;
                        this.checkStep();
                    }
					
                    break;
                case 'divComplex':
                    switch (this.strStepComplex) {
                        case 'treureDesena':
                            var sprDivident = this.objBoard.getGrpDesenes().getTop();
                            this.autoRes(sprDivident, 1, false, false, sprDivident.x, 
                                            sprDivident.y - (sprDivident.height*0.8), true);    
                            this.strStepComplex = 'div1D';
                            break;
                        case 'div1D':
                            this.dividir1D();
                            break;
                        case 'restants':
                            this.processarRestants();
                            break;
                        case 'ajuntar':
                            this.ajuntarResta();
                            break;
                    }
                    break;
                case 'ok':
                default:
                    this.solveOperation();
                    break;
            }
        }, this);
    },

    // Mostrar resultat/resta a la operació
    addLabelOperacio: function() {
        var arrDividir = this.getIntDividir();
        var intResult = parseInt(arrDividir[1]/this.intCalc2); // El resultat de la divisió
        var intSeparar = intResult*this.intCalc2; // El nombre de sprites que hem de separar

        if (arrDividir[1] > 10 && this.op.lblRes.text.trim().length == 0) {
            this.op.concatResult('0');
            this.op.addRestaDiv('-0');
            this.op.addLineResta();
            var arrResta = Tools.separarDesenaUnitat(arrDividir[1]);
            this.intBaixar1 = arrResta.desena;
            this.intBaixar2 = arrResta.unitat;
            this.strStep = 'baixarNum';
        }
        else {

            if (this.intCalc1 < 10 ) {
                this.op.addRestaDiv('-'+intSeparar);
            }
            else if (/*arrDividir[1] == intSeparar &&*/ arrDividir[0] != 'D' && arrDividir[1] < 10) {
                this.op.addRestaDiv('-0'+intSeparar);
            }
            else {
                this.op.addRestaDiv('-'+intSeparar);   
            }

            if (arrDividir[1] == this.intCalc1 && this.intCalc1 > 9) {
                this.op.concatResult('0'+intResult);
            }
            else {
                this.op.concatResult(intResult);
            }

            this.op.addLineResta();

            var intBaixar = arrDividir[1] - intSeparar;
            this.intBaixar1 = intBaixar;
            if (arrDividir[0] == 'D') {
                this.intBaixar2 = this.intCalc1.substring(1);
            }  
            else  if (this.intCalc1 < 10 ) {
                this.intBaixar1 = this.intBaixar1;
            }
            else {            
                this.intBaixar1 = '0'+this.intBaixar1;
            }

            this.checkStep();
        }




        // if (arrDividir[1] >= 10 || this.intCalc1 < 10 || intBaixar == '0') {
        //     //this.op.addRestaDiv('0'+intBaixar);
        //     this.intBaixar1 = '0'+intBaixar;
        // }
        // else if (arrDividir[1] == intSeparar) {
        //     //this.op.addRestaDiv(intBaixar);
        //     this.intBaixar1 = intBaixar;
        // }
        // else {
        //     //this.op.addRestaDiv(parseInt(intBaixar));
        //     this.intBaixar1 = parseInt(intBaixar);
        // }

        // this.intBaixar2 = intBaixar + '' + this.intBaixar;

        
        //this.op.addRestaDiv(intBaixar);
        
        this.callAutoSolve();
    },

    // Agafa una desena i la parteix en unitats de resultat i de resta
    dividir1D: function() {
        var arrResult = Tools.separarDesenaUnitat(this.intResultat);
        var grpDesenes = this.objBoard.getGrpDesenes();
        var grpUnitats = this.objBoard.getGrpUnitats();

        var sprDivident = grpDesenes.getTop();
        var x = sprDivident.x;
        var y = sprDivident.y;

        var sprResta = this.createBlock(x, y, 'U', 10-arrResult.unitat, false);
        var sprResult = this.createBlock(x, y, 'U', arrResult.unitat, false);

        // Enviem la resta a darrera de tot del grup
        grpUnitats.sendToBack(sprResta);

        // Treiem el spr de resultat del grup i l'afegim al 'game'
        grpUnitats.remove(sprResult);
        this.grpDiv.add(sprResult);

        sprResta.setTag('sum');

        this.autoMove(sprResta, x + (25*this.intScale*this.posY), y - (45*this.intScale*this.posY), -1, false, false);
        this.autoMove(sprResult, this.xSolvedU, this.arrYSolved[this.posY++], -1, false, true);
        
        sprDivident.dispose();
     
        SoundManager.playSound('divInf');
       
        if (grpDesenes.length > 0) {
            this.strStepComplex = 'treureDesena';  
        }
        else if (grpUnitats.length > 0) {
            this.strStepComplex = 'restants';
        }
        else {
            this.strStep = 'ok';
        }
    },

    checkStep: function() {
       
        var arrDividir = this.getIntDividir();
        if (this.strStep == undefined) {
            this.strStep = 'addLabel';
        }
        else if (arrDividir[1] < 10 && arrDividir[1] >= this.intCalc2) {
            this.strStep = 'div';
        }
        else if (arrDividir[1] >= 10 ) {
            this.strStep = 'divComplex';
            this.checkStepComplex(arrDividir[1]);
        }
        else {
            this.strStep = 'ok';
        }

        return arrDividir;
    },

    checkStepComplex: function(intDividir) {
        // Si es mes gran de 19, hem de treure una desena
        var intResult = parseInt(intDividir/this.intCalc2);
        // var intSeparar = intResult*this.intCalc2;

        // var arrDU = Tools.separarDesenaUnitat(intSeparar);

        if (intResult < 10) {
            if (this.intDivD == 1) {
                this.strStepComplex = 'div1D';
            }
            else {
                this.strStepComplex = 'treureDesena';    
            }
            
        }
    },

/*     autoDivComplex: function(intDividir) {
        
        var intResult = parseInt(intDividir/this.intCalc2);
        var intSeparar = intResult*this.intCalc2;

        var arrDU = Tools.separarDesenaUnitat(intSeparar);

        var sprDesena = this.objBoard.getGrpDesenes().getTop();

        if (intResult < 10) {

        }
        if (intResult >= 10) {
            
            sprDesena.alpha = 0.4
            this.autoDiv(sprDesena, arrDU.desena, intResult);    
        }
    }, */

    getIntDividir: function() {
        // Començem mirant si el nº de la desena és inferior al divisor, si ho es retornem la desena i unitat
        if (this.intDivD < this.intCalc2) return ['U', parseInt(this.intDivD + '' + this.intDivU)];
        // Si no es aixi, implicarà que la desena es major al divisor, i si la desena es mes gran a 0, retornem la desena
        else if (this.intDivD > 0) return  ['D', parseInt(this.intDivD)];
        // Si no es compleix cap de les anteriors condicions retornem la unitat
        else return  ['U', parseInt(this.intDivU)];
    },

    // Separem un nombre del sprite indicat
    autoDiv: function(sprDivident, intSeparar, intResult) {
        
        // Separem el módul del divisor, i el portem al centre de la pantalla
        var intValue = sprDivident.getValor(); // El valor del sprite
        var strPow = sprDivident.getPotencia();


        if (intSeparar > intValue*10) {
            var intTreure = 0;
            while (intTreure <= (10-intResult)) {
                intTreure += intResult;
            };

            if (intTreure == 10) {
                this.autoMove(sprDivident, this.getXSolved(strPow), this.arrYSolved[0], -1, false, true);
                this.sprDividir = sprDivident;
            }
            else {
                this.autoRes(sprDivident, intTreure, false, false, this.getXSolved(strPow), this.arrYSolved[this.posY], true);    
            }
            
            this.strAuxState = 'sumResta';
        }
        else if (intSeparar == intValue || intSeparar == (intValue*10)) {
            this.autoMove(sprDivident, this.getXSolved(strPow), this.arrYSolved[0], -1, false, true);
            this.sprDividir = sprDivident;
        }
        else {
            // Treiem el nombre del sprDivident
            this.autoRes(sprDivident, intSeparar, false, false, this.getXSolved(strPow), this.arrYSolved[this.posY], true);    
            this.sprDividir = this.objBoard.getMyGroup(strPow).getTop();
        }
        
        switch (strPow) {
            case 'U':
                this.intDivU -= intSeparar;
                break;
            case 'D':
                this.intDivD -= intSeparar;
                break;
        }
    },

    unfoldSprite: function(sprUnfold, blnPortant) {
        var intValor = sprUnfold.getValor();
        var strPow = sprUnfold.getPotencia();

        // Agafem el valor del sprite que hem de crear, si es una desena, ho hem de dividir per 10
        var intValueResult;
        if (this.intResultat >= 10) {
            if (strPow == 'D') {
                intValueResult = parseInt(this.intResultat/10);
            }
            else {
                var intDesena = intValueResult = parseInt(this.intResultat/10)*10
                intValueResult = this.intResultat - intDesena;
            }
        }
        else {
            intValueResult = this.intResultat;
        }
        
        var intIteracions = intValueResult;

        var x = sprUnfold.x;
        var y = sprUnfold.y;
        var intDelay = 0;
        var intAddResult = -1;
        var blnCallAutoSolve = false;
        var i = 0;
        
        // Comprovem si el valor del sprite es 1, pq si ho es vol dir que es una desena el que s'ha de desmontar
        if (intValor == 1) {
            intValor = 10;
            strPow = 'U';
            SoundManager.playSound('divInf');
        }
        else {
            SoundManager.playSound('div');
        }

        while (intIteracions <= intValor) {
            intDelay += 100;
            
            var sprNew = this.createBlock(sprUnfold.x, sprUnfold.y, strPow, intValueResult, false);
            
            // Treiem el spr de resultat del grup i l'afegim al 'game'
            this.objBoard.getMyGroup(strPow).remove(sprNew);
            this.grpDiv.add(sprNew);

            if (intIteracions == intValor) {
                intAddResult = 1;
                blnCallAutoSolve = true;

            }
            if (blnPortant) {
                y -= sprNew.height*0.85;
                //blnCallAutoSolve = false;
                this.arrDesenes.push(sprNew);
            }
            else  {
                y = this.arrYSolved[this.posY++];
            }

            this.autoMove(sprNew, x, y, -1, false, blnCallAutoSolve, intDelay);  
            intDelay += 100; 
            intIteracions += intValueResult;
        }; 
        this.posY = 0;
        this.sprDividir.dispose();
        this.sprDividir = undefined;
    },

    processarRestants: function() {
        var grpOperar = this.objBoard.getGrpUnitats();
        var arrResult = Tools.separarDesenaUnitat(this.intResultat);

        var spr1 = grpOperar.getByValue(arrResult.unitat);

        // Aquí només hi entrarà el spr1 te un valor major o igual al resultat
        if (spr1) {
            var intValue1 = spr1.getValor();
            if (intValue1 == arrResult.unitat) {
                
                // Treiem el spr de resultat del grup i l'afegim al 'game'
                grpOperar.remove(spr1);
                this.grpDiv.add(spr1);
                this.autoMove(spr1, this.xSolvedU, this.arrYSolved[this.posY++], -1, false, true);
            }
            else  {
                this.autoRes(spr1, arrResult.unitat, false, false, this.xSolvedU, this.arrYSolved[this.posY++], true);    

                spr1 = grpOperar.getTop();
                grpOperar.remove(spr1);
                this.grpDiv.add(spr1);
            }

            if (this.posY == this.intCalc2) {
                
                if (grpOperar.length > 1) {
                    this.strStepComplex = 'ajuntar';
                }
                else {
                    this.strStep = 'ok';   
                }
            }
        }
        else if (grpOperar.length > 1) {
            this.ajuntarResta();
        }
        else {
            this.solveOperation();
        }
    },

    ajuntarResta: function() {
        var grpOperar = this.objBoard.getGrpUnitats();
        var spr1 = grpOperar.getAt(0);
        var spr2 = grpOperar.getAt(1);

        if (spr1 != -1 && spr2 != -1) {
            if (parseInt(spr1.getValor()) + parseInt(spr2.getValor()) >= 10) {
                this.strStepComplex = 'div1D';
            }
            this.autoSum(grpOperar, spr1, spr2);    
        }
        else this.solveOperation();
    },
// -- END DIVISIÓ --


//   -- GENERALS --

    // Mou un sprite utilitzant tween fins a la posició indicada.
    /* Es pot indicar si s'ha de mostrar el resultat a la operacio al acabar o i es "portant"
        "intAddResult" té tres posicions: -1, 0, 1.
           -1 NO afegim resultat
            0 Afegim un 0 a la label de resultatd
            1 Afegim el resultat que sen's passa
    */
    autoMove: function(sprMove, intX, intY, intAddResult, blnPortant, blnCallAutoSolve, intDelay) {

        if (!intDelay) intDelay = 0;
        var strPow = sprMove.getPotencia();
        var intValor = sprMove.getValor();

        // Movem el sprite a la posició indicada
        this.tweenManager = game.add.tween(sprMove) 
                        .to({x: intX, y: intY},this.intRetard+intDelay,Phaser.Easing.Linear.None,true)
                        .easing(Phaser.Easing.Bounce.Out)
                        .start();

        // Si és una resta i està al substraent, posem el alpha a 0.5
        if (this.strMode == 'res' && intY > (this.ySolvedSubstraend-10)) {
            this.tweenManager = game.add.tween(sprMove) 
                        .to({alpha: 0.6},this.intRetard,Phaser.Easing.Linear.None,true)
                        .start();            
        }
        else if (this.strMode == 'sum' && (blnPortant || (sprMove.scale.x == this.intScale && intAddResult == 1))) {
            this.tweenManager = game.add.tween(sprMove.scale) 
                        .to({x: sprMove.scale.x*0.75, y: sprMove.scale.y*0.75},500,Phaser.Easing.Linear.None,true)
                        .start();  
        }
        else if (this.strMode == 'mult' && sprMove.scale.x == this.intScale) {
            this.tweenManager = game.add.tween(sprMove.scale) 
                        .to({x: sprMove.scale.x*0.75, y: sprMove.scale.y*0.75},500,Phaser.Easing.Linear.None,true)
                        .start();
        }

        if (blnPortant) {
            this.mostrarLabelsPortant(strPow,intValor);
        }
        // El intAddResult indica si s'ha de posar el valor del sprite, un 0, o res
        if (intAddResult != -1) {
            
            var intResult;

            switch (intAddResult) {
                case 0:
                    intResult = 0;
                    break;
                case 1:
                    intResult = intValor;
                    this.setPowOK(strPow, true);
                    break;
            }

            switch (strPow) {
                case 'D':
                    intResult += '0';
                    break;
                case 'C':
                    intResult += '00';
                    break;
            }

            this.tweenManager.onComplete.add(function() {
                // Si és una operació portant, s'afegeixen els "portant" que toqui
                //if (blnPortant) this.mostrarLabelsPortant(strPow,intValor);
                if (intAddResult) this.ocultarLabelPortant(strPow)
                // Mostrem el resultat
                this.op.addResult(intResult);
                // Tornem a cridar el autoSolve
                if (blnCallAutoSolve) this.callAutoSolve();
            }, this);    
        }  
        else 
        {
            this.tweenManager.onComplete.add(function() {

                // Si és una operació portant, s'afegeixen els "portant" que toqui
                if (blnPortant) this.mostrarLabelsPortant(strPow, sprMove.getValor());
                
                // Tornem a cridar el autoSolve
                if (blnCallAutoSolve) this.callAutoSolve();
            }, this); 
        }
    },

    // Afegeix el valor indicat a la lblPortant de la potència indicada
    mostrarLabelsPortant: function(strPow, intValue) {
        switch (this.strMode) {
            case 'sum':
                if (strPow == 'D') {
                    this.op.addPortantDes('+'+intValue);
                }
                else {
                    this.op.addPortantCen('+'+intValue);
                }
                break;
            case 'res':
                this.op.addPortantDes('-1');
                this.op.addPortantUn(10+this.minuU);
                break;
        }
    },

    ocultarLabelPortant: function(strPow) {
        switch (strPow) {
            case 'U':
                this.op.delPortantUn();
               break;
            case 'D':
                this.op.delPortantDes();
                break;
            case 'C':
                this.op.delPortantCen();
               break;
        }
    },

    // Crida a la operació "prepareAutoXxx" adeqüada segons la operació que estiguem resolent
    callAutoSolve: function() {
        this.endLoadingPause();

        switch (this.strMode) {
            case 'sum':
                this.prepareAutoSum();
                break;
            case 'res':
                this.prepareAutoRes();
                break;
            case 'mult':
                this.prepareAutoMult();
                break;
            case 'div': 
                this.prepareAutoDiv();
                break;
        }
    },

    endLoadingPause: function() {
        if (this.sprLoadingPause.alpha == 1) {
            this.sprLoadingPause.alpha = 0;
            this.sprLoadingPause.animations.stop();
            this.showBtnPlay();
        }
    },

    setPowOK: function(strPow, blnOk) {
	   switch (strPow) {
            case 'U':
                this.uniOk = blnOk;
                break;
            case 'D':
                this.desOk = blnOk;
                break;
            case 'C':
                this.cenOk = blnOk;
                break;
        }
    },

    setPowMultOK: function(strPow, blnOk, blnMult) {
        switch (strPow) {
            case 'U':
                if (blnMult) this.uniMultOk = blnOk;
                else this.uniSumOk = blnOk;
                break;
            case 'D':
                if (blnMult) this.desMultOk = blnOk;
                else this.desSumOk = blnOk;
                break;
            case 'C':
                if (blnMult) this.cenMultOk = blnOk;
                else this.cenSumOk = blnOk;
                break;
        }
    },

    getXSolved: function(strPow) {
        switch (strPow) {
            case 'U':
                return this.xSolvedU;
                break;
            case 'D':
                return this.xSolvedD;
                break;
            case 'C':
                return this.xSolvedC;
                break;
        }
    },

    getXPortant: function(strPow) {
        switch (strPow) {
            case 'U':
                return this.xPortantU;
                break;
            case 'D':
                return this.xPortantD;
                break;
            case 'C':
                return this.xPortantC;
                break;
        }
    },

    getYPortant: function(strPow) {
        switch (strPow) {
            case 'D':
                if (this.yPortantD) return this.yPortantD;
                else return this.yPortant;
                break;
            case 'C':
                if (this.yPortantC) return this.yPortantC;
                else return this.yPortant;
                break;
        }
    },

    addYPortant: function(strPow, intAdd) {
        switch (strPow) {
            case 'D':
                this.yPortantD += intAdd;
                break;
            case 'C':
                this.yPortantC += intAdd;
                break;
        }
    },
//   -- END GENERALS --


// --- END FUNCIONS AUTO-RESOLDRE ---

    //dropBlock: function(sprBlock) {
        // No fa res ni ha de fer res
        // Quan arregli el tema de la herència ja la treure, de moment aqui està pq no peti
   // },

    solveOperation: function() {
        var intDelay = 0;

        if (this.strMode == 'div') {
            var grpUnitats = this.objBoard.getGrpUnitats();
			
            if (grpUnitats.length > 0) {
                var intLabel = parseInt(this.op.lblLastAdded.text);
                if (intLabel < 0) intLabel*=-1;
                
                var intResta = parseInt(grpUnitats.getTop().getValor());

                if (intLabel != intResta) {
                    this.op.addRestaDiv('0'+intResta);
                    intDelay = this.intRetard;
                } 
            }
            else {
                
                if (this.op.getLastPortant() == '-00 ' 
                    || parseInt(this.op.getLastPortant()) > 9 
                    || parseInt(this.op.getLastPortant()) < -9) {
                    
                    this.op.addRestaDiv('  0');
                }
                else if (parseInt(this.op.getLastPortant()) != '0'){
                    this.op.addRestaDiv('0');    
                }
                
            }
            
        }

        this.op.delPortantUn();
        this.op.delPortantDes();
        
        this.game.time.events.add(600, function() {
            // Indiquem que la operació s'ha reoslt
            this.blnResolt = true;
            
            // Deshabilitem el inputEnabled perquè el usuari no pugui interactuar durant la animació
            this.btnPause.inputEnabled = false;

            // Posem el sprite del ninotOk a dalt de tot
            game.world.bringToTop(this.sprOK);

            // Apliquem transparència a tots els objectes del grpUI
            this.grpUI.enableItemsTween(false, 500, 0.4);

            // El btnPlay i sprLoading els ocultem perque no surtin superposats al aplicar el alpha
            this.btnPlay.visible = false; 
            this.sprLoadingPause.visible = false;

            // Apliquem transparència a tots els objectes del objBoard
            //   això aplica transparència a tots els grups dr M/C/D/U
            this.objBoard.enableItemsTween(false, 500, 0.4);

            // SI es multiplicació, posem transparència al contador
            if (this.strMode == 'mult') {
                this.objBoard.tweenAlphaContador(500, 0.4);
            }
            else if (this.strMode == 'div') {
                this.grpDiv.enableItemsTween(false, 500, 0.4);
            }

            // Apliquem transparència a la operació
            this.op.setAlphaTween(500, 0.4);

            // Mostrem el ninotOk 
            this.sprOK.tweenAlphaFix(700, 1);
            this.sprOK.tweenSizeCreate(700, true);

            // Reproduïm el so de calc_ok 
            SoundManager.playSound('calc_ok');

            // Afegim la funció "goBack" al inputUp, per tornar a la 
            //   _ calculadora al picar damunt la pantalla
            this.game.input.onUp.add(this.goBack, this); 
        }, this);  
    },

/*     dobleClick: function() {

        if (this.blnJustInput) {
            this.goBack();
        }
        else {
            this.blnJustInput = true;  
        }
        this.pause(); 
        this.game.time.events.add(300, function() {
            // Passats 0.3 segons posem el blnJustInput a 'false'
            if (this.blnJustInput) {
                this.blnJustInput = false;

            }
        }, this);
    }, */

    pause: function() {
        if (this.blnResolt) this.goBack();
        else if (!this.tweenPause || !this.tweenPause.isRunning) {

            this.blnPaused = !this.blnPaused;
            this.tweenPlayPause();
            if (!this.blnPaused && !this.blnOperant) {
                this.callAutoSolve(); 
            }
        }
    },

    btnPauseClick: function () {
        if (this.sprLoadingPause.alpha == 0 && 
            (!this.tweenPause || !this.tweenPause.isRunning)) {

            this.blnPaused = !this.blnPaused;
            this.togglePlayPause();
            if (!this.blnPaused && !this.blnOperant) {
                this.callAutoSolve(); 
            }
        }
    },

    togglePlayPause: function() {
        
        if (this.btnPause.alpha == 1) {
            this.btnPause.setEnabled(false, 10, 0);
            

            this.grpUI.bringToTop(this.sprLoadingPause);
            this.sprLoadingPause.alpha = 1;
            this.sprLoadingPause.animations.add('anim', [0,1,2,3], 3, true);
            this.sprLoadingPause.animations.play('anim');

        }
        else {
            this.btnPause.setEnabled(true, 10, 1);
            this.grpUI.bringToTop(this.btnPause);

            this.tweenPause = game.add.tween(this.btnPlay) // Afegir tween
                .to({alpha: 0},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween

            this.tweenPause = game.add.tween(this.btnPause) // Afegir tween
                .to({alpha: 1},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween
        }
    },

    showBtnPlay: function() {
        
        this.grpUI.bringToTop(this.btnPlay);
        this.btnPlay.setEnabled(true);
        // this.tweenPause = game.add.tween(this.btnPause) // Afegir tween
        //     .to({alpha: 0},700,Phaser.Easing.Linear.None,true)
        //     .start(); // Començem el tween

        this.tweenPause = game.add.tween(this.btnPlay) // Afegir tween
            .to({alpha: 1},700,Phaser.Easing.Linear.None,true)
            .start(); // Començem el tween    
    
    },

    tweenPlayPause: function() {
        //game.input.maxPointers = 0; 
    
        game.world.bringToTop(this.grpUI);

        // var spr; 
        // if (this.blnPaused) {
        //     var spr = this.sprPause;
        // }
        // else {
        //     var spr = this.sprPlay; 
        // }
        // spr.alpha = 1;
        // this.tweenPause = game.add.tween(spr.scale) // Afegir tween
        //     .to({x: spr.scale.x*2, y: spr.scale.y*2},700,Phaser.Easing.Linear.None,true)
        //     .start(); // Començem el tween

        // this.tweenPause = game.add.tween(spr) // Afegir tween
        //     .to({alpha: 0},700,Phaser.Easing.Linear.None,true)
        //     .start(); // Començem el tween

        if (this.btnPause.alpha == 1) {
            this.tweenPause = game.add.tween(this.btnPause) // Afegir tween
                .to({alpha: 0},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween

            this.tweenPause = game.add.tween(this.btnPlay) // Afegir tween
                .to({alpha: 1},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween
        }
        else {
            this.tweenPause = game.add.tween(this.btnPlay) // Afegir tween
                .to({alpha: 0},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween

            this.tweenPause = game.add.tween(this.btnPause) // Afegir tween
                .to({alpha: 1},700,Phaser.Easing.Linear.None,true)
                .start(); // Començem el tween
        }

        this.tweenPause.onComplete.add(function() {
            spr.scale.setTo(this.intScale);
            //console.log(this.btnPlayPause.frameName)
           // this.btnPlayPause.setFrames('btnPlayUp', 'btnPlayUp','btnPlayDown', 'btnPlayUp');
           // game.input.maxPointers = 1; 
        }, this);     
    },

	shutdown: function () {
        if (this.blnClear) {
            
            // -- Variables generals creades al create    
            delete this.intCalc1;
            delete this.intCalc2;
            delete this.colorMenu;
            delete this.colorBack;
            delete this.blnPaused;
            delete this.blnOperant;
            delete this.blnJustInput;
            delete this.intRetard;
            delete this.intMarge;
            delete this.blnResolt;
            // --

            // -- Botons de play i pause
            this.btnPause.dispose();
            this.btnPlay.dispose();
            this.sprLoadingPause.destroy();
            delete this.btnPause;
            delete this.btnPlay;
            delete this.sprLoadingPause;
            // -- 


            // this.sprPause.dispose();
            // this.sprPlay.dispose();
         
            if (this.op) this.op.dispose();

            switch (this.strMode) {
                case 'sum':
                    this.arrPortant.length = 0;
                    delete this.arrPortant;
                    delete this.xSolvedU;
                    delete this.xSolvedD;
                    delete this.xSolvedC;
                    delete this.ySolved;
                    delete this.xPortantD;
                    delete this.xPortantC;
                    delete this.yPortant;

                    delete this.uniOk;
                    delete this.desOk ;
                    delete this.cenOk;

                    break;
                case 'res':
                    delete this.blnMoveResult;
                    delete this.minuU;
                    delete this.minuD;
                    delete this.subsU;
                    delete this.subsD;

                    delete this.xSolvedU
                    delete this.xSolvedD 
                    delete this.ySolved
                    delete this.ySolvedSubstraend
                    delete this.xPortantU
                    delete this.yPortant
                    delete this.uniOk
                    delete this.desOk

                    break;
                case 'mult':

                    break;
                case 'div':
                    this.arrYSolved.length = 0;
                    this.arrUnitats.length = 0;
                    this.arrDesenes.length = 0;

                    delete this.intDivU;
                    delete this.intDivD;
                    delete this.posY;
                    delete this.arrYSolved;
                    delete this.arrUnitats;
                    delete this.arrDesenes;
                    delete this.strAuxState;
                    delete this.intResultat;
                    delete this.strStep;

                    if (this.sprDividir) this.sprDividir.dispose();

                    break;
            }

            if (this.tweenPause) {
                this.tweenPause.onComplete.removeAll();
                this.tweenPause.stop();
                this.tweenPause = undefined;
            }

            this.dispose();
            this.game.state.clearCurrentState();
        }
    }
};

abacCalcState.prototype = Object.create(AbacSuper.prototype);
abacCalcState.prototype.constructor = abacCalcState;