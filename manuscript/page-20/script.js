var canvas = document.createElement('canvas');
var w = canvas.width = document.body.clientHeight;
var h = canvas.height = document.body.clientHeight;
var c = canvas.getContext('2d');

var img = new Image();
img.src = 'https://raw.githubusercontent.com/marvindanig/fisheye-placebo-intro/master/assets/images/smoke.png';

var position = { x: w * 0.9, y: h * 0.13 };

document.body.appendChild(canvas);

var particles = [];
var random = function(min, max) {
    return Math.random() * (max - min) * min;
};

canvas.onmousemove = function(e) {
    position.x = w * 0.9; /* e.offsetX; */
    position.y = h * 0.13; /* e.offsetY; */
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.velY = (random(1, 10) - 5) / 10;
    this.velX = -3;
    this.size = random(3, 5) / 10;
    this.alpha = 1;
    this.update = function() {
        this.y += this.velY;
        this.x += this.velX;
        this.velY *= 0.99;
        if (this.alpha < 0)
            this.alpha = 0;
        c.globalAlpha = this.alpha;
        c.save();
        c.translate(this.x, this.y);
        c.scale(this.size, this.size);
        c.drawImage(img, -img.width / 2, -img.height / 2);
        c.restore();
        this.alpha *= 0.96;
        this.size += 0.01; 
    };
}

var draw = function() {
    var p = new Particle(position.x, position.y);
    particles.push(p);

    var img = new Image();
    img.src = 'https://raw.githubusercontent.com/marvindanig/fisheye-placebo-intro/master/assets/images/19.jpg';
    c.drawImage(img, 0, 0, document.body.clientWidth, document.body.clientHeight);


    while (particles.length > 1000) particles.shift();

    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
    }
};

setInterval(draw, 1000 / 60);
