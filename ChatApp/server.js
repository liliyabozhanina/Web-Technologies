const io = require('socket.io')(3000)

const users = {}
var clientInfo = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
  socket.on("userSeen", function(msg) {
    socket.broadcast.to(clientInfo[socket.id]).emit("userSeen", msg);
    socket.emit("message", msg);
  })
  socket.on("message", function(message) {
    //console.log("Message Received: " + message.text);
    if (message.text === "/list") {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      socket.broadcast.emit("message",message);
    }
  })
  function sendCurrentUsers(socket) { 
    var info = clientInfo[socket.id];
    //var users = [];
    if (typeof info === 'undefined') {
      return;
    }
  }
})