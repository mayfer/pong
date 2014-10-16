var connect = require('connect');
var serveStatic = require('serve-static');
var io = require('socket.io')(http);
connect().use(serveStatic(__dirname)).listen(8080);

io.on('connection', function(socket){
  console.log('a user connected');
});
