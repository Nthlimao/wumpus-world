var elements = {
    v: '<span class="visited">V</span>',
    b: '<span class="hasBrisa">B</span>',
    f: '<span class="hasFedor">F</span>',
};

var values = [
    [],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
];

var positions = [[],
    [{},
        { top: 357, left: 51 },
        { top: 357, left: 154 },
        { top: 357, left: 255 },
        { top: 357, left: 357 },
    ],
    [{},
        { top: 255, left: 51 },
        { top: 255, left: 154 },
        { top: 255, left: 255 },
        { top: 255, left: 357 },
    ],
    [{},
        { top: 154, left: 51 },
        { top: 154, left: 154 },
        { top: 154, left: 255 },
        { top: 154, left: 357 },
    ],
    [{},
        { top: 51, left: 51 },
        { top: 51, left: 154 },
        { top: 51, left: 255 },
        { top: 51, left: 357 },
    ],
];

var functions = {
    walk: function (row, col, face = null) {
        if(face){
            $('#agente').removeClass();
            $('#agente').addClass(face);
        }

        $('#agente').css(positions[row][col]); 
        $('#' + row + '-' + col).append(elements.v);

        if(face == null) {

            functions.block(row, col);
            
            $('#agente').addClass('running');

            setTimeout(function(){ 
                $('#agente').removeClass('running');
            }, 2500);
        }
    },
    shoot: function(row, col, face){
        var death = false;

        switch (face) {
            case 'right':
                if(col < 4) {
                    for (var i = col; i <= 4; i++) {
                        var bloco = values[row][i];

                        if(bloco.includes('Wumpus')){
                            functions.createToast('A Flecha atingiu o Wumpus');
                            death = true;
                            functions.killWumpus(row, i);
                            break;
                        }
                    }
                } 
                
                if(!death) functions.createToast('A Flecha atingiu a parede');

                break;
            case 'left':
                if(col > 1) {
                    for (var i = col; i >= 1; i--) {
                        var bloco = values[row][i];

                        if(bloco.includes('Wumpus')){
                            functions.createToast('A Flecha atingiu o Wumpus');
                            death = true;
                            functions.killWumpus(row, i);
                            break;
                        }
                    }
                } 

                if(!death) functions.createToast('A Flecha atingiu a parede');

                break;
            case 'up':
                if(row < 4) {
                    for (var i = row; i <= 4; i++) {
                        var bloco = values[i][col];

                        if(bloco.includes('Wumpus')){
                            functions.createToast('A Flecha atingiu o Wumpus');
                            death = true;
                            functions.killWumpus(i, col);
                            break;
                        }
                    }
                }

                if(!death) functions.createToast('A Flecha atingiu a parede');
                break;
            case 'down':
                    if(row > 1) {
                        for (var i = row; i >= 1; i--) {
                            var bloco = values[i][col];
    
                            if(bloco.includes('Wumpus')){
                                functions.createToast('A Flecha atingiu o Wumpus');
                                death = true;
                                functions.killWumpus(i, col);
                                break;
                            }
                        }
                    }
    
                    if(!death) functions.createToast('A Flecha atingiu a parede');
                break;
        }
    },
    killWumpus: function(row, col){
        values[row][col].map(function(cur, index) {
            if(cur === 'Wumpus'){
                values[row][col][index] = 'Nada';
            }

            return cur;
        });

        $('#wumpus').addClass('deathWumpus');
    },
    getGold: function(row, col){
        var bloco = values[row][col];
        var foundGold = false;

        bloco.map(function(cur, index){
            if(cur === 'Ouro') {
                foundGold = true;
                values[row][col][index] = 'Nada';
                $('#gold').remove();
            }

            return cur;
        });

        return foundGold;
    },
    block: function(row, col) {
        var bloco = values[row][col];

        if(bloco.includes('Ouro')) {
            $('#gold').addClass('visibility');
            functions.createToast('O agente achou Ouro');
        }

        if(bloco.includes('Poco')) {
            functions.createToast('O agente caiu no poço');
            $('.pit-' + row + '-' + col).addClass('visibility');
            setTimeout(function(){ 
                $('#agente').remove();
                $('#wumpus, #pit-0, #pit-1, #pit-2, #gold').addClass('visibility');
            }, 2500);
        } else if(bloco.includes('Brisa')) {
            $('#' + row + '-' + col).append(elements.b);
            functions.createToast('O agente sentiu um leve brisa');
        }

        if(bloco.includes('Wumpus')) {
            functions.createToast('O Wumpus atacou o agente');
            $('#wumpus').addClass('visibility');
            setTimeout(function(){ 
                $('#agente').remove();
                $('#wumpus, #pit-0, #pit-1, #pit-2, #gold').addClass('visibility');
            }, 2500);
        } else if(bloco.includes('Fedor')) {
            $('#' + row + '-' + col).append(elements.f);
            functions.createToast('O agente sentiu uma brisa fedorenta');
        }
        
    },
    getColumn: function() {
        return Math.floor(Math.random() * 4) + 1;
    },
    getRow: function(col) {
        var row = 0;

        if(col === 1) {
            while (row <= 2) {
                row = Math.floor(Math.random() * 4) + 1;
            }
        } else if(col === 2) {
            while (row <= 1) {
                row = Math.floor(Math.random() * 4) + 1;
            }
        } else {
            row = Math.floor(Math.random() * 4) + 1;
        }

        return row;
    },
    setAdjacent: function(row, col, label){
        if((row + 1) <= 4) values[row + 1][col].push(label);
        if((row - 1) > 0) values[row - 1][col].push(label);
        if((col + 1) <= 4) values[row][col + 1].push(label);
        if((col - 1) > 0) values[row][col - 1].push(label);
    },
    createWumpus: function(){
        var wumpus = '<div id="wumpus"><div class="player-wumpus"></div></div>';

        var col = functions.getColumn();
        var row = functions.getRow(col);
    
        $('.world').append(wumpus);
        $('#wumpus').css(positions[row][col]); 

        values[row][col].push('Wumpus');
        values[row][col].push('Fedor');

        functions.setAdjacent(row, col, 'Fedor');
        functions.createPits();
    },
    createPits: function(){
        for(var i = 0; i < 3; i++){
            var pit = '<div id="pit-' + i + '"></div>';
            var col, row;
            
            do {
                col = functions.getColumn();
                row = functions.getRow(col);
            } while (values[row][col].includes('Poco') || values[row][col].includes('Wumpus'));

            $('.world').append(pit);
            $('#pit-' + i).css(positions[row][col]); 
            $('#pit-' + i).addClass('pit-' + row + '-' + col);
    
            values[row][col].push('Poco');
            values[row][col].push('Brisa');
    
            functions.setAdjacent(row, col, 'Brisa');
        }
        functions.createGold();        
    },
    createGold: function(){
        var gold = '<div id="gold"><div class="player-gold">OURO</div></div>'; 
        var col, row;

        do {
            col = functions.getColumn();
            row = functions.getRow(col);
        } while (values[row][col].includes('Poco') || values[row][col].includes('Wumpus'));

        $('.world').append(gold);
        $('#gold').css(positions[row][col]); 
        values[row][col].push('Ouro');
    },
    createToast: function(text){
        var id = functions.makeHash(5);
        var toast = '<div class="toast" id="' + id + '">' + text + '</div>';

        $('.wrap').append(toast);

        setTimeout(function(){ 
            $('#' + id).remove();
        }, 5000);
    },
    makeHash: function(length){
        var result = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charsLength = chars.length;

        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charsLength));
        }

        return result;
    }
}

