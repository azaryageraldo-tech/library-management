import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 4 }}>Profile Settings</Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
              src={user?.avatar}
            />
            <Button variant="outlined" component="label">
              Change Avatar
              <input type="file" hidden accept="image/*" />
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Change Password</Typography>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  margin="normal"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
              >
                Save Changes
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;