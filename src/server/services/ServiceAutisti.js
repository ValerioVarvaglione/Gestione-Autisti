const DbConnection2 = require('../db/dbConnection2');

class ServiceAutisti {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

    // Metodo per ottenere un autista per ID
    async getAutista(id) {
        console.log("query con idAutista:", id);
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM autista WHERE id = $1'; // Uso di $1 per PostgreSQL
            const autisti = await db.query(sql, [id]); // Passa l'ID come parametro alla query

            if (autisti.length === 0) {
                console.warn(`Nessun autista trovato con l'ID: ${id}`); // Log di avviso se non viene trovato alcun autista
                return null; // Restituisce null se non è stato trovato alcun autista
            }

            return autisti[0]; // Restituisce l'autista trovato
        } catch (error) {
            console.error('Errore nel recupero dell\'autista:', error.message || error); // Log dettagliato dell'errore
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per ottenere tutti gli autisti
    async getAllAutisti() {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM autista';
            const autisti = await db.query(sql);
            return autisti;
        } catch (error) {
            console.error('Errore nel recupero degli autisti:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per aggiungere un autista
    async addAutista(autistaData) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();

            // Query di inserimento
            const sql = `
                INSERT INTO autista (nome, cognome, codFiscale, numPatente, scadenzaPatente, email, telefono)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id; -- Restituisci l'ID del nuovo autista
            `;

            // Esegue la query con i dati dell'autista
            const result = await db.query(sql, [
                autistaData.nome,
                autistaData.cognome,
                autistaData.codFiscale,
                autistaData.numPatente,
                autistaData.scadenzaPatente,
                autistaData.email,
                autistaData.telefono
            ]);

            return result[0].id; // Restituisce l'ID dell'autista aggiunto
        } catch (error) {
            console.error('Errore nell\'aggiunta dell\'autista:', error);
            throw error; // Rilancia l'errore per la gestione esterna
        } finally {
            await db.close(); // Chiude la connessione al database
        }
    }

    // Metodo per modificare un autista
    async modificaAutista(autistaData) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();

            // Query di aggiornamento
            const sql = `
                UPDATE autista
                SET nome = $1, cognome = $2, codFiscale = $3, numPatente = $4, scadenzaPatente = $5, email = $6, telefono = $7
                WHERE id = $8
            `;
            await db.query(sql, [
                autistaData.nome,
                autistaData.cognome,
                autistaData.codFiscale,
                autistaData.numPatente,
                autistaData.scadenzaPatente,
                autistaData.email,
                autistaData.telefono,
                autistaData.id
            ]);
        } catch (error) {
            console.error('Errore durante la modifica dell\'autista:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per cancellare un autista
    async cancellaAutista(id) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'DELETE FROM autista WHERE id = $1';
            const result = await db.query(sql, [id]);
            
            // Se il numero di righe influenzate è 0, significa che l'autista non esiste
            if (result.rowCount === 0) {
                throw new Error(`Nessun autista trovato con l'ID: ${id}`);
            }
        } catch (error) {
            console.error('Errore durante la cancellazione dell\'autista:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
}

module.exports = ServiceAutisti;
