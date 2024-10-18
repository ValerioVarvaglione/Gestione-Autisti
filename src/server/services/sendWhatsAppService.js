const twilio = require('twilio');



class WhatsAppService {
  constructor() {
    const accountSid = 'ACd7a632776e4f4c9afd98bafd465197ae';
const authToken = '62a0c5a4f1fd0f5ea83c9071991330f3';
const fromPhoneNumber = '+14782366844';
    this.client = twilio(accountSid, authToken); // Inizializza il client Twilio
    this.fromPhoneNumber = fromPhoneNumber; // Il numero WhatsApp fornito da Twilio
  }

  // Metodo per inviare il PDF via WhatsApp utilizzando Twilio
  async sendPDFViaWhatsApp(pdfUrl, recipientPhone) {
    try {
      // Invia il messaggio tramite WhatsApp
      const message = await this.client.messages.create({
        from: `whatsapp:${this.fromPhoneNumber}`, // Numero Twilio WhatsApp
        to: `whatsapp:${recipientPhone}`,         // Numero WhatsApp del destinatario
        body: 'Ecco il documento PDF richiesto.',
        mediaUrl: [pdfUrl], // URL del PDF caricato (deve essere pubblico)
      });

      console.log('PDF inviato con successo:', message.sid);
      return message;
    } catch (error) {
      console.error('Errore durante l\'invio del PDF tramite WhatsApp:', error);
      throw new Error('Errore durante l\'invio del PDF tramite WhatsApp.');
    }
  }
}

module.exports = WhatsAppService;
