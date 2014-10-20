var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var pong = require('./pong.js').pong;

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

setInterval(function(){
    pong.calculate_ball();
}, 1000/60);

setInterval(function(){
    io.sockets.emit('ball', pong.ball);
}, 1000);

setInterval(function(){
    io.sockets.emit('teams', pong.teams);
}, 50);

setInterval(function(){
    var y_left_total = 0;
    var y_left_count = 0;
    var y_right_total = 0;
    var y_right_count = 0;

    for(var id in pong.teams.left) {
        y_left_total += pong.teams.left[id].y;
        y_left_count++;
    }
    for(var id in pong.teams.right) {
        y_right_total += pong.teams.right[id].y;
        y_right_count++;
    }
    var paddles = {
        left: parseInt(y_left_total/y_left_count),
        right: parseInt(y_right_total/y_right_count),
    }

    paddles.left = Math.max(Math.min(paddles.left, pong.settings.height), 0);
    paddles.right = Math.max(Math.min(paddles.right, pong.settings.height), 0);

    pong.paddles.left = paddles.left;
    pong.paddles.right = paddles.right;

    io.sockets.emit('paddles', paddles);
}, 50);

io.on('connection', function(socket){
    socket.public_id = hash(socket.id);
    console.log('connected', socket.id, socket.public_id);

    var team = Math.random() < 0.5;

    socket.on('cursor', function(msg){
        if(team) {
            pong.teams.left[socket.public_id] = {y: msg.y, x: msg.x};
        } else {
            pong.teams.right[socket.public_id] = {y: msg.y, x: msg.x};
        }
    });

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id, socket.public_id);
        delete pong.teams.left[socket.public_id];
        delete pong.teams.right[socket.public_id];
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
app.use(express.static(__dirname));


function hash(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

