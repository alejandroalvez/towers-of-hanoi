const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#cddc39"
];

let discs = [];
let totalDiscs = [];

let pin1 = [];
let pin2 = [];
let pin3 = [];

document.getElementById('send').addEventListener('click', (e) => {
    e.preventDefault();
    const towerHeight = document.getElementById('height').value;
    const message = document.getElementById('message');

    // Validate height
    if (towerHeight < 5 || towerHeight > 10) {
        message.style.visibility = "visible";
    } else {
        message.style.visibility = "hidden";
        displaySolution(towerHeight);
    }
});


const displaySolution = (towerHeight) => {
    discs = [];
    pin1 = [];
    pin2 = [];
    pin3 = [];
    drawCanvas();
    drawTower(towerHeight);
    animateSolution(towerHeight);
}

const drawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const base = {
        x: 0,
        y: 500,
        width: 900,
        height: 50,
        draw() {
            ctx.fillStyle = "#3e2723";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const pins = {
        y: 150,
        width: 10,
        height: 350,
        draw() {
            ctx.fillStyle = "#3e2723";
            ctx.fillRect(135, this.y, this.width, this.height);
            ctx.fillRect(445, this.y, this.width, this.height);
            ctx.fillRect(755, this.y, this.width, this.height);
        }
    }

    base.draw();
    pins.draw();
    ctx.save();
}

const drawTower = (towerHeight) => {
    let x = 635;
    let y = 470;
    let w = 250;
    let h = 30;
    let d = 10;
    
    for (let i = 0; i < towerHeight; i++) {
        if (i == 0) {
            const disc = {
                x: x,
                y: y,
                w: w,
                h: h,
                d: d,
                color: colors[i]
            };

            if (!discs[i]) {
                discs[i] = disc;
            }

            drawDisc(disc);
        } else {
            x += 10;
            y -= 30;
            w -= 20;
            const disc = {
                x: x,
                y: y,
                w: w,
                h: h,
                d: d,
                color: colors[i]
            };

            if (!discs[i]) {
                discs[i] = disc;
            }

            drawDisc(disc);
        }
    }

    if (pin3.length == 0 && pin2.length == 0 && pin1.length == 0) {
        pin3 = [...discs];
        totalDiscs = [...discs];
        for (let i = 0; i < totalDiscs.length; i++) {
            totalDiscs[i].n = (i + 1);
        }
    }
}

const redrawTowers = () => {
    const redrawTower = (pin) => {
        for (let i = 0; i < pin.length; i++) {
            disc = pin[i];
            drawDisc(disc);
        }
    }

    if (pin3.length > 0) {
        redrawTower(pin3);
    }
    if (pin2.length > 0) {
        redrawTower(pin2);
    }
    if (pin1.length > 0) {
        redrawTower(pin1);
    }

}

const drawDisc = (disc) => {
    ctx.fillStyle = disc.color;
    ctx.fillRect(disc.x, disc.y, disc.w, disc.h);
}

const animateSolution = (towerHeight) => {
    if (towerHeight % 2 == 0) {
        move3to1();
    } else {
        move3to2();
    }
}

const moveToOne = (disc, xi, yi, start) => {
    drawCanvas();
    redrawTowers();
    ctx.fillStyle = disc.color;
    ctx.fillRect(disc.x, disc.y, disc.w, disc.h);

    if ( disc.y > 0 && disc.x == xi ) {
        disc.y -= disc.d;
        window.requestAnimationFrame( () => moveToOne(disc, xi, yi, start) );
    } else if ( start == 3 && disc.x > xi - 620) {
        disc.x -= disc.d;
        window.requestAnimationFrame( () => moveToOne(disc, xi, yi, start) );
    } else if ( start == 2 && disc.x > xi - 310) {
        disc.x -= disc.d;
        window.requestAnimationFrame( () => moveToOne(disc, xi, yi, start) );
    } else if ( disc.y < (470 - (pin1.length - 1) * 30) ) {
        disc.y += disc.d;
        window.requestAnimationFrame( () => moveToOne(disc, xi, yi, start) );
    } else {
        nextMove(disc);
    }
}

const moveToTwo = (disc, xi, yi, start) => {
    drawCanvas();
    redrawTowers();
    ctx.fillStyle = disc.color;
    ctx.fillRect(disc.x, disc.y, disc.w, disc.h);

    if ( disc.y > 0 && disc.x == xi ) {
        disc.y -= disc.d;
        window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, start) );
    } else if ( start == 3 && disc.x > xi - 310 ) {
        disc.x -= disc.d;
        window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, start) );
    } else if ( start == 1 && disc.x < xi + 310 ) {
        disc.x += disc.d;
        window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, start) );
    } else if ( disc.y < (470 - (pin2.length - 1) * 30) ) {
        disc.y += disc.d;
        window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, start) );
    } else {
        nextMove(disc);
    }
}

const moveToThree = (disc, xi, yi, start) => {
    drawCanvas();
    redrawTowers();
    ctx.fillStyle = disc.color;
    ctx.fillRect(disc.x, disc.y, disc.w, disc.h);

    if ( disc.y > 0 && disc.x == xi ) {
        disc.y -= disc.d;
        window.requestAnimationFrame( () => moveToThree(disc, xi, yi, start) );
    } else if ( start == 2 && disc.x < xi + 310 ) {
        disc.x += disc.d;
        window.requestAnimationFrame( () => moveToThree(disc, xi, yi, start) );
    } else if ( start == 1 && disc.x < xi + 620 ) {
        disc.x += disc.d;
        window.requestAnimationFrame( () => moveToThree(disc, xi, yi, start) );
    } else if ( disc.y < (470 - (pin3.length - 1) * 30) ) {
        disc.y += disc.d;
        window.requestAnimationFrame( () => moveToThree(disc, xi, yi, start) );
    } else {
        nextMove(disc);
    }
}

