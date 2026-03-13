const BookModel = require('../models/bookModel')
const cloudinary = require("cloudinary").v2;

const bookController = {
    getAllBooks: async (req, res) => {
        try {

            const { title, author, genreId, sort, orderBy = 'asc', page, limit } = req.query


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

            const totalBooks = await BookModel.countDocuments(filter)


            const books = await BookModel.find(filter)
                .populate('genre', 'name')
                .sort({ [sort]: orderBy === 'desc' ? -1 : 1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))

            res.status(200).json({
                message: 'Success',
                data: books,
                total: totalBooks,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(totalBooks / limit)
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
            await cloudinary.uploader.destroy(deletedBook.public_id)
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
            console.log(req.file);

            // const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`
            const imageUrl = req.file.path
            console.log(imageUrl);

            const newBook = new BookModel({
                ...req.body,
                coverImageURL: imageUrl,
                public_id: req.file.filename
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

            const book = await BookModel.findById(req.params.id)

            if (!book) {
                return res.status(404).json({ message: "Book not found" })
            }
            let updatedData = { ...req.body }
            if (req.file) {

                await cloudinary.uploader.destroy(book.public_id)

                updatedData.coverImageURL = req.file.path
                updatedData.public_id = req.file.filename

            }

            const updatedBook = await BookModel.findByIdAndUpdate(id, updatedData, { new: true })



            // if (!updatedBook) {
            //     return res.status(404).json({
            //         message: 'Book not found',
            //         success: false
            //     })
            // }

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
    },
    addDiscount: async (req, res) => {
        try {
            const { genreId } = req.params
            const { discount } = req.body
            await BookModel.updateMany({
                genre: {
                    _id: genreId
                }
            },
                { $set: { discount: 10 } })

            res.status(200).json({
                message: 'Discount added successfully'
            })
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    }
}



module.exports = bookController



// total: 100
// limit: 10

// page: 1 -> 1-10
// page: 2 -> 11-20
// page: 3 -> 21-30
// page: 4 -> 31-40