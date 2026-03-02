const express = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const USERNAME = 'muradsma_db_user'
const PW = 'Z08hIzZ99GYHkJED'
const DB_URL = 'mongodb+srv://muradsma_db_user:Z08hIzZ99GYHkJED@cluster0.25bei1b.mongodb.net/BooksProject?appName=Cluster0'



// book schema

const BookSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    author: String,
    stock: Number
}, { timestamps: true})


const BookModel = mongoose.model('Book', BookSchema)


//get all data
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

//get data by id
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

// delete data bu id
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params 
        const deletedBook = await BookModel.findByIdAndDelete(id) 

        if(!deletedBook){
            return res.status(404).json({
                message: 'Book not found or already deleted',
                success: false
            }) 
        }

        res.status(200).json({
            message: 'Book deleted successfully',
            data: deletedBook
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

mongoose.connect(DB_URL)
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}, link: http://localhost:8080/`)
})