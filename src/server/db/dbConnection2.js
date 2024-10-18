const { Pool } = require('pg');

class DbConnection2 {
    constructor(config) {
        // Aggiungi l'opzione SSL alla configurazione per PostgreSQL
        this.config = {
            ...config,
            ssl: {
                rejectUnauthorized: false, // Permette la connessione SSL anche senza certificato verificato
            }
        };
        this.pool = new Pool(this.config); // Usa il pool di connessioni di PostgreSQL
    }

    async connect() {
        // Pool gestisce automaticamente le connessioni, non c'è bisogno di creare manualmente una connessione
        this.connection = await this.pool.connect();
    }

    async query(sql, params) {
        if (!this.connection) {
            throw new Error("Connection not established.");
        }

        try {
            const result = await this.connection.query(sql, params);
            return result.rows; // Restituisce solo le righe del risultato
        } catch (error) {
            console.error('Errore durante l\'esecuzione della query:', error);
            throw error;
        }
    }

    async close() {
        if (this.connection) {
            this.connection.release(); // Rilascia la connessione al pool
            this.connection = null;
        }
    }
}

module.exports = DbConnection2;
