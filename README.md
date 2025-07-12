# 🚀 Portfolio Moderne - Elyes

Un portfolio professionnel moderne développé avec **Next.js 14**, **TypeScript**, **Tailwind CSS** et **Framer Motion**. Ce projet inclut un système d'administration complet avec authentification, gestion de projets synchronisés depuis GitHub et upload de projets personnalisés.

## ✨ Fonctionnalités Principales

### 🎨 Interface Utilisateur
- **Design moderne** avec animations fluides (Framer Motion)
- **Système de thème** jour/nuit avec persistance
- **Interface responsive** optimisée pour tous les appareils
- **Navigation flottante** avec effets visuels
- **Sections animées** : Hero, Projets, Technologies, Contact

### 🔐 Système d'Administration
- **Authentification sécurisée** avec NextAuth.js
- **Dashboard admin** avec statistiques en temps réel
- **Gestion des projets** : CRUD complet
- **Synchronisation GitHub** automatique
- **Upload de projets ZIP** avec analyse automatique

### 📦 Gestion des Projets
- **Projets GitHub** : synchronisation automatique via API
- **Projets manuels** : upload de fichiers ZIP
- **Analyse automatique** : détection des technologies, génération de descriptions
- **Aperçu du code** : IDE en ligne avec protection anti-copie
- **Démo interactive** : prévisualisation des projets (en développement)

### 🛡️ Sécurité et Protection
- **Code protégé** : empêche la copie (Ctrl+C, sélection, clic droit)
- **Authentification** : sessions sécurisées
- **Limites d'upload** : configuration centralisée (100MB par défaut)
- **Validation des fichiers** : vérification des types et tailles

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations et transitions
- **Lucide React** - Icônes modernes
- **Radix UI** - Composants accessibles

### Backend
- **Next.js API Routes** - API REST
- **Prisma** - ORM pour la base de données
- **SQLite** - Base de données légère
- **NextAuth.js** - Authentification
- **Adm-zip** - Extraction de fichiers ZIP

### Base de Données
- **SQLite** - Base de données locale
- **Prisma Schema** - Modélisation des données
- **Relations** : Users, Projects, Technologies, ProjectTechnology

## 📁 Structure du Projet

```
Elyes_Portfolio/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── admin/             # Interface d'administration
│   │   ├── api/               # Routes API
│   │   │   ├── auth/          # Authentification
│   │   │   ├── projects/      # Gestion des projets
│   │   │   ├── upload-project/ # Upload de projets ZIP
│   │   │   └── reanalyze-projects/ # Réanalyse des projets
│   │   ├── globals.css        # Styles globaux
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Composants React
│   │   ├── admin/            # Composants d'administration
│   │   ├── sections/         # Sections du portfolio
│   │   ├── ui/               # Composants UI réutilisables
│   │   └── effects/          # Effets visuels
│   ├── lib/                  # Utilitaires et configurations
│   │   ├── prisma.ts         # Client Prisma
│   │   ├── auth.ts           # Configuration auth
│   │   ├── config.ts         # Configuration générale
│   │   └── project-analyzer.ts # Analyse des projets
│   └── types/                # Types TypeScript
├── prisma/                   # Configuration Prisma
│   └── schema.prisma         # Schéma de base de données
├── public/                   # Fichiers statiques
│   └── uploads/              # Fichiers uploadés
└── docs/                     # Documentation
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Elyes_Portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

4. **Configurer les variables d'environnement**
```env
# Base de données
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="votre-secret-ici"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (optionnel)
GITHUB_ID="votre-github-id"
GITHUB_SECRET="votre-github-secret"

# Configuration admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="mot-de-passe-securise"
```

5. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

6. **Créer l'utilisateur admin**
```bash
npm run setup-admin
```

7. **Lancer le serveur de développement**
```bash
npm run dev
```

## 🔧 Configuration

### Limites d'Upload
Les limites d'upload sont configurables dans `src/lib/config.ts` :
- Taille maximale par défaut : 100MB
- Types de fichiers autorisés : ZIP
- Configuration centralisée et modifiable via l'admin

### Thèmes
Le système de thème supporte :
- **Mode clair** : couleurs vives et modernes
- **Mode sombre** : interface élégante et reposante
- **Persistance** : sauvegarde automatique des préférences

### Authentification
- **NextAuth.js** avec sessions sécurisées
- **Provider GitHub** (optionnel)
- **Credentials** pour l'admin
- **Protection des routes** admin

## 📊 Fonctionnalités d'Administration

### Dashboard
- **Statistiques** : nombre de projets, technologies, étoiles GitHub
- **Projets récents** : liste avec actions rapides
- **Synchronisation GitHub** : bouton pour mettre à jour
- **Upload de projets** : interface drag & drop

### Gestion des Projets
- **CRUD complet** : créer, lire, modifier, supprimer
- **Édition en ligne** : modal d'édition
- **Réanalyse** : re-traiter les projets ZIP
- **Aperçu du code** : IDE en ligne protégé

### Analyse Automatique
- **Extraction ZIP** : décompression automatique
- **Détection de technologies** : React, Node.js, Python, etc.
- **Génération de descriptions** : basée sur les technologies
- **Fichiers principaux** : identification automatique

## 🛡️ Sécurité

### Protection du Code
- **Anti-copie** : blocage Ctrl+C, sélection, clic droit
- **Lecture seule** : interface IDE sans téléchargement
- **Badges de protection** : indicateurs visuels

### Authentification
- **Sessions sécurisées** : cookies httpOnly
- **Protection des routes** : middleware d'authentification
- **Validation des données** : vérification côté serveur

## 📈 Performance

### Optimisations
- **Images optimisées** : Next.js Image
- **Code splitting** : chargement à la demande
- **Animations fluides** : Framer Motion
- **Base de données** : requêtes optimisées

### Monitoring
- **Logs détaillés** : suivi des opérations
- **Gestion d'erreurs** : messages informatifs
- **Validation** : vérification des données

## 🔄 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres Plateformes
- **Netlify** : compatible
- **Railway** : support complet
- **Docker** : configuration disponible

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma
npm run db:studio    # Ouvrir Prisma Studio

# Administration
npm run setup-admin  # Créer l'utilisateur admin
npm run seed         # Peupler la base de données

# Utilitaires
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs`
- Vérifier les guides de dépannage

---

**Développé avec ❤️ par Elyes**
