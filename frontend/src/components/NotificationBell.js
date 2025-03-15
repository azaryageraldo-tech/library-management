import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  FormControl,
  Select,
  InputLabel,
  Grid
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, updateFilters, filters, markAsRead, clearAll } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: 500,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl size="small" fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="loan">Loans</MenuItem>
                  <MenuItem value="return">Returns</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.read}
                  label="Status"
                  onChange={(e) => handleFilterChange('read', e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="read">Read</MenuItem>
                  <MenuItem value="unread">Unread</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Date</InputLabel>
                <Select
                  value={filters.date}
                  label="Date"
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.read ? 'inherit' : 'action.hover',
                whiteSpace: 'normal'
              }}
            >
              <Box>
                <Typography variant="body1">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;