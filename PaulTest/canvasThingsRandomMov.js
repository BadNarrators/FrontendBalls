var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y:undefined
}

var maxRadius = 40;
var minRadius = 2;

var colorArray = [
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100'
];

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
})

// funzione da assegnare per creare palline
addEventListener("click", function(event) {
	
});

function Circle(x,y,dx,dy,radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
		c.closePath();
        
    }
                   

    this.update = function(){
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){ // bouncing on X
            this.dx=-this.dx;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius <0){ // bouncing on Y
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        // here we interact with the mousemove

        if(mouse.x -this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y -this.y > -50) {
           if(this.radius < maxRadius) {
            this.radius += 1;
           } 
            
        }else if(this.radius > this.minRadius){
            this.radius -= 1;
        }


        this.draw();
    }
}


var circleArray = [];

function init() {

    circleArray = [];
    for(var i = 0; i < 666; i++){
        var radius = Math.random() * 10 + 1; 
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() -0.5) * 8; //velocity of the circle and startpointX
        var dy = (Math.random() -0.5) * 8; //velocity of the circle and startpointY
        circleArray.push(new Circle(x,y,dx,dy,radius));
        
    }
}

function animate(){
    requestAnimationFrame(animate); //this is the loop kinda
    c.clearRect(0,0, innerWidth, innerHeight); // this refreshes
 
    for(var i = 0; i < circleArray.length; i++){
        circleArray[i].update();
    }
}

animate();
init();