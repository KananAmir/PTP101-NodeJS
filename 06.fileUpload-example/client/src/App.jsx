
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import AddBook from './pages/AddBook'
import Books from './pages/Books'

function App() {

  return (
    <>
      <header className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Books</Link>
        </h1>

        <nav className="flex gap-6">
          <Link
            to="/"
            className="hover:text-yellow-400 transition"
          >
            Books
          </Link>

          <Link
            to="/add"
            className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition"
          >
            Add Book
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<Books />} />
        <Route path='/add' element={<AddBook />} />
      </Routes>
    </>
  )
}

export default App
