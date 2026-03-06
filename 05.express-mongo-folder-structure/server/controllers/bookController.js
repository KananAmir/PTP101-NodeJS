const BookModel = require('../models/bookModel')

const bookController = {
    getAllBooks: async (req, res) => {
        try {

            const { title, author, genreId, sort, orderBy = 'asc' } = req.query


            const filter = {}

            if (title) {
                filter.title = { $regex: title, $options: 'i' }
            }

            if (author) {
                filter.author = { $regex: author, $options: 'i' }
            }

            if (genreId) {
                filter.genre = genreId
            }

            const books = await BookModel.find(filter)
                .populate('genre', 'name')
                .sort({ [sort]: orderBy === 'desc' ? -1 : 1 })

            res.status(200).json({
                message: 'Success',
                data: books
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    getBookById: async (req, res) => {
        try {
            const { id } = req.params
            const book = await BookModel.findById(id)

            if (!book) {
                return res.status(404).json({
                    message: 'Book not found',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Success',
                data: book
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    deleteBookById: async (req, res) => {
        try {
            const { id } = req.params
            const deletedBook = await BookModel.findByIdAndDelete(id)
            const books = await BookModel.find({})

            if (!deletedBook) {
                return res.status(404).json({
                    message: 'Book not found or already deleted',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Book deleted successfully',
                data: deletedBook,
                allBooks: books
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    addNewBook: async (req, res) => {
        // console.log(req.body); 

        try {

            const newBook = new BookModel({
                ...req.body
            })

            await newBook.save()

            res.status(201).json({
                message: 'Book created successfully',
                data: newBook
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    updateBookById: async (req, res) => {
        try {
            const { id } = req.params

            const updatedBook = await BookModel.findByIdAndUpdate(id, { ...req.body }, { new: true })

            if (!updatedBook) {
                return res.status(404).json({
                    message: 'Book not found',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Book updated successfully',
                data: updatedBook
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    }
}



module.exports = bookController
