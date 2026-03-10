
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var calculadoraState = {

	create: function() {
        // Booleana per comprovar que ja ha passat per al shutdown
        this.blnClear = true;
        this.blnWrongInput = false;

        var recFons = game.add.graphics(0,0); 
        recFons.beginFill(0x52BAD3, 0.25);
        recFons.drawRect(0, 0, window.innerWidth, window.innerHeight);
        recFons.endFill();

        // Variable per aplicar el reescalat
		var intScale = Tools.getScale();

        // Grup per a les imatges de la UI
        this.grpImg = new Grup();

        // Grup per als botons de la calculadora
        this.grpBtn = new Grup();

        // Grup per als botons de la calculadora
        this.grpLbls = new Grup();

        var ySuperior = 45*intScale;

        // Botó per tornar al main menú
        var btnExit = new CustomButton(0, ySuperior, 'atlasIcons', null, 'btnBack');
        btnExit.anchor.setTo(0,0);
        btnExit.events.onInputUp.add(function() {
                                              this.goBack();
                                            }, this);
        this.grpBtn.add(btnExit);

        // Botó per esborrar els numeros introduïts a la calculadora
        this.btnTrash = new CustomButton(window.innerWidth, window.innerHeight - ySuperior, 'atlasIcons', null, 'btnTrash');
        this.btnTrash.anchor.setTo(1,1);
        this.btnTrash.setUpSound(SoundManager.getSndDelAll());
        this.btnTrash.events.onInputUp.add(function() {
                                                this.netejarCalculadora();
                                            }, this);
        this.grpBtn.add(this.btnTrash);


        // --- SPRITES ON ES MOSTRA LA OPERACIÓ ---

        
        // Background de la calculadora
        var contenidor = new SpriteBase(window.innerWidth*0.5, window.innerHeight*0.3 ,'atlasCalc','bgCalc');
        contenidor.anchor.setTo(0.5,0);
        this.grpImg.add(contenidor);

        // Posem els sprites on es mostra la operació
        this.sprSimbol = new SpriteBase(window.innerWidth*0.5, window.innerHeight*0.2 ,'atlasCalc','symbBlank', true, true);
        this.sprSimbol.anchor.setTo(0.5,0.5);
        this.grpImg.add(this.sprSimbol);

        var numLeft = new SpriteBase(contenidor.x - (contenidor.width*0.5), this.sprSimbol.getCenterY() ,'atlasCalc','bgNum');
        numLeft.anchor.setTo(0,0.5);
        this.grpImg.add(numLeft);

        var numRight = new SpriteBase(contenidor.x + (contenidor.width*0.5), this.sprSimbol.getCenterY() ,'atlasCalc','bgNum');
        numRight.anchor.setTo(1,0.5);
        this.grpImg.add(numRight);


        // --- CREAR CALCULADORA ---

        // Creem la posició "intIniciX" per saber on van els botons de la columna de més a la esquerra.
        var intIniciX = contenidor.getMinX() + (contenidor.width*0.07);
        // La posició intX serà la que anirà incrementant per posar els botons de la dreta.
        var intX = intIniciX;

        var intIniciY = contenidor.getMinY() + (contenidor.height*0.1);
        var intY = intIniciY;

        // Creem la variable "widthBoto" per ubicar els botons de la dreta, i que sempre estiguin a la mateixa distància
        //   (si apliquessim cada vegada la amplada del botó que acabem de posar, tindrien tots els botons posicions diferents)
        var widthBoto;

        // Variables per posicionar els simbols de la calculadora
        var intXSimbols;
        var intYSum;
        var intYRes;
        var intYMult;

        // Bucle per crear els botons de numeros del 1 al 9
        for (var i = 1; i <= 9; i++) {
            // Creem el botó amb les posicions "intX" i "intY", i el numero (i) corresponent
        	var objBoto = new CustomButton(intX, intY, 'atlasCalc', null, 'btn' + i);
            objBoto.anchor.setTo(0,0);

            // Si la "widthBoto" no està definida, la definim
            if (!widthBoto) widthBoto = objBoto.width + 10*intScale;

            // Si el numero es 3, 6 o 9...
        	if (i == 3 || i == 6 || i == 9){
                // ... guardem a la variable corresponent les posicions x/y de els botons de suma resta i multiplicació
                switch (i) {
                    case 3:
                        intXSimbols = objBoto.getMaxX() + (20*intScale);
                        intYSum = objBoto.y;
                        break;
                    case 6:
                        intYRes = objBoto.y;
                        break;
                    case 9:
                        intYMult = objBoto.y;
                        break;
                }
                // ... reubiquem el "intX" al inici, i incrementem la posició Y per anar a la columa inferior
        		intX = intIniciX;
        		intY += objBoto.height + 10*intScale;
        	}
            // Sino, simplement incrementem la posició "intX" utilitzant la "widthBoto"
        	else {
        		intX += widthBoto + 10*intScale;
        	}
            
            // Hem de fer una funció per afegir una funció pq jabbascript és així de guay
            this.addFunction(objBoto); 

            // Afegim el botó al grup.
            this.grpBtn.add(objBoto);
        };

        // Afegim el botó del 0
        //   Com que a la última iteració del bucle hem incrementat el "intY"_ 
        //    _i reiniciat "intX", ja tenim la posció que toca
        var objBotoZero = new CustomButton(intIniciX, intY,'atlasCalc', null, 'btn0');
        objBotoZero.anchor.setTo(0,0);
        this.addFunction(objBotoZero);
        this.grpBtn.add(objBotoZero);


        // --- BOTONS DELS SIMBOLS ----

        this.btnSum = new CustomButton(intXSimbols, intYSum, 'atlasCalc', null, 'btnSumar');
        this.btnSum.anchor.setTo(0.5,0.5);
        this.btnSum.centrar();
        this.btnSum.events.onInputUp.add(function() { this.canviSimbol('+'); }, this);
        this.grpBtn.add(this.btnSum);

		this.btnRes = new CustomButton(intXSimbols, intYRes, 'atlasCalc', null, 'btnRestar');
        this.btnRes.anchor.setTo(0.5,0.5);
        this.btnRes.centrar();
        this.btnRes.events.onInputUp.add(function() { this.canviSimbol('-'); }, this);
        this.grpBtn.add(this.btnRes);

		this.btnMult = new CustomButton(intXSimbols, intYMult, 'atlasCalc', null, 'btnMultiplicar');
        this.btnMult.anchor.setTo(0.5,0.5);
        this.btnMult.centrar();
        this.btnMult.events.onInputUp.add(function() { this.canviSimbol('x'); }, this);
        this.grpBtn.add(this.btnMult);

        this.btnDiv = new CustomButton(intXSimbols, intY, 'atlasCalc', null, 'btnDividir');
        this.btnDiv.anchor.setTo(0.5,0.5);
        this.btnDiv.centrar();
        this.btnDiv.events.onInputUp.add(function() { this.canviSimbol('÷'); }, this);
        this.grpBtn.add(this.btnDiv);

        // Incrementem un últim cop la posició de Y per po'sar els botons de "OK" i "Corregir"
        intY += this.btnDiv.height + 40*intScale;
        
        // Quan entrem a la calculadora els botons dels simbols estan desactivats
        //this.enableBtnsSimbols(false);

        // Boto 'OK' per passar a la pantalla de abac amb la operació
        this.btnEnter = new CustomButton(intIniciX, intY, 'atlasCalc', null, 'btnIgual');
        this.btnEnter.anchor.setTo(0,0);
        //this.btnEnter.setEnabled(false);
        this.btnEnter.events.onInputUp.add(function() {
                                              this.resoldre();
                                            }, this);
        this.grpBtn.add(this.btnEnter);

        // Botó 'C' per corregir el últim que s'ha introduït qa la calculadora
        var btnCorregir = new CustomButton(intXSimbols, this.btnEnter.y, 
                                            'atlasCalc', null, 'btnClean');
        btnCorregir.anchor.setTo(0,0);
        btnCorregir.events.onInputUp.add(function() {this.corregir();}, this);
        this.grpBtn.add(btnCorregir);


        // Posicions per a les labels dels números
        var yLabels = numLeft.getCenterY();
        var xSeparador = 50*intScale;
        var xLeft = numLeft.getCenterX();
        var xRight = numRight.getCenterX();


        // Creem les labels on es mostraran els nombres de la calculadora
        this.lblNum1 = game.add.text(numLeft.getCenterX(), numLeft.getCenterY(),  '', {font: '80px vag', fill: '#91959A'});
        this.lblNum1.anchor.setTo(0.5,0.5);
        this.grpLbls.add(this.lblNum1);

        this.lblNum2 = game.add.text(numRight.getCenterX(), numRight.getCenterY(),  '', {font: '80px vag', fill: '#91959A'});
        this.lblNum2.anchor.setTo(0.5,0.5);
        this.grpLbls.add(this.lblNum2);

        // Creem el sprite que es mostra quan s'introdueix una operació incorrecte
        this.sprError = new SpriteBase(window.innerWidth - (15*intScale), window.innerHeight ,'atlasCalcExtra', 'ninotError');
        this.sprError.anchor.setTo(0.5, 0.5);
        this.sprError.alpha = 0;
        this.sprError.x -= (this.sprError.width*0.5);
        this.sprError.y -= (this.sprError.height*0.5);

        // Afegim la funció per desbloquejar la calculadora un cop es bloqueja _
        //   _després de introduïr una operació incorrecta
        this.game.input.onUp.add(this.resumeAfterWrongInput, this);
	},

    // Per afegir la funció insertNum als botons de la calculadora
    addFunction: function(objBoto) {
        var strValue = objBoto.frameName.substring(3,4);
        objBoto.events.onInputUp.add(function() {this.insertNum(strValue);}, this);        
    },

    // -- INTERACCIONS AMB LA CALCULADORA --

    insertNum: function(strNum) {
        // Comprovem que s'hagi de insertar nombre, si no, fem un return
        if (this.lblNum2.text.trim() >= 10 // si el num2 té un valor major a 10, vol dir que totes les caselles estàn plenes i no s'ha de insertar res mes
            || (this.sprSimbol.getTag() != '+' && this.sprSimbol.getTag() != '-' 
            && this.lblNum2.text.trim().length > 0)) { // Si el simbol és + o - i hi ha algun valor al num2, vol dir també que totes les caselles estàn plenes i no s'ha de insertar res mes

            return;
        }

        // Si la label 1 està plena, o el simbol te algun simbol assignat, omplim la label 2
        if (this.lblNum1.text.trim() > 10 || this.sprSimbol.getTag() != '') { 
            var lblActual = this.lblNum2;
        }
        else { // Si no, omplim la label 1
            var lblActual = this.lblNum1
        }
        
        // Si el num1 es major a 10 (dues caselles plenes) i no hi ha simbol, 
        //   _fem la animacio per indicar que s'ha de posar simbol
        if (this.lblNum1.text.trim() > 10 && this.sprSimbol.getTag() == '') {
            this.btnSum.tweenSize(100);
            this.btnRes.tweenSize(100);
            this.btnMult.tweenSize(100);
            this.btnDiv.tweenSize(100);
            return;
        }
        // Sino, afegim el nombre a la casella que correspon
        else {
            // Si la label esta buida, li posem el nombre
            if (lblActual.text.trim().length == 0) {
                lblActual.text = ' '+strNum+ ' ';    
            }
            // Si ja te un valor (inferior a 10), concatenem el valor antic + el que insertem
            else if (lblActual.text.trim() < 10) {
                lblActual.text = ' '+lblActual.text.trim() + strNum+' ';  
            }
        }
        
    },

    // Activa o desactiva els botons
    enableBtnsSimbols: function(bln) {
        this.btnSum.setEnabled(bln);
        this.btnRes.setEnabled(bln);
        this.btnMult.setEnabled(bln);
        this.btnDiv.setEnabled(bln);
    },

    // Canvia o afegeix el simbol de la operació que estem fent
    canviSimbol: function(strSimbol) {

        // Si al canviar de simbol, canviem a una multiplicació o divisió, i el segon nombre té 2 xifres
        //  _ aquest passa a tenir només una xifra, afagant la desena 
        if ((strSimbol === 'x' || strSimbol === '÷') 
            && this.lblNum2.text > 10 ) {
            var arrTmp = Tools.separarDesenaUnitat(this.lblNum2.text);
            this.lblNum2.text = arrTmp.desena; 
        }

        // Canviem el sprite del símbol
        switch (strSimbol) {
            case '+':
                this.sprSimbol.loadTexture('atlasCalc', 'symbSum');
                break;
            case '-':
                this.sprSimbol.loadTexture('atlasCalc', 'symbRes');
                break;
            case 'x':
                this.sprSimbol.loadTexture('atlasCalc', 'symbMult');
                break;
            case '÷':
                this.sprSimbol.loadTexture('atlasCalc', 'symbDiv');
                break;
        }
        this.sprSimbol.setTag(strSimbol);
    },

    // Decideix si s'ha de borrar label (i quina) o simbol
    corregir: function() {
        // Agafem la label que toca borrar:
        // Si la label 2 està plena, borrem de la label 2
        if (this.lblNum2.text.trim().length > 0) { 
            this.corregirLabel(this.lblNum2);
        }
        // Si no hi ha res a la lbl 2 pero tenim simbol, borrem el simbol
        else if (this.sprSimbol.getTag() != '') { 
            this.sprSimbol.setTag('');
            this.sprSimbol.loadTexture('atlasCalc', 'symbBlank');
        }
        // Sino, borrem de la label 1
        else if (this.lblNum1.text.trim().length > 0) { 
            this.corregirLabel(this.lblNum1);
        }
    },

    // Borra un element de la label
    corregirLabel: function(lbl) {
        // Si la label es menor a 10, borrem el contingut
        if (lbl.text < 10) {
            lbl.text = '';
        }
        // Si es major a 10, borrem nomes la unitat
        else {
            var arrTmp = Tools.separarDesenaUnitat(lbl.text);
            lbl.text = ' '+arrTmp.desena+' ';
        }
    },

    // Reinicialitza el contingut de la operació
    netejarCalculadora: function() {
        // Borrem el contingut de les labels
        this.lblNum1.text = '';
        this.lblNum2.text = '';

        // Reinicialitzem el símbol
        this.sprSimbol.setTag('');
        this.sprSimbol.loadTexture('atlasCalc', 'symbBlank');
    },

    // -- RESOLDRE I SORTIR --

    // Comprova si es pot resoldre la operació
    esPotResoldre: function() {
        // Comprovem si es pot resoldre en cas de suma o resta
        //if (this.sprSimbol.getTag() === '+' || this.sprSimbol.getTag() === '-') {
            var num1 = this.lblNum1.text.trim();
            var num2 = this.lblNum2.text.trim();
            
            // En cas de la resta o divisió, si el num2 es major a num1 no es pot resoldre
            if ((this.sprSimbol.getTag() === '-' || this.sprSimbol.getTag() === '÷') 
                && parseInt(num1) < parseInt(num2)) {
                return false;
            }
            // Si tant el num1 com el 2 son majors a 0, es pot resoldre la operacio
            else if (num1 > 0 && num2 > 0) {
                return true;
            }
            // En qualcevol altre cas, no es pot resoldre
            else {
                return false;
            }
    },

    resoldre: function() {
        // Comprovem si la operació es pot resoldre, si es pot passem al abacCalc
        if (this.esPotResoldre()) {
            // Agafem el valor dels nombres en dues xifres (posem el +'' per forçar string)
            var num1 = this.getStrValor(this.lblNum1.text.trim()+''); 
            var num2 = this.lblNum2.text.trim()+'';

            // Només afegim el 0 a la esquerra del num2 en cas de que sigui suma o resta
            if (this.sprSimbol.getTag() === '+' || this.sprSimbol.getTag() === '-') {
                num2 = this.getStrValor(num2);
            }
            else if (this.sprSimbol.getTag() === '÷') {
                num1 = this.lblNum1.text.trim()+'';               
            }
            
            // Carreguem l'abac amb el mode que toca segons el simbol de la operacio
            var strAbacMode = this.getAbacMode(this.sprSimbol.getTag());
            game.state.start('abacCalc', true, false, strAbacMode, num1, num2);
        }
        // Si no es pot, mostrem el ninot de error i bloquejem la calculadora durant 2 segons
        else {
            this.grpLbls.enableItemsTween(false, 500, 0.4);
            this.grpImg.enableItemsTween(false, 500, 0.4);
            this.grpBtn.enableItemsTween(false, 500, 0.4);
            this.sprError.tweenAlphaFix(700, 1);
            this.sprError.tweenSizeCreate(700, true);

            // Deixem passar 0.8 segons abans de permetre que el usuari pugui amagar el ninot de error
            this.game.time.events.add(800, function() {
                this.blnWrongInput = true;        
            }, this);
        }
        
    },

    // Retorna el valor del nombre introduït en dues xifres (que posa el 0 a la esquerra si cal, vamos)
    getStrValor: function(strNum) {
        if (strNum < 10) {
            return '0'+strNum;
        }
        else {
            return strNum;
        }
    },

    // Per tornar a activar la calculadora un cop es bloqueja per introduïr una operació incorrecta
    resumeAfterWrongInput: function() {
        if (this.blnWrongInput) {
            this.blnWrongInput = false;
            this.grpLbls.enableItemsTween(true, 500);
            this.grpImg.enableItemsTween(true, 500);
            this.grpBtn.enableItemsTween(true, 500);
            this.sprError.tweenAlphaFix(500, 0);        
        }
    },

    // Retorna el abacMode segons el símbol que se li passa
    getAbacMode: function(strSimbol){
        switch (strSimbol) {
            case '+':
                return 'sum';
                break;
            case '-':
                return 'res';
                break;
            case 'x':
                return 'mult';
                break;
            case '÷':
                return 'div';
                break;
        };    
    },

    // Torna enrere a la screen de menú
    goBack: function() {
        this.clearSpritesCache();
        game.state.start('menu');
    },

    clearSpritesCache: function() {

        this.game.cache.removeImage('atlasCalc');
        this.game.cache.removeImage('atlasCalcExtra');
        this.game.cache.removeImage('atlasCubscub');
       
    },

    shutdown: function () {
        // Sembla que el clearCurrentState crida al shutdown, per tant 
        //   hem de posar una booleana pq no el cridi recursivament fins a l'infinit
        if (this.blnClear) {
            delete this.blnClear;
            delete this.blnWrongInput;

            // Dispose dels botons
            this.grpBtn.dispose();
            delete this.grpBtn;

            // Dispose de les imatges
            this.grpImg.dispose();
            delete this.grpImg;

            // Dispose de les labels
            this.grpLbls.dispose();
            delete this.grpLbls;

            // Tornem a posar el color de fons que teniem abans
            game.stage.backgroundColor = '#FFFEF9';
            
            this.game.state.clearCurrentState();
        }
    }
};
