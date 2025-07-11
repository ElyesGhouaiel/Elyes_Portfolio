# 🚀 Portfolio Moderne - Site Vitrine Ultra Futuriste

Un site vitrine personnel de nouvelle génération, développé avec les technologies les plus récentes pour créer une expérience utilisateur exceptionnelle et futuriste.

![Portfolio Moderne](https://via.placeholder.com/1200x600/8b5cf6/ffffff?text=Portfolio+Moderne+%F0%9F%9A%80)

## ✨ Fonctionnalités

### 🔄 Intégration GitHub Automatique
- **Synchronisation automatique** de vos repositories GitHub publics
- **Détection intelligente** des technologies utilisées
- **Métadonnées enrichies** (stars, forks, langages, topics)
- **Catégorisation automatique** (professionnel/personnel)

### 📁 Gestion de Projets Manuels
- **Interface d'administration sécurisée** avec NextAuth.js
- **Upload de fichiers ZIP** avec validation et sécurité
- **Gestion complète** des projets personnalisés
- **Système de tags et catégories**

### 🎨 Design Futuriste Ultra Moderne
- **Glassmorphism** et effets de transparence
- **Animations 3D** avec Framer Motion
- **Particules interactives** et effets de parallax
- **Navigation flottante** avec micro-interactions
- **Responsive design** mobile-first
- **Dark theme** avec dégradés colorés

### 🔐 Sécurité et Performance
- **Authentification robuste** avec NextAuth.js
- **Protection des routes admin**
- **Validation des fichiers uploadés**
- **Optimisation des performances** (ISR, caching)
- **Base de données SQLite** avec Prisma

## 🛠 Stack Technologique

### Frontend
- **Next.js 14** avec App Router (React Server Components)
- **TypeScript** pour la robustesse du code
- **Tailwind CSS** pour le styling moderne
- **Framer Motion** pour les animations fluides
- **Shadcn/ui** pour les composants UI élégants

### Backend & Base de Données
- **Next.js API Routes** pour les API
- **Prisma ORM** avec SQLite
- **NextAuth.js** pour l'authentification
- **API GitHub** pour la synchronisation

### Design & UX
- **Glassmorphism** et effets visuels avancés
- **Animations et micro-interactions**
- **Design responsive** et accessible
- **Performance optimisée**

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte GitHub (pour l'intégration)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/portfolio-moderne.git
cd portfolio-moderne
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Base de données SQLite
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-sécurisée"

# Email du propriétaire (pour les droits admin)
OWNER_EMAIL="votre-email@exemple.com"

# GitHub API pour récupérer les projets
GITHUB_TOKEN="votre-token-github"
GITHUB_USERNAME="votre-username-github"

# GitHub OAuth (optionnel pour l'authentification)
GITHUB_CLIENT_ID="votre-client-id"
GITHUB_CLIENT_SECRET="votre-client-secret"

# Configuration du site
SITE_NAME="Portfolio Moderne"
SITE_DESCRIPTION="Site vitrine personnel ultra moderne"
SITE_URL="http://localhost:3000"
```

### 4. Initialiser la base de données
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📖 Guide d'utilisation

### Configuration GitHub

1. **Créer un token GitHub** :
   - Allez sur GitHub → Settings → Developer settings → Personal access tokens
   - Créez un token avec les permissions `public_repo`
   - Ajoutez le token dans votre fichier `.env`

2. **Synchroniser vos projets** :
   - Connectez-vous en tant qu'admin sur `/admin`
   - Cliquez sur "Synchroniser GitHub"
   - Vos projets seront automatiquement importés

### Interface d'Administration

L'interface admin (`/admin`) permet de :
- **Gérer vos projets** GitHub et manuels
- **Uploader des projets** via fichiers ZIP
- **Configurer les métadonnées** des projets
- **Voir les statistiques** détaillées

### Personnalisation

1. **Modifier les informations personnelles** dans `src/components/sections/HeroSection.tsx`
2. **Ajuster les couleurs** dans `src/app/globals.css`
3. **Personnaliser les animations** dans les composants Framer Motion

## 🎯 Fonctionnalités Avancées

### Système de Technologies
- **Détection automatique** depuis GitHub
- **Catégorisation intelligente** (frontend, backend, database, etc.)
- **Nuage de technologies interactif**
- **Statistiques d'utilisation**

### Analytics et Statistiques
- **Compteur de projets** en temps réel
- **Statistiques GitHub** (stars, forks)
- **Métriques d'engagement**

### Performance et SEO
- **Optimisation des images** automatique
- **Lazy loading** des composants
- **Meta tags** dynamiques
- **Sitemap** automatique

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start

# Vérification TypeScript
npm run type-check

# Formatage du code
npm run format

# Linting
npm run lint

# Base de données
npx prisma studio     # Interface admin Prisma
npx prisma migrate    # Migrations
npx prisma generate   # Génération du client
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Vercel se charge automatiquement du déploiement

### Autres plateformes
- **Netlify** : Compatible avec le build statique
- **Railway** : Idéal pour les applications full-stack
- **Digital Ocean** : Pour un contrôle total

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Next.js** pour le framework incroyable
- **Vercel** pour l'hébergement et les outils
- **Tailwind CSS** pour le système de design
- **Framer Motion** pour les animations fluides
- **Prisma** pour l'ORM moderne

## 📞 Support

Pour toute question ou support :
- 📧 Email : contact@monportfolio.fr
- 🐙 GitHub Issues : [Ouvrir une issue](https://github.com/votre-username/portfolio-moderne/issues)
- 💬 Discord : [Rejoindre le serveur](https://discord.gg/votre-serveur)

---

**Fait avec ❤️ et beaucoup de ☕ par [Votre Nom](https://github.com/votre-username)**

> "L'innovation distingue le leader du suiveur." - Steve Jobs
