const multer = require('multer')

//Extension du fichier des différents formats images
const MIME_TYPES = {
    'image.jpg': 'jpg',
    'image.jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}

//Fonction Storage pour indiquer à multer où enregistrer les images
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //Stockage des images dans le fichier 'images'
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension) //Nom du fichier unique grâce à Date.now()
    }
})

module.exports = multer({ storage }).single('image')