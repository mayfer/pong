function PongClient(context, pong, socket, cursors_context) {
    var pc = this;
    pc.context = context;
    pc.cursors_context = cursors_context;
    pc.socket = socket;
    pc.cursor = {
        x: 0,
        y: 0,
    };

    var calc_offset = function(e){
        pc.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    pc.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('#container').offset(); 
            //or $(pong).offset(); if you really just want the current element's offset
            pc.cursor.x = e.pageX - parentOffset.left;
            pc.cursor.y = e.pageY - parentOffset.top;

            var effective_y = Math.max(0, Math.min(pc.context.height, pc.cursor.y));

            pc.socket.emit('cursor', pc.cursor);
        });
        pong.reset_ball();

        return pc;
    }


    pc.draw_ball = function() {
        var ctx = pc.context;
        ctx.fillRect(
            pong.ball.x - (pong.ball.size/2),
            pong.ball.y - (pong.ball.size/2),
            pong.ball.size,
            pong.ball.size
        );
    }

    pc.draw_forces = function() {
        var ctx = pc.cursors_context;
        var o = pc.canvas_offset;
        
        ctx.strokeStyle = "#aa0000";
        for(i in pong.teams.left) {
            var c = pong.teams.left[i];
            ctx.beginPath();
            ctx.moveTo(
                o.left + c.x + pong.paddles.width/2,
                o.top + c.y
            );
            ctx.lineTo(
                o.left + pong.padding + pong.paddles.width/2,
                o.top + pong.paddles.left
            );
            // console.log(o.left + c.x, o.top + c.y);
            // console.log(o.left + pong.padding, o.top + pong.paddles.left);
            ctx.stroke();
        }
        ctx.strokeStyle = "#00aa00";
        for(i in pong.teams.right) {
            var c = pong.teams.right[i];
            ctx.beginPath();
            ctx.moveTo(o.left + c.x, o.top + c.y);
            ctx.lineTo(o.left + pong.settings.width - pong.padding, o.top + pong.paddles.right);
            // console.log(o.left + c.x, o.top + c.y);
            // console.log(o.left + pong.padding, o.top + pong.paddles.left);
            ctx.stroke();
        }
    }

    pc.frame = 0;

    pc.render = function() {
        var ctx = pc.context;

        ctx.clearRect(0, 0, pong.settings.width, pong.settings.height);
        ctx.fillStyle = "#333333";
        ctx.fillRect(
            pong.settings.width/2-pc.midline_width/2,
            0,
            pong.midline_width,
            pong.settings.height
        );

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            pong.padding,
            pong.paddles.left - (pong.paddles.height/2),
            pong.paddles.width,
            pong.paddles.height
        );
        ctx.fillRect(
            pong.settings.width - pong.padding - pong.paddles.width,
            pong.paddles.right - (pong.paddles.height/2),
            pong.paddles.width,
            pong.paddles.height
        );

        if(pc.frame < 60) {
            //console.log(pc.frame, pong.ball);
            pc.frame++
        }

        pong.calculate_ball();
        pc.draw_ball();

        var cctx = pc.cursors_context;
        cctx.clearRect(0, 0, cctx.width, cctx.height);
        pc.draw_forces();

        var o = pc.canvas_offset;

        cctx.fillStyle = "#ff0000";
        for(i in pong.teams.left) {
            var c = pong.teams.left[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }
        cctx.fillStyle = "#00ff00";
        for(i in pong.teams.right) {
            var c = pong.teams.right[i];
            cctx.fillRect(o.left + c.x, o.top + c.y, 5, 5);
        }

        window.requestAnimFrame(pc.render);
    }

    pc.set_ball = function(ball) {
        pong.ball = ball;
    };
    pc.set_teams = function(teams) {
        pong.teams = teams;
    };
    pc.set_paddles = function(paddles) {
        pong.paddles.left = paddles.left;
        pong.paddles.right = paddles.right;
    };

    return pc;
}
