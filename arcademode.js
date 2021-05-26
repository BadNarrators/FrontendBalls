	var canvas = document.getElementById("cnvs");
	var ctx = canvas.getContext("2d");
    var canvasRect = canvas.getBoundingClientRect();
    var canvasLeft = canvasRect.left;
	
	var isInputDone=false;
	
	var score = 0;
	var lives = 3;
	var level = 1;
	
	var shakeDuration=150;
	var shakeStartTime = -1;
	
	var ballColor = "#663399";
	var paddleColor = "#663399";
	var brickColor= "#663399";
	var scoreboardColor= "#663399";
	function randColor(){
		var colors=[
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
		return colors[Math.floor(Math.random()*18)];
	}
	
	
	var ballRadius = canvas.width/70;
	
	var x = canvas.width/2;
	var y = canvas.height-30;
	var dx = 2;
	var dy = -2;
	
	var isLevelDisplayed=false;
	var pauseTimer=0;
	var pauseTimerMax=120;
	var pauseText="PAUSE";
	
	var degChange=4
	var vec={
		dx:3,
		dy:-3,
		deg:45,
		str:4.54,
		changeDeg(n){
			olddy=this.dy;
			//console.log(this.deg+" "+n);
			if(this.deg<55 && this.deg>-55 && n!=0){
				if((this.deg<0 && this.deg+n<0) || (this.deg>0 && this.deg+n>0))
					this.deg=-this.deg;
				this.deg+=n;
			}
			//console.log(this.deg);
			this.dx=Math.sin(this.deg)*this.str;
			this.dy=Math.sqrt(this.str**2-this.dx**2);
			if(olddy<0) this.dy=-this.dy; 
		},
		sideBounce(){
			//console.log("sidebounce");
			this.deg=-this.deg;
			this.changeDeg(0);
		}
	}
	
	var paddleHeight = 10;
	var paddleWidth = canvas.width/8;
	var paddleX = (canvas.width-paddleWidth)/2;
	var paddleSpeed= 8;
	
	var rightPressed = false;
	var leftPressed = false;
	var isUsingKeyboard=false;
	var paddleTouchSpeed=3;
	var paddleKeyboardSpeed=5;
	
	var isGameOver=false;
	var savingName="------------";
	var savingNameIndex=0;
	var rbx=ballRadius*2;
	var rby=canvas.height/2;
	var vrbx=canvas.width/100;
	var vrby=vrbx*canvas.height/canvas.width;
	var rbColor=randColor();
	var rbColorStatus=0;
	
	
	var touchObj=null;
	var touchStart=0;
	var touchDist=0;
	
	
	var brickRowCount = 2;//9;
	var brickColumnCount = 3;
	var brickPadding = 8;
	var brickWidth = (canvas.width-ballRadius*2-brickPadding*brickRowCount)/brickRowCount;
	var brickHeight = 20;
	var brickOffsetTop = ballRadius*6;
	var brickOffsetLeft = ballRadius;
	function updateBrickWidth(){
		brickWidth = (canvas.width-ballRadius*2-brickPadding*brickRowCount)/brickRowCount;
	}
	
	class generalBrick{
		x;
		y;
		s;
		breakScore=1000;
		brickColor;
		
		constructor(x, y){
			this.x=x;
			this.y=y;
			this.s=1;
			this.drawBrick();
			this.brickColor=brickColor;
		}
		drawBrick(){
			ctx.beginPath();
			ctx.rect(this.x, this.y, brickWidth, brickHeight);
			ctx.fillStyle = this.brickColor;
			ctx.fill();
			ctx.closePath();
		}
		hitEffect(){
			if(x+ballRadius>this.getX() && x+ballRadius<this.getX()+brickWidth)
				vec.dy = -vec.dy;
			else
				vec.sideBounce();
			this.setStatus(0);
			bricksHit++;
			for(i=0;i<numparticles;i++){
				var v=Math.random()*maxParticleRange-maxParticleRange/2;
				var bx=this.x+brickWidth/2;
				var by=this.y+brickHeight/2;
				particles[i].status=1;
				particles[i].x=bx^v;
				particles[i].y=by^v;
			}
			score+=this.getBreakScore();
		}
		getStatus(){ return this.s;}
		getX(){ return this.x;}
		getY(){ return this.y;}
		getBreakScore(){ return this.breakScore;}
		setStatus(st){  this.s=st;}
	}
	class thickBrick extends generalBrick{
		health;
		breakScore=2000;
		singleBreakScore=500;
		healthColors={
			1: brickColor,
			2: "#3498DB",
			3: "#48C9B0",
			4: "#1E8449",
			5: "#F7DC6F",
			6: "#E67E22",
			7: "#C0392B",
			8: "#7F8C8D",
			9: "#212F3D"
		};
		
		constructor(x,y,h){
			super(x,y);
			this.health=h;
			this.brickColor=this.healthColors[this.health];
		}
		hitEffect(){
			this.health--;
			if(this.health<=0) super.hitEffect();
			else {
				if(x+ballRadius>this.getX() && x+ballRadius<this.getX()+brickWidth)
					vec.dy = -vec.dy;
				else
					vec.sideBounce();
				this.brickColor=this.healthColors[this.health];
				score+=this.singleBreakScore;
			}
		}
	}
	class bonusBrick extends generalBrick{
		breakScore=20000;
		tCounter;
		
		constructor(x,y){
			super(x,y);
			this.brickColor=randColor();
			this.tCounter=0;
		}
		drawBrick(){
			ctx.beginPath();
			ctx.rect(this.x, this.y, brickWidth, brickHeight);
			ctx.fillStyle = this.brickColor;
			ctx.fill();
			ctx.closePath();
			this.tCounter++;
			if(this.tCounter>=7){
				this.brickColor=randColor();
				this.tCounter=0;
			}
		}
	}
	class healthBrick extends generalBrick{
		breakScore=1500;
		
		drawBrick(){
			ctx.beginPath();
			ctx.lineWidth = "2";
			ctx.strokeStyle = this.brickColor;
			ctx.rect(this.x, this.y, brickWidth, brickHeight);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(this.x+(brickWidth/2), this.y+(brickHeight/2), brickHeight/2-2, 0, Math.PI*2);
			ctx.fillStyle = ballColor;
			ctx.fill();
			ctx.closePath();
		}
		hitEffect(){
			super.hitEffect();
			lives++;
		}
	}
	var bricks=new Array();
	var bricksTot=0;
	var bricksHit=0;
	
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


	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);
	document.addEventListener("touchstart", touchStartHandler, false);
	document.addEventListener("touchmove", touchMoveHandler, false);
	document.addEventListener("touchend", touchEndHandler, false);

	function keyDownHandler(e) {
		if(!isGameOver){
			if(e.key == "Right" || e.key == "ArrowRight") {
				rightPressed = true;
				isUsingKeyboard=true;
			}
			else if(e.key == "Left" || e.key == "ArrowLeft") {
				leftPressed = true;
				isUsingKeyboard=true;
			}
		}else{
			var inp = String.fromCharCode(e.keyCode);
			var code= e.keyCode || e.charCode;
			if (/[a-zA-Z0-9-_ ]/.test(inp) && savingNameIndex<savingName.length) {
				savingName[savingNameIndex]=inp;
				savingName=savingName.substr(0, savingNameIndex)+inp+savingName.substr(savingNameIndex + inp.length);
				//console.log(inp);
				savingNameIndex++;
			}else if((code == 8 || code ==46)&& savingNameIndex>0){
				inp="-";
				savingNameIndex--;
				savingName=savingName.substr(0, savingNameIndex)+inp+savingName.substr(savingNameIndex + inp.length);
			}else if(code==13){
				savingName.replace(/^-/, "");
				//saveScore(savingName, score);
				document.cookie="highscorename="+savingName;
				document.cookie="highscore="+score;
				
				/*var theCookies = document.cookie.split(';');
				var aString = '';
				for (var i = 1 ; i <= theCookies.length; i++) {
					aString += i + ' ' + theCookies[i-1] + "\n";
				}
				console.log(aString);*/
				
				var currentTime = new Date().getTime();
				while (currentTime + 1000 >= new Date().getTime()) {
				}
			   
				document.location.reload();
			}
			//console.log(code);
			//console.log(savingNameIndex+" "+savingName.length);
		}
	}
	function keyUpHandler(e) {
		if(!isGameOver){
			if(e.key == "Right" || e.key == "ArrowRight") {
				rightPressed = false;
				isUsingKeyboard=false;
			}
			else if(e.key == "Left" || e.key == "ArrowLeft") {
				leftPressed = false;
				isUsingKeyboard=false;
			}
		}
	}
	function mouseMoveHandler(e) {
	  var relativeX = e.clientX - canvas.offsetLeft;
	  if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		if(relativeX>paddleX+40){
			rightPressed=true;
			leftPressed=false;
			isUsingKeyboard=false;
		}else if(relativeX<paddleX-40){
			rightPressed=false;
			leftPressed=true;
			isUsingKeyboard=false;
		}else{
			rightPressed=false;
			leftPressed=false;
			isUsingKeyboard=false;
		}
		paddleX = relativeX - paddleWidth/2;
	  }
	}
	function touchStartHandler(e) {
		if (event.targetTouches.length == 1){
			touchObj=e.changedTouches[0];
			touchStart=(touchObj.clientX-canvas.offsetLeft)/screen.width*canvas.width;
			paddleSpeed=paddleTouchSpeed;
			e.preventDefault();
		}
	}
	function touchMoveHandler(e) {
		touchObj=e.changedTouches[0];
		dist=(((touchObj.clientX-canvas.offsetLeft)/screen.width*canvas.width)-touchStart)/8;
		/*if(paddleX+dist<canvas.width && paddleX+dist>0)
			paddleX=paddleX+dist;*/
		paddleSpeed=Math.abs(paddleTouchSpeed*dist/20);
		if(dist>5 && paddleX+paddleSpeed<canvas.width) {
			isUsingKeyboard=true;
			rightPressed=true;
			leftPressed=false;
		}else if(dist<-5 && paddleX+paddleSpeed>0){
			isUsingKeyboard=true;
			leftPressed=true;
			rightPressed=false;
		}
		e.preventDefault();
	}
	function touchEndHandler(e){
		isUsingKeyboard=false;
		leftPressed=false;
		rightPressed=false;
		paddleSpeed=paddleKeyboardSpeed;
	}
	
	
	function collisionDetection() {
	  for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
		  var b = bricks[c][r];
		  if(b.getStatus() == 1) {
			if(
				(x+ballRadius > b.getX()-1 || x-ballRadius> b.getX()-1) && 
				(x+ballRadius < b.getX()+brickWidth || x-ballRadius < b.getX()+brickWidth) && 
				(y+ballRadius > b.getY() || y-ballRadius > b.getY()) && 
				(y+ballRadius < b.getY()+brickHeight || y-ballRadius < b.getY()+brickHeight)) {
				b.hitEffect();
				startShake();
				if(bricksHit >= bricksTot) {
					//alert("YOU WIN, CONGRATS!");
					//isGameOver=true;
					//document.location.reload();
					if(pauseTimer==0) {
						pauseTimer=pauseTimerMax;
						pauseText="NEXT LEVEL";
					}
				}
			}
		  }
		}
	  }
	  if(x > canvas.width-ballRadius || x < ballRadius) {
		vec.sideBounce();
	  }
	  if(y <= ballRadius) {
		vec.dy = -vec.dy;
	  }
	  else if(y > canvas.height-ballRadius-paddleHeight) {
		if(
			(x+ballRadius > paddleX) && 
			(x-ballRadius < paddleX + paddleWidth)) {
			vec.dy = -Math.abs(vec.dy);
			if(rightPressed && paddleX < canvas.width-paddleWidth)
				if(vec.dx>0) 
					vec.changeDeg(degChange);
				else 
					vec.changeDeg(-degChange);
			else if(leftPressed && paddleX > 0)
				if(vec.dx<0)
					vec.changeDeg(-degChange);
				else
					vec.changeDeg(degChange);
		}
		else {
			lives--;
			if(!lives) {
				x += vec.dx;
				y += vec.dy;
				drawBall();
				pauseTimer=pauseTimerMax;
				pauseText="GAME OVER";
				drawPauseText("GAME OVER");
				isGameOver=true;
			}
			else {
				resetBall();
			}
		}
	  }
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = ballColor;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = paddleColor;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawBricks() {
	  for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			//console.log(bricks[c][r].getStatus()+" "+c+" "+r);
		  if(bricks[c][r].getStatus() == 1) {
			bricks[c][r].drawBrick();
		  }
		}
	  }
	}
	
	function drawPauseText(txt){
		if(pauseTimer>=2){
			ctx.font = "72px Impact";
			ctx.fillStyle = paddleColor;
			ctx.textAlign = "center";
			ctx.fillText(txt, canvas.width/2, canvas.height/2);
			pauseTimer--;
		}else if(pauseTimer==1){
			pauseTimer=-1;
		}
	}
	
	function drawParticles() {
		for(i=0;i<numparticles;i++){
			var p=particles[i];
			if(p.status!=0) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
				ctx.fillStyle = randColor();
				ctx.fill();
				ctx.closePath();
				p.update();
				
			}
			else p.reset();
		}
		//console.log("B: "+particles[1].x+" "+particles[1].y+" "+particles[1].status);
	}
	
	function drawScore() {
		ctx.font = "18px Impact";
		ctx.fillStyle = scoreboardColor;
		ctx.textAlign = "left";
		ctx.fillText("Score: "+score, 8, 20);
	}
	function drawLives() {
		ctx.font = "18px Impact";
		ctx.fillStyle = scoreboardColor;
		ctx.textAlign = "left";
		ctx.fillText("Lives: "+lives, canvas.width-65, 20);
	}
	function drawLevel() {
		ctx.font = "22px Impact";
		ctx.fillStyle = scoreboardColor;
		ctx.textAlign = "center";
		ctx.fillText("Level: "+level, canvas.width/2, 20);
	}


	function difficultyIncrease(){
		level++;
		if(level<=3){
			brickRowCount++;
		}else if(level==5){
			vec.str+=2;
		}else if(level<=7){
			brickRowCount++;
			if(level==7) vec.str+=2;
		}else if(level==10){
			brickRowCount++;
			shakeDuration+=100;
		}else if(level==13){
			brickRowCount++;
		}else if(level==15){
			vec.str+=2;
		}else if(level==16){
			brickRowCount++;
		}else if(level==20){
			vec.str+=2;
			brickColumnCount++;
			shakeDuration+=100;
		}
		updateBrickWidth();
		isLevelDisplayed=false;
	}
	
	var thickBrSpawnrate={
		4: 3,
		10: 7,
		15: 10,
		20: 15
	}
	function createLevel(){
		for(var c=0; c<brickColumnCount; c++) {
			bricks[c] = new Array();
			for(var r=0; r<brickRowCount; r++) {
				var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
				var rand=Math.random()*100;
				var next=true;
				if(level>=4 && next){//bonus brick
					if(level<10) {if(rand<=0.3) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<15) {if(rand<=0.45) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<20) {if(rand<=0.6) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<30) {if(rand<=1.0) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<40) {if(rand<=1.5) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<50) {if(rand<=2.5) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
					else if(level<60) {if(rand<=5.0) bricks[c][r]=new bonusBrick(brickX, brickY); else next=true;}
				}if(level>=7 && next){//health brick
					next=false;
					if(level<10) {if(rand<=5.0) bricks[c][r]=new healthBrick(brickX, brickY); else next=true;}
					else if(level<15) {if(rand<=10.0) bricks[c][r]=new healthBrick(brickX, brickY); else next=true;}
					else if(level<20) {if(rand<=20.0) bricks[c][r]=new healthBrick(brickX, brickY); else next=true;}
					else if(level<30) {if(rand<=30.0) bricks[c][r]=new healthBrick(brickX, brickY); else next=true;}
					else if(level<40) {if(rand<=40.0) bricks[c][r]=new healthBrick(brickX, brickY); else next=true;}
				}if(level>=3 && next){//thick brick
					next=false;
					var thickness=2;
					//var thickness=Math.floor(Math.random()*2+1);
					//console.log(thickness);
					if(level<15) {if(rand<=10.0) bricks[c][r]=new thickBrick(brickX, brickY,thickness); else next=true;}
					else if(level <20) {if(rand<=12.0) bricks[c][r]=new thickBrick(brickX, brickY, thickness); else next=true;}
					else if(level <25) {if(rand<=15.0) bricks[c][r]=new thickBrick(brickX, brickY, thickness); else next=true;}
				}
				if (next)bricks[c][r]=new generalBrick(brickX, brickY);
				//console.log(c+" "+r+" "+bricks[c][r].getStatus()+" "+bricks[c][r].getX()+" "+brickX);
				//console.log(rand);
				bricksTot++;
			}
		}
		//console.log(bricks[1].length);
		//console.log(bricks.length);
		//console.log(bricks[0][0]);
		//console.log(bricks[0][0].x);
		isLevelDisplayed=true;
		resetBall();
	}
	
	function resetBall(){
		x += vec.dx;
		y += vec.dy;
		drawBall();
		x = canvas.width/2;
		y = canvas.height-30;
		var n=Math.random()*(4);
		switch(n){
			case 0:
				vec.deg=0;
				break;
			case 1:
				vec.deg=-45;
				break;
			case 2:
				vec.deg=-20;
				break;
			case 3:
				vec.deg=20;
				break;
			case 4:
				vec.deg=45;
				break;
		}
		vec.dy=-1;
		vec.changeDeg(0);
		paddleX = (canvas.width-paddleWidth)/2;
	}
	
	function drawRainbowBall(){
		ctx.beginPath();
		ctx.arc(rbx, rby, ballRadius*2, 0, Math.PI*2);
		ctx.fillStyle = rbColor;
		rbColorStatus++;
		if(rbColorStatus>=10){
			rbColor=randColor();
			rbColorStatus=0;
		}
		ctx.fill();
		ctx.closePath();
		rbx+=vrbx;
		rby+=vrby;
	}
	
	function rainbowBallCollision(){
		(x > canvas.width-ballRadius || x < ballRadius)
		if(rbx<ballRadius*2|| rbx>canvas.width-ballRadius*2) {
			vrbx=-vrbx;
		}
		if(rby-ballRadius*2<0 || rby+ballRadius*2>canvas.height) {
			vrby=-vrby;
		}
	}
	
	function gameOverScreen(){
		ctx.font = "80px Impact";
		ctx.fillStyle = scoreboardColor;
		ctx.textAlign = "left";
		ctx.fillText("Your score:", 50, 200);
		ctx.fillText(score, 150, 300);
		//console.log(savingName);
		ctx.textAlign = "center";
		ctx.fillText(savingName, canvas.width/2, 400);
		ctx.font = "16px Impact";
		ctx.textAlign = "center";
		ctx.fillText("(Only alphanumeric values are accepted)", canvas.width/2, canvas.height-100);
		
		if(detectmob()){
			if(!isInputDone){
				savingName=window.prompt("Insert your nickname");
				isInputDone=true;
			}
			savingName.replace(/^-/, "");
			document.cookie="highscorename="+savingName;
			document.cookie="highscore="+score;
			document.location.reload();
		}
		//console.log("x:"+rbx+" y:"+rby);
	}
	
	function startShake(){
		shakeStartTime=Date.now();
	}
	function preShake() {
		if (shakeStartTime ==-1) return;
		var t = Date.now()-shakeStartTime;
		if (t>shakeDuration) {
			shakeStartTime = -1; 
			return;
		}
		var easingCoef = t / shakeDuration;
		var easing = Math.pow(easingCoef-1,3) +1;
		ctx.save();  
		var mx = easing*(Math.cos(t*0.05 ) + Math.cos(t*0.3115))*4;
		var my = easing*(Math.sin(t*0.025) + Math.sin(t*0.057113))*4;
		ctx.translate(mx, my);  
		console.log("test");
	}
	function postShake() {
		if (shakeStartTime ==-1) return;
		ctx.restore();
	}
	
	function draw() {
	  if(!isLevelDisplayed) createLevel();
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  if(isGameOver && pauseTimer==0) {
			rainbowBallCollision();
			drawRainbowBall();
			gameOverScreen();
	  }else{
		  //console.log(isLevelDisplayed);
		  //ctx.fillStyle = "#ABB2E5";
		  //ctx.fillRect(0, 0, canvas.width, canvas.height);
		  preShake();
		  drawPauseText(pauseText);
		  drawBricks();
		  drawBall();
		  drawPaddle();
		  drawParticles();
		  drawScore();
		  drawLives();
		  drawLevel();
		  collisionDetection();
		  //console.log(pauseTimer+" "+bricksHit+" "+bricksTot);

		  if(rightPressed && paddleX < canvas.width-paddleWidth && isUsingKeyboard) {
			paddleX += paddleSpeed;
		  }
		  else if(leftPressed && paddleX > 0 && isUsingKeyboard) {
			paddleX -= paddleSpeed;
		  }
		  if(pauseTimer==0){
			  x += vec.dx;
			  y += vec.dy;
		  }else if(pauseTimer==-1){
			difficultyIncrease();
			pauseTimer=0;
			pauseText="PAUSE";
		  }
	  }
	  //if(!isGameOver)
		  
	  postShake();
	  
		requestAnimationFrame(draw);
	}
	function detectmob() { 
		 if( navigator.userAgent.match(/Android/i)
		 || navigator.userAgent.match(/webOS/i)
		 || navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i)
		 || navigator.userAgent.match(/BlackBerry/i)
		 || navigator.userAgent.match(/Windows Phone/i)
		 ){
			return true;
		  }
		 else {
			return false;
		  }
	}
	
	//draw();