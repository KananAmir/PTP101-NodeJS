import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Book } from "./types/book";
import axios from "axios";
import { BASE_URL } from "./constant";
import { FaTrashAlt } from "react-icons/fa";

type ParamsType = {
  sort?: string;
  order?: string;
  search?: string;
  page?: number;
  limit?: number;
};

type PaginationType = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [params, setParams] = useState<ParamsType>({
    sort: "",
    order: "",
    search: "",
    page: 1,
    limit: 5,
  }); 

  // SEARCH (debounce)
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // axtarış dəyişdi -> page 1
      setParams((prev) => ({ ...prev, search, page: 1 }));
    }, 500);
  };

  // SORT dəyişəndə page 1
  const handleSortChange = (value: string) => {
    const [sort, order] = value.split("-");
    setParams((prev) => ({ ...prev, sort, order, page: 1 }));
  };

  // LIMIT dəyişəndə page 1
  const handleLimitChange = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  // PAGE dəyiş
  const goToPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));

      // Siləndən sonra səhifə boş qalarsa, əvvəlki səhifəyə keç (optional, yaxşı UX)
      // Misal: son səhifədə 1 item var idi, sildin -> totalPages azaldı
      setTimeout(() => {
        fetchBooks();
      }, 0);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
    }
  };

  // FETCH + SORT + SEARCH + PAGINATION
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/books`, { params });

      setBooks(response.data.data);

      // backend qaytarır: pagination { page, limit, total, totalPages }
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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

  // səhifə düymələri (1..totalPages) çox olarsa kəsə bilərik
  const pages = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  );

  console.log('pages', pages); // [1, 2, 3, 4, 5] (məsələn)
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📚 Book List
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title-asc">Title ↑</option>
            <option value="title-desc">Title ↓</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>

          <select
            value={params.limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>3 / page</option>
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
          </select>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <p>
            Total: <span className="font-semibold">{pagination.total}</span>
          </p>
          <p>
            Page:{" "}
            <span className="font-semibold">
              {pagination.page} / {pagination.totalPages}
            </span>
          </p>
        </div>

        {books.length === 0 && !loading && (
          <p className="text-center text-red-500 font-medium">No books found</p>
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
                <div className="flex items-center gap-4">
                  <img src={book.coverImageURL} alt={book.title} className="w-16 h-16 object-cover rounded-lg" />
                  <p className="font-semibold text-lg text-gray-800">
                    {book.title},
                  </p>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                  <span className="text-sm font-medium text-gray-700">${book.price.toFixed(2)}</span>
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

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => goToPage(pagination.page - 1)}
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex flex-wrap justify-center gap-2">
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg border transition ${
                    p === pagination.page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => goToPage(pagination.page + 1)}
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;