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

function new_user(db, username) {
    const stmt = "INSERT INTO active_users(name) VALUES(?);";

    db.run(stmt, username, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`added user: ${username}`);
    });
}

function remove_user(db, username) {
    const stmt = "DELETE FROM active_users WHERE name IS ?;";

    db.run(stmt, username, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`removed user: ${username}`);
    });
}

function new_channel(db, name) {
    const stmt = "INSERT INTO channles(name) VALUES(?);";

    db.run(stmt, username, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`added channel: ${username}`);
    });
}

function send_msg(db, channel, user, msg) {
    let cid, uid;

    let get_cid = "SELECT FROM channels(channel_id) WHERE name IS ?;";
    let get_uid = "SELECT FROM active_users(user_id) WHERE name IS ?;";
    let insert_msg = "INSERT INTO messages(channel_id, user_id, message) VALUES(?, ?, ?);"

    db.get(get_cid, channel, (err, row) => {
        if (err) {
            return console.error(err);
        }
        cid = row.channel_id;
    }).get(get_uid, user, (err, row) => {
        if (err) {
            return console.error(err);
        }
        uid = row.user_id;
    }).run(insert_msg, cid, uid, msg, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log(`inserted msg: ${msg}`);
    });
}

function test(db) {
    new_user(db, "asdf");
}

let db = init_db();
test(db);

// let db_promise = new Promise(init_db).then(() => {  });

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("closing database");
});