import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Books() {

  const [books, setBooks] = useState([])


  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/books/${id}`);
      console.log(response.data);
      setBooks(books.filter(book => book._id !== id));
      setBooks(response.data.allBooks)

    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }
  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books')
        setBooks(response.data.data)
      }
      catch (err) {
        console.error(err.message)
      }
    }
    getBooks()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >

            <img
              src={book.coverImageURL}
              alt={book.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {book.title}
              </h3>

              <p className="text-gray-600">
                {book.author}
              </p>
            </div>

            <button
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 cursor-pointer"
              onClick={() => {
                deleteBook(book._id)
              }}
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Books