import React, { useEffect, useState } from 'react';
import BookDetailModal from './BookDetailModal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:4001/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const updateReadStatus = async (id, read) => {
    try {
      const response = await fetch(`http://localhost:4001/books/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === id ? { ...book, read } : book))
        );
      } else {
        console.error('Failed to update read status');
      }
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const toggleBookReadStatus = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      updateReadStatus(id, !book.read);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const updateBookReview = (id, review) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === id ? { ...book, review } : book))
    );
  };

  const getFilteredBooks = (status) => {
    if (!status) return books;
    return books.filter((book) => (status === 'Read' ? book.read : !book.read));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>독서 목록</h1>

      <div style={styles.buttonGroup}>
        {['Read', 'Unread', null].map((status, index) => (
          <button
            key={index}
            onClick={() => setFilterStatus(status)}
            style={{
              ...styles.button,
              backgroundColor: filterStatus === status ? '#007BFF' : '#f0f0f0',
              color: filterStatus === status ? '#fff' : '#000',
            }}
          >
            {status === 'Read'
              ? '읽은 책만 보기'
              : status === 'Unread'
              ? '읽지 않은 책만 보기'
              : '모든 책 보기'}
          </button>
        ))}
      </div>

      <ul style={styles.list}>
        {getFilteredBooks(filterStatus).map((book) => (
          <li key={book.id} style={styles.listItem}>
            <input
              type='checkbox'
              checked={book.read}
              onChange={() => toggleBookReadStatus(book.id)}
              style={{ transform: 'scale(1.5)' }}
            />
            <img src={book.coverImage} alt='커버 이미지' style={styles.image} />
            <h3 style={{ margin: 0 }}>{book.title}</h3>
            <button
              onClick={() => openModal(book)}
              style={{
                ...styles.button,
                backgroundColor: '#007BFF',
                color: '#fff',
              }}
            >
              상세 보기
            </button>
          </li>
        ))}
      </ul>

      {modalOpen && selectedBook && (
        <div style={styles.modalOverlay}>
          <BookDetailModal
            book={selectedBook}
            onClose={closeModal}
            updateBookReview={updateBookReview}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', marginBottom: '20px' },
  buttonGroup: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: { padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
  },
  image: {
    width: '150px',
    height: '200px',
    borderRadius: '5px',
    objectFit: 'cover',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};
export default BookList;
