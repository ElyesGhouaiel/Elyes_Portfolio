const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixProjects() {
  console.log('🔧 Nettoyage et correction des projets...');

  try {
    // Supprimer tous les projets sauf le portfolio actuel
    await prisma.project.deleteMany({
      where: {
        NOT: {
          title: 'Portfolio Moderne'
        }
      }
    });

    console.log('✅ Anciens projets supprimés');

    // Mettre à jour le projet Portfolio pour avoir les bonnes informations
    await prisma.project.updateMany({
      where: { title: 'Portfolio Moderne' },
      data: {
        description: 'Portfolio personnel ultra-moderne développé avec Next.js 14, TypeScript, Tailwind CSS et animations 3D avancées',
        content: 'Site vitrine personnel créé avec Next.js 14 et TypeScript. Fonctionnalités : interface moderne avec glassmorphism, animations 3D avec React Three Fiber, intégration GitHub automatique, système d\'administration sécurisé, base de données Prisma, authentification NextAuth.js, design responsive et optimisé pour les performances.',
        githubUrl: 'https://github.com/ElyesGhouaiel/Elyes_Portfolio',
        liveUrl: null,
        demoUrl: null,
        type: 'github',
        category: 'professional',
        status: 'active',
        featured: true
      }
    });

    console.log('✅ Projet Portfolio mis à jour');

    // Créer quelques projets de démonstration sans liens GitHub fictifs
    const demoProjects = [
      {
        title: 'Site Web E-commerce',
        description: 'Plateforme e-commerce moderne avec panier et gestion des commandes',
        content: 'Projet de site e-commerce développé avec les technologies web modernes. Comprend un système de panier, gestion des produits, interface utilisateur responsive et sécurisée.',
        githubUrl: null,
        liveUrl: null,
        demoUrl: null,
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        technologies: ['React', 'Node.js', 'MongoDB', 'Express.js']
      },
      {
        title: 'Application Mobile',
        description: 'Application mobile cross-platform avec React Native',
        content: 'Application mobile développée avec React Native pour iOS et Android. Interface utilisateur moderne, navigation fluide et fonctionnalités avancées.',
        githubUrl: null,
        liveUrl: null,
        demoUrl: null,
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        technologies: ['React Native', 'TypeScript', 'Firebase']
      },
      {
        title: 'API REST',
        description: 'API RESTful avec authentification et base de données',
        content: 'API REST robuste développée avec Node.js et Express. Authentification sécurisée, gestion de base de données et documentation complète.',
        githubUrl: null,
        liveUrl: null,
        demoUrl: null,
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: false,
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT']
      },
      {
        title: 'Dashboard Analytique',
        description: 'Tableau de bord interactif avec visualisations de données',
        content: 'Dashboard moderne avec graphiques interactifs et visualisations de données. Interface utilisateur intuitive et fonctionnalités d\'export.',
        githubUrl: null,
        liveUrl: null,
        demoUrl: null,
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: true,
        technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS']
      },
      {
        title: 'Site Web Vitrine',
        description: 'Site vitrine responsive avec design moderne',
        content: 'Site web vitrine entièrement responsive avec design moderne. Optimisé pour les performances et le SEO.',
        githubUrl: null,
        liveUrl: null,
        demoUrl: null,
        type: 'manual',
        category: 'professional',
        status: 'active',
        featured: false,
        technologies: ['HTML', 'CSS', 'JavaScript', 'SCSS']
      }
    ];

    // Ajouter les nouveaux projets
    for (const project of demoProjects) {
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
        console.log(`   ✅ Projet "${project.title}" créé`);
      }
    }

    console.log('✅ Projets nettoyés et mis à jour avec succès !');
    
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
    ]);
    
    console.log(`📊 Statistiques finales :`);
    console.log(`   - Projets total : ${stats[0]}`);
    console.log(`   - Technologies : ${stats[1]}`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des projets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
fixProjects(); 