var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};

app.use(express.static('css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
    });

io.on('connection', function(socket){
    socket.emit('add online users', users);

    socket.on('nickname', function(nickname){
        var userName = nickname;
        if(nickname == "") userName = `user${(socket.id).slice(0,4)}`;
        users[socket.id] = userName;
        socket.emit('nickname', userName);
        socket.broadcast.emit('add user', userName);
    });

    socket.on('chat message', function(message){
        socket.broadcast.emit('show message', message);
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(3000, function(){
  console.log('Listening on 3000 ...');
});
    