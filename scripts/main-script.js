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
        this.canvas.height = 800;
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
        this.x0 = this.blockX*this.column;
        this.y0 = this.blockY*this.row;
    }


      block_draw(color, roadHeight) {

        let b1 = 300;
        let b2 = 300;
        let height = 500;
        let wb = b1;
        let wt = b2;
        let h = height;
        let xt = 300;
        let top_left = [xt, h];
        let A1 = [[wb*wt, wb*xt],[0, wb*h]];
        let rNum = myRoadArea.rowsNum;
        let cNum = myRoadArea.columnsNum;
        let blockX = wb/cNum;
        let blockY = blockX;

        let P1 = [this.x0, this.y0];
        let P2 = [this.x0, this.y0+blockY];
        let P3 = [this.x0+blockX, this.y0+blockY];
        let P4 = [this.x0+blockX, this.y0];

        let B1 = math.divide(math.multiply(A1, P1), this.denominator(P1[1]));
        let B2 = math.divide(math.multiply(A1, P2), this.denominator(P2[1]));
        let B3 = math.divide(math.multiply(A1, P3), this.denominator(P3[1]));
        let B4 = math.divide(math.multiply(A1, P4), this.denominator(P4[1]));

        this.color = color;
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.moveTo(myRoadArea.xb1+B1[0],800-B1[1]);
        this.context.lineTo(myRoadArea.xb1+B2[0],800-B2[1]);
        this.context.lineTo(myRoadArea.xb1+B3[0],800-B3[1]);
        this.context.lineTo(myRoadArea.xb1+B4[0], 800-B4[1]);
        this.context.closePath();
        this.context.fill();
      }

      block_move(speedY) {
        this.y0 -= speedY;
        this.block_draw(this.color, 700);   
      }

      denominator(y) {
        return (100-y)*300+y*600
      }
}



var myRoadArea = {

    shift : 0,
    base1 : 300,
    base2 : 300,
    xb1 : 300,
    yb1 : 0,
    roadHeight : 500,
    rowsNum : 18,
    columnsNum : 6,
    prop : 70, //percentage of one's in matrix
    speedY : 1,
    blockMat : [],

    initRoad() {
    this.blockX = this.base1/this.columnsNum;
    // this.blockY = 2*this.base2/this.rowsNum;
    this.blockY = this.blockX;
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

        if(this.shift == this.rowsNum*this.blockY/2) {
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
            this.binaryMat[i] = this.binaryMat[i+rowsNum/2];
        }
        for (var i = rowsNum/2; i < rowsNum; i++) {
            this.binaryMat[i] = this.randomArray(this.prop);
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

