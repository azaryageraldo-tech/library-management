import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  TablePagination
} from '@mui/material';
import { bookService } from '../services/api';
import BookForm from '../components/bookform';
import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error loading books',
        severity: 'error'
      });
    }
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setOpenForm(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setOpenForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, bookId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.deleteBook(deleteDialog.bookId);
      loadBooks();
      setDeleteDialog({ open: false, bookId: null });
      setNotification({
        open: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error deleting book',
        severity: 'error'
      });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true :
      statusFilter === 'available' ? book.available :
      !book.available;
    
    return matchesSearch && matchesStatus;
  });
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedBooks = filteredBooks.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Modify the table to use pagination
  const handleExport = () => {
    const dataToExport = sortedBooks.map(book => ({
      Title: book.title,
      Author: book.author,
      ISBN: book.isbn,
      Status: book.available ? 'Available' : 'Borrowed'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");
    XLSX.writeFile(wb, "books_report.xlsx");
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Books Management</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search books..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="borrowed">Borrowed</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New Book
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleExport}
          startIcon={<DownloadIcon />}
        >
          Export to Excel
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'author'}
                  direction={orderBy === 'author' ? order : 'asc'}
                  onClick={() => handleSort('author')}
                >
                  Author
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isbn'}
                  direction={orderBy === 'isbn' ? order : 'asc'}
                  onClick={() => handleSort('isbn')}
                >
                  ISBN
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.available ? 'Available' : 'Borrowed'}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary" onClick={() => handleEdit(book)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDeleteClick(book.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      <BookForm 
        open={openForm}
        handleClose={() => setOpenForm(false)}
        book={selectedBook}
        onSuccess={loadBooks}
      />
      
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Book"
        message="Are you sure you want to delete this book?"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ open: false, bookId: null })}
      />
      
      <Notification 
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};

export default Books;