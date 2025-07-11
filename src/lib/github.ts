export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  default_branch: string
  archived: boolean
  private: boolean
}

export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

export class GitHubService {
  private token: string
  private username: string
  private baseUrl = 'https://api.github.com'

  constructor(token?: string, username?: string) {
    this.token = token || process.env.GITHUB_TOKEN || ''
    this.username = username || process.env.GITHUB_USERNAME || ''
    
    if (!this.token) {
      console.warn('GitHub token not provided. API calls will be limited.')
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Moderne/1.0'
    }

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      next: { revalidate: 3600 } // Cache pour 1 heure
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUserInfo(): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${this.username}`)
  }

  async getRepositories(includePrivate = false): Promise<GitHubRepo[]> {
    let endpoint = `/users/${this.username}/repos?per_page=100&sort=updated`
    
    if (includePrivate && this.token) {
      endpoint = `/user/repos?per_page=100&sort=updated&visibility=all`
    }

    const repos = await this.makeRequest<GitHubRepo[]>(endpoint)
    
    // Filtrer les repositories archivés si souhaité
    return repos.filter(repo => !repo.archived)
  }

  async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await this.makeRequest<{ content: string, encoding: string }>(`/repos/${owner}/${repo}/readme`)
      
      if (response.encoding === 'base64') {
        return atob(response.content)
      }
      
      return response.content
    } catch (error) {
      console.warn(`README not found for ${owner}/${repo}`)
      return null
    }
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      return this.makeRequest<Record<string, number>>(`/repos/${owner}/${repo}/languages`)
    } catch (error) {
      console.warn(`Languages not found for ${owner}/${repo}`)
      return {}
    }
  }

  async getRepositoryTopics(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await this.makeRequest<{ names: string[] }>(`/repos/${owner}/${repo}/topics`)
      return response.names || []
    } catch (error) {
      console.warn(`Topics not found for ${owner}/${repo}`)
      return []
    }
  }

  // Méthode pour obtenir des informations complètes sur un repository
  async getRepositoryDetails(owner: string, repo: string) {
    const [repoInfo, readme, languages, topics] = await Promise.allSettled([
      this.makeRequest<GitHubRepo>(`/repos/${owner}/${repo}`),
      this.getRepositoryReadme(owner, repo),
      this.getRepositoryLanguages(owner, repo),
      this.getRepositoryTopics(owner, repo)
    ])

    return {
      repo: repoInfo.status === 'fulfilled' ? repoInfo.value : null,
      readme: readme.status === 'fulfilled' ? readme.value : null,
      languages: languages.status === 'fulfilled' ? languages.value : {},
      topics: topics.status === 'fulfilled' ? topics.value : []
    }
  }

  // Méthode pour analyser les technologies utilisées
  analyzeRepositoryTechnologies(languages: Record<string, number>, topics: string[]): string[] {
    const technologies = new Set<string>()

    // Ajouter les langages principaux
    Object.keys(languages).forEach(lang => technologies.add(lang))

    // Mapper les topics vers des technologies connues
    const techMapping: Record<string, string> = {
      'react': 'React',
      'nextjs': 'Next.js',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'nodejs': 'Node.js',
      'express': 'Express.js',
      'mongodb': 'MongoDB',
      'postgresql': 'PostgreSQL',
      'mysql': 'MySQL',
      'redis': 'Redis',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes',
      'aws': 'AWS',
      'vercel': 'Vercel',
      'tailwindcss': 'Tailwind CSS',
      'bootstrap': 'Bootstrap',
      'sass': 'Sass',
      'webpack': 'Webpack',
      'vite': 'Vite',
      'prisma': 'Prisma',
      'graphql': 'GraphQL',
      'rest-api': 'REST API'
    }

    topics.forEach(topic => {
      const tech = techMapping[topic.toLowerCase()]
      if (tech) {
        technologies.add(tech)
      }
    })

    return Array.from(technologies)
  }

  // Déterminer la catégorie d'un projet
  determineProjectCategory(repo: GitHubRepo, topics: string[]): 'professional' | 'personal' {
    const professionalKeywords = ['company', 'work', 'client', 'enterprise', 'business', 'commercial']
    const personalKeywords = ['personal', 'learning', 'experiment', 'tutorial', 'practice', 'hobby']

    const repoText = `${repo.name} ${repo.description || ''} ${topics.join(' ')}`.toLowerCase()

    const isProfessional = professionalKeywords.some(keyword => repoText.includes(keyword))
    const isPersonal = personalKeywords.some(keyword => repoText.includes(keyword))

    if (isProfessional) return 'professional'
    if (isPersonal) return 'personal'

    // Par défaut, considérer comme personnel si c'est un fork ou un repository personnel
    return repo.full_name.startsWith(this.username) ? 'personal' : 'professional'
  }
} 