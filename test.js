#!/usr/bin/env node

/**
 * Script de test pour vérifier que l'application fonctionne correctement
 * Usage: npm test
 */

const http = require('http');

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function runTests() {
  console.log('\n🧪 Démarrage des tests...\n');

  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Erreur: ${error.message}`);
      failed++;
    }
  });

  console.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// Tests
test('PORT devrait être défini', () => {
  if (!process.env.PORT && process.env.PORT !== '5000') {
    throw new Error('PORT non défini');
  }
});

test('JWT_SECRET devrait être défini', () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET non défini');
  }
});

test('Structure des dossiers', () => {
  const fs = require('fs');
  const dirs = [
    './src',
    './src/db',
    './src/middleware',
    './src/routes',
    './public',
    './public/js',
    './public/css'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      throw new Error(`Dossier manquant: ${dir}`);
    }
  });
});

test('Fichiers essentiels', () => {
  const fs = require('fs');
  const files = [
    './src/server.js',
    './src/db/database.js',
    './src/db/db.json',
    './src/middleware/auth.js',
    './src/routes/auth.js',
    './src/routes/photos.js',
    './src/routes/likes.js',
    './src/routes/comments.js',
    './public/index.html',
    './public/css/style.css',
    './public/js/app.js',
    './package.json'
  ];

  files.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Fichier manquant: ${file}`);
    }
  });
});

// Exécuter les tests
runTests();
