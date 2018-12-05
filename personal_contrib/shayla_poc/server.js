//Global variables
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


//get the files from public folder
app.use(express.static('public'));

app.get("/", function(req, res, next){
    res.status(200);
    res.sendFile(__dirname + '/public/index.html');

});
//get error page
app.get("*", function (req, res, next){
    res.status(404);
    res.sendFile(__dirname + '/public/404.html'); //bring to 404 page
    console.log("404 page called");
});

//grab pictures
// app.get("/public/:userId/:photoId", function(req, res, next){
//     res.status(200);
//     res.sendFile("<html><body><h1>Photo " + req.params.photoId + " by " + req.params.userId + "</h1></body></html>")
// });

//alert when user connects/disconnects to server-
io.on('connection', function(socket){
    var addedUser = false;
    console.log('a user connected');
    
    socket.on('join', function(user){
        console.log(user);
        if (user) return;

        socket.user = user;
        addedUser = true;
        socket.broadcast.emit('new user', {
            user: socket.user
        });
    });

    socket.on('messages', function(data){
        socket.broadcast.emit('messages', {
            user: socket.user,
            message: data
        });
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnected', {
            user: socket.user,
        });
        console.log('user disconnected');
    });
});

//set up server
app.listen(port, function (err) {
    if (err){
        throw err;
    }
    console.log("== Server listening on port " + port);
});