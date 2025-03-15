import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';

const EmailDialog = ({ open, handleClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [includeAttachments, setIncludeAttachments] = useState({
    excel: true,
    pdf: false,
    csv: false
  });

  const handleSend = () => {
    onSend({ email, attachments: includeAttachments });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send Report via Email</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAttachments.excel}
                    onChange={(e) => setIncludeAttachments(prev => ({
                      ...prev,
                      excel: e.target.checked
                    }))}
                  />
                }
                label="Include Excel Report"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAttachments.pdf}
                    onChange={(e) => setIncludeAttachments(prev => ({
                      ...prev,
                      pdf: e.target.checked
                    }))}
                  />
                }
                label="Include PDF Report"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAttachments.csv}
                    onChange={(e) => setIncludeAttachments(prev => ({
                      ...prev,
                      csv: e.target.checked
                    }))}
                  />
                }
                label="Include CSV Report"
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;