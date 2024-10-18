// ServiceVeicoli.js
const DbConnection2 = require('../db/dbConnection2');

class ServiceVeicoli {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }


// Metodo per ottenere i veicoli
async getVeicolo(id) {
    console.log("query con id veicolo ",id)
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();
        const sql = 'SELECT * FROM veicoli WHERE id = ?'; // Modifica della query per includere la clausola WHERE
        const veicoli = await db.query(sql, [id]); // Passa l'ID come parametro alla query

        if (veicoli.length === 0) {
            console.warn(`Nessun veicolo trovato con l'ID: ${id}`); // Log di avviso se non viene trovato alcun veicolo
            return { message: `Nessun veicolo trovato con l'ID: ${id}` }; // Restituisce un messaggio specifico se non è stato trovato alcun veicolo
        }

       return veicoli[0]; // Restituisce il veicolo trovato
    } catch (error) {
        console.error('Errore nel recupero dei veicoli:', error.message || error); // Log dettagliato dell'errore
        throw error;
    } finally {
        await db.close();
    }
}

// Metodo per ottenere i veicoli
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


 // Metodo per aggiungere un autista

 async addVeicolo(data) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();

        // Query di inserimento
        const sql = `
            INSERT INTO veicoli (modello, capienza, targa, scadenzaBollo, scadenzaAssicurazione)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Esegue la query con i dati dell'autista
        const result = await db.query(sql, [
            data.modello,
            data.capienza,
            data.targa,
            data.scadenzaBollo,
            data.scadenzaAssicurazione
        ]);

        return result; // Restituisce il risultato dell'operazione di inserimento
    } catch (error) {
        console.error('Errore nell\'aggiunta dell\'veicolo:', error);
        throw error; // Rilancia l'errore per la gestione esterna
    } finally {
        await db.close(); // Chiude la connessione al database
    }
}

// Metodo per modificare un autista
async modifica(data) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();

        // Formattazione delle date
        const scadenzaBolloFormatted = this.formatDate(data.scadenzaBollo);
        const scadenzaAssicurazioneFormatted = this.formatDate(data.scadenzaAssicurazione);

        // Assumiamo che tu stia aggiornando tutti i campi forniti
        const sql = `
            UPDATE veicoli
            SET modello = ?, capienza = ?, targa = ?, scadenzaBollo = ?, scadenzaAssicurazione = ?
            WHERE id = ?
        `;
        await db.query(sql, 
            [
                data.modello,
                data.capienza,
                data.targa,
                scadenzaBolloFormatted,
                scadenzaAssicurazioneFormatted,
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

async cancellaVeicolo(id) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();
        const sql = 'DELETE FROM veicoli WHERE id = ?';
        await db.query(sql, [id]);
    } catch (error) {
        console.error('Errore durante la cancellazione del veicolo:', error);
        throw error;
    } finally {
        await db.close();
    }
}


// Funzione per ottenere veicoli con assicurazione scaduta
async getVeicoliConAssicurazioneScaduta()  {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();
        const sql = `SELECT * FROM veicoli WHERE scadenzaAssicurazione < CURDATE()`;
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
