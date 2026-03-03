const express = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

const app = express()
const port = 8080


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.json()) // for parsing application/json

// book schema
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        author: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        genre: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        coverImageURL: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        sold: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true, versionKey: false }
);

const BookModel = mongoose.model('Book', bookSchema)


//get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await BookModel.find({})

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
})

//get book by id
app.get('/api/books/:id', async (req, res) => {
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
})

// delete book bu id
app.delete('/api/books/:id', async (req, res) => {
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
})

// create new book
app.post('/api/books', async (req, res) => {
    // console.log(req.body);

    try {
        const { title, description, price, author, stock, genre, language, coverImageURL } = req.body
        if (!title || !description || !price || !author || !stock || !genre || !language || !coverImageURL) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            })
        }
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
})

// update book
app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params

        const { title, description, price, author, stock, genre, language, coverImageURL } = req.body

        if (!title || !description || !price || !author || !stock || !genre || !language || !coverImageURL) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            })
        }

        const updatedBook = await BookModel.findByIdAndUpdate(id, { ...req.body }, { new: true})

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
})

const PW = process.env.PASSWORD
const DB_URL = process.env.DB_URL

 
mongoose.connect(DB_URL.replace('<db_password>', PW))
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}, link: http://localhost:8080/`)
})