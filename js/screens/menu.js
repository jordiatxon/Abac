
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     The Others           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

var menuState = {

	create: function() {
		// Comprova si s'ha passat per el destroy (necessari en els states, per algun motiu de coses del Phaser que desconec)
		this.blnClear = true;
        this.grpBg = new Grup();

		var intScale = Tools.getScale();
		var intX = window.innerWidth*0.5;

        // Afegim les quatre imatges de menu, que son quatre (una a cada cantonada)
		var bgMenuTopLeft = game.add.sprite(0, 0, 'atlasMenuBg', 'topLeft');
        bgMenuTopLeft.scale.setTo(intScale);
        bgMenuTopLeft.anchor.setTo(0, 0);
        bgMenuTopLeft.alpha = 0;

        var bgMenuTopRight = game.add.sprite(window.innerWidth, 0, 'atlasMenuBg', 'topRight');
        bgMenuTopRight.scale.setTo(intScale);
        bgMenuTopRight.anchor.setTo(1, 0);
        bgMenuTopRight.alpha = 0;
        
        var bgMenuBottomLeft = game.add.sprite(0, window.innerHeight, 'atlasMenuBg', 'bottomLeft');
        bgMenuBottomLeft.scale.setTo(intScale);
        bgMenuBottomLeft.anchor.setTo(0, 1);
        bgMenuBottomLeft.alpha = 0;

        var bgMenuBottomRight = game.add.sprite(window.innerWidth, window.innerHeight, 'atlasMenuBg', 'bottomRight');
        bgMenuBottomRight.scale.setTo(intScale);
        bgMenuBottomRight.anchor.setTo(1, 1);
        bgMenuBottomRight.alpha = 0;

        // Afegim la imatge del ninot del menú principal
        var sprAleph = game.add.sprite(intX, 0, 'atlasMenuBg', 'alephMenu');
        sprAleph.scale.setTo(intScale);
        sprAleph.anchor.setTo(0.5, 0.5);

        // Afegim el logo a la part inferior
        this.sprLogo = game.add.sprite(intX, window.innerHeight*0.95, 'atlasMenuBg', 'logo');
        this.sprLogo.scale.setTo(intScale);
        this.sprLogo.anchor.setTo(0.5, 1);
        this.sprLogo.alpha = 0;
        this.sprLogo.inputEnabled = true;
        this.sprLogo.events.onInputDown.add(function() {
                                               this.togglePopUp(true);
                                            }, this); 

        this.grpBg.add(bgMenuTopLeft);
        this.grpBg.add(bgMenuTopRight);
        this.grpBg.add(bgMenuBottomLeft);
        this.grpBg.add(bgMenuBottomRight);
        this.grpBg.add(sprAleph);

		// Creem un tween de fead-in per les imatges de fons (els cubus)
		this.tweenManager = game.add.tween(bgMenuTopLeft) 
            .to({alpha: 1},1200,Phaser.Easing.Linear.None,true)
            .start();
        this.tweenManager = game.add.tween(bgMenuTopRight) 
            .to({alpha: 1},1200,Phaser.Easing.Linear.None,true)
            .start();
		this.tweenManager = game.add.tween(bgMenuBottomLeft) 
            .to({alpha: 1},1200,Phaser.Easing.Linear.None,true)
            .start();
        this.tweenManager = game.add.tween(bgMenuBottomRight) 
            .to({alpha: 1},1200,Phaser.Easing.Linear.None,true)
            .start();
        this.tweenManager = game.add.tween(this.sprLogo) 
            .to({alpha: 0.4},1200,Phaser.Easing.Linear.None,true)
            .start();


		// Crem un tween per la label del titol
		this.tweenManager = game.add.tween(sprAleph) // Afegir tween
			.to({y: window.innerHeight*0.25}, 1000) // Desplaçament del tween
			.easing(Phaser.Easing.Bounce.Out) // Afegim bounce
			.start(); // Començem el tween
		this.tweenManager.onComplete.add(this.tweenBotons, this);

        // So per als botons
		var sndBtn = SoundManager.getSndBtn();

        // Creem els botons de Àbac, Àbac Zero, i Calculadora
		this.btnAbac = new CustomButton(intX, window.innerHeight*0.47, 'atlasMenu', 
										this.iniciarAbac, 'btnAbac');
		this.btnAbac.setAlpha(0);

		this.btnZero = new CustomButton(intX, this.btnAbac.y + (200*intScale), 'atlasMenu', 
												this.iniciarZero, 'btnAbacZero');
		this.btnZero.setAlpha(0);

        this.btnCalculadora = new CustomButton(intX, this.btnZero.y + (200*intScale), 'atlasMenu', 
												this.iniciarCalculadora, 'btnCalculadora');
		this.btnCalculadora.setAlpha(0);

        /*// Preparem les variables per crear el botó de so
            var strBtnSoundUp = 'btnSoundActUp';
            var strBtnSoundDown = 'btnSoundActDown';
            if (SoundManager.isMute()) {
            	strBtnSoundUp = 'btnSoundMuteUp';
            	strBtnSoundDown = 'btnSoundMuteDown';	
            }

            // Creem el botó de so
            this.btnSound = game.add.button(0, window.innerHeight - (45*intScale), 'atlasIcons', this.mute, this, strBtnSoundUp,  strBtnSoundUp, strBtnSoundDown);
            this.btnSound.anchor.setTo(0,1);
            this.btnSound.scale.setTo(intScale);
            this.btnSound.setDownSound(sndBtn);
            this.btnSound.visible = false;
        */
        
        this.createPopUp(intScale);
    },

    createPopUp: function(intScale) {
        this.grpPopUp = new Grup();

        // Creem el sprite de fons
        var sprBackground = game.add.sprite(window.innerWidth*0.5, window.innerHeight*0.5, 'atlasPopUp', 'popUpFree');
        sprBackground.scale.setTo(intScale);
        sprBackground.anchor.setTo(0.5, 0.5);
        sprBackground.alpha = 0;
        this.grpPopUp.add(sprBackground);



        switch (Tools.getLanguage()) {
            case 'es':
                var strCos = 'Desarrollado por\nDirección del Proyecto: Roger Vicente\nDiseño Pedagógico: Jordi Achón\nDiseño Técnico y Programación: Jordi Castellví\nDirección de Arte: Joan Achón\n\nColaboraciones\nIlustración 3D: Carles Munné\nDiseño gráfico: Emilio de Juan, Jordi Olmos,\nMarta de la Orden, Lucía Suárez\nSonido: The Others S.L.\nPowered By: Ludei, Phaser';
                break;
            case 'ca':
                var strCos = 'Desenvolupat per\nDirecció de Projecte: Roger Vicente\nDisseny Pedagògic: Jordi Achón\nDisseny Tècnic i Programació: Jordi Castellví\nDirecció d’Art: Joan Achón\n\nCol·laboracions\nIl·lustració 3D: Carles Munné\nDisseny gràfic: Emilio de Juan, Jordi Olmos,\nMarta de la Orden, Lucía Suárez\nSo: The Others S.L.\nPowered By: Ludei, Phaser';
                break;
            default: // EN
                var strCos = 'Developed by\nProject Director: Roger Vicente\nPedagogical Design: Jordi Achón\nTechnical Design and Programming: Jordi Castellví\nArt Director: Joan Achón\n\nCollaboration\n3D Illustration: Carles Munné\nGraphic Design: Emilio de Juan, Jordi Olmos,\nMarta de la Orden, Lucía Suárez\nSound: The Others S.L.\nPowered By: Ludei, Phaser';
                break;
        }

        var intX = sprBackground.x-(sprBackground.width*0.45);
        var intY = sprBackground.y-(sprBackground.height*0.45);


        this.lblCos = game.add.text(sprBackground.x,sprBackground.y, strCos, 
            { font: '22px vag', fill: '#ffffff'});
        this.lblCos.anchor.setTo(0.5, 0.5);
        this.lblCos.alpha = 0;
        this.lblCos.align = "center"
        this.grpPopUp.add(this.lblCos);


        var lblCopyright = game.add.text(intX, sprBackground.y+(sprBackground.height*0.42), 'Copyright © 2015-2016 The Others S.L.', 
            { font: '20px vag', fill: '#ffffff'});
        lblCopyright.anchor.setTo(0, 0);
        lblCopyright.alpha = 0;
        this.grpPopUp.add(lblCopyright);

        var btnPopUpOk = new CustomButton(sprBackground.x + sprBackground.width*0.45, sprBackground.y + sprBackground.height*0.45, 'atlasPopUp', 
                                            null, 'btnOk');
        btnPopUpOk.anchor.setTo(1, 1);
        btnPopUpOk.alpha = 0;
        btnPopUpOk.inputEnabled = true;
        this.grpPopUp.add(btnPopUpOk);
        btnPopUpOk.events.onInputUp.add(function() {this.togglePopUp(false);}, this);       
    },

    togglePopUp: function(blnEnable) {

        var intAlphaPopUp;
        var intAlphaMenu;
        if (blnEnable) {
            intAlphaPopUp = 0.9;
            intAlphaMenu = 0.5;
        }
        else {
            intAlphaPopUp = 0;
            intAlphaMenu = 1;
        }

        // Si es blnBuy, maneguem el popUpBuy
        this.btnAbac.inputEnabled = !blnEnable;
        this.btnCalculadora.inputEnabled = !blnEnable;
        this.sprLogo.inputEnabled = !blnEnable;
        
        this.grpBg.enableItemsTween(!blnEnable, 600, intAlphaMenu);

        this.grpPopUp.enableItemsTween(blnEnable, 600, intAlphaPopUp);
    },


    // Animació fade-in per fer apareixer els botons
	tweenBotons: function() {
		this.btnZero.tweenAlpha(400);
		this.btnAbac.tweenAlpha(900);
		this.btnCalculadora.tweenAlpha(1200);
	},

	iniciarZero: function() {
		game.state.start('loadScreen', true, false, 'zero');
	},
	
	iniciarAbac: function() {
		game.state.start('loadScreen', true, false, 'teen');
	},

	iniciarCalculadora: function() {
		game.state.start('loadScreen', true, false, 'calc');
	},

	shutdown: function () {
        if (this.blnClear) {
            delete this.blnClear;

            this.btnZero.dispose();
            this.btnAbac.dispose();
            this.btnCalculadora.dispose();
            this.sprLogo.destroy();

            delete this.btnZero;
            delete this.btnAbac;
            delete this.btnCalculadora;
            delete this.sprLogo;

            this.grpBg.dispose();
            this.grpPopUp.dispose();
            delete this.grpBg;
            delete this.grpPopUp;

			if (this.tweenManager) {    
                this.tweenManager.onComplete.removeAll();
                this.tweenManager.stop();
                this.tweenManager = null;
            }
            
            this.game.state.clearCurrentState();
            
        }
    }

/*  mute: function() {
        SoundManager.setEnableSound();
        if (SoundManager.isMute()) {
            this.btnSound.setFrames('btnSoundMuteUp','btnSoundMuteUp','btnSoundMuteDown', 'btnSoundMuteUp');
        }
        else {
            this.btnSound.setFrames('btnSoundActUp','btnSoundActUp','btnSoundActDown', 'btnSoundActUp');
        }
    },*/
};