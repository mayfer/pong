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

    pong.ball = {
        x: pong.context.width/2,
        y: pong.context.height/2,
        dx: 80,
        dy: 80,
        size: 10,
        half: 5,
    }

    var calc_offset = function(e){
        pong.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    pong.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('#container').offset(); 
            //or $(pong).offset(); if you really just want the current element's offset
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var effective_y = Math.max(0, Math.min(pong.context.height, y));

            pong.socket.emit('cursor', {y: y, x: x});
        });

        return pong;
    }

    pong.draw_ball = function() {
        var ctx = pong.context;
        ctx.fillRect(pong.ball.x - (pong.ball.size/2), pong.ball.y - (pong.ball.size/2), pong.ball.size, pong.ball.size);

        var boundary = {
            left: pong.padding + pong.paddle_width,
            right: pong.context.width - pong.padding - pong.paddle_width,
            top: 0,
            bottom: pong.context.height,
        }

        if(pong.ball.x - pong.ball.half < boundary.left || pong.ball.x - pong.ball.half > boundary.right) {
            pong.ball.dx = -pong.ball.dx;
        }
        if(pong.ball.y - pong.ball.half < boundary.top || pong.ball.y + pong.ball.half > boundary.bottom) {
            pong.ball.dy = -pong.ball.dy;
        }

        pong.ball.x += pong.ball.dx/60;
        pong.ball.y += pong.ball.dy/60;

    }

    pong.render = function() {
        var ctx = pong.context;

        ctx.clearRect(0, 0, ctx.width, ctx.height);

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(ctx.width/2-pong.midline_width/2, 0, pong.midline_width, ctx.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pong.padding, pong.paddle_left - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);
        ctx.fillRect(ctx.width - pong.padding - pong.paddle_width, pong.paddle_right - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);

        pong.draw_ball();

        var cctx = pong.cursors_context;
        cctx.clearRect(0, 0, cctx.width, cctx.height);
        for(i in pong.cursors) {
            var o = pong.canvas_offset;
            var c = pong.cursors[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }

        window.requestAnimFrame(pong.render);
    }

    pong.set_cursors = function(cursors) {
        pong.cursors = cursors;
    };
    pong.set_paddles = function(paddles) {
        pong.paddle_left = paddles.left;
        pong.paddle_right = paddles.right;
    };

    return pong;
}
