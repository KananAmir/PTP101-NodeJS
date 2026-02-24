const express = require('express')
const { nanoid } = require('nanoid')
const cors = require('cors')
const app = express()
const port = 8080


const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}

// middleware
app.use(express.json())
app.use(cors(corsOptions))

const books = require('./data')

//get all data
app.get('/api/books', (req, res) => {
  try {
    console.log('query', req.query);

    const { search = '' } = req.query

    let filteredBooks = books.filter((book) => book.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      || book.author.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

    res.status(200).json({
      data: filteredBooks,
      message: 'Books retrieved successfully',
      success: true,
      error: null
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})

//get single data by id
app.get('/api/books/:id', (req, res) => {
  // console.log('req params ', req.params);
  try {
    const { id } = req.params
    const book = books.find((book) => book.id === id)

    if (!book) {
      return res.status(404).json({
        data: null,
        message: 'Book not found',
      })
    }

    res.status(200).json({
      data: book,
      message: 'Book retrieved successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }

})

//delete data by id
app.delete('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params

    const idx = books.findIndex((book) => book.id === id)


    if (idx === -1) {
      return res.status(404).json({
        message: 'Book not found',
      })
    }

    const deletedBook = books.splice(idx, 1)

    res.status(200).json({
      message: 'Book deleted successfully',
      deletedBook: deletedBook[0],
      updatedBooks: books
    })


  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})

//create new data
app.post('/api/books', (req, res) => {
  try {
    const { title, author, price, description, stock, genre, language, coverImageURL } = req.body

    if (!title || !author || !price || !description || !stock || !genre || !language || !coverImageURL) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }
    const newBook = {
      id: nanoid(8),
      ...req.body
    }

    const updatedBooks = [...books, newBook]
    // books.push(newBook)

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook,
      updatedBooks: updatedBooks
    })

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})

//update data by id
app.put('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, author, price, description, stock, genre, language, coverImageURL } = req.body
    const idx = books.findIndex((book) => book.id === id)

    if (!title || !author || !price || !description || !stock || !genre || !language || !coverImageURL) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    if (idx === -1) {
      return res.status(404).json({
        message: 'Book not found',
      })
    }

    // books[idx] = {
    //   id,
    //   title,
    //   author,
    //   price,
    //   description,
    //   stock,
    //   genre,
    //   language,
    //   coverImageURL,
    // }

    books[idx] = {
      id,
      ...req.body
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book: books[idx],
      updatedBooks: books
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})

// edit data by id (partial update)
app.patch('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params

    const { title, author, price, description, stock, genre, language, coverImageURL } = req.body
    const idx = books.findIndex((book) => book.id === id)


    if (idx === -1) {
      return res.status(404).json({
        message: 'Book not found',
      })

    }

    const updatedBook = {
      id,
      ...req.body
    }

    if (!title) {
      updatedBook.title = books[idx].title
    }
    if (!author) {
      updatedBook.author = books[idx].author
    }
    if (!price) {
      updatedBook.price = books[idx].price
    }
    if (!description) {
      updatedBook.description = books[idx].description
    }
    if (!stock) {
      updatedBook.stock = books[idx].stock
    }
    if (!genre) {
      updatedBook.genre = books[idx].genre
    }
    if (!language) {
      updatedBook.language = books[idx].language
    }
    if (!coverImageURL) {
      updatedBook.coverImageURL = books[idx].coverImageURL
    }

    books[idx] = updatedBook

    res.status(200).json({
      message: 'Book updated successfully',
      book: books[idx],
      updatedBooks: books
    })


  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}, url: http://localhost:${port}`);
})
