const express = require('express')
const router = express.Router()
const genreController = require('../controllers/genreController')

router.get('/', genreController.getAllGenres )  
router.get('/:id', genreController.getGenreById )
router.get('/:genreId/books', genreController.getBooksByGenreId )
router.delete('/:id', genreController.deleteGenreById )
router.post('/', genreController.addNewGenre ) 
router.put('/:id', genreController.updateGenreById ) 


module.exports = router