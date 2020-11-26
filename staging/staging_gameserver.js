var app = require('express')();
var express = require('express')
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path: "/staging-socket.io" });

// holds all user data, needs to be in sync but not polling
let players = {
};

io.use(function(socket, next){
  let user_id = socket.handshake.query.user_id;
  let player = players[user_id];
  if (user_id) {
  if (!player) { players[user_id] = {unauthorized: true}} else {players[user_id] = {unauthorized: false}}
    return next();
  } else {
    next(new Error("malicious user id"));
  }
});

io.on('connection', (socket) => {
  let last_timestamp = 0;
  let user_id = socket.handshake.query.user_id;
  console.log("user id: " + user_id);
  socket.on("user_name_change", (name) => {
    socket.broadcast.emit("user_name_change_all", user_id, name);
    socket.emit("user_name_change", name);
    
  });

  socket.on("visibility_state", (state) => {
    console.log(user_id, "visibility_change: " + state);
    players[user_id].visibility = state;
      socket.broadcast.emit("visibility", user_id, state);
  });

  socket.on("keypress", (state, pos) => {
      console.log(players[user_id], "keypress: " + state);
      players[user_id].last_keypress = state;
      players[user_id].position = pos;
      socket.broadcast.emit("user_action", user_id, state);
  });

  socket.on("connection_state", (timestamp) => {
      if (last_timestamp != 0 && timestamp-last_timestamp >= 5000) {
          console.log(players[user_id], "package loss");
	  players[user_id].connection_state = 0;
	  socket.broadcast.emit("connection_state", user_id, 0);
      } else { 
	  players[user_id].connection_state = 1;
      }
      players[user_id].last_timestamp = timestamp;
      last_timestamp = timestamp;
  });

  socket.on("user_sync", function(position){
    players[user_id].position = position;
  });

  setInterval(function(){
    for (const [id, data] of Object.entries(players)) {
    socket.broadcast.emit("user_sync", id, data.position);
    }
  }, 2000);

  socket.on("user_auth", (user) => {
    players[user_id] = user;
    console.log("user name", user.name);
    players[user.id] = user;
    for (const [usr, obj] of Object.entries(players)) {
	if (usr != user.id) {
	    console.log("announcing user: " + obj);
	    socket.emit("user_auth", obj);
	}
    }
    socket.broadcast.emit("user_auth", user);
  });
});

http.listen(1313, () => {
  console.log('listening on *:1313');
});
