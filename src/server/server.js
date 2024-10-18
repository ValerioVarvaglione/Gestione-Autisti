// src/server/server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');

// Middleware per gestire le richieste JSON
app.use(express.json({ limit: '50mb' }));

// Importa i router
const corseRouter = require('./routes/corse');
const assegnazioniRouter = require('./routes/assegnazioni');
const autistiRouter = require('./routes/autisti');

const exportRouter = require('./routes/export');
const loginRouter = require('./routes/login');
const veicoliRouter = require('./routes/veicoli');

// Usa i router
app.use('/api/corse', corseRouter);       // Endpoint per il test sotto /api/test
app.use('/api/assegnazioni', assegnazioniRouter); // Endpoint per i veicoli sotto /api/veicoli
app.use('/api/autisti', autistiRouter); // Endpoint per gli autisti sotto /api/autisti

app.use('/api/export', exportRouter); // Endpoint per gli autisti sotto /api/autisti
app.use('/api/login', loginRouter); // Endpoint per gli autisti sotto /api/autisti
app.use('/api/veicoli', veicoliRouter); // Endpoint per gli autisti sotto /api/autisti



// Servire la build di React in produzione
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
  });
}

// Avvio del server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
