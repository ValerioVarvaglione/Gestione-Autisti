const PDFDocument = require('pdfkit'); // Importa PDFKit
const { PassThrough } = require('stream');
const axios = require('axios');


class ServicePDF {
    generatePDF(data, res) {
        const doc = new PDFDocument();
        const passThrough = new PassThrough(); // Crea uno stream PassThrough

        // Imposta intestazioni del PDF
        doc.pipe(passThrough); // Collega il PDF a PassThrough

        // Scrittura nel PDF
        const firstEntry = data[0]; // Supponendo che `data` contenga almeno un elemento
        const { cognomeAutista, nomeAutista, targaVeicolo, modelloVeicolo } = firstEntry;

        doc.fontSize(16).text(`Cognome Autista: ${cognomeAutista}`, { align: 'left' });
        doc.text(`Nome Autista: ${nomeAutista}`, { align: 'left' });
        doc.text(`Targa Mezzo: ${targaVeicolo}`, { align: 'left' });
        doc.text(`Modello Mezzo: ${modelloVeicolo}`, { align: 'left' });
        doc.moveDown(3);

        // Impostazione della tabella
        const table = {
            headers: ['Indirizzo Partenza', 'Indirizzo Arrivo', 'Data Partenza', 'Data Arrivo'],
            rows: data.map(entry => [
                entry.indirizzoPartenza,
                entry.indirizzoArrivo,
                entry.dataPartenza.toLocaleString(), // Assicurati che la data sia in formato stringa
                entry.dataArrivo.toLocaleString()
            ])
        };

        this.drawTable(doc, table); // Assicurati di avere un metodo drawTable per disegnare la tabella

        // Footer
        doc.moveDown(20);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, { align: 'center', continued: false });

        // Chiudi il documento PDF
        doc.end();

        return passThrough; // Restituisce lo stream del PDF
    }

  drawTable(doc, table) {
    const { headers, rows } = table;
    const startX = 50; // Posizione di partenza sull'asse X
    const startY = doc.y; // Posizione di partenza sull'asse Y
    const columnWidths = [150, 150, 100, 100]; // Larghezze delle colonne
    const rowHeight = 30; // Altezza delle righe

    // Disegna intestazione
    headers.forEach((header, i) => {
      const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.fillColor('blue').fontSize(14).rect(x, startY, columnWidths[i], rowHeight).fill();
      doc.fillColor('white').fontSize(10).text(header, x + 5, startY + 10, { align: 'center', width: columnWidths[i] - 10 });
    });
    doc.moveDown();
    doc.fillColor('black'); // Ripristina il colore nero per le righe

    // Disegna righe
    let rowY = startY + rowHeight;
    rows.forEach(row => {
      row.forEach((cell, i) => {
        const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, rowY, columnWidths[i], rowHeight).stroke();
        doc.fontSize(10).text(cell, x + 5, rowY + 10, { align: 'center', width: columnWidths[i] - 10 });
      });
      rowY += rowHeight;
    });
  }


generatePDFtest(data, res) {
    const doc = new PDFDocument();
    
    const currentDate = new Date().toLocaleDateString();

    // Imposta le intestazioni per il PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assegnazioni.pdf');

    // Scrittura nel PDF
    // Assumiamo che 'data' sia un array di oggetti che contengono le informazioni per ogni assegnazione
    // In questo caso, utilizzeremo il primo elemento per i dati dell'autista e i veicoli
    const firstEntry = data[0]; // Supponendo che `data` contenga almeno un elemento

    const { cognomeAutista, nomeAutista, targaVeicolo, modelloVeicolo } = firstEntry; // Adatta la proprietà in base ai dati effettivi

    doc.fontSize(16).text(`Cognome Autista: ${cognomeAutista}`, { align: 'left' });
    doc.text(`Nome Autista: ${nomeAutista}`, { align: 'left' });
    doc.text(`Targa Mezzo: ${targaVeicolo}`, { align: 'left' });
    doc.text(`Modello Mezzo: ${modelloVeicolo}`, { align: 'left' });
    doc.moveDown(3);

    // Impostazione della tabella (dati passati come input)
    const table = {
        headers: ['Indirizzo Partenza', 'Indirizzo Arrivo', 'Data Partenza', 'Data Arrivo'],
        rows: data.map(entry => [
            entry.indirizzoPartenza,
            entry.indirizzoArrivo,
            entry.dataPartenza.toLocaleString(), // Assicurati che la data sia in formato stringa
            entry.dataArrivo.toLocaleString()
        ]) // Mappa i dati per ottenere le righe della tabella
    };

    this.drawTable(doc, table); // Assicurati di avere un metodo drawTable per disegnare la tabella

    // Footer
    doc.moveDown(20);
    doc.text(`Data: ${currentDate}`, { align: 'center', continued: false });

    // Pipe il documento PDF nella risposta
    doc.pipe(res);

    // Chiudi il documento
    doc.end();
  }
}


module.exports = ServicePDF; // Esporta la classe
