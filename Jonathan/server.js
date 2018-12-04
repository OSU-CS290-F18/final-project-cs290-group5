//Global variables
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// app.use(function (req, res, next){

// });


//get the files from public folder
app.use(express.static('public'));

//get error page
app.get("*", function (req, res, next){
    res.status(404);
    res.sendFile(__dirname + '/public/style.css'); //bring to 404 page
    console.log("404 page called");
});

//grab pictures
app.get("/public/:userId/:photoId", function(req, res, next){
    res.status(200);
    //res.sendFile()
});

//alert when user connects/disconnects to server
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
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