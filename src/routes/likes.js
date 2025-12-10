const express = require('express');
const { readDB, writeDB, generateId } = require('../db/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Liker une photo
router.post('/', verifyToken, (req, res) => {
  try {
    const { photoId } = req.body;

    if (!photoId) {
      return res.status(400).json({ error: 'photoId requis' });
    }

    const db = readDB();

    // Vérifier si le like existe déjà
    const existingLike = db.likes.find(l => l.photoId === photoId && l.userId === req.user.id);
    
    if (existingLike) {
      return res.status(409).json({ error: 'Vous avez déjà liké cette photo' });
    }

    // Ajouter le like
    const newLike = {
      id: generateId('like'),
      photoId,
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    db.likes.push(newLike);
    writeDB(db);

    res.status(201).json({ message: 'Photo likée', like: newLike });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Déliker une photo
router.delete('/:photoId', verifyToken, (req, res) => {
  try {
    const { photoId } = req.params;
    const db = readDB();

    // Trouver et supprimer le like
    const likeIndex = db.likes.findIndex(l => l.photoId === photoId && l.userId === req.user.id);

    if (likeIndex === -1) {
      return res.status(404).json({ error: 'Like non trouvé' });
    }

    db.likes.splice(likeIndex, 1);
    writeDB(db);

    res.json({ message: 'Like supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les likes d'une photo
router.get('/:photoId', (req, res) => {
  try {
    const { photoId } = req.params;
    const db = readDB();
    const likes = db.likes.filter(l => l.photoId === photoId);

    res.json({ likes: likes.length });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
