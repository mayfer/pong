(function(pong){

    pong.padding = 10;
    pong.midline_width = 4;

    pong.settings = {
        height: 400,
        width: 600,
    }

    pong.paddle = {
        left: 0,
        right: 120,
        width: 10,
        height: 100,
    };

    
    pong.ball = {
        x: pong.settings.width/2,
        y: pong.settings.height/2,
        dx: 3,
        dy: 3,
        size: 10,
        half: 5,
    }

    pong.teams = {
        left: {},
        right: {},
    };

    pong.reset_ball = function() {
        pong.ball = {
            x: pong.settings.width/2,
            y: pong.settings.height/2,
            dx: 3,
            dy: 3,
            size: 10,
            half: 5,
        }
    }

    pong.calculate_ball = function() {
        var s = pong.settings;

        var boundary = {
            left: pong.padding + pong.paddle.width,
            right: pong.settings.width - pong.padding - pong.paddle.width,
            top: 0,
            bottom: pong.settings.height,
        }

        if(pong.ball.x - pong.ball.half < boundary.left) {
            if(pong.ball.y - pong.ball.half > pong.paddle.left - pong.paddle.height/2
            && pong.ball.y + pong.ball.half < pong.paddle.left + pong.paddle.height/2) {
                pong.ball.dx = Math.abs(pong.ball.dx);
            }
            if(pong.ball.x < 0) {
                pong.reset_ball();
            }
        }
        if(pong.ball.x + pong.ball.half > boundary.right) {
            if(pong.ball.y - pong.ball.half > pong.paddle.right - pong.paddle.height/2
            && pong.ball.y + pong.ball.half < pong.paddle.right + pong.paddle.height/2) {
                pong.ball.dx = -Math.abs(pong.ball.dx);
            }
            if(pong.ball.x > s.width) {
                pong.reset_ball();
            }
        }
        if(pong.ball.y - pong.ball.half < boundary.top || pong.ball.y + pong.ball.half > boundary.bottom) {
            pong.ball.dy = -pong.ball.dy;
        }

        pong.ball.x += pong.ball.dx;
        pong.ball.y += pong.ball.dy;
    }

})(typeof pong === 'undefined'? this['mymodule']={}: pong);
