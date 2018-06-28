(function(window) {
    var Fire = function() {
				var w = window
				var d = document
				var e = d.documentElement
				var g = d.getElementsByTagName('body')[0]

        this.canvas = document.getElementById('fire');
        this.ctx = this.canvas.getContext('2d');
        
				this.canvas.width = w.innerWidth || e.clientWidth || g.clientWidth
				this.canvas.height = w.innerHeight || e.clientHeight || g.clientHeight

        this.aFires = [];
        this.aSpark = [];
        this.aSpark2 = [];

        this.mouse = {
						x: this.canvas.width * 1.2,
						y: this.canvas.height * 0.75,
        }      	



        this.init();

    }
    Fire.prototype.init = function() {

        this.canvas.addEventListener('mousemove', this.updateMouse.bind(this), false);

    }
    Fire.prototype.run = function() {

        this.update();
        this.draw();

        if (this.bRuning)
            requestAnimationFrame(this.run.bind(this));

    }
    Fire.prototype.start = function() {

        this.bRuning = true;
        this.run();

    }
    Fire.prototype.stop = function() {

        this.bRuning = false;

    }
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

        for (var i = this.aSpark.length - 1; i >= 0; i--) {

            if (this.aSpark[i].alive)
                this.aSpark[i].update();
            else
                this.aSpark.splice(i, 1);

        }


        for (var i = this.aSpark2.length - 1; i >= 0; i--) {

            if (this.aSpark2[i].alive)
                this.aSpark2[i].update();
            else
                this.aSpark2.splice(i, 1);

        }

    }

    Fire.prototype.draw = function() {

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "rgba( 0, 0, 0, 0 )";
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
				
				var img = new Image();

				img.src = 'https://res.cloudinary.com/bubblin/image/upload/c_fill,f_auto,q_auto/v1530214441/yuumei/17.jpg';

				this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);


        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y - 100, 200, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.grd;
        this.ctx.fill();


        this.ctx.globalCompositeOperation = "overlay"; //or lighter or soft-light

        for (var i = this.aFires.length - 1; i >= 0; i--) {

            this.aFires[i].draw(this.ctx);

        }

        this.ctx.globalCompositeOperation = "soft-light"; //"soft-light";//"color-dodge";

        for (var i = this.aSpark.length - 1; i >= 0; i--) {

            if ((i % 2) === 0)
                this.aSpark[i].draw(this.ctx);

        }


        this.ctx.globalCompositeOperation = "color-dodge"; //"soft-light";//"color-dodge";

        for (var i = this.aSpark2.length - 1; i >= 0; i--) {

            this.aSpark2[i].draw(this.ctx);

        }


    }

    Fire.prototype.updateMouse = function(e) {

        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        //this.aFires.push( new Flame( this.mouse ) );

    }




    var Flame = function(mouse) {

        this.cx = mouse.x;
        this.cy = mouse.y;
        this.x = rand(this.cx - 25, this.cx + 25);
        this.y = rand(this.cy - 5, this.cy + 5);
        this.vy = rand(1, 3);
        this.vx = rand(-1, 1);
        this.r = rand(20, 30);
        this.life = rand(3, 6);
        this.alive = true;
        this.c = {

            h: Math.floor(rand(2, 40)),
            s: 100,
            l: rand(80, 100),
            a: 0,
            ta: rand(0.8, 0.9)

        }


    }
    Flame.prototype.update = function() {

        this.y -= this.vy;
        this.vy += 0.05;


        this.x += this.vx;

        if (this.x < this.cx)
            this.vx += 0.1;
        else
            this.vx -= 0.1;




        if (this.r > 0)
            this.r -= 0.1;

        if (this.r <= 0)
            this.r = 0;



        this.life -= 0.15;

        if (this.life <= 0) {

            this.c.a -= 0.05;

            if (this.c.a <= 0)
                this.alive = false;

        } else if (this.life > 0 && this.c.a < this.c.ta) {

            this.c.a += .08;

        }

    }
    Flame.prototype.draw = function(ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI);
        ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 20) + ")";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
        ctx.fill();

    }




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
        this.life = rand(4, 5);
        this.alive = true;
        this.c = {

            h: Math.floor(rand(2, 40)),
            s: 100,
            l: rand(40, 100),
            a: rand(0.8, 0.9)

        }

    }
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

    }
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

    }

    rand = function(min, max) {
        return Math.random() * (max - min) + min;
    };
    onresize = function() {
        oCanvas.canvas.width = window.innerWidth;
        oCanvas.canvas.height = window.innerHeight;
    };



    var oCanvas;
    init = function() {

        oCanvas = new Fire();
        oCanvas.start();

    }


    window.onload = init;

})(window)