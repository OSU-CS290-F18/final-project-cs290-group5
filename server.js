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
            console.error("Unable to check if username is available:", err);
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
            socket.broadcast.emit('new user connected', username);

            // send a list of channels
            return channels.getListOfChannels();
        })
        .then((channelList) => {
            console.log(`sending ${username} channel listing:`, channelList);
            for (let i = 0; i < channelList.length; i++) {
                socket.emit("new channel", channelList[i].name);
            }

            added = true;
        })
        .catch((err) => {
            console.error("Error storing new user in database", JSON.stringify(err));
            socket.emit("db error", "error initializing user");
        });
    });

    // client requested channel check
    socket.on('channel available', (channel) => {
        channels.channelExists(channel)
        .then((available) => {
            if (available) {
                // channel doesn't exist, send back all good
                socket.emit("channel check ret", channel, true);
                console.log(`${channel}: channel available`);
            } else {
                // channel doesn't exist, send back all good
                socket.emit("channel check ret", channel, false);
                console.log(`${channel}: channel unavailable`);
            }
        })
        .catch((err) => {
            console.error("Unable to check if channel is available:", err);
            socket.emit("db error", "unable to check if channel is available");
        })
    });

    // user made a new channel, store & broadcast
    socket.on('new channel', (channel) => {
        channels.addChannel(channel)
        .then(() => {
            socket.broadcast.emit('new channel', channel);
        })
        .catch((err) => {
            console.error("Error storing new channel in database", JSON.stringify(err));
            socket.emit("db error", "error adding channel");
        });
    });

    // received a message, store & broadcast
    socket.on('new message', (channel, msg) => {
        if (!msg || msg.length == 0) return;
        messages.sendMsg(channel, socket.username, msg)
        .then(() => {
            console.log(`received msg from ${socket.username} in ${channel}: ${msg}`);
            socket.emit('new message incoming', channel, socket.username, msg);
        })
        .catch((err) => {
            console.error("Error storing msg in database", JSON.stringify(err));
            socket.emit("db error", "error storing msg");
        });
        socket.broadcast.emit('new message incoming', channel, socket.username, msg);
    });

    // client switched channels, send them messages
    socket.on('switched channel', (channel) => {
        console.log(`${socket.username} requested messages for ${channel}`);
        messages.getMessages(channel)
        .then((rows) => {
            console.log(rows);
            socket.emit("old messages", rows);
        })
    })

    // user disconnected, store & broadcast
    socket.on('disconnect', () => {
        if (!socket.username) return;
        users.removeUser(socket.username)
        .then(() => {
            socket.broadcast.emit('user disconnected', username);
            console.log(`user disconnected: ${socket.username}`);
        })
        .catch((err) => {
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

// initalize DB
console.log("== Initalizing database");
users.createTable()
.then(() => {
    return channels.createTable();
})
.then(() => {
    return channels.addChannel("GENERAL");
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