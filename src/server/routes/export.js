var express = require('express');
var router = express.Router();
const cors = require('cors');

const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();


const ServiceAssegnazioni = require('../services/ServiceAssegnazioni');
const serviceAssegnazioni = new ServiceAssegnazioni(dbConfig);

const ServiceAutisti = require('../services/ServiceAutisti');
const serviceAutisti = new ServiceAutisti(dbConfig);


const ServiceEmail = require('../services/ServiceEmail'); // Importa il servizio WhatsApp
const serviceEmail = new ServiceEmail(); // Crea un'istanza di ServicePDF

const XLSX = require('xlsx');
const { Parser } = require('json2csv');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());




// Endpoint per generare un Excel con gli autisti e lo invia per email
router.post('/generate-excel/autisti', async (req, res) => {
  try {
     // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const autisti = await serviceAutisti.getAllAutisti();

    if (!autisti || autisti.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    // Definisci i dati che verranno inseriti nel file Excel
    const data = autisti.map(autista => ({
      'Cognome Autista': autista.cognome,
      'Nome Autista': autista.nome,
      'CodFiscale':autista.codFiscale,
      'Numero Patente':autista.numPatente,
      'Scadenza Patente':autista.scadenzaPatente,
      'Email':autista.email,
      'telefono': autista.telefono

    }));

    // Crea un nuovo workbook
    const wb = XLSX.utils.book_new();

    // Crea un nuovo foglio di lavoro da inserire nel workbook
    const ws = XLSX.utils.json_to_sheet(data);

    // Aggiungi il foglio di lavoro al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Autisti');

    // Scrivi il workbook in un buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Imposta le intestazioni per il download del file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="autisti.xlsx"');

    // Invia il file Excel come risposta
   // res.status(200).send(excelBuffer);

   const firstEntry = autisti[0]; // Supponendo che `data` contenga almeno un elemento
    const { email } = firstEntry; 
    console.log("invio pdf email",email)
    // Invia il PDF via Email
    await serviceEmail.sendFile(email, excelBuffer,"autisti.xlsx");
    // Invia anche una risposta al client
    res.status(200).send('excel generato e inviato tramite Email con successo.');
    
  } catch (error) {
    console.error('Errore nella generazione dell\'Excel:', error);
    res.status(500).send('Errore nella generazione dell\'Excel: ' + error.message);
  }
});


// Endpoint per generare un CSV
router.post('/generate-csv', async (req, res) => {
  try {
    const { idAutista, dataInizio, dataFine } = req.body; // Estrai i dati dal corpo della richiesta

    // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);

    if (!assegnazioni || assegnazioni.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    // Definisci i dati che verranno inseriti nel file CSV
    const data = assegnazioni.map(assegnazione => ({
      'Cognome Autista': assegnazione.cognomeAutista,
      'Nome Autista': assegnazione.nomeAutista,
      'Targa Veicolo': assegnazione.targaVeicolo,
      'Modello Veicolo': assegnazione.modelloVeicolo,
      'Indirizzo Partenza': assegnazione.indirizzoPartenza,
      'Indirizzo Arrivo': assegnazione.indirizzoArrivo,
      'Data Partenza': new Date(assegnazione.dataPartenza).toLocaleString(),
      'Data Arrivo': new Date(assegnazione.dataArrivo).toLocaleString()
    }));

    // Usa json2csv per convertire i dati in formato CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    // Imposta le intestazioni per il download del file CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="assegnazioni.csv"');

    // Invia il CSV come risposta
    res.status(200).send(csv);
    
  } catch (error) {
    console.error('Errore nella generazione del CSV:', error);
    res.status(500).send('Errore nella generazione del CSV: ' + error.message);
  }
});




// Endpoint per generare un Excel con tutti autisti
router.post('/generate-excel/assegnazioniByAutista', async (req, res) => {
  try {
    const { idAutista, dataInizio, dataFine } = req.body; // Estrai i dati dal corpo della richiesta

    // Chiedi a ServiceAssegnazioni di ottenere le assegnazioni filtrate
    const assegnazioni = await serviceAssegnazioni.getAssegnazionebyAutista(idAutista, dataInizio, dataFine);

    if (!assegnazioni || assegnazioni.length === 0) {
      return res.status(404).json({ error: 'Nessuna assegnazione trovata per i filtri forniti' });
    }

    // Definisci i dati che verranno inseriti nel file Excel
    const data = assegnazioni.map(assegnazione => ({
      'Cognome Autista': assegnazione.cognomeAutista,
      'Nome Autista': assegnazione.nomeAutista,
      'Targa Veicolo': assegnazione.targaVeicolo,
      'Modello Veicolo': assegnazione.modelloVeicolo,
      'Indirizzo Partenza': assegnazione.indirizzoPartenza,
      'Indirizzo Arrivo': assegnazione.indirizzoArrivo,
      'Data Partenza': new Date(assegnazione.dataPartenza).toLocaleString(),
      'Data Arrivo': new Date(assegnazione.dataArrivo).toLocaleString()
    }));

    // Crea un nuovo workbook
    const wb = XLSX.utils.book_new();

    // Crea un nuovo foglio di lavoro da inserire nel workbook
    const ws = XLSX.utils.json_to_sheet(data);

    // Aggiungi il foglio di lavoro al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Assegnazioni');

    // Scrivi il workbook in un buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Imposta le intestazioni per il download del file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="assegnazioni.xlsx"');

    // Invia il file Excel come risposta
   // res.status(200).send(excelBuffer);

   const firstEntry = assegnazioni[0]; // Supponendo che `data` contenga almeno un elemento
    const { email } = firstEntry; 
    console.log("invio pdf email",email)
    // Invia il PDF via Email
    await serviceEmail.sendFile(email, excelBuffer,"assegnazioni.xlsx");
    // Invia anche una risposta al client
    res.status(200).send('excel generato e inviato tramite Email con successo.');
    
  } catch (error) {
    console.error('Errore nella generazione dell\'Excel:', error);
    res.status(500).send('Errore nella generazione dell\'Excel: ' + error.message);
  }
});
module.exports = router;
