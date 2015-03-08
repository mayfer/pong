(function(pong){
    pong.last_timestamp = Date.now();

    pong.padding = 10;
    pong.midline_width = 4;

    pong.settings = {
        height: 400,
        width: 600,
    }

    pong.paddles = {
        left: 0,
        right: 120,
        width: 10,
        height: 100,
    };

    
    pong.ball = {
        x: pong.settings.width/2,
        y: pong.settings.height/2,
        dx: 5,
        dy: 5,
        size: 10,
        half: 5,
    }

    pong.teams = {
        left: {},
        right: {},
    };

    pong.callbacks = {
        sync: function() {},
    };

    pong.reset_ball = function() {
        pong.last_timestamp = Date.now();
        pong.ball = {
            x: pong.settings.width/2,
            y: pong.settings.height/2,
            dx: 1,
            dy: 1,
            size: 10,
            half: 5,
        }
    }

    pong.calculate_ball = function() {
        var s = pong.settings;

        var boundary = {
            left: pong.padding + pong.paddles.width,
            right: pong.settings.width - pong.padding - pong.paddles.width,
            top: 0,
            bottom: pong.settings.height,
        }

        if(pong.ball.x - pong.ball.half < boundary.left) {
            if(pong.ball.y + pong.ball.half > pong.paddles.left - pong.paddles.height/2
            && pong.ball.y - pong.ball.half < pong.paddles.left + pong.paddles.height/2) {
                pong.ball.dx = Math.abs(pong.ball.dx);
                pong.callbacks.sync();
            }
            if(pong.ball.x < 0) {
                pong.reset_ball();
                pong.callbacks.sync();
            }
        } else if(pong.ball.x + pong.ball.half > boundary.right) {
            if(pong.ball.y + pong.ball.half > pong.paddles.right - pong.paddles.height/2
            && pong.ball.y - pong.ball.half < pong.paddles.right + pong.paddles.height/2) {
                pong.ball.dx = -Math.abs(pong.ball.dx);
                pong.callbacks.sync();
            }
            if(pong.ball.x > s.width) {
                pong.reset_ball();
                pong.callbacks.sync();
            }
        }
        if(pong.ball.y - pong.ball.half < boundary.top) {
            pong.ball.dy = Math.abs(pong.ball.dy);
            pong.callbacks.sync();
        } else if(pong.ball.y + pong.ball.half > boundary.bottom) {
            pong.ball.dy = -Math.abs(pong.ball.dy);
            pong.callbacks.sync();
        }

        var current_timestamp = Date.now();
        var diff = (current_timestamp - pong.last_timestamp) / 10;

        pong.ball.x += (pong.ball.dx * diff);
        pong.ball.y += (pong.ball.dy * diff);

        pong.last_timestamp = current_timestamp;

    }

})(typeof pong === 'undefined'? this['pong']={}: pong);
