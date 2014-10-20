
function Network() {
    var net = this;
    net.game = null;
    net.socket = io();

    net.socket.on('paddles', function(msg){
        net.game.set_paddles(msg);
    });
    net.socket.on('teams', function(msg){
        net.game.set_teams(msg);
    });
    net.socket.on('ball', function(msg){
        // console.log('ball', msg);
        net.game.last_timestamp = Date.now();
        net.game.set_ball(msg);
    });

    return this;
}
