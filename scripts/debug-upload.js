const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic du système d\'upload...\n');

// 1. Vérifier la structure des dossiers
console.log('📁 Vérification de la structure des dossiers:');
const publicDir = path.join(__dirname, '..', 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const projectsDir = path.join(uploadsDir, 'projects');

console.log(`- Dossier public: ${fs.existsSync(publicDir) ? '✅ Existe' : '❌ Manquant'}`);
console.log(`- Dossier uploads: ${fs.existsSync(uploadsDir) ? '✅ Existe' : '❌ Manquant'}`);
console.log(`- Dossier projects: ${fs.existsSync(projectsDir) ? '✅ Existe' : '❌ Manquant'}`);

// 2. Créer les dossiers manquants
if (!fs.existsSync(uploadsDir)) {
  console.log('\n📂 Création du dossier uploads...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Dossier uploads créé');
}

if (!fs.existsSync(projectsDir)) {
  console.log('📂 Création du dossier projects...');
  fs.mkdirSync(projectsDir, { recursive: true });
  console.log('✅ Dossier projects créé');
}

// 3. Vérifier les permissions
console.log('\n🔐 Vérification des permissions:');
try {
  const testFile = path.join(projectsDir, 'test.txt');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Permissions d\'écriture OK');
} catch (error) {
  console.log('❌ Erreur de permissions:', error.message);
}

// 4. Vérifier la configuration
console.log('\n⚙️ Vérification de la configuration:');
const configPath = path.join(__dirname, '..', 'src', 'lib', 'config.ts');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const maxSizeMatch = configContent.match(/maxFileSize:\s*(\d+)\s*\*\s*1024\s*\*\s*1024/);
  const maxSizeMBMatch = configContent.match(/maxFileSizeMB:\s*(\d+)/);
  
  if (maxSizeMatch && maxSizeMBMatch) {
    console.log(`✅ Configuration trouvée: ${maxSizeMBMatch[1]}MB`);
  } else {
    console.log('❌ Configuration invalide');
  }
} else {
  console.log('❌ Fichier de configuration manquant');
}

// 5. Vérifier les API routes
console.log('\n🌐 Vérification des API routes:');
const apiRoutes = [
  'src/app/api/upload-project/route.ts',
  'src/app/api/admin/upload-settings/route.ts',
  'src/app/api/projects/[id]/route.ts'
];

apiRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', route);
  console.log(`- ${route}: ${fs.existsSync(routePath) ? '✅ Existe' : '❌ Manquant'}`);
});

// 6. Vérifier les composants
console.log('\n🧩 Vérification des composants:');
const components = [
  'src/components/admin/ProjectUpload.tsx',
  'src/components/admin/UploadSettings.tsx',
  'src/components/admin/AdminDashboard.tsx'
];

components.forEach(component => {
  const componentPath = path.join(__dirname, '..', component);
  console.log(`- ${component}: ${fs.existsSync(componentPath) ? '✅ Existe' : '❌ Manquant'}`);
});

// 7. Vérifier la base de données
console.log('\n🗄️ Vérification de la base de données:');
const prismaDir = path.join(__dirname, '..', 'prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');

if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  if (schemaContent.includes('model Project')) {
    console.log('✅ Schéma Prisma trouvé avec le modèle Project');
  } else {
    console.log('❌ Modèle Project manquant dans le schéma');
  }
} else {
  console.log('❌ Schéma Prisma manquant');
}

console.log('\n🎯 Recommandations:');
console.log('1. Assurez-vous que le serveur Next.js est démarré');
console.log('2. Vérifiez les logs du serveur pour les erreurs');
console.log('3. Testez l\'upload avec un petit fichier ZIP (< 10MB)');
console.log('4. Vérifiez que vous êtes connecté en tant qu\'admin');
console.log('5. Ouvrez les outils de développement du navigateur pour voir les erreurs réseau');

console.log('\n📝 Pour voir les logs en temps réel:');
console.log('npm run dev');
console.log('\n🔧 Pour tester l\'API directement:');
console.log('curl -X POST http://localhost:3000/api/upload-project -F "file=@votre-fichier.zip"'); 