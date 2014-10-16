function Pong(context, socket) {
    var pong = this;
    this.context = context;
    this.socket = socket;

    this.paddle_left = 0;
    this.paddle_right = 120;

    this.padding = 10;
    this.paddle_width = 10;
    this.paddle_height = 100;

    this.midline_width = 4;

    this.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('canvas').parent().offset(); 
            //or $(this).offset(); if you really just want the current element's offset
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var effective_y = Math.max(0, Math.min(pong.context.height, y));

            pong.paddle_left = effective_y;
            socket.emit('cursor', y);
        });

        return this;
    }

    this.render = function() {
        var ctx = this.context;

        ctx.clearRect(0, 0, ctx.width, ctx.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pong.padding, pong.paddle_left - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);
        ctx.fillRect(ctx.width - pong.padding - this.paddle_width, pong.paddle_right - (pong.paddle_height/2), pong.paddle_width, pong.paddle_height);

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(ctx.width/2-this.midline_width/2, 0, this.midline_width, ctx.height);

        window.requestAnimFrame(this.render);
    }

    return this;
}
