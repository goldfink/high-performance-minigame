class Tree extends GameObject
{
    constructor (context, x, y, vx, vy, mass, name, id){
        super(context, x, y, vx, vy, mass);

        //Set default width and height
        this.width = 50;
        this.height = 50;
	this.on_collision = this.collide;
	this.img = new Image();
	this.img.width = "50px";
	this.img.height = "50px";
	this.img.src = "pixels/tree.png"
	this.img.onload = function() {};
    }


    draw(){
	let ctx = this.context;
        //Draw a simple square
	    //
        //this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
	ctx.drawImage(this.img, this.x, this.y, 50, 50);
	if (this.isColliding) {
	} 
	
    }

    update(secondsPassed){
        //Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }

}
