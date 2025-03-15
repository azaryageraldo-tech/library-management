import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from '@mui/material';
import { userService } from '../services/api';
import UserForm from '../components/UserForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error loading users',
        severity: 'error'
      });
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      loadUsers();
      setNotification({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error deleting user',
        severity: 'error'
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>User Management</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        user={selectedUser}
        onSuccess={loadUsers}
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

export default Users;