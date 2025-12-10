const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB, writeDB, generateId } = require('../db/database');
const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const db = readDB();

    // Vérifier si l'utilisateur existe déjà
    if (db.users.some(u => u.email === email || u.username === username)) {
      return res.status(409).json({ error: 'Utilisateur déjà existant' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = {
      id: generateId('user'),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Générer token JWT
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'Inscription réussie', token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérifier le mot de passe
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);

    res.json({ message: 'Connexion réussie', token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérifier le token
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = readDB();
    const user = db.users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(403).json({ error: 'Token invalide' });
  }
});

module.exports = router;
