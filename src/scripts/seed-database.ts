import { PrismaClient } from '@prisma/client';
import { GitHubService } from '../lib/github';

const prisma = new PrismaClient();
const githubService = new GitHubService();

async function seedDatabase() {
  console.log('🌱 Démarrage du peuplement de la base de données...');

  try {
    // 1. Créer les technologies de base
    console.log('📦 Ajout des technologies...');
    
    const technologies = [
      // Frontend
      { name: 'React', category: 'frontend', icon: '⚛️', color: '#61dafb' },
      { name: 'Next.js', category: 'frontend', icon: '🔺', color: '#000000' },
      { name: 'TypeScript', category: 'language', icon: '🔷', color: '#3178c6' },
      { name: 'JavaScript', category: 'language', icon: '🟨', color: '#f7df1e' },
      { name: 'Vue.js', category: 'frontend', icon: '💚', color: '#4fc08d' },
      { name: 'Angular', category: 'frontend', icon: '🅰️', color: '#dd1b16' },
      { name: 'HTML', category: 'frontend', icon: '🔶', color: '#e34f26' },
      { name: 'CSS', category: 'frontend', icon: '🎨', color: '#1572b6' },
      { name: 'Tailwind CSS', category: 'frontend', icon: '🌊', color: '#06b6d4' },
      { name: 'SCSS', category: 'frontend', icon: '💅', color: '#cf649a' },
      
      // Backend
      { name: 'Node.js', category: 'backend', icon: '💚', color: '#339933' },
      { name: 'Python', category: 'language', icon: '🐍', color: '#3776ab' },
      { name: 'Express.js', category: 'backend', icon: '🚀', color: '#000000' },
      { name: 'Django', category: 'backend', icon: '🎸', color: '#092e20' },
      { name: 'FastAPI', category: 'backend', icon: '⚡', color: '#009688' },
      { name: 'PHP', category: 'language', icon: '🐘', color: '#777bb4' },
      { name: 'Laravel', category: 'backend', icon: '🔥', color: '#ff2d20' },
      { name: 'C++', category: 'language', icon: '⚙️', color: '#00599c' },
      { name: 'Java', category: 'language', icon: '☕', color: '#007396' },
      { name: 'C#', category: 'language', icon: '🔵', color: '#239120' },
      
      // Database
      { name: 'PostgreSQL', category: 'database', icon: '🐘', color: '#336791' },
      { name: 'MySQL', category: 'database', icon: '🐬', color: '#4479a1' },
      { name: 'MongoDB', category: 'database', icon: '🍃', color: '#47a248' },
      { name: 'SQLite', category: 'database', icon: '📁', color: '#003b57' },
      { name: 'Redis', category: 'database', icon: '🔴', color: '#dc382d' },
      { name: 'Prisma', category: 'database', icon: '🔷', color: '#2d3748' },
      
      // DevOps & Tools
      { name: 'Docker', category: 'tool', icon: '🐳', color: '#2496ed' },
      { name: 'Git', category: 'tool', icon: '🌿', color: '#f05032' },
      { name: 'AWS', category: 'tool', icon: '☁️', color: '#ff9900' },
      { name: 'Firebase', category: 'tool', icon: '🔥', color: '#ffca28' },
      { name: 'Vercel', category: 'tool', icon: '▲', color: '#000000' },
      { name: 'Netlify', category: 'tool', icon: '🌐', color: '#00ad9f' },
      { name: 'Linux', category: 'tool', icon: '🐧', color: '#fcc624' },
      { name: 'Figma', category: 'tool', icon: '🎨', color: '#f24e1e' },
      
      // Mobile
      { name: 'React Native', category: 'mobile', icon: '📱', color: '#61dafb' },
      { name: 'Flutter', category: 'mobile', icon: '🦋', color: '#02569b' },
      { name: 'Kotlin', category: 'language', icon: '🤖', color: '#7f52ff' },
      { name: 'Swift', category: 'language', icon: '🍎', color: '#fa7343' },
    ];

    for (const tech of technologies) {
      await prisma.technology.upsert({
        where: { name: tech.name },
        update: tech,
        create: tech,
      });
    }

    // 2. Synchroniser les projets GitHub
    console.log('🔄 Synchronisation des projets GitHub...');
    await githubService.syncProjects();

    // 3. Ajouter des projets de démonstration si nécessaire
    console.log('📚 Ajout de projets de démonstration...');
    
    const demoProjects = [
      {
        title: 'Portfolio Moderne',
        description: 'Site vitrine personnel ultra moderne avec Next.js 14 et animations 3D',
        content: 'Portfolio personnel développé avec Next.js 14, TypeScript, Tailwind CSS et Framer Motion. Comprend une intégration GitHub automatique, un système d\'administration et des animations 3D avancées.',
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        githubUrl: 'https://github.com/ElyesGhouaiel/Elyes_Portfolio',
        liveUrl: 'https://elyesghouaiel.vercel.app',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'React', 'Framer Motion']
      },
      {
        title: 'Application E-commerce',
        description: 'Plateforme e-commerce complète avec panier et paiement sécurisé',
        content: 'Application web e-commerce développée avec React et Node.js. Fonctionnalités : gestion des produits, panier, commandes, paiements Stripe, dashboard administrateur.',
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Stripe API']
      },
      {
        title: 'API REST Moderne',
        description: 'API RESTful avec authentification JWT et documentation Swagger',
        content: 'API REST développée avec Node.js, Express et MongoDB. Authentification JWT, validation des données, documentation Swagger, tests unitaires.',
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: false,
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Swagger']
      },
      {
        title: 'Application Mobile',
        description: 'Application mobile cross-platform avec React Native',
        content: 'Application mobile développée avec React Native pour iOS et Android. Fonctionnalités : navigation, géolocalisation, notifications push, intégration API.',
        type: 'manual',
        category: 'personal',
        status: 'active',
        featured: false,
        technologies: ['React Native', 'TypeScript', 'Firebase', 'Google Maps API']
      },
      {
        title: 'Dashboard Analytics',
        description: 'Tableau de bord avec visualisations de données interactives',
        content: 'Dashboard web avec graphiques interactifs développé avec React et D3.js. Visualisation de données en temps réel, filtres dynamiques, export PDF.',
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        technologies: ['React', 'D3.js', 'Chart.js', 'TypeScript', 'REST API']
      }
    ];

    for (const project of demoProjects) {
      const { technologies, ...projectData } = project;
      
      const createdProject = await prisma.project.upsert({
        where: { title: project.title },
        update: projectData,
        create: {
          ...projectData,
          startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Date aléatoire dans l'année passée
        },
      });

      // Associer les technologies
      for (const techName of technologies) {
        const technology = await prisma.technology.findFirst({
          where: { name: techName }
        });
        
        if (technology) {
          await prisma.projectTechnology.upsert({
            where: {
              projectId_technologyId: {
                projectId: createdProject.id,
                technologyId: technology.id
              }
            },
            update: {},
            create: {
              projectId: createdProject.id,
              technologyId: technology.id
            }
          });
        }
      }
    }

    // 4. Ajouter des configurations du site
    console.log('⚙️ Configuration du site...');
    
    const siteConfigs = [
      {
        key: 'hero_title',
        value: 'Elyes Ghouaiel',
        description: 'Titre principal de la page d\'accueil'
      },
      {
        key: 'hero_subtitle',
        value: 'Développeur Full-Stack & Créateur d\'Expériences Numériques',
        description: 'Sous-titre de la page d\'accueil'
      },
      {
        key: 'hero_description',
        value: 'Passionné par les technologies web modernes, je crée des applications performantes et des expériences utilisateur exceptionnelles. Spécialisé en React, Next.js, Node.js et bien plus.',
        description: 'Description de la page d\'accueil'
      },
      {
        key: 'contact_email',
        value: 'elyesghouaiel@gmail.com',
        description: 'Email de contact principal'
      },
      {
        key: 'github_url',
        value: 'https://github.com/ElyesGhouaiel',
        description: 'URL du profil GitHub'
      },
      {
        key: 'linkedin_url',
        value: 'https://linkedin.com/in/elyes-ghouaiel',
        description: 'URL du profil LinkedIn'
      }
    ];

    for (const config of siteConfigs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config,
      });
    }

    console.log('✅ Base de données peuplée avec succès !');
    console.log('📊 Statistiques :');
    
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.projectTechnology.count(),
      prisma.siteConfig.count(),
    ]);
    
    console.log(`   - Projets : ${stats[0]}`);
    console.log(`   - Technologies : ${stats[1]}`);
    console.log(`   - Associations projet-technologie : ${stats[2]}`);
    console.log(`   - Configurations : ${stats[3]}`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
seedDatabase(); 