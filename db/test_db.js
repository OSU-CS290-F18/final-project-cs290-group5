const DAO = require('./sqlite_dao');
const Users = require('./users');
const Channels = require('./channels');
const Messages = require('./messages');

async function test() {
    const dao = new DAO('./test.sqlite3')
    const users = new Users(dao);
    const channels = new Channels(dao);
    const messages = new Messages(dao);

    await users.createTable()
    .then(() => {
        return channels.createTable();        
    })
    .then(() => {
        return messages.createTable();
    })
    .then(() => {
        return users.addUser("user1");
    })
    .then(() => {
        return channels.addChannel("my_channel");
    })
    .then(() => {
        return messages.sendMsg("my_channel", "user1", "test message 1234");
    })
    .then(() => {
        return users.removeUser("user1");
    })
    .then(() => {
        return users.addUser("user2");
    })
    .then(() => {
        return new Promise((resolve, reject) => {
            if (users.userExists());
        });
    })
}

test();