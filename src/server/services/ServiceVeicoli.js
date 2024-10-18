const DbConnection2 = require('../db/dbConnection2');

class ServiceVeicoli {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

    // Metodo per ottenere un veicolo tramite ID
    async getVeicolo(id) {
        console.log("query con id veicolo ", id);
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM veicoli WHERE id = $1'; // Modifica della query per PostgreSQL
            const veicoli = await db.query(sql, [id]);

            if (veicoli.length === 0) {
                console.warn(`Nessun veicolo trovato con l'ID: ${id}`);
                return { message: `Nessun veicolo trovato con l'ID: ${id}` };
            }

            return veicoli[0]; // Restituisce il veicolo trovato
        } catch (error) {
            console.error('Errore nel recupero dei veicoli:', error.message || error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per ottenere tutti i veicoli
    async getAllVeicoli() {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM veicoli';
            const veicoli = await db.query(sql);
            return veicoli;
        } catch (error) {
            console.error('Errore nel recupero dei veicoli:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per aggiungere un veicolo
    async addVeicolo(data) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `
                INSERT INTO veicoli (modello, capienza, targa, scadenzaBollo, scadenzaAssicurazione)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            const result = await db.query(sql, [
                data.modello,
                data.capienza,
                data.targa,
                this.formatDate(data.scadenzaBollo),
                this.formatDate(data.scadenzaAssicurazione)
            ]);

            return result[0].id; // Restituisce l'ID del veicolo aggiunto
        } catch (error) {
            console.error('Errore nell\'aggiunta del veicolo:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per modificare un veicolo
    async modifica(data) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `
                UPDATE veicoli
                SET modello = $1, capienza = $2, targa = $3, scadenzaBollo = $4, scadenzaAssicurazione = $5
                WHERE id = $6
            `;
            await db.query(sql, [
                data.modello,
                data.capienza,
                data.targa,
                this.formatDate(data.scadenzaBollo),
                this.formatDate(data.scadenzaAssicurazione),
                data.id
            ]);

            console.log(`Veicolo con ID ${data.id} modificato con successo.`);
        } catch (error) {
            console.error(`Errore durante la modifica del veicolo con ID ${data.id}:`, error.message);
            console.error(error.stack); // Aggiunge lo stack trace completo per maggiori dettagli
            throw error;
        } finally {
            await db.close();
        }
    }

    // Funzione di utilità per formattare la data in yyyy-MM-dd
    formatDate(date) {
        if (!date) return null; // Gestisce il caso in cui la data sia null o undefined
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Aggiunge zero davanti ai mesi < 10
        const day = String(d.getDate()).padStart(2, '0'); // Aggiunge zero davanti ai giorni < 10
        return `${year}-${month}-${day}`; // Restituisce la data nel formato yyyy-MM-dd
    }

    // Metodo per cancellare un veicolo tramite ID
    async cancellaVeicolo(id) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'DELETE FROM veicoli WHERE id = $1';
            const result = await db.query(sql, [id]);
            
            // Controllo se il veicolo è stato cancellato
            if (result.rowCount === 0) {
                throw new Error(`Nessun veicolo trovato con l'ID: ${id}`); // Lancia un errore se il veicolo non esiste
            }
        } catch (error) {
            console.error('Errore durante la cancellazione del veicolo:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Funzione per ottenere veicoli con assicurazione scaduta
    async getVeicoliConAssicurazioneScaduta() {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `SELECT * FROM veicoli WHERE scadenzaAssicurazione < CURRENT_DATE`; // Uso di CURRENT_DATE per PostgreSQL
            const veicoli = await db.query(sql);
            return veicoli;
        } catch (error) {
            console.error('Errore durante la query del veicolo:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
}

module.exports = ServiceVeicoli;
