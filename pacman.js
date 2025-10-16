const canvas = document.getElementById("pacman-canvas");
const ctx = canvas.getContext("2d");

const blockSize = 30;
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
        this.radius = 12.5;
        //Creates the mouth opening and closing effect
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

    update() {
       this.draw();
         this.position.x += this.velocity.x;
         this.position.y += this.velocity.y;
         //Handles the mouth opening and closing effect
         // if (this.radians < 0 || this.radians > 0.75) {
         //     this.openRate = -this.openRate;
         // }
         // this.radians += this.openRate;
         // this.rotation += 0.1; 
    }
};


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

// Object to keep track of which keys are pressed
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
};

let lastKey = '';

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

// Loop through the map array and create boundaries based on the symbols
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


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Gets rid of the trail effect
    boundaries.forEach(boundary => {
        boundary.draw();
    });
    player.update();
    player.velocity.x = 0;
    player.velocity.y = 0;

    // Handle player movement based on key presses
    if (keys.w.pressed && lastKey === 'w') {
        player.velocity.y = -2;
    } else if (keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -2;
    } else if (keys.s.pressed && lastKey === 's') {
        player.velocity.y = 2;
    } else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 2;
    }
};

animate();

player.update();// wont work without animation loop

window.addEventListener("keydown", ({ key }) => {
    switch(key) {
        case 'w': 
            keys.w.pressed = true; 
            lastKey = 'w';
            break;
        case 'a': 
            keys.a.pressed = true; 
            lastKey = 'a';
            break;
        case 's': 
            keys.s.pressed = true; 
            lastKey = 's';
            break;
        case 'd': 
            keys.d.pressed = true; 
            lastKey = 'd';
            break;
    }
});

window.addEventListener("keyup", ({ key }) => {
    switch(key) {
        case 'w': keys.w.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
        case 's': keys.s.pressed = false; break;
        case 'd': keys.d.pressed = false; break;
    }
});