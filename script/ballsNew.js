var canvas = document.getElementById("cnvs");
var ctx = canvas.getContext("2d");
var canvasRect = canvas.getBoundingClientRect();
canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

var globalBallRadius = canvas.width / 70;
var textColor = "#663399"; //colore di eventuale testo/UI
var changeOnBounce = true;
var showBallNum = true;
class Pos { //posizione 
    x = canvas.width/2;
    y = canvas.height/2;
}

var gravity = 9.81; //TODO: inserirlo in automatico nella classe movement/vec oppure dargli una funzione per poterlo cambiare?
class Vec { //vettore di movimento
    dx = 3;
    dy = -3;
    deg = 45;
    str = 4.54;
    changeDeg(n) {
        let olddy = this.dy;
        //console.log(this.deg+" "+n);
        if (this.deg < 55 && this.deg > -55 && n != 0) {
            if ((this.deg < 0 && this.deg + n < 0) || (this.deg > 0 && this.deg + n > 0))
                this.deg = -this.deg;
            this.deg += n;
        }
        //console.log(this.deg);
        this.dx = Math.sin(this.deg) * this.str;
        this.dy = Math.sqrt(this.str ** 2 - this.dx ** 2);
        if (olddy < 0) this.dy = -this.dy;
    }
    sideBounce() {
        this.deg = -this.deg;
        this.changeDeg(0);
    }
    changeSpeed(n) {
        this.str = n;
        this.dx = Math.sin(this.deg) * this.str;
        this.dy = Math.sqrt(this.str ** 2 - this.dx ** 2);
    }
    accelerationEffect(){
    
    }
    gravityEffect() {

    }
}

class Movement{ //movimento (l'insieme della posizione e i vettori che la influenzano) ??IS THIS NECESSARY??
    pos = new Pos();
    vec = new Vec();
}

var colorList = [ //lista di colori
    "#DC143C",
    "#FF69B4",
    "#C71585",
    "#FF4500",
    "#FFA500",
    "#FFFF00",
    "#EE82EE",
    "#9370DB",
    "#9400D3",
    "#8B008B",
    "#6A5ACD",
    "#7B68EE",
    "#00FA9A",
    "#008000",
    "#66CDAA",
    "#008B8B",
    "#00FFFF",
    "#6495ED",
    "#ffb42e",
    "#71e3bf",
    "#bb6891",
    "#278bae",
    "#9b0030",
    "#2ff055",
    "#f8cc0e"
];
function randColor() { //funzione per generare colore random
    //return colorList[Math.floor(Math.random() * colorList.length)]; //questo prende random dalla lista
    return Math.floor(Math.random()*16777215).toString(16); //questo prende random al 100%
}

class Ball { //classe della singola palla
    ballColor = randColor();
    ballRadius = globalBallRadius;
    mov = new Movement();

    constructor(x, y){
        this.mov.pos.x = x;
        this.mov.pos.y = y;
        this.mov.vec.dx = 2;
        this.mov.vec.dy = -2;
    }

    drawBall(context) {
        context.beginPath();
        context.arc(this.mov.pos.x, this.mov.pos.y, this.ballRadius, 0, Math.PI * 2);
        context.fillStyle = this.ballColor;
        context.fill();
        /*context.font = this.ballRadius+"px Arial";
        ctx.textAlign = "center";
        context.fillText("DVD", this.mov.pos.x, this.mov.pos.y);*/
        context.closePath();
    }
    resetBall() {
        this.mov.pos.x += this.mov.vec.dx;
        this.mov.pos.y += this.mov.vec.dy;
        drawBall();
        this.mov.pos.x = canvas.width / 2;
        this.mov.pos.y = canvas.height - 30;
        var n = Math.random() * (4);
        switch (n) {
            case 0:
                this.mov.vec.deg = 0;
                break;
            case 1:
                this.mov.vec.deg = -45;
                break;
            case 2:
                this.mov.vec.deg = -20;
                break;
            case 3:
                this.mov.vec.deg = 20;
                break;
            case 4:
                this.mov.vec.deg = 45;
                break;
        }
        this.mov.vec.dy = -1;
        this.mov.vec.changeDeg(0);
    }
    move(){
        this.mov.pos.x += this.mov.vec.dx;
        this.mov.pos.y += this.mov.vec.dy;
    }
    collisionDetection(){
        if (this.mov.pos.x > canvas.width - this.ballRadius || this.mov.pos.x < this.ballRadius) {
            this.mov.vec.sideBounce();
            if(changeOnBounce) this.ballColor = randColor();
        }
        if (this.mov.pos.y <= this.ballRadius || this.mov.pos.y >= canvas.height - this.ballRadius) {
            this.mov.vec.dy = -(this.mov.vec.dy);
            if(changeOnBounce) this.ballColor = randColor();
        }
    }
}

var ballsList = []; //lista delle palle

var isLevelDisplayed = false; //FIXME: what is this for? need to know and comment / I think this was to know if I needed to print the level, I will confirm and remove if so
var pauseTimer = 0; //this bunch will be useful to integrate a pause system, even tho it should be modified
var pauseTimerMax = 120;
var pauseText = "PAUSE";


var rbColor = randColor(); //TODO: rimuovere tutti sti residui della rainbowball originale (ma prima vedere di importarli?)
var rbColorStatus = 0;

