'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    // setInterval(moveRoad, 10);
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
        this.x0 = myRoadArea.xb1+this.blockX*this.column;
        this.y0 = myRoadArea.yb1+this.blockY*this.row;
    }


      block_draw(color, roadHeight) {

        let xView = myRoadArea.xb1 +  (myRoadArea.base1)/2;
        // let C = [xView, myRoadArea.roadHeight+200 ,myRoadArea.roadHeight/2]
        let C = [xView, myRoadArea.roadHeight ,myRoadArea.roadHeight/2]
        let P1 = this.leftup = [this.x0, this.y0, 0];
        let P2 = this.rightup = [this.x0+this.blockX, this.y0, 0];
        let P3 = this.leftdown = [this.x0, this.y0+this.blockY, 0];
        let P4 = this.rightup = [this.x0+this.blockX, this.y0+this.blockY, 0];
        let sqrt2 = math.sqrt(2)/2;
        let M = math.matrix([[1,0,0], [0, sqrt2, sqrt2], [0, -sqrt2, sqrt2]])
        let D1 = math.multiply(M,math.subtract(P1,C))
        let D2 = math.multiply(M,math.subtract(P2,C))
        let D3 = math.multiply(M,math.subtract(P3,C))
        let D4 = math.multiply(M,math.subtract(P4,C))
        let E = [700, 0, myRoadArea.base1];
        let K = math.matrix([[1, 0, E[0]/E[2]], [0, 1, E[1]/E[2]], [0, 0, 1/E[2]]]);
        let F1 = math.multiply(K,D1);
        let F2 = math.multiply(K,D2);
        let F3 = math.multiply(K,D3);
        let F4 = math.multiply(K,D4);
        let B1 = [F1.get([0])/F1.get([2]), F1.get([1])/F1.get([2])];
        let B2 = [F2.get([0])/F2.get([2]), F2.get([1])/F2.get([2])];
        let B3 = [F3.get([0])/F3.get([2]), F3.get([1])/F3.get([2])];
        let B4 = [F4.get([0])/F4.get([2]), F4.get([1])/F4.get([2])];

        this.color = color;
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.moveTo(B1[0],B1[1]);
        this.context.lineTo(B2[0],B2[1]);
        this.context.lineTo(B3[0],B3[1]);
        // this.context.lineTo(0, 90);
        this.context.closePath();
        this.context.fill();
      }

      block_move(speedY) {
        this.y0 += speedY;
        this.block_draw(this.color, 700);   
      }
}



var myRoadArea = {

    shift : 0,
    base1 : 400,
    base2 : 400,
    xb1 : 300,
    yb1 : 0,
    roadHeight : 700,
    rowsNum : 3,
    columnsNum : 2,
    prop : 70, //percentage of one's in matrix
    speedY : 1,
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

