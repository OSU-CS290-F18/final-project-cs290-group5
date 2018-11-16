const sqlite3 = require('sqlite3').verbose();

function create_channels_table(db) {
    const stmt = `CREATE TABLE channels (
        channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );`

    db.run(stmt, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("created channels table");
    })
};

function create_users_table(db) {
    const stmt = `CREATE TABLE active_users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );`

    db.run(stmt, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("created active users table");
    })
};

function create_messages_table(db) {
    const stmt = `CREATE TABLE messages (
        message_id INTEGER PRIMARY KEY,
        channel_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        FOREIGN KEY (channel_id)
         REFERENCES channels(channel_id)
         ON UPDATE CASCADE
         ON DELETE NO ACTION,
        FOREIGN KEY (user_id) REFERENCES active_users(user_id)
         ON UPDATE CASCADE
         ON DELETE NO ACTION
    );`

    db.run(stmt, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("created messages table");
    })
};

function init_db() {
    let db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            return console.error(err.message)
        }
        console.log("opened in-memory database");
    });

    create_channels_table(db);
    create_users_table(db);
    create_messages_table(db);

    return db;
}

let db = init_db();

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("closing database");
})