# Instagram Clone

Une application web reproduisant les fonctionnalités essentielles d'Instagram, développée avec Node.js, Express.js, HTML, CSS et JavaScript vanilla.

## 🎯 Fonctionnalités

### ✅ Fonctionnalités obligatoires implémentées
- **Flux d'images** : Récupération via l'API Unsplash (clé API requise)
- **Recherche** : Barre de recherche d'images par mot-clé
- **Utilisateurs** : Inscription, connexion, déconnexion avec JWT
- **Likes** : Like/unlike stockés côté serveur
- **Commentaires** : Ajout et suppression de commentaires
- **Front-end** : Grille responsive de type Instagram avec modal détail
- **API interne** : Routes `/api/photos`, `/api/auth`, `/api/likes`, `/api/comments`
- **Base de données** : JSON local (`src/db/db.json`)
- **Git** : Versionning avec branches et commits réguliers

### 🎨 Interface
- Design responsive (mobile, tablette, desktop)
- Modal pour consulter les détails de la photo
- Authentification simplifiée
- Navigation fluide

---

## 🛠️ Technologies

**Backend:**
- Node.js
- Express.js
- JWT (authentification)
- bcryptjs (hachage des mots de passe)
- Axios (requêtes API)

**Frontend:**
- HTML5
- CSS3 (responsive)
- JavaScript vanilla (Fetch API)

**Base de données:**
- JSON local

---

## 📋 Installation

### Prérequis
- Node.js (v14+)
- npm ou yarn
- Une clé API Unsplash (gratuite)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd Projet\ Instagram
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` à la racine avec :
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_in_production
   UNSPLASH_API_KEY=your_unsplash_api_key_here
   NODE_ENV=development
   ```

   **Obtenir une clé Unsplash :**
   1. Aller sur https://unsplash.com/developers
   2. Créer un compte et une application
   3. Copier la clé API dans `.env`

4. **Démarrer le serveur**
   ```bash
   npm start
   ```
   ou en développement avec rechargement automatique :
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   
   Ouvrir http://localhost:5000 dans le navigateur

---

## 📁 Structure du projet

```
Projet Instagram/
├── public/
│   ├── css/
│   │   └── style.css          # Styles (responsive)
│   ├── js/
│   │   └── app.js             # Logique frontend (auth, photos, likes, comments)
│   └── index.html             # Page principale
├── src/
│   ├── db/
│   │   ├── db.json            # Base de données JSON
│   │   └── database.js        # Gestion de la DB
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   ├── routes/
│   │   ├── auth.js            # Routes authentification
│   │   ├── photos.js          # Routes photos
│   │   ├── likes.js           # Routes likes
│   │   └── comments.js        # Routes commentaires
│   └── server.js              # Serveur Express
├── package.json
├── .env                       # Variables d'environnement
├── .gitignore
└── README.md
```

---

## 🚀 Utilisation

### 1. Authentification
- **S'inscrire** : Créer un compte avec username, email et mot de passe
- **Se connecter** : Accès avec email et mot de passe
- **Se déconnecter** : Bouton en haut à droite

### 2. Découvrir des images
- **Recherche** : Taper un mot-clé dans la barre de recherche
- **Grille** : Cliquer sur une image pour voir les détails

### 3. Interagir
- **Liker** : Cliquer sur le bouton ❤️ dans la modal
- **Commenter** : Ajouter un commentaire en bas de la modal
- **Supprimer** : Supprimer vos propres commentaires

---

## 📡 Routes API

### Authentification
```
POST   /api/auth/signup       # Inscription
POST   /api/auth/login        # Connexion
GET    /api/auth/me           # Vérifier l'utilisateur actuel
```

### Photos
```
GET    /api/photos?q=...&page=...   # Récupérer les photos (avec recherche)
POST   /api/photos                   # Ajouter une photo personnalisée (nécessite token)
```

### Likes
```
POST   /api/likes                    # Liker une photo (nécessite token)
DELETE /api/likes/:photoId           # Déliker une photo (nécessite token)
GET    /api/likes/:photoId           # Récupérer le nombre de likes
```

### Commentaires
```
POST   /api/comments                 # Ajouter un commentaire (nécessite token)
GET    /api/comments/:photoId        # Récupérer les commentaires
DELETE /api/comments/:commentId      # Supprimer un commentaire (nécessite token)
```

---

## 🔐 Sécurité

- Mots de passe hachés avec bcryptjs
- Authentification JWT
- Middleware de vérification des tokens
- Contrôle d'accès sur les opérations sensibles

---

## 🧪 Tests

### Test compte de demo
- **Email** : test@example.com
- **Mot de passe** : test

(Le hash du mot de passe est `$2a$10$rn0qAzN2Hc7YzGYnKf5Uve6FfPGqqIQKVT8K7wNZh8N5VzPGQdL4W`)

---

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 Mobile (< 480px)
- 📱 Tablette (480px - 768px)
- 💻 Desktop (> 768px)

---

## 🚢 Déploiement

### Option 1 : Render
1. Créer un compte sur https://render.com
2. Connecter votre repository GitHub
3. Créer un nouveau service Web
4. Configurer les variables d'environnement
5. Déployer

### Option 2 : Railway
1. Créer un compte sur https://railway.app
2. Créer un nouveau projet
3. Connecter GitHub
4. Ajouter les variables d'environnement
5. Déployer automatiquement

### Option 3 : Vercel + Backend séparé
- Frontend : Déployer sur Vercel
- Backend : Déployer sur Render/Railway/Heroku

---

## 🤝 Contribution et travail d'équipe

- Brancher pour chaque fonctionnalité : `git checkout -b feature/nom-de-la-fonction`
- Commits réguliers et explicites
- Pull requests avant fusion sur main
- Code reviews en équipe

---

## ❓ FAQ

**Q: Comment ajouter ma clé API Unsplash ?**
A: Ajouter `UNSPLASH_API_KEY=...` dans le fichier `.env`

**Q: Pourquoi les photos ne se chargent pas ?**
A: Vérifiez :
1. Que la clé API Unsplash est valide
2. Que le serveur est démarré (`npm start`)
3. Que vous êtes connecté
4. Les erreurs dans la console du navigateur

**Q: Comment réinitialiser la base de données ?**
A: Supprimer le contenu de `src/db/db.json` et relancer le serveur

**Q: Puis-je utiliser une autre API d'images ?**
A: Oui ! Modifier `src/routes/photos.js` pour utiliser Pexels, Pixabay ou Picsum à la place

---

## 📝 Notes importantes

- La base de données est **locale en JSON** (pas de MongoDB/SQLite par défaut)
- Pour la production, migrer vers une base de données robuste
- Les images sont stockées sur les serveurs Unsplash (attribution automatique)
- Les limites de l'API Unsplash s'appliquent (50 requêtes/heure sans authentification)

---

## 🎓 Évaluation

Critères de notation :
- **Fonctionnalités** : 40%
- **Code et organisation** : 20%
- **Interface et UX** : 15%
- **Git et travail d'équipe** : 15%
- **Présentation** : 10%

---

## 📞 Support

Pour toute question ou bug, créer une issue dans le repository

Bon développement ! 🚀
