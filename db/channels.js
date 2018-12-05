class Channels {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const stmt = `CREATE TABLE IF NOT EXISTS channels (
            ts DATETIME DEFAULT CURRENT_TIMESTAMP,
            channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );`;

        return this.dao.exec(stmt);
    }

    addChannel(name) {
        const stmt = `INSERT INTO channels(name) VALUES(?);`;
        const params = [name];

        return this.dao.exec(stmt, params);
    }
}

module.exports = Channels;