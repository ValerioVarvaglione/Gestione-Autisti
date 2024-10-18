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

            // Function to format the date to PostgreSQL compatible format
            const formatDateForPostgres = (date) => {
                return date instanceof Date ? date.toISOString() : null; // ISO 8601 format
            };

            // Format the date fields
            const formattedDataPartenza = formatDateForPostgres(data.dataPartenza);
            const formattedDataArrivo = formatDateForPostgres(data.dataArrivo);

            const sql = `
                INSERT INTO assegnazioni (dataPartenza, dataArrivo, idAutista, idMezzo, idTratta, stato, reportId)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
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
            return result[0].id; // Restituisci l'ID dell'assegnazione inserita
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

            // Function to format the date to PostgreSQL compatible format
            const formatDateForPostgres = (date) => {
                return date instanceof Date ? date.toISOString() : null; // ISO 8601 format
            };

            // Format the date fields
            const formattedDataPartenza = formatDateForPostgres(data.dataPartenza);
            const formattedDataArrivo = formatDateForPostgres(data.dataArrivo);

            const sql = `
                UPDATE assegnazioni
                SET dataPartenza = $1, dataArrivo = $2, idAutista = $3, idMezzo = $4, idTratta = $5, stato = $6, reportId = $7
                WHERE id = $8
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

    // Get assegnazione by idAutista and date range
    async getAssegnazionebyAutista(idAutista, dataInizio, dataFine) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
            const sql = `
                SELECT assegnazioni.*, 
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
                WHERE assegnazioni.idAutista = $1
                AND assegnazioni.dataPartenza >= $2
                AND assegnazioni.dataArrivo <= $3
            `;
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
            const sql = 'SELECT * FROM assegnazioni WHERE id = $1';
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
            const sql = `
                SELECT assegnazioni.*, 
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
            `;
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
            const sql = 'DELETE FROM assegnazioni WHERE id = $1';
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
