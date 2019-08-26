import axios from 'axios';
import store from '../store';

import { baseUrl, numResults } from '../../util/defaultAxiosConfig';
import {
  sortBooksById,
  sanitizeBookData,
  unique
} from '../../util/helperFunctions';

import {
  SHOW_ALL_BOOKS,
  GET_ALL_BOOKS,
  ADD_BOOKS,
  DELETE_BOOKS,
  SEARCH_FOR_BOOKS,
  SUGGEST_BOOK,
  DELETE_BOOK_BY_ID,
  NEXT_PAGE,
  PREVIOUS_PAGE,
  GET_BOOKS_THIS_PAGE,
  OP_FAILED
} from '../types/libraryActions';

export function getAllBooks() {
  return axios
    .get(`${baseUrl}/library/${numResults}`)
    .then((res) => {
      if (res.status === 200 && res.data && res.data.length) {
        const allBooks = sanitizeBookData(sortBooksById(res.data));
        const action = {
          type: GET_ALL_BOOKS,
          payload: allBooks
        };
        store.dispatch(action);
      }
    })
    .catch((err) => {
      console.log('Error getting all books: ', err);
      const action = {
        type: GET_ALL_BOOKS,
        payload: []
      };
      store.dispatch(action);
      store.dispatch({ type: OP_FAILED, payload: err });
    });
}

export function addBooks(bookArr) {
  return axios
    .post(`${baseUrl}/library/`, { books: bookArr })
    .then((res) => {
      if (res.status === 200 && res.data === 'successfully added books') {
        console.log(`SUCCESS! Added ${bookArr.length} books.`);
        const addedBooks = sanitizeBookData(sortBooksById(bookArr));
        const action  = {
          type: ADD_BOOKS,
          payload: addedBooks
        };
        store.dispatch(action);
        getAllBooks();
      }
    })
    .catch((err) => {
      console.log('Error adding books: ', err);
      const action  = {
        type: ADD_BOOKS,
        payload: []
      };
      store.dispatch(action);
      store.dispatch({ type: OP_FAILED, payload: err });
    });
}

export function removeBooks(params) {
  const { title, author } = params;
  return axios.delete(
    `${baseUrl}/library/deleteBy/?title=${title}&author=${author}`)
    .then((res) => {
      if (res.status === 200 && res.data) {
        console.log(`SUCCESS! Deleted ${res.data.length} books.`);
        const removedBooks = res.data;
        const action  = {
          type: DELETE_BOOKS,
          payload: removedBooks 
        };
        store.dispatch(action);
        getAllBooks();
      }
    })
    .catch((err) => {
      console.log('Error deleting books: ', err);
      store.dispatch({ type: OP_FAILED, payload: err });
    })
}

export function editBook(book) {
  const id = book.id;
  return axios.put(`${baseUrl}/library/update/${id}`, book)
  .then((res) => {
    if (res.status === 200 && res.data) {
      console.log(`SUCCESS! Book with id ${id} updated.`);
      getAllBooks();
    }
  })
  .catch((err) => {
    console.log('Error editing book: ', err);
    store.dispatch({ type: OP_FAILED, payload: err });
  });
}

export function searchForBooks(params) {
  const { title, author } = params;
  return axios.get(
    `${baseUrl}/library/searchBy/?title=${title}&author=${author}`)
  .then((res) => {
    if (res.status === 200 && res.data) {
      let matchingBooks = unique(res.data.filter((e) => typeof e !== 'string'));
      const action  = {
        type: SEARCH_FOR_BOOKS,
        payload: matchingBooks 
      };
      store.dispatch(action);
    }
  })
  .catch((err) => {
    console.log('Error searching for books: ', err);
    store.dispatch({ type: OP_FAILED, payload: err });
  })
}

export function suggestBook() {
  return axios.get(`${baseUrl}/library/random`)
  .then((res) => {
    if (res.data && res.data.length) {
      console.log(`SUCCESS! Got a book with the id ${res.data[0].id}.`);
      const action  = {
        type: SUGGEST_BOOK,
        payload: res.data 
      };
      store.dispatch(action);
    }
  })
  .catch((err) => {
    console.log('Error suggesting book: ', err);
    store.dispatch({ type: OP_FAILED, payload: err });
  })
}

export function deleteBookById(id) {
  return axios.delete(`${baseUrl}/library/deleteById/${id}`)
  .then((res) => {
    console.log(`SUCCESS! Deleted book with id "${id}".`);
    const action  = {
      type: DELETE_BOOK_BY_ID,
      payload: [res.data] 
    };
    store.dispatch(action);
    getAllBooks();
  })
  .catch((err) => {
    console.log('Error deleting book: ', err);
    store.dispatch({ type: OP_FAILED, payload: err });
  })
}

export const nextPage = () => {
  const action  = {
    type: NEXT_PAGE
  };
  store.dispatch(action);
  getBooksThisPage();
};

export const previousPage = () => {
  const action  = {
    type: PREVIOUS_PAGE
  };
  store.dispatch(action); 
  getBooksThisPage();
};

export const getBooksThisPage = () => {
  const action  = {
    type: GET_BOOKS_THIS_PAGE
  };
  store.dispatch(action);
};

export const showAllBooks = () => {
  const action  = {
    type: SHOW_ALL_BOOKS
  };
  store.dispatch(action);
};