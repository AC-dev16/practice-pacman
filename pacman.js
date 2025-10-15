const canvas = document.getElementById("pacman-canvas");
const ctx = canvas.getContext("2d");

const blockSize = 40;
const rowCount = 20;
const colCount = 20;

canvas.width = blockSize * colCount;
canvas.height = blockSize * rowCount;
canvas.style.backgroundColor = "black";

// Set up Boundary class for walls  - argument is an object so you dont have to remember order of params
class Boundary {
    static width = blockSize;
    static height = blockSize;
    constructor({position}) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        // this.radians = 0.75;
        // this.openRate = 0.12;
        // this.rotation = 0;
    }

    draw() {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);// Math.PI * 2 creates a full circle
        ctx.fill();
        ctx.closePath();
    }
};

// Create the map using a 2D array
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '-', '-', '-', ' ', ' ', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', '-', '-', ' ', '-', ' ', '-', ' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-', ' ', '-', '-', '-'],
    ['-', '-', '-', ' ', '-', ' ', '-', ' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-', ' ', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', ' ', '-', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', ' ', '-', '-', '-'],
    ['-', '-', '-', ' ', '-', '-', ' ', '-', '-', '-', '-', '-', '-', ' ', '-', '-', ' ', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', '-', '-', '-', ' ', '-', '-', ' ', '-', '-', '-', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', '-', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '-', '-', ' ', '-', '-', ' ', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
];

const boundaries = [];
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }   
});

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        }
                    })
                );
                break;
            }
        });
    });

boundaries.forEach(boundary => {
    boundary.draw();
});

player.draw();