class Avatar extends GameObject
{
    constructor (context, x, y, vx, vy, mass, name){
        super(context, x, y, vx, vy, mass);

        //Set default width and height
        this.width = 50;
        this.height = 50;
	this.name = "";
    }

    draw(){
        //Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
	var img = new Image();
	img.src = "avatars/av1.png";
	img.style.opacity = 0;
	document.body.appendChild(img);
	this.context.drawImage(img, this.x, this.y, 50, 50);
	document.body.removeChild(img);
    }

    update(secondsPassed){
        //Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}
