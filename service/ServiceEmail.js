const nodemailer = require('nodemailer');

class ServiceEmail {
    constructor() {
        // Configura il trasportatore (modifica con i tuoi dettagli)
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Puoi utilizzare un altro servizio email
            auth: {
                user: 'ida.fricon@gmail.com', // La tua email
                pass: 'xblu sfvp lcmt gdiq' // La tua password
            }
        });
    }

    async sendPDF(email, pdfBuffer) {
        // Configura il messaggio email
        const mailOptions = {
            from: 'gestioneautisti3@gmail.com', // Mittente
            to: email, // Destinatario
            subject: 'Ecco il tuo PDF',
            text: 'In allegato trovi il PDF richiesto.',
            attachments: [
                {
                    filename: 'assegnazioni.pdf', // Nome del file
                    content: pdfBuffer, // Contenuto del file PDF
                    contentType: 'application/pdf' // Tipo di contenuto
                }
            ]
        };

  
        // Invia l'email
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email inviata con successo:', info.response);
        } catch (error) {
            console.error('Errore durante l\'invio dell\'email:', error);
            throw new Error('Errore durante l\'invio dell\'email.');
        }
    }

    async sendFile(email, pdfBuffer,filename) {
        // Configura il messaggio email
        const mailOptions = {
            from: 'gestioneautisti3@gmail.com', // Mittente
            to: email, // Destinatario
            subject: 'Ecco il tuo File',
            text: 'In allegato trovi il file richiesto.',
            attachments: [
                {
                    filename: filename, // Nome del file
                    content: pdfBuffer, // Contenuto del file PDF
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Tipo di contenuto
                }
            ]
        };
            // Invia l'email
            try {
                const info = await this.transporter.sendMail(mailOptions);
                console.log('Email inviata con successo:', info.response);
            } catch (error) {
                console.error('Errore durante l\'invio dell\'email:', error);
                throw new Error('Errore durante l\'invio dell\'email.');
            }
        }
}

module.exports = ServiceEmail;
