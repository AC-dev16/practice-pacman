const canvas = document.getElementById("pacman-canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreEl");

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

class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);// Math.PI * 2 creates a full circle
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
};

const pellets = [];
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
let score = 0;

// Create the map using a 2D array
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '-', '-', '-', '-', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '-', '.', '.', '.', '-'],
    ['-', '-', '-', '.', '-', '.', '-', '.', '-', '.', '.', '-', '.', '-', '.', '-', '.', '-', '-', '-'],
    ['-', '-', '-', '.', '-', '.', '-', '.', '-', '.', '.', '-', '.', '-', '.', '-', '.', '-', '-', '-'],
    ['-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '-', '.', '-', '.', '.', '.', '.', '-', '.', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '-', '-', '-'],
    ['-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-'],
    ['-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-'],
    ['-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
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
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                );
                break;
            }
        });
    });


function circleCollidesWithRectangle({circle, rectangle}) {
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Gets rid of the trail effect
     // Handle player movement based on key presses
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            // Check for collision with each boundary
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x: 0, y: -5}}, rectangle: boundary})) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -5;
        }
        }
   
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            // Check for collision with each boundary
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x: -5, y: 0}}, rectangle: boundary})) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -5;
        }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            // Check for collision with each boundary
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x: 0, y: 5}}, rectangle: boundary})) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = 5;
        }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            // Check for collision with each boundary
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x: 5, y: 0}}, rectangle: boundary})) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = 5;
        }
        }
    }

    // Draw and handle pellets
    // Using a for loop instead of forEach so we can splice (remove) pellets when eaten without rendering issues/ flickering - going backwards through array so splicing doesn't affect the indexes of pellets yet to be checked
    // Touch pellets here
    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i];
        pellet.draw();
        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            // console.log('pellet eaten');
            pellets.splice(i, 1);
            score += 10;
            scoreEl.innerHTML = score;
        }
    }

    boundaries.forEach(boundary => {
        boundary.draw();
        // Collision detection between player and boundaries - order: top, right, bottom, left
        // + player.velocity.y/x to check where the player is going to be, not where it currently is - stops sticking to walls
        if (circleCollidesWithRectangle({circle: player, rectangle: boundary})) {
            player.velocity.y = 0;
            player.velocity.x = 0;
        }
    });

    player.update();
    // player.velocity.x = 0;
    // player.velocity.y = 0;

   
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