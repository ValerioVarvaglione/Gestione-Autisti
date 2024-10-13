var express = require('express');
var router = express.Router();

const ServiceVeicoli = require('../service/ServiceVeicoli');

const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB

// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


// Crea un'istanza di ServiceAutisti
const serviceVeicoli = new ServiceVeicoli(dbConfig); 

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    // Ottenimento degli autisti tramite ServiceAutisti
    const veicolo = await serviceVeicoli.getAllVeicoli();
    console.log('Autisti recuperati con successo:', veicolo);
    
    // Restituisci i risultati come JSON
    res.json(veicolo);
  } catch (err) {
    console.error('Errore durante il recupero del veicolo:', err);
    res.status(500).json({ error: 'Errore durante il recupero del veicolo' });
  }
});

// Chiudi la connessione al termine dell'app
process.on('exit', async () => {
    await serviceVeicoli.closeConnection();
});




router.get('/:id', async function(req, res, next) {
    try {
      const id = req.params.id; // Estrai l'id dai parametri dell'URL
      console.log("get veicolo con id, ",id)
      // Ottenimento dei veicolii tramite serviceVeicoli
      const veicolo = await serviceVeicoli.getVeicolo(id);
      console.log('veicolo recuperati con successo:', veicolo);
      
      // Restituisci i risultati come JSON
      res.json(veicolo);
    } catch (err) {
      console.error('Errore durante il recupero del veicolo:', err);
      res.status(500).json({ error: 'Errore durante il recupero del veicolo' });
    }
  });

  // Endpoint per aggiungere un nuovo autista
router.post('/', async (req, res) => {
    const data = req.body; // Ottieni i dati del veicolo dal corpo della richiesta
    try {
        const result = await serviceVeicoli.addVeicolo(data); // Chiama il servizio per aggiungere il veicolo
        res.status(201).json({ message: 'Veicolo aggiunto con successo!', id: result.insertId }); // Risposta positiva con ID del nuovo veicolo
    } catch (error) {
        console.error('Errore nell\'aggiunta del veicolo:', error);
        res.status(500).send('Errore durante l\'aggiunta del veicolo'); // Gestisci errori
    }
  });


/* POST modifica autista. */
router.post('/modifica', async function(req, res, next) {
    const veicoloData = req.body;
    console.log(veicoloData);
    try {
      await serviceVeicoli.modifica(veicoloData);
      res.status(200).json({ message: 'Veicolo aggiornato con successo.' });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del veicolo:', error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del veicolo' });
    }
  });

/* DELETE cancella autista. */
router.delete('/:id', async function(req, res, next) {
  const { id } = req.params;

  // Esegui la cancellazione dell'autista
  try {
      await serviceVeicoli.cancellaVeicolo(id);
      res.status(200).json({ message: 'Veicolo cancellato con successo.' });
  } catch (err) {
      console.error('Errore durante la cancellazione dell\'Veicolo:', err);
      res.status(500).json({  message: 'Errore durante la cancellazione dell\'Veicolo.' });
  }
});

module.exports = router;
