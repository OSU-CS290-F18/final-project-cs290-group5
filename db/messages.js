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
        const get_cid = "SELECT channel_id FROM channels WHERE name = ?;";
        const get_uid = "SELECT user_id FROM users WHERE name = ? AND active = true;";
        const insert_msg = "INSERT INTO messages(channel_id, user_id, message) VALUES(?, ?, ?);";

        let cid, uid;

        return this.dao.get(get_cid, channel)
        .then((row) => {
            cid = row.channel_id;
            return this.dao.get(get_uid, user);
        })
        .then((row) => {
            uid = row.user_id;
            let params = [cid, uid, msg];
            return this.dao.exec(insert_msg, params);
        });
    }
}

module.exports = Messages;