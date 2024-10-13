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
          VALUES (?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
          data.indirizzoPartenza,
          data.indirizzoArrivo,
          data.descrizione,
          data.cadenza
        ]);
        return result.insertId;
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
          SET indirizzoPartenza = ?, indirizzoArrivo = ?, descrizione = ?, cadenza = ?
          WHERE id = ?
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
        const sql = 'SELECT * FROM corse WHERE id = ?';
        const result = await db.query(sql, [id]);
        if (result.length === 0) {
          console.warn(`Nessuna corsa trovata con l'ID: ${id}`);
          return null;
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
        const sql = 'DELETE FROM corse WHERE id = ?';
        await db.query(sql, [id]);
      } catch (error) {
        console.error('Errore durante la cancellazione della corsa:', error);
        throw error;
      } finally {
        await db.close();
      }
    }
  }
  
  module.exports = ServiceCorse;
  