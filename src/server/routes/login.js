// routes/login.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

// Credenziali hardcoded
const hardcodedUser = {
    username: 'admin',
    password: 'password123',
};
const DbConfig = require('../db/DbConfig'); // Importa la configurazione del DB
// Crea un'istanza di DbConfig e ottieni la configurazione del DB
const dbConfig = new DbConfig().getConfig();

const ServiceLogin = require('../services/ServiceLogin');
const serviceLogin = new ServiceLogin(dbConfig);

// Endpoint di login
router.post('/', async (req, res) => {

    const { username, password } = req.body;

    try {
     // Recupera l'utente dal 
     console.log('START');
     const user = await serviceLogin.getUserByUsername(username);
     console.log('user valide ',user);
     if (!user) {
         return res.status(401).json({ message: 'Credenziali non valide' });
     }
     console.log('password ',password +" "+user.password);

     const pwd =  await serviceLogin.hashString(password);
     console.log('pwd ',pwd +" "+user.password);

     // Confronta la password inserita con quella salvata nel database (usando bcrypt)
     const passwordMatch = await bcrypt.compare(password, user.password);

     if (!passwordMatch) {
         return res.status(401).json({ message: 'Credenziali non valide' });
     }else{
        console.log("credenziali valide");
     }

     // Se la password è corretta, crea un token JWT
     const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

     // Rispondi con il token JWT
     res.json({ token });
 } catch (error) {
     console.error('Errore durante il login:', error);
     res.status(500).json({ message: 'Errore del server' });
 }
});

   
module.exports = router;
