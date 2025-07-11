const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function syncRealGitHubRepos() {
  console.log('🔄 Synchronisation des vrais repositories GitHub...');
  
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  
  if (!token || !username) {
    console.error('❌ Variables d\'environnement manquantes');
    return;
  }
  
  try {
    // Supprimer les anciens projets GitHub (garder seulement les manuels)
    await prisma.project.deleteMany({
      where: { type: 'github' }
    });
    console.log('🗑️ Anciens projets GitHub supprimés');
    
    // Récupérer les repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sync/1.0'
      }
    });
    
    if (!reposResponse.ok) {
      throw new Error(`Erreur API GitHub: ${reposResponse.status}`);
    }
    
    const repos = await reposResponse.json();
    const activeRepos = repos.filter(repo => !repo.archived && !repo.fork);
    
    console.log(`📦 ${activeRepos.length} repositories actifs trouvés`);
    
    // Définir les descriptions et catégories personnalisées
    const projectDescriptions = {
      'Elyes_Portfolio': {
        description: 'Portfolio personnel ultra-moderne avec Next.js 14, TypeScript et animations 3D',
        category: 'professional',
        featured: true,
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'React', 'Framer Motion']
      },
      'Methodo_Test_Ynov': {
        description: 'Projet de méthodologie de test avec Python - Formation Ynov',
        category: 'personal',
        featured: false,
        technologies: ['Python', 'Testing']
      },
      'SupermarketReceipt-Refactoring-Kata': {
        description: 'Kata de refactoring pour améliorer les compétences de programmation',
        category: 'personal',
        featured: false,
        technologies: ['C#', 'Refactoring', 'Testing']
      },
      'todo-app': {
        description: 'Application de gestion de tâches développée en JavaScript',
        category: 'personal',
        featured: true,
        technologies: ['JavaScript', 'HTML', 'CSS']
      },
      'ynov-graphql-ghouaiel_elyes-chenal_killian': {
        description: 'Projet GraphQL collaboratif - Formation Ynov',
        category: 'professional',
        featured: false,
        technologies: ['JavaScript', 'GraphQL', 'Node.js']
      },
      'my-pwa': {
        description: 'Progressive Web App développée avec les technologies modernes',
        category: 'professional',
        featured: true,
        technologies: ['JavaScript', 'PWA', 'Service Workers']
      },
      'Projet_Annuel': {
        description: 'Projet annuel de développement - Application web complète',
        category: 'professional',
        featured: true,
        technologies: ['JavaScript', 'Web Development']
      },
      'Ghouaiel_Elyes_2023_2024': {
        description: 'Collection de projets académiques IPSSI 2023-2024',
        category: 'personal',
        featured: false,
        technologies: ['JavaScript', 'Academic Projects']
      },
      'Flutter_Project_Beats': {
        description: 'Application mobile développée avec Flutter',
        category: 'professional',
        featured: true,
        technologies: ['Flutter', 'Dart', 'Mobile Development']
      },
      'TEST_Demo_Angular': {
        description: 'Démonstration et tests avec le framework Angular',
        category: 'professional',
        featured: false,
        technologies: ['Angular', 'TypeScript', 'Testing']
      },
      'TP_Solo_Ghouaiel_Elyes': {
        description: 'Travaux pratiques Python - Exercices et solutions',
        category: 'personal',
        featured: false,
        technologies: ['Python', 'Academic']
      },
      'symfony': {
        description: 'Projet développé avec le framework Symfony',
        category: 'professional',
        featured: false,
        technologies: ['PHP', 'Symfony', 'Web Framework']
      },
      'BTS2023': {
        description: 'Projets réalisés durant le BTS SNIR - Technologies variées',
        category: 'personal',
        featured: false,
        technologies: ['Academic Projects', 'BTS SNIR']
      }
    };
    
    let createdCount = 0;
    
    for (const repo of activeRepos) {
      const customInfo = projectDescriptions[repo.name] || {
        description: repo.description || `Projet ${repo.name}`,
        category: 'personal',
        featured: false,
        technologies: [repo.language].filter(Boolean)
      };
      
      try {
        // Créer le projet
        const project = await prisma.project.create({
          data: {
            title: repo.name,
            description: customInfo.description,
            content: `Projet développé avec ${repo.language || 'diverses technologies'}. ${customInfo.description}`,
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || null,
            githubId: repo.id,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            type: 'github',
            category: customInfo.category,
            status: 'active',
            featured: customInfo.featured,
            startDate: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at)
          }
        });
        
        // Associer les technologies
        for (const techName of customInfo.technologies) {
          // Trouver ou créer la technologie
          let technology = await prisma.technology.findFirst({
            where: { name: techName }
          });
          
          if (!technology) {
            technology = await prisma.technology.create({
              data: {
                name: techName,
                category: categorizeTechnology(techName),
                icon: getIconForTechnology(techName),
                color: getColorForTechnology(techName)
              }
            });
          }
          
          // Créer la relation
          await prisma.projectTechnology.create({
            data: {
              projectId: project.id,
              technologyId: technology.id
            }
          });
        }
        
        console.log(`✅ ${repo.name} synchronisé (${customInfo.technologies.length} technologies)`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Erreur pour ${repo.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Synchronisation terminée !`);
    console.log(`📊 ${createdCount} projets synchronisés`);
    
    // Afficher les statistiques
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { type: 'github' } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.technology.count()
    ]);
    
    console.log(`\n📈 Statistiques finales :`);
    console.log(`   - Total projets : ${stats[0]}`);
    console.log(`   - Projets GitHub : ${stats[1]}`);
    console.log(`   - Projets mis en avant : ${stats[2]}`);
    console.log(`   - Technologies : ${stats[3]}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation :', error);
  } finally {
    await prisma.$disconnect();
  }
}

function categorizeTechnology(techName) {
  const categories = {
    'frontend': ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
    'backend': ['Node.js', 'PHP', 'Python', 'Symfony', 'Express.js'],
    'mobile': ['Flutter', 'Dart', 'React Native'],
    'database': ['Prisma', 'MongoDB', 'MySQL', 'PostgreSQL'],
    'tool': ['PWA', 'Service Workers', 'GraphQL', 'Testing', 'Academic', 'Web Development', 'Mobile Development', 'Refactoring'],
    'language': ['C#', 'Python', 'JavaScript', 'TypeScript', 'PHP', 'Dart']
  };
  
  for (const [category, techs] of Object.entries(categories)) {
    if (techs.includes(techName)) {
      return category;
    }
  }
  
  return 'tool';
}

function getIconForTechnology(techName) {
  const icons = {
    'React': '⚛️',
    'Angular': '🅰️',
    'Vue.js': '💚',
    'JavaScript': '🟨',
    'TypeScript': '🔷',
    'Python': '🐍',
    'PHP': '🐘',
    'C#': '🔵',
    'HTML': '🔶',
    'CSS': '🎨',
    'Node.js': '💚',
    'Flutter': '🦋',
    'Dart': '🎯',
    'GraphQL': '📊',
    'PWA': '📱',
    'Symfony': '🎼',
    'Testing': '🧪',
    'Academic': '🎓'
  };
  
  return icons[techName] || '🔧';
}

function getColorForTechnology(techName) {
  const colors = {
    'React': '#61dafb',
    'Angular': '#dd1b16',
    'Vue.js': '#4fc08d',
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'PHP': '#777bb4',
    'C#': '#239120',
    'HTML': '#e34f26',
    'CSS': '#1572b6',
    'Node.js': '#339933',
    'Flutter': '#02569b',
    'Dart': '#0175c2',
    'GraphQL': '#e10098',
    'Symfony': '#000000'
  };
  
  return colors[techName] || '#8b5cf6';
}

// Exécuter la synchronisation
syncRealGitHubRepos(); 