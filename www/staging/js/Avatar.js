class Avatar extends GameObject
{
    constructor (context, x, y, vx, vy, mass, name, id){
        super(context, x, y, vx, vy, mass);

        //Set default width and height
        this.width = 50;
        this.height = 50;
	this.name = name;
	this.on_collision = this.collide;
	this.avatar_id = id;
	this.img = new Image();
	this.img.width = "50px";
	this.img.height = "50px";
	this.img.src = "avatars/av" + this.avatar_id + ".png";
	this.kiss = new Image();
	this.kiss.width = "20px";
	this.kiss.height = "20px";
	this.kiss.src = "pixels/kiss.png";
	this.kiss.onload = function() {};
	this.img.onload = function() {};
    }

    update_avatar(){
	this.img.src = "avatars/av" + this.avatar_id + ".png";
    }

    draw(){
	let ctx = this.context;
        //Draw a simple square
	    //
        //this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
	ctx.drawImage(this.img, this.x, this.y, 50, 50);
	if (window.config.display_names) {
	    ctx.fillText(this.name, this.x-this.width/2, this.y-10);
	}
	if (this.isColliding) {
	    ctx.drawImage(this.kiss, this.x+20, this.y+35, 20, 20);
	} 
	
    }

    update(secondsPassed){
        //Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }

}
