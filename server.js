var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

var cursors = {};

setInterval(function(){
    var _cursors = new Array;
    for(var o in cursors) {
        _cursors.push(cursors[o]);
    }
    io.sockets.emit('cursors', _cursors);
}, 20);

io.on('connection', function(socket){
    console.log('connected', socket.id);

    socket.on('cursor', function(msg){
        cursors[socket.id] = {y: msg.y, x: msg.x};
    });

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id);
        delete cursors[socket.id];
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
app.use(express.static(__dirname));



