class Users {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const stmt = `CREATE TABLE active_users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );`;

        return this.dao.exec(stmt);
    }

    addUser(name) {
        const stmt = `INSERT INTO active_users(name) VALUES(?);`;
        const params = [name];

        return this.dao.exec(stmt, params);
    }

    removeUser(name) {
        const stmt = `DELETE FROM active_users WHERE name = ?;`;
        const params = [name];
        
        return this.dao.exec(stmt, params);
    }
}

module.exports = Users;