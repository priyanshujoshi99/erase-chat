let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
const port = process.env.PORT || 3000;
app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname,'src/index.html'));
});
app.use(express.static('src'));

http.listen(port, function() {
   console.log('listening on:'+port);
});

function sendMessage(msg,name){
    //Broadcast to everyone except the sender
    this.broadcast.emit("recieve_message",msg,name);
}

io.on('connection', function(socket) {
    //When message arrives call sendMessage()
    socket.on("message",sendMessage);
});