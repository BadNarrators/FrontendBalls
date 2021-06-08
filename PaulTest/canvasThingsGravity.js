var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

var colorArray = [
    "#EF597B",
    "#FF6D31",
    "#73B66B", 
    "#FFCB18", 
    "#29A2C6"
];

var gravity = 0.9;
var bouncyness = 0.8;
var radius = 25;
var color = 0;


var circleArray = [];

// qui questa non fa nulla
window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
})

//math functions for random values
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function Circle(x,y,dx,dy,radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color;
    if(color == 0)
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    else
        this.color = colorArray[color-1];

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
		c.closePath();
        
    }


    this.update = function() {
		if (this.y + this.radius + this.dy> canvas.height || this.y - this.radius + this.dy <= 0) {
			this.dy = -this.dy;
			this.dy = this.dy * bouncyness;
			this.dx = this.dx * bouncyness;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * bouncyness;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};
}

function createBall(x, y){
    var rad = radius + Math.random() * 10 - Math.random() * 10; 
    if(rad < 1) rad = 1;
    var dx = (Math.random() -0.5) * 8; //velocity of the circle and startpointX
    var dy = (Math.random() -0.5) * 8; //velocity of the circle and startpointY
    circleArray.push(new Circle(x,y,dx,dy,rad));
}
function createBallWithDirection(x, y, dx, dy){
    var rad = radius + Math.random() * 10 - Math.random() * 10; 
    if(rad < 1) rad = 1;
    var ball = new Circle(x,y,dx,dy,rad)
    circleArray.push(ball);
}

/*canvas.addEventListener("click", function(event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    createBall(x, y)
});*/

var tempX, tempY, lastX, interval;

function dragTick(){
    dx = (tempX - lastX) / 5;
    createBallWithDirection(tempX, tempY, dx, 0);
    lastX = tempX;
    console.log("test")
};

canvas.addEventListener("mousedown", function(event){
    let rect = canvas.getBoundingClientRect();
    lastX = event.clientX - rect.left;
    interval = setInterval(dragTick, 50)
});

canvas.addEventListener("mousemove", function(event){
    let rect = canvas.getBoundingClientRect();
    tempX = event.clientX - rect.left;
    tempY = event.clientY - rect.top;
    if(event.which != 1) clearInterval(interval);
});

canvas.addEventListener("mouseup", function(event){
    clearInterval(interval);
});


function init() {

    circleArray = [];
    for(var i = 0; i < 50; i++){
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(radius, canvas.height - radius);
        var dx = (Math.random() -0.5) * 8; //velocity of the circle and startpointX
        var dy = (Math.random() -0.5) * 8; //velocity of the circle and startpointY
        createBall(x, y, dx, dy)
        
    }
}

function animate(){
    requestAnimationFrame(animate); //this is the loop kinda
    c.clearRect(0, 0, canvas.width, canvas.height); // this refreshes
 
    for(var i = 0; i < circleArray.length; i++){
        circleArray[i].update();
    }
    
    c.beginPath();
    c.arc(canvas.width/2, -10, 70, 0, Math.PI, false);
    c.closePath();
    c.lineWidth = 5;
    c.fillStyle = 'white';
    c.fill();
    c.strokeStyle = '#222255';
    c.stroke();

    c.lineWidth = 1;
    c.font = "30px Arial";
    c.fillStyle = "#222255";
    c.textAlign = "center";
    c.fillText(""+circleArray.length, canvas.width/2, 30);
}

var rainbowInterval = setInterval(function(){
    let n = Math.round(Math.random()*4+1);
    
    switch(n){
        case 1:
            colorSlider.className = "slider pink";
            break;
        case 2:
            colorSlider.className = "slider orange";
            break;
        case 3:
            colorSlider.className = "slider green";
            break;
        case 4:
            colorSlider.className = "slider yellow";
            break;
        case 5:
            colorSlider.className = "slider blue";
            break;
    }
}, 200);

var gravitySlider = document.getElementById("gravity");
var bouncynessSlider = document.getElementById("bouncyness");
var radiusSlider = document.getElementById("radius");
var colorSlider = document.getElementById("color");

gravitySlider.oninput = function(){
    gravity = gravitySlider.value/100;
}
bouncynessSlider.oninput = function(){
    bouncyness = bouncynessSlider.value/100;
}
radiusSlider.oninput = function(){
    radius = radiusSlider.value/2;
}
colorSlider.oninput = function(){
    color = colorSlider.value;
    switch(color){
        case '1':
            colorSlider.className = "slider pink";
            clearInterval(rainbowInterval);
            break;
        case '2':
            colorSlider.className = "slider orange";
            clearInterval(rainbowInterval);
            break;
        case '3':
            colorSlider.className = "slider green";
            clearInterval(rainbowInterval);
            break;
        case '4':
            colorSlider.className = "slider yellow";
            clearInterval(rainbowInterval);
            break;
        case '5':
            colorSlider.className = "slider blue";
            clearInterval(rainbowInterval);
            break;
        case '0':
            colorSlider.className = "slider";
            rainbowInterval = setInterval(function(){
                let n = Math.round(Math.random()*4+1);
                
                switch(n){
                    case 1:
                        colorSlider.className = "slider pink";
                        break;
                    case 2:
                        colorSlider.className = "slider orange";
                        break;
                    case 3:
                        colorSlider.className = "slider green";
                        break;
                    case 4:
                        colorSlider.className = "slider yellow";
                        break;
                    case 5:
                        colorSlider.className = "slider blue";
                        break;
                }
            }, 200);
            break;
    }
}

animate();
init();