var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  console.log("index");
});

app.get('/stylesheet.css', function(req, res){
  res.sendFile(__dirname + '/stylesheet.css');
  console.log("stylesheet");
});

app.get('/index.js', function(req, res){
  res.sendFile(__dirname + '/index.js');
  console.log("js");
});

app.get('*', function(req,res) {
  res.sendStatus(404);
  console.log("404");
})

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log("received msg:", msg);
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});