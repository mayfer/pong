function Pong(context) {
    var pong = this;
    this.context = context;

    this.paddle_left = 0;
    this.paddle_right = 0;

    this.paddle_width = 30;
    this.paddle_height = 100;

    this.init = function() {
        $(document).on('mousemove', function(e) {
            var parentOffset = $('canvas').parent().offset(); 
            //or $(this).offset(); if you really just want the current element's offset
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            pong.paddle_left = y;
        });

        return this;
    }

    this.render = function() {
        var ctx = this.context;

        var padding = 30;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(padding, paddle_left - (pong.paddle_height/2), this.paddle_width, this.paddle_height);

        window.requestAnimFrame(this.render);
    }

    return this;
}
