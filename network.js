
function Network() {
    var net = this;
    net.game = null;
    net.socket = io();

    net.socket.on('paddles', function(msg){
        net.game.set_paddles(msg);
    });
    net.socket.on('cursors', function(msg){
        net.game.set_cursors(msg);
    });

    return this;
}
