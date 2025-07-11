const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDemoUrls() {
  try {
    console.log('🚀 Ajout des URLs de démonstration...');

    // Définir les URLs de démonstration pour les projets
    const demoUrls = {
      'Elyes_Portfolio': 'https://elyes-portfolio-sigma.vercel.app/',
      'todo-app': 'https://elyesghouaiel.github.io/todo-app/',
      'my-pwa': 'https://elyesghouaiel.github.io/my-pwa/',
      'Projet_Annuel': 'https://elyesghouaiel.github.io/Projet_Annuel/',
      'TEST_Demo_Angular': 'https://elyesghouaiel.github.io/TEST_Demo_Angular/',
      'Ghouaiel_Elyes_2023_2024': 'https://elyesghouaiel.github.io/Ghouaiel_Elyes_2023_2024/',
      'Flutter_Project_Beats': 'https://github.com/ElyesGhouaiel/Flutter_Project_Beats/releases',
      'symfony': 'https://github.com/ElyesGhouaiel/symfony#readme',
      'ynov-graphql-ghouaiel_elyes-chenal_killian': 'https://github.com/ElyesGhouaiel/ynov-graphql-ghouaiel_elyes-chenal_killian#readme',
      'Methodo_Test_Ynov': 'https://github.com/ElyesGhouaiel/Methodo_Test_Ynov#readme',
      'TP_Solo_Ghouaiel_Elyes': 'https://github.com/ElyesGhouaiel/TP_Solo_Ghouaiel_Elyes#readme',
      'SupermarketReceipt-Refactoring-Kata': 'https://github.com/ElyesGhouaiel/SupermarketReceipt-Refactoring-Kata#readme',
      'BTS2023': 'https://github.com/ElyesGhouaiel/BTS2023#readme'
    };

    // Mettre à jour les projets avec les URLs de démonstration
    for (const [projectTitle, demoUrl] of Object.entries(demoUrls)) {
      const project = await prisma.project.findFirst({
        where: { 
          title: projectTitle 
        }
      });

      if (project) {
        await prisma.project.update({
          where: { id: project.id },
          data: { 
            demoUrl: demoUrl,
            liveUrl: demoUrl.includes('github.io') ? demoUrl : project.liveUrl
          }
        });
        console.log(`✅ ${projectTitle} : ${demoUrl}`);
      } else {
        console.log(`❌ Projet non trouvé: ${projectTitle}`);
      }
    }

    // Statistiques finales
    const totalProjects = await prisma.project.count();
    const projectsWithDemo = await prisma.project.count({
      where: { demoUrl: { not: null } }
    });
    const projectsWithLive = await prisma.project.count({
      where: { liveUrl: { not: null } }
    });

    console.log(`\n📊 Statistiques finales :`);
    console.log(`   - Total projets : ${totalProjects}`);
    console.log(`   - Avec URLs de démonstration : ${projectsWithDemo}`);
    console.log(`   - Avec URLs live : ${projectsWithLive}`);

    await prisma.$disconnect();
    console.log('\n🎉 URLs de démonstration ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des URLs:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

addDemoUrls(); 