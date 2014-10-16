function Pong(context) {
    this.context = context;

    this.paddle_left = 0;
    this.paddle_right = 0;

    this.paddle_width = 30;
    this.paddle_height = 100;

    this.init = function() {
        
    }

    this.render = function() {
        var ctx = this.context;

        var padding = 30;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(padding, padding + paddle_left, this.paddle_width, this.paddle_height);

        console.log(ctx);
        // window.requestAnimFrame(this.render);
    }

    return this;
}
