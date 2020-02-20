'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.initRoad();
    let road = myRoadArea.randomRoad(50)
    // alert(road);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1440;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

class Block {
    constructor(width_, height_, x0_, y0_) {
        this.height = height_;
        this.width = width_;
        this.x0 = x0_;
        this.y0 = y0_;
        this.lines = [];
        // this.block_init("red")
    }


      block_init(color) {
        this.context = myGameArea.context;
        this.context.fillStyle = "#FF0000";
        this.context.fillRect(this.x0, this.y0, this.width, this.height);
      }
}



var myRoadArea = {

    rowsNum : 8,
    columnsNum : 6,
    prop : 80, //percentage of one's in matrix
    binaryMat : [],
    blockMat : [],
     initRoad : function() {
        this.binaryMat = this.randomRoad(80);
        this.blockMat = this.binaryMat;
        for (var i = 0; i < this.rowsNum; i++) {
            for(var j = 0; j < this.columnsNum; j++) {
                this.blockMat[i][j] = 
                new Block(90+90*i, 90+90*j, 100, 100);
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

