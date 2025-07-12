const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('📦 Création d\'un fichier ZIP de test...');

// Créer un dossier temporaire avec des fichiers de test
const testDir = path.join(__dirname, 'test-project');
const testZipPath = path.join(__dirname, 'test-project.zip');

// Créer le dossier de test
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Créer quelques fichiers de test
const testFiles = [
  { name: 'index.html', content: '<!DOCTYPE html><html><head><title>Test Project</title></head><body><h1>Test Project</h1></body></html>' },
  { name: 'style.css', content: 'body { font-family: Arial, sans-serif; margin: 20px; }' },
  { name: 'script.js', content: 'console.log("Hello from test project!");' },
  { name: 'README.md', content: '# Test Project\n\nCeci est un projet de test pour vérifier l\'upload.' }
];

// Écrire les fichiers
testFiles.forEach(file => {
  fs.writeFileSync(path.join(testDir, file.name), file.content);
  console.log(`✅ Fichier créé: ${file.name}`);
});

// Créer le ZIP
const output = fs.createWriteStream(testZipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const size = archive.pointer();
  console.log(`✅ Fichier ZIP créé: ${testZipPath}`);
  console.log(`📊 Taille: ${(size / 1024).toFixed(2)} KB`);
  
  // Nettoyer le dossier temporaire
  fs.rmSync(testDir, { recursive: true, force: true });
  console.log('🧹 Dossier temporaire supprimé');
  
  console.log('\n🎯 Pour tester l\'upload:');
  console.log('1. Allez sur http://localhost:3000/admin');
  console.log('2. Connectez-vous en tant qu\'admin');
  console.log('3. Utilisez le fichier test-project.zip pour tester');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(testDir, false);
archive.finalize(); 
 