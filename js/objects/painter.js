
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //


function Painter() {
    this.blnDrawing = false; // Indica si un sprite s'està pintant
    this.idCurrentDraw = -1; // Indica el id de la linea que està sent dragejada
    this.idJustCreated = -1; // Indica el id de la linea que s'acaba de crear (per ajuntar-los)
    this.tweenManager; // Manager de les animacions
    this.countLines = 0; // Conta quantes linees hi ha pintades

    // Grup on s'emmagatzemen totes les linees que pintem
    this.grpLines = new Grup(); 

    // --- FUNCIONS ---
    this.startDrawLine = function(x, y) {
        // Dibuixem un màxim de 20 linees, si n'hi ha 20 no creem la linea
        if (this.countLines >= 20) return;

        // Quan començem a pintar, indiquem amb la booleana que s'està pintant
        this.blnDrawing = true;

        // Creem una nova línea
        line = new Line();

        var i = 0;
        this.grpLines.forEach(function(objLinea) {
            // Busquem si al grup hi ha alguna linea que s'acabi de crear (justCreated)
            if (objLinea.blnJustCreated) {
                // Si n'hi ha l'afegim al arrCheckCollide de la linea, per comprovar si coalisionen més endavant
                line.arrCheckCollide.push(this.grpLines.getChildIndex(objLinea));  
                i++;  
            }        
        }, this);

        // Si hi ha més de dues linees "justCreated", borrem la actual i parem el procés
        //   Això es fa per evitar que es crein trillons de linees alhora: 
        //      mentre hi ha una justCreated, només en podme estar dibuixant una més.
        if (i > 1) {
            this.blnDrawing = false;
            line.dispose();
            return;
        }

        // Afegim la nova linea al grup
        this.grpLines.add(line);
        
        // Guardem el index de la linea que estem pintant
        this.idCurrentDraw = this.grpLines.getChildIndex(line);
        
        // Començem a pintar la linea
        line.startDrawLine(x, y);
    };

    // Comprova si el tweenManager existeix i s'està executant
    this.isTweenRunning = function() {
        return (this.tweenManager && this.tweenManager.isRunning);
    };

    // Pinta la linea
    this.drawLine = function(x, y) {
        // Xapussa fantàstica: al posar un sprite com a child de unaltre, surt del grup, per tant al grup n'hi ha un menys
        //   Això de vegades causa que el currentDraw sigui igual a la length del grup
        //   per tant, restem 1 al intCurrentDraw perque correspongi al sprite que era
        if (this.idCurrentDraw == this.grpLines.length) this.idCurrentDraw--;

        // Cridem a la funció drawLine de la Linea, que retorna true/false segons si s'ha pintat be
        return this.grpLines.getChildAt(this.idCurrentDraw).drawLine(x, y);
    };

    // Borrem totes les linees
    this.clearPainter = function() {
        
        // Reinicialitzem les variables id i el contador de linees
        this.idCurrentDraw = -1;
        this.idJustCreated = -1;
        this.countLines = 0;

        // Fem la animació de fade-out de les linees
        this.grpLines.forEach(function(objLinea) {
            this.tweenManager = game.add.tween(objLinea).to({alpha: 0},400,Phaser.Easing.Linear.None,true).start();
        }, this);

        // Un cop acabat el tween, fem el dispose de tots les linees del grup
        if (this.tweenManager) {
            this.tweenManager.onComplete.add(function() {
                while (this.grpLines.length > 0) {
                    this.grpLines.getFirstExists().dispose();
                };
            }, this);
        }
    };

    // Retorna si s'està pintant alguna linea o no
    this.isDrawing = function() {
        return this.blnDrawing;
    };

    // Acaba el procés de pintar i "plasma" la linea a la pantalla
    this.stopDrawing = function() {
        this.blnDrawing = false; // Indiquem que ja no s'està pintant res

        // Agafem el sprite que estavem pintant
        var sprCurrentDraw = this.grpLines.getChildAt(this.idCurrentDraw);

        // Pintem la linea i retornem si s'ha pintat correctament o no
        var blnReturn = sprCurrentDraw.stopDrawing();
        var id = this.idCurrentDraw;
        this.idCurrentDraw = -1;

        // Si s'ha pintat la linea correctament, en creem el sprite passat mig segon (500 ms)
        if (blnReturn) {

            game.time.events.add(500, function() {

                // Funcio del objecte Line per crear la linea com a sprite
                sprCurrentDraw.createSprite();

                // Busquem si hi ha linees que coalisionen amb aquesta
                for (var i = 0; i <= sprCurrentDraw.arrCheckCollide.length-1; i++) {
                    // Agafem el sprite a partir del id que ens ve dins del arrCheckCollide
                    var sprCheckCollide = this.grpLines.getChildAt(sprCurrentDraw.arrCheckCollide[i]);
                    
                    // Si el sprite no te cap linea filla, el id es diferent i coalisionen, els fusionem
                    if (sprCheckCollide.children.length === 0 && id != sprCurrentDraw.arrCheckCollide[i] 
                    && Phaser.Rectangle.intersects(Tools.getBounds(sprCurrentDraw), sprCheckCollide.getBounds())) {
                        
                        // Afegim el sprCheckCollide com a fill del sprite que acabem de dibuixar (sprCurrentDraw)
                        sprCurrentDraw.addChild(sprCheckCollide);

                        // Reposicionem la x i la y, ja que al posarla com a filla li modifica la posició
                        //   _ agafant la posicio del pare com a posició de origen.
                        //sprCheckCollide.hitArea = null;
                        sprCheckCollide.x -= sprCurrentDraw.x;
                        sprCheckCollide.y -= sprCurrentDraw.y;
                    }

                };

                // Buidem el arrCheckCollide
                sprCurrentDraw.arrCheckCollide.length = 0;

                // Sumem +1 al nombre de linees que tenim
                this.countLines++;

            }, this);    
        }
        
        return blnReturn;    
    };

    // Retorna una linea filtrant per la proipetat (booleana) que se li passa per parametre
    this.getByProperty = function(strProperty) {
        return this.grpLines.iterate(strProperty, true, Phaser.Group.RETURN_CHILD);
    };

    // Netejem les variables globals del grup
    this.dispose = function() {
        delete this.blnDrawing;
        delete this.idCurrentDraw;
        delete this.idJustCreated;
        delete this.countLines;

        this.grpLines.dispose();
        delete this.grpLines;

        if (this.tweenManager) {
            this.tweenManager.onComplete.removeAll();
            this.tweenManager.stop();
            this.tweenManager = null;
        }
    }
}
