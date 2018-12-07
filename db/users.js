class Users {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const stmt = `CREATE TABLE IF NOT EXISTS users (
            ts DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            active BOOLEAN NOT NULL DEFAULT true
        );`;

        return this.dao.exec(stmt);
    }

    addUser(name) {
        const stmt = `INSERT INTO users(name) VALUES(?);`;
        const params = [name];

        return this.dao.exec(stmt, params);
    }

    removeUser(name) {
        const stmt = `UPDATE users SET active = false WHERE name = ? AND active = true;`;
        const params = [name];
        
        return this.dao.exec(stmt, params);
    }

    userExists(name) {
        return new Promise((resolve, reject) => {
            const stmt = `SELECT * FROM users WHERE name = ? AND active = true;`;
            const params = [name];

            this.dao.get(stmt, params)
            .then((row) => {
                if (row) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Users;