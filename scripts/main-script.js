'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    this.interval = setInterval(moveRoad, 10);
    // alert(road);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start() {
        this.canvas.width = 1440;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },

    clear() {
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

      block_move(speedY) {
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        this.y0 += 1;
        this.context.fillRect(this.x0, this.y0, this.width, this.height);   
      }
}



var myRoadArea = {

    shift : 0,
    rowsNum : 8,
    columnsNum : 6,
    prop : 60, //percentage of one's in matrix
    speedY : 1,
    blockMat : [],

    initRoad() {
    this.binaryMat = this.randomRoad(this.prop);
    this.blockMat = this.randomRoad(this.prop);
    for (var i = 0; i < this.rowsNum; i++) {
        for(var j = 0; j < this.columnsNum; j++) {
            this.blockMat[i][j] = 
            new Block(100, 100, 300+100*i, -100+100*j, "");
        }
        }
    },

    updateRoad() {

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

    moveRoad() {

        this.shift += this.speedY;
        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                this.blockMat[i][j].block_move(this.speedY);
            }
            }
    },

    addRoad() {
        
    },

    randomArray(prop) {
        let myArray = [];
        let arrayMax = this.columnsNum;
        const Perc = 101;
        for (var i = 0; i < arrayMax; i++) {
        myArray.push(Math.floor(Math.random()*Perc/prop));
            }
        return myArray;
        },

    randomRoad(prop) {
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