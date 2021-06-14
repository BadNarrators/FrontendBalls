var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y:undefined
}

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

var maxRadius = 40;
var minRadius = 2;

var colorArray = [
    "#EF597B",
    "#FF6D31",
    "#73B66B", 
    "#FFCB18", 
    "#29A2C6"
];

var isMagnetActive = false;
var isStopped = false;
var showControls = 10;

var textSize = [6, 3];
var textMove = false;   


var controlsInterval = setInterval(function(){
    showControls -= 0.2;
}, 100)

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})
window.addEventListener('mousedown', function(){
    isMagnetActive = true;
})
window.addEventListener('mouseup', function(){
    isMagnetActive = false;
})

function manageResolution() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if(canvas.width < 650) {
        counterSize = [10, 5];
        counterMove = true;
    }else {
        counterSize = [6, 3];
        counterMove = false;
    }
    init();
}

manageResolution();

window.addEventListener('resize', function() {
    manageResolution();  
})

// funzione da assegnare per creare palline
addEventListener("click", function(event) {
	
});

function Circle(x,y,dx,dy,radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.magDx;
    this.magDy;
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
        if(!isStopped){    
            if(this.x + this.radius > innerWidth || this.x - this.radius < 0){ // bouncing on X
                this.dx=-this.dx;
            }
        
            if(this.y + this.radius > innerHeight || this.y - this.radius <0){ // bouncing on Y
                this.dy = -this.dy;
            }
            if(!isMagnetActive){
                this.x += this.dx;
                this.y += this.dy;
            }

            // here we interact with the mousemove

            if(isMagnetActive && mouse.x -this.x < 150 && mouse.x - this.x > -150 && mouse.y - this.y < 150 && mouse.y -this.y > -150) {
                this.magDx = (mouse.x - this.x) / 10;
                this.magDy = (mouse.y - this.y) / 10;
                this.x += this.magDx;
                this.y += this.magDy;
                
            }
        }


        this.draw();
    }
}


document.body.addEventListener("keypress", function(event){
    if(event.key == 'p') 
        isStopped = !isStopped;
    else if(event.key == 'm')
        manageMusic();
});

var circleArray = [];

function init() {

    circleArray = [];
    for(var i = 0; i < 666; i++){
        var radius = Math.random() * 15 + 1; 
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

    if(showControls>0){
        c.globalAlpha = showControls/10;
        c.lineWidth = 2;
        c.font = canvas.width/100*textSize[1]+"px Arial";
        c.fillStyle = "#222255";
        c.textAlign = "center";
        if(textMove) {
            c.fillText("Press M to play/stop music", canvas.width/2, canvas.height/100*91);
            c.fillText("Press P to play/stop the animation", canvas.width/2, canvas.height/100*98);
        }
        else {
            c.fillText("Press M to play/stop music", canvas.width/100*81, canvas.height/100*91);
            c.fillText("Press P to play/stop the animation", canvas.width/100*76, canvas.height/100*98);
        }
        c.globalAlpha = 1;
    }else clearInterval(controlsInterval)
}

animate();
init();