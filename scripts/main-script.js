'use strict';
var mySpaceship;
var paused = true;

function startGame() {
    mySpaceship.constructor(120, 120, "images/Fighter_jet.png", 500, 700, "image");
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    setInterval(moveRoad, 10);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start() {
        this.canvas.width = 2440;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
}


var mySpaceship = {

    constructor(width, height, color, x, y) {
        this.image = new Image();
        this.image.src = color;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.18;
        this.gravitySpeed = 0; 
        this.bounce = 0;    
        this.jumpHeight = 120;
        this.isJumping = false;  
        this.hitSensitivity = 5; 
        this.x = x;
        this.y0 = y;   
        this.y = y; 
        this.hitBottom = function() {
            var rockbottom = myGameArea.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.isJumping = false;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
                this.speedY = 0;
            }
        }
    
    },

    update() {
        let ctx = myGameArea.context;   
        let x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.save();
        ctx.translate(this.x,this.y);
        let diffX = this.x - 600;
        this.angle = Math.asin(diffX/myGameArea.canvas.height);
        ctx.rotate(-this.angle);
        ctx.translate(-x, -y); 
        ctx.drawImage(this.image,x,y,w,h);
        ctx.restore();
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY+this.gravitySpeed;
        let diffY = mySpaceship.y0 - this.y;
        this.hitBottom();

    } ,

    moveleft() {
        this.speedX = -3; 
    },
    
    moveright() {
        this.speedX = 3; 
    },
    
    jump() {
        this.isJumping = true;
        this.speedY = -6;

    },
    
    clearmove(e) {
        if (e.keyCode != 32) {
            this.speedX = 0; 
        } 

    },

    crashWith(block) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        let upLeft = block.t_left;
        let downLeft = block.b_left;
        let upRight = block.t_right;
        let downRight = block.b_right;
        var crash = false;
        let left_limit = (downRight[0] - myleft > this.hitSensitivity) &&
        (downRight[0] - myleft < this.width);

        let right_limit = (myright - downLeft[0] > this.hitSensitivity) &&
            (myright - downLeft[0] < this.width); 
        let vert_condition = Math.abs(mybottom - upRight[1]) < this.height/2;
        if ((left_limit && vert_condition) || 
            (right_limit && vert_condition)) {
                crash = true;
            }
             
            return crash;
      },

      isHit() {
        if (!this.isJumping) {
            for (var i = 0; i < myRoadArea.rowsNum; i++) { 
                for(var j = 0; j < myRoadArea.columnsNum; j++) {
                    let rNum = myRoadArea.rowsNum;
                    let isRed = myRoadArea.blockMat[i][j].isRed;
                    if(this.crashWith(myRoadArea.blockMat[i][j]) && isRed) {
                        alert('Hit')
                    }
                }
            }
        }
      }

    
    

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


      block_draw(color) {

        let b1 = 300;
        let b2 = 300;
        let height = myRoadArea.roadHeight;
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

        let B1 = this.t_left = math.divide(math.multiply(A1, P1), this.denominator(P1[1]));
        let B2 = this.b_left = math.divide(math.multiply(A1, P2), this.denominator(P2[1]));
        let B3 = this.b_right = math.divide(math.multiply(A1, P3), this.denominator(P3[1]));
        let B4 = this.t_right = math.divide(math.multiply(A1, P4), this.denominator(P4[1]));
        this.coords = [B1, B2, B3, B4];
        this.color = color;
        this.isRed = color == "#FF0000";
        this.context = myGameArea.context;
        this.context.fillStyle = this.color;
        let CanvasHeight = myGameArea.canvas.height;
        // if(this.y0 < myRoadArea.roadHeight) {
            this.context.beginPath();
            this.context.moveTo(myRoadArea.xb1+B1[0],CanvasHeight-B1[1]);
            this.context.lineTo(myRoadArea.xb1+B2[0],CanvasHeight-B2[1]);
            this.context.lineTo(myRoadArea.xb1+B3[0],CanvasHeight-B3[1]);
            this.context.lineTo(myRoadArea.xb1+B4[0], CanvasHeight-B4[1]);
            this.context.closePath();
            this.context.fill();
            this.context.strokeStyle = "#000000";
            this.context.stroke();
        // } 

      }

      block_move(speedY) {
        this.y0 -= speedY;
        if (this.y0 > -this.blockY) {
            this.block_draw(this.color)
        }
;   
      }

      denominator(y) {
        return (100-y)*350+y*600
      }
}


var myRoadArea = {

    shift : 0,
    base1 : 300,
    base2 : 300,
    xb1 : 300,
    yb1 : 0,
    roadHeight : 500,
    rowsNum : 20,
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
                    this.blockMat[i][j].block_draw("#669999", this.roadHeight);
                }

            }
            
        }

    },

    moveRoad() {

        if(this.shift >= this.rowsNum*this.blockY/2) {
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
        mySpaceship.update();
        // mySpaceship.isHit();
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
    if (!paused) {
        myGameArea.clear();
        myRoadArea.moveRoad();
    }

}



window.addEventListener("keydown", moveSelection);
window.addEventListener("keyup", (event) => mySpaceship.clearmove(event));
window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key === 27)// esc key
    {
        togglePause();
    }
    });

window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key === 38)// up key
    {
        speedUP();
    }
    if (key === 40)// down key
    {
        speedDOWN();
    }
    });

function moveSelection(event) {  
    switch (event.keyCode) {
        case 37:
            mySpaceship.moveleft();
        break;

        case 39:
            mySpaceship.moveright();
        break;

        case 32:
            mySpaceship.jump();
        break;
    }
    event.preventDefault();
};

function togglePause()
{
    if (!paused)
    {
        paused = true;
    } else if (paused)
    {
       paused= false;
    }

}

function speedUP() {
    if (myRoadArea.speedY < 10) {
        myRoadArea.speedY+= 1;
    }
}

function speedDOWN() {
    if (myRoadArea.speedY > 1) {
        myRoadArea.speedY-= 1;
    }
}