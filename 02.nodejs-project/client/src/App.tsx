import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Book } from "./types/book";
import axios from "axios";
import { BASE_URL } from "./constant";
import { FaTrashAlt } from "react-icons/fa";

type ParamsType = {
  sort?: string;
  order?: string;
  search?: string;
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [params, setParams] = useState<ParamsType>({
    sort: "title",
    order: "asc",
    search: "",
  });

  // SEARCH (debounce)
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, search }));
    }, 500);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      setError(message);
    }
  };

  // FETCH + SORT + SEARCH
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/books`, {
        params,
      });

      setBooks(response.data.data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [params]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-xl font-semibold">
  //       Loading...
  //     </div>
  //   );
  // }



  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold">Error: {error}</p>
        <button
          onClick={() => {
            setError("");
            fetchBooks();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📚 Book List
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="search"
            placeholder="Search books..."
            onChange={(e) => {
              handleSearch(e);
              setInputValue(e.target.value);
            }}
            value={inputValue}
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={`${params.sort}-${params.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split("-");
              setParams((prev) => ({ ...prev, sort, order }));
            }}
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title-asc">Title ↑</option>
            <option value="title-desc">Title ↓</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>

        {books.length === 0 && (
          <p className="text-center text-red-500 font-medium">
            No books found
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500 font-medium">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex items-center justify-between bg-gray-50 border rounded-xl p-4 hover:shadow transition"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {book.title}, ${book.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                </div>

                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:text-red-700 transition text-xl"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        )}


      </div>
    </div>
  );
}

export default App;