var maxParticleRange=40;
var particles=[];
var numparticles=200;
for(i=0;i<numparticles;i++){ //FIXME: bruh this code is cancer, da fuck did I smoke when I was 16?
	//particles.push(particle.create(width/2,height/2,(Math.random()*10)+1,Math.random()*Math.PI*2))
	particles[i]={
		x: 0,
		y: 0,
		v: 4,
		status: 0,
		reset(){
			this.x=0;
			this.y=0;
			this.status=0;
		},
		update(){
			this.x=this.x+Math.random()*this.v-this.v/2;
			this.y=this.y+Math.random()*this.v-this.v/2;
			this.status=Math.floor(Math.random()*10);
		}
	};
}



function drawPauseText(txt) { //TODO: implementarlo, cioè ci dovrebbe essere ben funzionante solo non implementato nel gioco per motivi di cheating, forse c'è ancora come codice commentato
    if (pauseTimer >= 2) {
        ctx.font = "72px Impact";
        ctx.fillStyle = paddleColor;
        ctx.textAlign = "center";
        ctx.fillText(txt, canvas.width / 2, canvas.height / 2);
        pauseTimer--;
    } else if (pauseTimer == 1) {
        pauseTimer = -1;
    }
}

function drawParticles() { //possibili usi delle particelle?
    for (i = 0; i < numparticles; i++) {
        var p = particles[i];
        if (p.status != 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = randColor();
            ctx.fill();
            ctx.closePath();
            p.update();

        } else p.reset();
    }
    //console.log("B: "+particles[1].x+" "+particles[1].y+" "+particles[1].status);
}


function drawRainbowBall() {  //TODO: to implement in standard ball/extends default ball?
    ctx.beginPath();
    ctx.arc(rbx, rby, globalBallRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = rbColor;
    rbColorStatus++;
    if (rbColorStatus >= 10) {
        rbColor = randColor();
        rbColorStatus = 0;
    }
    ctx.fill();
    ctx.closePath();
    rbx += vrbx;
    rby += vrby;
}

function gameOverScreen() {
    ctx.font = "80px Impact";
    ctx.fillStyle = scoreboardColor;
    ctx.textAlign = "left";
    ctx.fillText("Your score:", 50, 200);
    ctx.fillText(score, 150, 300);
    //console.log(savingName);
    ctx.textAlign = "center";
    ctx.fillText(savingName, canvas.width / 2, 400);
    ctx.font = "16px Impact";
    ctx.textAlign = "center";
    ctx.fillText("(Only alphanumeric values are accepted)", canvas.width / 2, canvas.height - 100);

    if (detectMobile()) {
        if (!isInputDone) {
            savingName = window.prompt("Insert your nickname");
            isInputDone = true;
        }
        savingName.replace(/^-/, "");
        document.cookie = "highscorename=" + savingName;
        document.cookie = "highscore=" + score;
        document.location.reload();
    }
    //console.log("x:"+rbx+" y:"+rby);
}

function detectMobile() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

function printBallNumber(){
    ctx.font = "30px Impact";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("Balls N°:", 20, 40);
    ctx.fillText(ballsList.length, 165, 40);
}

function initialization(){
    //ballsList.push(new Ball(canvas.width/2, canvas.height/2));
    draw();
}

function draw() {
    //if (!isLevelDisplayed) createLevel();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /*if (isGameOver && pauseTimer == 0) {
        rainbowBallCollision();
        drawRainbowBall();
        gameOverScreen();
    } else {*/
        //console.log(isLevelDisplayed);
        //ctx.fillStyle = "#ABB2E5";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        //preShake();
        drawPauseText(pauseText);
        //drawBricks();
        ballsList.forEach(ball => {
            ball.drawBall(ctx);
            if(pauseTimer == 0){
                ball.collisionDetection();
                ball.move();
            }
        });
        //drawBall();
        //drawPaddle();
        drawParticles();

        if(showBallNum) printBallNumber();

        //drawScore();
        //drawLives();
        //drawLevel();
        //collisionDetection();
        //console.log(pauseTimer+" "+bricksHit+" "+bricksTot);

        /*if (rightPressed && paddleX < canvas.width - paddleWidth && isUsingKeyboard) {
            paddleX += paddleSpeed;
        } else if (leftPressed && paddleX > 0 && isUsingKeyboard) {
            paddleX -= paddleSpeed;
        }*/
        if (pauseTimer == -1) {
            //difficultyIncrease();
            pauseTimer = 0; //FIXME: WTF is this for????
            pauseText = "PAUSE";
        }
    //}
    //if(!isGameOver)

    //postShake();

    requestAnimationFrame(draw);
}

function newBall(x, y){
    ballsList.push(new Ball(x, y));
}

function manageMusic(){
    if(isMusicPlaying)
        music.pause();
    else
    {
        music = new Audio(randSong());
        music.play();
    }
    isMusicPlaying = !isMusicPlaying;
}


var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
var btn4 = document.getElementById("btn4");

var music;
var isMusicPlaying = false;

function randSong() {
    var songs = [
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
    ];
    return songs[Math.floor(Math.random() * songs.length)];
}

canvas.addEventListener("click", function(event){
    var rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    newBall(x, y)
});

btn1.addEventListener("click", function() {
    ballColor = randColor();
});
btn2.addEventListener("click", function() {
    manageMusic();
});
btn3.addEventListener("click", function() {
    newBall(canvas.width/2, canvas.height/2);
});

