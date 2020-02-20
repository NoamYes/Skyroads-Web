'use strict';

function startGame() {
    myGameArea.start();
    myRoadArea.init();
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
        this.lineblocks();
    }

    lineblocks() {
        for (let i=0; i<this.height; i+=1) {
        let new_line = new block_line(this.width, this.x0, this.y0+i);
         this.lines.push(new_line);
        }
      }

      block_init(color) {
        for (let i=0; i<this.height; i+=1) {
            this.lines[i].init_line(color);
            }
      }
}

class block_line {
    constructor(width_, x0_, y0_) {
        this.width = width_;
        this.x0 = x0_;
        this.y0 = y0_;

    }
    init_line(color) {
        this.context = myGameArea.context;
        this.context.fillstyle = color;
        this.context.fillRect(this.x0, this.y0, this.width, 1);
    }
}


var myRoadArea = {
    mainBlock : new Block(90, 200, 100, 100),
     init : function() {
        
     this.mainBlock.block_init("red");
     }
}

