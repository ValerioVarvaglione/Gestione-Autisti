// DbConfig.js
class DbConfig {
    constructor() {
        this.host = 'localhost';
        this.user = 'root';
        this.password = '1234';
        this.database = 'gestioneAutisti';
    }

    getConfig() {
        return {
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        };
    }
}

module.exports = DbConfig;
