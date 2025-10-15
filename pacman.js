const canvas = document.getElementById("pacman-canvas");
const ctx = canvas.getContext("2d");

const blockSize = 20;
const rowCount = 30;
const colCount = 30;

canvas.width = blockSize * colCount;
canvas.height = blockSize * rowCount;
canvas.style.backgroundColor = "black";

// Set up Boundary class for walls  - argument is an object so you dont have to remember order of params
class Boundary {
    constructor({position}) {
        this.position = position;
        this.width = blockSize;
        this.height = blockSize;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// const boundary = new Boundary({ 
//     position: { 
//         x: 0, 
//         y: 0 
//     } 
// });

// boundary.draw();