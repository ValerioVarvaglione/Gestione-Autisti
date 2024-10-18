const DbConnection2 = require('../db/dbConnection2');
const bcrypt = require('bcrypt');
class ServiceLogin {
    constructor(dbConfig) {
        this.dbConfig = dbConfig; // Salva la configurazione per usarla più tardi
    }

    async getUserByUsername(username) {
        const db = new DbConnection2(this.dbConfig);
        try {
            await db.connect();
    
            // Usa $1 per PostgreSQL invece di ?
            const result = await db.query('SELECT * FROM utenti WHERE username = $1;', [username]);
    
            // Log del risultato per il debug
            console.log('Risultato della query:', result);
    
            // Non è necessario accedere a result[0] perché result è già un array di righe
            if (result.length === 0) {
                console.error('Nessun risultato restituito dalla query');
                return null;
            }
    
            // Restituisci il risultato se trovato, altrimenti null
            return result[0]; // Restituisci il primo utente trovato
        } catch (error) {
            console.error('Errore durante la connessione al database:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
    async  hashString(inputString) {
        const saltRounds = 10; // Numero di round di salting
        try {
            const hashedString = await bcrypt.hash(inputString, saltRounds);
            return hashedString;
        } catch (error) {
            console.error('Errore durante l\'hashing della stringa:', error);
            throw error; // Rilancia l'errore per gestione futura
        }
    }

  }
  
  module.exports = ServiceLogin;
  