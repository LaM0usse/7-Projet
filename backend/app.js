const express = require('express')
const connectMongo = require('./utils/connect.mongo')
const cors = require('cors')
const path = require('path') //Module de chemin de NodeJS
const bodyParser = require('body-parser') //Middleware qui traite les données body des requêtes HTTP
const helmet = require('helmet');
const rateLimiter = require("./utils/rate.limiter")
require('dotenv').config() //Pour lire le fichier .env

const bookRoutes = require('./routes/book.routes')
const userRoutes = require('./routes/user.routes')

connectMongo() //Connexion à la base de données MongoDB

const app = express()//Création application express


app.use(express.static('public'))
app.use(rateLimiter)
app.use(cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", "example.com"],
    },
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app

//TODO Connexion à MONGODB
//TODO helmet et ratelimiter et .env