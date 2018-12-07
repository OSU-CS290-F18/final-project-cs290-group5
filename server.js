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

//Socket.io
io.on('connection', (socket) => {
    // this gets called everytime a new client is connected
    console.log("new socket connection");

    // client requested username check
    socket.on('username available', (username) => {
        if (added) return;

        users.userExists(username)
        .then((available) => {
            if (available) {
                // user doesn't exist, send back all good
                socket.emit("username check ret", true);
                console.log(`${username}: username available`);
            } else {
                // user doesn't exist, send back no beuno
                socket.emit("username check ret", false);
                console.log(`${username}: username unavailable`);
            }
        })
        .catch((err) => {
            console.error("Unable to check if username was available:", err);
            socket.emit("db error", "unable to check if username is available");
        })
    });

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
            socket.emit("db error", "error initializing user");
        });
    });

    // client requested username check
    socket.on('channel available', (channel) => {
        if (added) return;

        if (!channels.channelExists(channel)) {
            // channel doesn't exist, send back all good
            socket.emit("channel check ret", true);
        } else {
            // channel doesn't exist, send back no beuno
            socket.emit("channel check ret", false);
        }
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
            socket.emit("db error", "error adding channel");
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
            socket.emit("db error", "error storing msg");
        });
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
            socket.emit("db error", "error removing user");
        });
    });
});

//get error page
app.get("*", function (req, res, next){
    console.error("sending 404 for", req.url);
    res.status(404);
    res.sendFile(__dirname + '/public/404.html'); //bring to 404 page
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
    http.listen(port, function (err) {
        if (err) {
            throw err;
        }

        console.log("== Server listening on port " + port);
    });
})
.catch((err) => {
    console.error("== Error initalizing database:", JSON.stringify(err));
});