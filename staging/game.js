var config = {
    package_loss_interval: 5000,
    avatar_step_size: 20,
    display_names: true
};

var players = {};

var user = {
    id: window.localStorage.getItem("user_id") || function() {
	var user_id = random(15);
	window.localStorage.setItem("user_id", user_id);
	console.log("user id: " + user_id);
	return user_id;
    }(),
    name: window.localStorage.getItem("user_name") || function() {
	var user_name = "heddah";
	window.localStorage.setItem("user_name", user_name);
	return user_name;
    }(),
    avatar_id: window.localStorage.getItem("avatar_id") || function() {
	var avatar_id = Math.floor(Math.random()*9);
	window.localStorage.setItem("avatar_id", avatar_id);
	return avatar_id;
    }(),
    connection_state: 1,
    last_timestamp: 1
};

var socket = io("https://" + document.location.hostname, {query: "user_id="+user.id, path: "/staging-socket.io"});

socket.on("unknown_user", function(user) {
    console.error("old session");
});

const transmit = (event, data) => {
    socket.emit(event, data);
    console.log("transmission", {event: data});
};

socket.on("user_name_change", function(name) {
    user.name = name;
    user.avatar.name = name;
    window.localStorage.setItem("user_name", name);
});

socket.on("connection_state", function(id, state) {
    players[id].connection_state = state;
    if (state == 1) {
	console.log(players[id].name + " has connection issues");
    }
});

socket.on("visibility", function(id, state) {
    players[id].visibility = state;
   console.log(players[id].name + " went " + state);
});

socket.on("user_avatar_change", function(old, id) {
    user.avatar_id = id;
    user.avatar.id = id;
    user.avatar.update_avatar(id);
    window.localStorage.setItem("avatar_id", id);
});

socket.on("user_avatar_change_all", function(id, avatar) {
    players[id].avatar.id = avatar;
    players[id].avatar_id = avatar;
    players[id].avatar.update_avatar(avatar);
    gameWorld.gameObjects[players[id].gameObject].update_avatar(avatar);
});


socket.on("user_name_change_all", function(id, name) {
    players[id].avatar.name = name;
    players[id].name = name;
});


socket.on("user_name_change_refused", function(old) {
    alert('username taken, sorry');
}); 


const handle_user_interaction = (event) => {
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
    transmit("keypress", action, {x: user.avatar.x, y: user.avatar.y});
    window.localStorage.setItem("position",
   JSON.stringify({x:user.avatar.x, y:user.avatar.y}));
};

document.addEventListener("keydown", handle_user_interaction);


socket.on("user_auth", function(newuser) {
    console.log(newuser);
    if (!players[newuser.id]) {
	console.log("welcoming new user " + newuser.name);
	players[newuser.id] = newuser;
	var avatar = new Avatar(window.gameWorld.context, newuser.avatar.x, newuser.avatar.y, 0, 50, 0,
	    newuser.name, newuser.avatar_id);
	avatar.x = newuser.avatar.x; 
	avatar.y = newuser.avatar.y;
	players[newuser.id].avatar = avatar;
	var b = window.gameWorld.gameObjects.push(players[newuser.id].avatar);
	players[newuser.id].gameObject = b;
    } else {
	console.log("known user reauthenticated");
    }
});

socket.on("user_action", function(id, action) {
    if (players[id]) {
	console.log("user " + players[id].name + " did: ", action);
	if (action == "up") {
	    players[id].avatar.y -= config.avatar_step_size;
	} else if (action == "down") {
	    players[id].avatar.y += config.avatar_step_size;
	} else if (action == "left") {
	    players[id].avatar.x -= config.avatar_step_size;
	} else if (action == "right") {
	    players[id].avatar.x += config.avatar_step_size;
	}
    } else {
	console.log("action by unknown user");
    }
});

socket.on("user_sync", function(id, position) {
    if (players[id]) {
	players[id].avatar.x = position.x;
	players[id].avatar.y = position.y;
    }
});

window.onload = function() {
    if (window.localStorage.getItem("position")) {
	user.position = JSON.parse(window.localStorage.getItem("position"));
    } else {
	user.position = {x: 0, y: 0};
	window.localStorage.setItem("position", JSON.stringify(user.position));
    }
    players[user.id] = user;
    user.position = {x:0,y:0};
    user.name = "heedah";
    window.gameWorld = new GameWorld('game');
    user.avatar = new Avatar(window.gameWorld.context, user.position.x, user.position.y, 0, 50, 0, user.name, user.avatar_id);
    user.avatar.x = user.position.x;
    user.avatar.y = user.position.y;
    window.gameWorld.gameObjects.push(user.avatar);
    transmit("user_auth", user);
};

document.addEventListener(Visibility.visibilitychange, function() {
    transmit("visibility_state", Visibility.isHidden());
});

var package_loss = setInterval(function(){
    var local_time = Date.now();
    transmit("connection_state", local_time);
    // make this socket.io stream in chunks to see live package loss
}, 1000);

var sync = setInterval(function() {
    transmit("user_sync", {x: user.avatar.x, y: user.avatar.y});
}, 2000);
