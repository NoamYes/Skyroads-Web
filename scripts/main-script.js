'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    setInterval(moveRoad, 10);
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
    constructor(width_, height_, row, column, color, roadHeight) {
        this.row = row;
        this.column = column;
        this.blockY = height_;
        this.blockX = width_;
        this.lines = [];
        this.color = color;
        this.x0 = 300+this.blockX*this.column;
        this.y0 = -roadHeight+this.blockY*this.row;
    }


      block_draw(color, roadHeight) {
        this.color = color;
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        // alert(this.color + this.x0 + this.y0)
        this.context.fillRect(this.x0, this.y0, this.blockX, this.blockY);
      }

      block_move(speedY) {
        this.y0 += speedY;
        this.block_draw(this.color, 700);   
      }
}



var myRoadArea = {

    shift : 0,
    base1 : 600,
    base2 : 700,
    rowsNum : 14,
    columnsNum : 6,
    prop : 70, //percentage of one's in matrix
    speedY : 1,
    roadHeight : 700,
    blockMat : [],

    initRoad() {
    this.blockX = this.base1/this.columnsNum;
    this.blockY = 2*this.base2/this.rowsNum;
    this.binaryMat = this.randomRoad(this.prop);
    this.blockMat = this.randomRoad(this.prop);

    },

    updateRoad() {

        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                this.blockMat[i][j] = 
                new Block(this.blockX, this.blockY, 
                    i, j, "", this.roadHeight);
            }
            }

        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                let isRed = this.binaryMat[i][j];
                if (isRed) {
                    this.blockMat[i][j].block_draw("#FF0000", this.roadHeight);
                }
                else {
                    this.blockMat[i][j].block_draw("#000000", this.roadHeight);
                }

            }
            
        }

    },

    moveRoad() {
        if(this.shift == this.roadHeight) {
            this.addRoad();
            this.shift = 0;
        }
        else{ 
            this.shift += this.speedY;
            for (var i = 0; i < this.rowsNum; i++) {
                for(var j = 0; j < this.columnsNum; j++) {
                    this.blockMat[i][j].block_move(this.speedY);
                }
                }
        }

    },

    addRoad() {
        let rowsNum = this.rowsNum;
        let columnsNum = this.columnsNum;
        for (var i = 0; i < rowsNum/2; i++) {
            this.binaryMat[i+rowsNum/2] = this.binaryMat[i];
        }
        for (var i = rowsNum/2; i < rowsNum; i++) {
            this.binaryMat[i-rowsNum/2] = this.randomArray(this.prop);
        }
        this.updateRoad();
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