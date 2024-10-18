const DbConnection2 = require('../db/dbConnection2');

class ServiceCorse {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

    // Metodo per inserire una nuova corsa
    async inserisciCorsa(data) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `
                INSERT INTO corse (indirizzoPartenza, indirizzoArrivo, descrizione, cadenza)
                VALUES ($1, $2, $3, $4)
                RETURNING id; -- Restituisci l'ID della corsa inserita
            `;
            const result = await db.query(sql, [
                data.indirizzoPartenza,
                data.indirizzoArrivo,
                data.descrizione,
                data.cadenza
            ]);
            return result[0].id; // Restituisci l'ID della corsa inserita
        } catch (error) {
            console.error('Errore durante l\'inserimento della corsa:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per modificare una corsa esistente
    async modificaCorsa(data) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `
                UPDATE corse
                SET indirizzoPartenza = $1, indirizzoArrivo = $2, descrizione = $3, cadenza = $4
                WHERE id = $5
            `;
            await db.query(sql, [
                data.indirizzoPartenza,
                data.indirizzoArrivo,
                data.descrizione,
                data.cadenza,
                data.id
            ]);
        } catch (error) {
            console.error('Errore durante la modifica della corsa:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per recuperare una corsa tramite ID
    async getCorsa(id) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM corse WHERE id = $1'; // Uso di $1 per PostgreSQL
            const result = await db.query(sql, [id]);
            if (result.length === 0) {
                console.warn(`Nessuna corsa trovata con l'ID: ${id}`);
                return null; // Restituisci null se non è trovata alcuna corsa
            }
            return result[0];
        } catch (error) {
            console.error('Errore nel recupero della corsa:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per recuperare tutte le corse
    async getAllCorse() {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM corse';
            const result = await db.query(sql);
            return result;
        } catch (error) {
            console.error('Errore nel recupero delle corse:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per cancellare una corsa tramite ID
    async cancellaCorsa(id) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'DELETE FROM corse WHERE id = $1'; // Uso di $1 per PostgreSQL
            const result = await db.query(sql, [id]);
            
            // Controllo se la corsa è stata cancellata
            if (result.rowCount === 0) {
                throw new Error(`Nessuna corsa trovata con l'ID: ${id}`); // Lancia un errore se la corsa non esiste
            }
        } catch (error) {
            console.error('Errore durante la cancellazione della corsa:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
}

module.exports = ServiceCorse;
