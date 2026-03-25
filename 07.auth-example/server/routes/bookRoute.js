const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const bookValidator = require('../middlewares/validateBook')
// const uploadBookImage = require('../middlewares/multerMiddleware')
const uploadBookImage = require('../middlewares/uploadBookImage')
const { authenticate, authorize } = require('../middlewares/authMiddleware')

router.get('/', bookController.getAllBooks) 
router.get('/:id', authenticate, authorize("user", "admin"), bookController.getBookById)
router.delete('/:id', authenticate, authorize("admin"), bookController.deleteBookById)
router.post('/', authenticate, authorize("moderator", "admin"), uploadBookImage.single('coverImageURL'), bookValidator, bookController.addNewBook)
router.put('/:id', authenticate, authorize("moderator", "admin"), uploadBookImage.single('coverImageURL'), bookValidator, bookController.updateBookById)
router.post('/discount/:genreId', authenticate, authorize("admin"), bookController.addDiscount)


module.exports = router 