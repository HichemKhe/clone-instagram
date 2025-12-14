const express = require('express');
const axios = require('axios');
const { readDB, writeDB, generateId } = require('../db/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Endpoint de récupération des photos avec recherche
router.get('/', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    const page = req.query.page || 1;
    const db = readDB();

    // Sans clé Unsplash, je tombe automatiquement sur les photos locales
    if (!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'your_unsplash_api_key_here') {
      console.log('Utilisation des photos locales (pas de clé API Unsplash)');
      console.log('Query:', query);
      
      let filteredPhotos = db.photos;

      // Je filtre localement si on tape une recherche
      if (query) {
        filteredPhotos = db.photos.filter(photo => 
          photo.description.toLowerCase().includes(query.toLowerCase()) ||
          photo.author.toLowerCase().includes(query.toLowerCase())
        );
      }

      console.log('Photos trouvées:', filteredPhotos.length);

      // J'ajoute les infos likes/commentaires à chaque photo locale
      const photosWithMetadata = filteredPhotos.map(photo => {
        const likes = db.likes.filter(l => l.photoId === photo.id);
        const comments = db.comments.filter(c => c.photoId === photo.id);
        return {
          ...photo,
          likes: likes.length,
          comments: comments.length
        };
      });

      return res.json({ photos: photosWithMetadata, total: photosWithMetadata.length });
    }

    // Sinon je passe sur l'API Unsplash
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: {
        query,
        page,
        per_page: 12,
        client_id: UNSPLASH_API_KEY
      }
    });

    const photosWithMetadata = response.data.results.map(photo => {
      // Je recolle les likes/commentaires locaux sur les résultats Unsplash
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
    console.log('Fallback sur photos locales...');
    
    // Si l'appel Unsplash plante, je renvoie les photos locales
    const db = readDB();
    const query = req.query.q || '';
    
    const filteredPhotos = db.photos.filter(photo => 
      !query || photo.description.toLowerCase().includes(query.toLowerCase())
    );

    const photosWithMetadata = filteredPhotos.map(photo => {
      const likes = db.likes.filter(l => l.photoId === photo.id);
      const comments = db.comments.filter(c => c.photoId === photo.id);
      return {
        ...photo,
        likes: likes.length,
        comments: comments.length
      };
    });

    res.json({ photos: photosWithMetadata, total: photosWithMetadata.length });
  }
});

// Ajout d'une photo perso (réservé aux utilisateurs connectés)
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
