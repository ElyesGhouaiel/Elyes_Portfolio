import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

interface ProjectAnalysis {
  description: string
  technologies: string[]
  mainFiles: string[]
  readmeContent?: string
  packageJson?: any
  requirements?: string[]
  previewFiles: string[]
}

interface TechnologyInfo {
  name: string
  category: string
  confidence: number
}

// Technologies connues avec leurs patterns
const KNOWN_TECHNOLOGIES: Record<string, TechnologyInfo> = {
  // Frontend
  'React': { name: 'React', category: 'frontend', confidence: 0.9 },
  'Vue.js': { name: 'Vue.js', category: 'frontend', confidence: 0.9 },
  'Angular': { name: 'Angular', category: 'frontend', confidence: 0.9 },
  'Next.js': { name: 'Next.js', category: 'frontend', confidence: 0.9 },
  'TypeScript': { name: 'TypeScript', category: 'language', confidence: 0.8 },
  'JavaScript': { name: 'JavaScript', category: 'language', confidence: 0.7 },
  'HTML': { name: 'HTML', category: 'frontend', confidence: 0.6 },
  'CSS': { name: 'CSS', category: 'frontend', confidence: 0.6 },
  'Tailwind CSS': { name: 'Tailwind CSS', category: 'frontend', confidence: 0.8 },
  'Bootstrap': { name: 'Bootstrap', category: 'frontend', confidence: 0.8 },
  'Sass': { name: 'Sass', category: 'frontend', confidence: 0.8 },

  // Backend
  'Python': { name: 'Python', category: 'backend', confidence: 0.9 },
  'Node.js': { name: 'Node.js', category: 'backend', confidence: 0.9 },
  'Express.js': { name: 'Express.js', category: 'backend', confidence: 0.8 },
  'Django': { name: 'Django', category: 'backend', confidence: 0.9 },
  'Flask': { name: 'Flask', category: 'backend', confidence: 0.8 },
  'FastAPI': { name: 'FastAPI', category: 'backend', confidence: 0.8 },
  'Java': { name: 'Java', category: 'backend', confidence: 0.9 },
  'C#': { name: 'C#', category: 'backend', confidence: 0.9 },
  'PHP': { name: 'PHP', category: 'backend', confidence: 0.8 },

  // Base de données
  'MongoDB': { name: 'MongoDB', category: 'database', confidence: 0.8 },
  'PostgreSQL': { name: 'PostgreSQL', category: 'database', confidence: 0.8 },
  'MySQL': { name: 'MySQL', category: 'database', confidence: 0.8 },
  'SQLite': { name: 'SQLite', category: 'database', confidence: 0.7 },
  'Redis': { name: 'Redis', category: 'database', confidence: 0.8 },

  // Outils
  'Docker': { name: 'Docker', category: 'tool', confidence: 0.8 },
  'Git': { name: 'Git', category: 'tool', confidence: 0.6 },
  'Webpack': { name: 'Webpack', category: 'tool', confidence: 0.8 },
  'Vite': { name: 'Vite', category: 'tool', confidence: 0.8 },
  'npm': { name: 'npm', category: 'tool', confidence: 0.6 },
  'yarn': { name: 'yarn', category: 'tool', confidence: 0.7 },
  'pip': { name: 'pip', category: 'tool', confidence: 0.6 },

  // Cloud
  'AWS': { name: 'AWS', category: 'cloud', confidence: 0.8 },
  'Vercel': { name: 'Vercel', category: 'cloud', confidence: 0.8 },
  'Netlify': { name: 'Netlify', category: 'cloud', confidence: 0.8 },
  'Heroku': { name: 'Heroku', category: 'cloud', confidence: 0.8 },
}

