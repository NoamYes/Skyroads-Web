
'use strict';
var mySpaceship;
var accumProgress = 0;
var myScore;
var hitScreen;
var pressEscInstruction;
var paused = false;
var gameOver = false;
var roadInterval;
var hitInterval;

function startGame() {
    mySpaceship.constructor(70, 30, "images/Fighter_jet.png", 500, 700, "image");
    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
    hitScreen = new component("180px", "Consolas", "red", 850, 200, "text");
    pressEscInstruction = new component("30px", "Consolas", "yellow", 70, 300, "text");
    myGameArea.start();
    myRoadArea.initRoad();
    myRoadArea.updateRoad();
    roadInterval  = setInterval(moveRoad, 10);
    hitInterval  = setInterval(myRoadArea.checkHit, 20);
}

function stopGameOver() {
    
    clearInterval(roadInterval);
    clearInterval(hitInterval);
    gameOver = true;
    pressEscInstruction.text = "PRESS ESC KEY TO TRY AGAIN";
    pressEscInstruction.update();


}

function resetGame() {
    myGameArea.clear();
    document.location.reload();
    startGame();
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
        // ctx.translate(this.x,this.y);
        // let diffX = this.x - 600;
        // this.angle = Math.asin(diffX/myGameArea.canvas.height);
        // ctx.rotate(-this.angle);
        // ctx.translate(-x, -y); 
        ctx.drawImage(this.image,x,y,w,h);
        ctx.restore();
        this.gravitySpeed += this.gravity;
        if (this.x > myRoadArea.leftMargin && this.speedX < 0) {
            this.x += this.speedX;
        }
        else if (this.x < myRoadArea.rightMargin-this.width && this.speedX > 0) {
            this.x += this.speedX;
        }

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

        var crash = false;
        let computedDistance = this.insideBlock(myleft, mytop, block) +
        this.insideBlock(myright, mytop, block) +
        this.insideBlock(myleft, mybottom, block) +
        this.insideBlock(myright, mybottom, block);
         let insideNum = 1*(this.insideBlock(myleft, mytop, block) > 0) +
         1*(this.insideBlock(myright, mytop, block) > 0) +
         1*(this.insideBlock(myleft, mybottom, block) > 0) +
         1*(this.insideBlock(myright, mybottom, block) > 0);

        if(computedDistance < 70 && computedDistance > 5) crash = true;
        if (insideNum > 2) crash = true;

        return crash;
      },

      insideBlock(x, y, block) {

        let upLeft = math.matrix(block.t_left);
        let downLeft = math.matrix(block.b_left);
        let upRight = math.matrix(block.t_right);
        let downRight = math.matrix(block.b_right);
        let insideLeft =  block.insideLeftEquation(x ,y);
        let insideRight =  block.insideRightEquation(x, y);
        let inside = (insideLeft && insideRight &&
            y < downLeft._data[1] && y > upRight._data[1] &&
            x > downLeft._data[0] && x < downRight._data[0]);

        // let inside = (x > downLeft._data[0] && x < downRight._data[0] &&
        // y < downLeft._data[1] && y > upRight._data[1]);
        
        let temp1 = math.add(downLeft,downRight);
        let temp2 = math.add(upLeft,upRight);
        let center = math.add(temp1,temp2);
        center = math.divide(center,4);
        center = center._data;    
        let insideBlock = inside;
        let d_center = this.dist([x,y], center);
        let max_d = d_center
        let sum_d = d_center
        if(inside) {
            let k = 5;
        }
    
        return inside*sum_d;




      },



      dist (point1, point2) {
        var deltaX = point2[0] - point1[0];
        var deltaY = point2[1] - point1[1];
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        return (dist);
      },


      isHit() {
        if (!this.isJumping) {
            // for (var i = 0; i < myRoadArea.rowsNum; i++) { 
                for(var j = 0; j < myRoadArea.columnsNum; j++) {
                    let rNum = myRoadArea.rowsNum;
                    let isRed = myRoadArea.blockMat[myRoadArea.firstrowIndex][j].isRed;
                    if(this.crashWith(myRoadArea.blockMat[myRoadArea.firstrowIndex][j]) && isRed) {
                        // alert('Hit')
                        hitScreen.text = "HIT!"
                        hitScreen.update();
                        accumProgress = 0;
                        stopGameOver();
                    }
                }
            // }
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

        let B1 = math.divide(math.multiply(A1, P1), this.denominator(P1[1]));
        let B2 = math.divide(math.multiply(A1, P2), this.denominator(P2[1]));
        let B3 = math.divide(math.multiply(A1, P3), this.denominator(P3[1]));
        let B4 = math.divide(math.multiply(A1, P4), this.denominator(P4[1]));
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

        this.t_left = [myRoadArea.xb1+B2[0],CanvasHeight-B2[1]];
        this.b_left = [myRoadArea.xb1+B1[0],CanvasHeight-B1[1]];
        this.t_right = [myRoadArea.xb1+B3[0],CanvasHeight-B3[1]];
        this.b_right = [myRoadArea.xb1+B4[0], CanvasHeight-B4[1]];
        if (!myRoadArea.initiated && this.row == 0 && this.column == myRoadArea.columnsNum-1) {
            myRoadArea.rightMargin = myRoadArea.xb1+B4[0];
            myRoadArea.leftMargin = myRoadArea.xb1;
            myRoadArea.initiated = true;
        }
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

      insideRightEquation(x_, y) {
        let CanvasHeight = myGameArea.canvas.height;
          let m = (this.b_right[1]-this.t_right[1])/(
              this.b_right[0]-this.t_right[0]);
          let y_ = m*(x_-this.t_right[0]) + this.t_right[1];
          return ((y < y_) && m < 0 ) || ((y > y_) && (m > 0))

    }

    insideLeftEquation(x_, y) {
        let CanvasHeight = myGameArea.canvas.height;
        let m = (this.t_left[1]-this.b_left[1])/(
            this.t_left[0]-this.b_left[0]);
        let y_ = m*(x_-this.t_left[0]) + this.t_left[1];
        return ((y > y_) && m < 0 ) || ((y < y_) && (m > 0))

  }
}


var myRoadArea = {

    shift : 0,
    base1 : 300,
    base2 : 300,
    xb1 : 300,
    yb1 : 0,
    roadHeight : 500,
    rowsNum : 30,
    columnsNum : 6,
    prop : 10, //percentage of one's in matrix
    speedY : 1,
    blockMat : [],
    initiated: false,

    initRoad() {
    this.blockX = this.base1/this.columnsNum;
    // this.blockY = 2*this.base2/this.rowsNum;
    this.blockY = this.blockX;
    this.binaryMat = this.randomRoad(this.prop);
    this.binaryMat[0] = this.randomArray(0);
    this.blockMat = this.randomRoad(this.prop);
    this.firstrowIndex = Math.floor(this.shift/this.blockY);

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
        this.prop = 100*(calcDifficulty(accumProgress));
        if(this.shift >= this.rowsNum*this.blockY/2) {
            this.addRoad();
            this.shift = 0;
        }
        else{ 
            this.shift += this.speedY;
            accumProgress += this.speedY;
            for (var i = 0; i < this.rowsNum; i++) {
                for(var j = 0; j < this.columnsNum; j++) {
                    this.blockMat[i][j].block_move(this.speedY);
                }
                }
        }
        this.firstrowIndex = Math.floor(this.shift/this.blockY);
        mySpaceship.update();
        // this.checkHit();
        
    },

    checkHit() {
        mySpaceship.isHit();
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
        let Prop = 100 - prop;
        myArray.push(Math.floor(Math.random()*Perc/Prop));
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
        let Score = calcScore(accumProgress);
        myScore.text = "SCORE: " + Math.floor(Score) +", DIFFICULTY: " + Math.floor(myRoadArea.prop) ;
        myScore.update();
    }

}


function calcScore(progress) {
    return progress/10;
}

function calcDifficulty(progress) {
    return 0.4*(2/Math.PI)*Math.atan(progress/10000)+0.05;
}

function component(width, height, color, x, y, type) {
    let ctx = myGameArea.context;  
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }

window.addEventListener("keydown", moveSelection);
window.addEventListener("keyup", (event) => mySpaceship.clearmove(event));
window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key === 27)// esc key
    {
        if(gameOver == false) {
            togglePause();
        }
        else {
            resetGame();
        }

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
        pressEscInstruction.text = "PRESS ESC KEY TO RESUME";
        pressEscInstruction.update();
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

