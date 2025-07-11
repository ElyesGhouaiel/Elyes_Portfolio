// Test simple de l'API GitHub
async function testGitHubAPI() {
  console.log('🔄 Test de l\'API GitHub...');
  
  // Récupérer les variables d'environnement
  require('dotenv').config();
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN manquant dans .env');
    return;
  }
  
  if (!username) {
    console.error('❌ GITHUB_USERNAME manquant dans .env');
    return;
  }
  
  try {
    console.log(`📡 Test pour l'utilisateur: ${username}`);
    
    // Test 1: Informations utilisateur
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Test/1.0'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Erreur utilisateur: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userInfo = await userResponse.json();
    console.log(`👤 Utilisateur trouvé: ${userInfo.name || userInfo.login}`);
    console.log(`📊 Repositories publics: ${userInfo.public_repos}`);
    
    // Test 2: Repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Test/1.0'
      }
    });
    
    if (!reposResponse.ok) {
      throw new Error(`Erreur repositories: ${reposResponse.status} ${reposResponse.statusText}`);
    }
    
    const repos = await reposResponse.json();
    console.log(`📦 Repositories trouvés: ${repos.length}`);
    
    console.log('\n📋 Vos repositories:');
    repos.filter(repo => !repo.archived).forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.name}`);
      console.log(`   📝 ${repo.description || 'Aucune description'}`);
      console.log(`   🌟 ${repo.stargazers_count} stars | 🔀 ${repo.forks_count} forks`);
      console.log(`   💻 ${repo.language || 'Langage non spécifié'}`);
      console.log(`   🔗 ${repo.html_url}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter le test
testGitHubAPI(); 