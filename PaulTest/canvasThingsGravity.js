var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

var colorArray = [
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100'
];

var gravity = 0.3;
var friction = 0.9;

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


addEventListener("click", function(event) {
	init();
});

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
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
		c.closePath();
        
    }


    this.update = function() {
		if (this.y + this.radius + this.dy> canvas.height) {
			this.dy = -this.dy;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * friction;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};
}


var circleArray = [];

function init() {

    circleArray = [];
    for(var i = 0; i < 666; i++){
        var radius = Math.random() * 10 + 1; 
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(0, canvas.height - radius);
        var dx = (Math.random() -0.5) * 8; //velocity of the circle and startpointX
        var dy = (Math.random() -0.5) * 8; //velocity of the circle and startpointY
        circleArray.push(new Circle(x,y,dx,dy,radius));
        
    }
}

function animate(){
    requestAnimationFrame(animate); //this is the loop kinda
    c.clearRect(0, 0, canvas.width, canvas.height); // this refreshes
 
    for(var i = 0; i < circleArray.length; i++){
        circleArray[i].update();
    }
}

animate();
init();