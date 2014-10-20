function PongClient(context, socket, cursors_context) {
    var pong = this;
    pc.context = context;
    pc.cursors_context = cursors_context;
    pc.socket = socket;

    var calc_offset = function(e){
        pc.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    pc.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('#container').offset(); 
            //or $(pong).offset(); if you really just want the current element's offset
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var effective_y = Math.max(0, Math.min(pc.context.height, y));

            pc.socket.emit('cursor', {y: y, x: x});
        });
        pc.reset_ball();

        return pong;
    }


    pc.draw_ball = function() {
        var ctx = pc.context;
        ctx.fillRect(
            pc.ball.x - (pc.ball.size/2),
            pc.ball.y - (pc.ball.size/2),
            pc.ball.size,
            pc.ball.size
        );
    }

    pc.frame = 0;

    pc.render = function() {
        var ctx = pc.context;

        ctx.clearRect(0, 0, pong.settings.width, pong.settings.height);

        ctx.fillStyle = "#333333";
        ctx.fillRect(
            pong.settings.width/2-pc.midline_width/2,
            0,
            pc.midline_width,
            pong.settings.height
        );

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            pc.padding,
            pc.paddle.left - (pc.paddle.height/2),
            pc.paddle.width,
            pc.paddle.height
        );
        ctx.fillRect(
            pong.settings.width - pc.padding - pc.paddle.width,
            pc.paddle.right - (pc.paddle.height/2),
            pc.paddle.width,
            pc.paddle.height
        );

        if(pc.frame < 60) {
            console.log(pc.frame, pc.ball);
            pc.frame++
        }
        pc.predict_ball();
        pc.draw_ball();

        var cctx = pc.cursors_context;
        cctx.clearRect(0, 0, cpong.settings.width, cpong.settings.height);
        var o = pc.canvas_offset;

        cctx.fillStyle = "#ff0000";
        for(i in pc.teams.left) {
            var c = pc.teams.left[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }
        cctx.fillStyle = "#00ff00";
        for(i in pc.teams.right) {
            var c = pc.teams.right[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }

        window.requestAnimFrame(pc.render);
    }

    pc.set_ball = function(ball) {
        pc.ball = ball;
    };
    pc.set_teams = function(teams) {
        pc.teams = teams;
    };
    pc.set_paddles = function(paddles) {
        pc.paddle.left = paddles.left;
        pc.paddle.right = paddles.right;
    };

    return pong;
}
