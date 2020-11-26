var app = require('express')();
var express = require('express')
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path: "/socket.io" });

let players = {};

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
  let last_timesamp = 0;
  let user_id = socket.handshake.query.user_id;
  console.log("user id: " + user_id);
  socket.on("user_name_change", (name) => {
    socket.broadcast.emit("user_name_change_all", user_id, name);
    socket.emit("user_name_change", name);
    
  });

  socket.on("visibility_change", (state) => {
    console.log(user_id, "visibility_change: " + state);
    players[user_id].idle_state = state;
  });

  socket.on("keypress", (state) => {
      console.log(players[user_id], "keypress: " + state);
      players[user_id].last_keypress = state;
      socket.broadcast.emit("user_action", players[user_id], state);
  });

  socket.on("idle_state", (timestamp) => {
      if (last_timestamp != 0 && timestamp-last_timestamp >= 5000) {
          console.log(players[user_id], "package loss");
      } else { 
	  players[user_id].package_loss = 0;
      }
      players[user_id].last_timestamp = timestamp;
      last_timestamp = timestamp;
  });

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

http.listen(4004, () => {
  console.log('listening on *:4004');
});
