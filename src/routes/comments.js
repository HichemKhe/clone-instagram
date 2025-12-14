const express = require('express');
const { readDB, writeDB, generateId } = require('../db/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Ajout d'un commentaire
router.post('/', verifyToken, (req, res) => {
  try {
    const { photoId, text } = req.body;

    if (!photoId || !text) {
      return res.status(400).json({ error: 'photoId et texte requis' });
    }

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);

    const newComment = {
      id: generateId('comment'),
      photoId,
      userId: req.user.id,
      username: user.username,
      text,
      createdAt: new Date().toISOString()
    };

    db.comments.push(newComment);
    writeDB(db);

    res.status(201).json({ message: 'Commentaire ajouté', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Liste des commentaires pour une photo
router.get('/:photoId', (req, res) => {
  try {
    const { photoId } = req.params;
    const db = readDB();
    const comments = db.comments.filter(c => c.photoId === photoId);

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Suppression d'un commentaire (proprio uniquement)
router.delete('/:commentId', verifyToken, (req, res) => {
  try {
    const { commentId } = req.params;
    const db = readDB();

    const commentIndex = db.comments.findIndex(c => c.id === commentId && c.userId === req.user.id);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Commentaire non trouvé ou non autorisé' });
    }

    db.comments.splice(commentIndex, 1);
    writeDB(db);

    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
