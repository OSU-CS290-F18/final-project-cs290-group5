class Messages {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const stmt = `CREATE TABLE IF NOT EXISTS messages (
            ts DATETIME DEFAULT CURRENT_TIMESTAMP,
            message_id INTEGER PRIMARY KEY,
            channel_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            FOREIGN KEY (channel_id)
             REFERENCES channels(channel_id)
             ON UPDATE CASCADE
             ON DELETE NO ACTION,
            FOREIGN KEY (user_id)
             REFERENCES active_users(user_id)
             ON UPDATE CASCADE
             ON DELETE NO ACTION
        );`;

        return this.dao.exec(stmt);
    }

    sendMsg(channel, user, msg) {
        return new Promise((resolve, reject) => {
            // probably can do some cool join shit here idk
            const get_cid = "SELECT channel_id FROM channels WHERE name = ?;";
            const get_uid = "SELECT user_id FROM users WHERE name = ? AND active = true;";
            const insert_msg = "INSERT INTO messages(channel_id, user_id, message) VALUES(?, ?, ?);";

            let cid, uid;

            this.dao.get(get_cid, channel)
            .then((row) => {
                if (!row) reject("didn't get channel id");
                cid = row.channel_id;
                return this.dao.get(get_uid, user);
            })
            .then((row) => {
                if (!row) reject("didn't get user id");
                uid = row.user_id;
                let params = [cid, uid, msg];
                return this.dao.exec(insert_msg, params);
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    getMessages(channel) {
        // flex
        const stmt = "SELECT messages.ts, users.name AS username, message FROM messages INNER JOIN users ON messages.user_id = users.user_id INNER JOIN channels ON messages.channel_id = channels.channel_id WHERE channels.name = ? ORDER BY messages.ts ASC LIMIT 10;"
        let params = [channel];

        return this.dao.all(stmt, params);
    }
}

module.exports = Messages;