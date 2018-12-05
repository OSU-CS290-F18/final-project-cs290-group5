class Messages {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const stmt = `CREATE TABLE messages (
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
        const get_cid = "SELECT FROM channels(channel_id) WHERE name IS ?;";
        const get_uid = "SELECT FROM active_users(user_id) WHERE name IS ?;";
        const insert_msg = "INSERT INTO messages(channel_id, user_id, message) VALUES(?, ?, ?);";

        let cid, uid;

        return this.dao.get(get_cid)
        .then((row) => {
            cid = row.channel_id;

            return this.dao.get(get_uid);
        })
        .then((row) => {
            uid = row.user_id;
            params = [cid, uid, msg];
            return this.dao.exec(insert_msg, params);
        });
    }
}

module.exports = Messages;