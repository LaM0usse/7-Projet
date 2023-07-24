const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer.config')
const booksControllers = require('../controllers/book.controllers')


router.get('/', booksControllers.getAllBooks)
router.get('/bestrating', booksControllers.getBestBooks)
router.get('/:id', booksControllers.getOneBook)

router.post('/', auth, multer, booksControllers.createBook)
router.post('/:id/rating', auth, booksControllers.ratingBook)

router.put('/:id', auth, multer, booksControllers.modifyBook)

router.delete('/:id', auth, booksControllers.deleteBook)

module.exports = router

//TODO Middleware Auth