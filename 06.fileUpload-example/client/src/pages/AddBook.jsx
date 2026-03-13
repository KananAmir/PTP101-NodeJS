import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function AddBook() {

  const [book, setBook] = useState({
    title: '',
    price: 0,
    stock: 0,
    description: '',
    language: '',
    author: '',
    genre: '',
    coverImageURL: null
  })

  const [genres, setGenres] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(book);
      const formData = new FormData();
      formData.append('title', book.title);
      formData.append('author', book.author);
      formData.append('price', book.price);
      formData.append('stock', book.stock);
      formData.append('description', book.description);
      formData.append('language', book.language);
      formData.append('genre', book.genre);
      formData.append('coverImageURL', book.coverImageURL);

      const response = await axios.post('http://localhost:8080/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })


      if (response.status === 201) {
        toast.success('Book added successfully!');
        console.log(response);
      } else {

        toast.error(response.message || 'Failed to add book. Please try again.');
      }


    } catch (error) {

      const message =
        error.response?.data?.message || "Failed to add book. Please try again.";
      console.log(message);
      toast.error(message || 'Failed to add book. Please try again.');

    }
  }

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await axios('http://localhost:8080/api/genres')
        console.log(response.data);
        setGenres(response.data.data);

      }
      catch (error) {
        console.log(error.message);
      }
    }

    getGenres();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Add Book
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Row 1: Title & Author */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => {
                  setBook({ ...book, title: e.target.value })
                }}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => {
                  setBook({ ...book, author: e.target.value })
                }}
              />
            </div>
          </div>

          {/* Row 2: Cover Image & Genre */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <input
                type="file"
                id="coverImageURL"
                name="coverImageURL"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 bg-white"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  setBook({ ...book, coverImageURL: e.target.files[0] })
                }}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <select
                name="genre"
                id="genre"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => {
                  setBook({ ...book, genre: e.target.value })
                }}
              >
                {/* <option value="fiction">Fiction</option>
                <option value="fantasy">Fantasy</option>
                <option value="history">History</option>
                <option value="science">Science</option> */}
                {genres.map((genre) => {
                  return <option value={genre._id} key={genre._id}>{genre.name}</option>
                })}
              </select>
            </div>
          </div>

          {/* Row 3: Price & Stock */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => {
                  setBook({ ...book, price: parseFloat(e.target.value) || 0 })
                }}

              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => {
                  setBook({ ...book, stock: parseInt(e.target.value) || 0 })
                }}
              />
            </div>
          </div>

          {/* Row 4: Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <input
              type="text"
              id="lang"
              name="lang"
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => {
                setBook({ ...book, language: e.target.value })
              }}
            />
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => {
                setBook({ ...book, description: e.target.value })
              }}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            Add Book
          </button>
        </form>

        <Toaster />

      </div>
    </div>
  );
}

export default AddBook;