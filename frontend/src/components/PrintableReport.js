import React from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow 
} from '@mui/material';

const PrintableReport = ({ loans, statistics, dateRange }) => {
  return (
    <div className="print-container">
      <Typography variant="h4" gutterBottom>Loan Report</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Period: {dateRange.start} - {dateRange.end}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book Title</TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Borrow Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.book.title}</TableCell>
              <TableCell>{loan.member.name}</TableCell>
              <TableCell>{new Date(loan.borrowDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>{loan.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" sx={{ mt: 4 }}>Summary</Typography>
      <Typography>Total Loans: {loans.length}</Typography>
      <Typography>Active Loans: {loans.filter(l => l.status === 'BORROWED').length}</Typography>
      <Typography>Overdue Loans: {loans.filter(l => l.status === 'OVERDUE').length}</Typography>
    </div>
  );
};

export default PrintableReport;