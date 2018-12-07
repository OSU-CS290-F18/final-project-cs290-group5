const sqlite3 = require('sqlite3');

class DAO {
    constructor(fp) {
        this.db = new sqlite3.Database(fp, (err) => {
            if (err) {
                console.error("Failed to open database", err);
            } else {
                console.error("Successfully opened database");
            }
        });
    }

    exec(stmt, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(stmt, params, (err) => {
                if (err) {
                    console.error(`(DAO.exec) Error on SQL query execute: ${stmt}`);
                    console.error(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    get(stmt, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(stmt, params, (err, result) => {
                if (err) {
                    console.error(`(DAO.get) Error on SQL query execute: ${stmt}`);
                    console.error(err);
                    reject(err);
                } else {
                    // console.log("(DAO.get) Received data:", result);
                    resolve(result);
                }
            });
        });
    }
    
    all(stmt, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(stmt, params, (err, rows) => {
                if (err) {
                    console.error(`(DAO.all) Error on SQL query execute: ${stmt}`);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = DAO;