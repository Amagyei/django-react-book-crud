import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Add a new book
  const addBook = async () => {
    try {
      if (!releaseDate) {
        console.error("Release date is required in YYYY-MM-DD format.");
        return; // Stop execution if releaseDate is invalid
      }

      const bookData = {
        title: title.trim(), // Ensure title is trimmed
        release_date: releaseDate, // Ensure releaseDate is valid
      };

      console.log("Sending book data:", bookData);

      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Book added successfully:", data);
        setBooks((prevBooks) => [...prevBooks, data]); // Update books list
      } else {
        const error = await response.json();
        console.error("Failed to add book:", error);
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  // Update book title
  const updateTitle = async (pk, releaseDate) => {
    try {
      const bookData = {
        title: newTitle.trim(),
        release_date: releaseDate, // Use existing release date
      };

      console.log("Updating book data:", bookData);

      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Book updated successfully:", data);
        setBooks((prev) =>
          prev.map((book) => (book.id === pk ? { ...book, ...data } : book))
        );
      } else {
        const error = await response.json();
        console.error("Failed to update book:", error);
      }
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "DELETE",
      });


      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  }

  return (
    <>
      <h1>BOOK WEBSITE</h1>

      <div>
        <input
          type="text"
          placeholder="Book title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          placeholder="Release Date"
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      {books.map((book) => (
        <div key={book.id}>
          <h3>Title: {book.title}</h3>
          <p>Release Date: {book.release_date}</p>
          <input
            type="text"
            placeholder="New title..."
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={() => updateTitle(book.id, book.release_date)}>
            Update Book
          </button>
          <button onClick={() => deleteBook(book.id)}>Delete Book </button>
        </div>
      ))}
    </>
  );
}

export default App;