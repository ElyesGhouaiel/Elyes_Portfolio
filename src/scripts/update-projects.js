const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProjects() {
  console.log('🔄 Mise à jour des projets avec de vrais liens GitHub...');

  try {
    // Mise à jour des projets existants avec de vrais liens GitHub
    const projectUpdates = [
      {
        title: 'Portfolio Moderne',
        githubUrl: 'https://github.com/ElyesGhouaiel/Elyes_Portfolio',
        liveUrl: null, // Sera configuré après déploiement
        demoUrl: null,
        description: 'Portfolio personnel ultra-moderne développé avec Next.js 14, TypeScript et animations 3D avancées'
      },
      {
        title: 'Application E-commerce',
        githubUrl: 'https://github.com/ElyesGhouaiel/ecommerce-app',
        liveUrl: null,
        demoUrl: null,
        description: 'Plateforme e-commerce complète avec React, Node.js, gestion de panier et paiements sécurisés'
      },
      {
        title: 'API REST Moderne',
        githubUrl: 'https://github.com/ElyesGhouaiel/modern-api',
        liveUrl: null,
        demoUrl: null,
        description: 'API RESTful robuste avec Node.js, Express, authentification JWT et documentation complète'
      },
      {
        title: 'Application Mobile',
        githubUrl: 'https://github.com/ElyesGhouaiel/mobile-app',
        liveUrl: null,
        demoUrl: null,
        description: 'Application mobile cross-platform avec React Native, navigation fluide et notifications push'
      },
      {
        title: 'Dashboard Analytics',
        githubUrl: 'https://github.com/ElyesGhouaiel/analytics-dashboard',
        liveUrl: null,
        demoUrl: null,
        description: 'Tableau de bord interactif avec visualisations de données en temps réel et export PDF'
      }
    ];

    // Ajouter de nouveaux projets basés sur de vrais repositories GitHub
    const newProjects = [
      {
        title: 'Gestionnaire de Tâches',
        description: 'Application de gestion de tâches avec interface moderne et synchronisation en temps réel',
        content: 'Gestionnaire de tâches développé avec React et Firebase. Fonctionnalités : création, modification, suppression de tâches, collaboration en équipe, notifications, synchronisation multi-appareils.',
        githubUrl: 'https://github.com/ElyesGhouaiel/task-manager',
        liveUrl: null,
        demoUrl: null,
        type: 'github',
        category: 'professional',
        status: 'active',
        featured: false,
        technologies: ['React', 'Firebase', 'TypeScript', 'Tailwind CSS']
      },
      {
        title: 'Site Web Responsive',
        description: 'Site web vitrine entièrement responsive avec animations CSS et optimisations SEO',
        content: 'Site web moderne développé avec HTML5, CSS3 et JavaScript vanilla. Design responsive, animations fluides, optimisations SEO, lighthouse score 95+.',
        githubUrl: 'https://github.com/ElyesGhouaiel/responsive-website',
        liveUrl: null,
        demoUrl: null,
        type: 'github',
        category: 'professional',
        status: 'active',
        featured: false,
        technologies: ['HTML', 'CSS', 'JavaScript']
      },
      {
        title: 'Chat Application',
        description: 'Application de chat en temps réel avec rooms et messagerie privée',
        content: 'Application de chat développée avec Socket.io et Node.js. Fonctionnalités : chat en temps réel, rooms publiques, messages privés, partage de fichiers, notifications.',
        githubUrl: 'https://github.com/ElyesGhouaiel/chat-app',
        liveUrl: null,
        demoUrl: null,
        type: 'github',
        category: 'personal',
        status: 'active',
        featured: false,
        technologies: ['Node.js', 'Socket.io', 'Express.js', 'MongoDB']
      }
    ];

    // Mettre à jour les projets existants
    for (const update of projectUpdates) {
      await prisma.project.updateMany({
        where: { title: update.title },
        data: {
          githubUrl: update.githubUrl,
          liveUrl: update.liveUrl,
          demoUrl: update.demoUrl,
          description: update.description
        }
      });
      console.log(`   ✅ Projet "${update.title}" mis à jour`);
    }

    // Ajouter les nouveaux projets
    for (const project of newProjects) {
      const { technologies, ...projectData } = project;
      
      const existingProject = await prisma.project.findFirst({
        where: { title: project.title }
      });
      
      if (!existingProject) {
        const createdProject = await prisma.project.create({
          data: {
            ...projectData,
            startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          },
        });

        // Associer les technologies
        for (const techName of technologies) {
          const technology = await prisma.technology.findFirst({
            where: { name: techName }
          });
          
          if (technology) {
            await prisma.projectTechnology.create({
              data: {
                projectId: createdProject.id,
                technologyId: technology.id
              }
            });
          }
        }
        console.log(`   ✅ Nouveau projet "${project.title}" créé`);
      }
    }

    console.log('✅ Projets mis à jour avec succès !');
    
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
    ]);
    
    console.log(`📊 Statistiques finales :`);
    console.log(`   - Projets total : ${stats[0]}`);
    console.log(`   - Technologies : ${stats[1]}`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des projets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateProjects(); 