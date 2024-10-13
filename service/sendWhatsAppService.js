const axios = require('axios');
const fs = require('fs');

class whatsAppService {
  constructor() {
    
    this.apiUrl = 'https://graph.facebook.com/v20.0//messages'; // URL dell'API di WhatsApp
    this.token = 'EAAME3byGMC0BO0E3Ngr04OdNJxS9q1Fg8dfG39IhbEONINsE8OODr6hvnaQTQYmhYa0ccJ4zGk42FGxSSrDbz1W0BoXF8iBE773mLAWKxi4IZCV2ArDMeLrhNI2vvezFoJZAyrqjBOGRq3AGZAasvQSUChh1TSkUl8fKKTgEGSTZB3FQatVb8KHsMCQZAtNzJ8N1mK0uwzZCvoExVRQHrcIZBJ1'; // Token di accesso
    this.apiUrl2 = ' https://graph.facebook.com/v13.0/'+this.token+'/messages';
  }

  async sendFile(filePath, to) {
    try {
      // Leggi il file
      const file = fs.readFileSync(filePath);
      
      // Crea un FormData per inviare il file
      const data = {
        to: to, // Numero di telefono del destinatario
        type: 'document', // Tipo di file (documento)
        document: {
          link: `data:application/pdf;base64,${file.toString('base64')}`, // Invia il file come base64
        },
      };

      // Invia la richiesta
      await axios.post(this.apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('File inviato con successo');
    } catch (error) {
      console.error('Errore durante l\'invio del file:', error.response ? error.response.data : error.message);
      throw new Error('Errore durante l\'invio del file.');
    }
  }

 // Metodo per inviare il PDF via WhatsApp
 async sendPDFViaWhatsApp(pdfBuffer, recipientPhone) {
  try {
    // Crea un FormData per inviare il file
    const data = {
        to: recipientPhone, // Numero di telefono del destinatario
        type: 'document', // Tipo di file (documento)
        document: {
            link: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`, // Invia il file come base64
        },
    };

    // Invia la richiesta
    const response = await axios.post(this.apiUrl2, data, {
        headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        },
    });

    console.log('File inviato con successo:', response.data);
} catch (error) {
    console.error('Errore durante l\'invio del file:', error.response ? error.response.data : error.message);
    throw new Error('Errore durante l\'invio del file.');
}
}
  
}



module.exports = whatsAppService;
