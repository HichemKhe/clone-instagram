require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const photosRoutes = require('./routes/photos');
const likesRoutes = require('./routes/likes');
const commentsRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares que j'utilise partout
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Mes routes d'API
app.use('/api/auth', authRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);

// Pour le frontend, je renvoie toujours index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Catch-all d'erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
