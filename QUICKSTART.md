# 🚀 Guide de démarrage rapide - Instagram Clone

## ✅ Projet complètement configuré !

Votre application Instagram Clone est prête à être utilisée. Voici comment démarrer :

### 1️⃣ Obtenir une clé API Unsplash

**IMPORTANT** : Vous DEVEZ ajouter une clé API Unsplash pour que l'application fonctionne !

1. Aller sur https://unsplash.com/developers
2. Cliquer sur "Create an app"
3. Accepter les conditions
4. Remplir le formulaire (Application name, etc.)
5. Copier votre "Access Key"
6. Ouvrir le fichier `.env` dans ce dossier
7. Remplacer `your_unsplash_api_key_here` par votre clé

Exemple du fichier `.env` :
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
UNSPLASH_API_KEY=votre_cle_ici_123456789
NODE_ENV=development
```

### 2️⃣ Démarrer le serveur

Ouvrir un terminal dans ce dossier et exécuter :

```bash
npm start
```

Vous devriez voir :
```
🚀 Serveur démarré sur http://localhost:5000
```

### 3️⃣ Accéder à l'application

Ouvrir http://localhost:5000 dans votre navigateur

### 4️⃣ Tester l'application

**Compte de demo :**
- Email: `test@example.com`
- Mot de passe: `test`

OU créer un nouveau compte.

---

## 📁 Structure du projet créée

```
Projet Instagram/
├── public/                 # Frontend (HTML, CSS, JS)
│   ├── index.html         # Page principale
│   ├── css/style.css      # Styles responsive
│   └── js/app.js          # Logique frontend
├── src/                   # Backend
│   ├── server.js          # Serveur Express
│   ├── db/
│   │   ├── db.json        # Base de données JSON
│   │   └── database.js    # Gestion DB
│   ├── middleware/
│   │   └── auth.js        # Vérification JWT
│   └── routes/            # Routes API
│       ├── auth.js        # Authentification
│       ├── photos.js      # Photos (Unsplash)
│       ├── likes.js       # Likes
│       └── comments.js    # Commentaires
├── package.json           # Dépendances
├── .env                   # Variables d'environnement
├── README.md              # Documentation complète
└── .gitignore
```

---

## 🎯 Fonctionnalités implémentées

✅ Inscription / Connexion / Déconnexion
✅ Flux d'images (Unsplash)
✅ Recherche d'images par mot-clé
✅ Likes/Unlikes
✅ Commentaires
✅ Interface responsive (mobile, tablette, desktop)
✅ Base de données JSON locale
✅ API REST complète
✅ Authentification JWT
✅ Git versionning

---

## 🔧 Commandes disponibles

```bash
# Démarrer le serveur (production)
npm start

# Démarrer en développement (avec auto-reload)
npm run dev

# Lancer les tests
npm test
```

---

## 📡 Points d'accès API

Quand le serveur est en marche (http://localhost:5000) :

**Authentification :**
- `POST /api/auth/signup` - S'inscrire
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Utilisateur actuel

**Photos :**
- `GET /api/photos?q=nature&page=1` - Récupérer photos

**Likes :**
- `POST /api/likes` - Liker une photo
- `DELETE /api/likes/:photoId` - Déliker

**Commentaires :**
- `POST /api/comments` - Ajouter un commentaire
- `GET /api/comments/:photoId` - Récupérer commentaires
- `DELETE /api/comments/:commentId` - Supprimer

---

## 🚢 Déploiement (optionnel)

Pour mettre en ligne :

### Option 1: Render
1. Créer compte sur render.com
2. Connecter GitHub
3. New Web Service
4. Configurer variables d'environnement
5. Déployer

### Option 2: Railway
1. railway.app
2. New Project
3. GitHub
4. Déployer

---

## 💡 Conseils

1. **IMPORTANT** : Ajouter votre clé Unsplash dans `.env` AVANT de démarrer
2. Modifier `JWT_SECRET` en production
3. Pour ajouter plus de fonctionnalités, éditer les fichiers dans `src/routes/`
4. Le frontend utilise Fetch API (pas besoin d'axios côté client)
5. La DB JSON peut être remplacée par MongoDB/SQLite plus tard

---

## ❓ Problèmes courants

**Les photos ne se chargent pas :**
- Vérifier que la clé Unsplash est dans `.env`
- Vérifier que le serveur est démarré
- Chercher les erreurs dans la console du navigateur (F12)

**Erreur "Connection refused" :**
- Vérifier que le serveur est démarré (`npm start`)
- Vérifier le port 5000 (peut être en utilisation)

**Erreur "Token invalide" :**
- Se reconnecter
- Réinitialiser le navigateur (Ctrl+Shift+Del cookies)

---

## 🎓 Pour la présentation

Montrez:
1. L'interface responsive
2. L'authentification (signup/login)
3. La recherche d'images
4. Les likes et commentaires
5. La base de données JSON
6. L'historique Git

---

**Bon développement ! 🎉**

Des questions ? Consulter le [README.md](README.md) complet.
