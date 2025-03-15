import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, Box,
  TablePagination, TableSortLabel, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { memberService } from '../services/api';
import MemberForm from '../components/MemberForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openForm, setOpenForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, memberId: null });
  // Hapus deklarasi searchQuery yang kedua

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await memberService.getAllMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setOpenForm(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setOpenForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, memberId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await memberService.deleteMember(deleteDialog.memberId);
      loadMembers();
      setDeleteDialog({ open: false, memberId: null });
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true :
      statusFilter === 'active' ? member.active : !member.active;
    
    return matchesSearch && matchesStatus;
  });

  const sortedMembers = filteredMembers.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Members Management</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search members..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary" onClick={() => handleEdit(member)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDeleteClick(member.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
      
      <MemberForm 
        open={openForm}
        handleClose={() => setOpenForm(false)}
        member={selectedMember}
        onSuccess={loadMembers}
      />
      
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Member"
        message="Are you sure you want to delete this member?"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ open: false, memberId: null })}
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

export default Members;