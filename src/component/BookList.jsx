import React, { useEffect, useState } from 'react';
import BookDetailModal from './BookDetailModal.jsx';
import { fetchBooks } from '../api/index.js';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchAndSetBooks = async () => {
      const data = await fetchBooks();
      if (data) {
        let readStatus = {};
        try {
          readStatus = JSON.parse(localStorage.getItem('readStatus') ?? '{}');
        } catch (parseError) {
          console.error(
            'Failed to parse readStatus from localStorage:',
            parseError
          );
          readStatus = {};
        }

        const updatedBooks = data.map((book) => ({
          ...book,
          read: readStatus[book.id] ?? false,
        }));
        setBooks(updatedBooks);
      } else {
        console.error('Failed to fetch books or received undefined');
        setBooks([]);
      }
    };

    fetchAndSetBooks();
    setIsDataChanged(false);
  }, [isDataChanged]);

  const toggleBookReadStatus = async (id) => {
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, read: !book.read } : book
    );

    setBooks(updatedBooks);

    const readStatus = JSON.parse(localStorage.getItem('readStatus') ?? '{}');
    readStatus[id] = !readStatus[id];
    localStorage.setItem('readStatus', JSON.stringify(readStatus));
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const getFilteredBooks = (status) => {
    if (status === 'All') return books;
    return books.filter((book) => (status === 'Read' ? book.read : !book.read));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>독서 목록</h1>
      <div style={styles.buttonGroup}>
        {['Read', 'Unread', 'All'].map((status, index) => (
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
        {getFilteredBooks(filterStatus).map((book) => {
          const bookPreview = {
            id: book.id,
            title: book.title,
            coverImage: book.coverImage,
          };
          return (
            <li key={bookPreview.id} style={styles.listItem}>
              <input
                type='checkbox'
                checked={book.read}
                onChange={() => toggleBookReadStatus(book.id)}
                style={{ transform: 'scale(1.5)' }}
              />
              <img
                src={bookPreview.coverImage}
                alt='커버 이미지'
                style={styles.image}
              />
              <h3 style={{ margin: 0 }}>{bookPreview.title}</h3>
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
          );
        })}
      </ul>
      {modalOpen && selectedBook && (
        <div style={styles.modalOverlay}>
          <BookDetailModal
            book={selectedBook}
            onClose={closeModal}
            id={selectedBook.id}
            onReviewChanged={setIsDataChanged}
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
    marginBottom: '50px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  },
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
