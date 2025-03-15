import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { loanService, bookService, memberService } from '../services/api';

const LoanForm = ({ open, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: '',
  });
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadBooks();
    loadMembers();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data.filter(book => book.available));
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadMembers = async () => {
    try {
      const response = await memberService.getAllMembers();
      setMembers(response.data.filter(member => member.active));
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const book = books.find(b => b.id === formData.bookId);
      const member = members.find(m => m.id === formData.memberId);
      
      await loanService.createLoan({
        book: book,
        member: member
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Loan</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Book</InputLabel>
              <Select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                label="Book"
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title} - {book.author}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel>Member</InputLabel>
              <Select
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                label="Member"
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name} - {member.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.bookId || !formData.memberId}
          >
            Create Loan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanForm;