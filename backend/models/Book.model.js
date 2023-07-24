const mongoose = require('mongoose')

//Modèle d'un livre (titre, auteur, id, image...)
const BookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author : { type: String, required: true },
  year : { type: Number, required: true },
  imageUrl: { type: String, required: true },
  genre : { type: String, required: true },
  ratings: [{
    userId : { type: String, required: true },
    grade: { type: Number, required: true},
  }],
  averageRating: { type: Number, required: true},
})

module.exports = mongoose.model('Book', BookSchema)