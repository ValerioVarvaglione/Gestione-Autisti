var express = require('express');
var router = express.Router();

const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


const ServiceAutisti = require('../service/ServiceAutisti');
// Crea un'istanza di ServiceAutisti
const serviceAutisti = new ServiceAutisti(dbConfig);





/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    console.log("get autisti")
    // Ottenimento degli autisti tramite ServiceAutisti
    const autisti = await serviceAutisti.getAllAutisti();
    console.log('Autisti recuperati con successo:', autisti);
    
    // Restituisci i risultati come JSON
    res.json(autisti);
  } catch (err) {
    console.error('Errore durante il recupero degli autisti:', err);
    res.status(500).json({ error: 'Errore durante il recupero degli autisti' });
  }
});

// Chiudi la connessione al termine dell'app
process.on('exit', async () => {
    await serviceAutisti.closeConnection();
});


router.get('/:id', async function(req, res, next) {
  try {
    const id = req.params.id; // Estrai l'id dai parametri dell'URL
    console.log("get autista con id, ",id)
    // Ottenimento degli autisti tramite ServiceAutisti
    const autisti = await serviceAutisti.getAutista(id);
    console.log('Autisti recuperati con successo:', autisti);
    
    // Restituisci i risultati come JSON
    res.json(autisti);
  } catch (err) {
    console.error('Errore durante il recupero degli autisti:', err);
    res.status(500).json({ error: 'Errore durante il recupero degli autisti' });
  }
});

// Endpoint per aggiungere un nuovo autista
router.post('/', async (req, res) => {
  const autistaData = req.body; // Ottieni i dati dell'autista dal corpo della richiesta
  try {
      const result = await serviceAutisti.addAutista(autistaData); // Chiama il servizio per aggiungere l'autista
      res.status(201).json({ message: 'Autista aggiunto con successo!', id: result.insertId }); // Risposta positiva con ID del nuovo autista
  } catch (error) {
      console.error('Errore nell\'aggiunta dell\'autista:', error);
      res.status(500).send('Errore durante l\'aggiunta dell\'autista'); // Gestisci errori
  }
});

/* POST modifica autista. */
router.post('/modifica', async function(req, res, next) {
  const autistaData = req.body; // Ottieni i dati dell'autista dal corpo della richiesta

  // Esegui la modifica dell'autista
  try {
      await serviceAutisti.modificaAutista(autistaData);
      res.status(200).json({ message: 'Autista modificato con successo.' });
  } catch (err) {
      console.error('Errore durante la modifica dell\'autista:', err);
      res.status(500).json({ error: 'Errore durante la modifica dell\'autista.' });
  }
});

/* DELETE cancella autista. */
router.delete('/:id', async function(req, res, next) {
  const { id } = req.params;

  // Esegui la cancellazione dell'autista
  try {
      await serviceAutisti.cancellaAutista(id);
      res.status(200).json({ message: 'Autista cancellato con successo.' });
  } catch (err) {
      console.error('Errore durante la cancellazione dell\'autista:', err);
      res.status(500).json({  message: 'Errore durante la cancellazione dell\'autista.' });
  }
});

module.exports = router;
