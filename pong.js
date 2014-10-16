function Pong(context, socket, cursors_context) {
    var pong = this;
    pong.context = context;
    pong.cursors_context = cursors_context;
    pong.socket = socket;

    pong.paddle_left = 0;
    pong.paddle_right = 120;

    pong.padding = 10;
    pong.paddle_width = 10;
    pong.paddle_height = 100;

    pong.midline_width = 4;

    pong.cursors = [];

    pong.canvas_offset = $('#container').offset();

    pong.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('#container').offset(); 
            //or $(pong).offset(); if you really just want the current element's offset
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var effective_y = Math.max(0, Math.min(pong.context.height, y));

            pong.paddle_left = effective_y;
            pong.socket.emit('cursor', {y: y, x: x});
        });

        return pong;
    }

    pong.render = function() {
        var ctx = pong.context;

        ctx.clearRect(0, 0, ctx.width, ctx.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pong.padding, pong.paddle_left - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);
        ctx.fillRect(ctx.width - pong.padding - pong.paddle_width, pong.paddle_right - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(ctx.width/2-pong.midline_width/2, 0, pong.midline_width, ctx.height);


        var cctx = pong.cursors_context;
        cctx.clearRect(0, 0, cctx.width, cctx.height);
        cctx.fillStyle = "#ffffff";
        for(var i=0; i<pong.cursors.length; i++) {
            var o = pong.canvas_offset;
            var c = pong.cursors[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }

        window.requestAnimFrame(pong.render);
    }

    pong.set_cursors = function(cursors) {
        pong.cursors = cursors;
        console.log(pong.cursors);
    };

    return pong;
}
