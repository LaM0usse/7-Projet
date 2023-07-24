const sharp = require('sharp')
const fs = require('fs').promises

// Fonction pour redimensionner une image
async function resizeImage(imagePath, destination, filename) {
  try {
    // Redimensionnement de l'image avec une largeur de 600
    const resizedImageBuffer = await sharp(imagePath)
      .resize({ width: 600 })
      .toBuffer()

    const resizedImagePath = `${destination}/resized_${filename}`
    await fs.writeFile(resizedImagePath, resizedImageBuffer)

    // Suppression de l'image originale après le redimensionnement
    await fs.unlink(imagePath)
    return resizedImagePath
  } catch (error) {
    throw new Error('Erreur lors du redimensionnement de l\'image : ' + error.message)
  }
}

module.exports = {resizeImage}