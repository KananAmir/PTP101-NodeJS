
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import './App.css'
import type { Book } from './types/book'
import axios from 'axios'
import { BASE_URL } from './constant'
import { FaTrashAlt } from "react-icons/fa";


function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  // const [searchQuery, setSearchQuery] = useState<string>('')


  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current)
    }
    try {

      timeout.current = setTimeout(async () => {
        const query = e.target.value.toLowerCase()
        const response = await axios(`${BASE_URL}/books?search=${query}`)

        console.log(response.data);

        setBooks(response.data.data)
      }, 500)


    }
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error searching books:', errorMessage);
      setError(errorMessage)
    }
  }


  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/books/${id}`)

      console.log(response.status);

      if (response.status === 200) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Error deleting book:', errorMessage);
      setError(errorMessage)

    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios(`${BASE_URL}/books`)
      console.log(response.data);
      setBooks(response.data.data)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching books:', errorMessage);
      setError(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])


  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}
      <button onClick={() => {
        setError('')
        setLoading(true)
        fetchBooks()
      }}>
        Retry
      </button>
    </p>
  }

  // if (books.length === 0 && !loading) {
  //   return <>
  //     <p>No books available</p>
  //     <button onClick={() => {
  //       setError('')
  //       setLoading(true)
  //       fetchBooks()
  //     }}>
  //       Refresh
  //     </button>
  //   </>
  // }


  return (
    <>
      <h1>Book List</h1>

      <div>
        {/* <input type="search" name="search" id="search" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> */}
        <input type="search" name="search" id="search" placeholder="Search books..." onChange={handleSearch} />
      </div>
      {books.length === 0 ? <p style={{
        color: 'red'
      }}>No books found</p> : null}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <p>{book.title} <span><i>by {book.author}</i></span>


              <button style={{
                color: 'red'
              }}
                onClick={() => handleDelete(book.id)}
              >
                <FaTrashAlt />
              </button>

            </p>

          </li>
        ))}
      </ul>

    </>
  )
}

export default App
