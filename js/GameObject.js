class GameObject
{
    constructor (context, x, y, vx, vy, mass){
        this.context = context;
        this.x = x;
	this.on_collision = function() { };
        this.y = y;
        this.vx = vx;
        this.vy = vy;
	this.collision_point = {x: 0, v:0};
        this.mass = mass;

        this.isColliding = false;
    }
}
