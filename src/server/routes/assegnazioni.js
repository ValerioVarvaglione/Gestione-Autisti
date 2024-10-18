const express = require('express');
const router = express.Router();
const ServiceAssegnazioni = require('../services/ServiceAssegnazioni');


const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


// Crea un'istanza di ServiceAssegnazioni
const serviceAssegnazioni = new ServiceAssegnazioni(dbConfig);

// GET tutte le assegnazioni
router.get('/', async function(req, res) {
  try {
    const assegnazioni = await serviceAssegnazioni.getAllAssegnazioni();
    res.json(assegnazioni);
  } catch (error) {
    console.error('Errore durante il recupero delle assegnazioni:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle assegnazioni' });
  }
});

// GET assegnazione per ID
router.get('/:id', async function(req, res) {
  const id = req.params.id;
  try {
    const assegnazione = await serviceAssegnazioni.getAssegnazione(id);
    if (!assegnazione) {
      return res.status(404).json({ error: 'Assegnazione non trovata' });
    }
    res.json(assegnazione);
  } catch (error) {
    console.error('Errore durante il recupero dell\'assegnazione:', error);
    res.status(500).json({ error: 'Errore durante il recupero dell\'assegnazione' });
  }
});

// POST inserimento nuova assegnazione
router.post('/', async function(req, res) {
  const assegnazioneData = req.body;
  try {
    const insertId = await serviceAssegnazioni.inserisciAssegnazione(assegnazioneData);
    res.status(201).json({ message: 'Assegnazione aggiunta con successo!', id: insertId });
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'assegnazione:', error);
    res.status(500).json({ error: 'Errore durante l\'inserimento dell\'assegnazione' });
  }
});

// PUT modifica assegnazione esistente
router.post('/modifica', async function(req, res, next) {
  const assegnazioneData = req.body;
  try {
    await serviceAssegnazioni.modificaAssegnazione(assegnazioneData);
    res.status(200).json({ message: 'Assegnazione modificata con successo.' });
  } catch (error) {
    console.error('Errore durante la modifica dell\'assegnazione:', error);
    res.status(500).json({ error: 'Errore durante la modifica dell\'assegnazione.' });
  }
});

// DELETE cancella assegnazione per ID
router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  try {
    await serviceAssegnazioni.cancellaAssegnazione(id);
    res.status(200).json({ message: 'Assegnazione cancellata con successo.' });
  } catch (error) {
    console.error('Errore durante la cancellazione dell\'assegnazione:', error);
    res.status(500).json({ error: 'Errore durante la cancellazione dell\'assegnazione.' });
  }
});
router.post('/filtrateByAutista', async function(req, res) {
    const { idAutista, dataInizio, dataFine } = req.body;  // Modifica per ottenere i dati dal corpo della richiesta

    try {
        // Ottieni le assegnazioni filtrate tramite il service
        const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);
        
        if (!assegnazioni) {
            return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
        }
        
        // Rispondi con i dati ottenuti
        res.json(assegnazioni);
    } catch (error) {
        console.error('Errore durante il recupero delle assegnazioni filtrate:', error);
        res.status(500).json({ error: 'Errore durante il recupero delle assegnazioni filtrate' });
    }
});


module.exports = router;