$(document).ready(function() {
    functions.createWumpus();

    var arrows = 1;
    var hasGold = false;

    var row = 1;
    var col = 1;
    var face = 'right';

    functions.walk(row, col, face);

    $(this).keydown(function(event) {
        switch (event.which) {
            case 39:
                if(face === 'right') {
                    if(col < 4) {
                        col = col + 1;
                        functions.walk(row, col);
                    } else {
                        functions.createToast('Impacto');
                    }
                } else {
                    face = 'right';
                    functions.walk(row, col, face);
                }
                break;
            case 37:
                if (face === 'left') {
                    if (col > 1) {
                        col = col - 1;
                        functions.walk(row, col);
                    } else {
                        functions.createToast('Impacto');
                    }
                } else {
                    face = 'left';
                    functions.walk(row, col, face);
                }
                break;
            case 38:
                if(face === 'up') {
                    if(row < 4) {
                        row = row + 1;
                        functions.walk(row, col);
                    } else {
                        functions.createToast('Impacto');
                    }
                } else {
                    face = 'up';
                    functions.walk(row, col, face);
                }
                break;
            case 40:
                if(face === 'down') {
                    if(row > 1) {
                        row = row - 1;
                        functions.walk(row, col);
                    } else {
                        functions.createToast('Impacto');
                    }
                } else {
                    face = 'down';
                    functions.walk(row, col, face);
                }
                break;
            case 13:
                if(arrows > 0){
                    arrows = arrows - 1;
                    functions.shoot(row, col, face);
                } else {
                    functions.createToast('O agente não tem mais flechas')
                }
                break;
            case 69:
                hasGold = functions.getGold(row, col);
                if(hasGold) functions.createToast('O Agente Pegou o Ouro');
                break;
            case 32:
                if(col === 1 && row === 1){
                    if(hasGold) functions.createToast('O Agente saiu da caverna com o Ouro');
                    else {
                        functions.createToast('O Agente saiu da caverna');
                    }
                    $('#agente').remove();

                    $('#wumpus, #pit-0, #pit-1, #pit-2, #gold').addClass('visibility');
                }
                break;
        }
    });

    // BUTTONS
    $('#right-btn').click(function(){
        if(face === 'right') {
            if(col < 4) {
                col = col + 1;
                functions.walk(row, col);
            } else {
                functions.createToast('Impacto');
            }
        } else {
            face = 'right';
            functions.walk(row, col, face);
        }
    });
    $('#left-btn').click(function(){
        if (face === 'left') {
            if (col > 1) {
                col = col - 1;
                functions.walk(row, col);
            } else {
                functions.createToast('Impacto');
            }
        } else {
            face = 'left';
            functions.walk(row, col, face);
        }
    });
    $('#up-btn').click(function(){
        if(face === 'up') {
            if(row < 4) {
                row = row + 1;
                functions.walk(row, col);
            } else {
                functions.createToast('Impacto');
            }
        } else {
            face = 'up';
            functions.walk(row, col, face);
        }
    });
    $('#down-btn').click(function(){
        if(face === 'down') {
            if(row > 1) {
                row = row - 1;
                functions.walk(row, col);
            } else {
                functions.createToast('Impacto');
            }
        } else {
            face = 'down';
            functions.walk(row, col, face);
        }
    });
    $('#e-btn').click(function(){
        hasGold = functions.getGold(row, col);
        if(hasGold) functions.createToast('O Agente Pegou o Ouro');
    });
    $('#enter-btn').click(function(){
        if(arrows > 0){
            arrows = arrows - 1;
            functions.shoot(row, col, face);
        } else {
            functions.createToast('O agente não tem mais flechas')
        } 
    });
    $('#space-btn').click(function(){
        if(col === 1 && row === 1){
            if(hasGold) functions.createToast('O Agente saiu da caverna com o Ouro');
            else {
                functions.createToast('O Agente saiu da caverna');
            }
            $('#agente').remove();

            $('#wumpus, #pit-0, #pit-1, #pit-2, #gold').addClass('visibility');
        }
    });
});