const nextMove = (discMoved) => {
    if ( pin1.length == 0 && pin3.length == 0 ) {
        return;
    } else {
        let discPin1 = pin1[pin1.length - 1];
        let discPin2 = pin2[pin2.length - 1];
        let discPin3 = pin3[pin3.length - 1];

        // No disc can be placed on top of a smaller disc
        // No odd disk can be placed directly on an odd disc, the same happens for even discs
        // There will be sometimes two possible pins: one will have discs, and the other will be empty. Place the disc in the non-empty pin.
        // Never move a disc twice in succession
        if (discPin1 == undefined) {
            if ( Object.is(discPin2, discMoved) ) {
                // Move discPin3
                if ( discPin3.w < discPin2.w && stackable(discPin3, discPin2) ) {                    
                    move3to2();
                } else {
                    move3to1();
                }
            } else {
                // Move discPin2
                if ( discPin2.w < discPin3.w && stackable(discPin2, discPin3) ) {
                    move2to3();
                } else {
                    move2to1();
                }
            }
        } else if (discPin2 == undefined) {
            if ( Object.is(discPin1, discMoved) ) {
                // Move discPin3
                if ( discPin3.w < discPin1.w && stackable(discPin3, discPin1) ) {
                    move3to1();
                } else {
                    move3to2();
                }
            } else {
                // Move discPin1
                if ( discPin1.w < discPin3.w && stackable(discPin1, discPin3) ) {
                    move1to3();
                } else {
                    move1to2();
                }
            }
        } else if (discPin3 == undefined) {
            if ( Object.is(discPin1, discMoved) ) {
                // Move discPin2
                if ( discPin2.w < discPin1.w && stackable(discPin2, discPin1) ) {
                    move2to1();
                } else {
                    move2to3();
                }
            } else {
                // Move discPin1
                if ( discPin1.w < discPin2.w && stackable(discPin1, discPin2) ) {
                    move1to2();
                } else {
                    move1to3();
                }
            }
        } else if (discPin1 != undefined && discPin2 != undefined && discPin3 != undefined) {
            if ( Object.is(discPin1, discMoved) ) {
                // Move discPin2 or discPin3
                if ( discPin3.w < discPin1.w && stackable(discPin3, discPin1) ) {
                    move3to1();
                } else if ( discPin3.w < discPin2.w && stackable(discPin3, discPin2) ) {
                    move3to2();
                } else if ( discPin2.w < discPin1.w && stackable(discPin2, discPin1) ) {
                    move2to1();
                } else if ( discPin2.w < discPin3.w && stackable(discPin2, discPin3) ) {
                    move2to3();
                }
            } else if ( Object.is(discPin2, discMoved) ) {
                // Move discPin1 or discPin3
                if ( discPin3.w < discPin1.w && stackable(discPin3, discPin1) ) {
                    move3to1();
                } else if ( discPin3.w < discPin2.w && stackable(discPin3, discPin2) ) {
                    move3to2();
                } else if ( discPin1.w < discPin2.w && stackable(discPin1, discPin2) ) {
                    move1to2();
                } else if ( discPin1.w < discPin3.w && stackable(discPin1, discPin3) ) {
                    move1to3();
                }
            } else if ( Object.is(discPin3, discMoved) ) {
                // Move discPin1 or discPin2
                if ( discPin2.w < discPin1.w && stackable(discPin2, discPin1) ) {
                    move2to1();
                } else if ( discPin2.w < discPin3.w && stackable(discPin2, discPin3) ) {
                    move2to3();
                } else if ( discPin1.w < discPin2.w && stackable(discPin1, discPin2) ) {
                    move1to2();
                } else if ( discPin1.w < discPin3.w && stackable(discPin1, discPin3) ) {
                    move1to3();
                }
            }
        }
    }
}

const stackable = (o1, o2) => {
    if ( (o1.n % 2 == 0) && (o2.n % 2 != 0) ) {
        return true;
    } else if ( (o2.n % 2 == 0) && (o1.n % 2 != 0) ) {
        return true;
    } else {
        return false;
    }
}

const move1to2 = () => {
    const disc = pin1.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin2.push(disc);

    window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, 1) );
}

const move1to3 = () => {
    const disc = pin1.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin3.push(disc);

    window.requestAnimationFrame( () => moveToThree(disc, xi, yi, 1) );
}

const move2to1 = () => {
    const disc = pin2.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin1.push(disc);

    window.requestAnimationFrame( () => moveToOne(disc, xi, yi, 2) ); 
}

const move2to3 = () => {
    const disc = pin2.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin3.push(disc);

    window.requestAnimationFrame( () => moveToThree(disc, xi, yi, 2) );
}

const move3to1 = () => {
    const disc = pin3.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin1.push(disc);

    window.requestAnimationFrame( () => moveToOne(disc, xi, yi, 3) );
}

const move3to2 = () => {
    const disc = pin3.pop();
    const xi = disc.x;
    const yi = disc.y;
    pin2.push(disc);

    window.requestAnimationFrame( () => moveToTwo(disc, xi, yi, 3) );
}