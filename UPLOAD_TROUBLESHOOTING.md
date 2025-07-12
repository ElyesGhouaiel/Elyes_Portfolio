# 🔧 Guide de Dépannage - Upload de Projets

## 🚨 Problème : "Rien ne se passe" lors de l'upload

### ✅ **Solutions vérifiées :**

1. **✅ Dossiers créés** : Les dossiers `public/uploads/projects/` ont été créés automatiquement
2. **✅ Configuration OK** : Limite fixée à 1000MB (1GB)
3. **✅ Fichier de test créé** : `scripts/test-project.zip` (0.68 KB)

---

## 🔍 **Étapes de diagnostic :**

### 1. **Vérifier que le serveur fonctionne**
```bash
# Le serveur doit être démarré
npm run dev
```

**Attendu** : `Ready - started server on 0.0.0.0:3000`

### 2. **Vérifier l'authentification**
- Allez sur `http://localhost:3000/admin`
- Connectez-vous avec vos identifiants admin
- Vérifiez que vous voyez le dashboard

### 3. **Ouvrir les outils de développement**
- **F12** → Onglet **Console**
- **F12** → Onglet **Network**
- Essayez d'uploader un fichier
- Regardez les logs dans la console

### 4. **Tester avec le fichier de test**
- Utilisez le fichier `scripts/test-project.zip`
- Il fait seulement 0.68 KB, donc pas de problème de taille

---

## 🐛 **Problèmes courants et solutions :**

### **Problème 1 : "Erreur 401 - Non autorisé"**
```
❌ Erreur d'upload: 401 - Accès non autorisé
```

**Solution :**
- Vérifiez que vous êtes connecté en tant qu'admin
- Rafraîchissez la page et reconnectez-vous
- Vérifiez que la session n'a pas expiré

### **Problème 2 : "Erreur 413 - Payload Too Large"**
```
❌ Erreur d'upload: 413 - Payload Too Large
```

**Solution :**
- Réduisez la taille du fichier
- Vérifiez la configuration Next.js
- Ajoutez dans `next.config.ts` :
```typescript
export default {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  api: {
    bodyParser: {
      sizeLimit: '1000mb'
    }
  }
}
```

### **Problème 3 : "Erreur 500 - Erreur serveur"**
```
❌ Erreur d'upload: 500 - Erreur lors de l'upload du projet
```

**Solution :**
- Vérifiez les logs du serveur dans le terminal
- Vérifiez que la base de données fonctionne
- Vérifiez les permissions des dossiers

### **Problème 4 : "Aucune erreur visible"**
```
✅ Upload réussi mais rien n'apparaît
```

**Solution :**
- Vérifiez que la liste se rafraîchit automatiquement
- Cliquez sur le bouton "Rafraîchir" dans l'admin
- Vérifiez la base de données directement

---

## 🔧 **Tests manuels :**

### **Test 1 : API directe**
```bash
# Test avec curl (remplacez par votre token de session)
curl -X POST http://localhost:3000/api/upload-project \
  -F "file=@scripts/test-project.zip" \
  -H "Cookie: next-auth.session-token=VOTRE_TOKEN"
```

### **Test 2 : Vérifier la base de données**
```bash
# Ouvrir Prisma Studio
npx prisma studio
```
Puis vérifiez la table `Project`

### **Test 3 : Vérifier les fichiers uploadés**
```bash
# Lister les fichiers uploadés
ls -la public/uploads/projects/
```

---

## 📊 **Logs à surveiller :**

### **Logs du serveur (terminal) :**
```
🚀 Début de l'upload de projet...
🔐 Vérification de l'authentification...
✅ Authentification OK
📁 Fichier reçu: test-project.zip (696 bytes)
🔍 Validation du fichier...
✅ Validation OK
📂 Vérification du dossier uploads...
✅ Dossier uploads existe déjà
💾 Sauvegarde du fichier...
✅ Fichier sauvegardé: /path/to/file
🗄️ Création du projet dans la base de données...
✅ Projet créé avec succès: test-project (ID: xxx)
```

### **Logs du navigateur (Console F12) :**
```
🚀 Début de l'upload... 1 fichier(s)
📤 Upload de: test-project.zip (696 bytes)
📥 Réponse reçue: 200 OK
✅ Upload réussi: {success: true, ...}
```

---

## 🚀 **Solution rapide :**

1. **Redémarrez le serveur** :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

2. **Testez avec le fichier de test** :
   - Utilisez `scripts/test-project.zip`
   - Ouvrez les outils de développement (F12)
   - Surveillez les logs

3. **Si ça ne marche toujours pas** :
   - Vérifiez que vous êtes bien connecté admin
   - Essayez de vous reconnecter
   - Vérifiez les logs d'erreur

---

## 📞 **Si le problème persiste :**

1. **Copiez les logs d'erreur** du terminal et de la console
2. **Décrivez exactement** ce qui se passe
3. **Indiquez** si vous voyez des erreurs spécifiques

---

## 🎯 **Vérifications finales :**

- [ ] Serveur démarré sur `http://localhost:3000`
- [ ] Connecté en tant qu'admin
- [ ] Fichier ZIP valide (< 1000MB)
- [ ] Outils de développement ouverts (F12)
- [ ] Logs surveillés dans le terminal et la console
- [ ] Dossiers `public/uploads/projects/` existent
- [ ] Base de données accessible

**💡 Conseil** : Commencez toujours par tester avec le petit fichier `test-project.zip` ! 