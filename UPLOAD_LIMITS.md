# 📁 Configuration des Limites d'Upload

## 🎯 Vue d'ensemble

Votre portfolio permet maintenant d'uploader des fichiers ZIP jusqu'à **100MB par défaut**, mais cette limite peut être facilement modifiée selon vos besoins.

## ⚙️ Comment modifier la limite

### Méthode 1 : Via l'interface d'administration (Recommandée)

1. **Connectez-vous** à votre espace d'administration
2. **Allez dans la section "Configuration Upload"**
3. **Modifiez la valeur** dans le champ "Taille maximale par fichier"
4. **Cliquez sur "Sauvegarder"**

### Méthode 2 : Modification directe du fichier de configuration

Éditez le fichier `src/lib/config.ts` :

```typescript
export const config = {
  upload: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxFileSizeMB: 500,
    allowedTypes: ['.zip', 'application/zip'],
  },
  // ... autres configurations
}
```

## 📏 Limites recommandées

| Usage | Taille recommandée | Explication |
|-------|-------------------|-------------|
| **Petits projets** | 50-100MB | Projets simples, sites web basiques |
| **Projets moyens** | 100-500MB | Applications complètes, projets avec assets |
| **Projets volumineux** | 500MB-1GB | Projets complexes, jeux, applications lourdes |
| **Maximum absolu** | 1GB | Limite technique (attention aux performances) |

## ⚠️ Considérations importantes

### Performance
- **Uploads lents** : Plus le fichier est gros, plus l'upload prendra du temps
- **Espace disque** : Assurez-vous d'avoir suffisamment d'espace sur votre serveur
- **Mémoire serveur** : Les gros fichiers consomment plus de RAM pendant le traitement

### Sécurité
- **Scan antivirus** : Considérez l'ajout d'un scan antivirus pour les gros fichiers
- **Validation** : Vérifiez que les fichiers ZIP ne contiennent que du code sécurisé
- **Backup** : Sauvegardez régulièrement vos projets uploadés

### Optimisation
- **Compression** : Utilisez une compression ZIP optimale
- **Nettoyage** : Supprimez les fichiers inutiles avant l'upload
- **Structure** : Organisez bien vos fichiers dans le ZIP

## 🔧 Configuration avancée

### Variables d'environnement (optionnel)

Vous pouvez aussi définir la limite via une variable d'environnement :

```bash
# Dans votre fichier .env
UPLOAD_MAX_SIZE_MB=500
```

Puis modifiez `src/lib/config.ts` :

```typescript
export const config = {
  upload: {
    maxFileSize: (process.env.UPLOAD_MAX_SIZE_MB || 100) * 1024 * 1024,
    maxFileSizeMB: parseInt(process.env.UPLOAD_MAX_SIZE_MB || '100'),
    allowedTypes: ['.zip', 'application/zip'],
  },
  // ...
}
```

### Limites par type de fichier

Pour ajouter d'autres types de fichiers :

```typescript
export const config = {
  upload: {
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMB: 100,
    allowedTypes: ['.zip', '.rar', '.7z', 'application/zip'],
  },
  // ...
}
```

## 🚀 Redémarrage nécessaire

Après modification de la configuration :

1. **Redémarrez le serveur** : `npm run dev`
2. **Testez l'upload** avec un fichier de la nouvelle taille
3. **Vérifiez les logs** pour s'assurer que tout fonctionne

## 📊 Monitoring

Surveillez l'utilisation de l'espace disque :

```bash
# Vérifier l'espace utilisé par les uploads
du -sh public/uploads/projects/

# Voir les plus gros fichiers
find public/uploads/projects/ -name "*.zip" -exec ls -lh {} \;
```

## 🆘 Dépannage

### Erreur "Fichier trop volumineux"
- Vérifiez que la limite est bien mise à jour
- Redémarrez le serveur
- Vérifiez les logs d'erreur

### Upload qui échoue
- Vérifiez l'espace disque disponible
- Vérifiez les permissions du dossier `public/uploads/`
- Testez avec un fichier plus petit

### Performance lente
- Réduisez la limite si nécessaire
- Optimisez vos fichiers ZIP
- Considérez l'utilisation d'un CDN pour les gros fichiers

---

**💡 Conseil** : Commencez avec une limite de 100-200MB et ajustez selon vos besoins réels ! 