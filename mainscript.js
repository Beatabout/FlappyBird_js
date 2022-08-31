let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let bird = new Image();
let back = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let road = new Image();

bird.src = "img/bird.png";
back.src = "img/back.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";
road.src = "img/road.png";

let flySFX = new Audio();
let scoreSFX = new Audio();

flySFX.src = "audio/fly.mp3";
scoreSFX.src = "audio/score.mp3";

let gap = 100;

let bX = 15;
let bY = 150;
let velY = 0;
let gravity = 0.25;

let isOnPause = false;

let score = 0;
let bestScore = 0;

let pipe = [];

pipe[0] = {
    x : canvas.width,
    y : 0
};

canvas.setAttribute('style', 'width: 288px; height: 512px');

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (e.key === 'ArrowUp') {
        moveUp();
    } else if(e.key === 'Escape') {
        stateChange();
    }
})

function moveUp(){
    if(isOnPause) return;
    bY -=20;
    velY = 0;
    flySFX.play();
}

function stateChange(){
    isOnPause = !isOnPause;
    if (isOnPause) {
        clearInterval(framedelay);
        ctx.fillStyle = 'rgba(0, 0, 0, .3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    } 
    framedelay = setInterval(drawGame, 20);
}

function drawGame(){

    document.getElementById("score").textContent=score;
    document.getElementById("bestScore").textContent=bestScore;

    if(isOnPause) return;
    let Const = pipeUp.height + gap;
    ctx.drawImage(back, 0, 0);  
    
    for(let i = 0; i < pipe.length; i++){
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + Const);
        pipe[i].x--;
        
        if(pipe[i].x == canvas.width - 220){
            pipe.push({
                x : canvas.width,
                y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }    
        
        if(pipe[i].x == 0){
            score++;
            scoreSFX.play();
            document.getElementById("score").textContent=score;
        }
        
        if((bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeUp.width && (bY <= pipe[i].y + pipeUp.height || bY + bird.height >= pipe[i].y + Const))|| bY >= canvas.height - road.height - bird.height){
            ReloadGame();
        }

    }

    ctx.drawImage(road, 0, canvas.height - road.height);
    ctx.drawImage(bird, bX, bY);
    velY = velY + gravity;
    bY += velY;
}

let framedelay = setInterval(drawGame, 20);

function ReloadGame(){
    bY = 150;
    if(score > bestScore){
        bestScore = score;
    }
    score = 0;
    velY = 0;

    pipe.length = 0;
    pipe.push({
        x : canvas.width,
        y : 0
    });
    document.getElementById("score").textContent=score;
    document.getElementById("bestScore").textContent=bestScore;
}