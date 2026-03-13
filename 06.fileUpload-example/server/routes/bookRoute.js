const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const bookValidator = require('../middlewares/bookValidator')
// const uploadBookImage = require('../middlewares/multerMiddleware')
const uploadBookImage = require('../middlewares/uploadBookImage')

router.get('/', bookController.getAllBooks)
router.get('/:id', bookController.getBookById)
router.delete('/:id', bookController.deleteBookById)
// router.post('/', bookValidator, bookController.addNewBook ) 
router.post('/', uploadBookImage.single('coverImageURL'), bookValidator, bookController.addNewBook)
router.put('/:id', uploadBookImage.single('coverImageURL'), bookValidator, bookController.updateBookById)
router.post('/discount/:genreId', bookController.addDiscount)


module.exports = router