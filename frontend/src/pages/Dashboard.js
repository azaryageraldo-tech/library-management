import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { bookService, memberService, loanService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, color }) => (
  <Paper elevation={3} sx={{ p: 3, bgcolor: color }}>
    <Typography variant="h6" color="white">{title}</Typography>
    <Typography variant="h3" color="white">{value}</Typography>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalMembers: 0,
    activeLoans: 0
  });

  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    loadStats();
    loadMonthlyStats();
  }, []);

  const loadStats = async () => {
    try {
      const [books, members, loans] = await Promise.all([
        bookService.getAllBooks(),
        memberService.getAllMembers(),
        loanService.getAllLoans()
      ]);

      setStats({
        totalBooks: books.data.length,
        availableBooks: books.data.filter(book => book.available).length,
        totalMembers: members.data.length,
        activeLoans: loans.data.filter(loan => loan.status === 'BORROWED').length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const loans = await loanService.getAllLoans();
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      const monthlyData = last6Months.map(month => ({
        name: month,
        loans: loans.data.filter(loan => {
          const loanMonth = new Date(loan.borrowDate).toLocaleString('default', { month: 'short' });
          return loanMonth === month;
        }).length
      }));

      setMonthlyStats(monthlyData);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Books"
            value={stats.availableBooks}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Loans"
            value={stats.activeLoans}
            color="#f44336"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Loans</Typography>
            <BarChart width={500} height={300} data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loans" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Books Status</Typography>
            <BarChart width={500} height={300} data={[
              { name: 'Books Status', available: stats.availableBooks, borrowed: stats.totalBooks - stats.availableBooks }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" fill="#4caf50" />
              <Bar dataKey="borrowed" fill="#f44336" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;