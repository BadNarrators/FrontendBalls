var canvas = document.getElementById("cnvs");
var ctx = canvas.getContext("2d");
var canvasRect = canvas.getBoundingClientRect();

var ballColor = "#663399";
var paddleColor = "#663399";
var brickColor = "#663399";
var scoreboardColor = "#663399";

function randColor() {
    var colors = [
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
        "#6495ED"
    ];
    return colors[Math.floor(Math.random() * 18)];
}

var ballRadius = canvas.width / 70;

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var isLevelDisplayed = false;
var pauseTimer = 0;
var pauseTimerMax = 120;
var pauseText = "PAUSE";

var degChange = 4
var vec = {
    dx: 3,
    dy: -3,
    deg: 45,
    str: 4.54,
    changeDeg(n) {
        olddy = this.dy;
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
    },
    sideBounce() {
        //console.log("sidebounce");
        this.deg = -this.deg;
        this.changeDeg(0);
    }
}

var rbColor = randColor();
var rbColorStatus = 0;

var maxParticleRange=40;
var particles=[];
var numparticles=200;
for(i=0;i<numparticles;i++){
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

function collisionDetection() {
    if (x > canvas.width - ballRadius || x < ballRadius) {
        vec.sideBounce();
    }
    if (y <= ballRadius || y >= canvas.height - ballRadius) {
        vec.dy = -vec.dy;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPauseText(txt) {
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

function drawParticles() {
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

function resetBall() {
    x += vec.dx;
    y += vec.dy;
    drawBall();
    x = canvas.width / 2;
    y = canvas.height - 30;
    var n = Math.random() * (4);
    switch (n) {
        case 0:
            vec.deg = 0;
            break;
        case 1:
            vec.deg = -45;
            break;
        case 2:
            vec.deg = -20;
            break;
        case 3:
            vec.deg = 20;
            break;
        case 4:
            vec.deg = 45;
            break;
    }
    vec.dy = -1;
    vec.changeDeg(0);
    paddleX = (canvas.width - paddleWidth) / 2;
}

function drawRainbowBall() {
    ctx.beginPath();
    ctx.arc(rbx, rby, ballRadius * 2, 0, Math.PI * 2);
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

function rainbowBallCollision() {
    (x > canvas.width - ballRadius || x < ballRadius)
    if (rbx < ballRadius * 2 || rbx > canvas.width - ballRadius * 2) {
        vrbx = -vrbx;
    }
    if (rby - ballRadius * 2 < 0 || rby + ballRadius * 2 > canvas.height) {
        vrby = -vrby;
    }
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

    if (detectmob()) {
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

function detectmob() {
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
        drawBall();
        //drawPaddle();
        drawParticles();
        //drawScore();
        //drawLives();
        //drawLevel();
        collisionDetection();
        //console.log(pauseTimer+" "+bricksHit+" "+bricksTot);

        /*if (rightPressed && paddleX < canvas.width - paddleWidth && isUsingKeyboard) {
            paddleX += paddleSpeed;
        } else if (leftPressed && paddleX > 0 && isUsingKeyboard) {
            paddleX -= paddleSpeed;
        }*/
        if (pauseTimer == 0) {
            x += vec.dx;
            y += vec.dy;
        } else if (pauseTimer == -1) {
            //difficultyIncrease();
            pauseTimer = 0;
            pauseText = "PAUSE";
        }
    //}
    //if(!isGameOver)

    //postShake();

    requestAnimationFrame(draw);
}

