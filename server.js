var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});


var pong = function() {
    var pong = this;
    pong.paddle_left = 0;
    pong.paddle_right = 120;

    pong.padding = 10;
    pong.paddle_width = 10;
    pong.paddle_height = 100;

    pong.midline_width = 4;

    pong.teams = {left: {}, right: {}};
    pong.context = {
        height: 400,
        width: 600,
    }
    pong.reset_ball = function() {
        pong.ball = {
            x: pong.context.width/2,
            y: pong.context.height/2,
            dx: 120,
            dy: 120,
            size: 10,
            half: 5,
        }
    }
    pong.reset_ball();

    pong.draw_ball = function() {
        var ctx = pong.context;

        var boundary = {
            left: pong.padding + pong.paddle_width,
            right: pong.context.width - pong.padding - pong.paddle_width,
            top: 0,
            bottom: pong.context.height,
        }

        if(pong.ball.x - pong.ball.half < boundary.left) {
            if(pong.ball.y - pong.ball.half > pong.paddle_left - pong.paddle_height/2
            && pong.ball.y + pong.ball.half < pong.paddle_left + pong.paddle_height/2) {
                pong.ball.dx = -pong.ball.dx;
            }
            if(pong.ball.x < 0) {
                pong.reset_ball();
            }
        }
        if(pong.ball.x + pong.ball.half > boundary.right) {
            if(pong.ball.y - pong.ball.half > pong.paddle_right - pong.paddle_height/2
            && pong.ball.y + pong.ball.half < pong.paddle_right + pong.paddle_height/2) {
                pong.ball.dx = -pong.ball.dx;
            }
            if(pong.ball.x > ctx.width) {
                pong.reset_ball();
            }
        }
        if(pong.ball.y - pong.ball.half < boundary.top || pong.ball.y + pong.ball.half > boundary.bottom) {
            pong.ball.dy = -pong.ball.dy;
        }

        pong.ball.x += pong.ball.dx/60;
        pong.ball.y += pong.ball.dy/60;

    }
    
    return this;
}();

setInterval(function(){
    pong.draw_ball();
    io.sockets.emit('ball', pong.ball);
}, 50);

setInterval(function(){
    io.sockets.emit('teams', pong.teams);
}, 150);

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

    pong.paddle_left = paddles.left;
    pong.paddle_right = paddles.right;

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

