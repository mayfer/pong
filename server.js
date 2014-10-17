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
    io.sockets.emit('cursors', cursors);
}, 150);

setInterval(function(){
    var y_total = 0;
    var y_count = 0;

    for(var id in cursors) {
        y_total = Math.max(Math.min(cursors[id].y, 400), 0);
        y_count++;
    }
    var paddles = {
        left: parseInt(y_total/y_count),
        right: parseInt(y_total/y_count),
    }

    io.sockets.emit('paddles', paddles);
}, 50);

io.on('connection', function(socket){
    socket.public_id = hash(socket.id);
    console.log('connected', socket.id, socket.public_id);

    socket.on('cursor', function(msg){
        cursors[socket.public_id] = {y: msg.y, x: msg.x};
    });

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id, socket.public_id);
        delete cursors[socket.public_id];
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
app.use(express.static(__dirname));


function hash(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

