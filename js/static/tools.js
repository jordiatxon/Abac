// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

function Tools() {};

// -- Inicialitzar --
Tools.init = function(){
    var scaleX = window.innerWidth/2048;
    var scaleY = window.innerHeight/1536;
    this.intScale = Math.min(scaleX, scaleY);
    
    // CORRECCIÓ: Afegim navigator.language per a navegadors moderns
    var lang = navigator.language || navigator.userLanguage || 'ca';
    this.strLanguage = lang.substring(0,2);
    
    this.abacMode = 'base';
    this.strCubeImg = 'cub';
    this.arrSpritesSeparats = []; // Guarda un array de "posició potencia i valor". S'utilitza per quan es desmonta un sprite, saber qué ha de generar.
}; // CORRECCIÓ: Canviat de , a ;

// Retorna la variable general de reescalat
Tools.getScale = function(){
    return this.intScale;
};

// Retorna la variable general de idioma
Tools.getLanguage = function(){
    return this.strLanguage;
};

// -- Potencia --
Tools.getNextPotencia = function(strPotencia) {
    switch(strPotencia) {
        case 'U':
            return 'D';
            break;
        case 'D':
            return 'C';
            break;
        case 'C':
            return 'M';
            break;
        default:
            return strPotencia;
            break;
    };
};

Tools.getPrevPotencia = function(strPotencia) {
    switch(strPotencia) {
        case 'D':
            return 'U';
            break;
        case 'C':
            return 'D';
        case 'M':
            return 'C';
            break;
        default:
            return strPotencia;
            break;
    };
};

// Reposiciona un sprite perquè no se surti dels bounds de la pantalla
Tools.repositionBlock = function(objBlock)  {
    if (objBlock.x >= window.innerWidth) objBlock.x = window.innerWidth - (objBlock.width/2.5);
    else if (objBlock.x <= 0) objBlock.x =  objBlock.width/2.5;
    if (objBlock.y >= window.innerHeight) objBlock.y = window.innerHeight - (objBlock.height/2.5);
    else if (objBlock.y <= 0) objBlock.y = objBlock.height/2.5;
};

// Retorna les bounds de un sprite
Tools.getBounds = function(objSprite) {

    var intX = objSprite.x;
    var intY = objSprite.y;

    switch (objSprite.anchor.x) {
        case 0.5:
            intX -= objSprite.width/2;
            break;
        case 1:
            intX -= objSprite.width;
            break;
    }

    switch (objSprite.anchor.y) {
        case 0.5:
            intY -= objSprite.height/2;
            break;
        case 1:
            intY -= objSprite.height;
            break;
    }
    return new Phaser.Rectangle(intX, intY, objSprite.width, objSprite.height);
};

// Defineix la imatge (textura) del cub
Tools.setCubeImg = function(strImg) {
    this.strCubeImg = strImg;
};

// Retorna la imatge (textura) del cub
Tools.getCubeImg = function() {
    return this.strCubeImg;
};

// Donat un valor int, retorna la desena i la unitat separades en un array 
Tools.separarDesenaUnitat = function(intValue) {
    var arrReturn = {desena:0, unitat:0};
    if (intValue > 9) {
        arrReturn.desena = parseInt(intValue/10);
    }
    else {
        arrReturn.desena = 0;
    }
    arrReturn.unitat = intValue - (arrReturn.desena*10);
    return arrReturn;
};