//Global variables
const express = require ('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

//DB imports/vars
const DAO = require('./db/sqlite_dao');
const Users = require('./db/users');
const Channels = require('./db/channels');
const Messages = require('./db/messages');
const dao = new DAO('test.sqlite3');
const users = new Users(dao);
const channels = new Channels(dao);
const messages = new Messages(dao);

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

//Socket.io
io.on('connection', (socket) => {
    // this gets called everytime a new client is connected

    // user connected, store & broadcast
    var added = false;
    socket.on('new user', (username) => {
        // don't duplicate
        if (added) return;

        users.addUser(username)
        .then(() => {
            socket.username = username;
            socket.broadcast.emit('new user connected', {
                username: socket.username
            });
            added = true;
        })
        .catch((err) => {
            console.error("Error storing new user in database", JSON.stringify(err));
        })
    });

    // user made a new channel, store & broadcast
    socket.on('new channel', (channel) => {
        channels.addChannel(channel)
        .then(() => {
            socket.broadcast.emit('new channel', {
                channel: channel
            });
        })
        .catch((err) => {
            console.error("Error storing new channel in database", JSON.stringify(err));
        });
    });

    // received a message, store & broadcast
    socket.on('new message', (channel, msg) => {
        messages.sendMsg(channel, socket.username, msg)
        .then(() => {
            console.log(`received msg from ${socket.username}`)
            socket.broadcast.emit('new message', {
                channel: channel,
                username: socket.username,
                msg: msg
            });
        })
        .catch((err) => {
            console.error("Error storing msg in database", JSON.stringify(err));
        })
    });

    // user disconnected, store & broadcast
    socket.on('disconnect', () => {
        users.removeUser(socket.username)
        .then(() => {
            socket.broadcast.emit('user disconnected', {
                username: socket.username
            });
        })
        .catch(() => {
            console.error("Error removing user in database", JSON.stringify(err));
        })
    });
});


console.log("== Initalizing database");
users.createTable()
.then(() => {
    return channels.createTable();        
})
.then(() => {
    return messages.createTable();
})
.then(() => {
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }

        console.log("== Server listening on port " + port);
    });
})
.catch((err) => {
    console.error("== Error initalizing database:", JSON.stringify(err));
});