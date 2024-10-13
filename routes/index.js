var express = require('express');
var router = express.Router();
const cors = require('cors');
const WhatsAppService = require('../service/sendWhatsAppService'); // Importa il servizio WhatsApp
const whatsAppService = new WhatsAppService(); // Crea un'istanza di ServicePDF

const ServiceEmail = require('../service/ServiceEmail'); // Importa il servizio WhatsApp
const serviceEmail = new ServiceEmail(); // Crea un'istanza di ServicePDF


const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


const ServiceAssegnazioni = require('../service/ServiceAssegnazioni');
const serviceAssegnazioni = new ServiceAssegnazioni(dbConfig);

const ServicePDF = require('../service/ServicePDF'); // Importa la classe ServicePDF
const servicePDF = new ServicePDF(); // Crea un'istanza di ServicePDF



const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint per generare un PDF
router.post('/generate-pdfSendWA', async (req, res) => {

  try {
    const { idAutista, dataInizio, dataFine } = req.body; // Estrai i dati dal corpo della richiesta

    // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);

    if (!assegnazioni || assegnazioni.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    console.log("dati recuperati",assegnazioni);
    // Chiedi a ServicePDF di generare il PDF con le assegnazioni trovate
    const pdfBuffer =   servicePDF.generatePDF(assegnazioni, res);

    console.log("pdf creato");
    const firstEntry = assegnazioni[0]; // Supponendo che `data` contenga almeno un elemento
    const { telefono } = firstEntry; 

    console.log("invio pdf al nummero",telefono)
     // Invia il PDF via WhatsApp
     await whatsAppService.sendPDFViaWhatsApp(pdfBuffer, telefono);

     // Invia anche una risposta al client
     res.status(200).send('PDF generato e inviato tramite WhatsApp con successo.');
  } catch (error) {
    console.error('Errore nella generazione del PDF:', error); // Log dettagliato dell'errore
    res.status(500).send('Errore nella generazione del PDF: ' + error.message);
  }
});



// Endpoint per generare un PDF
router.post('/generate-pdfSendEmail', async (req, res) => {

  try {
    const { idAutista, dataInizio, dataFine } = req.body; // Estrai i dati dal corpo della richiesta

    // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);

    if (!assegnazioni || assegnazioni.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    console.log("dati recuperati",assegnazioni);
    // Chiedi a ServicePDF di generare il PDF con le assegnazioni trovate
    const pdfBuffer =   servicePDF.generatePDF(assegnazioni, res);

    console.log("pdf creato");
    const firstEntry = assegnazioni[0]; // Supponendo che `data` contenga almeno un elemento
    const { email } = firstEntry; 

    console.log("invio pdf email",email)
     // Invia il PDF via Email
     await serviceEmail.sendPDF(email, pdfBuffer);
     // Invia anche una risposta al client
     res.status(200).send('PDF generato e inviato tramite Email con successo.');
  } catch (error) {
    console.error('Errore nella generazione del PDF:', error); // Log dettagliato dell'errore
    res.status(500).send('Errore nella generazione del PDF: ' + error.message);
  }
});


// Controller REST POST per generare un PDF 
router.post('/generate-pdf', async (req, res) => {
  try {
    const { idAutista, dataInizio, dataFine } = req.body; // Estrai i dati dal corpo della richiesta

    // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);

    if (!assegnazioni || assegnazioni.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    // Chiedi a ServicePDF di generare il PDF con le assegnazioni trovate
    servicePDF.generatePDF(assegnazioni, res);
  } catch (error) {
    console.error('Errore nella generazione del PDF:', error); // Log dettagliato dell'errore
    res.status(500).send('Errore nella generazione del PDF: ' + error.message);
  }
});

// Controller REST GET per generare un PDF
router.post('/test', (req, res) => {
  try {
    const requestData = req.body;

    // Chiedi a ServicePDF di generare il PDF
    servicePDF.generatePDF(requestData,res);
  } catch (error) {
    res.status(500).send('Errore nella generazione del PDF: ' + error.message);
  }
});

// Endpoint per generare un PDF


router.get('/test1', (req, res) => {
  try {
    // Chiedi a ServicePDF di generare il PDF
    servicePDF.generatePDFtest(res);
  } catch (error) {
    res.status(500).send('Errore nella generazione del PDF: ' + error.message);
  }
});



module.exports = router;
