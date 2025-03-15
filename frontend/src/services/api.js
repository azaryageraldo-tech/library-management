import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  getAllBooks: () => api.get('/books'),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (book) => api.post('/books', book),
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

export const memberService = {
  getAllMembers: () => api.get('/members'),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (member) => api.post('/members', member),
  updateMember: (id, member) => api.put(`/members/${id}`, member),
  deleteMember: (id) => api.delete(`/members/${id}`),
};

export const loanService = {
  getAllLoans: () => api.get('/loans'),
  getLoan: (id) => api.get(`/loans/${id}`),
  createLoan: (loan) => api.post('/loans', loan),
  returnBook: (id) => api.put(`/loans/${id}/return`),
};

export const userService = {
  getUsers: () => axios.get('/api/users'),
  createUser: (data) => axios.post('/api/users', data),
  updateUser: (id, data) => axios.put(`/api/users/${id}`, data),
  deleteUser: (id) => axios.delete(`/api/users/${id}`)
};

export default api;