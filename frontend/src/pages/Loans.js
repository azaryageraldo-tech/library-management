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
  Paper 
} from '@mui/material';
import { loanService } from '../services/api';
import LoanForm from '../components/LoanForm';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const response = await loanService.getAllLoans();
      setLoans(response.data);
    } catch (error) {
      console.error('Error loading loans:', error);
    }
  };

  const handleReturn = async (id) => {
    try {
      await loanService.returnBook(id);
      loadLoans();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Loans Management</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenForm(true)}>
        New Loan
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.book?.title}</TableCell>
                <TableCell>{loan.member?.name}</TableCell>
                <TableCell>{new Date(loan.borrowDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>
                  {loan.status === 'BORROWED' && (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleReturn(loan.id)}
                    >
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <LoanForm 
        open={openForm}
        handleClose={() => setOpenForm(false)}
        onSuccess={loadLoans}
      />
    </Container>
  );
};

export default Loans;