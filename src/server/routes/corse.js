const express = require('express');
const router = express.Router();
const ServiceCorse = require('../services/ServiceCorse');

const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


// Crea un'istanza di CorseService
const serviceCorse = new ServiceCorse(dbConfig);

// GET tutte le corse
router.get('/', async function(req, res) {
  try {
    const corse = await serviceCorse.getAllCorse();
    res.json(corse);
  } catch (error) {
    console.error('Errore durante il recupero delle corse:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle corse' });
  }
});

// GET corsa per ID
router.get('/:id', async function(req, res) {
  const id = req.params.id;
  try {
    const corsa = await serviceCorse.getCorsa(id);
    if (!corsa) {
      return res.status(404).json({ error: 'Corsa non trovata' });
    }
    res.json(corsa);
  } catch (error) {
    console.error('Errore durante il recupero della corsa:', error);
    res.status(500).json({ error: 'Errore durante il recupero della corsa' });
  }
});

// POST inserimento nuova corsa
router.post('/', async function(req, res) {
  const corsaData = req.body;
  try {
    const insertId = await serviceCorse.inserisciCorsa(corsaData);
    res.status(201).json({ message: 'Corsa aggiunta con successo!', id: insertId });
  } catch (error) {
    console.error('Errore durante l\'inserimento della corsa:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento della corsa' });
  }
});

/* POST modifica autista. */
router.post('/modifica', async function(req, res, next) {
  const corsaData = req.body;
  try {
    await serviceCorse.modificaCorsa(corsaData);
    res.status(200).json({ message: 'Corsa modificata con successo.' });
  } catch (error) {
    console.error('Errore durante la modifica della corsa:', error);
    res.status(500).json({ error: 'Errore durante la modifica della corsa.' });
  }
});

// DELETE cancella corsa per ID
router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  try {
    await serviceCorse.cancellaCorsa(id);
    res.status(200).json({ message: 'Corsa cancellata con successo.' });
  } catch (error) {
    console.error('Errore durante la cancellazione della corsa:', error);
    res.status(500).json({ error: 'Errore durante la cancellazione della corsa.' });
  }
});

module.exports = router;
