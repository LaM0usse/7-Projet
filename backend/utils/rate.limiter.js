const rateLimit = require('express-rate-limit') //Limiteur de nombre de connexion

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 100, //Nombre maximal de requêtes autorisées par fenêtre
})

module.exports = limiter