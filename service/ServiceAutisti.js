// ServiceAutisti.js
const DbConnection2 = require('../db/dbConnection2');

class ServiceAutisti {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

    // Metodo per ottenere gli autisti
    async getAutista(id) {
        console.log("query con idAutista ",id)
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = 'SELECT * FROM autista WHERE id = ?'; // Modifica della query per includere la clausola WHERE
            const autisti = await db.query(sql, [id]); // Passa l'ID come parametro alla query

            if (autisti.length === 0) {
                console.warn(`Nessun autista trovato con l'ID: ${id}`); // Log di avviso se non viene trovato alcun autista
                return { message: `Nessun autista trovato con l'ID: ${id}` }; // Restituisce un messaggio specifico se non è stato trovato alcun autista
            }

           return autisti[0]; // Restituisce l'autista trovato
        } catch (error) {
            console.error('Errore nel recupero degli autisti:', error.message || error); // Log dettagliato dell'errore
            throw error;
        } finally {
            await db.close();
        }
    }

    // Metodo per ottenere gli autisti
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
                VALUES (?, ?, ?, ?, ?, ?, ?)
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
    
            return result; // Restituisce il risultato dell'operazione di inserimento
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

        // Assumiamo che tu stia aggiornando tutti i campi forniti
        const sql = `
            UPDATE autista
            SET nome = ?, cognome = ?, codFiscale = ?, numPatente = ?, scadenzaPatente = ?, email = ?, telefono = ?
            WHERE id = ?
        `;
        await db.query(sql, 
            [autistaData.nome,
                autistaData.cognome,
                autistaData.codFiscale,
                autistaData.numPatente,
                autistaData.scadenzaPatente,
                autistaData.email,
                autistaData.telefono,
                autistaData.id]);
    } catch (error) {
        console.error('Errore durante la modifica dell\'autista:', error);
        throw error;
    } finally {
        await db.close();
    }
}

async cancellaAutista(id) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();
        const sql = 'DELETE FROM autista WHERE id = ?';
        await db.query(sql, [id]);
    } catch (error) {
        console.error('Errore durante la cancellazione dell\'autista:', error);
        throw error;
    } finally {
        await db.close();
    }
}



}
module.exports = ServiceAutisti;
