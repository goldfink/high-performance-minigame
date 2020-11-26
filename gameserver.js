var app = require('express')();
var express = require('express')
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('.'))

let users = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.user_name = "";
  socket.last_timesamp = 0;
  socket.user = {}; 

  socket.on("visibility_change", (state) => {
    console.log(socket.user_name, "visibility_change: " + state);
    users[socket.user_name].idle_state = state;
  });

  socket.on("keypress", (state) => {
      console.log(socket.user_name, "keypress: " + state);
      users[socket.user_name].last_keypress = state;
      socket.broadcast.emit("user_action", socket.user_name, state);
  });

  socket.on("idle_state", (timestamp) => {
      if (last_timestamp != 0 && timestamp-socket.last_timestamp >= 5000) {
          console.log(socket.user_name, "package loss");
      } else { 
	  users[socket.user_name].package_loss = 0;
      }
      users[socket.user_name].last_timestamp = timestamp;
      socket.last_timestamp = timestamp;
  });

  socket.on("user_auth", (user) => {
    console.log("user name", user.name);
    socket.user_name = user.name;
    users[user.name] = user;
    for (const [usr, obj] of Object.entries(users)) {
	if (usr != user.name) {
	    console.log("announcing user: " + obj);
	    socket.emit("user_auth", obj);
	}
    }
    socket.broadcast.emit("user_auth", user);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
