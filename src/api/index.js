const BASE_URL = 'http://localhost:4000';

// 서버에서 모든 책 데이터 가져오기
export const fetchBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

// 서버에서 특정 책 데이터 가져오기
export const fetchBookDetail = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
  }
};

// 책 데이터 업데이트 하기
export const updateBook = async (id, review) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ review }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error, time: data.time };
    }
    return data;
  } catch (error) {
    console.error('Error updating book', error);
    throw new Error(`Failed to fetch Book ${id}`);
  }
};

// 새로운 책 추가하기
export const addBook = async (title, description, genre, coverImage) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, genre, coverImage }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error, time: data.time };
    }
    return data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error(`Failed to add Book`);
  }
};
