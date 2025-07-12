const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = 'elyesghouaiel@gmail.com'
    const password = 'Poussin06700**'
    
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'admin',
          name: 'Elyes Ghouaiel'
        }
      })
      console.log('✅ Utilisateur admin mis à jour avec succès!')
    } else {
      // Créer un nouvel utilisateur admin
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'admin',
          name: 'Elyes Ghouaiel'
        }
      })
      console.log('✅ Utilisateur admin créé avec succès!')
    }
    
    console.log('📧 Email:', email)
    console.log('🔑 Mot de passe:', password)
    console.log('👤 Rôle: admin')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser() 