const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

//Fonction signup pour la création d'un compte
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Créer le hash du mot de passe
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé :'}))
                .catch(error => res.status(500).json({ error: error}))
        })
        .catch(error => res.status(500).json({ error: error}))
}

//Fonction login qui vérifie si l'utilisateur est enregistré dans la base de donnée, qui vérifie le mot de passe 
//et gère les eventuelles erreurs rencontrées
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => { 
        if (user === null) {
            res.status(401).json({message: 'Identifiant/mot de passe incorrect'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Identifiant/mot de passe incorrect'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'SECRET_TOKEN',
                            { expiresIn: '24h' }
                        )
                    })
                }
            })
            .catch(error => {
                res.status(500).json( { error })
            })
        }
    })
    .catch(error => {
        res.status(500).json( {error} )
    })
}

//TODO BCRYPT avec le hash des mdp