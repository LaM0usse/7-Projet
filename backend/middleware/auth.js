const jwt = require('jsonwebtoken')
 
module.exports = (req, res, next) => {
   try {
        //Récupération du Token d'authentification
       const token = req.headers.authorization.split(' ')[1]
        //Utilisation de 'Verify' qui permet de vérifier le token de manière sécurisée
       const decodedToken = jwt.verify(token, 'SECRET_TOKEN')
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       }
	next()
   } catch(error) {
       res.status(401).json({ error: "Authentification échouée" })
   }
}

//TODO token jwt