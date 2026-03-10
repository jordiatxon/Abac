
// -------------------------------------------- //
// -- Projecte:    Aleph                     -- //
// -- Empresa:     Els Altres Tres           -- //
// -- Programador: Jordi Castellví Bosch     -- //
// --                                        -- //
// --                             2014-2015  -- //
// -------------------------------------------- //


function Line() {
    Phaser.Sprite.call(this, game, 0, 0);

    // Creem la variable isDragged que es posa a true quan arrosseguem una linea
    // S'utilitza per buscar quin es el sprite que s'esta arrossegant 
    this.isDragging = false;

    // Centrem el anchor i activem el inputEnabled i el enableDrag
    this.anchor.setTo(0.5,0.5);
    this.inputEnabled = true;
    this.input.enableDrag(true, true);

    // Afegim les funcions per posar el isDragging a true/false al input Down/Up
    this.events.onInputDown.add(function() {
                                    this.isDragging = true;
                                }, this);
    this.events.onInputUp.add(function() {
                                    this.isDragging = false;
                                }, this);

    // Tamany del pinzell
    this.intBrushSize = 12*Tools.getScale(); 
    
    // Creem el gràfic de la linea
    this.graphLine = game.add.graphics(0,0); 
    this.graphLine.lineStyle(this.intBrushSize, 0xDA564D, 1);
    
    // Variables generals
	this.blnDelete = false; // Controla si la linea està damunt la goma de borrar
    this.blnJustCreated = true; // Controla si s'acaba de crear el sprite
    this.arrCheckCollide = []; // Array de les linees que estan coalisionant (durant el justCreated)

    // Array que anem montant quan pintem, per crear despres el poligon
    this.arrPolygon = []; 

    // Creem un grafic en el que anirem montant la textura
    this.grphInvisible = new Phaser.Graphics(0,0);
    this.grphInvisible.lineStyle(this.intBrushSize, 0x6A1813, 1);
    this.alive = true;

    // Textura on endinyarem el gràfic
    this.textureLine;
}

Line.prototype = Object.create(Phaser.Sprite.prototype);
Line.prototype.constructor = Line;

// Quan començem a pintar la linea, movem el graphLine a la posició de input, i cridem al drawLine
Line.prototype.startDrawLine = function(x, y) {
    this.graphLine.moveTo(x, y);
    this.drawLine(x, y); 
},

// Funció que es va cridant per anar pintant la linea
Line.prototype.drawLine = function(x, y) {
    // Només seguirem pintant la linea, en cas de que el poligon tingui menys de 500 punts 
    if (this.arrPolygon.length < 500) {
        var blnAddPoint = true;
        // Comprovem si el punt anterior està a més de 5 pixels a la rodona, si no, no afegim punt
        if (this.arrPolygon.length > 0) {
            var prevX = this.arrPolygon[this.arrPolygon.length-2];
            var prevY = this.arrPolygon[this.arrPolygon.length-1];    

            // Si la diferencia entrre l'anterior punt i aquest es de menys de 5px, no l'afegim
            if ((Math.abs(prevX - x) < 5) && (Math.abs(prevY - y) < 5)) {
                blnAddPoint = false;
            }
        }
        // Si el arrpolygon esta buit, inicialitzem les posicions min/max X/Y amb les posicions x/y actuals
        else {
            this.minX = x;
            this.maxX = x;
            this.minY = y;
            this.maxY = y;
        }

        // Si es true, el punt s'ha de afegir
        if (blnAddPoint) {
            // Movem la linea a la pocisió x/y
            this.graphLine.lineTo(x, y);

            // Afegim les posicions al array
            this.arrPolygon.push(x);
            this.arrPolygon.push(y);
            
            // Comprovem si s'ha de actualitzar la posició min/max X/Y
            if (x < this.minX) this.minX = x;
            else if (x > this.maxX) this.maxX = x;

            if (y < this.minY) this.minY = y;
            else if (y > this.maxY) this.maxY = y;   
        }
        return true;
    }
    // Si hi ha mes de 500 punts a la linea, no la pintem 
    else {
        this.stopDrawing();
        return false;
    }
},
Line.prototype.stopDrawing = function() {
    // Calculem la distància entre els punts min/max X/Y
    var intDistance = ((this.maxX - this.minX)/2) + ((this.maxY - this.minY)/2);
    
    // Si la distància es major a 10px, dibuixem la linea
    if (intDistance > 10) {

        // Pintem el gràfic a partir del array de posicions
        this.grphInvisible.drawPolygon(this.arrPolygon);

        // Generem la textura del gràfic i l'endinyem
        this.textureLine = this.grphInvisible.generateTexture();
        
        // Agafem la posició central x/y
        this.xMediatriu = this.minX + ((this.maxX - this.minX)/2);
        this.yMediatriu = this.minY + ((this.maxY - this.minY)/2);

        return true;
    }
    // Si la distància es menor a 10px, borrem la linea
    else {
        this.dispose();
        return false;
    }
},
Line.prototype.createSprite = function() {
    // Posem les posicions x/y centrals com a posicions x/y de la linea
    this.x = this.xMediatriu;
    this.y = this.yMediatriu;

    // Afegim la textura a la linea
    this.setTexture(this.textureLine);

    // Reinicialitzem les variables que s'utilitzen per crear la linea
    this.grphInvisible.destroy();
    this.arrPolygon.length = 0;
    this.graphLine.clear();
    this.blnJustCreated = false;
},

Line.prototype.dispose = function() {
    // Borrem les variables globals
    delete this.isDragging;
    delete this.intBrushSize;
    delete this.blnDelete;
    delete this.blnJustCreated;
    delete this.alive;

    // Posem a 0 els arrays i els borrem
    this.arrCheckCollide.length = 0;
    this.arrPolygon.length = 0;
    delete this.arrCheckCollide;
    delete this.arrPolygon;

    // Destruïm els objectes gràfics
    this.grphInvisible.destroy();
    delete this.grphInvisible;

    if (this.textureLine) {
        this.textureLine.destroy();
        delete this.textureLine;    
    }
        
    this.graphLine.destroy();
    delete this.graphLine;
    this.destroy();
}



/* COSES OBSOLETES

    Line.prototype.mergeHitArea = function(rect) {
        Tools.addTextLabel('hit: ' + this.hitArea.x + ' rect: ' + rect.x);
        if (rect.x < this.hitArea.x) this.hitArea.x = rect.x - (rect.width/2);
        if (rect.y < this.hitArea.y) this.hitArea.y = rect.y - (rect.height/2);
        if (rect.right > this.hitArea.right) this.hitArea.right = rect.right;
        if (rect.bottom > this.hitArea.bottom) this.hitArea.bottom = rect.bottom;
        Tools.addTextLabel('end hit: ' + this.hitArea.x);
    },
    // DE MOMENT NO S'UTILITZA
    //   La idea es que es puguin reciclar les linies mortes
    Line.prototype.kill = function() {
        this.sprLine.destroy();
        this.sprLine = game.add.sprite(0, 0);
        this.sprLine.anchor.setTo(0.5,0.5);
        this.sprLine.inputEnabled = true;
        this.sprLine.input.enableDrag(true, true);

        this.sprLine.events.onInputDown.add(function() {
                                            this.isDragging = true;
                                        }, this);
        
        this.sprLine.events.onInputUp.add(function() {
                                            this.isDragging = false;
                                        }, this);
        this.alive = false;
    }
    /// 
    Line.prototype.getSprite = function() {
        return this.sprLine;
    },
*/