
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var abacManualState = {

// --- CREATE I UPDATE ---
	init: function(strMode) {
		AbacSuper.call(this, strMode);
	},
	create: function(){
        this.recMenu; // Rectangle on està ubicat el menú
        this.blnLockGame = false;

        // Creem un sprite transparent de fons perque activi el "inputDown" al pintar
        var sprBg = game.add.sprite(0, 0, game.add.bitmapData(window.innerWidth, window.innerHeight));
        sprBg.inputEnabled = true;
        sprBg.events.onInputDown.add(function() {
                                        this.onBgDown();
                                    }, this);
        sprBg.events.onInputUp.add(function() {
                                        this.onBgUp();
                                    }, this);  
        
        // Posem el grpUI per sota del sprBg
        game.world.sendToBack(this.grpUI);

		// Grup per la Paperera, ha de estar a sota de tot.
        //  Posem la paperera en un grup a part de la UI, ja que el que pintem ha de anar sota la UI pero sobre la paperera
        this.grpTrash = new Grup();

        // Creem un nou objecte de tipus Painter (el encarregat de dibuixar al fons del abac)
        this.objPainter = new Painter();

        // --- INICIALITZACIÓ ---
		// Afegim el temps de pulsació perquè salti el event "onHold" i el event onHold
	    this.game.input.holdRate = 1000;
        this.game.input.onHold.add(this.holdBlock, this);

        // Botó per tornar al main menú
        this.btnExit = new CustomButton(0, 45*this.intScale, 'atlasIcons', null, 'btnBack');
        this.btnExit.anchor.setTo(0,0);
        this.btnExit.events.onInputUp.add(function() {
                                              this.goBack();
                                            }, this);
        
        this.grpUI.add(this.btnExit);


	    // Variables per carregar les icones i posar separador, segons si es abac zero o abac base
	    if (this.strMode === 'zero') {
            this.addIconChanger();
            var strAtlasCont = 'atlasContZero';
            var strCounter = 'countU';
            var strUmenu = 'U1menuDU';
            var strDmenu = 'D1menuDU';
        }
        else {
            var strAtlasCont = 'atlasContJunior';
            var strCounter = 'count';
            var strUmenu = 'U1menu';
            var strDmenu = 'D1menu';
        }


        // Posem el grpUI per sobre les pintades i les papereres, pq les linees quedin per sota
        game.world.bringToTop(this.grpUI);
        
        // Inicialitzem el tauler on "viuen" els blocs
        this.objBoard = new Tauler(window.innerWidth, 0, strCounter);

        // Calculem la distància entre els sprites del menú
        if (this.strMode === 'zero') {
			var xPaddingMenu = (this.objBoard.getSprContador().width*0.85);
		}
        else {
        	var xPaddingMenu = (this.objBoard.getSprContador().width*0.228);
        }

        // intPosicioY és a la posició y on s'han de posar els sprites del menú superior
        var intPosicioY = 20*this.intScale;

        // Creem el sprite de la paperera, que borra linees i cubs
        this.btnTrash = game.add.button(window.innerWidth, window.innerHeight - (45*this.intScale), 
                                        'atlasIcons', this.clearScreen, this, 'btnTrashUp', 
                                        'btnTrashUp', 'btnTrashDown');
        this.btnTrash.anchor.setTo(0,1);
        this.btnTrash.scale.setTo(this.intScale);
        this.grpTrash.add(this.btnTrash);

        this.btnTrash.setDownSound(SoundManager.getSndBtn());
        this.btnTrash.setUpSound(SoundManager.getSndDelAll());

        // Creem el sprite de la goma, que borra només linees
        this.btnClean = game.add.button(window.innerWidth, this.btnTrash.y - 165*this.intScale, 
                                        'atlasIcons', this.cleanLines, this, 'btnLinesUp',  
                                        'btnLinesUp', 'btnLinesDown');
        this.btnClean.anchor.setTo(0,1);
        this.btnClean.scale.setTo(this.intScale);
        this.btnClean.setDownSound(SoundManager.getSndDelAll());
        this.grpTrash.add(this.btnClean);
        

        // Creem la imatge del contador
        var imgContador = this.objBoard.getSprContador();

        // Afegim el recuadre que ocupa el rectangle a la variable 'this.recMenu'
        this.setRecMenu(imgContador);
        
        // Posem la imatge de contador al grpUI
        this.grpUI.add(imgContador);

        // Si hi ha imatge del contador de desena la posem també al grup
        if (this.objBoard.getSprContDes()) this.grpUI.add(this.objBoard.getSprContDes());

        // Creem el bloc de menú de la Unitat
        this.sprUnitat = new SpriteBase(this.objBoard.getSprContador().x - 55*this.intScale, 
                            185*this.intScale, strAtlasCont, strUmenu, false, true);

        this.sprUnitat.anchor.setTo(1,0.5);
        this.grpUI.add(this.sprUnitat);
        this.sprUnitat.events.onInputDown.add(function() {
                                              this.createBlockMenu('U1');
                                            }, this); // Si es clica cridem la funció createBlockMenu()

        // Creem el bloc de menú de la Desena
        this.sprDesena = new SpriteBase(this.sprUnitat.x - xPaddingMenu, 
                                    this.sprUnitat.y, strAtlasCont, strDmenu, false, true);
        this.sprDesena.anchor.setTo(1,0.5);
        this.grpUI.add(this.sprDesena);
        this.sprDesena.events.onInputDown.add(function() {
                                                this.createBlockMenu('D1');
                                            }, this); // Si es clica cridem la funció createBlockMenu()

        // Si és Abac Teen creem tmb els sprites de menú de cerntena i miler
        if (this.strMode === 'teen') {
            this.sprCentena = new SpriteBase(this.sprDesena.x - xPaddingMenu, 
                                        this.sprUnitat.y, 'atlasContJunior', 'C1menu', false, true);
            this.sprCentena.anchor.setTo(1,0.5);
            this.grpUI.add(this.sprCentena);
            this.sprCentena.events.onInputDown.add(function() {
                                                  this.createBlockMenu('C1');
                                                }, this); // Si es clica cridem la funció createBlockMenu()

            this.sprMilena = new SpriteBase(this.sprCentena.x - xPaddingMenu, 
                                        this.sprUnitat.y, 'atlasContJunior', 'M1menu', false, true);
            this.sprMilena.anchor.setTo(1,0.5);
            this.grpUI.add(this.sprMilena);
            this.sprMilena.events.onInputDown.add(function() {
                                                  this.createBlockMenu('M1');
                                                }, this); // Si es clica cridem la funció createBlockMenu()
        }
        // Si es Abac 0, posem per defecte que el bloc de Desena del menú sigui invisible
        else {
            this.sprDesena.visible = false;
            this.sprDesena.inputEnabled = false;
        }
	},
    update: function() {

        // Primer comprovem si estem arrossegant un bloc
        if (this.sprCurrentDrag && this.sprCurrentDrag.alive) {
            // Si el 'currentDrag' no s'està arrossegant, vol dir que l'acabem de crear
            if (!this.sprCurrentDrag.isDragged) {
                this.moveJustCreatedBlock();
                if (this.sprCurrentDrag === undefined) return;
            }
            
            var grpComprovar = this.objBoard.getMyGroup(this.sprCurrentDrag.getPotencia());

            // Comprovem si està superposat al contador per posarlo transparent
            this.counterOverlap(this.sprCurrentDrag);

            // Comprovem si el sprite està sobre la paperera
            this.checkDeleteBlock();

            // Si s'acaba de crear el sprite, comprovem quins s'estàn superposant per no sumarlos
            if (this.sprCurrentDrag.blnJustCreated) {
                this.addNoSumBlock(grpComprovar, this.sprCurrentDrag);
                return;
            }
            // Si el que estem arrossegant no es justCreated i te algo a la llista de noSumar, comprovem si s'ha de treure
            else if (this.sprCurrentDrag.getNoSumar().length > 0) {
                this.removeNoSumBlock(grpComprovar, this.sprCurrentDrag);
            }

            // Si estem arrossegant una desena en abac 0, no hem de comprovar les colisions
            if (this.sprCurrentDrag.getPotencia() == 'D' && this.strMode == 'zero'
                 || this.sprCurrentDrag.getPotencia() == 'M') return;
            
            // Si hi ha mes de un sprite, comprovem les coalisions entre ells
            if (grpComprovar.length > 1) {

                // Iterem per tots els sprites del grup per comprovar les coalisions
                for (var i = 0; i <= grpComprovar.length-1; i++) {
                    var sprCompovar = grpComprovar.getAt(i);

                    // Si es el mateix sprite, o el sprite esta mort, fem un continue
                    if (this.sprCurrentDrag === sprCompovar || !sprCompovar.alive) continue;

                    // Comprovem si s'estan superposant
                    if (game.physics.arcade.overlap(this.sprCurrentDrag, sprCompovar, null, null, this)) {

                        // Comrpovem que el sprite que se superposa no estigui a la llista
                        if (!this.sprCurrentDrag.isInNoSumar(i)) {

                            // Si no està a la llista, fem la suma, i sortim del bucle.
                            this.sumBlocksSon(this.sprCurrentDrag, sprCompovar);

                            // Si estem en l'abac 0, mirem si s'ha de mostrar el contador de desenes
                            if (this.strMode == 'zero') {
                                if (!this.sprDesena.visible && (this.objBoard.getTotalGrup('D') > 0)) {
                                    this.showCountDes(true);
                                }    
                            }

                            // Comprovem si s'ha de bloquejar el menú
                            this.lockMenu();
                            
                            break;
                        }
                    }
                }
            }

            // Destruïm tots els morts :D
            while (grpComprovar.countDead() > 0) {
                grpComprovar.getFirstDead().dispose();
            };
        }
        // Comprovem si estem pintant dibuixos
        else if (this.objPainter.isDrawing()) {
            if (!this.objPainter.drawLine(this.game.input.activePointer.x, this.game.input.activePointer.y)) {
                this.onBgUp();
            }
        }
        // Comprova si s'ha de borrar objecte dibuixat arrossegant-lo a la paperera
        else {
            var objDrag = this.objPainter.getByProperty('isDragging'); 
            if (objDrag) {
                if (Phaser.Rectangle.intersects(objDrag.getBounds(), this.btnClean.getBounds())) {
                    objDrag.blnDelete = true;
                    objDrag.alpha = 0.6;
                    this.btnClean.setFrames('btnLinesDown','btnLinesDown','btnLinesDown', 'btnLinesDown');
                }
                else if (objDrag.children.length > 0) {
                    if (Phaser.Rectangle.intersects(objDrag.children[0].getBounds(), this.btnClean.getBounds())) {
                        objDrag.blnDelete = true;
                        objDrag.alpha = 0.6;
                        this.btnClean.setFrames('btnLinesDown','btnLinesDown','btnLinesDown', 'btnLinesDown');
                    }
                    else if (objDrag.blnDelete) {
                        objDrag.blnDelete = false;
                        objDrag.alpha = 1;
                        this.btnClean.setFrames('btnLinesUp','btnLinesUp','btnLinesDown', 'btnLinesUp'); 
                    }
                }
                else if (objDrag.blnDelete) {
                    objDrag.blnDelete = false;
                    objDrag.alpha = 1;
                    this.btnClean.setFrames('btnLinesUp','btnLinesUp','btnLinesDown', 'btnLinesUp'); 
                }
            }
            else {
                var objDelete = this.objPainter.getByProperty('blnDelete');
                if (objDelete) {
                    SoundManager.playSound('del');
                    objDelete.dispose();
                    this.objPainter.countLines--;
                    
                    //this.game.time.events.add(150, function() {
                    this.btnClean.setFrames('btnLinesUp','btnLinesUp','btnLinesDown', 'btnLinesUp'); 
                    if (this.objPainter.grpLines.length === 0) {
                        game.input.enabled = false;
                        this.tweenLines(false);
                    }
                    //}, this);
                }
            }
        }
    },
// --- END CREATE I UPDATE --- 


// --- RECTANGLE DE MENÚ ---
    setRecMenu: function(imgMenu) {
        if (imgMenu) this.recMenu = Tools.getBounds(imgMenu);
        else this.recMenu = undefined;
    },
    addRecMenu: function(imgMenu) {
        var newRec = Tools.getBounds(imgMenu);
        this.recMenu.x = newRec.x;
        this.recMenu.width += newRec.width;
    },
    intersectMenu: function(rec) {
        if (!this.recMenu) return false;
        return !(this.recMenu.right < rec.x || this.recMenu.bottom < rec.y || this.recMenu.x > rec.right || this.recMenu.y > rec.bottom);
    },
    intersectMenuPoint: function(x, y) {
        if (!this.recMenu) return false;
        return !(this.recMenu.right < x || this.recMenu.bottom < y || this.recMenu.x > x || this.recMenu.y > y);
    },
    getBottomMenu: function(){
        return this.recMenu.bottom;
    },
    lockMenu: function() {
        if (this.strMode == 'zero') {
            var totalUnitats = this.objBoard.getGrpUnitats().getTotalGrup();
            var totalDesenes = this.objBoard.getGrpDesenes().getTotalGrup();
            var total = (totalDesenes*10) + totalUnitats;

            if (this.sprUnitat.inputEnabled && total >= 99) {
                this.sprUnitat.setEnabled(false);
            }
            if (!this.sprUnitat.inputEnabled && total < 99) {
                this.sprUnitat.setEnabled(true);
            }
        }
        else {
            if (this.objBoard.getTotalBlocks() > 99) {
                this.blnLockGame = true;
                this.sprUnitat.setEnabled(false);
                this.sprDesena.setEnabled(false);
                this.sprCentena.setEnabled(false);
                this.sprMilena.setEnabled(false);
            }
            else if (this.sprUnitat.alpha == 0.5) {
                this.blnLockGame = false;

                this.sprUnitat.setEnabled(true);
                this.sprDesena.setEnabled(true);
                this.sprCentena.setEnabled(true);
                this.sprMilena.setEnabled(true);
            }
        }
    },
    counterOverlap: function(objBlock) {
        if (this.intersectMenu(objBlock.getBounds())) {
            if (objBlock.alpha === 1) {
                objBlock.alpha = 0.6;
            }
        }
        else if (objBlock.alpha === 0.6) objBlock.alpha = 1;
    },
    showCountDes: function(blnEnable) {
        var intAlphaCont;
        var intAlphaSprFrom;
        var intAlphaSprTo;

        if (blnEnable) {
            intAlphaCont = 1;
            intAlphaSprFrom = 0;
            intAlphaSprTo = 0.5;
            this.addRecMenu(this.objBoard.getSprContDes());
        }
        else {
            intAlphaCont = 0;
            intAlphaSprFrom = 0.5;
            intAlphaSprTo = 0;
            this.setRecMenu(this.objBoard.getSprContador());
        }

        this.objBoard.tweenContDes(intAlphaCont);
        this.sprDesena.visible = blnEnable;
        this.sprDesena.alpha = intAlphaSprFrom;
        this.sprDesena.inputEnabled = false;
        this.tweenManager = game.add.tween(this.sprDesena); // Creem el tween
        this.tweenManager.to({alpha:intAlphaSprTo}, 400, Phaser.Easing.Linear.None,true); // Fem el fade-in
    },
// --- END RECTANGLE DE MENÚ ---


// --- CANVIAR ICONES EN L'ÀBAC ZERO ---
    addIconChanger: function() {
        // Grup per al dispensador de icones (create)
        this.grpIconChanger = new Grup();
        this.grpIconChanger.visible = false;
        this.grpIconChanger.alpha = 0;
        
        var xPadding =  (20*this.intScale);
        this.btnIconChanger = game.add.button(0, window.innerHeight - (45*this.intScale), 'atlasIcons', null, this, 'btnFaceUp',  'btnFaceUp', 'btnFaceDown');
        this.btnIconChanger.anchor.setTo(0,1)
        this.btnIconChanger.scale.setTo(this.intScale);
        this.btnIconChanger.setDownSound(SoundManager.getSndBtn());

        this.grpUI.add(this.btnIconChanger);
        this.btnIconChanger.events.onInputUp.add(this.displayIconChanger, this);

        this.cub = new CustomButton((this.btnIconChanger.width*1.85) + xPadding,this.btnIconChanger.y, 'atlasIcons', null, 'btnCube');
        this.cub.scale.setTo(this.intScale);
        this.cub.events.onInputUp.add(function() {
                                                	this.changeIcons('zero');
                                                }, this);
        this.grpIconChanger.add(this.cub);
        this.cub.anchor.setTo(1,1);
        this.xCub = this.cub.x;

        this.bear = new CustomButton(this.cub.x + xPadding + this.cub.width,this.btnIconChanger.y, 'atlasIcons', null, 'btnBear');
        this.bear.scale.setTo(this.intScale);
        this.bear.events.onInputUp.add(function() {
                                                    this.changeIcons('bear');
                                                }, this);
        this.grpIconChanger.add(this.bear);
        this.bear.anchor.setTo(1,1);
        this.xBear = this.bear.x;

        this.car = new CustomButton(this.bear.x + xPadding + this.bear.width,this.btnIconChanger.y, 'atlasIcons', null, 'btnCar');
        this.car.scale.setTo(this.intScale);
        this.car.events.onInputUp.add(function() {
                                                	this.changeIcons('car');
                                                }, this);
        this.grpIconChanger.add(this.car);
        this.car.anchor.setTo(1,1);
        this.xCar = this.car.x;        

        this.bulb = new CustomButton(this.car.x + xPadding + this.car.width,this.btnIconChanger.y, 'atlasIcons', null, 'btnBulb');
        this.bulb.scale.setTo(this.intScale);
        this.bulb.events.onInputUp.add(function() {
                                                    this.changeIcons('bulb');
                                                }, this);
        this.grpIconChanger.add(this.bulb);
        this.bulb.anchor.setTo(1,1);
        this.xBulb = this.bulb.x;
    },

    displayIconChanger: function() {
        // executem el display si el tween no existeix, o si no s'està executant
        if (!this.tweenManager || !this.tweenManager.isRunning) {
            
            this.bulb.setEnabled(false)
            this.car.setEnabled(false)
            this.bear.setEnabled(false)
            this.cub.setEnabled(false)

            if (this.grpIconChanger.alpha == 0) { // Si estan invisibles els mostrem

               

                this.grpIconChanger.visible = true; // Mostrem el grup

                this.tweenManager = game.add.tween(this.grpIconChanger); // Creem el tween
                this.tweenManager.to({alpha: 1},500,Phaser.Easing.Linear.None,true); // Fem el fade-in


                // EL ALPHA ACABA DESPRES DEL MOVIMENT
                this.tweenManager = game.add.tween(this.bulb)
                    .to({x: this.bulb.x + (this.bulb.width*0.3)}, 300)
                    .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
                    .start();
                
                this.tweenManager = game.add.tween(this.car)
                    .to({x: this.car.x + (this.car.width*0.25)}, 400)
                    .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
                    .start();

                this.tweenManager = game.add.tween(this.bear)
                    .to({x: this.bear.x + (this.bear.width*0.20)}, 500)
                    .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
                    .start();

                this.tweenManager = game.add.tween(this.cub)
                    .to({x: this.cub.x + (this.cub.width*0.15)}, 600)
                    .easing(Phaser.Easing.Bounce.Out) // Afegim bounce
                    .start();
                    
                game.input.maxPointers = 0;
                this.tweenManager.onComplete.add(function() {
                    game.input.maxPointers = 1;
                    this.bulb.setEnabled(true)
                    this.car.setEnabled(true)
                    this.bear.setEnabled(true)
                    this.cub.setEnabled(true)
                }, this);
            }
            else {

                this.tweenManager = game.add.tween(this.grpIconChanger); // Creem el tween
                this.tweenManager.to({alpha: 0},300,Phaser.Easing.Linear.None,true); // Fem el fade-out
                this.tweenManager.onComplete.add(function(){this.grpIconChanger.visible = false;}, this); // En acabar ocultem el grup

               // Tween per amagar els sprites del iconChanger
                this.grpIconChanger.forEach(function(itemDispensador) {
                    this.tweenManager = game.add.tween(itemDispensador).to({x: itemDispensador.x - (itemDispensador.width*0.4)}, 300).start();
                }, this);

                this.tweenManager.onComplete.add(function() {
                    this.cub.x = this.xCub;
                    this.bear.x = this.xBear;
                    this.car.x = this.xCar;  
                    this.bulb.x = this.xBulb;

                }, this);
                
            }
        }
        else {
            return;
        }
    },

    changeIcons: function(strIcon) {
        if (!this.tweenManager || !this.tweenManager.isRunning) {
            this.strBlockImg = strIcon;
            this.displayIconChanger();
            this.objBoard.changeIcons(strIcon);
        }  
    },

    checkHideIconChanger: function() {
        if (this.strMode == 'zero' && this.grpIconChanger.alpha == 1) {
            this.displayIconChanger();
        }
    },
// --- END CANVIAR ICONES EN L'ÀBAC ZERO ---


// --- CREAR I MOURE BLOCS ---
    createBlockMenu: function(strKey) {

        //var newBlock = this.createBlock(this.game.input.x, this.game.input.y, frameName[0], frameName[1], true);
        var newBlock = new SpriteBase(this.game.input.x, this.game.input.y,'atlasCubs'+this.strBlockImg, strKey, false, true);
        
        newBlock.tweenSizeCreate(300);

        // Per saber el tamany del block, esperem a que acabi el tween i le definim a widthUnit si no esta definit
        if (!this.widthUnit) {
            game.time.events.add(400, function() {
                this.widthUnit = 116*this.intScale;
            }, this);
        }
        
        // Afegeix el sprite al grup que toca ( M/C/D/U )
        this.objBoard.addSpriteToGroup(newBlock);        

        //newBlock.body.collideWorldBounds = true;
        newBlock.anchor.setTo(0.5, 0.5);

        // Activem el drag
        newBlock.input.enableDrag(true, true);

        game.world.bringToTop(this.objBoard.getMyGroup(strKey.substring(0,1)));
        if (this.strMode == 'zero')  game.world.bringToTop(this.grpIconChanger);

        newBlock.input.dragFromCenter = false;

        // Setejem el sprite que acabem de crear com a "currentDrag"
        this.sprCurrentDrag = newBlock;

        // Comprovem si s'ha de amagar el iconChanger (nomes abac 0)
        this.checkHideIconChanger();
    },
    // Moure un sprite que s'acaba de crear desde menú
    moveJustCreatedBlock: function() {

        // Quan aquí es detecta el inputUp, es neteja el sprCurrentDrag
        if (game.input.activePointer.isUp) {
            
            if (this.sprCurrentDrag.isBorrar()) {
                this.deleteBlock(this.sprCurrentDrag);
            }
            else if (!this.sprCurrentDrag.getEnJoc()) {
                this.sprCurrentDrag.destroy();
            } 
            else {
                this.dropBlock(this.sprCurrentDrag);
            }

            this.sprCurrentDrag = undefined;
        }
        // Si no hi ha inpUp vol dir que seguim arrossegant el bloc
        else {
            // Movem el sprite en qüestió
            this.sprCurrentDrag.input.updateDrag(game.input.activePointer);

            // Si el sprite no toca al rectangle i no està en joc, el posem en joc.
            if (!this.intersectMenu(this.sprCurrentDrag.getBounds()) && !this.sprCurrentDrag.getEnJoc()) {

                this.sprCurrentDrag.setEnJoc(true);

                // Si només hi ha un bloc en el tauler al posar el sprite en joc, mostrem la paperera
                if (this.objBoard.getTotalBlocks() === 1) {
                    this.tweenTrash(true);
                }

                // Li afegim al bloc les funcions de InputUp i InputDown
                this.addInputsBlock(this.sprCurrentDrag);

                // Agafem el total del grup, i n'actualitzem el contador
                var intGroupTotal = this.objBoard.getTotalGrup(this.sprCurrentDrag.getPotencia());
                this.objBoard.actualitzarContador(this.sprCurrentDrag.getPotencia(), intGroupTotal);

                // Reproduïm el so de 'create'
                SoundManager.playSound('create');

                // Comprovem si s'ha de bloquejar el menú (maxim de sprites en pantalla)
                this.lockMenu();
                
            }; 
        }
    },
    addNoSumBlock: function(grpCheck, sprBlock) {
        // Quan es crea un sprite, els altres sprites que estan superposts 
        //   durant el blnJustCreated s'afegeixen a aquesta llista
        if (grpCheck.length > 1) {
            for (var i = 0; i <= grpCheck.length-1; i++) {
                if (sprBlock != grpCheck.getAt(i) && !sprBlock.isInNoSumar(i)) {
                    if (game.physics.arcade.overlap(grpCheck.getAt(i), sprBlock, 
                                                null, null, this)) {
                        sprBlock.addNoSumar(i); 
                    }
                }
            }
        }
    },
    removeNoSumBlock: function(grpCheck, sprBlock) {
        var arrNosumar = sprBlock.getNoSumar();
        for (var i = 0; i <= arrNosumar.length-1; i++) {
            var id = arrNosumar[i];
            if (!game.physics.arcade.overlap(grpCheck.getAt(id), sprBlock, null, null, this)) {
                sprBlock.removeNoSumar(id);
            }
        }
    },
    sumBlocksSon: function(spr1, spr2) {
        if (this.blnLockGame) return;
        var arrPotencies = this.sumBlocks(spr1, spr2);
        for (var i = arrPotencies.length - 1; i >= 0; i--) {
            var sprBlock = this.objBoard.getMyGroup(arrPotencies[i]).getTop();
            this.addInputsBlock(sprBlock);
        };
    },
    createBlockSon: function(x, y, power, num) {
        this.createBlock(x, y, power, num, true);
        var sprBlock = this.objBoard.getMyGroup(power).getTop();
        this.addInputsBlock(sprBlock);
        return sprBlock;
    },
    addInputsBlock: function(sprBlock) {
        sprBlock.input.enableDrag(true, true);
        sprBlock.input.dragFromCenter = false;
        sprBlock.events.onInputDown.add(function() {
															this.inputDownSprite(sprBlock);
														}, this);    
            
        sprBlock.events.onInputUp.add(function() {
														this.dropBlock(sprBlock);
													}, this);
    },
    inputDownSprite: function(sprBlock) {

        // Comprovem si s'ha de amagar el iconChanger (nomes abac 0)
        this.checkHideIconChanger();

        this.sprCurrentDrag = sprBlock;
        var grpCurrent = this.objBoard.getMyGroup(sprBlock.getPotencia());

        // Posem el grup al que pertany al primer del z-index
        game.world.bringToTop(grpCurrent);
        if (this.strMode == 'zero')  game.world.bringToTop(this.grpIconChanger);
        
        
        // Si s'acaba de apretar aquest sprite i no es una centena, el dupliquem
        if (sprBlock.blnJustPressed) {

            if (this.blnLockGame) return;
            // Si és abac 0, comprovem quin es el valor de D+U que hi ha en joc
            if (this.strMode == 'zero') {
                if (sprBlock.getPotencia() == 'D') {
                    sprBlock.tweenSize(100);
                    return;
                }
                else {
                    var totalUnitats = this.objBoard.getGrpUnitats().getTotalGrup();
                    var totalDesenes = this.objBoard.getGrpDesenes().getTotalGrup()*10;
                    var valAdd = sprBlock.getValor();
                    if (sprBlock.getPotencia() == 'D') valAdd*=10;
                    var total = totalUnitats + totalDesenes + valAdd;
                    if (total >= 99) {
                        sprBlock.tweenSize(100);
                        return;    
                    }
                }
            }

            // Comprovem si el sprite és creara sobre el menú, si és així el posicionem sota el sprite que estem duplicant
            var intY = sprBlock.y - sprBlock.height - (40*this.intScale);
            if (intY < 0) intY = sprBlock.y + sprBlock.height + (40*this.intScale);

            // Creem el nou sprite
            var newBlock = this.createBlockSon(sprBlock.x + (40*this.intScale), intY, 
                            sprBlock.getPotencia(),
                            sprBlock.getValor());
            newBlock.tweenSize(100);
           
            //this.sndMult.play();
            SoundManager.playSound('mult');
            // Passem el moureSpriteCalculadora per actualitzar el contador del tauler on apareix
            // OJUUUU AL FILL!
            if (this.strMode === 'mult') this.moveBlockCalc(newBlock);

            // Mirem si el nou sprite creat està superposat al tauler per aplicarli transpaténcia.
            //this.contadorSuperposat(newBlock, 60);

            // I actualitzem el contador
            this.objBoard.actualitzarContador(newBlock.getPotencia(), grpCurrent.getTotalGrup());
            this.lockMenu();
            if (this.strMode == 'mult') {

                this.objBoard.addValue(newBlock.getPotencia());
                
                // Unitats igual al multiplicador
                if (this.objBoard.cntMultU.quant == this.intCalc2) {
                    this.objBoard.countOk('U');
                }

                // Desenes igual al multiplicador
                if (this.objBoard.cntMultD.quant == this.intCalc2
                        || this.objBoard.cntMultD.quant == 0) {
                    this.objBoard.countOk('D');
                }

            }

        } else {
            sprBlock.blnJustPressed = true;
        }
    },
    dropBlock: function(sprBlock) {
        this.sprCurrentDrag = undefined;

        Tools.repositionBlock(sprBlock);
        if (sprBlock.isBorrar()) this.deleteBlock(sprBlock);
        
        if (!sprBlock.isBorrar() && this.intersectMenu(sprBlock.getBounds())) {
            sprBlock.y = this.getBottomMenu() + (sprBlock.height/2);
            sprBlock.alpha = 1;
        }
        else if (sprBlock.isBorrar() && this.strMode == 'zero') {
            this.lockMenu();
        }
    },
    holdBlock: function() {
        switch (this.strMode) {
            case 'zero':
                this.game.input.onHold.add(this.holdBlockZero, this);
                break;
            case 'teen':
                this.game.input.onHold.add(this.holdBlockTeen, this);
                break;
        }
    },
    holdBlockZero: function() {
        if (this.sprCurrentDrag && this.sprCurrentDrag.key.substring(0,2) != 'U1' 
            && this.objBoard.checkSplitZero(this.sprCurrentDrag)) {

            var intValor = this.sprCurrentDrag.getValor();
            var strSound = 'div';

            if (this.sprCurrentDrag.getPotencia() == 'D') {
                if (this.sprCurrentDrag.getValor() == 1) {
                    strSound = 'divInf';
                    intValor *= 10;
                }
                else {
                    return;
                }
            }

            var xInBlock = game.input.x - this.sprCurrentDrag.getBounds().x;
            var blockInputLeft = Math.ceil(xInBlock/this.widthUnit) - 1;
            var blockInputRight;

            // Si el valor que queda a la esquerra es le mateix que el intValor, no farem res
            if (intValor == blockInputLeft) {
                return
            }
            else if (blockInputLeft == 0) {
                blockInputLeft = 1;
                blockInputRight = intValor - 1;
            }
            else if (blockInputLeft >= intValor) {
                blockInputLeft = intValor;
                blockInputRight = 1;
            }
            else {
                blockInputRight = intValor - blockInputLeft;
            }
            
            var xModificador = 0;
            var sprLeft = this.createBlockSon(game.input.x, this.sprCurrentDrag.y, 'U', blockInputLeft);
            sprLeft.x -= sprLeft.width/2;

            var sprRight = this.createBlockSon(game.input.x, this.sprCurrentDrag.y, 'U', blockInputRight);
            sprRight.x += sprRight.width/2;

            if (sprLeft.x < 0) {
                sprLeft.x += sprLeft.width/2;
                sprRight.x += sprLeft.width/2;
            }

            if (sprRight.x > window.innerWidth) {
                sprLeft.x -= sprRight.width/2;
                sprRight.x -= sprRight.width/2;
            }

            this.tweenManager = game.add.tween(sprLeft)
                .to({ x: sprLeft.x - (60*this.intScale) }, 200, Phaser.Easing.Linear.None, true);

            this.tweenManager = game.add.tween(sprRight)
                .to({ x: sprRight.x + (60*this.intScale)}, 200, Phaser.Easing.Linear.None, true);

            // Quan acabi el tween, comprovem si el bloc de la dreta està damunt de el contador
            this.tweenManager.onComplete.add(function() {
                this.counterOverlap(sprRight);
            }, this);

            this.sprCurrentDrag.dispose();
            this.sprCurrentDrag = undefined;   

            this.objBoard.actualitzarTotsContadors();
            SoundManager.playSound(strSound);        
        }
    },
    holdBlockTeen: function() {

        // Si el sprite del que estem fent el hold es una unitat, no cal comprovar res, no se separa en res
        if (this.blnLockGame || this.sprCurrentDrag === undefined || this.sprCurrentDrag.frameName === 'U1') return;

        // Llençar el comprovar de cada tauler
        var strPow = this.sprCurrentDrag.getPotencia();

        this.objBoard.checkSplitTeen(this.sprCurrentDrag);

        if (this.objBoard.getArrSpritesSeparats().length > 0) {
            var strSound = 'div';
            this.sprCurrentDrag = undefined;
            var arrNewBlocks = this.objBoard.getArrSpritesSeparats();

            var arrTemp = [];
            for (var i = 0; i < arrNewBlocks.length; i++) {
                var nouSpr = this.createBlockSon(this.game.input.x, this.game.input.y, arrNewBlocks[i][2], arrNewBlocks[i][3]);
                arrTemp.push(nouSpr);
                this.tweenManager = game.add.tween(nouSpr).to({ x: arrNewBlocks[i][0], y: arrNewBlocks[i][1] }, 200, Phaser.Easing.Linear.None, true);
            }


            if (strPow != arrTemp[0].getPotencia()) strSound = 'divInf';

            this.objBoard.resetArrSpritesSeparats();    
            this.objBoard.actualitzarTotsContadors();
            SoundManager.playSound(strSound);

            // Quan acabi el tween, comprovem si el bloc està damunt de el contador
            this.tweenManager.onComplete.add(function() {
                for (var i = 0; i < arrTemp.length; i++) {
                    this.counterOverlap(arrTemp[i]);
                }
                this.lockMenu();
            }, this);
        }
    },
// --- END CREAR I MOURE BLOCS ---
    

// --- BORRAR BLOCKS I LINEES ---
    checkDeleteBlock: function() {
        // Coalisio amb la paperera per borrar sprite
        if (Phaser.Rectangle.intersects(this.sprCurrentDrag.getBounds(), this.btnTrash.getBounds())) {
            this.sprCurrentDrag.setBorrar(true);
            this.sprCurrentDrag.alpha = 0.7;
            this.btnTrash.setFrames('btnTrashActDown','btnTrashActDown','btnTrashActDown', 'btnTrashActDown');
        }
        else if (this.sprCurrentDrag.isBorrar()) {
            this.sprCurrentDrag.setBorrar(false);
            this.sprCurrentDrag.alpha = 1;
            this.btnTrash.setFrames('btnTrashUp','btnTrashUp','btnTrashDown', 'btnTrashUp');    
        }
    },
    deleteBlock: function(sprBlock) {
        if (!this.btnTrash) return;
        sprBlock.inputEnabled = false;
        SoundManager.playSound('del');  

        this.tweenManager = game.add.tween(sprBlock) 
            .to({x: this.btnTrash.x + (this.btnTrash.width/2), y: this.btnTrash.y - (this.btnTrash.height/1.5)}, 400) // Desplaçament del tween
            .start(); 
        this.tweenManager = game.add.tween(sprBlock.scale) 
            .to({x: 0, y: 0},400,Phaser.Easing.Linear.None,true)
            .start();
        
        if (this.objBoard.getTotalBlocks() === sprBlock.getValor()) {
            game.input.enabled = false;
            this.grpUI.enableItemsFilter(false, 'menu');
        }

        this.tweenManager.onComplete.add(function() {
            sprBlock.kill();
            this.objBoard.actualitzarTotsContadors();
            
            if (this.strMode === 'mult') {
                this.solveOperation();
                this.btnTrash.setFrames('btnTrashUp','btnTrashUp','btnTrashUp', 'btnTrashUp');
            }
            else {
                this.btnTrash.setFrames('btnTrashUp','btnTrashUp','btnTrashDown', 'btnTrashUp');    
            }
            
            sprBlock.dispose();

            if (this.objBoard.getTotalTauler() === 0) {
                this.tweenTrash(false);
            }
            this.lockMenu();
        }, this);
    },
    clearScreen: function(){
        // Comprovem si s'ha de amagar el iconChanger (nomes abac 0)
        this.checkHideIconChanger();

        game.input.enabled = false;
        this.sprCurrentDrag = undefined;
        this.grpUI.enableItemsFilter(false, 'menu');

        this.objBoard.netejarTaulerTween();

        this.game.time.events.add(1000, function() {
            this.tweenLines(false);
            this.tweenTrash(false);
            this.lockMenu();
        }, this);

        this.objPainter.clearPainter();
    },
    cleanLines: function() {
        // Comprovem si s'ha de amagar el iconChanger (nomes abac 0)
        this.checkHideIconChanger();

        game.input.enabled = false;
        this.objPainter.clearPainter();
        this.tweenLines(false);
    },
    tweenLines: function(bln) {
        if (bln && this.btnClean.x === window.innerWidth) {
            this.tweenManager = game.add.tween(this.btnClean) 
                .to({x: this.btnClean.x-this.btnClean.width}, 400) // Desplaçament del tween
                .easing(Phaser.Easing.Bounce.Out)
                .start();
        }
        else if (this.btnClean.x === window.innerWidth-this.btnClean.width) {
            this.tweenManager = game.add.tween(this.btnClean) 
                .to({x: this.btnClean.x + this.btnClean.width}, 300) // Desplaçament del tween
                .start(); 

            this.tweenManager.onComplete.add(function() {
                if (!game.input.enabled) game.input.enabled = true;
            }, this);
        }
    },
    tweenTrash: function(bln) {
        if (bln && this.btnTrash.x === window.innerWidth) {
            this.tweenManager = game.add.tween(this.btnTrash) 
                .to({x: this.btnTrash.x-this.btnTrash.width}, 400) // Desplaçament del tween
                .easing(Phaser.Easing.Bounce.Out)
                .start();
        }
        else if (this.btnTrash.x === window.innerWidth-this.btnTrash.width) {

            this.tweenManager = game.add.tween(this.btnTrash) 
                .to({x: this.btnTrash.x + this.btnTrash.width}, 300) // Desplaçament del tween
                .start();

            this.tweenManager.onComplete.add(function() {
                if (!game.input.enabled) game.input.enabled = true;
                this.grpUI.enableItemsFilter(true, 'menu');

                if (this.strMode === 'zero') {
                    this.showCountDes(false);
                }
            }, this);     
        }
    },
// --- END BORRAR BLOCKS I LINEES ---


// --- PINTAR ---
    onBgDown: function() {
        var _x = this.game.input.activePointer.x;
        var _y = this.game.input.activePointer.y;

        this.checkHideIconChanger();
        if (!this.objPainter.isTweenRunning()  
                && !this.intersectMenuPoint(_x, _y)
                && _x > 6
                && _x < (window.innerWidth-6) 
                && _y > 6
                && _y < (window.innerHeight-6)) {
            this.objPainter.startDrawLine(this.game.input.activePointer.x, this.game.input.activePointer.y);
        }
    },

    onBgUp: function() {
        if (this.objPainter.isDrawing()) {
            var blnOk = this.objPainter.stopDrawing();
            if (blnOk && this.objPainter.grpLines.length === 1 ) {
                this.tweenLines(true);
            }
        }
    },
// --- END PINTAR --- 


// --- DISPOSE ---
    clearSpritesCache: function() {
        // Netejem de la memòria caché les imatges utilitzades
        if (this.strMode === 'teen') {
            this.game.cache.removeImage('atlasContJunior') ;
            this.game.cache.removeImage('atlasCubscub');
        }
        else {
            this.game.cache.removeImage('atlasContZero');
            this.game.cache.removeImage('atlasCubszero');
            this.game.cache.removeImage('atlasCubsbear');
            this.game.cache.removeImage('atlasCubsbulb');
            this.game.cache.removeImage('atlasCubscar');
        }
    },

    shutdown: function () {
        if (this.blnClear) {
            this.clearSpritesCache();

            delete this.recMenu;
            delete this.blnLockGame;

            this.grpTrash.dispose();
            delete this.grpTrash;

            this.objPainter.dispose();
            delete this.objPainter;

            this.btnExit.dispose();
            delete this.btnExit;

            if (this.strMode == 'zero') {
                this.grpIconChanger.dispose();
                this.btnIconChanger.destroy();
            }

            this.btnTrash.destroy();
            delete this.btnTrash;

            this.btnClean.destroy();
            delete this.btnClean;

            this.dispose();

            this.game.state.clearCurrentState();
        }
    }
// --- END DISPOSE ---
};

abacManualState.prototype = Object.create(AbacSuper.prototype);
abacManualState.prototype.constructor = abacManualState;