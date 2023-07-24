const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")

//Modèle d'un utilisateur (email, mot de passe)
const userSchema = mongoose.Schema({
    //"Unique: true" permet de ne pas s'inscrire plusieurs fois avec la même adresse
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)

//TODO Utilisateur unique :true + Plugin uniqueValidator