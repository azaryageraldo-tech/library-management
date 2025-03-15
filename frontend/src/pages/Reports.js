import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { loanService } from '../services/api';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LoanReportPDF from '../components/LoanReportPDF';
import { memberService, bookService } from '../services/api';  // Tambahkan import service
import PreviewDialog from '../components/PreviewDialog';
import { saveAs } from 'file-saver';
import PrintableReport from '../components/PrintableReport';
import '../styles/print.css';
import EmailDialog from '../components/EmailDialog';
import { CircularProgress, TablePagination } from '@mui/material';

// Add import
import ScheduleDialog from '../components/ScheduleDialog';
import { Snackbar, Alert } from '@mui/material';

const Reports = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadMembers();
    loadBooks();
    loadCategories();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await memberService.getAllMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await bookService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleExport = () => {
    const dataToExport = loans.map(loan => ({
      'Book Title': loan.book.title,
      'Member Name': loan.member.name,
      'Borrow Date': new Date(loan.borrowDate).toLocaleDateString(),
      'Due Date': new Date(loan.dueDate).toLocaleDateString(),
      'Return Date': loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-',
      'Status': loan.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loans Report");
    XLSX.writeFile(wb, `loans_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Update statistics state
  const [statistics, setStatistics] = useState({
    monthlyLoans: [],
    statusDistribution: [],
    topBooks: [],
    categoryTrends: [] // Add new statistics type
  });
  
  // Add new chart section after existing charts
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {/* ... existing charts ... */}
    
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Category-wise Loan Trends</Typography>
        <BarChart width={1100} height={300} data={statistics.categoryTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentPeriod" name="Current Period" fill="#8884d8" />
          <Bar dataKey="previousPeriod" name="Previous Period" fill="#82ca9d" />
        </BarChart>
      </Paper>
    </Grid>
  
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Popular Categories</Typography>
        <PieChart width={500} height={300}>
          <Pie
            data={statistics.categoryTrends}
            cx={250}
            cy={150}
            labelLine={false}
            label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="total"
          >
            {statistics.categoryTrends.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Paper>
    </Grid>
  </Grid>
  useEffect(() => {
    if (startDate || endDate) {
      const timer = setTimeout(() => {
        loadLoans();
        loadStatistics();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [startDate, endDate, reportType]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoans({
        startDate,
        endDate,
        reportType
      });
      setLoans(response.data || []);
    } catch (error) {
      console.error('Error loading loans:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      // Tambahkan timeout untuk menghindari infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      const response = await Promise.race([
        loanService.getLoanStatistics({ startDate, endDate }),
        timeoutPromise
      ]);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Tambahkan error handling yang lebih baik
      setStatistics({
        monthlyLoans: [],
        statusDistribution: [],
        topBooks: [],
        categoryTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Update the filter section in the return statement
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Loan Reports</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="all">All Loans</MenuItem>
                <MenuItem value="active">Active Loans</MenuItem>
                <MenuItem value="overdue">Overdue Loans</MenuItem>
                <MenuItem value="returned">Returned Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleExport}
              fullWidth
            >
              Export to Excel
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleExportCSV}
              fullWidth
              sx={{ mb: 1 }}
            >
              Export to CSV
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handlePrint}
              fullWidth
              sx={{ mb: 1 }}
              className="no-print"
            >
              Print Report
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePreview}
              fullWidth
              sx={{ mb: 1 }}
            >
              Preview PDF
            </Button>
            <PDFDownloadLink
              document={
                <LoanReportPDF 
                  loans={loans}
                  statistics={statistics}
                  dateRange={{
                    start: startDate ? startDate.toLocaleDateString() : 'All time',
                    end: endDate ? endDate.toLocaleDateString() : 'Present'
                  }}
                />
              }
              fileName={`loan_report_${new Date().toISOString().split('T')[0]}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Generating PDF...' : 'Export to PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
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
              {loans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(loan => {
                  const matchesSearch = searchQuery
                    ? loan.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      loan.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      loan.status.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;

                  const matchesMember = selectedMember
                    ? loan.member.id === selectedMember.id
                    : true;

                  const matchesBook = selectedBook
                    ? loan.book.id === selectedBook.id
                    : true;

                  const matchesCategory = selectedCategory
                    ? loan.book.category.id === selectedCategory.id
                    : true;

                  return matchesSearch && matchesMember && matchesBook && matchesCategory;
                })
                .map((loan) => (
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
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={loans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Loan Trends</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <BarChart width={500} height={300} data={statistics.monthlyLoans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            )}
          </Paper>
        </Grid>
        {/* Apply similar loading state to other charts */}
      </Grid>
    </Container>
  );
};

export default Reports;


  const handleQuickDateFilter = (days) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      setStartDate(start);
      setEndDate(end);
    };
  
    // Tambahkan di dalam Grid container setelah filter existing
    <Grid item xs={12}>
      <Button onClick={() => handleQuickDateFilter(7)} sx={{ mr: 1 }}>
        Last 7 Days
      </Button>
      <Button onClick={() => handleQuickDateFilter(30)} sx={{ mr: 1 }}>
        Last 30 Days
      </Button>
      <Button onClick={() => handleQuickDateFilter(90)}>
        Last 90 Days
      </Button>
    </Grid>
  const handleExportCSV = () => {
    const csvData = loans.map(loan => [
      loan.book.title,
      loan.member.name,
      new Date(loan.borrowDate).toLocaleDateString(),
      new Date(loan.dueDate).toLocaleDateString(),
      loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-',
      loan.status
    ]);

    const header = ['Book Title', 'Member Name', 'Borrow Date', 'Due Date', 'Return Date', 'Status'];
    const csv = [header, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `loans_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSend = async ({ email, attachments }) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('reportType', reportType);
      formData.append('attachments', JSON.stringify(attachments));

      await loanService.sendReportEmail(formData);
      // Add success notification here
    } catch (error) {
      console.error('Error sending email:', error);
      // Add error notification here
    }
  };

  return (
    <Container>
      {/* Add PrintableReport component */}
      <div style={{ display: 'none' }}>
        <PrintableReport
          loans={loans}
          statistics={statistics}
          dateRange={{
            start: startDate ? startDate.toLocaleDateString() : 'All time',
            end: endDate ? endDate.toLocaleDateString() : 'Present'
          }}
        />
      </div>
      <Grid item xs={12} md={3}>
        <Button
          variant="contained"
          color="info"
          onClick={() => setEmailDialogOpen(true)}
          fullWidth
          sx={{ mb: 1 }}
        >
          Email Report
        </Button>
      </Grid>

      {/* Add EmailDialog component */}
      <EmailDialog
        open={emailDialogOpen}
        handleClose={() => setEmailDialogOpen(false)}
        onSend={handleEmailSend}
      />
      <Grid item xs={12} md={3}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setScheduleDialogOpen(true)}
          fullWidth
          sx={{ mb: 1 }}
        >
          Schedule Report
        </Button>
      </Grid>

      {/* Add ScheduleDialog component */}
      <ScheduleDialog
        open={scheduleDialogOpen}
        handleClose={() => setScheduleDialogOpen(false)}
        onSchedule={handleSchedule}
      />
      {/* Tambahkan di bagian return sebelum penutup Container */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      {/* ... rest of the code ... */}
    </Container>
  );
// Remove duplicate export
// Keep only the first export default Reports that appears earlier in the file
