const BookModel = require('../models/Book.model')
const fs = require('fs')
const sharpUtils = require('../utils/sharp')

// Fonction création d'un livre
exports.createBook = async (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id
  delete bookObject._userId

  const imagePath = `${req.file.destination}/${req.file.filename}`
  try {
    //Appeler la fonction de redimensionnement de l'image
    const resizedImagePath = await sharpUtils.resizeImage(imagePath, req.file.destination, req.file.filename)
    //Mettre à jour l'URL de l'image dans la base de données avec le chemin de l'image redimensionnée
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`

    const book = new BookModel({
      ...bookObject,
      userId: req.auth.userId,
    })
    await book.save();
    res.status(201).json({ message: 'Objet enregistré !' })
  } catch (error) {
    console.error('Erreur lors de la création du livre :', error)
    res.status(400).json({ error: error.message })
  }
}

//Fonction modification d'un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  } : { ...req.body }
  delete bookObject._userId //Par mesure de sécurité, on utilise l'id de notre JWT et non celui de base

  BookModel.findOne({ _id: req.params.id }) //Pour trouver le bon livre
    .then((book) => {
      if (book.userId != req.auth.userId) { //Vérification de l'utilisateur
        res.status(400).json({ message: 'Modification non autorisée' })
      } else {
        //Permet de supprimer l'ancienne image par le remplacement de la nouvelle image
        let oldImage = book.imageUrl.split('/images/')[1]
        if (oldImage && req.file && book.imageUrl) {
          fs.unlink(`images/${oldImage}`, (error) => {
            if (error) {
              return res.status(500).json({ message: "Erreur survenue lors de la suppression de l'image." });
            }
          })
        }
        BookModel.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
          .catch(error => res.status(401).json({ error: error }))
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error })
    })
}

//Fonction suppression d'un livre
exports.deleteBook = (req, res, next) => {
  BookModel.findOne({ _id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'Suppression non autorisée'})
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          BookModel.deleteOne({_id: req.params.id})
          .then(() => { res.status(200).json({message: 'Livre supprimé avec succès !'})})
          .catch(error => res.status(401).json({ error: error}))
        })
      }
    })
    .catch( error => {
      res.status(500).json({ error: error })
    })
}

//Fonction récupérer un livre
exports.getOneBook = (req, res, next) => {
  BookModel.findOne({ _id: req.params.id })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json({ error: error }))
}

//Fonction récupérer tout les livres
exports.getAllBooks = (req, res, next) => {
  BookModel.find()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json({ error: error }))
}

//Fonction de notation d'un livre
exports.ratingBook = (req, res) => {
  const bookId = req.params.id
  const userId = req.auth.userId;

  BookModel.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre introuvable'})
      }
      //Vérification d'une note existante par l'utilisateur ou non
      const ratingList = book.ratings.find((rating) => rating.userId === userId)
      if (ratingList){
        return res.status(401).json({ message: 'Note déjà existante'})
      }
      book.ratings = [...book.ratings, { userId, grade: req.body.rating }]
      book.averageRating = (book.ratings.reduce((total, rating) => total + rating.grade, 0) / book.ratings.length)
      book.averageRating = book.averageRating.toFixed(1)

      return book.save()
    })
    .then((updateBook) => {res.status(200).json(updateBook)})
    .catch((error) => {
      res.status(500).json({ error: error })
    })
}

//Fonction récupérer les 3 meilleurs livres pour les afficher
exports.getBestBooks = (req, res, next) => {
  // Effectue la requête à la base de données pour obtenir les livres triés par note décroissante
  BookModel.find()
    .sort({ averageRating: -1 }) //Permet de prendre les livres les mieux notés
    .limit(3) //Seulement 3 livres affichés
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error: error }))
}

//TODO Fonction CRUD