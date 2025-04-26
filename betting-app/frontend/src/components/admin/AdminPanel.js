import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost/betting-app/api';
const ADMIN_TOKEN = 'admin_token_123'; // In a real app, this would be securely stored

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    winner_id: '',
    score: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/events.php?status=upcoming`);
      if (res.data.success) {
        setEvents(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = async (event) => {
    setSelectedEvent(event);
    try {
      const res = await axios.get(`${API_URL}/events.php?id=${event.id}`);
      if (res.data.success) {
        setParticipants(res.data.data.participants || []);
        setOpenDialog(true);
      } else {
        setError(res.data.message || 'Failed to fetch event details');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      winner_id: '',
      score: ''
    });
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.winner_id || !formData.score) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        `${API_URL}/admin.php?action=update_result`,
        {
          event_id: selectedEvent.id,
          winner_id: formData.winner_id,
          score: formData.score
        },
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`
          }
        }
      );

      if (res.data.success) {
        setSuccess('Result updated successfully! All bets have been processed.');
        // Remove this event from the list
        setEvents(events.filter(e => e.id !== selectedEvent.id));
      } else {
        setError(res.data.message || 'Failed to update result');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage events and update results
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No upcoming events to manage.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/"
          >
            Back to Home
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{formatDate(event.event_date)}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleEventSelect(event)}
                    >
                      Update Result
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Match Result</DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          ) : (
            <>
              <DialogContentText>
                Enter the result for: <strong>{selectedEvent?.title}</strong>
              </DialogContentText>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="winner-label">Winner</InputLabel>
                <Select
                  labelId="winner-label"
                  id="winner_id"
                  name="winner_id"
                  value={formData.winner_id}
                  label="Winner"
                  onChange={handleInputChange}
                  disabled={submitting}
                >
                  {participants.map((participant) => (
                    <MenuItem key={participant.id} value={participant.id}>
                      {participant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                id="score"
                name="score"
                label="Score (e.g., 2-1)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.score}
                onChange={handleInputChange}
                disabled={submitting}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Result'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
