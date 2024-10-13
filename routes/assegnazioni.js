const express = require('express');
const router = express.Router();
const ServiceAssegnazioni = require('../service/ServiceAssegnazioni');
const DbConfig = require('../db/DbConfig');

const dbConfig = new DbConfig().getConfig();
const serviceAssegnazioni = new ServiceAssegnazioni(dbConfig);

// GET tutte le assegnazioni
router.get('/', async function(req, res) {
  try {
    const assegnazioni = await serviceAssegnazioni.getAllAssegnazioni();
    res.json(assegnazioni);
  } catch (error) {
    console.error('Errore durante il recupero delle assegnazioni:', error.message);
    res.status(500).json({ error: 'Errore durante il recupero delle assegnazioni' });
  }
});

// GET assegnazione per ID
router.get('/assegnazioni', async (req, res) => {
  try {
    // Fetch assegnazioni from your database
    const assegnazioni = await serviceAssegnazioni.getAllAssegnazioni();
    res.json(assegnazioni);
  } catch (error) {
    console.error('Error fetching assegnazioni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST inserimento nuova assegnazione
router.post('/', async function(req, res) {
  const { idAutista, idMezzo, dataPartenza, dataArrivo } = req.body;
  
  if (!idAutista || !idMezzo || !dataPartenza || !dataArrivo) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }

  try {
    const insertId = await serviceAssegnazioni.inserisciAssegnazione(req.body);
    res.status(201).json({ message: 'Assegnazione aggiunta con successo!', id: insertId });
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'assegnazione:', error.message);
    res.status(500).json({ error: 'Errore durante l\'inserimento dell\'assegnazione' });
  }
});

// PUT modifica assegnazione esistente
router.put('/modifica', async function(req, res) {
  const assegnazioneData = req.body;
  try {
    await serviceAssegnazioni.modificaAssegnazione(assegnazioneData);
    res.status(200).json({ message: 'Assegnazione modificata con successo.' });
  } catch (error) {
    console.error('Errore durante la modifica dell\'assegnazione:', error.message);
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
    console.error('Errore durante la cancellazione dell\'assegnazione:', error.message);
    res.status(500).json({ error: 'Errore durante la cancellazione dell\'assegnazione.' });
  }
});

// POST per filtrare le assegnazioni per autista
router.post('/filtrateByAutista', async function(req, res) {
  const { idAutista, dataInizio, dataFine } = req.body;

  try {
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);
    
    if (!assegnazioni) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }
    
    res.json(assegnazioni);
  } catch (error) {
    console.error('Errore durante il recupero delle assegnazioni filtrate:', error.message);
    res.status(500).json({ error: 'Errore durante il recupero delle assegnazioni filtrate' });
  }
});

module.exports = router;