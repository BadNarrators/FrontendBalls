
	var canvas = document.getElementById("cnvs");
	var ctx = canvas.getContext("2d");

	//requirejs(['gm/levelsmode']);
	//elete require.cache[require.resolve('./b.js')]
	require.config({
		urlArgs: "bust="+new Date().getTime()
	});

	var nButtons=2;
	var btnOffset=10;
	var btnArcade={
		size: (canvas.width-(btnOffset*3))/nButtons,
		posx: btnOffset,
		get posy(){
			return (canvas.height/2)-(this.size/2);
		},
		colorInternal: "#CBBAD1",
		colorBorder: "#663399",
		borderThickness: 3,
		text: "Arcade Mode",
		isAvailable: true,
		get modeScript(){
			requirejs(['gm/arcademode']);
			return require(['arcademode.js']);
		}
	};
	var btnLevels={
		size: btnArcade.size,
		posx: btnOffset+btnArcade.posx+btnArcade.size,
		get posy(){
			return (canvas.height/2)-(this.size/2);
		},
		colorInternal: "#CBBAD1",
		colorBorder: "#663399",
		borderThickness: 3,
		text: "Levels",
		isAvailable: false,
		get modeScript(){
			requirejs(['gm/levelsmode']);
			return require('levelsmode');
		}
	};
	var btnList=[btnArcade, btnLevels];

	var rightPressed=false;
	var leftPressed=false;
	var isSelected=false;
	var isUsingKeyboard=false;
	var btnSelected=null;


	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#151A3B";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drawButtons(btnArcade, 0);
		drawButtons(btnLevels, 0);
		
		if(rightPressed  && isUsingKeyboard){
			btnSelected=btnLevels;
		}else if(leftPressed  && isUsingKeyboard){
			btnSelected=btnArcade;
		}
		if(btnSelected!=null){
			drawButtons(btnSelected, 3);
		}
		
		requestAnimationFrame(draw);
	}

	function drawButtons(btn, tck){
		ctx.beginPath();
		ctx.rect(btn.posx, btn.posy, btn.size, btn.size);
		ctx.fillStyle = btn.colorBorder;
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		if(tck==0)
			ctx.rect(btn.posx+btn.borderThickness, btn.posy+btn.borderThickness, btn.size-2*btn.borderThickness, btn.size-2*btn.borderThickness);
		else
			ctx.rect(btn.posx+btn.borderThickness*tck, btn.posy+btn.borderThickness*tck, btn.size-2*btn.borderThickness*tck, btn.size-2*btn.borderThickness*tck);
		ctx.fillStyle = btn.colorInternal;
		ctx.fill();
		ctx.closePath();
		ctx.font = "56px Impact";
		ctx.fillStyle = btn.colorBorder;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(btn.text, btn.posx+btn.size/2, btn.posy+btn.size/2);
		if(!btn.isAvailable){
			var lineThickness=15;
			ctx.beginPath();
			ctx.moveTo(btn.posx, btn.posy);
			ctx.lineTo(btn.posx+lineThickness, btn.posy);
			ctx.lineTo(btn.posx+btn.size, btn.posy+btn.size-lineThickness);
			ctx.lineTo(btn.posx+btn.size, btn.posy+btn.size);
			ctx.lineTo(btn.posx+btn.size-lineThickness, btn.posy+btn.size);
			ctx.lineTo(btn.posx, btn.posy+lineThickness);
			ctx.lineTo(btn.posx, btn.posy);
			ctx.fillStyle = btn.colorBorder;
			ctx.fill();
			ctx.closePath();
			ctx.font = "42px Impact";
			ctx.fillStyle = btn.colorBorder;
			ctx.textAlign = "right";
			ctx.textBaseline = "hanging";
			ctx.fillText("Available soon", btn.posx+btn.size-10, btn.posy+10);
		}
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("click", mouseClickHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);
	document.addEventListener("touchstart", touchStartHandler, false);
	document.addEventListener("touchend", touchEndHandler, false);

	function keyDownHandler(e){
		if(e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = true;
			isUsingKeyboard=true;
		}
		else if(e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = true;
			isUsingKeyboard=true;
		}else if((e.which == 13 || e.keyCode == 13) && (btnSelected!=null && btnSelected.isAvailable)){
			src=btnSelected.reference;
		}
	}
	function keyUpHandler(e){
		if(e.key == "Right" || e.key == "ArrowRight") {
			rightPressed = false;
			isUsingKeyboard=false;
		}
		else if(e.key == "Left" || e.key == "ArrowLeft") {
			leftPressed = false;
			isUsingKeyboard=false;
		}
	}
	function mouseMoveHandler(e) {
	  var relativeX = e.clientX - canvas.offsetLeft;
	  var relativeY = e.clientY - canvas.offsetTop;
	  btnSelected=null;
	  for(var b=0; b<btnList.length; b++){
		if(
		relativeX>btnList[b].posx && relativeX<(btnList[b].posx+btnList[b].size) && 
		relativeY>btnList[b].posy && relativeY<(btnList[b].posy+btnList[b].size)) {
			btnSelected=btnList[b];
		}
	  }
	}
	function mouseClickHandler(e) {
		if(btnSelected!=null) 
			//var http_request;
			/*http_request = new XMLHTTPRequest();
			http_request.onreadystatechange = function () { ... };
			http_request.open("POST", "https://sso.moxio.com");
			http_request.withCredentials = true;
			http_request.setRequestHeader("Content-Type", "application/json");
			http_request.send({ 'request': "authentication token" });*/
			/*$.UseCors(builder => builder
				.AllowAnyOrigin()
				.AllowAnyMethod()
				.AllowAnyHeader());*/
			/*jQuery.getScript(btnSelected.reference+"?callback=parseResponse", function(draw) {
				draw();
			});*/
			execScript=btnSelected.modeScript;
			//var test1=execScript.draw();
			//console.log(test1);
	}
	function touchStartHandler(e) {
		var touchObj=e.changedTouches[0];
		var relativeX = touchObj.clientX - canvas.offsetLeft;
		var relativeY = touchObj.clientY - canvas.offsetTop;
		btnSelected=null;
		for(var b=0; b<btnList.length; b++){
			if(
			relativeX>btnList[b].posx && relativeX<(btnList[b].posx+btnList[b].size) && 
			relativeY>btnList[b].posy && relativeY<(btnList[b].posy+btnList[b].size)) {
			btnSelected=btnList[b];
		}
	  }
	}
	function touchEndHandler(e) {
		var touchObj=e.changedTouches[0];
		var relativeX = touchObj.clientX - canvas.offsetLeft;
		var relativeY = touchObj.clientY - canvas.offsetTop;
		btnSelected=null;
		for(var b=0; b<btnList.length; b++){
			if(
			relativeX>btnList[b].posx && relativeX<(btnList[b].posx+btnList[b].size) && 
			relativeY>btnList[b].posy && relativeY<(btnList[b].posy+btnList[b].size)) {
				btnSelected=btnList[b];
			}
		}
		if(btnSelected!=null){
			execScript=btnSelected.modeScript;
			execScript.draw();
		}
	}

	draw();