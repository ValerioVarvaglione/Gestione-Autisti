// dbConnection2.js
const mysql = require('mysql2/promise'); // Assicurati di usare la versione basata su Promise

class DbConnection2 {
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection(this.config);
        }
    }

    async query(sql, params) {
        if (!this.connection) {
            throw new Error("Connection not established.");
        }
        const [results] = await this.connection.execute(sql, params);
        return results;
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null; // Rendi nullo per evitare problemi futuri
        }
    }
}

module.exports = DbConnection2;
