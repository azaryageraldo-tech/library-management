import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField
} from '@mui/material';

const ScheduleDialog = ({ open, handleClose, onSchedule }) => {
  const [schedule, setSchedule] = useState({
    frequency: 'daily',
    time: '08:00',
    email: '',
    format: 'pdf'
  });

  const handleChange = (field) => (event) => {
    setSchedule({ ...schedule, [field]: event.target.value });
  };

  const handleSubmit = () => {
    onSchedule(schedule);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Schedule Report</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={schedule.frequency}
                label="Frequency"
                onChange={handleChange('frequency')}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="time"
              label="Time"
              value={schedule.time}
              onChange={handleChange('time')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={schedule.email}
              onChange={handleChange('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Report Format</InputLabel>
              <Select
                value={schedule.format}
                label="Report Format"
                onChange={handleChange('format')}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;