// Patterns pour détecter les technologies
const TECHNOLOGY_PATTERNS = {
  'React': [/react/i, /\.jsx?$/i, /create-react-app/i],
  'Vue.js': [/vue/i, /\.vue$/i, /vue-cli/i],
  'Angular': [/angular/i, /\.ts$/i, /angular\.json/i],
  'Next.js': [/next/i, /next\.config/i],
  'TypeScript': [/typescript/i, /\.ts$/i, /tsconfig\.json/i],
  'JavaScript': [/javascript/i, /\.js$/i, /package\.json/i],
  'HTML': [/\.html?$/i, /<!DOCTYPE html/i],
  'CSS': [/\.css$/i, /\.scss$/i, /\.sass$/i],
  'Tailwind CSS': [/tailwind/i, /@tailwind/i],
  'Bootstrap': [/bootstrap/i, /\.bootstrap/i],
  'Sass': [/\.scss$/i, /\.sass$/i, /@import.*sass/i],
  'Python': [/python/i, /\.py$/i, /requirements\.txt/i, /pyproject\.toml/i],
  'Node.js': [/node/i, /package\.json/i, /\.js$/i],
  'Express.js': [/express/i, /app\.get/i, /app\.post/i],
  'Django': [/django/i, /manage\.py/i, /settings\.py/i],
  'Flask': [/flask/i, /app\.py/i, /from flask import/i],
  'FastAPI': [/fastapi/i, /from fastapi import/i],
  'Java': [/\.java$/i, /\.jar$/i, /pom\.xml/i, /build\.gradle/i],
  'C#': [/\.cs$/i, /\.csproj$/i, /using System/i],
  'PHP': [/\.php$/i, /<?php/i],
  'MongoDB': [/mongodb/i, /mongoose/i, /mongo/i],
  'PostgreSQL': [/postgresql/i, /postgres/i, /pg_/i],
  'MySQL': [/mysql/i, /mysqli/i],
  'SQLite': [/sqlite/i, /\.db$/i],
  'Redis': [/redis/i, /redis-client/i],
  'Docker': [/docker/i, /Dockerfile/i, /docker-compose/i],
  'Git': [/\.git/i, /gitignore/i],
  'Webpack': [/webpack/i, /webpack\.config/i],
  'Vite': [/vite/i, /vite\.config/i],
  'npm': [/package\.json/i, /node_modules/i],
  'yarn': [/yarn\.lock/i, /yarn/i],
  'pip': [/requirements\.txt/i, /pip/i],
  'AWS': [/aws/i, /amazon/i, /s3/i, /ec2/i],
  'Vercel': [/vercel/i, /vercel\.json/i],
  'Netlify': [/netlify/i, /netlify\.toml/i],
  'Heroku': [/heroku/i, /Procfile/i],
}

// Remplacer la fonction extractZip par une version utilisant adm-zip
export async function extractZip(zipPath: string, extractPath: string): Promise<string[]> {
  console.log(`📦 Extraction du ZIP: ${zipPath}`)
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(extractPath, true)
  // Retourne la liste des fichiers extraits
  return zip.getEntries().map(entry => entry.entryName)
}

export async function analyzeProject(extractPath: string): Promise<ProjectAnalysis> {
  console.log(`🔍 Analyse du projet: ${extractPath}`)
  
  const files = await getAllFiles(extractPath)
  const fileContents: Record<string, string> = {}
  
  // Lire les fichiers importants
  for (const file of files) {
    if (isImportantFile(file)) {
      try {
        const content = await readFile(path.join(extractPath, file), 'utf-8')
        fileContents[file] = content
      } catch (error) {
        console.warn(`⚠️ Impossible de lire ${file}:`, error)
      }
    }
  }

  // Analyser les technologies
  const technologies = detectTechnologies(files, fileContents)
  
  // Générer la description
  const description = generateDescription(files, fileContents, technologies)
  
  // Identifier les fichiers principaux
  const mainFiles = identifyMainFiles(files)
  
  // Trouver les fichiers d'aperçu
  const previewFiles = findPreviewFiles(files)

  return {
    description,
    technologies: technologies.map(t => t.name),
    mainFiles,
    readmeContent: fileContents['README.md'] || fileContents['readme.md'],
    packageJson: fileContents['package.json'] ? JSON.parse(fileContents['package.json']) : undefined,
    requirements: fileContents['requirements.txt'] ? fileContents['requirements.txt'].split('\n').filter(line => line.trim()) : undefined,
    previewFiles
  }
}

async function getAllFiles(dir: string, baseDir: string = ''): Promise<string[]> {
  const files: string[] = []
  const items = await readdir(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(baseDir, item.name)
    
    if (item.isDirectory()) {
      // Ignorer certains dossiers
      if (!['node_modules', '.git', '__pycache__', '.vscode', '.idea'].includes(item.name)) {
        const subFiles = await getAllFiles(fullPath, relativePath)
        files.push(...subFiles)
      }
    } else {
      files.push(relativePath)
    }
  }
  
  return files
}

