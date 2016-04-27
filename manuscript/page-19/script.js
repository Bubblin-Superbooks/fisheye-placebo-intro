var Fire = function() {
    this.canvas = document.getElementById('fire');
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.height = document.body.clientHeight;
    this.canvas.width = document.body.clientWidth;

    this.aFires = [];
    this.aSpark = [];
    this.aSpark2 = [];

    this.mouse = {
        x: this.canvas.width * 0.15,
        y: this.canvas.height * 0.73,
    };

    this.init();

};

Fire.prototype.init = function() {
    this.canvas.addEventListener('mousemove', this.updateMouse.bind(this), false);
};

Fire.prototype.run = function() {

    this.update();
    this.draw();

    if (this.bRuning)
        requestAnimationFrame(this.run.bind(this));

};

Fire.prototype.start = function() {
    this.bRuning = true;
    this.run();
};

Fire.prototype.stop = function() {
    this.bRuning = false;
};

Fire.prototype.update = function() {
    this.aFires.push(new Flame(this.mouse));
    this.aSpark.push(new Spark(this.mouse));
    this.aSpark2.push(new Spark(this.mouse));

    for (var i = this.aFires.length - 1; i >= 0; i--) {
        if (this.aFires[i].alive)
            this.aFires[i].update();
        else
            this.aFires.splice(i, 1);
    }

    for (var j = this.aSpark.length - 1; j >= 0; j--) {

        if (this.aSpark[j].alive)
            this.aSpark[j].update();
        else
            this.aSpark.splice(j, 1);

    }


    for (var k = this.aSpark2.length - 1; k >= 0; k--) {

        if (this.aSpark2[k].alive)
            this.aSpark2[k].update();
        else
            this.aSpark2.splice(k, 1);

    }

};

Fire.prototype.draw = function() {

    this.clearCanvas();

    this.drawHalo();

    this.ctx.globalCompositeOperation = "overlay"; 

    for (var i = this.aFires.length - 1; i >= 0; i--) {
        this.aFires[i].draw(this.ctx);
    }

    this.ctx.globalCompositeOperation = "soft-light"; 

    for (var j = this.aSpark.length - 1; j >= 0; j--) {

        if ((j % 2) === 0)
            this.aSpark[j].draw(this.ctx);

    }

    this.ctx.globalCompositeOperation = "color-dodge"; 

    for (var k = this.aSpark2.length - 1; k >= 0; k--) {

        this.aSpark2[k].draw(this.ctx);

    }


};

Fire.prototype.updateMouse = function(e) {

    this.mouse.x = this.canvas.width * 0.15; /* e.clientX */
    this.mouse.y = this.canvas.height * 0.73; /*e.clientY;*/ 

};

Fire.prototype.clearCanvas = function() {

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    var img = new Image();
    
    img.src = 'https://raw.githubusercontent.com/marvindanig/fisheye-placebo-intro/master/assets/images/18.jpg';

    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height );

    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.pattern;
    this.ctx.fill(); 

};

Fire.prototype.drawHalo = function() {

    var r = rand(300, 350);
    this.ctx.globalCompositeOperation = "lighter";
    this.grd = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, r, this.mouse.x, this.mouse.y, 0);
    this.grd.addColorStop(0, "transparent");
    this.grd.addColorStop(1, "rgb( 50, 2, 0 )");
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y - 100, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.grd;
    this.ctx.fill();

};

Fire.prototype.drawTxt = function() {

    var mousePCx = ((this.canvas.width / 2) - this.mouse.x) / 20;
    var mousePCy = ((this.canvas.height / 2) - this.mouse.y) / 20;

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.save();

    this.ctx.strokeStyle = "rgb(50, 50, 0)";
    this.ctx.lineWidth = 2;

    this.ctx.shadowColor = "rgba( 10, 0, 0, 0.5 )";
    this.ctx.shadowOffsetX = rand(mousePCx - 2, mousePCx + 2);
    this.ctx.shadowOffsetY = rand(mousePCy - 2, mousePCy + 2);
    this.ctx.shadowBlur = rand(7, 10);


    this.ctx.restore();

};


var Flame = function(mouse) {

    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand(this.cx - 25, this.cx + 25);
    this.y = rand(this.cy - 5, this.cy + 5);
    this.lx = this.x;
    this.ly = this.y;
    this.vy = rand(1, 3);
    this.vx = rand(-1, 1);
    this.r = rand(30, 40);
    this.life = rand(2, 7);
    this.alive = true;
    this.c = {

        h: Math.floor(rand(2, 40)),
        s: 100,
        l: rand(80, 100),
        a: 0,
        ta: rand(0.8, 0.9)

    };
};

Flame.prototype.update = function() {

    this.lx = this.x;
    this.ly = this.y;

    this.y -= this.vy;
    this.vy += 0.08;

    this.x += this.vx;

    if (this.x < this.cx)
        this.vx += 0.2;
    else
        this.vx -= 0.2;

    if (this.r > 0)
        this.r -= 0.3;

    if (this.r <= 0)
        this.r = 0;

    this.life -= 0.12;

    if (this.life <= 0) {

        this.c.a -= 0.05;

        if (this.c.a <= 0)
            this.alive = false;

    } else if (this.life > 0 && this.c.a < this.c.ta) {

        this.c.a += 0.08;
    }
};

Flame.prototype.draw = function(ctx) {

    this.grd1 = ctx.createRadialGradient(this.x, this.y, this.r * 3, this.x, this.y, 0);
    this.grd1.addColorStop(0.5, "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 20) + ")");
    this.grd1.addColorStop(0, "transparent");

    this.grd2 = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, 0);
    this.grd2.addColorStop(0.5, "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")");
    this.grd2.addColorStop(0, "transparent");

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI);
    ctx.fillStyle = this.grd1;
    ctx.fill();

    ctx.globalCompositeOperation = "overlay";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.grd2;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, 1)";
    ctx.lineWidth = rand(1, 2);
    ctx.stroke();
    ctx.closePath();

};

var Spark = function(mouse) {

    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand(this.cx - 40, this.cx + 40);
    this.y = rand(this.cy, this.cy + 5);
    this.lx = this.x;
    this.ly = this.y;
    this.vy = rand(1, 3);
    this.vx = rand(-4, 4);
    this.r = rand(0, 1);
    this.life = rand(4, 8);
    this.alive = true;
    this.c = {

        h: Math.floor(rand(2, 40)),
        s: 100,
        l: rand(40, 100),
        a: rand(0.8, 0.9)

    };

};

Spark.prototype.update = function() {

    this.lx = this.x;
    this.ly = this.y;

    this.y -= this.vy;
    this.x += this.vx;

    if (this.x < this.cx)
        this.vx += 0.2;
    else
        this.vx -= 0.2;

    this.vy += 0.08;
    this.life -= 0.1;

    if (this.life <= 0) {

        this.c.a -= 0.05;

        if (this.c.a <= 0)
            this.alive = false;
    }
};

Spark.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 2) + ")";
    ctx.lineWidth = this.r * 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
    ctx.lineWidth = this.r;
    ctx.stroke();
    ctx.closePath();
};

rand = function(min, max) {
    return Math.random() * (max - min) + min;
};

onresize = function() {
    oCanvas.canvas.width = document.body.clientWidth;
    oCanvas.canvas.height = document.body.clientHeight;
};

var oCanvas;
init = function() {
    oCanvas = new Fire();
    oCanvas.start();
};

window.onload = init;