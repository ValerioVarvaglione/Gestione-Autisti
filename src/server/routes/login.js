// routes/login.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Credenziali hardcoded
const hardcodedUser = {
    username: 'admin',
    password: 'password123',
};

// Endpoint di login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Controllo delle credenziali
    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        // Creazione del token JWT
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Rispondi con il token
        res.json({ token });
    } else {
        // Credenziali non valide
        res.status(401).json({ message: 'Credenziali non valide' });
    }
});

module.exports = router;
