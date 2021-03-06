class GameWorld {

    constructor(canvasId){
        this.canvas = null;
        this.context = null;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
        this.resetCounter = 0;
        this.init(canvasId);
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.createWorld();

        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }

    createWorld() {
        this.gameObjects = [
            new Tree(this.context, 70, 0, 0, 50, 300),
            new Tree(this.context, 60, 300, 0, 50, 300),
            //new Avatar(this.context, 0, 50, 0, 50, 1),
            //new Avatar(this.context, 250, 300, 0, -50, 200),
        ];
    }

    gameLoop(timeStamp) {


        // Calculate how much time has passed
        var secondsPassed = (timeStamp - this.oldTimeStamp) / 5000;
        this.oldTimeStamp = timeStamp;

        // Loop over all game objects to update
        for (var i = 0; i < this.gameObjects.length; i++) {
           // this.gameObjects[i].update(secondsPassed);
        }

        this.detectionCollisions();

        this.clearCanvas();

        // Loop over all game objects to draw
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        // The loop function has reached it's end
        // Keep requesting new frames
        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    detectionCollisions() {
    
        var obj1;
        var obj2;

        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].isColliding = false;
        }

        for (var i = 0; i < this.gameObjects.length; i++)
        {
            obj1 = this.gameObjects[i];
            for (var j = i + 1; j < this.gameObjects.length; j++)
            {
                obj2 = this.gameObjects[j];

                if (this.rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    var vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                    var distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                    var vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    obj1.collision_point = vCollision;
                    obj2.collision_point = vCollision;

                    var vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                    var speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

		    
                    if (speed < 0) {
			break;
                    }

                    var impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                }
            }
        }
    };


    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
	let intersect = false;
        // Check x and y for overlap
        if (x2 > w1 + x1) {
	} else if (x1 > w2 + x2) {
	} else if (y2 > h1 + y1) {
	} else if (y1 > h2 + y2) {
        } else {
    	    console.log(x1, y1, w1, h1, x2, y2, w2, h2);
	    intersect = true;
	}
    	return intersect;
    }

    clearCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
