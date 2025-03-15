import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { bookService } from '../services/api';

const BookForm = ({ open, handleClose, book, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    available: true
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        available: true
      });
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (book) {
        await bookService.updateBook(book.id, formData);
      } else {
        await bookService.createBook(formData);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Author"
          fullWidth
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <TextField
          margin="dense"
          label="ISBN"
          fullWidth
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.available}
            label="Status"
            onChange={(e) => setFormData({ ...formData, available: e.target.value })}
          >
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Borrowed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {book ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm;