// src/BookDetailModal.js
import React, { useState } from 'react';

const BookDetailModal = ({ book, onClose, updateBookReview }) => {
  const [review, setReview] = useState(book.review || '');

  const saveReview = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:4001/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review }),
      });

      if (response.ok) {
        updateBookReview(book.id, review);
        alert('리뷰가 저장되었습니다.');
      } else {
        alert('리뷰 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className='modal'
      style={{
        position: 'absolute',
        top: '100px',
        backgroundColor: '#FFEFD5',
        width: '700px',
        height: 'auto',
        borderRadius: '12px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <h2>{book.title}</h2>
      <p>{book.description}</p>
      <img
        src={book.coverImage}
        style={{ width: '300px', height: '400px' }}
        alt='Book Cover'
      />
      <p>장르: {book.genre}</p>

      <form
        onSubmit={saveReview}
        style={{
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          type='text'
          value={review}
          placeholder='한 줄 평을 써주세요'
          onChange={(e) => setReview(e.target.value)}
          style={{
            width: '500px',
            height: '40px',
            borderRadius: '12px',
            padding: '10px',
            marginBottom: '10px',
          }}
        />
        <button
          type='submit'
          style={{
            width: '200px',
            height: '40px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        >
          저장
        </button>
      </form>

      <button
        onClick={onClose}
        style={{
          width: '200px',
          height: '40px',
          backgroundColor: '#FF6347',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        닫기
      </button>
    </div>
  );
};

export default BookDetailModal;
