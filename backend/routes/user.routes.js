const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user.controllers')

//Requête POST pour connexion et inscription de l'utilisateur
router.post('/signup', userControllers.signup)
router.post('/login', userControllers.login)

module.exports = router