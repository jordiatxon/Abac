
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //

function Grup() {
	Phaser.Group.call(this, game);

    // Manager de animacions
    this.tweenManager = undefined;

    // Activar propietats
	this.enableBody = true;
}

Grup.prototype = Object.create(Phaser.Group.prototype);
Grup.prototype.constructor = Grup;

// Retorna la suma de tots els blocs del grup
Grup.prototype.getTotalGrup = function() {
    var i = 0;        
    this.forEachAlive(function(item) {
        i += parseInt(item.getValor());
    }, this);
    return i;
},

Grup.prototype.getJustCreated = function() {
    return this.iterate('blnJustCreated', true, Phaser.Group.RETURN_CHILD);
},

// Fem la animació de abans de netejar el grup
Grup.prototype.netejarGrupTween = function(){
    // Creem el tween
    this.tweenManager = game.add.tween(this); 
    // Fem el fade-out
    this.tweenManager.to({alpha: 0},500,Phaser.Easing.Linear.None,true); 
    
    this.forEach(function(item) {
        game.add.tween(item.scale) 
            .to({x: 0, y: 0},500,Phaser.Easing.Linear.None,true)
            //.easing(Phaser.Easing.Bounce.Out)
            .start();
    }, this);

    // Al acabar la animació netejem el grup i tornem a posar el alpha a 1 perqué el següent bloc que es crei es vegi be
    this.tweenManager.onComplete.add(function() {
        this.netejarGrup();
        this.alpha = 1;
    }, this);
},

// Eliminar tots els blocs del grup
Grup.prototype.netejarGrup = function() {
    while (this.length > 0) {

        var obj = this.getFirstExists();
        // Si l'element del grup té la funció 'dispose' la executem, sino cridem al destroy
        if (typeof obj.dispose === 'function') {
            obj.dispose();
        }
        else {
            obj.destroy();
        }
        
    };
},

// Fa enable/disable del grup instantàniament, posant el alpha a 0.5
Grup.prototype.enableItems = function(blnEnable) {
    var a;
    if (blnEnable) a = 1;
    else a = 0.5;

    this.forEach(function(itemUI) {
        itemUI.inputEnabled = blnEnable;
        if (blnEnable) itemUI.alpha = a;
        else itemUI.alpha = a;
    }, this);
},

// Fa enable/disable del grup amb una animació, posant el alpha a 0.5 progressivament
Grup.prototype.enableItemsTween = function(blnEnable, intMilisec, intAlpha) {
    var a;
    if (blnEnable) a = 1;
    else  a = intAlpha
    //else a = 0.5;

    this.forEach(function(itemUI) {

            // Fem el tween del alpha per a cada item del grup
            this.tweenManager = game.add.tween(itemUI) 
                .to({alpha: a},intMilisec,Phaser.Easing.Linear.None,true)
                .start();

            // Si el enable es true, esperem a que la animació acabi per activar el input
            if (blnEnable) {
                this.tweenManager.onComplete.add(function() {
                    itemUI.inputEnabled = blnEnable;
                }, this);
            }
            // Si el enable es false, deshabilitem el botó instantàniament
            else {
                itemUI.inputEnabled = blnEnable;
            }

    }, this);
},

// Fa enable/disable dels items que contenen el strFilter a la seva "key"
Grup.prototype.enableItemsFilter = function(blnEnable, strFilter) {
    this.forEach(function(itemUI) {
        if (itemUI.key.indexOf(strFilter) > -1) {
            itemUI.inputEnabled = blnEnable;
            if (blnEnable) itemUI.alpha = 1;
            else itemUI.alpha = 0.5;
        }
    }, this);
},

// Retorna el primer item del grup que conte el tag que li passem
Grup.prototype.getFirstTag = function(strTag){
    return this.iterate('strTag', strTag, Phaser.Group.RETURN_CHILD);
},

Grup.prototype.getByValue = function(intVal) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this.getAt(i).getValor() >= intVal) {
           return this.getAt(i);
           break;
        }
    }; 
    return;
},

Grup.prototype.dispose = function(){
    this.netejarGrup();
    if (this.tweenManager) {
        this.tweenManager.onComplete.removeAll();
        this.tweenManager.stop();
        this.tweenManager = null;
    }
    this.destroy();
}