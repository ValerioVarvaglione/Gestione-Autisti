// ServiceAssegnazioni.js

const DbConnection2 = require('../db/dbConnection2');
class ServiceAssegnazioni {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

 // Metodo per inserire una nuova assegnazione
 async inserisciAssegnazione(data) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();

        // Function to format the date to MySQL compatible format
        const formatDateForMySQL = (date) => {
            return date instanceof Date ? date.toISOString().slice(0, 19).replace('T', ' ') : null;
        };

        // Format the date fields
        const formattedDataPartenza = formatDateForMySQL(data.dataPartenza);
        const formattedDataArrivo = formatDateForMySQL(data.dataArrivo);

        const sql = `
            INSERT INTO assegnazioni (dataPartenza, dataArrivo, idAutista, idMezzo, idTratta, stato, reportId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
            formattedDataPartenza,
            formattedDataArrivo,
            data.idAutista,
            data.idMezzo,
            data.idTratta,
            data.stato,
            data.reportId
        ]);
        return result.insertId;
    } catch (error) {
        console.error('Errore durante l\'inserimento dell\'assegnazione:', error);
        throw error;
    } finally {
        await db.close();
    }
}

  // Metodo per modificare un'assegnazione esistente
  async modificaAssegnazione(data) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();

        // Function to format the date to MySQL compatible format
        const formatDateForMySQL = (date) => {
            return date instanceof Date ? date.toISOString().slice(0, 19).replace('T', ' ') : null;
        };

        // Format the date fields
        const formattedDataPartenza = formatDateForMySQL(data.dataPartenza);
        const formattedDataArrivo = formatDateForMySQL(data.dataArrivo);

        const sql = `
            UPDATE assegnazioni
            SET dataPartenza = ?, dataArrivo = ?, idAutista = ?, idMezzo = ?, idTratta = ?, stato = ?, reportId = ?
            WHERE id = ?
        `;
        await db.query(sql, [
            formattedDataPartenza,
            formattedDataArrivo,
            data.idAutista,
            data.idMezzo,
            data.idTratta,
            data.stato,
            data.reportId,
            data.id
        ]);
    } catch (error) {
        console.error('Errore durante la modifica dell\'assegnazione:', error);
        throw error;
    } finally {
        await db.close();
    }
}


  // get assegnazione idAutista e range
  async getAssegnazionebyAutista(idAutista, dataInizio, dataFine) {
    const db = new DbConnection2(this.dbConfig);
    try {
        await db.connect();
        const sql = `SELECT assegnazioni.*, 
       autista.nome AS nomeAutista, 
       autista.cognome AS cognomeAutista,
       autista.telefono AS telefono,
       autista.email AS email,
       veicoli.modello AS modelloVeicolo, 
       veicoli.targa AS targaVeicolo,
       corse.indirizzoPartenza, 
       corse.indirizzoArrivo, 
       corse.descrizione AS descrizioneCorsa
FROM assegnazioni
LEFT JOIN autista ON assegnazioni.idAutista = autista.id
LEFT JOIN veicoli ON assegnazioni.idMezzo = veicoli.id
LEFT JOIN corse ON assegnazioni.idTratta = corse.id
WHERE assegnazioni.idAutista = ?
AND assegnazioni.dataPartenza >= ?
AND assegnazioni.dataArrivo <= ?
        `;
/**
 * 
            SELECT assegnazioni.*, autista.nome AS nomeAutista, autista.cognome AS cognomeAutista,
                   veicoli.modello AS modelloVeicolo, veicoli.targa AS targaVeicolo,
                   corse.indirizzoPartenza, corse.indirizzoArrivo, corse.descrizione AS descrizioneCorsa
            FROM assegnazioni
            JOIN autista ON assegnazioni.idAutista = autista.id
            JOIN veicoli ON assegnazioni.idMezzo = veicoli.id
            JOIN corse ON assegnazioni.idTratta = corse.id
            WHERE assegnazioni.idAutista = ?
            AND assegnazioni.dataPartenza >= ?
            AND assegnazioni.dataArrivo <= ?
 * 
 */
            
        // Esegui la query con i parametri passati
        const result = await db.query(sql, [idAutista, dataInizio, dataFine]);

        // Se non ci sono risultati, ritorna null
        if (result.length === 0) {
            console.warn(`Nessuna assegnazione trovata per l'autista con ID: ${idAutista} nel periodo specificato.`);
            return null;
        }
        
        // Restituisci i risultati trovati
        return result;
    } catch (error) {
        console.error('Errore nel recupero delle assegnazioni filtrate:', error);
        throw error;
    } finally {
        await db.close();
    }
}



  // Metodo per recuperare un'assegnazione tramite ID
  async getAssegnazione(id) {
    const db = new DbConnection2(this.dbConfig);
    try {
      await db.connect();
      const sql = 'SELECT * FROM assegnazioni WHERE id = ?';
      const result = await db.query(sql, [id]);
      if (result.length === 0) {
        console.warn(`Nessuna assegnazione trovata con l'ID: ${id}`);
        return null;
      }
      return result[0];
    } catch (error) {
      console.error('Errore nel recupero dell\'assegnazione:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  // Metodo per recuperare tutte le assegnazioni
  async getAllAssegnazioni() {
    const db = new DbConnection2(this.dbConfig);
    try {
      await db.connect();
      const sql = 'SELECT * FROM assegnazioni';
      const result = await db.query(sql);
      return result;
    } catch (error) {
      console.error('Errore nel recupero delle assegnazioni:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  // Metodo per cancellare un'assegnazione tramite ID
  async cancellaAssegnazione(id) {
    const db = new DbConnection2(this.dbConfig);
    try {
      await db.connect();
      const sql = 'DELETE FROM assegnazioni WHERE id = ?';
      await db.query(sql, [id]);
    } catch (error) {
      console.error('Errore durante la cancellazione dell\'assegnazione:', error);
      throw error;
    } finally {
      await db.close();
    }
  }
}
module.exports = ServiceAssegnazioni; // Esporta la classe AssegnazioniService
