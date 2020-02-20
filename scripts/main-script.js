'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    this.interval = setInterval(moveRoad, 20);
    // alert(road);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1440;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
}

class Block {
    constructor(width_, height_, x0_, y0_, color) {
        this.height = height_;
        this.width = width_;
        this.x0 = x0_;
        this.y0 = y0_;
        this.lines = [];
        this.color = color;
    }


      block_init(color, x0, y0) {
        this.context = myGameArea.context;
        this.color = color;
        this.context.fillStyle = color;
        this.context.fillRect(this.x0, this.y0, this.width, this.height);
      }

      block_move() {
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        this.y0 += 3;
        this.context.fillRect(this.x0, this.y0, this.width, this.height);   
      }
}



var myRoadArea = {

    rowsNum : 4,
    columnsNum : 4,
    prop : 80, //percentage of one's in matrix
    blockMat : [],
    // context: myGameArea.context,

    initRoad : function() {
    this.binaryMat = this.randomRoad(this.prop);
    this.blockMat = this.randomRoad(this.prop);
    for (var i = 0; i < this.rowsNum; i++) {
        for(var j = 0; j < this.columnsNum; j++) {
            this.blockMat[i][j] = 
            new Block(100, 100, 90+100*i, 90+100*j, "");
        }
        
        }

    },

    updateRoad : function() {

        // alert(this)
        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                let isRed = this.binaryMat[i][j];
                if (isRed) {
                    this.blockMat[i][j].block_init("#FF0000");
                }
                else {
                    this.blockMat[i][j].block_init("#0000F0");
                }

            }
            
        }



    },

    moveRoad : function() {
        // alert(this)
        // alert(this.rowsNum)
        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                this.blockMat[i][j].block_move();
            }
            
        }

    },

    randomArray : function (prop) {
        let myArray = [];
        let arrayMax = this.columnsNum;
        const Perc = 101;
        for (var i = 0; i < arrayMax; i++) {
        myArray.push(Math.floor(Math.random()*Perc/prop));
            }
        return myArray;
        },

    randomRoad : function (prop) {
        let myMat = [];
        let rowsNum = this.rowsNum;
        let columnsNum = this.columnsNum;
        for (var i = 0; i < rowsNum; i++) {
            myMat[i] = this.randomArray(prop);
            }
        return myMat;
        }
}

function moveRoad() {
    myGameArea.clear();
    myRoadArea.moveRoad();
}