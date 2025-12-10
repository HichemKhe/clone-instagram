const express = require('express');
const axios = require('axios');
const { readDB, writeDB, generateId } = require('../db/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Récupérer les photos avec recherche
router.get('/', async (req, res) => {
  try {
    const query = req.query.q || 'nature';
    const page = req.query.page || 1;

    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: {
        query,
        page,
        per_page: 12,
        client_id: UNSPLASH_API_KEY
      }
    });

    const db = readDB();
    const photosWithMetadata = response.data.results.map(photo => {
      // Trouver les likes et commentaires locaux
      const likes = db.likes.filter(l => l.photoId === photo.id);
      const comments = db.comments.filter(c => c.photoId === photo.id);
      return {
        id: photo.id,
        src: photo.urls.small,
        src_full: photo.urls.full,
        description: photo.description || photo.alt_description || 'Photo',
        author: photo.user.name,
        authorUsername: photo.user.username,
        authorImage: photo.user.profile_image.small,
        likes: likes.length,
        comments: comments.length,
        createdAt: photo.created_at
      };
    });

    res.json({ photos: photosWithMetadata, total: response.data.total });
  } catch (error) {
    console.error('Erreur API Unsplash:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
  }
});

// Ajouter une photo personnalisée
router.post('/', verifyToken, (req, res) => {
  try {
    const { src, description } = req.body;

    if (!src || !description) {
      return res.status(400).json({ error: 'URL et description requises' });
    }

    const db = readDB();
    const newPhoto = {
      id: generateId('photo'),
      src,
      description,
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    db.photos.push(newPhoto);
    writeDB(db);

    res.status(201).json({ message: 'Photo ajoutée', photo: newPhoto });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
