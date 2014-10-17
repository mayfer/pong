var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

var teams = {
    left: {},
    right: {},
};

setInterval(function(){
    io.sockets.emit('teams', teams);
}, 150);

setInterval(function(){
    var y_left_total = 0;
    var y_left_count = 0;
    var y_right_total = 0;
    var y_right_count = 0;

    for(var id in teams.left) {
        y_left_total += teams.left[id].y;
        y_left_count++;
    }
    for(var id in teams.right) {
        y_right_total += teams.right[id].y;
        y_right_count++;
    }
    var paddles = {
        left: parseInt(y_left_total/y_left_count),
        right: parseInt(y_right_total/y_right_count),
    }

    io.sockets.emit('paddles', paddles);
}, 50);

io.on('connection', function(socket){
    socket.public_id = hash(socket.id);
    console.log('connected', socket.id, socket.public_id);

    var team = Math.random() < 0.5;

    socket.on('cursor', function(msg){
        if(team) {
            teams.left[socket.public_id] = {y: msg.y, x: msg.x};
        } else {
            teams.right[socket.public_id] = {y: msg.y, x: msg.x};
        }
    });

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id, socket.public_id);
        delete teams.left[socket.public_id];
        delete teams.right[socket.public_id];
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
app.use(express.static(__dirname));


function hash(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

