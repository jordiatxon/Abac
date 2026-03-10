
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //


function Contador(intX, intY, strContador) {
	
    // --- CONSTRUCTOR ---

    // Reescalat que s'aplica als sprites i distàncies
    var intScale = Tools.getScale(); 
    var strAtlasCont;
    switch (strContador) {
        case 'count':
            strAtlasCont = 'atlasContJunior';
            break;
        case 'countU':
            strAtlasCont = 'atlasContZero';
            break;
        case 'countMult':
            strAtlasCont = 'atlasCalcExtra';
            break;
    }

    // Creem el sprite de contador segons la imatge que necessitem
    this.sprContador = new SpriteBase(intX, intY, strAtlasCont, strContador);
    this.sprContador.anchor.setTo(1, 0); //Anclem la x a la dreta
    

    // Si el contador es 'countU' (el del Àbac Zero), carreguem el 'countD' (el de les desenes)
    if (strContador === 'countU') {
        // Posem el contador de desenes al costat del de unitats, però transparent perquè no es vegi de moment
        this.sprContDes = new SpriteBase(intX-this.sprContador.width, intY, 'atlasContZero', 'countD');
        this.sprContDes.anchor.setTo(1, 0);
        this.sprContDes.alpha = 0;
    }

    // Creem les variables de posició x/y per la label que conta Unitats
    //   i el xSeparador, que es la distància en px que hi ha entre les labels de Unitats, Desenes, Centenes...
    var xUnitats;
    var yUnitats = this.sprContador.y + 55*intScale;
    var xSeparador;// = 125*intScale;

    // Indiquem la posició de la label que conta unitats del menú, i la distància entre labels
    //   La distància és diferent segons la imatge carregada.
    switch (strContador) {
        case 'countU': // Contador amb només unitats per al Àbac Zero
            xUnitats = this.sprContador.x - (90*intScale);
            xSeparador = (this.sprContador.width*0.85);
            break;
        case 'count': // Contador amb U/D/C/M per al Àbac Junior
            xUnitats = this.sprContador.x - (80*intScale);
            xSeparador = (this.sprContador.width*0.23);
            break;
    }

    // Creem les labels numèriques dels contadors a partir de les posicions declarades anteriorment
    this.lblContUnit = game.add.text(xUnitats, yUnitats,' 0 ', 
        { font: '50px vag', fill: '#585858'});
    this.lblContUnit.scale.setTo(intScale);
    this.lblContUnit.anchor.setTo(1, 0);

    this.lblContDes = game.add.text(this.lblContUnit.x - xSeparador, this.lblContUnit.y, ' 0 ', 
        { font: '50px vag', fill: '#585858'});
    this.lblContDes.scale.setTo(intScale);
    this.lblContDes.anchor.setTo(1, 0);

    // Creem les labels del contador que calguin segons el contador
    if (strContador === 'countU') {
        // Si el contador es 'countU' (Abac Zero) amaguem el contador de desenes
        this.lblContDes.alpha = 0;
    }
    else {
        // Si no és el Àbac Zero, creem la label per contar Centenes
        this.lblContCent = game.add.text(this.lblContDes.x - xSeparador, this.lblContUnit.y, ' 0 ', 
            { font: '50px vag', fill: '#585858'});
        this.lblContCent.scale.setTo(intScale);
        this.lblContCent.anchor.setTo(1, 0);
    }

    // En el cas de que sigui Àbac Junior, posem la label de la unitat de miler
    if (strContador === 'count') {
        // A més, si el contador es 'count' (Abac Junior), crearem també la label per contar les Milenes
        this.lblContMil = game.add.text(this.lblContCent.x - xSeparador, this.lblContUnit.y, ' 0 ', 
            { font: '50px vag', fill: '#585858'});
        this.lblContMil.scale.setTo(intScale);
        this.lblContMil.anchor.setTo(1, 0);
    }


    // --- MÈTODES ---

    // Actualitza el contador de una potència en concret (pot) amb el valor indicat (i)
    this.actualitzarContador = function(pot, i) {
        switch(pot) {
            case 'U':
                this.lblContUnit.text = ' '+i+' ';
                break;
            case 'D':
                this.lblContDes.text = ' '+i+' ';
                break;
            case 'C':
                // Abans de actualitzar, mirem que la label de centenes existeixi
                if (this.lblContCent) this.lblContCent.text = ' '+i+' ';
                break;
            case 'M':
                // Abans de actualitzar, mirem que la label de unitats de miler existeixi
                if (this.lblContMil) this.lblContMil.text = ' '+i+' ';
                break;
        };
    };

    this.tweenAlphaContador = function(intMilisec, intAlpha) {
        this.tweenManager = game.add.tween(this.sprContador); // Creem el tween
        this.tweenManager.to({alpha: intAlpha},intMilisec,Phaser.Easing.Linear.None,true); // Fem el fade-in

    };

    this.dispose = function(){
        // Quan eliminem el contador, netejem de memòria totes les seves variables
        
        this.sprContador.dispose();
        if (this.sprContDes) this.sprContDes.dispose();

        this.lblContUnit.destroy();
        this.lblContDes.destroy();
        if (this.lblContCent) this.lblContCent.destroy();
        if (this.lblContMil) this.lblContMil.destroy();
    };
}
