var socket = io("http://localhost:3000");

var config = {
    package_loss_interval: 5000,
    avatar_step_size: 20,
};

var players = {};

var user = {
    name: window.localStorage.getItem("user_name") || function() {
	var user_name = random(14);
	window.localStorage.setItem("user_name", user_name);
	return user_name;
    }()
};

const transmit = (event, data) => {
    socket.emit(event, data);
    console.log("transmission", {event: data});
};

document.addEventListener("keydown", function(event) {
    if (event.keyCode == 38) {
	action = "up";
	user.avatar.y -= config.avatar_step_size;
    } else if (event.keyCode == 40) {
	action = "down";
	user.avatar.y += config.avatar_step_size;
    } else if (event.keyCode == 37) {
	action = "left";
	user.avatar.x -= config.avatar_step_size;
    } else if (event.keyCode == 39) {
	action = "right";
	user.avatar.x += config.avatar_step_size;
    } else if (event.keyCode == 32) {
	action = "jump";
    } else if (event.keyCode == 27) {
	action = "pause";
    }
    transmit("keypress", action);
    window.localStorage.setItem("position",
	JSON.stringify({x:user.avatar.x, y:user.avatar.y}));
});

socket.on("user_auth", function(newuser) {
    if (!players[newuser.name]) {
	console.log("welcoming new user");
	players[newuser.name] = newuser;
	var avatar = new Avatar(window.gameWorld.context, 0, 100, 0, 100, 1,
	    newuser.name);
	avatar.x = newuser.avatar.x; 
	avatar.y = newuser.avatar.y;
	players[newuser.name].avatar = avatar;
	window.gameWorld.gameObjects.push(players[newuser.name].avatar);
    } else {
	console.log("known user reauthenticated");
    }
});

socket.on("user_action", function(newuser, action) {
    if (players[newuser]) {
	console.log("user " + newuser + " did: ", action);
	if (action == "up") {
	    players[newuser].avatar.y -= config.avatar_step_size;
	} else if (action == "down") {
	    players[newuser].avatar.y += config.avatar_step_size;
	} else if (action == "left") {
	    players[newuser].avatar.x -= config.avatar_step_size;
	} else if (action == "right") {
	    players[newuser].avatar.x += config.avatar_step_size;
	}
    } else {
	console.log("action by unknown user");
    }
});

document.addEventListener('DOMContentLoaded', function(event) {
    transmit("user_auth", user);
    if (window.localStorage.getItem("position")) {
	user.position = JSON.parse(window.localStorage.getItem("position"));
    } else {
	user.position = {x: 0, y: 0};
	window.localStorage.setItem("position", JSON.stringify(user.position));
    }
    players[user.name] = user;
    window.gameWorld = new GameWorld('game');
    user.avatar = new Avatar(window.gameWorld.context, 0, 100, 0, 100, 1);
    user.avatar.x = user.position.x;
    user.avatar.y = user.position.y;
    window.gameWorld.gameObjects.push(user.avatar);
});

document.addEventListener(Visibility.visibilitychange, function() {
    transmit("visibility_state", Visibility.isHidden());
});

var package_loss = setInterval(function(){
    var local_time = Date.now();
    transmit("package_loss", local_time);
    // make this socket.io stream in chunks to see live package loss
}, 1000);
