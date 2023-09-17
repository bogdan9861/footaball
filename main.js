'use strict';

const cvs = document.querySelector('canvas'),
    ctx = cvs.getContext('2d');

cvs.width = 1200;
cvs.height = 800;

const bg = new Image(),
    ballImg = new Image();

const punch = document.querySelector('#punch'),
    rebound = document.querySelector('#rebound'),
    lose = document.querySelector('#lose');

lose.volume = 0.5;
punch.volume = 1;

bg.src = 'football-ground.png';
ballImg.src = 'ball.png';

//start

const startBtn = document.querySelector('#start'),
    startScreen = document.querySelector('.startScreen');

startBtn.addEventListener('click', (e) => {
    startScreen.classList.remove('startScreen--active');
    ball.generate(6);
    ball.derection = ball.random;
    gameIsStart = true;
});

let gameIsStart = false;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameIsStart === false) {
        startScreen.classList.remove('startScreen--active');
        ball.generate(6);
        ball.derection = ball.random;
        gameIsStart = true;
    }
})


class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.lastKey
        this.score = 0
    }

    draw() {
        ctx.fillStyle = 'rgb(247, 239, 239)';
        ctx.fillRect(this.position.x, this.position.y, 30, 100);

        this.position.y += this.velocity.y;

        if (this.position.y <= 0) {
            this.position.y += 9;
        } else if (this.position.y >= cvs.height - 100) {
            this.position.y -= 9;
        }
    }

    update() {
        this.draw();
    }

}

class Ball extends Player {

    constructor({ position, velocity, derection }) {
        super({ position, velocity })
        this.derection = derection
        this.random
    }

    draw() {
        ctx.drawImage(ballImg, this.position.x, this.position.y)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y <= 0) {
            this.position.y += 5;
            ball.generate(6);
            if (this.random == 4 && this.random == 5 && this.random == 0 && this.random == 1) {
                ball.generate(6);
            } else {
                this.derection = this.random
                rebound.play();
            }
        } else if (this.position.y + 50 >= cvs.height) {
            this.position.y -= 5;
            ball.generate(6);
            if (this.random == 2 && this.random == 3 && this.random == 0 && this.random == 1) {
                ball.generate(6);
            } else {
                this.derection = this.random
                rebound.play();
            }
        }
    }

    update() {
        this.draw();
    }

    generate(max) {
        this.random = Math.floor(Math.random() * max);
        return this.random;
    }
}

const player = new Player({
    position: {
        x: 0,
        y: cvs.height / 2 - 100
    },

    velocity: {
        y: 0
    }
})

const enemy = new Player({
    position: {
        x: cvs.width - 30,
        y: cvs.height / 2 - 100
    },

    velocity: {
        y: 0
    }
});

const ball = new Ball({

    position: {
        x: cvs.width / 2 - 25,
        y: cvs.height / 2 - 50
    },

    velocity: {
        x: 0,
        y: 0
    },

    derection: Number
});

// 0 = x+= 1 y+= 0 направо
// 1 = x+= -1 y+= 0 налево
// 2 = x+=1 y+= 1 направо вверх
// 3 = x+= -1 y+= 1 налево вниз
// 4 = x+= 1 y+= -1 направо вверх
// 5 = x+= 1 y+= 1 направо вниз


const keys = {
    w: {
        pressed: false
    },

    s: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    },

    ArrowDown: {
        pressed: false
    }

}

function loop() {
    ctx.drawImage(bg, 0, 0)

    ctx.fillStyle = '#fff';
    ctx.fillRect(cvs.width / 2, 0, 3, cvs.height);

    ctx.font = "50px Oswald";
    ctx.fillText(player.score, cvs.width / 2 - 60, cvs.height / 2 - 200);
    ctx.fillText(enemy.score, cvs.width / 2 + 40, cvs.height / 2 - 200);

    enemy.update();
    player.update();
    ball.update();

    // movemant

    switch (ball.derection) {
        case 0:
            ball.velocity.x = 11;
            ball.velocity.y = 0;
            break;

        case 1:
            ball.velocity.x = -11;
            ball.velocity.y = 0;
            break;

        case 2:
            ball.velocity.x = 11;
            ball.velocity.y = 7;
            break;

        case 3:
            ball.velocity.x = -11;
            ball.velocity.y = 7;
            break;

        case 4:
            ball.velocity.x = 11;
            ball.velocity.y = -7;
            break;

        case 5:
            ball.velocity.x = -11;
            ball.velocity.y = -7;
            break;

    }


    player.velocity.y = 0
    enemy.velocity.y = 0

    if (keys.w.pressed && player.lastKey === 'w') {
        player.velocity.y = -9;
    } else if (keys.s.pressed && player.lastKey === 's') {
        player.velocity.y = 9;
    }

    if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp') {
        enemy.velocity.y = -9;
    } else if (keys.ArrowDown.pressed && enemy.lastKey === 'ArrowDown') {
        enemy.velocity.y = 9;
    }


    // ball collision

    if (ball.position.x + 35 <= player.position.x + 63
        && ball.position.y + 50 >= player.position.y
        && ball.position.y <= player.position.y + 100) {

        ball.position.x += 10;
        ball.generate(6);
        if (ball.random == 1 && ball.random == 3 && ball.random == 5) {
            ball.generate(6);
        } else {
            ball.derection = ball.random;
            punch.play();
        }
    }

    if (ball.position.x + 50 >= enemy.position.x
        && ball.position.y + 50 >= enemy.position.y
        && ball.position.y <= enemy.position.y + 100) {

        ball.position.x -= 10;
        ball.generate(6);
        if (ball.random == 0 && ball.random == 2 && ball.random == 4) {
            ball.generate(6);
        } else {
            ball.derection = ball.random
            punch.play();
        }
    }

    // math over

    if (ball.position.x <= 0) {
        ball.generate(6);
        ball.derection = ball.random;

        ball.position.x = cvs.width / 2 - 25;
        ball.position.y = cvs.height / 2 - 50;

        lose.play();
        enemy.score += 1;
    }

    if (ball.position.x >= cvs.width) {
        ball.generate(6);
        ball.derection = ball.random;

        ball.position.x = cvs.width / 2 - 25;
        ball.position.y = cvs.height / 2 - 50;

        lose.play();
        player.score += 1;
    }

    window.requestAnimationFrame(loop);
}

loop();

window.addEventListener('keydown', (e) => {
    if (gameIsStart === true) {
        switch (e.key) {
            case 'w':
                keys.w.pressed = true
                player.lastKey = 'w';
                break;

            case 's':
                keys.s.pressed = true
                player.lastKey = 's';

                break;

            case 'ArrowUp':
                keys.ArrowUp.pressed = true
                enemy.lastKey = 'ArrowUp';

                break;

            case 'ArrowDown':
                keys.ArrowDown.pressed = true
                enemy.lastKey = 'ArrowDown';

                break;
        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break;

        case 's':
            keys.s.pressed = false
            break;

        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break;

        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break;
    }
})