function isImportantFile(filePath: string): boolean {
  const importantExtensions = [
    '.md', '.txt', '.json', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cs', '.php',
    '.html', '.css', '.scss', '.sass', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg'
  ]
  
  const importantFiles = [
    'README.md', 'readme.md', 'package.json', 'requirements.txt', 'pyproject.toml',
    'pom.xml', 'build.gradle', 'Dockerfile', 'docker-compose.yml', 'Makefile',
    'index.html', 'main.py', 'app.py', 'server.js', 'index.js'
  ]
  
  const ext = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath).toLowerCase()
  
  return importantExtensions.includes(ext) || importantFiles.includes(fileName)
}

export function detectTechnologies(files: string[], fileContents: Record<string, string>): TechnologyInfo[] {
  const detected: TechnologyInfo[] = []
  const allContent = Object.values(fileContents).join(' ').toLowerCase()
  
  for (const [techName, techInfo] of Object.entries(KNOWN_TECHNOLOGIES)) {
    const patterns = TECHNOLOGY_PATTERNS[techName as keyof typeof TECHNOLOGY_PATTERNS] || []
    
    // Vérifier les noms de fichiers
    const fileMatch = files.some(file => 
      patterns.some(pattern => pattern.test(file))
    )
    
    // Vérifier le contenu
    const contentMatch = patterns.some(pattern => pattern.test(allContent))
    
    if (fileMatch || contentMatch) {
      detected.push(techInfo)
    }
  }
  
  // Trier par confiance décroissante
  return detected.sort((a, b) => b.confidence - a.confidence)
}

function generateDescription(files: string[], fileContents: Record<string, string>, technologies: TechnologyInfo[]): string {
  const techNames = technologies.map(t => t.name).join(', ')
  const hasFrontend = technologies.some(t => t.category === 'frontend')
  const hasBackend = technologies.some(t => t.category === 'backend')
  const hasDatabase = technologies.some(t => t.category === 'database')
  
  let description = `Projet développé avec ${techNames}.`
  
  if (hasFrontend && hasBackend) {
    description += ' Application web complète avec interface utilisateur et backend.'
  } else if (hasFrontend) {
    description += ' Application frontend avec interface utilisateur moderne.'
  } else if (hasBackend) {
    description += ' Application backend avec logique métier robuste.'
  }
  
  if (hasDatabase) {
    description += ' Intégration de base de données pour la persistance des données.'
  }
  
  // Ajouter des détails basés sur les fichiers
  if (files.some(f => f.includes('api'))) {
    description += ' API REST pour la communication entre services.'
  }
  
  if (files.some(f => f.includes('test'))) {
    description += ' Tests automatisés pour assurer la qualité du code.'
  }
  
  if (files.some(f => f.includes('docker'))) {
    description += ' Containerisation avec Docker pour le déploiement.'
  }
  
  return description
}

function identifyMainFiles(files: string[]): string[] {
  const mainFiles = []
  
  // Chercher les fichiers d'entrée principaux
  const entryFiles = ['index.html', 'main.py', 'app.py', 'server.js', 'index.js', 'main.js', 'App.jsx', 'App.tsx']
  
  for (const entryFile of entryFiles) {
    if (files.includes(entryFile)) {
      mainFiles.push(entryFile)
    }
  }
  
  // Ajouter les fichiers de configuration importants
  const configFiles = ['package.json', 'requirements.txt', 'pyproject.toml', 'Dockerfile']
  
  for (const configFile of configFiles) {
    if (files.includes(configFile)) {
      mainFiles.push(configFile)
    }
  }
  
  return mainFiles.slice(0, 5) // Limiter à 5 fichiers
}

function findPreviewFiles(files: string[]): string[] {
  const previewExtensions = ['.html', '.md', '.txt', '.png', '.jpg', '.jpeg', '.gif', '.svg']
  const previewFiles = []
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (previewExtensions.includes(ext)) {
      previewFiles.push(file)
    }
  }
  
  return previewFiles.slice(0, 10) // Limiter à 10 fichiers
} 