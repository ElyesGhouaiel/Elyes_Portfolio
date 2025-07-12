// Configuration de l'application
export const config = {
  // Limites d'upload
  upload: {
    maxFileSize: 1000 * 1024 * 1024, // 100MB par défaut
    maxFileSizeMB: 1000,
    allowedTypes: ['.zip', 'application/zip'],
  },
  
  // Configuration GitHub
  github: {
    maxRepos: 100,
    syncInterval: 3600, // 1 heure en secondes
  },
  
  // Configuration de l'interface
  ui: {
    projectsPerPage: 12,
    maxTechnologiesDisplay: 6,
  }
}

// Fonction utilitaire pour formater la taille des fichiers
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Fonction pour vérifier si un fichier est valide
export function isValidFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type
  const isValidType = config.upload.allowedTypes.some(type => 
    file.type === type || file.name.endsWith(type)
  )
  
  if (!isValidType) {
    return { 
      valid: false, 
      error: `Seuls les fichiers ZIP sont acceptés.` 
    }
  }
  
  // Vérifier la taille
  if (file.size > config.upload.maxFileSize) {
    return { 
      valid: false, 
      error: `Le fichier est trop volumineux (${config.upload.maxFileSizeMB}MB maximum).` 
    }
  }
  
  return { valid: true }
} 