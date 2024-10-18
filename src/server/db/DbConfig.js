// DbConfig.js
class DbConfig {
    constructor() {
        this.host = 'dpg-cs9685dds78s73c9brv0-a.frankfurt-postgres.render.com';
        this.user = 'root';
        this.password = 'w7wlI23f6tyqglgrxtUDPT1NFdIr2ooW';
        this.database = 'gestioneautisti';
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
