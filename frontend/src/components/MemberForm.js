import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';
import { memberService } from '../services/api';

const MemberForm = ({ open, handleClose, member, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    active: true
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        active: true
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (member) {
        await memberService.updateMember(member.id, formData);
      } else {
        await memberService.createMember(formData);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Phone"
            margin="normal"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {member ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MemberForm;