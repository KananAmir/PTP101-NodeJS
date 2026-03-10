const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const bookValidator = require('../middlewares/bookValidator')

router.get('/', bookController.getAllBooks )  
router.get('/:id', bookController.getBookById )
router.delete('/:id', bookController.deleteBookById )
router.post('/', bookValidator, bookController.addNewBook ) 
router.put('/:id', bookValidator, bookController.updateBookById ) 
router.post('/discount/:genreId', bookController.addDiscount)


module.exports = router